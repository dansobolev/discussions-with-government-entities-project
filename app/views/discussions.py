from aiohttp import web
from aiohttp_security import authorized_userid
from aiohttp_apispec import docs, request_schema, response_schema
from marshmallow import EXCLUDE

from app.auth.permissions import permissions_required, ProjectPermissions
from app.db import db
from app.db.queries import BaseDiscussionQuery,\
    is_user_discussion_participant, get_discussion_by_id, get_user_discussion, get_user_by_login
from app.db.models import Discussion, DiscussionParticipantRelation, Upload, DiscussionComment, User, \
    CommentAttachmentRelation
from app.exceptions import UserAlreadyInDiscussion
from app.utils.utils import object_response
from app.utils.validation import DiscussionSchema, DiscussionCommentSchema, \
    UserParticipantMentioned
from app.uploads import add_entity_attachments

routes = web.RouteTableDef()


@docs(
    tags=['Discussions'],
    summary='Create discussion',
    desciption='Method created discussion with specific name'
)
@request_schema(DiscussionSchema(only=('name',)))
@response_schema(DiscussionSchema())
@routes.post('/discussions')
async def create_discussion(request: web.Request) -> web.Response:
    user_id = await authorized_userid(request)
    if not user_id:
        raise web.HTTPUnauthorized
    data = await request.json()
    validated_data = DiscussionSchema(only=('name',), unknown=EXCLUDE).load(data)
    validated_data.update({'creator_id': user_id})
    discussion = await Discussion(**validated_data).create()
    await discussion.discussion_participant_relation(participant_id=user_id)
    discussion = DiscussionSchema(many=True).dump(await get_user_discussion(discussion.id))
    response = object_response(discussion)
    return web.json_response(response)


@routes.get('/{user_id}/discussions/list', name='user-discussions')
@permissions_required(permissions=[ProjectPermissions.PERM_PROJECT_DISCUSSION_READ])
async def get_user_discussions(request: web.Request) -> web.Response:
    user_id = request.match_info['user_id']

    user_discussions = db.select([
        Discussion.id
    ]).select_from(
        Discussion.outerjoin(DiscussionParticipantRelation)
    ).where(
        DiscussionParticipantRelation.participant_id == user_id
    )

    base_query = BaseDiscussionQuery.select()
    query = base_query.where(Discussion.id.in_(user_discussions))

    loader = BaseDiscussionQuery.loader()
    discussions = await query.gino.load(loader).all()

    discussions = DiscussionSchema(many=True, only=('id', 'name', 'created_at')).dump(discussions)

    response = object_response(discussions)
    return web.json_response(response)


@routes.get('/discussions/list', name='discussions')
@permissions_required(permissions=[ProjectPermissions.PERM_PROJECT_DISCUSSION_READ])
async def get_all_discussions(request: web.Request) -> web.Response:
    query = BaseDiscussionQuery.select()
    loader = BaseDiscussionQuery.loader()
    discussions = await query.gino.load(loader).all()
    discussions = DiscussionSchema(many=True, only=('id', 'name', 'created_at')).dump(discussions)
    response = object_response(discussions)

    return web.json_response(response)


@routes.get('/discussions/{discussion_id}')
@permissions_required(permissions=[ProjectPermissions.PERM_PROJECT_DISCUSSION_READ])
async def get_discussion(request: web.Request) -> web.Response:
    discussion_id = request.match_info['discussion_id']

    base_query = BaseDiscussionQuery.select()
    query = base_query.where(Discussion.id == discussion_id)

    loader = BaseDiscussionQuery.loader()
    discussion = await query.gino.load(loader).all()

    discussion = DiscussionSchema(many=True).dump(discussion)
    response = object_response(discussion)

    return web.json_response(response)


@routes.post('/{discussion_id}/comments')
@permissions_required(permissions=[ProjectPermissions.PERM_PROJECT_DISCUSSION_UPDATE])
async def create_discussion_comment(request: web.Request) -> web.Response:
    user_id = await authorized_userid(request)
    discussion_id = request.match_info['discussion_id']
    discussion = await get_discussion_by_id(discussion_id)
    await is_user_discussion_participant(user_id, discussion)

    comment_data = await request.json()
    validated_data = DiscussionCommentSchema(unknown=EXCLUDE).load(comment_data)
    validated_data.update({'discussion_id': discussion.id})
    discussion_comment = await DiscussionComment(**validated_data).create()

    if 'attachments' in validated_data:
        attachments = validated_data.pop('attachments')
        await add_entity_attachments(discussion_comment, attachments)

    replied_message = DiscussionComment.alias('replied_message_comment')
    query = (db.select([DiscussionComment.
                       outerjoin(CommentAttachmentRelation,
                                 CommentAttachmentRelation.comment_id == DiscussionComment.id).
                       outerjoin(Upload,
                                 CommentAttachmentRelation.upload_id == Upload.id).
                       outerjoin(User, DiscussionComment.author_id == User.id).
                       outerjoin(replied_message,
                                 replied_message.id == DiscussionComment.replied_message_id)]).
             where(DiscussionComment.id == discussion_comment.id))

    loader = (DiscussionComment.distinct(DiscussionComment.id)) \
        .load(add_attachment=Upload.distinct(Upload.id),
              set_author=User.distinct(User.id),
              set_replied_message=replied_message.distinct(replied_message.id))
    discussion_comment = await query.gino.load(loader).all()
    discussion_comment = DiscussionCommentSchema(many=True).dump(discussion_comment)
    response = object_response(discussion_comment)

    return web.json_response(response)


@routes.post('/{discussion_id}/participant')
@permissions_required(permissions=[ProjectPermissions.PERM_PROJECT_DISCUSSION_UPDATE])
async def add_user_participant(request: web.Request) -> web.Response:
    user_id = await authorized_userid(request)
    discussion_id = request.match_info['discussion_id']
    data = await request.json()
    login = data.get('login')
    user_db = await get_user_by_login(login, raise_error=True)
    if await is_user_discussion_participant(user_id=user_db.id, discussion=discussion_id, raise_error=False):
        raise UserAlreadyInDiscussion
    participant_relation = await DiscussionParticipantRelation(
        discussion_id=discussion_id, participant_id=user_db.id, inviter_id=user_id
    ).create()

    user_inviter = User.alias('user_inviter')
    user_participant = User.alias('user_participant')
    query = db.select([DiscussionParticipantRelation.
                      outerjoin(user_inviter,
                                DiscussionParticipantRelation.inviter_id == user_inviter.id).
                      outerjoin(user_participant,
                                DiscussionParticipantRelation.participant_id == user_participant.id)]). \
        where(DiscussionParticipantRelation.id == participant_relation.id)
    loader = DiscussionParticipantRelation.distinct(DiscussionParticipantRelation.id). \
        load(set_participant=user_participant.distinct(user_participant.id),
             set_inviter=user_inviter.distinct(user_inviter.id))
    participant_relation = await query.gino.load(loader).all()
    participant_relation = UserParticipantMentioned(many=True).dump(participant_relation)
    response = object_response(participant_relation)

    return web.json_response(response)

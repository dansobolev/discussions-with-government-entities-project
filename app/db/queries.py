import uuid
from typing import Dict, Optional, Union

from aiohttp import web
from sqlalchemy import or_

from app.auth.permissions import get_current_user_permissions
from app.db import db
from app.db.models import User, Discussion, DiscussionParticipantRelation, \
    DiscussionComment, CommentAttachmentRelation, Upload
from app.exceptions import UserAlreadyExistsException, UserNotInDialogueException, \
    UserNotFoundException, UserIsBannedException, DiscussionNotFound


async def get_user_by_login(login: str, raise_error: bool = False) -> Optional[User]:
    user = await User.query.where(User.login == login).gino.first()
    if not user and raise_error:
        raise UserNotFoundException
    return user


async def get_user_by_id(id_: Union[uuid.uuid4, str], raise_error: bool = False) -> Optional[User]:
    user = await User.get(id_)
    if not user and raise_error:
        raise UserNotFoundException
    return user


async def current_user(request: web.Request, user_id: str) -> Dict:
    user_permissions = request.get('user_permissions')
    if not user_permissions:
        user_permissions = \
            await get_current_user_permissions(user_id, context={'discussion_id': None})
    return {
        "user_id": user_id,
        "permissions": user_permissions
    }


async def get_user_by_email(email: str, raise_error: bool = False) -> Optional[User]:
    user = await User.query.where(User.email == email).gino.first()
    if not user and raise_error:
        raise UserNotFoundException
    return user


async def check_user_uniqueness(login: str, email: str) -> Optional[User]:
    db_user = await User.query.where(
        or_(User.login == login, User.email == email)
    ).gino.first()
    return db_user


async def create_user(**kwargs):
    existed_user = await get_user_by_login(kwargs['login'])
    if existed_user:
        raise UserAlreadyExistsException
    db_user = User(**kwargs)
    await db_user.create()


async def is_valid_user(user: User) -> bool:
    if not user:
        raise UserNotFoundException

    if user.is_banned:
        raise UserIsBannedException

    return True


class BaseDiscussionQuery:
    user_inviter = User.alias('user_inviter')
    replied_message = DiscussionComment.alias('replied_message')
    user_comment_author = User.alias('user_comment_author')
    uploads_profile = Upload.alias('uploads_profile')
    uploads_other = Upload.alias('uploads_other')

    @classmethod
    def select(cls):
        select_ = db.select([(Discussion.
                              outerjoin(DiscussionParticipantRelation).
                              outerjoin(User, User.id == DiscussionParticipantRelation.participant_id).
                              outerjoin(cls.user_inviter,
                                        cls.user_inviter.id == DiscussionParticipantRelation.inviter_id).
                              outerjoin(DiscussionComment, Discussion.id == DiscussionComment.discussion_id).
                              outerjoin(cls.replied_message,
                                        cls.replied_message.id == DiscussionComment.replied_message_id).
                              outerjoin(cls.user_comment_author,
                                        cls.user_comment_author.id == DiscussionComment.author_id).
                              outerjoin(cls.uploads_profile,
                                        cls.uploads_profile.id == User.profile_image_id).
                              outerjoin(CommentAttachmentRelation,
                                        CommentAttachmentRelation.comment_id == DiscussionComment.id).
                              outerjoin(cls.uploads_other,
                                        cls.uploads_other.id == CommentAttachmentRelation.upload_id))])
        return select_

    @classmethod
    def loader(cls):
        loader_ = Discussion.distinct(Discussion.id) \
            .load(add_participant=User.distinct(User.id)
                  .load(set_profile_image=cls.uploads_profile.distinct(cls.uploads_profile.id)),
                  add_comment=DiscussionComment.distinct(DiscussionComment.id)
                  .load(add_attachment=cls.uploads_other.distinct(cls.uploads_other.id),
                        set_author=cls.user_comment_author.distinct(cls.user_comment_author.id),
                        set_replied_message=cls.replied_message.distinct(cls.replied_message.id)),
                  add_user_mentions=DiscussionParticipantRelation.distinct(DiscussionParticipantRelation.id)
                  .load(set_participant=User.distinct(User.id),
                        set_inviter=cls.user_inviter.distinct(cls.user_inviter.id)))
        return loader_


async def get_discussion_by_id(discussion_id: str) -> Discussion:
    discussion = await Discussion.get(discussion_id)
    if not discussion:
        raise DiscussionNotFound
    return discussion


async def get_user_discussion(discussion_id: str):
    query = Discussion.outerjoin(User).select().where(Discussion.id == discussion_id)
    query = await query.gino.load(Discussion.distinct(Discussion.id)
                                  .load(add_participant=User.distinct(User.id))).all()
    return query


async def is_user_discussion_participant(
        user_id: str,
        discussion: Union[Discussion, str],
        raise_error: bool = True
) -> bool:
    if isinstance(discussion, Discussion):
        discussion_id = discussion.id
    else:
        discussion_id = discussion
    query = db.select([Discussion.
                       outerjoin(DiscussionParticipantRelation).
                       outerjoin(User, DiscussionParticipantRelation.participant_id == User.id)]). \
        where(Discussion.id == discussion_id)
    loader = Discussion.distinct(Discussion.id).load(
        add_participant=User.distinct(User.id)
    )
    discussion = await query.gino.load(loader).all()
    if not discussion:
        raise DiscussionNotFound
    if str(user_id) not in [str(user.id) for user in discussion[0].participants]:
        if raise_error:
            raise UserNotInDialogueException
        return False
    return True

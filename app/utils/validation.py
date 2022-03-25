from typing import Dict, List

from marshmallow import Schema, fields, EXCLUDE, post_dump
from marshmallow_enum import EnumField

from app.auth.enums import SystemRoleEnum
from app.enums import UploadType
from app.exceptions import ValidationError


class SchemaValidationErrorsMixin:
    def is_valid(self, data: Dict, *args, **kwargs):
        errors = self.validate(data, *args, **kwargs)
        if errors:
            print("here")
            raise ValidationError(error='VALIDATION_FAILED', message='data validation error',
                                  data=[errors])

    def load_with_raise(self, *args, **kwargs):
        self.is_valid(*args, **kwargs)
        return self.load(*args, **kwargs)


class UploadSchema(Schema):
    id = fields.UUID(required=True)
    created_at = fields.DateTime(format="%d.%m.%Y %H:%M:%S", dump_only=True)
    type = EnumField(UploadType)

    class Meta:
        additional = ('extension', 'fileName', 'file_size', 'file_mime_type')
        unknown = EXCLUDE


class UserSchema(Schema, SchemaValidationErrorsMixin):
    id = fields.UUID(dump_only=True)
    login = fields.String(required=True)
    password = fields.String(required=True, load_only=True)
    email = fields.String(allow_none=False)
    phone_number = fields.String(allow_none=False)
    firstname = fields.String(allow_none=False)
    lastname = fields.String(allow_none=False)
    middlename = fields.String(allow_none=True)
    profile_image = fields.Nested(UploadSchema)
    role_type = EnumField(SystemRoleEnum, allow_none=False)
    is_banned = fields.Boolean(allow_none=False)


class DiscussionCommentSchema(Schema):
    id = fields.UUID(dump_only=True)
    created_at = fields.DateTime(format="%d.%m.%Y %H:%M:%S", dump_only=True)
    author = fields.Nested(UserSchema)
    author_id = fields.UUID(load_only=True)
    comment_text = fields.String(allow_none=False)
    attachments = fields.Nested(UploadSchema, many=True)
    replied_message_id = fields.UUID(load_only=True)
    replied_message = fields.Nested('DiscussionCommentSchema',
                                    allow_none=True, only=('comment_text', ))


class UserParticipantMentioned(Schema):
    created_at = fields.DateTime(format="%d.%m.%Y %H:%M:%S", dump_only=True)
    participant = fields.Nested(UserSchema)
    inviter = fields.Nested(UserSchema)

    @post_dump(pass_many=True)
    def delete_discussion_author(self, participants: List, **kwargs):
        k = 0
        for participants_data in participants:
            if participants_data['participant']['login'] == \
                    participants_data['inviter']['login']:
                del participants[k]
            else:
                k += 1
        return participants


class DiscussionSchema(Schema):
    id = fields.UUID(dump_only=True)
    created_at = fields.DateTime(format="%d.%m.%Y %H:%M:%S", dump_only=True)
    creator_id = fields.UUID(dump_only=True)
    name = fields.String(allow_none=False)
    participants = fields.Nested(UserSchema, many=True)
    comments = fields.Nested(DiscussionCommentSchema, many=True)
    user_mentions = fields.Nested(UserParticipantMentioned, many=True)

    @post_dump
    def post_dump_discussion_entities_sort(self, item: Dict, **kwargs):
        comments = item.get('comments')
        add_mentions = item.get('user_mentions')
        if not comments or not add_mentions:
            return item
        list_ = comments + add_mentions
        list_ = sorted(list_, key=lambda d: d['created_at'])
        del item['comments']
        del item['user_mentions']
        item['discussion_entities'] = list_
        return item

    @post_dump(pass_many=True)
    def post_dump_discussions_sort(self, discussions: Dict, **kwargs):
        return sorted(discussions, key=lambda d: d['created_at'])

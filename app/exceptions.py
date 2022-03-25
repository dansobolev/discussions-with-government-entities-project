from typing import Any, Optional
from aiohttp import web


class ValidationError(Exception):
    def __init__(self, error: Any, message: Optional[str] = None,
                 data: Any = None, status_code: int = 400):
        self.error = error or None
        self.message = message
        self.data = data or None
        self.status_code = status_code


class AioHTTPBaseException(web.HTTPException):
    pass


class UserNotFoundException(AioHTTPBaseException):
    status_code = 404
    message = 'User not found'


class UserIsBannedException(AioHTTPBaseException):
    status_code = 403
    message = 'User is blocked'


class UserAlreadyExistsException(AioHTTPBaseException):
    status_code = 409
    message = 'User with such identity is already exists'


class UserAlreadyInDiscussion(AioHTTPBaseException):
    status_code = 400
    message = 'User with such login is already in discussion'


class PasswordResetLinkNotFound(AioHTTPBaseException):
    status_code = 404
    message = 'Password reset link was not found'


class PasswordResetLinkExpired(AioHTTPBaseException):
    status_code = 410
    message = 'Password reset link has been expired'


class UploadedFileTooLargeException(AioHTTPBaseException):
    status_code = 400
    message = 'Uploaded file is too large'


class DiscussionNotFound(AioHTTPBaseException):
    status_code = 404
    message = 'Discussion not found'


class UserNotInDialogueException(AioHTTPBaseException):
    status_code = 403
    message = 'User not in dialogue'


class UploadNotFound(AioHTTPBaseException):
    status_code = 404
    message = 'Upload not found'


class EnteredPasswordsDoNotMatchException(AioHTTPBaseException):
    status_code = 400


class NewPasswordSameAsOldException(AioHTTPBaseException):
    status_code = 400

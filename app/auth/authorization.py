from aiohttp import web
from aiohttp_security.abc import AbstractAuthorizationPolicy

from app.utils.utils import permission_to_list
from app.auth.permissions import get_current_user_permissions


class AuthorizationPolicy(AbstractAuthorizationPolicy):
    def __init__(self):
        super().__init__()

    async def permits(self, identity, permission, context=None):
        if not identity:
            raise web.HTTPUnauthorized
        permissions = permission_to_list(permission)
        current_user_permissions = await get_current_user_permissions(identity, context=context)
        if not permissions or any(req_perm.startswith(user_perm)
                                  for user_perm in current_user_permissions
                                  for req_perm in permissions):
            return current_user_permissions
        else:
            raise web.HTTPForbidden

    async def authorized_userid(self, identity):
        if not identity:
            raise web.HTTPUnauthorized
        return identity

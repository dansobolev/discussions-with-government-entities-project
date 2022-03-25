from typing import Dict, Callable, Union
import json

from app.db.queries import current_user
from app.exceptions import ValidationError

import aiohttp_jinja2
from aiohttp import web
from aiohttp_security import authorized_userid


async def handle_500(request: web.Request, context: Dict = None):
    return aiohttp_jinja2.render_template('exceptions/500.html', request, context=context, status=500)


def create_error_middleware(overrides: Dict[int, Callable]):

    @web.middleware
    async def error_middleware(request: web.Request, handler: Callable):
        try:
            return await handler(request)
        except web.HTTPException as ex:
            override = overrides.get(ex.status)
            if override:
                return await override(request, {'error_message': ex.text})
            body = ex
            if hasattr(ex, 'message'):
                body = ex.message
            return json_custom_response(ex.status_code, body)
        except ValidationError as ex:
            return json_custom_response(ex.status_code, ex.message, ex.data)
        except Exception as error_500:
            return await overrides[500](request, context={'error_message': str(error_500)})

    return error_middleware


def current_user_data():
    @web.middleware
    async def user_data_middleware(request: web.Request, handler: Callable):
        response = await handler(request)
        user_id = await authorized_userid(request)
        if response.content_type == 'application/json':
            resp_body = json.loads(response.body)
            user = await current_user(request, user_id)
            resp_body.update(current_user=user)
            response.body = json.dumps(resp_body)
        elif response.content_type == 'text/html':
            response.headers.update({'Current-User': user_id or 'None'})
        return response

    return user_data_middleware


def setup_middlewares(app):
    error_middleware = create_error_middleware({
        500: handle_500
    })
    app.middlewares.append(error_middleware)
    app.middlewares.append(current_user_data())


def json_custom_response(
        status_code: int,
        message: Union[Exception, str],
        errors: Dict = None) -> web.Response:
    body_ = dict(message=str(message))
    if errors:
        body_['errors'] = errors
    return web.Response(
        status=status_code,
        body=json.dumps(body_).encode('utf-8'),
        content_type='application/json')

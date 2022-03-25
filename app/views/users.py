import datetime
from email.message import EmailMessage

from aiohttp import web
from aiohttp_security import remember, forget, authorized_userid
import aiohttp_jinja2

from app.db.models import UserPasswordResetLink
from app.db.queries import get_user_by_login, create_user, \
    get_user_by_email, check_user_uniqueness, get_user_by_id, is_valid_user
from app.utils.password.hash import generate_hash, check_hash
from app.utils.validation import UserSchema
from app.mailing import send_email_message, jinja_env
from app.config import Config
from app.utils.password.exceptions import GeneratePasswordHashException, \
    CheckPasswordHashException
from app.exceptions import PasswordResetLinkNotFound, PasswordResetLinkExpired, \
    UserAlreadyExistsException, EnteredPasswordsDoNotMatchException, NewPasswordSameAsOldException

routes = web.RouteTableDef()


@routes.get('/register')
@routes.post('/register')
async def register(request: web.Request) -> web.Response:
    if request.method == 'GET':
        return aiohttp_jinja2.render_template('auth/register.html', request, context={})
    elif request.method == 'POST':
        data = UserSchema().load_with_raise(await request.json())
        login_ = data['login']
        email_ = data['email']
        existed_user = await check_user_uniqueness(login=login_, email=email_)
        if existed_user:
            raise UserAlreadyExistsException

        try:
            hashed_password = generate_hash(data['password'])
        except GeneratePasswordHashException:
            # TODO handle properly
            raise
        else:
            data.update({'password': hashed_password})

        await create_user(**data)
        raise web.HTTPCreated


@routes.get('/login', name='login')
@routes.post('/login')
async def login(request: web.Request) -> web.Response:
    if request.method == 'GET':
        forgot_password_url = request.app.router['password-reset-request'].url_for()
        return aiohttp_jinja2.render_template('auth/login.html', request,
                                              context={'forgot_password_url': forgot_password_url})
    elif request.method == 'POST':
        data = await request.json()
        data = UserSchema(only=('login', 'password')).load_with_raise(data)
        entity = data['login']
        if entity.__contains__('@'):
            db_user = await get_user_by_email(entity, raise_error=True)
        else:
            db_user = await get_user_by_login(entity, raise_error=True)
        try:
            check_hash(data['password'], db_user.password)
        except CheckPasswordHashException:
            raise web.HTTPUnauthorized
        payload = str(db_user.id)
        response = web.json_response(UserSchema().dump(db_user))
        await remember(request, response, payload)
        return response


@routes.get('/logout')
async def logout(request: web.Request):
    response = web.HTTPOk
    await forget(request, response)
    raise response


@routes.get('/password-reset-request', name='password-reset-request')
@routes.post('/password-reset-request')
async def password_reset_request(request: web.Request) -> web.Response:
    if request.method == 'GET':
        return aiohttp_jinja2.render_template('auth/forgot_password_request.html', request, context={})
    elif request.method == 'POST':
        data = await request.json()
        db_user = await get_user_by_email(data['email'])
        if db_user:
            password_reset = await UserPasswordResetLink(user_id=db_user.id).create()

            message = EmailMessage()
            template = jinja_env.get_template('emails/password_reset.html')
            password_reset_url = \
                Config.BASE_URL + \
                str(request.app.router['password-reset-procedure'].url_for(reset_id=str(password_reset.id)))
            data = {
                'login': db_user.login,
                'username': db_user.fullname,
                'password_reset_link': password_reset_url
            }
            html_message = await template.render_async(**data)
            message.add_alternative(html_message, subtype='html')
            send_email_message(message, send_to=db_user.email)

            raise web.HTTPOk


@routes.get('/password-reset-procedure/{reset_id}', name='password-reset-procedure')
@routes.post('/password-reset-procedure/{reset_id}')
async def password_reset_procedure(request: web.Request) -> web.Response:
    if request.method == 'GET':
        link_id = request.match_info['reset_id']
        password_reset_db = await UserPasswordResetLink.get(link_id)
        if not password_reset_db:
            raise PasswordResetLinkNotFound
        time_created = password_reset_db.created_at
        if password_reset_db.is_expired or \
                time_created + datetime.timedelta(days=3) < datetime.datetime.now():
            raise PasswordResetLinkExpired

        return aiohttp_jinja2.render_template('auth/forgot_password_form.html', request, context={})

    elif request.method == 'POST':
        data = await request.json()
        new_password = data['password']
        try:
            hashed_password = generate_hash(new_password)
        except GeneratePasswordHashException:
            # TODO handle properly
            raise

        link_id = request.match_info['reset_id']
        password_reset_db = await UserPasswordResetLink.get(link_id)
        user_db = await password_reset_db.user

        await password_reset_db.update(is_expired=True).apply()
        await user_db.update(password=hashed_password).apply()

        raise web.HTTPOk


@routes.get('/change-password', name='change-password')
@routes.post('/change-password')
async def change_password(request: web.Request) -> web.Response:
    if request.method == 'GET':
        return aiohttp_jinja2.render_template('auth/change_password.html', request, context={})
    elif request.method == 'POST':
        data = dict(await request.json())
        user_id = await authorized_userid(request)
        if not user_id:
            raise web.HTTPUnauthorized
        db_user = await get_user_by_id(user_id)

        await is_valid_user(db_user)

        old_password = data['old_password']
        try:
            check_hash(old_password, db_user.password)
        except CheckPasswordHashException:
            raise web.HTTPUnauthorized

        new_password = data['new_password_1']
        new_password_retry = data['new_password_2']
        if new_password != new_password_retry:
            raise EnteredPasswordsDoNotMatchException

        try:
            hashed_password = generate_hash(new_password)
        except GeneratePasswordHashException:
            # TODO handle properly
            raise

        try:
            check_hash(new_password, db_user.password)
            raise NewPasswordSameAsOldException
        except CheckPasswordHashException:
            ...

        await db_user.update(password=hashed_password).apply()
        raise web.HTTPOk

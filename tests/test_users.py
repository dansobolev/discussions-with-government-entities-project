import datetime
import json
import uuid

from app.db.models import UserPasswordResetLink
from app.db.queries import get_user_by_login
from app.utils.password.hash import check_hash


async def test_create_user_with_existed_login_and_email(client, user, user_data):
    response = await client.post('/register', data=json.dumps(user_data))
    assert response.status == 409


async def test_create_user_with_valid_data(client, user_data):
    user_data.update({'password': 'test_password'})
    response = await client.post('/register', data=json.dumps(user_data))
    assert response.status == 201

    user_db = await get_user_by_login(login=user_data['login'])
    assert user_db.login == user_data['login']

    await user_db.delete()


async def test_login_with_non_existed_login(client):
    data = dict(login='non_existed_login', password='password')
    response = await client.post('/login', data=json.dumps(data))
    assert response.status == 404


async def test_auth_with_wrong_password(client, user):
    data = dict(login='test_user', password='wrong_password')
    response = await client.post('/login', data=json.dumps(data))
    assert response.status == 401


async def test_user_change_password_successful(client, user):
    old_password = 'test'
    new_password_1 = 'password_new'
    new_password_2 = 'password_new'

    await client.post('/login', data=json.dumps(
        {'login': user.login, 'password': 'test'}))

    response = await client.post('/change-password', data=json.dumps(
        {'old_password': old_password,
         'new_password_1': new_password_1,
         'new_password_2': new_password_2}
    ))
    assert response.status == 200

    user_db = await get_user_by_login(login=user.login)
    check_hash(new_password_1, user_db.password)


async def test_user_different_passwords(client, user):
    old_password = 'test'
    new_password_1 = 'password_new_1'
    new_password_2 = 'password_new_2'

    await client.post('/login', data=json.dumps(
        {'login': user.login, 'password': 'test'}))

    response = await client.post('/change-password', data=json.dumps(
        {'old_password': old_password,
         'new_password_1': new_password_1,
         'new_password_2': new_password_2}
    ))
    assert response.status == 400


async def test_user_old_password_same_as_new(client, user):
    old_password = 'test'
    new_password_1 = 'test'
    new_password_2 = 'test'

    await client.post('/login', data=json.dumps(
        {'login': user.login, 'password': 'test'}))

    response = await client.post('/change-password', data=json.dumps(
        {'old_password': old_password,
         'new_password_1': new_password_1,
         'new_password_2': new_password_2}
    ))
    assert response.status == 400


async def test_user_change_password_for_banned_user(client, user):
    await user.update(is_banned=True).apply()

    old_password = 'test'
    new_password_1 = 'password_new_1'
    new_password_2 = 'password_new_2'

    await client.post('/login', data=json.dumps(
        {'login': user.login, 'password': 'test'}))

    response = await client.post('/change-password', data=json.dumps(
        {'old_password': old_password,
         'new_password_1': new_password_1,
         'new_password_2': new_password_2}
    ))
    assert response.status == 403
    assert (await response.json())['message'] == 'User is blocked'
    await user.update(is_banned=False).apply()


async def test_create_password_reset_link_for_authorized_user(client, user):
    response = await client.post('/password-reset-request', data=json.dumps(
        {'email': user.email}
    ))
    assert response.status == 200

    reset_link = \
        await UserPasswordResetLink.query.\
            where(UserPasswordResetLink.user_id == user.id).gino.first()
    assert reset_link.user_id == user.id


async def test_check_if_reset_link_is_valid(client, user, password_reset_link):
    response = await client.get(f'/password-reset-procedure/{password_reset_link.id}')
    assert response.status == 200


async def test_reset_link_is_expired(client, user, password_reset_link):
    await password_reset_link.update(is_expired=True).apply()
    response = await client.get(f'/password-reset-procedure/{password_reset_link.id}')
    assert response.status == 410


async def test_reset_link_time_has_gone(client, user, password_reset_link):
    reset_link = await UserPasswordResetLink.get(password_reset_link.id)
    new_created_at = datetime.datetime.now() - datetime.timedelta(days=3, minutes=1)
    await reset_link.update(created_at=new_created_at).apply()
    response = await client.get(f'/password-reset-procedure/{password_reset_link.id}')
    assert response.status == 410


async def test_reset_link_is_not_valid(client, user):
    link_id = uuid.uuid4()
    response = await client.get(f'/password-reset-procedure/{str(link_id)}')
    assert response.status == 404


async def test_create_password_with_valid_reset_link(client, user, password_reset_link):
    response = await client.post(f'/password-reset-procedure/{password_reset_link.id}',
                                 data=json.dumps({'password': 'new_user_password'}))
    assert response.status == 200

    reset_link = await UserPasswordResetLink.get(password_reset_link.id)
    assert reset_link.is_expired is True

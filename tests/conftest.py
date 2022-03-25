import asyncio
from typing import Dict, List
import pytest

from app import aiohttp_app
from app.auth.enums import SystemRoleEnum
from app.db.models import User, Discussion, UserPasswordResetLink
from app.db.queries import is_user_discussion_participant
from app.config import Config
from app.utils.password.hash import generate_hash


@pytest.fixture(scope='session')
def event_loop():
    yield asyncio.get_event_loop()


@pytest.fixture
def client(event_loop, aiohttp_client):
    config = Config()
    config.TESTING = True
    app = aiohttp_app(config)
    return event_loop.run_until_complete(aiohttp_client(app))


@pytest.fixture
def user_data() -> Dict:
    return {'login': 'test_user', 'password': generate_hash('test').decode("utf-8"),
            'email': 'test@gmail.com', 'phone_number': '+79999999999',
            'firstname': 'admin', 'lastname': 'adminov', 'middlename': 'adminovich',
            'role_type': SystemRoleEnum.ORDINARY_USER.name}


@pytest.fixture
async def user(user_data) -> User:
    data = user_data.copy()
    data.update({'password': generate_hash('test')})
    user = await User(**data).create()
    yield user
    await user.delete()


@pytest.fixture
async def users(user_data) -> List[User]:
    users_list = []
    for user_id in range(3):
        data = user_data.copy()
        data.update({'login': f'user_id_{user_id}', 'password': generate_hash('test')})
        db_user = await User(**data).create()
        users_list.append(db_user)

    yield users_list

    for user in users_list:
        await user.delete()


@pytest.fixture
async def discussions(users) -> List[Discussion]:
    lst = []
    for i in range(3):
        discussion = \
            await Discussion(name=f'discussion named {i + 1}',
                             creator_id=users[i].id).create()
        await discussion.discussion_participant_relation(participant_id=users[i].id)
        lst.append(discussion)

    yield lst

    for discussion_ in lst:
        await discussion_.delete()


@pytest.fixture
async def user_discussions(users, discussions) -> List[Discussion]:
    user_ = users[0]
    user_discussions_list = []
    for discussion in discussions:
        if await is_user_discussion_participant(user_.id, discussion, raise_error=False):
            user_discussions_list.append(discussion)

    yield user_discussions_list


@pytest.fixture
async def password_reset_link(user):
    reset_link = await UserPasswordResetLink(user_id=user.id).create()

    yield reset_link

    await reset_link.delete()

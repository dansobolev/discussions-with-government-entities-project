import asyncio
import json

from app.db.models import *
from app.config import Config
from app.utils.password.hash import generate_hash


async def main():
    await db.set_bind(Config.DB_URL)
    with open('fixtures/users.json', 'r') as users:
        users = json.load(users)

    model = eval(users[0]['model'])
    for user in users:
        user['fields'].update(password=generate_hash(user['fields']['password']))
        await model(**user['fields']).create()

    with open('fixtures/discussions.json', 'r') as discussions:
        discussions = json.load(discussions)

    for discussion_entity in discussions:
        model = eval(discussion_entity['model'])
        await model(**discussion_entity['fields']).create()

    with open('fixtures/discussion_comments.json', 'r') as discussion_comments:
        discussion_comments = json.load(discussion_comments)

    for comment in discussion_comments:
        model = eval(comment['model'])
        await model(**comment['fields']).create()


asyncio.run(main())

import ssl

from aiohttp import web
from gino import Gino

from app.config import Config

db = Gino()


async def init_db(app: web.Application, db_: Gino):
    # TODO: configure ssl
    if app['config'].DB_SSL:
        ctx = ssl.create_default_context()
        ctx.check_hostname = False
        ctx.verify_mode = ssl.CERT_NONE
    if app['config'].TESTING:
        db_url = \
            rf'postgresql://{Config.DB_USER}:{Config.DB_PASSWORD}@{Config.DB_HOST}:{Config.DB_PORT}/postgres_test'
        await db_.set_bind(db_url)
    else:
        await db_.set_bind(app['config'].DB_URL, ssl=ctx if app['config'].DB_SSL else None)


async def close_db(db_: Gino):
    await db_.pop_bind().close()

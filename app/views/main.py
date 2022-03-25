from aiohttp import web
import aiohttp_jinja2

routes = web.RouteTableDef()


@routes.get('/')
async def index(request):
    return aiohttp_jinja2.render_template('index.html', request, context={})


@routes.get('/discussions')
async def index(request):
    return aiohttp_jinja2.render_template('discussions.html', request, context={})

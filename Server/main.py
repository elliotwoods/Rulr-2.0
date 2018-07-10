import falcon
import os
from werkzeug.serving import run_simple
from werkzeug.wsgi import SharedDataMiddleware

import Resources.World
import Resources.Index

index  = Resources.Index.Resource()
world = Resources.World.Resource()

api = falcon.API()
api.add_route('/world', world)
api.add_route('/', index)

clientFilesPath = os.path.abspath('Client')

apiWithStatic = SharedDataMiddleware(api, {
	'/Client' : (os.path.join(os.path.dirname(__file__), '..', 'Client'))
})

if __name__ == '__main__':
	run_simple('localhost', 4000, apiWithStatic)
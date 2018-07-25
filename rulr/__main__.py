import falcon
import os
import IPython
from werkzeug.serving import run_simple
from werkzeug.wsgi import SharedDataMiddleware

import rulr.Nodes
import rulr.Resources

if __name__ == "__main__":
	"""
	grid = rulr.Nodes.Base.fromDescription({
		'moduleName' : 'Nodes.Debug',
		'className' : 'Grid',
		'children' : [
			{
				'moduleName' : 'Nodes',
				'className' : 'Base'
			}
		]
	})
	"""

	api = falcon.API()	

	# Auto-handle all resources
	rulr.Resources.initializeResources(api)
	
	# Build a new api which handles static files
	clientFilesPath = os.path.abspath('Client')
	apiWithStatic = SharedDataMiddleware(api, {
		'/Client' : (os.path.join(os.path.dirname(__file__), '..', 'rulr-web'))
	})

	# Turn off verbose werkzeug logging
	import logging
	#werkzeugLog = logging.getLogger('werkzeug')
	#werkzeugLog.setLevel(logging.WARNING)
	
	# Run the hosting
	run_simple('localhost'
	, 4000
	, apiWithStatic
	, threaded=True)
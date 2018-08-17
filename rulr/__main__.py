import falcon
import os
import IPython
from werkzeug.serving import run_simple
from werkzeug.wsgi import SharedDataMiddleware
from cefpython3 import cefpython as cef
import sys
import http.server
import threading
from rulr.Utils._Exports import export_method, call_exported_object

import rulr.Application

"""
def start_falcon():
	api = falcon.API()

	# Auto-handle all resources
	rulr.Resources.initializeResources(api)
	
	# Build a new api which handles static files
	apiWithStatic = SharedDataMiddleware(api, {
		'/rulr-web' : (os.path.join(os.path.dirname(__file__), '..', 'rulr-web')),
		'/Nodes' : (os.path.join(os.path.dirname(__file__), 'Nodes'))
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
"""

def browser_on_after_created(browser, **_):
	pass


class ClientHandler():
	def OnLoadingStateChange(self, browser, is_loading, **_):
		if not is_loading:
			bindings = cef.JavascriptBindings()
			bindings.SetObject("serverApplication", rulr.Application.instance) # This is handled in the initialisation
			bindings.SetFunction("callExportedObject", call_exported_object)
			browser.SetJavascriptBindings(bindings)
			
			browser.ExecuteFunction("initialise")
	
	#def OnConsoleMessage(self, browser, message, **_):
	#	print ("JS Console Message : {0}".format(message))

if __name__ == "__main__":
	# start_falcon()
	# Here we could initialise the Falcon API. But we turn it off for the time being
	# Later to bring it back, we'd need to think more about how it works


	server = http.server.HTTPServer(('127.0.0.1', 4000), http.server.SimpleHTTPRequestHandler)
	serverThread = threading.Thread(target=server.serve_forever, args=())
	serverThread.daemon = True
	serverThread.start()

	sys.excepthook = cef.ExceptHook  # To shutdown all CEF processes on error
	cef.SetGlobalClientCallback("OnAfterCreated", browser_on_after_created)
	cef.Initialize(settings={
		"remote_debugging_port": 49155
	})

	#TODO(elliot) : Version numbering (automatic)
	browser = cef.CreateBrowserSync(url='http://127.0.0.1:{0}/rulr-web/html/index.html'.format(server.server_port),
									window_title="Rulr",
									settings = {
										"application_cache_disabled" : True
										# "web_security_disabled" : True
									})

	clientHandler = ClientHandler()
	browser.SetClientHandler(clientHandler)

	cef.MessageLoop()
	cef.Shutdown()

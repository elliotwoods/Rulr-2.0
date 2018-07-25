import falcon
import traceback
import json
import pkgutil
import os.path
import inspect
import sys

class Base(object):
	def __init__(self):
		pass

	def perform(self, requestObject):
		raise Exception("Perform is not implemented")

	def on_get(self, req, resp):
		requestObject = self.defaultRequestParameters()
		requestObject.update(falcon.uri.parse_query_string(req.query_string))
		self.handleRequest(self.perform, requestObject, resp)

	def on_post(self, req, resp):
		postBody = req.stream.read()
		requestObject = self.defaultRequestParameters()
		requestObject.update(json.loads(postBody))
		self.handleRequest(self.perform, requestObject, resp)

	def handleRequest(self, responseFunction, requestObject, resp):
		try:
			content = responseFunction(requestObject)
			resp.media = {
				'success' : True,
				'content' : content
			}
		except Exception as e:
			exc_tb = sys.exc_info()[2]
			tracebackList = traceback.extract_tb(exc_tb, 5)

			formattedList = []
			for tracebackEntry in tracebackList:
				formattedList.append({
					"name" : tracebackEntry.name,
					"filename" : tracebackEntry.filename,
					"line number" : tracebackEntry.lineno,
					"line" : tracebackEntry.line
				})

			resp.media = {
				'success' : False,
				'exception' : str(e),
				'traceback' : formattedList
			}

	def defaultRequestParameters(self):
		return {}

class Echo(Base):
	def GET(self, args):
		return args

	def POST(self, args):
		return args

def traverseModule(api, packagePath, urlPath):
	for importer, moduleName, isPackage in pkgutil.iter_modules(packagePath):
		module = importer.find_module(moduleName).load_module(moduleName)
		innerUrl = "{0}/{1}".format(urlPath, moduleName)

		if isPackage:
			traverseModule(api, module.__path__, innerUrl)
		else:
			# Check the classes for one called 'Resource'
			classMembers = inspect.getmembers(module, inspect.isclass)
			for classMember in classMembers:
				if classMember[0] == 'Resource':
					# If we found a Resource class, create an instance of it and add a route to it
					resourceInstance = classMember[1]()
					
					# Assign an automatic url if the resource does not have one
					if hasattr(resourceInstance, 'url') is False:
						resourceInstance.url = innerUrl

					print("Add route '{0}' -> '{1}".format(resourceInstance.url, resourceInstance))
					api.add_route(resourceInstance.url, resourceInstance)

# Perform this import so we can get the path for the package
import rulr.Resources

# This function traverses the path of the rulr.Resources package and searches for modules
# Any modules which have a Resource class are added to the routing
def initializeResources(api):
	traverseModule(api, rulr.Resources.__path__, '')
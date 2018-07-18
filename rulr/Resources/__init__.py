import falcon
import traceback
import json
import pkgutil
import os.path
import inspect

class Base(object):
	def __init__(self):
		# Check if we have a custom URL
		if not hasattr(self, 'url'):
			# Otherwise set our URL to match out ModuleName/ClassName
			moduleName = self.__module__
			standardModulePrefix = 'rulr.Resources'
			if moduleName.startswith(standardModulePrefix):
				moduleName = moduleName[len(standardModulePrefix):]

			# Add preceeding / if there is a module name
			if len(moduleName) > 0:
				moduleName = "/" + moduleName
			self.url = "{0}/{1}".format(moduleName, self.__class__.__name__)

	def on_get(self, req, resp):
		if hasattr(self, 'GET'):
			requestObject = falcon.uri.parse_query_string(req.query_string)
			self.handleRequest(self.GET, requestObject, resp)
		else:
			self.handleRequest(self.notImplemented, 'GET', resp)

	def on_post(self, req, resp):
		if hasattr(self, 'POST'):
			postBody = req.stream.read()
			requestObject = json.loads(postBody)
			self.handleRequest(self.POST, requestObject, resp)
		else:
			self.handleRequest(self.notImplemented, 'POST', resp)

	def handleRequest(self, responseFunction, requestObject, resp):
		try:
			content = responseFunction(requestObject)
			resp.media = {
				'success' : True,
				'content' : content
			}
		except Exception as e:
			resp.media = {
				'success' : False,
				'exception' : str(e),
				'traceback' : traceback.format_exc(5)
			}

	@staticmethod
	def notImplemented(methodName):
		raise Exception("Method '{0}' is not implemented".format(methodName))


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
					url = resourceInstance.url
					print("Add route '{0}' -> '{1}".format(url, resourceInstance))
					api.add_route(url, resourceInstance)

# Perform this import so we can get the path for the package
import rulr.Resources

# This function traverses the path of the rulr.Resources package and searches for modules
# Any modules which have a Resource class are added to the routing
def initializeResources(api):
	traverseModule(api, rulr.Resources.__path__, '')
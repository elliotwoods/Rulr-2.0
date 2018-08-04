import os

import rulr
import rulr.Nodes.Group
import rulr.Resources
import rulr.Application
import rulr.Utils

class Resource(rulr.Resources.Base):
	def defaultRequestParameters(self):
		 return {
			 "nodePath" : [],
			 "recursive" : True
		 }
		 
	def perform(self, request):
		application = rulr.Application.X

		nodePath = request["nodePath"]
		if isinstance(nodePath, str):
			nodePath.split('/')
			nodePath = [idString for idString in nodePath.split('/') if len(idString) > 0]
			nodePath = [int(id) for id in nodePath]

		node = application.getNodeByPath(nodePath)

		viewDescriptionArguments = rulr.Utils.ViewDescriptionArguments(request)
		
		return {
			"nodeViewDescription" : node.getViewDescription(viewDescriptionArguments)
		}
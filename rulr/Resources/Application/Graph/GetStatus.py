import os

import rulr
import rulr.Nodes.Group
import rulr.Resources
import rulr.Application

class Resource(rulr.Resources.Base):
	def perform(self, request):
		application = rulr.Application.X

		return {
			"hasRootNode" : application.rootNode is not None
		}
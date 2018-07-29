import os

import rulr
import rulr.Nodes.Group
import rulr.Resources
import rulr.Application

class Resource(rulr.Resources.Base):
	def defaultRequestParameters(self):
		 return {
			 "nodePath" : []
		 }
		 
	def perform(self, request):
		application = rulr.Application.X

		nodePath = request["nodePath"]
		node = application.getNodeByPath(nodePath)

		if not isinstance(node, rulr.Nodes.Group.Node):
			raise Exception("Cannot perform on node type [{0}]. Node must inherit Group.")

		childrenDescriptions = []

		for child in node.children:
			childrenDescriptions.append(child.getHeaderDescription())
		
		return childrenDescriptions
import os

import rulr
import rulr.Resources
import rulr.Application

def traverseNode(node):
	description = {
		"moduleName" : node.getModuleName(),
		"className" : node.getClassName(),
		"name" : node.name,
		"ID" : node.ID,
		"children" : []
	}

	for child in node.children:
		description["children"].append(traverseNode(child))
	
	return description

class Resource(rulr.Resources.Base):
	def perform(self, request):
		application = rulr.Application.X

		description = {
			"rootNode" : None
		}

		if application.rootNode is not None:
			description["rootNode"]	= traverseNode(application.rootNode)
		
		return description
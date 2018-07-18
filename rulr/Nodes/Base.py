import importlib
import rulr.Utils
from enum import Enum

class Base:
	def __init__(self):
		self.ID = None
		self.name = ""
		self.children = []
		self.parameters = rulr.Utils.Parameters.ParameterGroup("Base")
	
	@classmethod
	def fromDescription(classType, description):
		module = importlib.import_module('rulr.' + description['moduleName'])
		newClassType = getattr(module, description['className'])
		instance = newClassType()
		if 'name' in description:
			instance.name = description['name']
		if 'content' in description:
			instance.deserialize(description['content'])
		if 'children' in description:
			for childDescription in description['children']:
				child = Base.fromDescription(childDescription)
				instance.children.append(child)
		
		return instance

	def addParameterBlock(self, name, description):
		self.parameters.children[name] = rulr.Utils.Parameters.ParameterGroup.fromDescription(name, description)

	def deserialize(self, description):
		pass
	
	def find(self, nodeID):
		if nodeID == self.ID:
			return self
		
		for child in self.children:
			foundNode = child.find(nodeID)
			if foundNode != None:
				return foundNode

		return None
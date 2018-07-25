import importlib
import rulr.Utils
import rulr.Utils.Parameters

from enum import Enum

class Base:
	def __init__(self):
		self.ID = 0
		self.name = ""
		self.children = []
		self.parameters = rulr.Utils.Parameters.ParameterGroup("Base")
		

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
	
	def getNextAvailableChildID(self):
		if len(self.children) == 0:
			return 0
		else:
			childIDS = []
			for child in self.children:
				childIDS.append(child.ID)
			return sorted(childIDS)[-1] + 1

	def getModuleName(self):
		longName = self.__class__.__module__
		shortName = longName[len("rulr.Nodes."):]
		return shortName

	def getClassName(self):
		return self.__class__.__name__

def fromDescription(description, parentNode):
	module = importlib.import_module('rulr.Nodes.' + description['moduleName'])
	newClassType = getattr(module, description['className'])
	instance = newClassType()

	if 'id' in description:
		instance.ID = description['ID']
	else:
		if parentNode is None:
			instance.ID = 0
		else:
			instance.ID = parentNode.getNextAvailableChildID()

	if 'name' in description:
		instance.name = description['name']

	if 'content' in description:
		instance.deserialize(description['content'])

	if 'children' in description:
		for childDescription in description['children']:
			child = fromDescription(childDescription, instance)
			instance.children.append(child)
	return instance
	
import importlib
import rulr.Utils
import rulr.Utils.Parameters

from enum import Enum

class Header:
	def __init__(self):
		self.ID = 0
		self.name = ""
		self.visible = True
	
class Base:
	def __init__(self):
		self.header = Header()
		self.header.name = self.getModuleName()
		self.children = []
		self.parameters = rulr.Utils.Parameters.ParameterGroup("Base")
		

	def addParameterBlock(self, name, description):
		self.parameters.children[name] = rulr.Utils.Parameters.ParameterGroup.fromDescription(name, description)

	def deserialize(self, description):
		pass

	def serialize(self):
		pass

	def getViewDescription(self, recursive):
		# Header
		description = {
			"header" : self.header.__dict__,
			"module" : self.__module__[len("rulr.Nodes."):]
		}

		# Content


		# Children
		if recursive:
			description["children"] = []
			for child in self.children:
				description["children"].append(child.getViewDescription(recursive))

		return description

	def getModuleName(self):
		longName = self.__class__.__module__
		shortName = longName[len("rulr.Nodes."):]
		return shortName

	def getChildByPath(self, nodePath):
		if nodePath == []:
			return self
		else:
			nodePathString = rulr.Utils.nodePathToString(nodePath)
			ourModuleName = self.__module__
			raise Exception("Cannot get child with nodePath=[{0}]. This node is not a Group, it is a [{1}]".format(nodePathString, ourModuleName))




def fromDescription(description):
	module = importlib.import_module('rulr.Nodes.' + description['moduleName'])
	newNodeInstance = module.Node()

	if 'id' in description:
		newNodeInstance.header.ID = description['ID']

	if 'name' in description:
		newNodeInstance.name = description['name']

	if 'content' in description:
		newNodeInstance.deserialize(description['content'])

	return newNodeInstance
	
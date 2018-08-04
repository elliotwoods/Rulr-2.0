import importlib
import rulr.Utils

from enum import Enum

class Header:
	def __init__(self):
		self.ID = 0
		self.name = ""
		self.visible = True

	def deserialize(self, description):
		if 'ID' in description:
			self.ID = description['ID']
		if 'name' in description:
			self.name = description['name']
		if 'visible' in description:
			self.visible = description['visible']

class Base(rulr.Utils.Viewable):
	def __init__(self):
		self.header = Header()
		self.header.name = self.getModuleName()

		self.parameters = rulr.Utils.AutoGroup()
		self.components = rulr.Utils.AutoGroup()

	def deserialize(self, description):
		pass

	def serialize(self):
		pass

	def getViewDescriptionContent(self, viewDescriptionArguments):
		# Header
		description = {
			"header" : self.header.__dict__
		}

		# Content
		description["parameters"] = self.parameters.getViewDescription(viewDescriptionArguments)
		description["components"] = self.components.getViewDescription(viewDescriptionArguments)

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

	if 'header' in description:
		newNodeInstance.header.deserialize(description['header'])

	if 'name' in description:
		newNodeInstance.name = description['name']

	if 'content' in description:
		newNodeInstance.deserialize(description['content'])

	return newNodeInstance
	
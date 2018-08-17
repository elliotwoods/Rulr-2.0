import importlib
import rulr.Utils
from rulr.Utils import export_method

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

	def get_description(self):
		return self.__dict__
	getDescription = export_method(get_description)


class Base(rulr.Utils.Viewable):
	def __init__(self):
		self.header = Header()
		self.header.name = self.get_module_name()

		self.parameters = rulr.Utils.AutoGroup()
		self.components = rulr.Utils.AutoGroup()

	def deserialize(self, description):
		pass

	def serialise(self):
		pass

	@export_method
	def getHeader(self):
		return self.header
	
	@export_method
	def getParameters(self):
		return self.parameters

	@export_method
	def getComponents(self):
		return self.components
	
	def get_view_description_content(self, view_description_arguments):
		# Header
		description = {
			"header" : self.header.__dict__
		}

		# Content
		description["parameters"] = self.parameters.get_view_description(view_description_arguments)
		description["components"] = self.components.get_view_description(view_description_arguments)

		return description

	def get_module_name(self):
		longName = self.__class__.__module__
		shortName = longName[len("rulr.Nodes."):]
		return shortName

	def get_child_by_path(self, nodePath):
		if nodePath == []:
			return self
		else:
			nodePathString = rulr.Utils.nodePathToString(nodePath)
			ourModuleName = self.__module__
			raise Exception("Cannot get child with nodePath=[{0}]. This node is not a Group, it is a [{1}]".format(nodePathString, ourModuleName))


def from_description(description):
	module = importlib.import_module('rulr.Nodes.' + description['moduleName'])
	newNodeInstance = module.Node()

	if 'header' in description:
		newNodeInstance.header.deserialize(description['header'])

	if 'content' in description:
		newNodeInstance.deserialize(description['content'])

	return newNodeInstance
	
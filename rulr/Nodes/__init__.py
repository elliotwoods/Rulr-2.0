import importlib
import queue

from rulr.Utils.AutoGroup import AutoGroup
from rulr.Utils import Viewable

from enum import Enum


class Header(Viewable):
	def __init__(self):
		super().__init__()
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


class Base(Viewable):
	def __init__(self):
		super().__init__()

		self.header = Header()
		self.header.name = self.get_module_name()

		self.parameters = AutoGroup()
		self.components = AutoGroup()

		self.update_action_queue = queue.Queue()
		self.frame_exception_queue = queue.Queue()

	def deserialize(self, description):
		pass

	def serialise(self):
		pass

	def update(self):
		# Perform all actions in the update_action_queue
		while not self.update_action_queue.empty():
			try:
				action = self.update_action_queue.get(False)
				try:
					action()
					self.update_action_queue.task_done()
				except Exception as e:
					self.frame_exception_queue.put(e)
			except:
				break
	
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
	
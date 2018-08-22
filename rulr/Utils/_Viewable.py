from abc import ABC, abstractmethod
from rulr.Utils.Event import Event

class ViewDescriptionArguments:
	def __init__(self, request = {}):
		self.recursive = True

		if 'recursive' in request:
			self.recursive = request['recursive']

class Viewable(ABC):
	def __init__(self):
		self.on_commit = Event()

		self.commit_index = 0
		self.commit()

	def commit(self):
		"""Announce that a variable has been edited on the server side"""
		self.commit_index += 1
		self.on_commit()
		pass

	def update(self):
		pass
	
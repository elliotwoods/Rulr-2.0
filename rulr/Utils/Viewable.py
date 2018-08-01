from abc import ABC, abstractmethod

class ViewDescriptionArguments:
	def __init__(self, request = {}):
		if 'recursive' in request:
			self.recursive = request['recursive']

class Viewable(ABC):
	@abstractmethod
	def getViewDescriptionContent(self, viewDescriptionArguments):
		return {}

	def getViewDescription(self, viewDescriptionArguments):
		return {
			"module" : self.__module__[len("rulr."):],
			"class" : self.__class__.__name__,
			"content" : self.getViewDescriptionContent(viewDescriptionArguments)
		}

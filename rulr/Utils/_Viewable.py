from rulr.Utils._Exports import export_method
from abc import ABC, abstractmethod

class ViewDescriptionArguments:
	def __init__(self, request = {}):
		self.recursive = True

		if 'recursive' in request:
			self.recursive = request['recursive']

class Viewable(ABC):
	@abstractmethod
	def get_view_description_content(self, viewDescriptionArguments):
		return {}

	def get_view_description(self, view_description_arguments):

		if(not isinstance(view_description_arguments, ViewDescriptionArguments)):
			view_description_arguments = ViewDescriptionArguments(view_description_arguments)

		return {
			"module" : self.__module__[len("rulr."):],
			"class" : self.__class__.__name__,
			"content" : self.get_view_description_content(view_description_arguments)
		}

	getViewDescription = export_method(get_view_description)

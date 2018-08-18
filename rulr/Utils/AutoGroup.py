from rulr.Utils._Viewable import Viewable
from rulr.Utils._Exports import export_method

class AutoGroup(Viewable):
	"""Automatically serialises its member attributes"""

	def __init__(self):
		pass

	def get_view_description_content(self, view_description_arguments):
		dictionary_of_attributes = self.__dict__.copy()

		description = {}

		# Iterate through attributes of the Group
		for key in dictionary_of_attributes.keys():
			value = dictionary_of_attributes[key]

			# get the view description of the child
			get_child_description = getattr(value, 'get_view_description', None)
			if callable(get_child_description):
				description[key] = get_child_description(view_description_arguments)

		return description

	def get_child_names(self):
		attributeNames = dir(self)
		viewableChildren = [attribute for attribute in attributeNames if isinstance(getattr(self, attribute), Viewable)]
		return viewableChildren
	getChildNames = export_method(get_child_names)

	def get_child_by_name(self, name):
		return getattr(self, name)
	getChildByName = export_method(get_child_by_name)
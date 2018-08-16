from rulr.Utils._Viewable import Viewable

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

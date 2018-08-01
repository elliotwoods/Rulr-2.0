from rulr.Utils.Viewable import Viewable

class AutoGroup(Viewable):
	"""Automatically serialises its member attributes"""

	def __init__(self):
		pass

	def getViewDescriptionContent(self, viewDescriptionArguments):
		dictionaryOfAttributes = self.__dict__.copy()

		description = {}

		# Iterate through attributes of the Group
		for key in dictionaryOfAttributes.keys():
			value = dictionaryOfAttributes[key]

			# get the view description of the child
			getChildDescription = getattr(value, 'getViewDescription', None)
			if callable(getChildDescription):
				description[key] = getChildDescription(viewDescriptionArguments)

		return description

from rulr.Utils._Viewable import Viewable

class AutoGroup(Viewable):
	"""Automatically serialises its member attributes"""

	def __init__(self):
		super().__init__()
		pass

	def get_child_names(self):
		attributeNames = dir(self)
		viewableChildren = [attribute for attribute in attributeNames if isinstance(getattr(self, attribute), Viewable)]
		return viewableChildren

	def get_child_by_name(self, name):
		return getattr(self, name)
from rulr.Utils._Viewable import Viewable
import rulr.Utils.Event

class AutoGroup(Viewable):
	"""Automatically serialises its member attributes"""

	def __init__(self):
		super().__init__()
		pass

	def get_child_names(self):
		attributeNames = dir(self)
		viewableChildren = [attribute for attribute in attributeNames if isinstance(getattr(self, attribute), Viewable)]
		return viewableChildren

	def get_child_functions(self):
		# Special case for group of functions
		attributeNames = dir(self)
		
		visible_functions = [attribute for attribute in attributeNames if callable(getattr(self, attribute))]

		hidden_functions = dir(AutoGroup)
		visible_functions = [action for action in visible_functions if action[0] != "_" and not action in hidden_functions and not isinstance(getattr(self, action), rulr.Utils.Event)]
		
		return visible_functions

	def get_child_by_name(self, name):
		return getattr(self, name)
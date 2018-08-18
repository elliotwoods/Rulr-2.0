import rulr.Utils
from rulr.Utils.AutoGroup import AutoGroup

class Base(rulr.Utils.Viewable):
	def __init__(self):
		self.parameters = AutoGroup()
		pass

	def get_view_description_content(self, viewDescriptionArguments):
		description = {}
		description["parameters"] = self.parameters.get_view_description(viewDescriptionArguments)
		return description

class ComponentGroup(object):
	def __init__(self):
		pass
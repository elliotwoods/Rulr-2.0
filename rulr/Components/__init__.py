import rulr.Utils

class Base(rulr.Utils.Viewable):
	def __init__(self):
		self.parameters = rulr.Utils.AutoGroup()
		pass

	def getViewDescriptionContent(self, viewDescriptionArguments):
		description = {}
		description["parameters"] = self.parameters.getViewDescription(viewDescriptionArguments)
		return description

class ComponentGroup(object):
	def __init__(self):
		pass
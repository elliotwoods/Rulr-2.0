import rulr.Utils
from rulr.Utils.AutoGroup import AutoGroup

class Base(rulr.Utils.Viewable):
	def __init__(self):
		self.parameters = AutoGroup()
		pass

class ComponentGroup(object):
	def __init__(self):
		pass
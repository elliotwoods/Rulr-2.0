import rulr.Utils

class Base(object):
	def __init__(self):
		pass
	
class Vector(rulr.Utils.Viewable):
	def __init__(self, value):
		super().__init__()
		self.value = value
	
	def getViewDescriptionContent(self, viewDescriptionArguments):
		return {
			"value" : self.value.tolist()
		}

class BoundVector(Vector):
	def __init__(self, value, lowerLimit, upperLimit, step = 0.0):
		super().__init__(value)
		self.lowerLimit = lowerLimit
		self.upperLimit = upperLimit
		self.step = step

	def getViewDescriptionContent(self, viewDescriptionArguments):
		return {
			"value" : self.value.tolist(),
			"lowerLimit" : self.lowerLimit,
			"upperLimit" : self.upperLimit,
			"step" : self.step
		}

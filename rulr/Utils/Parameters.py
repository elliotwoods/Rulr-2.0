import rulr.Utils
import numpy as np

class Base(object):
	def __init__(self):
		pass

class Float(rulr.Utils.Viewable):
	def __init__(self, value):
		super().__init__()
		self.value = value

	def get_view_description_content(self, viewDescriptionArguments):
		return {
			"value" : self.value
		}
		
class Vector(rulr.Utils.Viewable):
	def __init__(self, value):
		super().__init__()
		self.value = np.array(value, dtype=float)
	
	def get_view_description_content(self, viewDescriptionArguments):
		return {
			"value" : self.value.tolist()
		}

class BoundVector(Vector):
	def __init__(self, value, lowerLimit, upperLimit, step = 0.0):
		super().__init__(value)
		self.lowerLimit = lowerLimit
		self.upperLimit = upperLimit
		self.step = step

	def get_view_description_content(self, viewDescriptionArguments):
		return {
			"value" : self.value.tolist(),
			"lowerLimit" : self.lowerLimit,
			"upperLimit" : self.upperLimit,
			"step" : self.step
		}

class Matrix(rulr.Utils.Viewable):
	def __init__(self, value):
		super().__init__()
		self.value = value
		
	def get_view_description_content(self, viewDescriptionArguments):
		return {
			"value" : self.value.tolist()
		}
	
	def get_value(self):
		return self.value
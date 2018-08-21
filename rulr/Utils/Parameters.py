import rulr.Utils
import numpy as np

class Base(rulr.Utils.Viewable):
	def __init__(self, value):
		super().__init__()
		self.value = value
		pass

class Float(Base):
	def __init__(self, value):
		super().__init__(value)

class Vector(Base):
	def __init__(self, value):
		super().__init__(np.array(value, dtype=float))

class BoundVector(Vector):
	def __init__(self, value, lowerLimit, upperLimit, step = 0.0):
		super().__init__(value)
		self.lowerLimit = lowerLimit
		self.upperLimit = upperLimit
		self.step = step

class Matrix(Base):
	def __init__(self, value):
		super().__init__(np.array(value, dtype=float))

	def set_from_flat_list(self, newValue):
		if self.value.size != len(newValue):
			raise Exception("Cannot set Matrix of shape {} with flat list of length {}".format(self.value.shape, len(newValue)))
		
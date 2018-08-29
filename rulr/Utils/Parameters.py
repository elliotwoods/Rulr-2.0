import rulr.Utils
from rulr.Utils.Event import Event
import numpy as np
import cv2
import base64

class Base(rulr.Utils.Viewable):
	def __init__(self, value_or_property):
		super().__init__()

		self.on_set = Event()

		# TODO : Needs testing if this works (so far always false which is as expected)
		if not isinstance(value_or_property, Property):
			# Can't perform assignment in a lambda, so we split these into actual functions
			self.get = self._value_getter
			self.set = self._value_setter

			self.set(value_or_property)
		else:
			self.wrapped_property = value_or_property
			self.get = value_or_property.get

			# self.set will not be defined for read-only variables
			if value_or_property.set is not None:
				self.set = self._set_parameter

	def formatter(self, value):
		return value

	def _value_getter(self):
		return self.value

	def _value_setter(self, value):
		self.value = self.formatter(value)
		self.on_set()

	def _set_parameter(self, value):
		formatted_value = self.formatter(value)
		self.wrapped_property.set(formatted_value)
		self.on_set()

	def get_client_formatted(self):
		## Use default getter
		return self.get()
	
class Float(Base):
	def formatter(self, value):
		return float(value)

class Vector(Base):
	def formatter(self, value):
		return np.array(value, dtype=float)

class BoundVector(Vector):
	def __init__(self, value, lowerLimit, upperLimit, step = 0.0):
		super().__init__(value)
		self.lowerLimit = lowerLimit
		self.upperLimit = upperLimit
		self.step = step

class Matrix(Base):
	def formatter(self, value):
		return np.array(value, dtype=float)

class Image(Base):
	def __init__(self, value = [[]]):
		super().__init__(value)

	def formatter(self, value):
		return np.array(value, dtype=float)

	def get_client_formatted(self):
		value = self.get()
		if value.size == 0:
			return ""
		else:
			success, encoded_result = cv2.imencode('.png', value)
			del success
			image_buffer_b64 = base64.b64encode(encoded_result.tostring())
			return image_buffer_b64.decode("utf-8")

class Bool(Base):
	def formatter(self, value):
		return bool(value)
	
class Property():
	def __init__(self, get, set = None):
		self.get = get
		self.set = set
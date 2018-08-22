import rulr.Components
from rulr.Utils.Parameters import Vector, BoundVector, Matrix
import numpy as np
import math

class Component(rulr.Components.Base):
	"""A rigid body transform (translation, rotation)"""
	def __init__(self):
		super().__init__()

		self.parameters.transform = Matrix([
			[1, 0, 0, 0],
			[0, 1, 0, 0],
			[0, 0, 1, 0],
			[0, 0, 0, 1]
		])

		# self.parameters.translate = Vector([0.0, 0.0, 0.0])
		# self.parameters.rotate = BoundVector([0.0, 0.0, 0.0], -math.pi, math.pi)

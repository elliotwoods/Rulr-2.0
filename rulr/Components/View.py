import rulr.Components
from rulr.Utils.Parameters import Vector, BoundVector, Matrix
import numpy as np
import math

class Component(rulr.Components.Base):
	def __init__(self, rigidBodyComponent):
		super().__init__()
		self.rigidBodyComponent = rigidBodyComponent

		self.parameters.normalisedCameraMatrix = Matrix(
			np.array(
				[
					[1, 0, 0.5],
					[0, 1, 0.5],
					[0, 0, 1]
				]
			)
		)

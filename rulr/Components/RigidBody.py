import rulr.Components
from rulr.Utils.Parameters import Parameter, BoundParameter
import numpy as np
import math

class Component(rulr.Components.Base):
	def __init__(self):
		super().__init__()
		self.parameters.Translate = Parameter(np.array([0.0, 0.0, 0.0]))
		self.parameters.Rotate = BoundParameter(np.array([0.0, 0.0, 0.0]), -math.pi, math.pi)

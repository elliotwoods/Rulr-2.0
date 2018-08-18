import transforms3d
import rulr.Nodes
import rulr.Utils
from rulr.Utils.AutoGroup import AutoGroup
import rulr.Utils.Parameters
import numpy as np

class Node(rulr.Nodes.Base):
	def __init__(self):
		super().__init__()

		self.parameters.RoomBounds = AutoGroup()
		self.parameters.RoomBounds.Minimum = rulr.Utils.Parameters.Vector(np.array([-1, -1, 0], dtype=float))
		self.parameters.RoomBounds.Maximum = rulr.Utils.Parameters.Vector(np.array([1, 1, 0], dtype=float))

		pass
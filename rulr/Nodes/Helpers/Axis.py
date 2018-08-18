import transforms3d
import rulr.Nodes
import rulr.Utils
from rulr.Utils.AutoGroup import AutoGroup
import rulr.Utils.Parameters
import numpy as np

class Node(rulr.Nodes.Base):
	def __init__(self):
		super().__init__()
		
		self.parameters.Size = rulr.Utils.Parameters.Float(40)
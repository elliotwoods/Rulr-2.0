import transforms3d
import rulr.Nodes

class Node(rulr.Nodes.Base):
	def __init__(self):
		super(Node, self).__init__()

		self.addParameterBlock("Grid", {
			'roomMinimum' : [-1, -1, 0],
			'roomMaximum' : [1, 1, 2]
		})

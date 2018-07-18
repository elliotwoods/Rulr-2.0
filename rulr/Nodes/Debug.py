import transforms3d
import rulr.Nodes.Base

class Grid(rulr.Nodes.Base):
	def __init__(self):
		super(Grid, self).__init__()

		self.addParameterBlock("Grid", {
			'roomMinimum' : [-1, -1, 0],
			'roomMaximum' : [1, 1, 2]
		})

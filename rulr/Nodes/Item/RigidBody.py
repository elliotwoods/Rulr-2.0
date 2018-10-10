import rulr.Nodes
import rulr.Components.RigidBody

class Node(rulr.Nodes.Base):
	def __init__(self):
		super().__init__()
		self.components.rigid_body = rulr.Components.RigidBody.Component()
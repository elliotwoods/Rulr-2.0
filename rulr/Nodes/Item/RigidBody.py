import rulr.Nodes
import rulr.Components.RigidBody

class RigidBody(rulr.Nodes.Base):
	def __init__(self):
		super().__init__()
		self.components.rigidBody = rulr.Components.RigidBody.Component()
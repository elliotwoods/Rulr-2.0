import rulr.Nodes
import rulr.Components.RigidBody
import rulr.Components.View

class Node(rulr.Nodes.Base):
	def __init__(self):
		super().__init__()
		self.components.rigidBody = rulr.Components.RigidBody.Component()
		self.components.view = rulr.Components.View.Component(self.components.rigidBody)
import rulr.Nodes

class Node(rulr.Nodes.Base):
	"""A group of nodes"""

	def __init__(self):
		super().__init__()
		self.children = []

	def update(self):
		super().update()
		for child in self.children:
			child.update()
	
	def get_next_available_child_ID(self):
		if len(self.children) == 0:
			return 0
		else:
			childIDS = []
			for child in self.children:
				childIDS.append(child.header.ID)
			return sorted(childIDS)[-1] + 1

	def check_for_child_ID_conflicts(self):
		IDsInUse = []
		for child in self.children:
			if child.header.ID in IDsInUse:
				child.header.ID = self.get_next_available_child_ID()
			IDsInUse.append(child.header.ID)

	def deserialize(self, description):
		if 'children' in description:
			for childDescription in description['children']:
				newChildNode = rulr.Nodes.from_description(childDescription)
				self.children.append(newChildNode)
				self.check_for_child_ID_conflicts()

	def get_child_by_ID(self, childID):
		for child in self.children:
			if child.header.ID == childID:
				return child
		raise Exception("Node does not have child with ID={0}".format(childID))
	
	def get_child_by_path(self, nodePath):
		if nodePath == []:
			return self
		else:
			childNode = self.get_child_by_ID(nodePath[0])
			return childNode.get_child_by_path(nodePath[1:])

	def get_child_IDs(self):
		childIDs = []
		for child in self.children:
			childIDs.append(child.header.ID)
		return childIDs

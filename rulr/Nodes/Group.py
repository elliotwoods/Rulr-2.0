import rulr.Nodes

class Node(rulr.Nodes.Base):
	def __init__(self):
		super().__init__()
		self.children = []
	
	def getNextAvailableChildID(self):
		if len(self.children) == 0:
			return 0
		else:
			childIDS = []
			for child in self.children:
				childIDS.append(child.ID)
			return sorted(childIDS)[-1] + 1

	def checkForChildIDConflicts(self):
		IDsInUse = []
		for child in self.children:
			if child.header.ID in IDsInUse:
				child.header.ID = self.getNextAvailableChildID()
			IDsInUse.append(child.header.ID)

	def deserialize(self, description):
		if 'children' in description:
			for childDescription in description['children']:
				newChildNode = rulr.Nodes.fromDescription(childDescription)
				self.children.append(newChildNode)
				self.checkForChildIDConflicts()

	def getChildByID(self, childID):
		for child in self.children:
			if child.header.ID == childID:
				return child
		raise Exception("Node does not have child with ID={0}".format(childID))

	def getChildByPath(self, nodePath):
		if nodePath == []:
			return self
		else:
			childNode = self.getChildByID(nodePath[0])
			return childNode.getChildByPath(nodePath[1:])
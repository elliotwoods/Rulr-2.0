import rulr.Nodes
import rulr.Utils
import os
import json

SAVE_FOLDER = os.path.join(os.path.sys.argv[0], os.pardir, os.pardir, "Projects")
ROOT_NODE_JSON = "main.json"

class Application(object):
	def __init__(self):
		self.rootNode = None

	def load(self, projectFolderPath):
		absoluteProjectPath = os.path.normpath(os.path.join(SAVE_FOLDER, projectFolderPath))
		print("Loading patch from {0}".format(absoluteProjectPath))

		with open(os.path.join(absoluteProjectPath, ROOT_NODE_JSON)) as jsonFile:
			description = json.loads(jsonFile.read())
			self.rootNode = rulr.Nodes.fromDescription(description)


	def getNodeByPath(self, nodePath):
		if self.rootNode is None:
			nodePathString = rulr.Utils.nodePathToString(nodePath)
			raise Exception("Cannot get node with path {0}. Application has no root node.".format(nodePathString))
		return self.rootNode.getChildByPath(nodePath)


X = Application()
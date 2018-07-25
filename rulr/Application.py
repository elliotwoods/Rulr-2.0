import rulr.Nodes
import os
import json

SAVE_FOLDER = os.path.join(os.path.sys.argv[0], os.pardir, os.pardir, "Projects")
ROOT_NODE_JSON = "main.json"

class Application(object):
	def __init__(self):
		self.rootNode = None

	def load(self, projectFolderPath):
		absoluteProjectPath = os.path.join(SAVE_FOLDER, projectFolderPath)
		with open(os.path.join(absoluteProjectPath, ROOT_NODE_JSON)) as jsonFile:
			description = json.loads(jsonFile.read())
			self.rootNode = rulr.Nodes.fromDescription(description, None)


X = Application()
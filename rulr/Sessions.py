import os
import sys
import os.path
import json
import rulr.Nodes.Base

SAVE_FOLDER = os.path.join(os.path.sys.argv[0], os.pardir, os.pardir, "Sessions")

class Session:
	def __init__(self):
		self.rootNode = None
		self.sessionPath = None

	def isInitialised(self):
		return self.sessionPath != None and self.rootNode != None

	def begin(self, sessionPath, loadExisting):
		self.sessionPath = sessionPath
		if loadExisting:
			with open(os.path.join(self.sessionPath, 'world.json')) as file:
				description = json.load(file)
			self.rootNode = rulr.Nodes.Base.fromDescription(description)
	
	def findNode(self, nodeID):
		if self.isInitialised():
			return self.rootNode.find(nodeID)
		else:
			raise Exception("Cannot find node with ID {0}. Session has not been initialised".format(nodeID))


applicationSession = Session()

def listSessions():
	sessionFolders = []
	for currentFolder, subdirs, files in os.walk(SAVE_FOLDER):
		if 'main.json' in files:
			relativePath = os.path.relpath(currentFolder, SAVE_FOLDER)
			hasThumbnail = os.path.exists(os.path.join(SAVE_FOLDER, 'thumbnail.png'))
			sessionFolders.append({
				"relativePath" : relativePath,
				"hasThumbnail" : hasThumbnail
			})
			break
	return sessionFolders
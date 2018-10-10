import rulr.Nodes
import rulr.Utils
import os
import json
import rulr.Utils

from importlib import reload
import sys

import tkinter as tk

SAVE_FOLDER = os.path.join(os.path.sys.argv[0], os.pardir, os.pardir, "Projects")
ROOT_NODE_JSON = "main.json"

class Application(object):
	def __init__(self):
		self.rootNode = None

		root = tk.Tk()
		root.withdraw()

	def update(self):
		if self.has_root_node():
			self.rootNode.update()

	def load_project(self, projectFolderPath):
		absoluteProjectPath = os.path.normpath(os.path.join(SAVE_FOLDER, projectFolderPath))
		print("Loading patch from {0}".format(absoluteProjectPath))

		with open(os.path.join(absoluteProjectPath, ROOT_NODE_JSON)) as jsonFile:
			description = json.loads(jsonFile.read())
			self.rootNode = rulr.Nodes.from_description(description)

	def get_node_by_path(self, nodePath):
		if self.rootNode is None:
			nodePathString = rulr.Utils.nodePathToString(nodePath)
			raise Exception("Cannot get node with path {0}. Application has no root node.".format(nodePathString))
		return self.rootNode.get_child_by_path(nodePath)

	def has_root_node(self):
		return self.rootNode is not None

	def list_projects(self, folderPath):
		selectedPath = str.replace(folderPath, "\\", "/")
		
		if len(selectedPath) > 0:
			if selectedPath[0] == '/':
				selectedPath = selectedPath[1:]

		folderPath = os.path.join(rulr.Application.SAVE_FOLDER, selectedPath)

		result = {
			"subFolders" : [],
			"projects" : [],
			"selectedPath" : selectedPath
		}

		for folderEntry in os.listdir(folderPath):
			totalPathOfFolderEntry = os.path.join(folderPath, folderEntry)
			if os.path.isdir(totalPathOfFolderEntry):
				folderContents = os.listdir(totalPathOfFolderEntry)
				
				relativePath = os.path.relpath(totalPathOfFolderEntry, rulr.Application.SAVE_FOLDER)
				folderEntryDescription = {
					"name" : folderEntry,
					"path" : str.replace(relativePath, "\\", "/")
				}
				

				if 'main.json' in folderContents:
					result["projects"].append(folderEntryDescription)
				else:
					result["subFolders"].append(folderEntryDescription)

		return result

instance = Application()

def get_application_export(success_callback, success_object_callback, exception_callback):
	application_export = rulr.Utils.export_object(instance)
	success_object_callback.Call(application_export)

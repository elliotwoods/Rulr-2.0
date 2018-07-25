import os

import rulr
import rulr.Application
import rulr.Resources

class Resource(rulr.Resources.Base):
	def defaultRequestParameters(self):
		return {
			"folderPath" : ""
		}

	def perform(self, request):
		selectedPath = str.replace(request['folderPath'], "\\", "/")
		
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
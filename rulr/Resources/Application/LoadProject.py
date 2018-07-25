import os

import rulr
import rulr.Resources
import rulr.Application

class Resource(rulr.Resources.Base):
	def perform(self, request):
		application = rulr.Application.X

		application.load(request["projectFolderPath"])

		return {}
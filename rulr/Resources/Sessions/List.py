import rulr

import rulr.Sessions

import rulr.Resources
class Resource(rulr.Resources.Base):
	def on_get(self, req, resp):			
		resp.media = {
			"success" : True,
			"content" : rulr.Sessions.listSessions()
		}
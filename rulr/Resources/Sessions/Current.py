import rulr

import rulr.Sessions

import rulr.Resources
class Resource(rulr.Resources.Base):
	def on_get(self, req, resp):
		applicationSession = rulr.Sessions.applicationSession
		sessionAlive = applicationSession.sessionPath != None

		if sessionAlive:
			responseObject = {
				'alive' : True,
				'sessionPath' : applicationSession.sessionPath,
				'rootNode' : {}
			}
		else:
			responseObject = {
				'alive' : False
			}
			
		resp.media = responseObject
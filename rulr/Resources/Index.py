import falcon
import rulr.Resources

class Resource(rulr.Resources.Base):
	def __init__(self):
		self.url = '/'
		super()
	
	def on_get(self, req, resp):
		raise falcon.HTTPFound("/Client/html/index.html")

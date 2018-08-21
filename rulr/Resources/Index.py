import falcon
import rulr.Resources

class Resource(rulr.Resources.Base):
	def __init__(self):
		self.url = '/'
		super()
	
	def perform(self, request):
		raise falcon.HTTPFound("/rulr-web/html/index.html")

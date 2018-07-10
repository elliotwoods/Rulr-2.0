import falcon

class Resource:
	def on_get(self, req, resp):
		raise falcon.HTTPFound("/Client/html/index.html")

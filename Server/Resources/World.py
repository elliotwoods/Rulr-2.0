class Resource:
	def on_get(self, req, resp):
		responseObject = {
			'test' : (
				"multiple"
				"line"
				"what?"
			)
		}
		resp.media = responseObject
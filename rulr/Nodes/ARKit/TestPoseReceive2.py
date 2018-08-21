import rulr.Nodes
import rulr.Components.RigidBody
import rulr.Components.View

import falcon
from wsgiref import simple_server
import json

import atexit
import socket
import threading

SERVER_PORT = 8000 + 0

def try_port(port):
	print("Testing if port {} is available".format(port))
	sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
	result = False
	try:
		sock.bind(("0.0.0.0", port))
		result = True
	except:
		print("Port is in use")
	sock.close()
	return result


class Node(rulr.Nodes.Base):
	def __init__(self):
		super().__init__()

		self.components.RigidBody = rulr.Components.RigidBody.Component()
		self.components.View = rulr.Components.View.Component(self.components.RigidBody)

		self.parameters.CameraMatrix = rulr.Utils.Parameters.Matrix([
			[1920, 0, 960],
			[0, 1920, 540],
			[0, 0, 1]
		])

		self.parameters.Transform = rulr.Utils.Parameters.Matrix([
			[1, 0, 0, 0],
			[0, 1, 0, 1],
			[0, 0, 1, 0],
			[0, 0, 0, 1]
		])

		# Open the web server
		self.falcon_API = falcon.API()
		self.falcon_API.req_options.auto_parse_form_urlencoded = True

		self.falcon_API.add_route('/meta/{session}/{pose}/', self)
		# self.falcon_API.add_route('/meta/{session}/{pose}/', self)

		if try_port(SERVER_PORT):
			self.httpd = simple_server.make_server(
				'0.0.0.0', SERVER_PORT, self.falcon_API)

			# Start the server thread
			print("Serving on port {}".format(SERVER_PORT))
			#self.httpd.serve_forever()
			self.http_thread = threading.Thread(target=self.httpd.serve_forever)
			self.http_thread.start()
			atexit.register(self.close)
		else:
			raise(Exception("Cannot bind to port {}".format(SERVER_PORT)))

	def close(self):
		# Close the web server
		self.httpd.shutdown()

	def on_post(self, request, response, session, pose):
		response.status = falcon.HTTP_200
		print("session {} pose {}".format(session, pose))

		print(request.content_type)
		contentString = request.stream.read()		
		content = json.loads(contentString)

		self.update_action_queue.put(lambda: self.process_incoming(content))
	
	def process_incoming(self, content):
		self.parameters.Transform.value.flat = content['transform']
		self.parameters.Transform.value = self.parameters.Transform.value.transpose()
		self.parameters.Transform.commit()

		self.parameters.CameraMatrix.value.flat = content['intrinsics']
		self.parameters.CameraMatrix.value = self.parameters.CameraMatrix.value.transpose()
		self.parameters.CameraMatrix.commit()

import rulr.Nodes
import rulr.Components.RigidBody
import rulr.Components.View
from rulr.Utils.Parameters import Image

import falcon
from wsgiref import simple_server
import json

import atexit
import socket
import threading
import base64
import cv2

import numpy as np

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
	"""Receive data from ARKIt PoseSender"""
	
	def __init__(self):
		super().__init__()

		self.components.rigid_body = rulr.Components.RigidBody.Component()
		self.components.view = rulr.Components.View.Component(self.components.rigid_body)

		self.parameters.image = Image()

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
		transform_matrix = np.ndarray([4,4], dtype=float)
		transform_matrix.flat = content['transform']
		transform_matrix = transform_matrix.transpose()
		self.components.rigid_body.parameters.transform.set(transform_matrix)
		self.components.rigid_body.parameters.transform.commit()

		# Set the resolution before the camera_matrix (since camera_matrix interacts with normalized_camera_matrix via resolution)
		image_binary = base64.b64decode(content['image'])
		image_binary_np = np.fromstring(image_binary, np.uint8)
		image = cv2.imdecode(image_binary_np, cv2.IMREAD_COLOR)
		
		self.parameters.image.set(image)
		self.parameters.image.commit()

		self.components.view.parameters.resolution.set([image.shape[1], image.shape[0]])
		self.components.view.parameters.resolution.commit()

		camera_matrix = np.ndarray([3,3], dtype=float)
		camera_matrix.flat = content['intrinsics']
		camera_matrix = camera_matrix.transpose()
		self.components.view.parameters.camera_matrix.set(camera_matrix)
		self.components.view.parameters.camera_matrix.commit()
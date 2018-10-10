import rulr.Nodes
import rulr.Components.RigidBody
import rulr.Components.View
import rulr.Application
from rulr.Utils.Parameters import Image, Bool, Matrix, Float

import falcon
from wsgiref import simple_server
import json
import logging

import atexit
import socket
import threading
import base64
import cv2
import cv2.aruco

import IPython

import numpy as np

from rulr.Math import *

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

		self.parameters.receive_enabled = Bool(False)
		self.parameters.find_charuco_enabled = Bool(False)
		self.parameters.image = Image()
		self.parameters.track_camera = Bool(True)

		self.parameters.board_transform = Matrix(make_identity_matrix())
		self.parameters.board_reprojection_error = Float(0.0)

		self.parameters.relative_transform = Matrix(make_identity_matrix())

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

			# Silent
			werkzeugLog = logging.getLogger('werkzeug')
			werkzeugLog.setLevel(logging.WARNING)
		else:
			raise(Exception("Cannot bind to port {}".format(SERVER_PORT)))

		self.marker_dictionary = cv2.aruco.getPredefinedDictionary(cv2.aruco.DICT_4X4_50)
		self.charuco_board = cv2.aruco.CharucoBoard_create(11, 8, 0.06, 0.03, self.marker_dictionary)

		self.actions.set_relative_transform = self.set_relative_transform

		self.response_content = None

	def update(self):
		super().update()

		# Create some basic points
		preview_points__op = [
			np.array([0.0, 0.0, 0.0]),
			np.array([0.0, 0.0, 1.0]),
			np.array([0.0, 0.0, 2.0])
		]

		# Transform them into ARKit space
		preview_points__ark = [apply_matrix(self.parameters.relative_transform.value, point__op) for point__op in preview_points__op]
		preview_points__ark_list = [list(x) for x in preview_points__ark]

		self.response_content = {
			"preview" : {
				"points" : preview_points__ark_list
			}
		}

	def close(self):
		# Close the web server
		self.httpd.shutdown()

	def on_post(self, request, response, session, pose):
		#print("session {} pose {}".format(session, pose))
		#print(request.content_type)

		# action
		contentString = request.stream.read()		
		content = json.loads(contentString)
		self.update_action_queue.put(lambda: self.process_incoming(content))

		# response
		response.status = falcon.HTTP_200
		response.body = json.dumps(self.response_content)
		response.content_type = falcon.MEDIA_JSON
		response.status = falcon.HTTP_200
	
	def process_incoming(self, content):
		# This is run on the next update cycle

		if not self.parameters.receive_enabled.value:
			return

		transform_matrix = np.ndarray([4,4], dtype=float)
		transform_matrix.flat = content['transform']
		transform_matrix = transform_matrix.transpose()
		self.components.rigid_body.parameters.transform.set(transform_matrix)
		self.components.rigid_body.parameters.transform.commit()

		# Set the resolution before the camera_matrix (since camera_matrix interacts with normalized_camera_matrix via resolution)
		image_binary = base64.b64decode(content['image'])
		image_binary_np = np.fromstring(image_binary, np.uint8)
		image = cv2.imdecode(image_binary_np, cv2.IMREAD_COLOR)

		if self.parameters.find_charuco_enabled.value:
			#perform some CV on the image
			grayscale = cv2.cvtColor(image, cv2.COLOR_RGB2GRAY)
			found_markers_result = cv2.aruco.detectMarkers(grayscale, self.marker_dictionary)
			if len(found_markers_result[0]) > 4:
				interpolated_corners_result = cv2.aruco.interpolateCornersCharuco(found_markers_result[0], found_markers_result[1], grayscale, self.charuco_board)
				cv2.aruco.drawDetectedMarkers(image, found_markers_result[0], found_markers_result[1])

				object_points = []
				for chessboard_corner_index in interpolated_corners_result[2]:
					object_points.append(self.charuco_board.chessboardCorners[chessboard_corner_index])
				object_points = np.array(object_points, dtype=np.float32)
				
				image_points = interpolated_corners_result[1]
				camera_matrix = self.components.view.parameters.camera_matrix.get()

				success, rotation_vector, translation_vector = cv2.solvePnP(object_points, image_points, camera_matrix, None)

				reprojection, _ = cv2.projectPoints(object_points, rotation_vector, translation_vector, camera_matrix, None)
				rmsError = np.sqrt(np.mean(np.square(reprojection - image_points)))

				self.parameters.board_transform.value = make_rigid_body_transform_matrix(rotation_vector, translation_vector) * self.rigid_body.parameters.transform.value
				self.parameters.board_transform.commit()

				self.parameters.board_reprojection_error.value = float(rmsError)
				self.parameters.board_reprojection_error.commit()
		
		self.parameters.image.set(image)
		self.parameters.image.commit()

		self.components.view.parameters.resolution.set([image.shape[1], image.shape[0]])
		self.components.view.parameters.resolution.commit()

		camera_matrix = np.ndarray([3,3], dtype=float)
		camera_matrix.flat = content['intrinsics']
		camera_matrix = camera_matrix.transpose()
		self.components.view.parameters.camera_matrix.set(camera_matrix)
		self.components.view.parameters.camera_matrix.commit()

	def set_relative_transform(self):
		# Create a transform which can be applied to points to transfom them into ARKit space (not current camera view space)

		board_in_openpose_node = rulr.Application.instance.get_node_by_path([4])
		board_in_openpose_transform = board_in_openpose_node.components.rigid_body.parameters.transform.value
		board_in_arkit_transform = self.parameters.board_transform.value

		self.parameters.relative_transform.value = np.linalg.inv(board_in_openpose_transform) * board_in_arkit_transform
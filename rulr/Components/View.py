import rulr.Components
from rulr.Utils.Parameters import Float, Vector, BoundVector, Matrix, Property
from rulr.Utils.AutoGroup import AutoGroup
import rulr.Utils
import rulr.Math

import numpy as np
import math

class Component(rulr.Components.Base):
	"""A perspective view (e.g. a camera or a projector)"""

	def __init__(self, rigid_body_component):
		super().__init__()
		self.rigid_body_component = rigid_body_component

		self.parameters.normalized_camera_matrix = Matrix(
			[
				[1, 0, 0.5],
				[0, 1, 0.5],
				[0, 0, 1]
			]
		)

		self.parameters.resolution = Vector([1920, 1080])

		self.parameters.camera_matrix = Matrix(Property(self.camera_matrix_get, self.camera_matrix_set))
		self.parameters.normalized_camera_matrix.on_set.append(self.update_camera_matrices)
		self.parameters.resolution.on_set.append(self.update_camera_matrices)

		self.parameters.clipped_projection_matrix = Matrix(Property(self.clipped_projection_matrix_get))

		self.parameters.clip_planes = Vector([0.05, 10])
		self.parameters.clip_planes.on_set.append(lambda: self.parameters.clipped_projection_matrix.commit())


	def camera_matrix_get(self):
		camera_matrix = self.parameters.normalized_camera_matrix.value.copy()
		camera_matrix[0] *= self.parameters.resolution.value[0]
		camera_matrix[1] *= self.parameters.resolution.value[1]
		return camera_matrix
	
	def camera_matrix_set(self, new_camera_matrix):
		self.parameters.normalized_camera_matrix.value[0] = new_camera_matrix[0] / self.parameters.resolution.value[0]
		self.parameters.normalized_camera_matrix.value[1] = new_camera_matrix[1] / self.parameters.resolution.value[1]
		self.parameters.normalized_camera_matrix.value[2] = new_camera_matrix[2]
		self.parameters.normalized_camera_matrix.commit()

	def clipped_projection_matrix_get(self):
		camera_matrix = self.camera_matrix_get()
		resolution_width = self.parameters.resolution.value[0]
		resolution_height = self.parameters.resolution.value[1]
		near_clip = self.parameters.clip_planes.value[0]
		far_clip = self.parameters.clip_planes.value[1]

		return rulr.Math.make_clipped_projection_matrix(camera_matrix, resolution_width, resolution_height, near_clip, far_clip)
	
	def update_camera_matrices(self):
		self.parameters.camera_matrix.commit()
		self.parameters.clipped_projection_matrix.commit()
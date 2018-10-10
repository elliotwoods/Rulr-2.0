import rulr.Components
from rulr.Utils.Parameters import Vector, BoundVector, Matrix, Bool, Float
from rulr.Utils.AutoGroup import AutoGroup
import numpy as np
import math

import rulr.Math

from tkinter import filedialog
import cv2

class Component(rulr.Components.Base):
	"""A rigid body transform (translation, rotation)"""
	def __init__(self):
		super().__init__()

		self.parameters.transform = Matrix([
			[1, 0, 0, 0],
			[0, 1, 0, 0],
			[0, 0, 1, 0],
			[0, 0, 0, 1]
		])

		self.parameters.trail = AutoGroup()
		self.parameters.trail.style = AutoGroup()
		self.parameters.trail.style.line = Bool(True)
		self.parameters.trail.style.curve = Bool(True)
		self.parameters.trail.style.axes = Bool(True)
		self.parameters.trail.duration__frames = Float(10)

		# self.parameters.translate = Vector([0.0, 0.0, 0.0])
		# self.parameters.rotate = BoundVector([0.0, 0.0, 0.0], -math.pi, math.pi)

		self.actions.load_openCV_transform = self.load_openCV_transform

	def load_openCV_transform(self):
		file_path = filedialog.askopenfilename(title = "Select OpenCV transform file")
		if file_path is not None:
			
			transform_file = cv2.FileStorage(file_path, cv2.FILE_STORAGE_READ)
			translation = transform_file.getNode('translation').mat()
			rotation_vector = transform_file.getNode('rotationVector').mat()
			transform_file.release()

			transform_matrix = rulr.Math.make_rigid_body_transform_matrix(rotation_vector, translation)
			self.parameters.transform.value = transform_matrix
			self.parameters.transform.commit()
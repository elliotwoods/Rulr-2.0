import numpy as np
import cv2
import rulr.Math._Essentials

def make_clipped_projection_matrix(camera_matrix, resolution_width, resolution_height, near_clip, far_clip):
	fx_n = camera_matrix[0, 0] / resolution_width
	fy_n = camera_matrix[1, 1] / resolution_height
	cx_n = camera_matrix[0, 2] / resolution_width
	cy_n = camera_matrix[1, 2] / resolution_height

#see https://github.com/elliotwoods/ofxCvMin/blob/master/src/ofxCvMin/Helpers.cpp#L42
	matrix = np.array([
		[2 * fx_n, 		0, 			0, 		2 * cx_n - 1.0],
		[0, 			2 * fy_n, 	0, 		2 * cy_n - 1.0],
		[0, 			0, 			-1, 		-0.2],
		[0, 			0, 			-1, 		0]
	], dtype= np.float32)

#see http://www.songho.ca/opengl/gl_projectionmatrix.html
	matrix[2,2] = - (far_clip + near_clip) / (far_clip - near_clip)
	matrix[2,3] = - 2 * far_clip * near_clip / (far_clip - near_clip)
	
	return matrix

#https://github.com/elliotwoods/ofxCvMin/blob/master/src/ofxCvMin/Helpers.cpp#L10
def make_rigid_body_transform_matrix(rotation, translation_vector, inverse = False):
	if rotation.shape == (3, 3):
		rot3x3 = rotation
	else:
		rot3x3, _ = cv2.Rodrigues(rotation)
	
	matrix = rulr.Math._Essentials.make_identity_matrix()
	
	matrix[0:3, 0:3] = rot3x3
	matrix[0:3, 3] = translation_vector.transpose()

	if inverse:
		matrix = np.linalg.inv(matrix)
	return matrix

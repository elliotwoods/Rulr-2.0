import numpy as np

def make_identity_matrix():
	return np.eye(4, 4, dtype=np.float32)

def apply_matrix(matrix, vector):
	if vector.size == 3:
		vector = np.append(vector, 1) # makes a copy
		transformed_vector = np.dot(matrix, vector)
		return transformed_vector[0:3]
	else:
		return np.dot(matrix, vector)
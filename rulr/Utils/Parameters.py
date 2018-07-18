class Parameter:
	def __init__(self, name, value):
		self.name = name
		self.value = value

class ParameterGroup:
	def __init__(self, name):
		self.name = name
		self.children = {}
	
	@classmethod
	def fromDescription(classType, name, description):
		parameterGroup = ParameterGroup(name)

		for name in description:
			content = description[name]

			if(isinstance(content, dict)):
				# This is a sub-group
				child = ParameterGroup.fromDescription(name, content)
			else:
				child = Parameter(name, content)
			
			parameterGroup.children[name] = child
			
		return parameterGroup

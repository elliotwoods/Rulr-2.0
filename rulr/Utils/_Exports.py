import sys
import traceback
import weakref
import numpy as np

BASIC_TYPES = [int, float, dict, list, str, bool]
EXPORTABLE_PROPERTY_TYPES = BASIC_TYPES + [np.ndarray]

exported_objects = {}

def format_exception(exception):
	# Get the traceback info
	exc_tb = sys.exc_info()[2]
	tracebackList = traceback.extract_tb(exc_tb, 5)

	formattedTracebackList = []
	for tracebackEntry in tracebackList:
		formattedTracebackList.append({
			"name" : tracebackEntry.name,
			"filename" : tracebackEntry.filename,
			"lineNumber" : tracebackEntry.lineno,
			"line" : tracebackEntry.line
		})

	formattedException = {
		"type" : type(exception),
		"args" : exception.args,
		"message" : str(exception),
		"traceback" : formattedTracebackList
	}

	return formattedException

def export_object(instance):
	# object is callable, needs wrapping

	object_id = None

	# Check if we have an existing wrapping for this object
	for key, value in exported_objects.items():
		if value is instance:
			object_id = key

	# If no existing wrapping, create one
	if object_id is None:
		object_id = len(exported_objects)
		exported_objects[object_id] = weakref.ref(instance)

	# Get callable methods (when we use export_method, we tag an attribute onto those methods - look for this)
	attributes = dir(instance)
	method_names = [att for att in attributes if hasattr(getattr(instance, att), "exported_method")]

	property_names = [att for att in attributes if type(getattr(instance, att)) in EXPORTABLE_PROPERTY_TYPES]
	property_names = [x for x in property_names if x[0] != '_'] # Trim 'private' variables

	#TODO : just export everything automatically

	return {
		"object_id" : object_id,
		"object_creation_info" : {
			"module" : instance.__module__[len("rulr."):],
			"class" : instance.__class__.__name__
		},
		"method_names" : method_names,
		"property_names" : property_names
	}

#TODO : remove boiler plate from these 2 function wrappers
def export_method(method):
	'''Wrapper to handle returns and exceptions'''

	def wrappedMethod(self, successCallback, successObjectCallback, exceptionCallback, *args):
		global exported_objects
		try:
			result = method(self, *args)
			basic_types = BASIC_TYPES
			if type(result) in basic_types or result is None:
				# return the value directly
				successCallback.Call(result)
			else:
				# object is callable, needs wrapping
				successObjectCallback.Call(export_object(result))
				
		except Exception as exception:		
			exceptionCallback.Call(format_exception(exception))

	setattr(wrappedMethod, "exported_method", True)
	return wrappedMethod

def call_exported_object_method(success_callback, success_object_callback, exception_callback, object_id, method_name, *args):
	global exported_objects

	#TODO : This exception won't succesfully be passed to JS right now
	if not object_id in exported_objects:
		raise Exception("object_id {0} not found in exported_objects".format(object_id))
	instance = exported_objects[object_id]()
	method = getattr(instance, method_name)
	method(success_callback, success_object_callback, exception_callback, *args)

def to_basic_type(instance):
	if isinstance(instance, np.ndarray):
		return instance.tolist()
	return str(instance)

def call_exported_object_property_get(success_callback, success_object_callback, exception_callback, object_id, property_name):
	global exported_objects

	try:
		if not object_id in exported_objects:
			raise Exception("object_id {0} not found in exported_objects".format(object_id))
		instance = exported_objects[object_id]()
		property = getattr(instance, property_name)
		if not type(property) in BASIC_TYPES:
			property = to_basic_type(property)
		success_callback.Call(property)
	except Exception as exception:
		exception_callback.Call(format_exception(exception))

def set_advanced_type(instance, value):
	if isinstance(instance, np.ndarray):
		instance[:] = value
	
def call_exported_object_property_set(success_callback, success_object_callback, exception_callback, object_id, property_name, value):
	global exported_objects

	try:
		if not object_id in exported_objects:
			raise Exception("object_id {0} not found in exported_objects".format(object_id))
		instance = exported_objects[object_id]()
		property = getattr(instance, property_name)
		if not type(property) in BASIC_TYPES:
			set_advanced_type(property, value)
		else:
			setattr(instance, property_name, value)
		success_callback.Call(None)
	except Exception as exception:
		exception_callback.Call(format_exception(exception))
import sys
import traceback
import weakref
import numpy as np

BASIC_TYPES = [int, float, dict, list, str, bool]
CUSTOM_EXPORTS = [np.ndarray]

EXPORTABLE_PROPERTY_TYPES = BASIC_TYPES + CUSTOM_EXPORTS

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
		if value() == instance:
			object_id = key

	# If no existing wrapping, create one
	if object_id is None:
		object_id = len(exported_objects)
		exported_objects[object_id] = weakref.ref(instance)

	# TODO : Each time the object is 'reexported' we rebuild the property and method names - let's reduce this

	# Get callable methods
	attributes = dir(instance)
	attributes = [x for x in attributes if x[0] != '_'] # Trim 'private' attributes

	method_names = [att for att in attributes if callable(getattr(instance, att))]
	property_names = [att for att in attributes if not att in method_names]

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

def to_basic_type(instance):
	if isinstance(instance, np.ndarray):
		return instance.tolist()
	return str(instance)

def set_from_advanced_type(instance, value):
	if isinstance(instance, np.ndarray):
		instance[:] = value

def return_object(instance, success_callback, success_object_callback):
	instance_type = type(instance)
	if instance_type in BASIC_TYPES or instance is None:
		# return the value directly
		success_callback.Call(instance)
	elif instance_type in CUSTOM_EXPORTS:
		translated_instance = to_basic_type(instance)
		success_callback.Call(translated_instance)
	else:
		# object is callable, needs wrapping
		exported_object = export_object(instance)
		success_object_callback.Call(exported_object)

def call_exported_object_method(success_callback, success_object_callback, exception_callback, object_id, method_name, *args):
	global exported_objects

	#TODO : This exception won't succesfully be passed to JS right now
	if not object_id in exported_objects:
		raise Exception("object_id {0} not found in exported_objects".format(object_id))
	instance = exported_objects[object_id]()
	method = getattr(instance, method_name)
	try:
		result = method(*args)
		return_object(result, success_callback, success_object_callback)
	except Exception as exception:		
		exception_callback.Call(format_exception(exception))
	

def call_exported_object_property_get(success_callback, success_object_callback, exception_callback, object_id, property_name):
	global exported_objects

	try:
		if not object_id in exported_objects:
			raise Exception("object_id {0} not found in exported_objects".format(object_id))
		instance = exported_objects[object_id]()
		property_ = getattr(instance, property_name)
		return_object(property_, success_callback, success_object_callback)

	except Exception as exception:
		exception_callback.Call(format_exception(exception))
	
def call_exported_object_property_set(success_callback, success_object_callback, exception_callback, object_id, property_name, value):
	global exported_objects

	try:
		if not object_id in exported_objects:
			raise Exception("object_id {0} not found in exported_objects".format(object_id))
		instance = exported_objects[object_id]()
		property_ = getattr(instance, property_name)
		
		property_type = type(property_)

		if property_type in BASIC_TYPES:
			setattr(instance, property_name, value)
		elif property_type in CUSTOM_EXPORTS:
			set_from_advanced_type(property_, value)
		else:
			raise Exception("Cannot call set on property of type [{}]".format(str(property_type)))
		
		success_callback.Call(None)

	except Exception as exception:
		exception_callback.Call(format_exception(exception))
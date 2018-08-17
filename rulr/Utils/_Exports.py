import sys
import traceback
import weakref

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
	#TODO : just export everything automatically

	return {
		"object_id" : object_id,
		"method_names" : method_names
	}

#TODO : remove boiler plate from these 2 function wrappers
def export_method(method):
	'''Wrapper to handle returns and exceptions'''

	def wrappedMethod(self, successCallback, successObjectCallback, exceptionCallback, *args):
		global exported_objects
		try:
			result = method(self, *args)
			basic_types = [int, float, dict, list, str, bool]
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

def call_exported_object(success_callback, success_object_callback, exception_callback, object_id, method_name, *args):
	global exported_objects

	if not object_id in exported_objects:
		raise Exception("object_id {0} not found in exported_objects".format(object_id))
	instance = exported_objects[object_id]()
	method = getattr(instance, method_name)
	method(success_callback, success_object_callback, exception_callback, *args)
import sys
import traceback

#TODO : remove boiler plate from these 2 function wrappers
def export_method(method):
	'''Wrapper to handle returns and exceptions'''

	def wrappedMethod(self, successCallback, exceptionCallback, *args):
		try:
			result = method(self, *args)
			successCallback.Call(result)
		except Exception as exception:
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
		
			exceptionCallback.Call(formattedException)

	return wrappedMethod

def export_function(function):
	'''Wrapper to handle returns and exceptions'''
	
	def wrappedFunction(successCallback, exceptionCallback, *args):
		try:
			result = function(args)
			successCallback.Call(result)
		except Exception as exception:
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
		
			exceptionCallback.Call(formattedException)

	return wrappedFunction
	
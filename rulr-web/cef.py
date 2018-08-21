# Tutorial example. Doesn't depend on any third party GUI framework.
# Tested with CEF Python v57.0+

from cefpython3 import cefpython as cef
import base64
import platform
import sys
import os
import threading


def main():
	check_versions()
	sys.excepthook = cef.ExceptHook  # To shutdown all CEF processes on error
	# To change user agent use either "product_version"
	# or "user_agent" options. Explained in Tutorial in
	# "Change user agent string" section.
	settings = {
		# "product_version": "MyProduct/10.00",
		# "user_agent": "MyAgent/20.00 MyProduct/10.00",
		"remote_debugging_port": 49152,
		# "resources_dir_path" : os.path.abspath('./')
	}
	cef.Initialize(settings=settings)
	set_global_handler()
	browser = cef.CreateBrowserSync(url='http://localhost:4000/rulr-web/html/index.html',
									window_title="Rulr 2.0")
	set_client_handlers(browser)
	
	# This is buggy right now - causes double drawing
	# cef.DpiAware.SetProcessDpiAware() 
	
	# set_javascript_bindings(browser)
	cef.MessageLoop()
	cef.Shutdown()


def check_versions():
	ver = cef.GetVersion()
	print("[tutorial.py] CEF Python {ver}".format(ver=ver["version"]))
	print("[tutorial.py] Chromium {ver}".format(ver=ver["chrome_version"]))
	print("[tutorial.py] CEF {ver}".format(ver=ver["cef_version"]))
	print("[tutorial.py] Python {ver} {arch}".format(
		ver=platform.python_version(),
		arch=platform.architecture()[0]))
	assert cef.__version__ >= "57.0", "CEF Python v57.0+ required to run this"


def html_to_data_uri(html, js_callback=None):
	# This function is called in two ways:
	# 1. From Python: in this case value is returned
	# 2. From Javascript: in this case value cannot be returned because
	#    inter-process messaging is asynchronous, so must return value
	#    by calling js_callback.
	html = html.encode("utf-8", "replace")
	b64 = base64.b64encode(html).decode("utf-8", "replace")
	ret = "data:text/html;base64,{data}".format(data=b64)
	if js_callback:
		js_print(js_callback.GetFrame().GetBrowser(),
				 "Python", "html_to_data_uri",
				 "Called from Javascript. Will call Javascript callback now.")
		js_callback.Call(ret)
	else:
		return ret


def set_global_handler():
	# A global handler is a special handler for callbacks that
	# must be set before Browser is created using
	# SetGlobalClientCallback() method.
	global_handler = GlobalHandler()
	cef.SetGlobalClientCallback("OnAfterCreated",
								global_handler.OnAfterCreated)


def set_client_handlers(browser):
	client_handlers = [LoadHandler(), DisplayHandler()]
	for handler in client_handlers:
		browser.SetClientHandler(handler)


def set_javascript_bindings(browser):
	external = External(browser)
	bindings = cef.JavascriptBindings(
		bindToFrames=False, bindToPopups=False)
	bindings.SetProperty("python_property", "This property was set in Python")
	bindings.SetProperty("cefpython_version", cef.GetVersion())
	bindings.SetFunction("html_to_data_uri", html_to_data_uri)
	bindings.SetObject("external", external)
	bindings.SetFunction()
	browser.SetJavascriptBindings(bindings)


def js_print(browser, lang, event, msg):
	# Execute Javascript function "js_print"
	browser.ExecuteFunction("js_print", lang, event, msg)


class GlobalHandler(object):
	def OnAfterCreated(self, browser, **_):
		"""Called after a new browser is created."""
		# DOM is not yet loaded. Using js_print at this moment will
		# throw an error: "Uncaught ReferenceError: js_print is not defined".
		# We make this error on purpose. This error will be intercepted
		# in DisplayHandler.OnConsoleMessage.
		js_print(browser, "Python", "OnAfterCreated",
				 "This will probably never display as DOM is not yet loaded")
		# Delay print by 0.5 sec, because js_print is not available yet
		args = [browser, "Python", "OnAfterCreated",
				"(Delayed) Browser id="+str(browser.GetIdentifier())]
		threading.Timer(0.5, js_print, args).start()


class LoadHandler(object):
	def OnLoadingStateChange(self, browser, is_loading, **_):
		"""Called when the loading state has changed."""
		if not is_loading:
			# Loading is complete. DOM is ready.
			js_print(browser, "Python", "OnLoadingStateChange",
					 "Loading is complete")

			js_print(browser, "Python", "Dictionary", {"Key": "Value"})
			js_print(browser, "Python", "Array", [0, 1, 2, 3])


class DisplayHandler(object):
	def OnConsoleMessage(self, browser, message, **_):
		"""Called to display a console message."""
		# This will intercept js errors, see comments in OnAfterCreated
		if "error" in message.lower() or "uncaught" in message.lower():
			# Prevent infinite recurrence in case something went wrong
			if "js_print is not defined" in message.lower():
				if hasattr(self, "js_print_is_not_defined"):
					print("Python: OnConsoleMessage: "
						  "Intercepted Javascript error: "+message)
					return
				else:
					self.js_print_is_not_defined = True
			# Delay print by 0.5 sec, because js_print may not be
			# available yet due to DOM not ready.
			args = [browser, "Python", "OnConsoleMessage",
					"(Delayed) Intercepted Javascript error: <i>{error}</i>"
					.format(error=message)]
			threading.Timer(0.5, js_print, args).start()


class External(object):
	def __init__(self, browser):
		self.browser = browser

	def test_multiple_callbacks(self, js_callback):
		"""Test both javascript and python callbacks."""
		js_print(self.browser, "Python", "test_multiple_callbacks",
				 "Called from Javascript. Will call Javascript callback now.")

		def py_callback(msg_from_js):
			js_print(self.browser, "Python", "py_callback", msg_from_js)
		js_callback.Call("String sent from Python", py_callback)


if __name__ == '__main__':
	main()

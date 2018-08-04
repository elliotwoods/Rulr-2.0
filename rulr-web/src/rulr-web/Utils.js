export function request(url, requestData, responseFunction, errorFunction = (error) => { }) {
	$.ajax({
		url: url,
		data: requestData,
		success: (response) => {
			if (response.success) {
				responseFunction(response.content);
			}
		},
		error: (request, errorType, errorString) => {
			errorFunction({
				request: request,
				errorType: errorType,
				errorString: errorString
			});
		}
	});
}

export async function asyncForEach(array, action) {
	for (let index = 0; index < array.length; index++) {
		await action(array[index], index, array);
	}
}

export async function asyncRequest(url, requestData = null, responseFunction = null, errorFunction = (error) => { }) {
	return new Promise((resolve) => {
		request(url, requestData, (response) => {
			if(responseFunction instanceof Function) {
				responseFunction(response);
			}
			resolve();
		}, (error) => {
			errorFunction(error);
			resolve();
		})
	})
}

export function guid() {
	function s4() {
		return Math.floor((1 + Math.random()) * 0x10000)
			.toString(16)
			.substring(1);
	}
	return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

export var sessionID = guid();

var loadedModulePaths = [];

export async function fromViewDescriptionAsync(description) {
	var modulePath = './' + description.module.split('.').join('/') + '.js';

	// For each session, ensure a hard reload
	if(!loadedModulePaths.includes(modulePath)) {
		var absolutePath = '/Client/src/rulr-web/' + modulePath.substring(2);
		var response = await $.ajax({
			url : absolutePath,
			processData: false,
			cache : false,
			dataType: 'text'
		});
		loadedModulePaths.push(modulePath);
	}

	var module = await import(modulePath);
	var newInstance = eval(`new module.${description.class}()`);

	// Setup Viewable characteristics
	{
		newInstance.module = description.module;
		newInstance.class = description.class;
	}

	if(typeof newInstance.updateViewDescriptionAsync === 'function') {
		await newInstance.updateViewDescriptionAsync(description.content);
	}
	else {
		throw(`${description.module}::${description.class} does not implement updateViewDescriptionAsync`);
	}

	return newInstance;
}

export function formatNodePath(nodePath) {
	return '/'.join(nodePath);
}

//from https://stackoverflow.com/questions/7225407/convert-camelcasetext-to-sentence-case-text/38635498
export function camelCapsToSentanceCaps(camelCapsName) {
	var result = camelCapsName.replace( /([A-Z])/g, " $1" );
	var finalResult = result.charAt(0).toUpperCase() + result.slice(1); // capitalize the first letter - as an example.
	return finalResult
}
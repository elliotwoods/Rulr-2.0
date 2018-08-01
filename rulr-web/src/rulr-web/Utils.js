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
	var newNodeInstance = eval(`new module.${description.class}()`);

	// Setup Viewable characteristics
	{
		newNodeInstance.module = description.module;
		newNodeInstance.class = description.class;
	}

	await newNodeInstance.updateViewDescriptionAsync(description.content);
	return newNodeInstance;
}

export function formatNodePath(nodePath) {
	return '/'.join(nodePath);
}
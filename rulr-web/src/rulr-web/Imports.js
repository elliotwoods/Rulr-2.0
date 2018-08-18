import { guid } from './Utils.js'

export var callExportedObjectMethod = null;
export var callExportedObjectPropertyGet = null;
export var callExportedObjectPropertySet = null;

export async function pyCall(action, ...args) {
	return new Promise((resolve, reject) => {
		var successCallback = (returnValue) => {
			resolve(returnValue);
		};
		var successObjectCallback = (returnObjectDescription) => {
			let result = new Object();
			result.objectID = returnObjectDescription.object_id;
			result.creationDescription = returnObjectDescription.object_creation_info;

			for(let methodName of returnObjectDescription.method_names) {
				result[methodName] = async (...args2) => {
					return await pyCall(callExportedObjectMethod, result.objectID, methodName, ...args2);
				};
			}

			for(let propertyName of returnObjectDescription.property_names) {
				result[propertyName + "_get"] = async () => {
					return await pyCall(callExportedObjectPropertyGet, result.objectID, propertyName);
				};
				result[propertyName + "_set"] = async (value) => {
					return await pyCall(callExportedObjectPropertySet, result.objectID, propertyName, value);
				};
			}

			resolve(result);
		};
		var exceptionCallback = (exception) => {
			console.log("Exception hit")
			reject(exception);
		};
		action(successCallback, successObjectCallback, exceptionCallback, ...args);
	});
}

export function setCallExportedObjectMethod(action) {
	callExportedObjectMethod = action;
}

export function setCallExportedObjectPropertyGet(action) {
	callExportedObjectPropertyGet = action;
}

export function setCallExportedObjectPropertySet(action) {
	callExportedObjectPropertySet = action;
}

export var sessionID = guid();
var loadedModulePaths = [];

async function ensureFreshModule(modulePath) {
	// For each session, ensure a hard reload
	if (!loadedModulePaths.includes(modulePath)) {
		var absolutePath = '/rulr-web/src/rulr-web/' + modulePath.substring(2);
		var response = await $.ajax({
			url: absolutePath,
			processData: false,
			cache: false,
			dataType: 'text'
		});
		loadedModulePaths.push(modulePath);
	}
}

async function fromCreationDescriptionAsync(creationDescription) {
	var modulePath = './' + creationDescription.module.split('.').join('/') + '.js';

	await ensureFreshModule(modulePath);

	var module = await import(modulePath);
	var newInstance = eval(`new module.${creationDescription.class}()`);

	// Setup Viewable characteristics
	{
		newInstance.module = creationDescription.module;
		newInstance.class = creationDescription.class;
	}

	return newInstance;
}

export async function fromServerInstance(serverInstance) {
	var creationDescription = serverInstance.creationDescription;
	var newInstance = await fromCreationDescriptionAsync(creationDescription);
	newInstance.serverInstance = serverInstance;
	return newInstance;
}
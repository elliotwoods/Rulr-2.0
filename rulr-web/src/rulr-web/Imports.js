export var callExportedObject = null;

export async function pyCall(action, ...args) {
	return new Promise((resolve, reject) => {
		var successCallback = (returnValue) => {
			resolve(returnValue);
		};
		var successObjectCallback = (returnObjectDescription) => {
			let result = new Object();
			result.objectID = returnObjectDescription.object_id;
			for(let methodName of returnObjectDescription.method_names) {
				result[methodName] = async (...args2) => {
					return await pyCall(callExportedObject, result.objectID, methodName, ...args2);
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

export function setCallExportedObject(action) {
	callExportedObject = action;
}
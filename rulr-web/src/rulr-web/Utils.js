export function request(url, requestData, responseFunction, errorFunction = (error) => {}) {
	$.ajax({
		url : url,
		data : requestData,
		success : (response) => {
			if (response.success) {
				responseFunction(response.content);
			}
		},
		error : (request, errorType, errorString) => {
			errorFunction({
				request : request,
				errorType : errorType,
				errorString : errorString
			});
		}
	});
}

export async function asyncForEach(array, action) {
	for(let index=0; index < array.length; index++) {
		await action(array[index], index, array);
	}
}

export async function asyncRequest(url, requestData, responseFunction, errorFunction = (error) => {}) {
	return new Promise((resolve) => {
		request(url, requestData, (response) => {
			responseFunction(response);
			resolve();
		}, (error) => {
			errorFunction(error);
			resolve();
		})
	})
}

export async function fromViewDescriptionAsync(description) {
	var header = description.header;
	var module = await import('./Nodes/' + description.module.replace('.', '/') + '.js');
	var newNodeInstance = new module.Node();

	// Header
	newNodeInstance.header = header;
	newNodeInstance.moduleName = description.module;

	// Content

	// Children
	await asyncForEach(description.children, async (childDescription) => {
		var childNodeInstance = await fromViewDescriptionAsync(childDescription);
		newNodeInstance.children.push(childNodeInstance);
	});

	return newNodeInstance;
}
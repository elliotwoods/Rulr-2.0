export function request(url, requestData, responseFunction, errorFunction = (error) => {}) {
	$.ajax({
		url : url,
		data : requestData,
		error : (request, errorType, errorString) => {
			errorFunction({
				request : request,
				errorType : errorType,
				errorString : errorString
			});
		}
	}).then(response => {
		if (response.success) {
			responseFunction(response.content);
		}
	});
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

export async function fromViewDescription(description) {
	var header = description.header;
	var module = await import('./Nodes/' + header.moduleName.replace('.', '/') + '.js');
	var newNodeInstance = new module.Node();

	// Header
	newNodeInstance.header = header;

	// Content

	// Children
	description.children.forEach((childDescription) => {
		newNodeInstance.children.push(fromViewDescription(childDescription));
	});

	return newNodeInstance;
}
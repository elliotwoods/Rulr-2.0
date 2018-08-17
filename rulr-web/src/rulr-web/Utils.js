export function showException(exception) {
	var alert;

	if(exception instanceof Error) {
		alert = $(`
		<div class="alert alert-warning alert-dismissible fade show" role="alert">
			<h4 class="alert-heading">${exception.message} [${exception.name}]</h4>
			<hr>
			<strong></strong>
			<h5>Traceback:</h5>
			${exception.stack.replace(/\n/g, "<br />")}
		
			<button type="button" class="close" data-dismiss="alert" aria-label="Close">
				<span aria-hidden="true">&times;</span>
			</button>
		</div>
			`);

		// Firefox only?so cutt
		if(typeof exception.fileName !== 'undefined') {
			alert.find('strong').append(`${exception.fileName}:${exception.lineNumber}x${exception.columnNumber}`);
		}
	}
	else if (typeof (exception) === 'object') {
		alert = $(`
		<div class="alert alert-warning alert-dismissible fade show" role="alert">
			<h4 class="alert-heading">${exception.message} [${exception.type}]</h4>
			<ul></ul>
			<hr>
			<h5>Traceback:</h5>
			<ol></ol>
		
			<button type="button" class="close" data-dismiss="alert" aria-label="Close">
				<span aria-hidden="true">&times;</span>
			</button>
		</div>
			`);

		for (var arg in exception.args) {
			alert.find('ul').append(`<li>${arg}</li>`);
		}

		for (var tracebackEntry in exception.traceback) {
			alert.find('ol').append(`
		<li>
			<strong>${tracebackEntry.filename}:${tracebackEntry.lineNumber}</strong> <br />
			${tracebackEntry.line}
		</li>
				`);
		}
	}
	else if (typeof(exception) === 'string') {
		alert = $(`
		<div class="alert alert-warning alert-dismissible fade show" role="alert">
			<h4 class="alert-heading">${exception}</h4>
			<button type="button" class="close" data-dismiss="alert" aria-label="Close">
				<span aria-hidden="true">&times;</span>
			</button>
		</div>
			`);
	}


	$("#alerts").append(alert);
}

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
			if (responseFunction instanceof Function) {
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

export async function fromCreationDescriptionAsync(creationDescription) {
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

export async function fromViewDescriptionAsync(description) {
	var newInstance = await fromCreationDescriptionAsync(description);

	if (typeof newInstance.updateViewDescriptionAsync === 'function') {
		await newInstance.updateViewDescriptionAsync(description.content);
	}
	else {
		throw new Error(`${description.module}::${description.class} does not implement updateViewDescriptionAsync`);
	}

	return newInstance;
}

export async function fromServerInstance(serverInstance) {
	var creationDescription = await serverInstance.getCreationDescription();
	var newInstance = await fromCreationDescriptionAsync(creationDescription);
	newInstance.serverInstance = serverInstance;
	return newInstance;
}

export function formatNodePath(nodePath) {
	return '/'.join(nodePath);
}

//from https://stackoverflow.com/questions/7225407/convert-camelcasetext-to-sentence-case-text/38635498
export function camelCapsToSentanceCaps(camelCapsName) {
	var result = camelCapsName.replace(/([A-Z])/g, " $1");
	var finalResult = result.charAt(0).toUpperCase() + result.slice(1); // capitalize the first letter - as an example.
	return finalResult
}
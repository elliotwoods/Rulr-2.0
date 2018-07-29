export function request(url, requestData, responseFunction) {
	$.ajax({
		url : url,
		data : requestData
	}).then(response => {
		if (response.success) {
			responseFunction(response.content);
		}
	});
}
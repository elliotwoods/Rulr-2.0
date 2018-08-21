var hasInitialised = false;

async function initialise() {
	var pyCall;

	//always do this
	{
		let module = await import('./rulr-web/Imports.js');
		module.setCallExportedObjectMethod(callExportedObjectMethod);
		module.setCallExportedObjectPropertyGet(callExportedObjectPropertyGet);
		module.setCallExportedObjectPropertySet(callExportedObjectPropertySet);
		pyCall = module.pyCall;
	}

	if(!hasInitialised) {
		{
			let module = await import('./rulr-web/Application.js');
			var serverApplication = await pyCall(get_application_export);
			await module.application.initialise(serverApplication);
		}

		hasInitialised = true;
	}
}
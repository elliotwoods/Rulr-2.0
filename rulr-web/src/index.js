var hasInitialised = false;

async function initialise() {
	//always do this
	{
		let module = await import('./rulr-web/Imports.js');
		module.setCallExportedObjectMethod(callExportedObjectMethod);
		module.setCallExportedObjectPropertyGet(callExportedObjectPropertyGet);
		module.setCallExportedObjectPropertySet(callExportedObjectPropertySet);
	}

	if(!hasInitialised) {
		{
			let module = await import('./rulr-web/Application.js');
			await module.application.initialise(serverApplication);
		}

		hasInitialised = true;
	}
}
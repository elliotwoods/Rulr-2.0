var hasInitialised = false;

async function initialise() {
	if(!hasInitialised) {
		var applicationModule = await import('./rulr-web/Application.js');
		await applicationModule.application.initialise(serverApplication);
		hasInitialised = true;
	}
}
import { showException } from '../Utils.js'
import { application } from '../Application.js'
import { Element } from './Element.js'

class GeneralModal extends Element {
	constructor() {
		super();

	this.modalDom = null;
		this.whenReady(() => {
			this.modalDom = $("#generalModal");
		});
	}

	async display(title, modalWidth = 0.5) {
		return new Promise((resolve, reject) => {
			this.whenReady(() => {
				var modal = $("#generalModal");
				modal.modal({});
				var modalDialog = modal.find(".modal-dialog");
				modalDialog.css('max-width', `${modalWidth * 100}%`);
				
				this.modalDom.find("#generalModal_header").text(title);
				let body = this.modalDom.find("#generalModal_body");
				body.empty();

				resolve(body);
			});
		});
	}
}

function displayModal(title) {
	return application.window.generalModal.display(title);
}

export { GeneralModal, displayModal };
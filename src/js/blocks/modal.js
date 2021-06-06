import { disableBodyScroll, enableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';

export function initModal() {
	const openModalButton = document.querySelector(".js--open-modal");
	const cancelModalButton = document.querySelector(".js--modal-cancel");
	const modal = document.querySelector(".modal");
	const checkbox = document.querySelector(".js--checkbox-show");
	const sendModalButton = document.querySelector(".js--modal-send");

	openModalButton.addEventListener("click", function(e){
		e.preventDefault();
		let modalName = this.getAttribute("data-modal-name");
		let modalPopup = document.querySelector(".modal[data-modal="+ `${ modalName }` +"]");
		let modalContent = modal.querySelector(".modal__content");

		modalPopup.classList.add("js--modal-opened")

		setTimeout(function(){
			modalContent.classList.add("js--show");
		}, 50);

		disableBodyScroll(modal);
	})

	cancelModalButton.addEventListener("click", function(e){
		e.preventDefault();
		let modalContent = modal.querySelector(".modal__content");

		modalContent.classList.remove("js--show");

		modal.classList.remove("js--modal-opened")

		enableBodyScroll(modal);
	})

	checkbox.addEventListener("click", function(e){

		if(this.checked) {
			sendModalButton.classList.remove("button-disabled");
		} else {
			sendModalButton.classList.add("button-disabled");
		}

	})
}

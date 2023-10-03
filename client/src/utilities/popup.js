const openDialog = () => {
	const openDialogButton = document.querySelector('.popup-btn')
	const dialogContainer = document.querySelector('.popup-dialog')

	openDialogButton.addEventListener('click', () => {
		dialogContainer.showModal()
	})
}

const clearForm = () => {
	const dialogContainer = document.querySelector('.popup-dialog')
	const form = document.querySelector('.popup-dialog__form')
	form.reset()
	dialogContainer.close()
}

const closeDialog = () => {
	const closeDialogButton = document.querySelector('.popup-close-btn')

	closeDialogButton.addEventListener('click', () => {
		const dialogContainer = document.querySelector('.popup-dialog')
		const form = document.querySelector('.popup-dialog__form')
		form.reset()
		dialogContainer.close()
	})
}

export { openDialog, clearForm, closeDialog }

const openDialog = () => {
	const dialogContainer = document.querySelector('.popup-dialog')
	dialogContainer.showModal()
}

const closeDialog = () => {
	const dialogContainer = document.querySelector('.popup-dialog')
	const form = document.querySelector('.popup-dialog__form')
	form.reset()
	dialogContainer.close()
}

export { openDialog, closeDialog }

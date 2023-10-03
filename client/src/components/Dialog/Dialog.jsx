import './Dialog.css'
import Button from '../Button/Button'

const Dialog = ({ title, textButton, onClick, onSubmit, children }) => {
	return (
		<dialog className="popup-dialog">
			<h2 className="popup-dialog__title">{title}</h2>

			<button
				className="popup-close-btn"
				onClick={onClick}
			>
				&times;
			</button>

			<form
				className="popup-dialog__form"
				onSubmit={onSubmit}
			>
				{children}
				<Button type="submit">{textButton}</Button>
			</form>
		</dialog>
	)
}

export default Dialog

import './InputMessage.css'

const InputMessage = ({ type, children }) => {
	return (
		<p
			className="input__message"
			data-type={type}
		>
			{children}
		</p>
	)
}

export default InputMessage

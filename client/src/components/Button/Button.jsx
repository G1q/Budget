import './Button.css'

const Button = ({ className, onClick, type = 'button', datatype, id, size, children, disabled = false }) => {
	return (
		<button
			className={`btn ${className ? className : ''}`}
			id={id}
			type={type}
			data-type={datatype}
			onClick={onClick}
			data-size={size}
			disabled={disabled}
		>
			{children}
		</button>
	)
}

export default Button

import './Button.css'

const Button = ({ className, onClick, type = 'button', datatype, id, size, children }) => {
	return (
		<button
			className={`btn ${className ? className : ''}`}
			id={id}
			type={type}
			data-type={datatype}
			onClick={onClick}
			data-size={size}
		>
			{children}
		</button>
	)
}

export default Button

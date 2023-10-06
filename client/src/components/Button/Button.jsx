import './Button.css'

const Button = ({ className, onClick, type = 'button', datatype, id, children }) => {
	return (
		<button
			className={`btn ${className ? className : ''}`}
			id={id}
			type={type}
			data-type={datatype}
			onClick={onClick}
		>
			{children}
		</button>
	)
}

export default Button

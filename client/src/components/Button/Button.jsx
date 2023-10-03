import './Button.css'

const Button = ({ className, onClick, datatype, id, children }) => {
	return (
		<button
			className={`btn ${className ? className : ''}`}
			id={id}
			type="button"
			data-type={datatype}
			onClick={onClick}
		>
			{children}
		</button>
	)
}

export default Button

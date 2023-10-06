import { Link } from 'react-router-dom'
import './ButtonLink.css'

const ButtonLink = ({ className, to, datatype, id, children }) => {
	return (
		<Link
			className={`btn-link ${className ? className : ''}`}
			id={id}
			data-type={datatype}
			to={to}
		>
			{children}
		</Link>
	)
}

export default ButtonLink

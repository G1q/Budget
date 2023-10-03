import './StatusMessage.css'

const StatusMessage = ({ message, type }) => {
	return (
		<p
			className="status__message"
			data-type={type}
		>
			{message}
		</p>
	)
}

export default StatusMessage

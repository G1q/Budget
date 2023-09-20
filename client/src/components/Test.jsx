import { useState } from 'react'

const Test = () => {
	const [count, setCount] = useState(0)

	return (
		<div style={{ padding: '1rem', border: '2px solid #333', marginBlock: '3rem' }}>
			<h2 style={{ margin: 0, marginBottom: '1rem' }}>Teste</h2>
			<Button onClick={() => setCount(count + 1)}>{count}</Button>
		</div>
	)
}

const Button = ({ onClick, children }) => <button onClick={onClick}>{children}</button>

export default Test

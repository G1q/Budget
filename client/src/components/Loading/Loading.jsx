import React from 'react'
import styled, { keyframes } from 'styled-components'

const Rotate = keyframes`
	0% { rotate: 0; }
 	100% { rotate: 1turn; }
`
const Grow = keyframes`
	0%, 100% { width: .3em; }
	33% { width: .6em;}
	66% {width: 1em;}
`

const LoadingMessage = styled.p`
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 0.25em;
	font-weight: 700;
	color: crimson;
`
const Wheel = styled.span`
	display: inline-block;
	margin: 0;
	width: 20px;
	height: 20px;
	border-radius: 50%;
	border: 3px solid crimson;
	border-top-color: transparent;
	animation: ${Rotate} 500ms infinite ease-in;
`

const Dots = styled.div`
	width: 0.3em;
	overflow: hidden;
	animation: ${Grow} 1s infinite;
`

const Loading = () => {
	return (
		<LoadingMessage>
			<Wheel />
			Loading
			<Dots>...</Dots>
		</LoadingMessage>
	)
}

export default Loading

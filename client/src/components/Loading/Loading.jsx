import React from 'react'
import styled from 'styled-components'

const LoadingMessage = styled.p`
	font-weight: 700;
	color: crimson;
`

const Loading = () => {
	return <LoadingMessage>Loading...</LoadingMessage>
}

export default Loading

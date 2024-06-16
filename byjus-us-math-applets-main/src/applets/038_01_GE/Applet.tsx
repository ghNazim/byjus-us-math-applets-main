import React from 'react'
import styled from 'styled-components'

import { AppletContainer } from '../../common/AppletContainer'
import { Header, TextHeader } from '../../common/Header'
import { AppletInteractionCallback } from '../../contexts/analytics'
import RiveApp from './components/RiveComponent'

const Text = styled.p`
  color: #444;
  font-family: 'Nunito', sans-serif;
  font-size: 20px;
  font-weight: 700;
  margin: 0;
  max-width: 600px;
  text-align: center !important;
`

export const Applet03801Ge: React.FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#FAF2FF',
        id: '038_01_GE',
        onEvent,
        className,
      }}
    >
      <TextHeader
        text="Use hand span to measure the height of the mini door."
        backgroundColor="#FAF2FF"
        buttonColor="#EACCFF"
      />
      <RiveApp />
    </AppletContainer>
  )
}

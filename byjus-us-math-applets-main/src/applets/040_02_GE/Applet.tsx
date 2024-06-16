import React, { useCallback, useRef, useState } from 'react'
import styled from 'styled-components'

import { AppletContainer } from '../../common/AppletContainer'
import { TextHeader } from '../../common/Header'
import { AppletInteractionCallback } from '../../contexts/analytics'
import RiveComponent from './components/RiveComponent'

export const Applet04002Ge: React.FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#F1EDFF',
        id: '040_02_GE',
        onEvent,
        className,
      }}
    >
      <TextHeader
        text="Choose your destination and observe the total travel time in different time formats."
        backgroundColor="#F1EDFF"
        buttonColor="#D9CDFF"
      />
      <RiveComponent />
    </AppletContainer>
  )
}

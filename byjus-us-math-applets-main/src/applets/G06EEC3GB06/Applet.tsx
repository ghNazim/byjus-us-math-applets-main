import { EventCallback, useRive } from '@rive-app/react-canvas'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

import { useSFX } from '@/hooks/useSFX'

import { AppletContainer } from '../../common/AppletContainer'
import { TextHeader } from '../../common/Header'
import { AppletInteractionCallback } from '../../contexts/analytics'
import RiveAnimation from './Assets/G06EEC3GB06_v2.riv'
import DragAndDropAnimation from './Components/DragAndDropAnimation'

const STATE_MACHINE = 'State Machine 1'

const RiveHolder = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  position: absolute;
  bottom: -40px;
`

export const AppletG06EEC3GB06: React.FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const [isMouseClicked, setIsMouseClicked] = useState(false)
  const playMouseIn = useSFX('mouseIn')
  const playMouseOut = useSFX('mouseOut')
  const [showOnBording, setShowOnBoarding] = useState(true)

  const onStateChange: EventCallback = (e) => {
    if (e && e.data && e.data instanceof Array) {
      const eventName = e.data[0]
      if (eventName.includes('Pressed')) {
        if (showOnBording) setShowOnBoarding(false)
        setIsMouseClicked(true)
      }
      if (eventName.includes('Start')) setIsMouseClicked(false)
      if (eventName === '3xAnd7xStart') setShowOnBoarding(true)
    }
  }

  const { RiveComponent } = useRive({
    src: RiveAnimation,
    stateMachines: STATE_MACHINE,
    autoplay: true,
    onStateChange,
  })

  useEffect(() => (isMouseClicked ? playMouseIn() : playMouseOut()), [isMouseClicked])

  const initialPos = { top: 670, left: 300 }
  const finalPos = { top: 150, left: 190 }

  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#F1EDFF',
        id: 'G06EEC3GB06',
        onEvent,
        className,
      }}
    >
      <TextHeader
        text="Classify the expressions into the appropriate groups of like terms and unlike terms. "
        backgroundColor="#E7FBFF"
        buttonColor="rgba(166, 240, 255, 1)"
      />
      <RiveHolder>
        <RiveComponent />
      </RiveHolder>

      {showOnBording ? (
        <DragAndDropAnimation initialPos={initialPos} finalPos={finalPos} />
      ) : undefined}
    </AppletContainer>
  )
}

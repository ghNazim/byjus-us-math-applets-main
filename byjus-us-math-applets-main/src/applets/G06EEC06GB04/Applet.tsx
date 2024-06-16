import { Alignment, Fit, Layout, useRive } from '@rive-app/react-canvas'
import { FC, useContext, useEffect, useState } from 'react'

import { AppletContainer } from '@/common/AppletContainer'
import { TextHeader } from '@/common/Header'
import { AnalyticsContext, AppletInteractionCallback } from '@/contexts/analytics'
import { useInterval } from '@/hooks/useInterval'
import { useSFX } from '@/hooks/useSFX'

import riveFile from './assets/G06EEC06GB04-1.riv'
import DragAndDropAnimation from './components/DragAndDropAnimation'

const initialPos = { top: 644, left: 285 }
const finalPos = { top: 170, left: 70 }

export const AppletG06EEC06GB04: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const STATE_NAME = 'State Machine 1'
  const onInteraction = useContext(AnalyticsContext)
  const playMouseIn = useSFX('mouseIn')
  const playMouseOut = useSFX('mouseOut')
  const [isDrag, setDrag] = useState(false)
  const [showHand, setShowHand] = useState(true)
  const [timer, setTimer] = useState(false)
  const onStateChange = (event: any) => {
    if (event.data[0].includes('retryPress')) {
      setTimer(true)
    }
    if (event.data[0].includes('11Press')) {
      setShowHand(false)
    }
    if (event.data[0].includes('Press')) {
      setDrag(true)
    } else if (event.data[0].includes('Start')) {
      setDrag(false)
    }
  }
  useInterval(
    () => {
      setShowHand(true)
      setTimer(false)
    },
    timer ? 1000 : null,
  )
  useEffect(() => {
    if (isDrag) {
      playMouseIn()
      onInteraction('drag')
    } else {
      playMouseOut()
      onInteraction('drop')
    }
  }, [isDrag, onInteraction, playMouseIn, playMouseOut])

  const { RiveComponent: RiveComponentPlayback } = useRive({
    src: riveFile,
    autoplay: true,
    stateMachines: STATE_NAME,
    layout: new Layout({
      fit: Fit.Contain,
      alignment: Alignment.Center,
    }),
    onStateChange,
  })

  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#F1EDFF',
        id: 'G06-EEC06-GB04',
        onEvent,
        className,
      }}
    >
      <TextHeader
        text="Classify the phrases into the appropriate groups based on the given inequality symbols."
        backgroundColor="#F1EDFF"
        buttonColor="#D9CDFF"
      />
      <RiveComponentPlayback
        style={{
          top: 98,
          width: 720,
          height: 700,
          position: 'absolute',
          left: '50%',
          translate: '-50%',
        }}
      />
      {showHand && <DragAndDropAnimation initialPos={initialPos} finalPos={finalPos} />}
    </AppletContainer>
  )
}

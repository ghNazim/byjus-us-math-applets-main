import { Player } from '@lottiefiles/react-lottie-player'
import React, { useCallback, useRef } from 'react'
import styled from 'styled-components'

import { AnimatedInputSlider } from '../../common/AnimatedInputSlider'
import { AppletContainer } from '../../common/AppletContainer'
import { TextCallout } from '../../common/Callout'
import { AppletInteractionCallback } from '../../contexts/analytics'
import animation from './assets/animation.json'

const BottomSlider = styled(AnimatedInputSlider)`
  position: absolute;
  bottom: 52px;
  left: 150px;
`

const PlacedPlayer = styled(Player)`
  position: absolute;
  top: 70px;
  left: 90px;
  width: 540px;
  height: 540px;
`

export const Applet00701Ge: React.FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const instance = useRef<Player>(null)

  const onSliderChange = useCallback((value: number) => {
    instance.current?.setSeeker(Math.round((value / 100) * 48))
  }, [])

  return (
    <AppletContainer
      {...{
        aspectRatio: 1,
        borderColor: '#444',
        id: '007_01_GE',
        onEvent,
        className,
      }}
    >
      <TextCallout backgroundColor={'#F4E5FF'} text={'Unfold the cylinder to observe its net.'} />
      <PlacedPlayer src={animation} ref={instance} />
      <BottomSlider onChangePercent={onSliderChange} />
    </AppletContainer>
  )
}

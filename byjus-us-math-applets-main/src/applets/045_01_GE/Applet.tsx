import { Player } from '@lottiefiles/react-lottie-player'
import React, { useCallback, useRef, useState } from 'react'
import styled from 'styled-components'

import { AnimatedInputSlider } from '../../common/AnimatedInputSlider'
import { AppletContainer } from '../../common/AppletContainer'
import { TextHeader } from '../../common/Header'
import { AppletInteractionCallback } from '../../contexts/analytics'
import box from './assets/box.json'

const PlacedSlider = styled(AnimatedInputSlider)`
  position: absolute;
  left: 50%;
  translate: -50%;
  bottom: 106px;
`
export const Applet04501Ge: React.FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const playerRef = useRef<Player>(null)

  const onSliderChange = (value: number) => {
    playerRef.current?.setSeeker(Math.round((value / 100) * 80))
  }

  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#FFF6DB',
        id: '045_01_GE',
        onEvent,
        className,
      }}
    >
      <TextHeader
        text="Unfold the cardboard box to observe its net."
        backgroundColor="#FFF6DB"
        buttonColor="#FFDC73"
      />
      <Player src={box} ref={playerRef} style={{ marginTop: '30px' }} />
      <PlacedSlider
        onChangePercent={(e) => {
          onSliderChange(e)
        }}
        min={0}
        max={100}
      />
    </AppletContainer>
  )
}

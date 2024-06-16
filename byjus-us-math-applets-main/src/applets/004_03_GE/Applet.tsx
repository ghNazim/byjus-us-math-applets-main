import { Player } from '@lottiefiles/react-lottie-player'
import { useRef, useState } from 'react'
import styled from 'styled-components'

import { AnimatedInputSlider } from '../../common/AnimatedInputSlider'
import { AppletContainer } from '../../common/AppletContainer'
import { TextHeader } from '../../common/Header'
import { AppletInteractionCallback } from '../../contexts/analytics'
import Animation from './assets/animation.json'

const PlayerContainer = styled(Player)`
  /* width: 720;
  height: 400; */
  scale: 0.8;
  position: absolute;
  bottom: 40px;
`
const TextContainer = styled.div<{ weight: number; top: number }>`
  position: absolute;
  width: 720px;
  top: ${(props) => props.top}px;
  text-align: center;
  color: #444;
  font-size: 20px;
  padding: 0 61px;
  font-weight: ${(props) => props.weight};
`

const AnimatedInputSliderContainer = styled(AnimatedInputSlider)`
  position: absolute;
  bottom: 32px;
  left: 50%;
  translate: -50%;
`

export const Applet00403Ge: React.FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const playerRef = useRef<Player>(null)
  const [showText, setShowText] = useState(false)

  const onChangeHandle = (value: number) => {
    if (value == 100) setShowText(true)
    playerRef.current?.setSeeker(value * (80 / 100))
  }

  return (
    <AppletContainer
      {...{
        aspectRatio: 1,
        borderColor: '#e7fbff',
        id: '004_03_GE',
        onEvent,
        className,
      }}
    >
      <TextHeader
        text="Transform the oblique rectangular prism into a right rectangular prism and compare their volumes."
        backgroundColor="#E7FBFF"
        buttonColor="#D1F7FF"
      />
      <PlayerContainer src={Animation} ref={playerRef} />
      {showText && (
        <TextContainer weight={400} top={490}>
          Remember that we are not adding or taking away any material, so the amount of space inside
          or volume stays the same.
        </TextContainer>
      )}
      <AnimatedInputSliderContainer min={0} max={81} onChangePercent={onChangeHandle} />
    </AppletContainer>
  )
}

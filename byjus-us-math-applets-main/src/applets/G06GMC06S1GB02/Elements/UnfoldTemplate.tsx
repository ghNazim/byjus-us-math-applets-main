import { Player } from '@lottiefiles/react-lottie-player'
import { FC, ReactElement, useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import Slider from './Slider'

const AnimContainer = styled(Player)`
  position: absolute;
  left: 23px;
  top: 100px;
  width: 680px;
  height: 520px;
  border-radius: 6px;
`
const BackgroundDiv = styled.div`
  width: 680px;
  height: 600px;
  position: absolute;
  left: 20px;
  top: 100px;
  background-color: aliceblue;

  border-radius: 15px;
`

const TextBox = styled.div`
  text-align: center;
  color: #444;
  font-size: 20px;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  line-height: 34px;
  width: 100%;

  position: absolute;
  bottom: 20px;
  z-index: 5;
`

const UnfoldTemplate: FC<{
  fr: number
  text: ReactElement[]
  video: object | string
  op: number
}> = ({ video, op, text, fr }) => {
  const [sliderVal, setSliderVal] = useState(0)
  const playerRef = useRef<Player>(null)

  const onSliderChange = useCallback((value: number) => {
    if (playerRef.current == null) return
    setSliderVal(value)
    playerRef.current.setSeeker(value)
  }, [])

  return (
    <>
      <BackgroundDiv />
      <AnimContainer renderer="svg" src={video} ref={playerRef}></AnimContainer>
      <Slider fr={fr} min={0} max={op - 1} onChange={onSliderChange} />
      <TextBox>{text[sliderVal == 0 ? 0 : sliderVal == op - 1 ? 1 : 2]}</TextBox>
    </>
  )
}

export default UnfoldTemplate

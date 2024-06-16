import React, { useEffect, useState } from 'react'
import styled, { keyframes } from 'styled-components'
import useSound from 'use-sound'

import muteBtn from '../assets/muteBtn.svg'
import unmuteBtn from '../assets/unmuteBtn.svg'
import DragThePointVO from '../assets/VO/Triangle Angle Theorem_1.mp3'
import SelectTheAngleVO from '../assets/VO/Triangle Angle Theorem_2.mp3'
import InteriorAngleVO1 from '../assets/VO/Triangle Angle Theorem_3.mp3'
import InteriorAngleVO2 from '../assets/VO/Triangle Angle Theorem_4.mp3'
import ExteriorAngleVO1 from '../assets/VO/Triangle Angle Theorem_5.mp3'
import ExteriorAngleVO2 from '../assets/VO/Triangle Angle Theorem_6.mp3'

const SpeakerDiv = styled.div`
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  margin: 0 10px;
`
const SpeakerButton = styled.img`
  cursor: pointer;
  z-index: 1;
`
const ripple = keyframes`
  0% {
    opacity: 1;
    transform: scale(0);
  }
  100% {
    opacity: 0;
    transform: scale(1);
  }
`
const RippleContainer = styled.div`
  position: absolute;
  width: 50px;
  height: 50px;
  left: 0;
`
const Ripple = styled.span`
  position: absolute;
  width: 50px;
  height: 50px;
  opacity: 0;
  border-radius: 50px;
  animation: ${ripple} 1s infinite;
  background-color: #000000;
  :nth-child(2) {
    animation-delay: 0.5s;
  }
  left: 0;
`
export const voList = [
  DragThePointVO,
  SelectTheAngleVO,
  InteriorAngleVO1,
  InteriorAngleVO2,
  ExteriorAngleVO1,
  ExteriorAngleVO2,
]

interface SoundProps {
  index: number
}

const Sound: React.FC<SoundProps> = ({ index }) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioPlay, setAudioPlay] = useState(true)
  // const [index, setIndex] = useState(0)

  const checkPlay = {
    onplay: () => setIsPlaying(true),
    onend: () => setIsPlaying(false),
  }

  const [play, { stop, pause }] = useSound(voList[index], checkPlay)

  useEffect(() => {
    if (audioPlay) {
      stop()
      const delay = setTimeout(() => {
        play()
      }, 500)

      return () => {
        clearTimeout(delay)
      }
    } else {
      stop()
      setIsPlaying(false)
    }

    return () => {
      stop()
    }
  }, [index, play, stop, audioPlay])

  return (
    <SpeakerDiv>
      {isPlaying && (
        <RippleContainer>
          <Ripple />
          <Ripple />
        </RippleContainer>
      )}
      <SpeakerButton
        src={audioPlay ? muteBtn : unmuteBtn}
        onClick={() => {
          setAudioPlay((d) => !d)
        }}
      />
    </SpeakerDiv>
  )
}

export default Sound

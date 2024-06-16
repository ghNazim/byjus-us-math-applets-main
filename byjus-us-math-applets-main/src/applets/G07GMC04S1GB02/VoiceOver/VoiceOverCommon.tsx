import { useEffect, useState } from 'react'
import styled, { keyframes } from 'styled-components'
import useSound from 'use-sound'

import muteBtn from './Assets/muteBtn.svg'
import unmuteBtn from './Assets/unmuteBtn.svg'

const PageFeedbacks = styled.label`
  position: absolute;
  top: 620px;
  left: 50%;
  translate: -50%;
  width: 720px;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;
  display: flex;
  align-items: center;
  text-align: center;
  justify-content: center;
  color: #444444;
  transition: 0.3s ease-out;
`
const SpeakerDiv = styled.div`
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`
const SpeakerButton = styled.img`
  cursor: pointer;
  z-index: 1;
  &:hover {
    scale: 1.1;
    transition: 0.3s;
  }
  &:active {
    scale: 1.2;
    transition: 0.3s;
  }
`
const RippleContainer = styled.div`
  position: absolute;
  width: 50px;
  height: 50px;
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
const Ripple = styled.span`
  position: absolute;
  top: 0.1px;
  left: 0px;
  width: 50px;
  height: 50px;
  opacity: 0;
  border-radius: 50px;
  animation: ${ripple} 1s infinite ease-in-out;
  background-color: #000000;
  :nth-child(2) {
    animation-delay: 0.5s;
  }
`
export interface VoiceOverProps {
  textControl: number
  children: string
  audioFiles: string[]
}

export const VoiceOverCommon: React.FC<VoiceOverProps> = (props) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioPlay, setAudioPlay] = useState(true)

  const checkPlay = {
    onplay: () => setIsPlaying(true),
    onend: () => setIsPlaying(false),
  }

  const audioIndex = props.textControl - 1

  const [playAudio, stopAudio] = useSound(props.audioFiles[audioIndex], checkPlay)

  useEffect(() => {
    stopAudio.stop()

    if (audioPlay) {
      playAudio()
    } else {
      setIsPlaying(false)
    }
  }, [audioPlay, playAudio, stopAudio])

  return (
    <PageFeedbacks {...props}>
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
        ></SpeakerButton>
      </SpeakerDiv>
      {props.children}
    </PageFeedbacks>
  )
}

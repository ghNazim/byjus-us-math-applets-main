import {
  createContext,
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react'
import styled, { keyframes } from 'styled-components'
import useSound from 'use-sound'

import { useTimeout } from '@/hooks/useTimeout'

import muteBtn from './Assets/muteBtn.svg'
import unmuteBtn from './Assets/unmuteBtn.svg'

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
  audioSrc: string
  enabled: boolean
}

const VOContext = createContext<{
  isMuted: boolean
  setMuted: Dispatch<SetStateAction<boolean>>
}>({
  isMuted: false,
  setMuted: () => {},
})

export const VOProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [isMuted, setMuted] = useState(false)
  return <VOContext.Provider value={{ isMuted, setMuted }}>{children}</VOContext.Provider>
}

export const VoiceOverCommon: React.FC<VoiceOverProps> = ({ enabled, audioSrc }) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const { isMuted, setMuted } = useContext(VOContext)

  const checkPlay = {
    onplay: () => {
      setIsPlaying(true)
    },
    onend: () => {
      setIsPlaying(false)
    },
  }

  const [play, { stop }] = useSound(audioSrc, checkPlay)

  useTimeout(() => play(), !isMuted && enabled && play != null ? 500 : null)

  useEffect(() => {
    if (!enabled || isMuted) {
      stop()
      setIsPlaying(false)
    }
  }, [enabled, isMuted, stop])

  return (
    <SpeakerDiv>
      {isPlaying && (
        <RippleContainer>
          <Ripple />
          <Ripple />
        </RippleContainer>
      )}
      <SpeakerButton
        src={isMuted ? unmuteBtn : muteBtn}
        onClick={() => {
          setMuted((d) => !d)
        }}
      ></SpeakerButton>
    </SpeakerDiv>
  )
}

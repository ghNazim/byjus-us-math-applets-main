import { Player } from '@lottiefiles/react-lottie-player'
import { FC, useCallback, useEffect, useRef, useState } from 'react'
import styled, { keyframes } from 'styled-components'
import useSound from 'use-sound'

import { AppletContainer } from '@/common/AppletContainer'
import { Geogebra } from '@/common/Geogebra'
import { ClientListener, GeogebraAppApi } from '@/common/Geogebra/Geogebra.types'
import { TextHeader } from '@/common/Header'
import { AppletInteractionCallback } from '@/contexts/analytics'
import { useSFX } from '@/hooks/useSFX'

import dragalldirection from '../../common/handAnimations/moveVertically.json'
import adjust from './assets/adjust.mp3'
import awesome from './assets/awesome.mp3'
import dontWorry from './assets/dont-worry.mp3'
import expert from './assets/expert.mp3'
import great from './assets/great.mp3'
import greatJob from './assets/great-job.mp3'
import landingRound from './assets/landing-round.mp3'
import landingTricky from './assets/landing-tricky.mp3'
import muteBtn from './assets/muteBtn.svg'
import patch from './assets/p1.jpg'
import unmuteBtn from './assets/unmuteBtn.svg'

const GeogebraContainer = styled(Geogebra)`
  width: 100%;
  height: 820px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: -1;
`
const PatchContainer = styled.img`
  position: absolute;
  width: 25px;
  height: 25px;
  left: 28px;
  top: 710px;
  z-index: 1;
`
const OuterContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 61px;
  top: 590px;
  background-color: #fff;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 0px;
  gap: 4px;
`
const TextContainer = styled.div`
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
`

const OnboardingAnimationContainer = styled(Player)<{ left: number; top: number }>`
  position: absolute;
  left: ${(a) => a.left}px;
  top: ${(a) => a.top}px;
  pointer-events: none;
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
  width: 50px;
  height: 50px;
  opacity: 0;
  border-radius: 50px;
  animation: ${ripple} 1s infinite;
  background-color: #000000;
  :nth-child(2) {
    animation-delay: 0.5s;
  }
`

const texts = [
  "Adjust the plane's position.",
  'Great! Keep going and land more planes safely.',
  "Don't worry, landing can be challenging.",
  'Awesome! You have successlly landed the plane on the runway.',
  "Landing can be tricky, but you've got this!",
  'Expert Pilot! Ready for another challenge?',
  "Landing in this round can be challenging, but you're up for it!",
  'Great job landing all planes safely on the island.',
]
export const AppletG08EEC09S1GB01POC: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const ggbApi = useRef<GeogebraAppApi | null>(null)
  const [ggbLoaded, setGgbLoaded] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioPlay, setAudioPlay] = useState(true)
  const [textControl, setTextControl] = useState(-1)
  const [showOnboarding1, setShowOnboarding1] = useState(true)
  const playMouseIn = useSFX('mouseIn')
  const playMouseOut = useSFX('mouseOut')
  const playMouseCLick = useSFX('mouseClick')
  const checkPlay = {
    onplay: () => setIsPlaying(true),
    onend: () => setIsPlaying(false),
  }

  const [playAdjust, stopAdjust] = useSound(adjust, checkPlay)
  const [playGreat, stopGreat] = useSound(great, checkPlay)
  const [playDontWorry, stopDontWorry] = useSound(dontWorry, checkPlay)
  const [playAwesome, stopAwesome] = useSound(awesome, checkPlay)
  const [playLandTrick, stopLandTrick] = useSound(landingTricky, checkPlay)
  const [playExpert, stopExpert] = useSound(expert, checkPlay)
  const [playLandRound, stopLandRound] = useSound(landingRound, checkPlay)
  const [playGreatJob, stopGreatJob] = useSound(greatJob, checkPlay)
  const onGGBLoaded = useCallback((api: GeogebraAppApi | null) => {
    ggbApi.current = api
    setGgbLoaded(true)
  }, [])

  useEffect(() => {
    stopAdjust.stop()
    stopGreat.stop()
    stopDontWorry.stop()
    stopAwesome.stop()
    stopLandTrick.stop()
    stopExpert.stop()
    stopLandRound.stop()
    stopGreatJob.stop()
    if (audioPlay) {
      switch (textControl) {
        case 0:
          playAdjust()
          break
        case 1:
          playGreat()
          break
        case 2:
          playDontWorry()
          break
        case 3:
          playAwesome()
          break
        case 4:
          playLandTrick()
          break
        case 5:
          playExpert()
          break
        case 6:
          playLandRound()
          break
        case 7:
          playGreatJob()
          break
      }
    }
  }, [textControl, audioPlay])

  useEffect(() => {
    const api = ggbApi.current

    if (api != null && ggbLoaded) {
      if (!ggbApi.current) return
      if (ggbLoaded) setTextControl(0)
      const onGGBClient: ClientListener = (e) => {
        if (e.type === 'mouseDown' && (e.hits[0] === 'A' || e.hits[0] === 'B')) {
          playMouseIn()
          setShowOnboarding1(false)
        } else if (e.type === 'dragEnd' && (e.target === 'A' || e.target === 'B')) {
          playMouseOut()
        }
      }
      api.registerObjectClickListener('pic3', () => playMouseCLick())
      api.registerObjectClickListener('pic4', () => playMouseCLick())
      api.registerObjectClickListener('pic5', () => playMouseCLick())
      api.registerClientListener(onGGBClient)
      api.registerObjectUpdateListener('pic7', () => {
        if (ggbApi.current) {
          if (ggbApi.current.getVisible('pic7', 1)) setTextControl(0)
        }
      })
      api.registerObjectUpdateListener('pic8', () => {
        if (ggbApi.current) {
          if (ggbApi.current.getVisible('pic8', 1)) setTextControl(1)
        }
      })
      api.registerObjectUpdateListener('pic9', () => {
        if (ggbApi.current) {
          if (ggbApi.current.getVisible('pic9', 1)) setTextControl(2)
        }
      })
      api.registerObjectUpdateListener('pic4', () => {
        if (ggbApi.current) {
          if (ggbApi.current.getVisible('pic4', 1)) setTextControl(3)
        }
      })
      api.registerObjectUpdateListener('pic14', () => {
        if (ggbApi.current) {
          if (ggbApi.current.getVisible('pic14', 1)) setTextControl(4)
        }
      })
      api.registerObjectUpdateListener('pic11', () => {
        if (ggbApi.current) {
          if (ggbApi.current.getVisible('pic11', 1)) setTextControl(5)
        }
      })
      api.registerObjectUpdateListener('pic13', () => {
        if (ggbApi.current) {
          if (ggbApi.current.getVisible('pic13', 1)) setTextControl(6)
        }
      })
      api.registerObjectUpdateListener('pic12', () => {
        if (ggbApi.current) {
          if (ggbApi.current.getVisible('pic12', 1)) setTextControl(7)
        }
      })
    }
  }, [ggbLoaded, playMouseIn, playMouseOut, setShowOnboarding1])

  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#F6F6F6',
        id: 'g08-eec09-s1-gb01-poc',
        onEvent,
        className,
      }}
    >
      <TextHeader
        text="Guide your plane to the island."
        backgroundColor="#F6F6F6"
        buttonColor="#1A1A1A"
      />
      <GeogebraContainer materialId="j9gjs7zz" width={680} height={670} onApiReady={onGGBLoaded} />
      {showOnboarding1 && (
        <OnboardingAnimationContainer left={310} top={190} src={dragalldirection} loop autoplay />
      )}
      <PatchContainer src={patch}></PatchContainer>
      {ggbLoaded && (
        <OuterContainer>
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
          <TextContainer>{texts[textControl]}</TextContainer>
        </OuterContainer>
      )}
    </AppletContainer>
  )
}

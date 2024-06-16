import { Player } from '@lottiefiles/react-lottie-player'
import { FC, useCallback, useContext, useEffect, useRef, useState } from 'react'
import styled, { keyframes } from 'styled-components'
import useSound from 'use-sound'

import { AnimatedInputSlider } from '@/common/AnimatedInputSlider'
import { AppletContainer } from '@/common/AppletContainer'
import { Geogebra } from '@/common/Geogebra'
import { GeogebraAppApi } from '@/common/Geogebra/Geogebra.types'
import { TextHeader } from '@/common/Header'
import { AnalyticsContext, AppletInteractionCallback } from '@/contexts/analytics'
import { useSFX } from '@/hooks/useSFX'

import handPointer from '../../common/handAnimations/moveAllDirections.json'
// import moveVertex from './assets/moveVertex.mp3'
// import tap from './assets/tap.mp3'
// import sum from './assets/sum.mp3'
import muteBtn from './assets/muteBtn.svg'
import unmuteBtn from './assets/unmuteBtn.svg'

const HelperText = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  position: absolute;
  left: 50%;
  translate: -50%;
  bottom: 20px;
  width: 700px;
  height: 28px;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;
  text-align: center;
  color: #444444;
`
const ColouredSpan = styled.span<{ bgColor: string; color: string }>`
  padding: 0 3px;
  background: ${(p) => p.bgColor};
  color: ${(p) => p.color};
  border-radius: 5px;
`
const GGBContainer = styled.div`
  width: 680px;
  height: 606px;
  position: absolute;
  left: 50%;
  translate: -50%;
  top: 100px;
  border-radius: 12px;
  overflow: hidden;
`
const HandPlayer = styled(Player)`
  position: absolute;
  left: 66px;
  top: 82px;
  pointer-events: none;
`
const Slider = styled(AnimatedInputSlider)`
  position: absolute;
  left: 50%;
  translate: -50%;
  top: 620px;
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
const RippleContainer = styled.div`
  position: absolute;
  width: 50px;
  height: 50px;
  left: -50%;
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
const Text = styled.div`
  margin-left: 10px;
`
export const AppletG07GMC02S1GB05: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const ggbApi = useRef<GeogebraAppApi | null>(null)
  const playDragStart = useSFX('mouseIn')
  const playDragEnd = useSFX('mouseOut')
  const interaction = useContext(AnalyticsContext)
  const [helper, setHelper] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [ggbLoaded, setGgbLoaded] = useState(false)
  const [showHandPointer, setShowHandPointer] = useState(true)
  const [audioPlay, setAudioPlay] = useState(true)
  const checkPlay = {
    onplay: () => {
      setIsPlaying(true)
    },
    onend: () => {
      setIsPlaying(false)
    },
  }
  // const [playMoveVertex, stopMoveVertex] = useSound(moveVertex, checkPlay)
  // const [playTap, stopTap] = useSound(tap, checkPlay)
  // const [playSum, stopSum] = useSound(sum, checkPlay)
  // useEffect(() => {
  //   stopMoveVertex.stop()
  //   stopTap.stop()
  //   stopSum.stop()
  //   if (audioPlay) {
  //     switch (helper) {
  //       case 0:
  //         playMoveVertex()
  //         break
  //       case 1:
  //         playTap()
  //         break
  //       case 2:
  //         playSum()
  //         break
  //     }
  //   } else {
  //     setIsPlaying(false)
  //   }
  // }, [audioPlay, helper, playMoveVertex])
  const onGGBHandle = useCallback(
    (api: GeogebraAppApi | null) => {
      if (api === null) return
      ggbApi.current = api
      setGgbLoaded(true)
      ggbApi.current.registerClientListener((event: any) => {
        if (ggbApi.current === null) return
        if (event[0] == 'mouseDown' && event.hits[0] == 'G') {
          playDragStart()
          interaction('drag')
          setShowHandPointer(false)
        }
        if (event[0] == 'dragEnd' && event[1] == 'G') {
          playDragEnd()
          interaction('drop')
        }
      })
    },
    [ggbApi],
  )
  const onSliderChange = (value: number) => {
    if (ggbApi.current == null) return
    ggbApi.current.setValue('aa', value * 0.03142)
    if (value === 100 && helper == 1) {
      setHelper(2)
    }
  }
  useEffect(() => {
    if (!showHandPointer) setHelper(1)
  }, [showHandPointer])
  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#F6F6F6',
        id: 'g07-gmc02-s1-gb05',
        onEvent,
        className,
        themeName: 'dark',
      }}
    >
      <TextHeader
        text="Explore the sum of the interior angles of a triangle."
        backgroundColor="#F6F6F6"
        buttonColor="#1A1A1A"
      />
      <GGBContainer>
        <Geogebra materialId="renrmtjb" onApiReady={onGGBHandle} />
      </GGBContainer>
      {showHandPointer && ggbLoaded && <HandPlayer src={handPointer} loop autoplay />}
      {helper > 0 && (
        <Slider
          onChangePercent={(e) => {
            onSliderChange(e)
          }}
          min={0}
          max={1}
        />
      )}
      <HelperText>
        {/* <SpeakerDiv>
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
        </SpeakerDiv> */}
        {helper == 0 && <Text>{'Move the vertex to create a triangle of your choice.'}</Text>}
        {helper == 1 && <Text>{'Tap to find the sum of the interior angles.'}</Text>}
        {helper == 2 && (
          <Text>
            {'The sum of measures of the '}
            <ColouredSpan bgColor="#428C94" color="#FFF">
              interior angles
            </ColouredSpan>
            {' is '}
            <ColouredSpan bgColor="#428C94" color="#FFF">
              180&deg;
            </ColouredSpan>
            {' .'}
          </Text>
        )}
      </HelperText>
    </AppletContainer>
  )
}

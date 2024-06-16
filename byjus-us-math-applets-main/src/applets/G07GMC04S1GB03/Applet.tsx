import { Player } from '@lottiefiles/react-lottie-player'
import { FC, useCallback, useContext, useEffect, useRef, useState } from 'react'
import styled, { keyframes } from 'styled-components'
import useSound from 'use-sound'

import { rotateBothSides } from '@/assets/onboarding'
import { AppletContainer } from '@/common/AppletContainer'
import { Geogebra } from '@/common/Geogebra'
import { GeogebraAppApi } from '@/common/Geogebra/Geogebra.types'
import { TextHeader } from '@/common/Header'
import { AnalyticsContext, AppletInteractionCallback } from '@/contexts/analytics'
import { useSFX } from '@/hooks/useSFX'

// import muteBtn from './assets/muteBtn.svg'
// import unmuteBtn from './assets/unmuteBtn.svg'
// import adjust from './assets/adjust.mp3'
// import complementary from './assets/complementary.mp3'
const GGB = styled(Geogebra)`
  position: absolute;
  top: 0px;
  scale: 0.66;
  left: 50%;
  translate: -50% -5%;
  width: 990px;
  height: 820px;
`
const OuterContainer = styled.div<{ top: number }>`
  position: absolute;
  width: 100%;
  height: 61px;
  top: ${(p) => p.top}px;
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
const HandPointer = styled(Player)`
  position: absolute;
  left: 393px;
  top: 278px;
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
const ColoredSpan = styled.span<{ bgColor: string; color: string }>`
  padding: 0 3px;
  background: ${(p) => p.bgColor};
  color: ${(p) => p.color};
  border-radius: 5px;
  margin: 0 5px;
`
export const AppletG07GMC04S1GB03: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const ggbApi = useRef<GeogebraAppApi | null>(null)
  const playDragStart = useSFX('mouseIn')
  const playDragEnd = useSFX('mouseOut')
  const interaction = useContext(AnalyticsContext)
  const [showHandPointer, setShowHandPointer] = useState(false)
  const [helper, setHelper] = useState(0)
  // const [isPlaying, setIsPlaying] = useState(false)
  // const [audioPlay, setAudioPlay] = useState(true)
  // const checkPlay = {
  //   onplay: () => setIsPlaying(true),
  //   onend: () => setIsPlaying(false),
  // }
  const [angAOB, setAngAOB] = useState('')
  const [angBOC, setAngBOC] = useState('')
  // const [playAdjust, stopAdjust] = useSound(adjust, checkPlay)
  // const [playComplementary, stopComplementary] = useSound(complementary, checkPlay)
  const onGGBHandle = useCallback(
    (api: GeogebraAppApi | null) => {
      if (api === null) return
      ggbApi.current = api
      setHelper(1)
      setShowHandPointer(true)
      ggbApi.current.registerClientListener((event: any) => {
        if (ggbApi.current === null) return
        if (event[0] == 'mouseDown' && event.hits[0] == "B''") {
          playDragStart()
          interaction('drag')
          setShowHandPointer(false)
        }
        if (event[0] == 'dragEnd' && event[1] == "B''") {
          playDragEnd()
          interaction('drop')
          setHelper(2)
          setAngAOB(ggbApi.current.getValueString('OrangeText'))
          setAngBOC(ggbApi.current.getValueString('BlueAngle'))
        }
      })
    },
    [ggbApi],
  )
  // useEffect(() => {
  //   stopAdjust.stop()
  //   stopComplementary.stop()
  //   if (audioPlay) {
  //     switch (helper) {
  //       case 1:
  //         playAdjust()
  //         break
  //       case 2:
  //         playComplementary()
  //         break
  //     }
  //   }
  // }, [helper, audioPlay])
  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#F6F6F6',
        id: 'g07-gmc04-s1-gb03',
        onEvent,
        className,
      }}
    >
      <TextHeader
        text="Explore the relation between the angle and its complement."
        backgroundColor="#F6F6F6"
        buttonColor="#1A1A1A"
      />
      <GGB materialId="af56kk9y" onApiReady={onGGBHandle} />
      {showHandPointer && <HandPointer autoplay loop src={rotateBothSides} />}

      {helper > 0 && (
        <OuterContainer top={helper == 1 ? 680 : 660}>
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
          {helper == 1 && (
            <TextContainer>{'Adjust the common arm OB to find the relation.'}</TextContainer>
          )}
          {helper == 2 && (
            <TextContainer>
              <ColoredSpan bgColor={'none'} color={'#F0A000'}>
                {'\u2220BOC'}
              </ColoredSpan>
              {'is complement of'}
              <ColoredSpan bgColor={'none'} color={'#1CB9D9'}>
                {'\u2220AOB'}
              </ColoredSpan>
            </TextContainer>
          )}
        </OuterContainer>
      )}
      {helper == 2 && (
        <OuterContainer top={710}>
          {helper == 2 && (
            <TextContainer>
              <ColoredSpan bgColor={'none'} color={'#F0A000'}>
                {'m \u2220BOC'}
              </ColoredSpan>
              {'= 90\u00b0 - '}
              <ColoredSpan bgColor={'#D1F7FF'} color={'#1CB9D9'}>
                {angAOB}
              </ColoredSpan>
              {'='}
              <ColoredSpan bgColor={'#FFEDB8'} color={'#F0A000'}>
                {angBOC}
              </ColoredSpan>
            </TextContainer>
          )}
        </OuterContainer>
      )}
    </AppletContainer>
  )
}

import { FC, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import styled, { keyframes } from 'styled-components'
import useSound from 'use-sound'

import { OnboardingAnimation } from '@/atoms/OnboardingAnimation'
import { OnboardingController } from '@/atoms/OnboardingController'
import { OnboardingStep } from '@/atoms/OnboardingStep'
import { AppletContainer } from '@/common/AppletContainer'
import { Geogebra } from '@/common/Geogebra'
import { GeogebraAppApi } from '@/common/Geogebra/Geogebra.types'
import { TextHeader } from '@/common/Header'
import { AnalyticsContext, AppletInteractionCallback } from '@/contexts/analytics'
import { useSFX } from '@/hooks/useSFX'

import muteBtn from './Assets/muteBtn.svg'
import tryNew from './Assets/tryNew.svg'
import unmuteBtn from './Assets/unmuteBtn.svg'
import errorAudio from './Audio/Error/error.mp3'
import promptA from './Audio/Point A/promptA.mp3'
import promptEndA from './Audio/Point A/promptEndA.mp3'
import promptB from './Audio/Point B/promptB.mp3'
import promptEndB from './Audio/Point B/promptEndB.mp3'
import promptC from './Audio/Point C/promptC.mp3'
import promptEndC from './Audio/Point C/promptEndC.mp3'
import promptD from './Audio/Point D/promptD.mp3'
import promptEndD from './Audio/Point D/promptEndD.mp3'
import { TextButton, TextImgButton } from './Buttons/Buttons'

const StyledGeogebra = styled(Geogebra)<{ opacity: number }>`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 80px;
  left: 45px;
  opacity: ${(props) => props.opacity};
  transition: 0.1s;
`
const ButtonContainer = styled.div`
  position: absolute;
  top: 720px;
  left: 50%;
  translate: -50%;
  display: flex;
  flex-direction: row;
  justify-content: center;
`
const FeedbackFlexBox = styled.div<{ move: boolean }>`
  position: absolute;
  width: 720px;
  top: ${(props) => (props.move ? 613 : 640)}px;
  transition: top 0.5s;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 5px;
  pointer-events: none;
`
const PageFeedback = styled.label`
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
const PointerOnboarding = styled(OnboardingAnimation).attrs({ type: 'moveAllDirections' })`
  position: absolute;
  top: 515px;
  left: 60px;
  pointer-events: none;
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

const pointNames = ['A', 'B', 'C', 'D']
const idArray = ['ygp9dkhk', 'zarrtmt6', 'vbq49zmf', 'ujcyz2cb']

export const AppletG06NSC09S1GB04: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const ggbApi = useRef<GeogebraAppApi | null>(null)

  const [ggbLoaded, setGGbLoaded] = useState(false)
  const [idIndex, setIdIndex] = useState(1)
  const [answerCheck, setAnswerCheck] = useState<number>(0)
  const [pointerMoved, setPointerMoved] = useState(false)
  const [clickStage, setClick] = useState<number>(0)
  const [audioPlay, setAudioPlay] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)
  const [textControl, setTextControl] = useState(-1)

  const playMouseClick = useSFX('mouseClick')
  const playMouseIn = useSFX('mouseIn')
  const playMouseOut = useSFX('mouseOut')
  const onInteraction = useContext(AnalyticsContext)

  const checkPlay = {
    onplay: () => setIsPlaying(true),
    onend: () => setIsPlaying(false),
  }

  const [playError, stopError] = useSound(errorAudio, checkPlay)
  const [playPromptA, stopPromptA] = useSound(promptA, checkPlay)
  const [playPromptEndA, stopPromptEndA] = useSound(promptEndA, checkPlay)
  const [playPromptB, stopPromptB] = useSound(promptB, checkPlay)
  const [playPromptEndB, stopPromptEndB] = useSound(promptEndB, checkPlay)
  const [playPromptC, stopPromptC] = useSound(promptC, checkPlay)
  const [playPromptEndC, stopPromptEndC] = useSound(promptEndC, checkPlay)
  const [playPromptD, stopPromptD] = useSound(promptD, checkPlay)
  const [playPromptEndD, stopPromptEndD] = useSound(promptEndD, checkPlay)

  const onApiReady = useCallback(
    (api: GeogebraAppApi | null) => {
      ggbApi.current = api
      setGGbLoaded(api != null)

      if (api == null) return
      api.registerClientListener((e: any) => {
        if (e.type === 'mouseDown' && e.hits[0] === 'I') {
          onInteraction('drag')
          playMouseIn()
        } else if (e.type === 'dragEnd' && e.target === 'I') {
          onInteraction('drop')
          playMouseOut()
          setPointerMoved(true)
        }
      })
    },
    [onInteraction, playMouseIn, playMouseOut],
  )

  const onTryNewClick = () => {
    setClick(0)
    setTextControl(-1)
    playMouseClick()
    setPointerMoved(false)
    setAnswerCheck(0)
    setIdIndex((index) => {
      switch (index) {
        case 1:
          return 2
        case 2:
          return 3
        case 0:
          return 1
        default:
          return 0
      }
    })
    if (ggbLoaded) ggbApi.current?.evalCommand('RunClickScript(button1)')
  }

  const onCheckClick = () => {
    setClick(1)
    playMouseClick()
    if (ggbLoaded) ggbApi.current?.evalCommand('RunClickScript(check)')
  }

  useEffect(() => {
    if (ggbApi.current) {
      ggbApi.current.registerObjectUpdateListener('green', () => {
        if (ggbApi.current) setAnswerCheck(ggbApi.current?.getValue('green'))
      })
      return () => {
        ggbApi.current?.unregisterObjectUpdateListener('green')
      }
    }
  }, [answerCheck, ggbLoaded])

  useEffect(() => {
    stopPromptA.stop()
    stopPromptB.stop()
    stopPromptC.stop()
    stopPromptD.stop()
    if (ggbLoaded) {
      switch (idIndex) {
        case 0:
          setTextControl(0)
          break
        case 1:
          setTextControl(2)
          break
        case 2:
          setTextControl(4)
          break
        case 3:
          setTextControl(6)
      }
    }
  }, [ggbLoaded])

  useEffect(() => {
    stopPromptEndA.stop()
    stopPromptEndB.stop()
    stopPromptEndC.stop()
    stopPromptEndD.stop()
    if (clickStage === 1 && ggbLoaded) {
      if (answerCheck == 1) {
        switch (idIndex) {
          case 0:
            setTextControl(1)
            break
          case 1:
            setTextControl(3)
            break
          case 2:
            setTextControl(5)
            break
          case 3:
            setTextControl(7)
        }
      }
      if (answerCheck == 0) setTextControl(8)
    }
  }, [answerCheck, clickStage])

  useEffect(() => {
    stopError.stop()
    stopPromptA.stop()
    stopPromptB.stop()
    stopPromptC.stop()
    stopPromptD.stop()
    stopPromptEndA.stop()
    stopPromptEndB.stop()
    stopPromptEndC.stop()
    stopPromptEndD.stop()
    if (audioPlay) {
      switch (textControl) {
        case 0:
          playPromptA()
          break
        case 1:
          playPromptEndA()
          break
        case 2:
          playPromptB()
          break
        case 3:
          playPromptEndB()
          break
        case 4:
          playPromptC()
          break
        case 5:
          playPromptEndC()
          break
        case 6:
          playPromptD()
          break
        case 7:
          playPromptEndD()
          break
        case 8:
          playError()
          break
      }
    } else setIsPlaying(false)
  }, [textControl, audioPlay])

  const activeGgb = useMemo(
    () => (
      <StyledGeogebra
        key={idIndex}
        materialId={idArray[idIndex]}
        width={630}
        height={660}
        onApiReady={onApiReady}
        opacity={ggbLoaded ? 1 : 0}
      />
    ),
    [ggbLoaded, idIndex, onApiReady],
  )

  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#F6F6F6',
        id: 'g06-nsc09-s1-gb04',
        onEvent,
        className,
        themeName: 'dark',
      }}
    >
      <TextHeader
        text="Reflect the point across the given line of reflection."
        backgroundColor="#F6F6F6"
        buttonColor="#1a1a1a"
      />
      {activeGgb}
      {ggbLoaded && (
        <>
          {answerCheck == 1 && (
            <ButtonContainer>
              <TextImgButton imgSource={tryNew} onClick={onTryNewClick}>
                Try new
              </TextImgButton>
            </ButtonContainer>
          )}
          {answerCheck != 1 && (
            <ButtonContainer>
              <TextButton onClick={onCheckClick} disabled={!pointerMoved}>
                Check
              </TextButton>
            </ButtonContainer>
          )}
          {clickStage == 0 && (
            <FeedbackFlexBox move={!pointerMoved}>
              <>
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
                <PageFeedback>
                  Reflect the point {pointNames[idIndex]}&nbsp;
                  {idIndex == 1 || idIndex == 2 || idIndex == 0
                    ? idIndex == 0
                      ? 'across both the x-axis and y-axis'
                      : 'over the x-axis'
                    : 'over the y-axis'}
                  .
                </PageFeedback>
              </>
            </FeedbackFlexBox>
          )}
          {clickStage == 1 && answerCheck == 0 && (
            <FeedbackFlexBox move={!pointerMoved}>
              <>
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
                <PageFeedback>Uh-oh! You have plotted the wrong point.</PageFeedback>
              </>
            </FeedbackFlexBox>
          )}
          {clickStage == 1 && answerCheck == 1 && (
            <FeedbackFlexBox move={!pointerMoved} style={{ left: '-23px' }}>
              <>
                <SpeakerDiv style={{ top: '-14px' }}>
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
                <PageFeedback>
                  Awesome! You have reflected the point {pointNames[idIndex]} <br />
                  {idIndex == 1 || idIndex == 2 || idIndex == 0
                    ? idIndex == 0
                      ? 'across both the x-axis and y-axis'
                      : 'over the x-axis'
                    : 'over the y-axis'}
                  .
                </PageFeedback>
              </>
            </FeedbackFlexBox>
          )}
          <OnboardingController>
            <OnboardingStep index={0}>
              <PointerOnboarding complete={pointerMoved} />
            </OnboardingStep>
          </OnboardingController>
        </>
      )}
    </AppletContainer>
  )
}

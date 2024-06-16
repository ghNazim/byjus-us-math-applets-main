import { FC, useCallback, useEffect, useRef, useState } from 'react'
import styled, { keyframes } from 'styled-components'
import useSound from 'use-sound'

import { OnboardingAnimation } from '@/atoms/OnboardingAnimation'
import { OnboardingController } from '@/atoms/OnboardingController'
import { OnboardingStep } from '@/atoms/OnboardingStep'
import { AppletContainer } from '@/common/AppletContainer'
import { Geogebra } from '@/common/Geogebra'
import { GeogebraAppApi } from '@/common/Geogebra/Geogebra.types'
import { TextHeader } from '@/common/Header'
import { AppletInteractionCallback } from '@/contexts/analytics'
import { useHasChanged } from '@/hooks/useHasChanged'
import { useSFX } from '@/hooks/useSFX'

import muteBtn from './Assets/muteBtn.svg'
import retry from './Assets/retry.svg'
import tooltip from './Assets/toolTip.svg'
import tryNew from './Assets/tryNew.svg'
import unmuteBtn from './Assets/unmuteBtn.svg'
import audioError from './Audio/audioPromptError.mp3'
import audioIntro from './Audio/audioPromptIntro.mp3'
import audioSuccess from './Audio/audioPromptSuccess.mp3'
import { OutlineButton, TextButton, TextImgButton } from './Buttons/Buttons'

const StyledGeogebra = styled(Geogebra)`
  position: absolute;
  top: 85px;
  left: 50%;
  translate: -50%;
`
const FeedbackFlexBox = styled.div`
  position: absolute;
  top: 580px;
  width: 720px;
  transition: top 0.5s;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 5px;
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
const AnswerInputBorder = styled.button`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 8px 8px 8px 8px;
  gap: 20px;
  border: 2px solid #1a1a1a;
  background: #ffffff;
  border-radius: 7px;
  width: 76px;
  height: 60px;
  &:disabled {
    pointer-events: none;
    background-color: #77777730;
    border: 3px solid #777777;
  }
`
const AnswerInput = styled.input.attrs({ type: 'number' })`
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 500;
  font-size: 20px;
  line-height: 34px;
  color: #444444;
  background-color: transparent;
  justify-content: center;
  text-align: center;
  border: 0;
  max-width: 62px;

  appearance: textfield; /* Override the default number input appearance */
  -moz-appearance: textfield; /* Firefox */
  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0; /* Remove the default margin */
  }

  &:focus {
    outline: 0;
  }
`
const BottomCoordContainer = styled.label`
  position: absolute;
  top: 632px;
  left: 50%;
  translate: -50%;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 400;
  font-size: 24px;
  line-height: 32px;
  color: #444444;
  display: flex;
  justify-content: center;
  flex-direction: row;
  gap: 15px;
  width: 720px;
  height: 100px;
  p {
    position: relative;
    top: -12px;
  }
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
const GGBPatch = styled.div`
  position: absolute;
  top: 561px;
  left: 17px;
  width: 22px;
  height: 22px;
  background-color: #ffffff;
  z-index: 1;
`
const XLabel = styled.label<{ top: number; left: number }>`
  position: absolute;
  top: ${(props) => props.top + 38}px;
  left: ${(props) => props.left - 12}px;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: flex-start;
  padding: 4px 12px;
  gap: 10px;
  width: 36px;
  height: 36px;
  background: #fff2e5;
  border: 1px solid #ff8f1f;
  border-radius: 8px;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;
  display: flex;
  align-items: center;
  text-align: center;
  color: #ff8f1f;
`
const YLabel = styled.label<{ top: number; left: number }>`
  position: absolute;
  top: ${(props) => props.top + 80}px;
  left: ${(props) => props.left - 40}px;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: flex-start;
  padding: 4px 12px;
  gap: 10px;
  width: 36px;
  height: 36px;
  background: #faf2ff;
  border: 1px solid #aa5ee0;
  border-radius: 8px;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;
  display: flex;
  align-items: center;
  text-align: center;
  color: #aa5ee0;
`
const TreasureCoord1 = styled.label<{ top: number; left: number }>`
  position: absolute;
  top: ${(props) => props.top + 30}px;
  left: ${(props) => props.left + 15}px;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;
  display: flex;
  align-items: center;
  text-align: center;
  color: #1a1a1a;
  z-index: 1;
`
const TreasureCoord2 = styled.label<{ top: number; left: number }>`
  position: absolute;
  top: ${(props) => props.top + 103}px;
  left: ${(props) => props.left - 54}px;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;
  display: flex;
  align-items: center;
  text-align: center;
  color: #1a1a1a;
  z-index: 1;
`
const InputOnboarding = styled(OnboardingAnimation).attrs({ type: 'click' })`
  position: absolute;
  top: 615px;
  left: 280px;
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
    transition: 0.1s;
  }
  &:active {
    scale: 1.2;
    transition: 0.1s;
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

function locatePoint2d(pointName: string, ggbApi: GeogebraAppApi, xOffset = 0) {
  const pointX = ggbApi.getValue(`x(${pointName})`) + xOffset
  const pointY = ggbApi.getValue(`y(${pointName})`)
  const cornor1X = ggbApi.getValue('x(Corner(1))')
  const cornor1Y = ggbApi.getValue('y(Corner(1))')
  const cornor2X = ggbApi.getValue('x(Corner(2))')
  const cornor4Y = ggbApi.getValue('y(Corner(4))')
  const heightInPixel = ggbApi.getValue('y(Corner(5))')
  const widthInPixel = ggbApi.getValue('x(Corner(5))')

  return {
    leftPixel: ((pointX - cornor1X) / (cornor2X - cornor1X)) * widthInPixel,
    topPixel: heightInPixel - ((pointY - cornor1Y) / (cornor4Y - cornor1Y)) * heightInPixel,
  }
}

export const AppletG06NSC09S1GB02: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const ggbApi = useRef<GeogebraAppApi | null>(null)
  const [ggbLoaded, setGGBLoaded] = useState(false)
  const [xInput, setXInput] = useState<number | undefined>()
  const [yInput, setYInput] = useState<number | undefined>()
  const [answerCheck, setAnswerCheck] = useState<number>(0)
  const [pointerX, setPointerX] = useState({ leftPixel: 0, topPixel: 0 })
  const [pointerY, setPointerY] = useState({ leftPixel: 0, topPixel: 0 })
  const [pointerTreasure, setPointerTreasure] = useState({ leftPixel: 0, topPixel: 0 })
  const [isComplete, setComplete] = useState<number | undefined>()
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioPlay, setAudioPlay] = useState(true)
  const [textControl, setTextControl] = useState(-1)
  const [treasureXCoord, setTreasureXCoord] = useState<number | undefined>(0)
  const [treasureYCoord, setTreasureYCoord] = useState<number | undefined>(0)
  const [labelPosChange, setLabelPosChange] = useState(false)
  const [tryNewClick, setTryNewClick] = useState(false)
  const [tryAgainClick, setTryAgainClick] = useState(false)
  const [checkClick, setCheckClick] = useState(false)
  const [pirateXCoord, setPirateXCoord] = useState<number | undefined>(0)
  const [pirateYCoord, setPirateYCoord] = useState<number | undefined>(0)
  const [animComplete, setAnimComplete] = useState(false)

  const [showInputError, setShowInputError] = useState(false)

  const checkPlay = {
    onplay: () => setIsPlaying(true),
    onend: () => setIsPlaying(false),
  }

  const playMouseCLick = useSFX('mouseClick')
  const [playError, stopError] = useSound(audioError, checkPlay)
  const [playSuccess, stopSuccess] = useSound(audioSuccess, checkPlay)
  const [playIntro, stopIntro] = useSound(audioIntro, checkPlay)

  const hasInputChanged = useHasChanged(xInput || yInput)

  const onApiReady = useCallback((api: GeogebraAppApi | null) => {
    ggbApi.current = api
    setGGBLoaded(api != null)
  }, [])

  const onCheckClick = () => {
    setShowInputError(false)
    setCheckClick(true)
    setTryAgainClick(false)
    setTryNewClick(false)
    playMouseCLick()
    if (ggbLoaded) {
      ggbApi.current?.setValue('PirateXValue', xInput ?? 0)
      ggbApi.current?.setValue('PirateYValue', yInput ?? 0)
      ggbApi.current?.evalCommand('RunClickScript(Checkable)')
    }
  }

  const onTryAgainClick = () => {
    if (ggbLoaded) ggbApi.current?.evalCommand('RunClickScript(TryAgainC)')
    setCheckClick(false)
    setTryAgainClick(true)
    setTryNewClick(false)
    setXInput(0)
    setYInput(0)
    setComplete(0)
    playMouseCLick()
  }

  const onTryNewClick = () => {
    playMouseCLick()
    setCheckClick(false)
    setTryAgainClick(false)
    setTryNewClick(true)
    setXInput(0)
    setYInput(0)
    if (ggbLoaded) ggbApi.current?.evalCommand('RunClickScript(TryNewC)')
  }

  useEffect(() => {
    if (ggbLoaded) {
      setTryNewClick(false)
      setTryAgainClick(false)
    }
  }, [ggbLoaded])

  useEffect(() => {
    if (ggbApi.current) {
      ggbApi.current.registerObjectUpdateListener('ans', () => {
        if (ggbApi.current) setAnswerCheck(ggbApi.current?.getValue('ans'))
      })
      return () => {
        ggbApi.current?.unregisterObjectUpdateListener('ans')
      }
    }
  }, [answerCheck, ggbLoaded])

  useEffect(() => {
    const api = ggbApi.current
    if (api && ggbLoaded) {
      api.registerObjectUpdateListener('R', () => setPointerX(locatePoint2d('R', api)))
      return () => {
        ggbApi.current?.unregisterObjectUpdateListener('R')
      }
    }
  }, [ggbLoaded, tryNewClick, tryAgainClick])

  useEffect(() => {
    const api = ggbApi.current
    if (api && ggbLoaded) {
      api.registerObjectUpdateListener('S', () => setPointerY(locatePoint2d('S', api)))
      return () => {
        ggbApi.current?.unregisterObjectUpdateListener('S')
      }
    }
  }, [ggbLoaded, tryNewClick, tryAgainClick])

  useEffect(() => {
    const api = ggbApi.current
    if (api && ggbLoaded) setPointerTreasure(locatePoint2d('A', api))
  }, [ggbLoaded, tryNewClick, tryAgainClick])

  useEffect(() => {
    const api = ggbApi.current
    if (api && ggbLoaded) {
      api.registerObjectUpdateListener('A', () => setPointerTreasure(locatePoint2d('A', api)))
      return () => {
        ggbApi.current?.unregisterObjectUpdateListener('A')
      }
    }
  }, [ggbLoaded, tryNewClick, tryAgainClick])

  useEffect(() => {
    const api = ggbApi.current
    if (api && ggbLoaded) {
      api.registerObjectUpdateListener('isComplete', () =>
        setComplete(ggbApi.current?.getValue('isComplete')),
      )
      return () => {
        ggbApi.current?.unregisterObjectUpdateListener('isComplete')
      }
    }
  }, [ggbLoaded, tryNewClick, tryNewClick])

  useEffect(() => {
    if (ggbLoaded) setTreasureXCoord(ggbApi.current?.getXcoord('A'))
  }, [ggbLoaded, tryNewClick, tryAgainClick])

  useEffect(() => {
    const api = ggbApi.current
    if (api && ggbLoaded) {
      api.registerObjectUpdateListener('A', () => setTreasureXCoord(ggbApi.current?.getXcoord('A')))
      return () => {
        ggbApi.current?.unregisterObjectUpdateListener('A')
      }
    }
  }, [ggbLoaded, tryNewClick, tryAgainClick])

  useEffect(() => {
    if (ggbLoaded) setTreasureYCoord(ggbApi.current?.getYcoord('A'))
  }, [ggbLoaded, tryNewClick, tryAgainClick])

  useEffect(() => {
    const api = ggbApi.current
    if (api && ggbLoaded) {
      api.registerObjectUpdateListener('A', () => setTreasureYCoord(ggbApi.current?.getYcoord('A')))
      return () => {
        ggbApi.current?.unregisterObjectUpdateListener('A')
      }
    }
  }, [ggbLoaded, tryNewClick, tryAgainClick])

  useEffect(() => {
    if (ggbLoaded) setPirateXCoord(ggbApi.current?.getValue('P'))
  }, [ggbLoaded, tryNewClick, tryAgainClick])

  useEffect(() => {
    const api = ggbApi.current
    if (api && ggbLoaded) {
      api.registerObjectUpdateListener('P', () => setPirateXCoord(ggbApi.current?.getXcoord('P')))
      return () => {
        ggbApi.current?.unregisterObjectUpdateListener('P')
      }
    }
  }, [ggbLoaded, tryNewClick, tryAgainClick])

  useEffect(() => {
    if (ggbLoaded) setPirateYCoord(ggbApi.current?.getValue('Q'))
  }, [ggbLoaded, tryNewClick, tryAgainClick])

  useEffect(() => {
    const api = ggbApi.current
    if (api && ggbLoaded) {
      api.registerObjectUpdateListener('Q', () => setPirateYCoord(ggbApi.current?.getYcoord('Q')))
      return () => {
        ggbApi.current?.unregisterObjectUpdateListener('Q')
      }
    }
  }, [ggbLoaded, tryNewClick, tryAgainClick])

  useEffect(() => {
    if (pirateXCoord == xInput && pirateYCoord == yInput) setAnimComplete(true)
    else setAnimComplete(false)
  }, [pirateXCoord, pirateYCoord, xInput, yInput])

  useEffect(() => {
    stopError.stop()
    stopSuccess.stop()
    stopIntro.stop()
    if (audioPlay) {
      switch (textControl) {
        case 0:
          playIntro()
          break
        case 1:
          playError()
          break
        case 2:
          playSuccess()
          break
      }
    } else setIsPlaying(false)
  }, [textControl, audioPlay])

  useEffect(() => {
    if (ggbLoaded) {
      setTextControl(0)
      if (answerCheck == 1) setTextControl(1)
      if (answerCheck == 2) setTextControl(2)
    }
  }, [answerCheck, ggbLoaded])

  useEffect(() => {
    if (treasureXCoord == -1 || treasureYCoord == -1 || (treasureYCoord ?? 0) > 4)
      setLabelPosChange(true)
    else setLabelPosChange(false)
  }, [treasureXCoord, treasureYCoord])

  useEffect(() => {
    if (xInput) {
      if (xInput > 7) {
        setShowInputError(true)
        setXInput(7)
      } else if (xInput < -7) {
        setShowInputError(false)
        setXInput(-7)
      }
    }

    if (yInput) {
      if (yInput > 5) {
        setShowInputError(true)
        setYInput(5)
      } else if (yInput < -5) {
        setShowInputError(false)
        setYInput(-5)
      }
    }
  }, [xInput, yInput])

  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#f6f6f6',
        id: 'g06-nsc09-s1-gb02',
        onEvent,
        className,
        themeName: 'dark',
      }}
    >
      <TextHeader
        text="Use your coordinate plane skills to help the pirate find the treasure."
        backgroundColor="#f6f6f6"
        buttonColor="#1a1a1a"
      />
      <StyledGeogebra materialId="e7g8byug" width={704} height={510} onApiReady={onApiReady} />
      {ggbLoaded ? (
        <>
          {answerCheck == 0 && (
            <>
              <FeedbackFlexBox>
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
                  Enter the <span style={{ color: '#FF8F1F' }}>&nbsp;𝑥&nbsp;</span>and{' '}
                  <span style={{ color: '#AA5EE0' }}>&nbsp;𝑦&nbsp;</span> coordinate.
                </PageFeedback>
              </FeedbackFlexBox>
              <BottomCoordContainer>
                <p>
                  {' '}
                  ( <span style={{ color: '#FF8F1F', fontWeight: '700' }}>𝑥</span> ,{' '}
                  <span style={{ color: '#AA5EE0', fontWeight: '700' }}>𝑦</span> ) = (
                </p>
                <AnswerInputBorder>
                  <AnswerInput
                    value={xInput}
                    min={-7}
                    max={7}
                    onChange={(e) => {
                      if (e.target.value) {
                        setXInput(parseFloat(e.target.value))
                      } else {
                        setXInput(undefined)
                      }
                    }}
                  />
                </AnswerInputBorder>
                <p>,</p>
                <AnswerInputBorder>
                  <AnswerInput
                    value={yInput}
                    onChange={(e) => {
                      if (e.target.value) {
                        setYInput(parseFloat(e.target.value))
                      } else {
                        setYInput(undefined)
                      }
                    }}
                  ></AnswerInput>
                </AnswerInputBorder>
                <p>)</p>
              </BottomCoordContainer>
              <ButtonContainer>
                <TextButton onClick={onCheckClick}>Check</TextButton>
              </ButtonContainer>
            </>
          )}
          {answerCheck == 1 && (
            <>
              <FeedbackFlexBox>
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
                <PageFeedback>Uh oh, the coordinate you entered is not correct.</PageFeedback>
              </FeedbackFlexBox>
              <ButtonContainer>
                <TextImgButton imgSource={retry} onClick={onTryAgainClick} disabled={!animComplete}>
                  Try again
                </TextImgButton>
              </ButtonContainer>
            </>
          )}
          {answerCheck == 2 && (
            <>
              <FeedbackFlexBox>
                <SpeakerDiv style={{ top: '-15px' }}>
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
                  Well done! You found the treasure.
                  <br />
                  Keep going and help the pirate find more
                </PageFeedback>
              </FeedbackFlexBox>
              <ButtonContainer>
                <OutlineButton imgSource={tryNew} onClick={onTryNewClick} disabled={!animComplete}>
                  Try new
                </OutlineButton>
              </ButtonContainer>
            </>
          )}
          {isComplete == 1 && checkClick && (
            <>
              {xInput != 0 && (
                <XLabel top={pointerX.topPixel} left={pointerX.leftPixel}>
                  {xInput}
                </XLabel>
              )}
              {yInput != 0 && (
                <YLabel top={pointerY.topPixel} left={pointerY.leftPixel}>
                  {yInput}
                </YLabel>
              )}
            </>
          )}
          {!labelPosChange && (
            <TreasureCoord1 top={pointerTreasure.topPixel} left={pointerTreasure.leftPixel}>
              (
              <span style={{ color: '#FF8F1F', fontWeight: '700' }}>
                {isComplete && answerCheck == 2 ? xInput : '𝑥'}
              </span>
              ,
              <span style={{ color: '#AA5EE0', fontWeight: '700' }}>
                {isComplete && answerCheck == 2 ? yInput : '𝑦'}
              </span>
              )
            </TreasureCoord1>
          )}
          {labelPosChange && (
            <TreasureCoord2 top={pointerTreasure.topPixel} left={pointerTreasure.leftPixel}>
              (
              <span style={{ color: '#FF8F1F', fontWeight: '700' }}>
                {isComplete && answerCheck == 2 ? xInput : '𝑥'}
              </span>
              ,
              <span style={{ color: '#AA5EE0', fontWeight: '700' }}>
                {isComplete && answerCheck == 2 ? yInput : '𝑦'}
              </span>
              )
            </TreasureCoord2>
          )}
          <OnboardingController>
            <OnboardingStep index={0}>
              <InputOnboarding complete={hasInputChanged} />
            </OnboardingStep>
          </OnboardingController>
          <GGBPatch></GGBPatch>
          {showInputError ? (
            <img src={tooltip} style={{ position: 'absolute', bottom: '17px', right: '57px' }} />
          ) : undefined}
        </>
      ) : undefined}
    </AppletContainer>
  )
}

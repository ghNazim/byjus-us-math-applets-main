import { FC, useCallback, useContext, useEffect, useRef, useState } from 'react'
import styled, { keyframes } from 'styled-components'
import useSound from 'use-sound'

import { OnboardingAnimation } from '@/atoms/OnboardingAnimation'
import { OnboardingController } from '@/atoms/OnboardingController'
import { OnboardingStep } from '@/atoms/OnboardingStep'
import { AnimatedInputSlider } from '@/common/AnimatedInputSlider'
import { AppletContainer } from '@/common/AppletContainer'
import { Geogebra } from '@/common/Geogebra'
import { GeogebraAppApi } from '@/common/Geogebra/Geogebra.types'
import { TextHeader } from '@/common/Header'
import { AnalyticsContext, AppletInteractionCallback } from '@/contexts/analytics'
import { useSFX } from '@/hooks/useSFX'

import loadScreen from './Assets/loadScreen.png'
import muteBtn from './Assets/muteBtn.svg'
import retryIcon from './Assets/retryIcon.svg'
import startIcon from './Assets/startIcon.svg'
import unmuteBtn from './Assets/unmuteBtn.svg'
import nextAudio from './Audio/nextAudio.mp3'
import startAudio from './Audio/startAudio.mp3'
import { AnimatedRetryButton, AnimatedStartButton } from './Buttons/AnimatedButtons'

const FONT_SIZE_FOR_MOBILE = 26

const StyledGeogebra = styled(Geogebra)<{ fadeGGB: boolean }>`
  position: absolute;
  width: 680px;
  height: 438px;
  left: 20px;
  top: 95px;
  opacity: ${({ fadeGGB }) => (fadeGGB ? 1 : 0)};
  transition: 300ms ease-out;
`
const LoadScreenBox = styled.img`
  position: absolute;
  width: 680px;
  height: 438px;
  left: 18px;
  top: 92px;
`
const FormulaBox = styled.label`
  position: absolute;
  top: 555px;
  width: 720px;
  height: auto;
  left: 50%;
  translate: -50%;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  line-height: 28px;
  display: flex;
  align-items: center;
  text-align: center;
  justify-content: center;
  color: #444444;
  transition: 0.3s ease-out;
  font-size: 20px;
  @media (max-width: 768px) {
    font-size: ${FONT_SIZE_FOR_MOBILE}px;
  }
`
const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`
const PageFeedbacks = styled.label`
  position: absolute;
  top: 640px;
  left: 50%;
  translate: -50%;
  width: 720px;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  -webkit-font-smoothing: antialiased !important;
  line-height: 28px;
  display: flex;
  align-items: center;
  text-align: center;
  justify-content: center;
  color: #444444;
  animation: ${fadeIn} 0.5s ease-out;
  transition: 0.3s ease-out;
  padding: 0 20px;
  font-size: 20px;
  @media (max-width: 768px) {
    font-size: ${FONT_SIZE_FOR_MOBILE}px;
    gap: 5px;
    padding: 0 10px;
  }
`
const ButtonContainer = styled.button`
  position: absolute;
  width: 146px;
  height: 60px;

  left: 50%;
  translate: -50%;
  top: 710px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background-color: transparent;
`
const InputSlider = styled(AnimatedInputSlider)<{ showSlider: boolean }>`
  position: absolute;
  top: 430px;
  left: 50%;
  translate: -50%;
  opacity: ${(props) => (props.showSlider ? 1 : 0)};
  transition: 0.3s ease-out;
  &:disabled {
    pointer-events: none;
  }
`
const ColumnBox1 = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
`
const LabelBox = styled.label`
  width: auto;
  height: auto;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  @media (max-width: 768px) {
    font-size: ${FONT_SIZE_FOR_MOBILE}px;
  }
  line-height: 28px;
  text-align: center;
  color: #444444;
`
const LineDivider = styled.div`
  width: 167px;
  background: #444444;
  border: 1px solid #000000;
`
const StartOnboarding = styled(OnboardingAnimation).attrs({ type: 'click' })`
  position: absolute;
  top: 700px;
  left: 50%;
  translate: -50%;
  pointer-events: none;
`
const SpeakerDiv = styled.div`
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  top: 0;
  @media (max-width: 768px) {
    left: 40px;
  }
  /* background-color: red; */
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
  /* top: 0;
  left: 0; */
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

const StyledTextHeader = styled(TextHeader)`
  /* font-size: 28px !important; */
  p {
    font-size: 20px;
    @media (max-width: 768px) {
      font-size: ${FONT_SIZE_FOR_MOBILE}px !important;
    }
  }
`

export const AppletG07GMC05S1GB02: FC<{
  onEvent: AppletInteractionCallback
  className?: string
  onComplete: () => void
}> = ({ onEvent, className, onComplete }) => {
  const ggbApi = useRef<GeogebraAppApi | null>(null)
  const [ggbLoaded, setGgbLoaded] = useState<boolean>(false)
  const [clickStage, setClickStage] = useState<number>(0)
  const [piVal, setPiVal] = useState<number | undefined>(0)
  const [audioPlay, setAudioPlay] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)
  const [textControl, setTextControl] = useState(-1)
  const [sliderVal, setSliderVal] = useState(0)

  const playMouseClick = useSFX('mouseClick')
  const playMouseIn = useSFX('mouseIn')
  const playMouseOut = useSFX('mouseOut')
  const onInteraction = useContext(AnalyticsContext)

  const checkPlay = {
    onplay: () => setIsPlaying(true),
    onend: () => setIsPlaying(false),
  }

  const [playStartPrompt, stopStartPrompt] = useSound(startAudio, checkPlay)
  const [playNextPrompt, stopNextPrompt] = useSound(nextAudio, checkPlay)

  const onApiReady = useCallback(
    (api: GeogebraAppApi | null) => {
      ggbApi.current = api
      setGgbLoaded(api != null)

      if (api == null) return
      api.registerClientListener((e: any) => {
        if (e.type === 'mouseDown' && e.hits[0] === 'A') {
          onInteraction('drag')
          playMouseIn()
        } else if (e.type === 'dragEnd' && e.target === 'A') {
          onInteraction('drop')
          playMouseOut()
        }
      })
    },
    [onInteraction, playMouseIn, playMouseOut],
  )

  const onSliderChange = (value: number) => {
    setSliderVal(value / 100)
    if (ggbLoaded) ggbApi.current?.setValue('t', value / 15)
  }

  const onStartClick = () => {
    playMouseClick()
    setClickStage(1)
  }
  const onRetryClick = () => {
    playMouseClick()
    setTextControl(-1)
    setClickStage(0)
    if (ggbLoaded) {
      ggbApi.current?.evalCommand('RunClickScript(button1)')
    }
  }

  useEffect(() => {
    const api = ggbApi.current
    if (api && ggbLoaded) {
      api.registerObjectUpdateListener('nod', () => setPiVal(ggbApi.current?.getValue('nod')))
      return () => {
        ggbApi.current?.unregisterObjectUpdateListener('nod')
      }
    }
  }, [ggbLoaded])

  useEffect(() => {
    if (ggbLoaded) {
      switch (clickStage) {
        case 0:
          setTextControl(0)
          break
        case 1:
          setTextControl(1)
          break
      }
    }
  }, [ggbLoaded, clickStage])

  useEffect(() => {
    stopStartPrompt.stop()
    stopNextPrompt.stop()

    if (audioPlay) {
      switch (textControl) {
        case 0:
          playStartPrompt()
          break
        case 1:
          playNextPrompt()
          break
      }
    } else setIsPlaying(false)
  }, [textControl, audioPlay])

  useEffect(() => {
    if (sliderVal == 1 && piVal == 3 && clickStage !== 0) setClickStage(2)
  }, [clickStage, piVal, sliderVal])

  useEffect(() => {
    if (clickStage === 2) onComplete()
  }, [clickStage])

  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#f6f6f6',
        id: 'landing-page-applet2',
        onEvent,
        className,
        themeName: 'dark',
      }}
    >
      <StyledTextHeader
        text="Discover the value of π."
        backgroundColor="#f6f6f6"
        buttonColor="#1a1a1a"
      />
      <LoadScreenBox src={loadScreen} />
      <StyledGeogebra
        materialId="gmwnyuxd"
        onApiReady={onApiReady}
        fadeGGB={ggbLoaded ? true : false}
      />
      {ggbLoaded && (
        <>
          <InputSlider
            showSlider={clickStage !== 0}
            value={0}
            onChangePercent={onSliderChange}
            reset={clickStage == 0}
          />
          <FormulaBox>
            <ColumnBox1>
              <LabelBox style={{ marginBottom: '10px' }}>Circumference (C)</LabelBox>
              <LineDivider />
              <LabelBox style={{ marginTop: '10px' }}>Diameter (D)</LabelBox>
            </ColumnBox1>
            &nbsp; ≈ &nbsp;
            <LabelBox
              style={{
                width: 'auto',
                height: '28px',
                background: '#FAF2FF',
                borderRadius: '5px',
                color: '#AA5EE0',
              }}
            >
              &nbsp;{piVal === 0 ? 'π' : piVal === 3 ? '3.14' : piVal}&nbsp;
            </LabelBox>
          </FormulaBox>
          {clickStage == 0 && (
            <PageFeedbacks>
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
              <div>
                <span
                  style={{
                    width: 'auto',
                    height: '28px',
                    background: '#FAF2FF',
                    borderRadius: '5px',
                    color: '#AA5EE0',
                  }}
                >
                  &nbsp;π&nbsp;
                </span>
                &nbsp;is the&nbsp;
                <span
                  style={{
                    width: 'auto',
                    height: '28px',
                    background: '#FAF2FF',
                    borderRadius: '5px',
                    color: '#AA5EE0',
                  }}
                >
                  &nbsp;number of times&nbsp;
                </span>
                &nbsp;the diameter wraps around the circle.
              </div>
            </PageFeedbacks>
          )}
          {clickStage == 1 && piVal == 0 && (
            <PageFeedbacks>
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
              <div>
                Wrap the diameters around the circle to determine&nbsp;
                <span
                  style={{
                    width: 'auto',
                    height: '28px',
                    background: '#FAF2FF',
                    borderRadius: '5px',
                    color: '#AA5EE0',
                  }}
                >
                  &nbsp;π&nbsp;
                </span>
              </div>
            </PageFeedbacks>
          )}
          {clickStage == 0 && (
            <ButtonContainer>
              <AnimatedStartButton imgSource={startIcon} onClick={onStartClick}>
                Start
              </AnimatedStartButton>
            </ButtonContainer>
          )}
          {clickStage == 2 && (
            <>
              <PageFeedbacks style={{ top: '660px' }}>
                <span
                  style={{
                    width: 'auto',
                    height: '28px',
                    background: '#FAF2FF',
                    borderRadius: '5px',
                    color: '#AA5EE0',
                  }}
                >
                  &nbsp;π&nbsp;
                </span>
                &nbsp;≈&nbsp;
                <span
                  style={{
                    width: 'auto',
                    height: '28px',
                    background: '#FAF2FF',
                    borderRadius: '5px',
                    color: '#AA5EE0',
                  }}
                >
                  &nbsp;3.14&nbsp;
                </span>
              </PageFeedbacks>
              {/* <ButtonContainer>
            <AnimatedRetryButton
              imgSource={retryIcon}
              onClick={onRetryClick}
              disabled={sliderVal !== 1}
            >
              Retry
            </AnimatedRetryButton>
          </ButtonContainer> */}
            </>
          )}
          <OnboardingController>
            <OnboardingStep index={0}>
              <StartOnboarding complete={clickStage == 1} />
            </OnboardingStep>
          </OnboardingController>
        </>
      )}
    </AppletContainer>
  )
}

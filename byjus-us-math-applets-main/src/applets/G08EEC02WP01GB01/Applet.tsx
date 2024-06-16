import { FC, useCallback, useContext, useEffect, useRef, useState } from 'react'
import styled, { keyframes } from 'styled-components'

import { OnboardingAnimation } from '@/atoms/OnboardingAnimation'
import { OnboardingController } from '@/atoms/OnboardingController'
import { OnboardingStep } from '@/atoms/OnboardingStep'
import { AppletContainer } from '@/common/AppletContainer'
import { Geogebra } from '@/common/Geogebra'
import { GeogebraAppApi } from '@/common/Geogebra/Geogebra.types'
import { TextHeader } from '@/common/Header'
import { AnalyticsContext, AppletInteractionCallback } from '@/contexts/analytics'
import { useSFX } from '@/hooks/useSFX'

import retryIcon from './Assets/retryIcon.svg'
import introAudio from './Audio/intro.mp3'
import secondAudio from './Audio/secondStep.mp3'
import { OutlineButton, TextButton } from './Buttons/AnimatedButtons'
import { VoiceOverCommon, VOProvider } from './Components/VoiceOverCommon'

const StyledGeogebra = styled(Geogebra)<{ fadeGGB: boolean }>`
  position: absolute;
  width: 580px;
  height: 580px;
  left: 50%;
  translate: -50%;
  top: 85px;
  opacity: ${({ fadeGGB }) => (fadeGGB ? 1 : 0)};
  transition: 300ms ease-out;
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
const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`

const fadeOut = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`
const PageFeedbacks = styled.label<{ move?: boolean; fading?: boolean }>`
  position: absolute;
  top: ${({ move }) => (move ? '735px' : '640px')};
  left: 50%;
  transform: translateX(-50%);
  width: 500px;
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
  animation: ${({ fading }) => (fading ? fadeOut : fadeIn)} 0.3s ease-out;
  opacity: ${({ fading }) => (fading ? 0 : 1)};
`
const AppletOnboarding = styled(OnboardingAnimation)<{ left: number; top: number; type: string }>`
  position: absolute;
  top: ${(a) => a.top}px;
  left: ${(a) => a.left}px;
  width: 400px;
`

export const AppletG08EEC02WP01GB01: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const ggbApi = useRef<GeogebraAppApi | null>(null)
  const [ggbLoaded, setGgbLoaded] = useState<boolean>(false)

  const [hasMoved, setHasMoved] = useState(false)
  const [clickStage, setClickStage] = useState(0)
  const [widthVal, setWidthVal] = useState<number | undefined>(0)
  const [hasCompleted, setCompleted] = useState(false)
  const [boxVal, setBoxVal] = useState<number | undefined>(0)
  const [textControl, setTextControl] = useState<number>(-1)

  const playMouseIn = useSFX('mouseIn')
  const playMouseOut = useSFX('mouseOut')
  const onInteraction = useContext(AnalyticsContext)

  const onApiReady = useCallback(
    (api: GeogebraAppApi | null) => {
      ggbApi.current = api
      setGgbLoaded(api != null)

      if (api == null) return
      api.registerClientListener((e: any) => {
        if (e.type === 'mouseDown' && e.hits[0] === 'pic1') {
          onInteraction('drag')
          playMouseIn()
        } else if (e.type === 'dragEnd' && e.target === 'pic1') {
          onInteraction('drop')
          playMouseOut()
          setHasMoved(true)
        }
      })
    },
    [onInteraction, playMouseIn, playMouseOut],
  )

  useEffect(() => {
    if (ggbLoaded) setTextControl(0)
    if (clickStage === 1 && hasCompleted) setTextControl(1)
  }, [clickStage, ggbLoaded, hasCompleted])

  const onNextClick = () => {
    setClickStage(1)
    if (ggbLoaded) ggbApi.current?.evalCommand('RunClickScript(button1)')
  }

  const onResetClick = () => {
    setClickStage(0)
    setHasMoved(false)
    setCompleted(false)
    if (ggbLoaded) ggbApi.current?.evalCommand('RunClickScript(button2)')
  }

  useEffect(() => {
    const api = ggbApi.current
    if (api && ggbLoaded) {
      api.registerObjectUpdateListener('s', () => setWidthVal(ggbApi.current?.getValue('s')))
      return () => {
        ggbApi.current?.unregisterObjectUpdateListener('s')
      }
    }
  }, [ggbLoaded])

  useEffect(() => {
    const api = ggbApi.current
    if (api && ggbLoaded) {
      api.registerObjectUpdateListener('e', () => setBoxVal(ggbApi.current?.getValue('e')))
      return () => {
        ggbApi.current?.unregisterObjectUpdateListener('e')
      }
    }
  }, [ggbLoaded])

  useEffect(() => {
    if (boxVal === (widthVal ?? 1) * (widthVal ?? 1) && clickStage === 1) setCompleted(true)
    else setCompleted(false)
  }, [boxVal, clickStage, widthVal])

  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#F6F6F6',
        id: 'g08-eec02-wp01-gb01',
        onEvent,
        className,
      }}
    >
      <TextHeader
        text="Explore the relation between area of a square and
perfect square numbers"
        backgroundColor="#F6F6F6"
        buttonColor="#1A1A1A"
      />
      <StyledGeogebra
        materialId="ktqt6ytn"
        onApiReady={onApiReady}
        fadeGGB={ggbLoaded ? true : false}
      />
      {ggbLoaded && (
        <>
          <VOProvider>
            <PageFeedbacks fading={clickStage === 1}>
              <VoiceOverCommon enabled={textControl === 0} audioSrc={introAudio} />
              <div>Move the vertex to resize the square to your preferred dimension.</div>
            </PageFeedbacks>
            <PageFeedbacks style={{ top: '655px', width: '600px' }} fading={!hasCompleted}>
              <VoiceOverCommon enabled={textControl === 1} audioSrc={secondAudio} />
              <div>
                Area of a square is always a&nbsp;
                <span style={{ borderRadius: '5px', background: '#DFF1F1', color: '#2D6066' }}>
                  &nbsp;square number&nbsp;
                </span>
                .
              </div>
            </PageFeedbacks>
          </VOProvider>
          <PageFeedbacks style={{ top: '620px' }} fading={clickStage === 0}>
            Area of square = {widthVal} × {widthVal} =&nbsp;
            <span style={{ borderRadius: '5px', background: '#DFF1F1', color: '#2D6066' }}>
              &nbsp;{(widthVal ?? 1) * (widthVal ?? 1)}&nbsp;
            </span>
          </PageFeedbacks>
          {clickStage === 0 && (
            <ButtonContainer>
              <TextButton disabled={!hasMoved} onClick={onNextClick}>
                Next
              </TextButton>
            </ButtonContainer>
          )}
          {clickStage === 1 && (
            <ButtonContainer>
              <OutlineButton imgSource={retryIcon} onClick={onResetClick} disabled={!hasCompleted}>
                Reset
              </OutlineButton>
            </ButtonContainer>
          )}
          <OnboardingController>
            <OnboardingStep index={0}>
              <AppletOnboarding type="moveAllDirections" top={407} left={-17} complete={hasMoved} />
            </OnboardingStep>
          </OnboardingController>
        </>
      )}
    </AppletContainer>
  )
}

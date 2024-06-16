import { Alignment, EventCallback, Fit, Layout, useRive } from '@rive-app/react-canvas'
import { FC, useCallback, useContext, useEffect, useState } from 'react'
import styled from 'styled-components'

import { DnDOnboardingAnimation } from '@/atoms/OnboardingAnimation/DnDOnboardingAnimation'
import { OnboardingController } from '@/atoms/OnboardingController'
import { OnboardingStep } from '@/atoms/OnboardingStep'
import { AppletContainer } from '@/common/AppletContainer'
import { TextHeader } from '@/common/Header'
import { AnalyticsContext, AppletInteractionCallback } from '@/contexts/analytics'
import { useEffectPostLoad } from '@/hooks/useEffectPostLoad'
import { useHasChanged } from '@/hooks/useHasChanged'
import { usePrevious } from '@/hooks/usePrevious'
import { useSFX } from '@/hooks/useSFX'

import riveAnimation from './rive/G06EEC08S1GB04.riv'

const STATE_NAME = 'State Machine 1'

const TextContainer = styled.p<{ posMove: boolean }>`
  width: 720px;
  position: absolute;
  top: ${(props) => (props.posMove ? 620 : 655)}px;
  display: flex;
  justify-content: center;
  transition: 0.3s;
`
const Text = styled.span<{ color: string; textFade: boolean; resize: boolean }>`
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: ${(props) => (props.resize ? 16 : 20)}px;
  line-height: 28px;
  color: ${(props) => props.color};
  opacity: ${(props) => (props.textFade ? 1 : 0)};
  text-align: center;
  transition: 0.3s;
  pointer-events: none;
`

const LastText = styled.p<{ textFade: boolean }>`
  position: absolute;
  width: 624px;
  height: 28px;
  left: 47px;
  top: 655px;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 28px;
  text-align: center;
  opacity: ${(props) => (props.textFade ? 1 : 0)};
  transition: 0.3s;
  color: #444444;
  pointer-events: none;
`

const InitialPositonFirstOB = { top: 200, left: 380 }
const FinalPositionFirstOB = { top: 330, left: 130 }

const InitialPositonSecondOB = { top: 250, left: 380 }
const FinalPositionSecondOB = { top: 330, left: 120 }

export const AppletG06EEC08S1GB04: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const [index, setIndex] = useState(-1)
  const [showLastText, setShowLastText] = useState(false)
  const showText = index > -1
  const [posChange, setPosChange] = useState(false)
  const [isClicked, setIsClicked] = useState(false)
  const [retryClicked, setRetryClicked] = useState(false)
  const [eventName, setEventName] = useState<string>()
  const playMouseIn = useSFX('mouseIn')
  const playMouseOut = useSFX('mouseOut')
  const playMouseClick = useSFX('mouseClick')
  const onInteraction = useContext(AnalyticsContext)
  const previousEventName = usePrevious(eventName)
  const [showOnboarding, setShowOnboarding] = useState(false)

  const hasStateOneChanged = useHasChanged(index == 0)
  const hasStateTwoChanged = useHasChanged(index == 1)

  const onStateChange: EventCallback = useCallback((event) => {
    const eventName = Array.isArray(event.data) ? event.data[0] : ''
    if (eventName.includes('Pressed')) {
      setIsClicked(true)
      setIndex(-1)
    }
    if (eventName.includes('Placed')) {
      setIsClicked(false)
      setIndex(+eventName.slice(0, eventName.indexOf('lbPlaced')) - 1)
    }
    if (eventName.includes('Start')) {
      setIsClicked(false)
      setIndex(+eventName.slice(0, eventName.indexOf('lbStart')) - 2)
    }
    if (eventName === 'retryDefault') {
      setPosChange(true)
      setShowLastText(true)
    }
    if (eventName === '1lbStart') {
      setIndex(-1)
      setShowLastText(false)
      setPosChange(false)
    }
    if (eventName === '2lbStart') {
      setShowOnboarding(true)
    }
    setEventName(eventName)
  }, [])

  useEffect(() => {
    if (previousEventName === 'retryHover' && eventName === '1lbStart') setRetryClicked(true)
  }, [eventName, previousEventName])

  useEffectPostLoad(() => {
    if (isClicked) {
      playMouseIn()
      onInteraction('drag')
    } else if (!isClicked) {
      playMouseOut()
      onInteraction('drop')
    }
  }, [isClicked])

  useEffectPostLoad(() => {
    if (retryClicked) {
      playMouseClick()
      onInteraction('tap')
    }
  }, [retryClicked])
  const { RiveComponent: RiveComponentPlayback } = useRive({
    src: riveAnimation,
    autoplay: true,
    stateMachines: STATE_NAME,
    layout: new Layout({
      fit: Fit.Contain,
      alignment: Alignment.Center,
    }),
    onStateChange,
    artboard: 'G06EEC08S1GB04',
  })
  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#F6F6F6',
        id: 'g06-eec08-s1-gb04',
        onEvent,
        className,
      }}
    >
      <TextHeader
        text="Add weights to the spring and observe the relationship between weight and spring length."
        backgroundColor="#F6F6F6"
        buttonColor="#1A1A1A"
      />
      <RiveComponentPlayback
        style={{
          top: 85,
          width: 720,
          height: 720,
          position: 'absolute',
          left: '50%',
          translate: '-50%',
        }}
      />
      <LastText textFade={showLastText}>
        Final length = <span style={{ color: '#CC6666' }}>Initial Length</span> +{' '}
        <span style={{ color: '#6549C2' }}>Weight × Per unit change in length</span>
      </LastText>
      <TextContainer posMove={posChange}>
        <Text color="#444" textFade={true} resize={posChange}>
          Final length = <span style={{ color: '#CC6666' }}>10 in</span>
          {index > -1 && (
            <>
              {' '}
              + <span style={{ color: '#6549C2' }}>{index + 1}</span> × 2 in
            </>
          )}
        </Text>
      </TextContainer>
      <OnboardingController>
        <OnboardingStep index={0}>
          <DnDOnboardingAnimation
            complete={hasStateOneChanged}
            initialPosition={InitialPositonFirstOB}
            finalPosition={FinalPositionFirstOB}
          />
        </OnboardingStep>
        {showOnboarding && (
          <OnboardingStep index={1}>
            <DnDOnboardingAnimation
              complete={hasStateTwoChanged}
              initialPosition={InitialPositonSecondOB}
              finalPosition={FinalPositionSecondOB}
            />
          </OnboardingStep>
        )}
      </OnboardingController>
    </AppletContainer>
  )
}

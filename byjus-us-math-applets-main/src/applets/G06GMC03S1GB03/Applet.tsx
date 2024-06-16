import {
  Alignment,
  EventCallback,
  Fit,
  Layout,
  useRive,
  useStateMachineInput,
} from '@rive-app/react-canvas'
import { FC, useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'

import { OnboardingAnimation } from '@/atoms/OnboardingAnimation'
import { OnboardingController } from '@/atoms/OnboardingController'
import { OnboardingStep } from '@/atoms/OnboardingStep'
import { AppletContainer } from '@/common/AppletContainer'
import { TextHeader } from '@/common/Header'
import { AppletInteractionCallback } from '@/contexts/analytics'
import { useSFX } from '@/hooks/useSFX'

import tryNew from './Assets/tryNew.svg'
import { OutlineButton, TextButton } from './Buttons/Buttons'
import riveFile from './Rive/riveFile.riv'

const ButtonContainer = styled.div`
  position: absolute;
  top: 720px;
  left: 50%;
  translate: -50%;
  display: flex;
  flex-direction: row;
  justify-content: center;
`
const BtnOnboarding = styled(OnboardingAnimation).attrs({ type: 'click' })`
  position: absolute;
  top: 700px;
  left: 280px;
  pointer-events: none;
`
const TrapOnboarding1 = styled(OnboardingAnimation).attrs({ type: 'click' })`
  position: absolute;
  top: 305px;
  left: 150px;
  pointer-events: none;
`
const TrapOnboarding2 = styled(OnboardingAnimation).attrs({ type: 'click' })`
  position: absolute;
  top: 260px;
  left: 270px;
  pointer-events: none;
`
const RectOnboarding = styled(OnboardingAnimation).attrs({ type: 'click' })`
  position: absolute;
  top: 305px;
  left: 330px;
  pointer-events: none;
`
const SqOnboarding = styled(OnboardingAnimation).attrs({ type: 'click' })`
  position: absolute;
  top: 190px;
  left: 430px;
  pointer-events: none;
`
const TriaOnboarding = styled(OnboardingAnimation).attrs({ type: 'click' })`
  position: absolute;
  top: 350px;
  left: 270px;
  pointer-events: none;
`

export const AppletG06GMC03S1GB03: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const [riveStage, setRiveStage] = useState<string>()
  const [clickStage, setClickStage] = useState(0)

  const playMouseClick = useSFX('mouseClick')

  const onStateChange: EventCallback = useCallback(
    (event: any) => {
      if (event.data[0] === 'slide01') {
        setRiveStage('PoolStart')
      }
      if (event.data[0] === 'PoolEnd') {
        setRiveStage('PoolEnd')
      }
      if (event.data[0] === 'slide04Action') {
        setClickStage(1)
      }
      if (event.data[0] === 'trapezium') {
        setClickStage(2)
        playMouseClick()
      }
      if (event.data[0] === 'rectangle') {
        setClickStage(3)
        playMouseClick()
      }
      if (event.data[0] === 'square') {
        setClickStage(4)
        playMouseClick()
      }
      if (event.data[0] === 'Boat01') {
        setRiveStage('BoatStart')
        setClickStage(5)
      }
      if (event.data[0] === 'boatEnd') {
        setRiveStage('BoatEnd')
        setClickStage(0)
      }
      if (event.data[0] === 'Boat04') {
        setClickStage(6)
      }
      if (event.data[0] === 'TrianglePressed') {
        setClickStage(7)
        playMouseClick()
      }
      if (event.data[0] === 'TrapezoidPressed') {
        setClickStage(8)
        playMouseClick()
      }
    },
    [playMouseClick],
  )

  const { rive: rivePool, RiveComponent } = useRive({
    src: riveFile,
    autoplay: true,
    stateMachines: 'StateMachine',
    layout: new Layout({
      fit: Fit.Contain,
      alignment: Alignment.Center,
    }),
    onStateChange: onStateChange,
  })

  const forwardTrigger = useStateMachineInput(rivePool, 'StateMachine', 'forward')
  const resetTrigger = useStateMachineInput(rivePool, 'StateMachine', 'reset')

  const onNextClick = () => {
    playMouseClick()
    forwardTrigger?.fire()
  }

  const onTryNewClick = () => {
    playMouseClick()
    resetTrigger?.fire()
  }

  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#F6F6F6',
        id: 'g06-gmc03-s1-gb03',
        onEvent,
        className,
        themeName: 'dark',
      }}
    >
      <TextHeader
        text="Break down the shape of the pool into known shapes to determine its area."
        backgroundColor="#F6F6F6"
        buttonColor="#1a1a1a"
      />
      <RiveComponent
        style={{
          top: 95,
          width: 660,
          height: 600,
          position: 'absolute',
          left: '50%',
          translate: '-50%',
        }}
      />

      <ButtonContainer>
        <TextButton
          onClick={onNextClick}
          disabled={
            clickStage == 2 ||
            clickStage == 3 ||
            clickStage == 4 ||
            clickStage == 7 ||
            clickStage == 8
          }
        >
          Next
        </TextButton>
      </ButtonContainer>

      {(riveStage == 'BoatEnd' || riveStage == 'PoolEnd') && (
        <ButtonContainer>
          <OutlineButton imgSource={tryNew} onClick={onTryNewClick}>
            Try new
          </OutlineButton>
        </ButtonContainer>
      )}
      <OnboardingController>
        <OnboardingStep index={0}>
          <BtnOnboarding complete={clickStage == 1} />
        </OnboardingStep>
      </OnboardingController>
      {clickStage > 0 && (
        <OnboardingController>
          <OnboardingStep index={0}>
            <TrapOnboarding1 complete={clickStage == 2} />
          </OnboardingStep>
          <OnboardingStep index={1}>
            <RectOnboarding complete={clickStage == 3} />
          </OnboardingStep>
          <OnboardingStep index={2}>
            <SqOnboarding complete={clickStage == 4} />
          </OnboardingStep>
        </OnboardingController>
      )}
      {clickStage > 5 && (
        <OnboardingController>
          <OnboardingStep index={0}>
            <TriaOnboarding complete={clickStage == 7} />
          </OnboardingStep>
          <OnboardingStep index={1}>
            <TrapOnboarding2 complete={clickStage == 8} />
          </OnboardingStep>
        </OnboardingController>
      )}
    </AppletContainer>
  )
}

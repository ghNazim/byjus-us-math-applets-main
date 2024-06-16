import { FC, useState } from 'react'
import styled from 'styled-components'

import { DnDOnboardingAnimation } from '@/atoms/OnboardingAnimation'
import { OnboardingController } from '@/atoms/OnboardingController'
import { OnboardingStep } from '@/atoms/OnboardingStep'
import { AppletContainer } from '@/common/AppletContainer'
import { AppletInteractionCallback } from '@/contexts/analytics'
import { useSFX } from '@/hooks/useSFX'

import TryNewIcon from './assets/retryIcon.svg'
import RiveComponet from './components/RiveComponet'
const ButtonContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`
const Button = styled.div`
  display: inline-flex;
  justify-content: center;
  position: absolute;
  bottom: 50px;
  background-color: #1a1a1a;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  text-align: center;
  font-family: Nunito;
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  display: flex;
  gap: 10px;
  cursor: pointer;
`
const stateMachines = ['CatMachine', 'ChickenMachine', 'VultureMachine']

export const AppletG07GMC06S1GB01: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const [currentShapeIndex, setCurrentShapeIndex] = useState(1)
  const [showNextBtn, setShowNextBtn] = useState(false)
  const [hideOnBoarding, setHideOnBoarding] = useState(false)

  const playMouseClick = useSFX('mouseClick')

  const handleTryNewBtn = () => {
    setCurrentShapeIndex((prev) => (prev + 1 < 3 ? prev + 1 : 0))
    setShowNextBtn(false)
  }

  const handleCurrentRiveFinished = () => {
    playMouseClick()
    setShowNextBtn(true)
  }

  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#f6f6f6',
        id: 'g07-gmc06-s1-gb01',
        onEvent,
        className,
        themeName: 'dark',
      }}
    >
      {/* <TextHeader
        text="Exploring composite shapes."
        backgroundColor="#8d7979"
        buttonColor="#1a1a1a"
      /> */}
      <OnboardingController>
        {showNextBtn ? (
          <ButtonContainer>
            <Button onClick={handleTryNewBtn}>
              <img src={TryNewIcon} />
              Try new
            </Button>
          </ButtonContainer>
        ) : null}
        {currentShapeIndex === 0 ? (
          <RiveComponet
            stateMachineName={stateMachines[currentShapeIndex]}
            finished={handleCurrentRiveFinished}
            textIndicatorForFinished="CatLabel"
          />
        ) : null}
        {currentShapeIndex === 1 ? (
          <RiveComponet
            textIndicatorForFinished="chickenLabel"
            stateMachineName={stateMachines[currentShapeIndex]}
            finished={handleCurrentRiveFinished}
            firstComponenMoved={() => setHideOnBoarding(true)}
          />
        ) : null}
        {currentShapeIndex === 2 ? (
          <RiveComponet
            textIndicatorForFinished="vultureLabel"
            stateMachineName={stateMachines[currentShapeIndex]}
            finished={handleCurrentRiveFinished}
          />
        ) : null}
        <OnboardingStep index={0}>
          <DnDOnboardingAnimation
            complete={hideOnBoarding}
            finalPosition={{ left: 400, top: 150 }}
            initialPosition={{ left: 90, top: 660 }}
          />
        </OnboardingStep>
      </OnboardingController>
    </AppletContainer>
  )
}

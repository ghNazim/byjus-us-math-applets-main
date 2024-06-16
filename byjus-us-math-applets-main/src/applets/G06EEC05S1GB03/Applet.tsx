import { FC, useState } from 'react'
import styled from 'styled-components'

import { OnboardingAnimation } from '@/atoms/OnboardingAnimation'
import { OnboardingController } from '@/atoms/OnboardingController'
import { OnboardingStep } from '@/atoms/OnboardingStep'
import { AppletContainer } from '@/common/AppletContainer'
import { TextHeader } from '@/common/Header'
import { AppletInteractionCallback } from '@/contexts/analytics'

import { Question1 } from './Question1'
import { Question2 } from './Question2'

const SelectEquation = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 3rem;
  position: absolute;
  margin: 0 auto;
  top: 200px;
  font-size: 28px;
`

const EquationColoredNBoxes = styled.div`
  display: flex;
  padding: 15px 70px;
  background: #f4e5ff;
  /* Secondary/Lavender/090 */
  text-align: center;
  border: 2px solid #aa5ee0;
  max-width: 300px;
  cursor: pointer;
`

const ClickAnimation = styled(OnboardingAnimation)`
  position: absolute;
  width: 100%;
  top: 280px;
`

export const AppletG06EEC05S1GB03: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const [showEquationOneSolving, setShowEquationOneSolving] = useState(false) //solution screen
  const [showEquationTwoSolving, setShowEquationTwoSolving] = useState(false) //solution screen
  const [onboardingAnimComplete, setOnboardingAnimComplete] = useState(false)

  const reset = () => {
    setShowEquationOneSolving(false)
    setShowEquationTwoSolving(false)
  }
  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#FAF2FF',
        id: 'g07-eec03-s1-gb02',
        onEvent,
        className,
      }}
    >
      <TextHeader
        text="Use the tape diagram to find length of x."
        backgroundColor="#FAF2FF"
        buttonColor="#FAF2FF"
      />
      {showEquationOneSolving ? (
        <Question1 reset={reset} />
      ) : showEquationTwoSolving ? (
        <Question2 reset={reset} />
      ) : (
        <>
          <SelectEquation>
            Select an equation
            <EquationColoredNBoxes
              onClick={() => {
                setShowEquationOneSolving(true)
                setOnboardingAnimComplete(true)
              }}
            >
              x + 8 = 17
            </EquationColoredNBoxes>
            <EquationColoredNBoxes
              onClick={() => {
                setShowEquationTwoSolving(true)
                setOnboardingAnimComplete(true)
              }}
            >
              4x = 24
            </EquationColoredNBoxes>
          </SelectEquation>
          <OnboardingController>
            <OnboardingStep index={0}>
              <ClickAnimation type="click" complete={onboardingAnimComplete} />
            </OnboardingStep>
          </OnboardingController>
        </>
      )}
    </AppletContainer>
  )
}

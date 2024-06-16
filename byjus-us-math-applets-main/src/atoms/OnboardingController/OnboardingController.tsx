import { FC } from 'react'
import styled from 'styled-components'

import { useStep } from '@/hooks/useStep'

import { OnboardingContextProvider } from './OnboardingContext'
import { OnboardingControllerProps } from './OnboardingController.types'

const Container = styled.div`
  width: 100%;
  height: 100%;
`

export const OnboardingController: FC<OnboardingControllerProps> = ({ children }) => {
  const [current, { goToNextStep }] = useStep(0)

  return (
    <OnboardingContextProvider
      value={{
        currentStepIndex: current,
        currentStepComplete: goToNextStep,
      }}
    >
      <Container>{children}</Container>
    </OnboardingContextProvider>
  )
}

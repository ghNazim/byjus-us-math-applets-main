import { FC } from 'react'

import { useOnboardingContext } from '@/atoms/OnboardingController/OnboardingContext'
import { useMemoizedCallback } from '@/hooks/useMemoizedCallback'

import { OnboardingStepProps } from './OnboardingStep.types'
import { OnboardingStepContextProvider } from './OnboardingStepContext'

export const OnboardingStep: FC<OnboardingStepProps> = ({ index, children }) => {
  const { currentStepIndex, currentStepComplete } = useOnboardingContext()

  const show = currentStepIndex === index
  const setComplete = useMemoizedCallback(() => {
    if (show) {
      currentStepComplete()
    }
  })
  return (
    <OnboardingStepContextProvider value={{ show, setComplete }}>
      {children}
    </OnboardingStepContextProvider>
  )
}

import { createContext, useContext } from 'react'

interface OnboardingContext {
  currentStepIndex: number
  currentStepComplete: () => void
}

const OnboardingContext = createContext<OnboardingContext>({
  currentStepIndex: 0,
  currentStepComplete() {},
})

export function useOnboardingContext() {
  const context = useContext(OnboardingContext)
  return context
}

export const OnboardingContextProvider = OnboardingContext.Provider

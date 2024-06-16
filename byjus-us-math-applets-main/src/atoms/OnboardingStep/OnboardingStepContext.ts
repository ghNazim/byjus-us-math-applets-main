import { createContext, useContext } from 'react'

interface OnboardingStepContext {
  show: boolean
  setComplete: () => void
}
const OnboardingStepContext = createContext<OnboardingStepContext>({
  show: false,
  setComplete: () => {},
})

export function useOnboardingStepContext() {
  const context = useContext(OnboardingStepContext)
  return context
}

export const OnboardingStepContextProvider = OnboardingStepContext.Provider

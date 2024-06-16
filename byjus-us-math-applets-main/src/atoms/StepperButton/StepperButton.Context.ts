import { createContext, useContext } from 'react'

interface StepperButtonContext {
  value: number
  min: number
  max: number
  step: number
  textColor: string
}

const StepperButtonContext = createContext<StepperButtonContext | null>(null)

export function useStepperButtonContext() {
  const context = useContext(StepperButtonContext)
  if (context == null)
    throw new Error(
      'StepperButton.* component must be rendered as a child of StepperButton component.',
    )

  return context
}

export const StepperButtonContextProvider = StepperButtonContext.Provider

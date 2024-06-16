import { Dispatch, SetStateAction, useMemo } from 'react'

import { useControllableValue } from './useControllableValue'
import { useMemoizedCallback } from './useMemoizedCallback'

interface Helpers {
  goToNextStep: () => void
  goToPrevStep: () => void
  reset: () => void
  canGoToNextStep: boolean
  canGoToPrevStep: boolean
  setStep: Dispatch<SetStateAction<number>>
}

/**
 * A hook that manage counter.
 */
export function useStep(
  minStep = -Infinity,
  maxStep = Infinity,
  increment = 1,
  initial?: number,
  currentOverride?: number,
  onChange?: (val: number) => void,
): [number, Helpers] {
  const [currentStep, setCurrentStep] = useControllableValue({
    value: currentOverride,
    defaultValue: initial ?? minStep,
    onChange,
  })

  const canGoToNextStep = useMemo(
    () => currentStep + increment <= maxStep,
    [currentStep, maxStep, increment],
  )

  const canGoToPrevStep = useMemo(
    () => currentStep - increment >= minStep,
    [currentStep, minStep, increment],
  )

  const setStep = useMemoizedCallback<Helpers['setStep']>((step) => {
    // Allow value to be a function so we have the same API as useState
    const newStep = step instanceof Function ? step(currentStep) : step

    if (newStep >= minStep && newStep <= maxStep) {
      setCurrentStep(newStep)
      return
    }

    throw new Error('Step not valid')
  })

  const goToNextStep = useMemoizedCallback(() => {
    if (canGoToNextStep) {
      setCurrentStep((step) => step + increment)
    }
  })

  const goToPrevStep = useMemoizedCallback(() => {
    if (canGoToPrevStep) {
      setCurrentStep((step) => step - increment)
    }
  })

  const reset = useMemoizedCallback(() => {
    setCurrentStep(initial ?? minStep)
  })

  return [
    currentStep,
    {
      goToNextStep,
      goToPrevStep,
      canGoToNextStep,
      canGoToPrevStep,
      setStep,
      reset,
    },
  ]
}

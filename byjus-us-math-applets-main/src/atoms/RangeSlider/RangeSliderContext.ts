import { createContext, useContext } from 'react'
import { Stage } from 'transition-hook'

interface RangeSliderContext {
  min: number
  max: number
  step: number
  value: number
  progress: number
  vertical: boolean
  reverse: boolean
  labelTransitionStage: Stage
  sliderColor: string
  trackColor: string
  thumbColor: string
  sliderSize: number
  thumbSize: number
  tickSize: number
}

const RangeSliderContext = createContext<RangeSliderContext | null>(null)

export function useRangeSliderContext() {
  const context = useContext(RangeSliderContext)
  if (context == null)
    throw new Error('RangeSlider.* component must be rendered as a child of RangeSlider component.')

  return context
}

export const RangeSliderContextProvider = RangeSliderContext.Provider

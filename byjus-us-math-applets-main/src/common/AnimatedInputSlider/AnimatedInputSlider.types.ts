export interface AnimatedInputSliderProps {
  value?: number
  min?: number
  max?: number
  reset?: boolean
  animDuration?: number
  animationStep?: number
  forceHideHandAnimation?: boolean
  disabled?: boolean
  className?: string
  onChangePercent?: (newValue: number) => void
}

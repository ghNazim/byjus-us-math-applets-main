export interface TickerProps {
  value?: number
  min?: number
  max?: number
  step?: number
  reset?: boolean
  iconLeft?: string
  iconRight?: string
  backgroundColor?: string
  backgroundColorHover?: string
  disabled?: boolean
  className?: string
  onChange?: (value: number) => void
  showHandDefault?: boolean
  showHandOnBoarding?: boolean
}

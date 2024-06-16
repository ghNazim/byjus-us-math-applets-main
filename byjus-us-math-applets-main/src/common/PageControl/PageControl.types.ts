export interface PageControlProps {
  total: number
  current?: number
  nextDisabled?: boolean
  backDisabled?: boolean
  onChange?: (current: number) => void
  onNext?: () => void
  onBack?: () => void
  onReset?: () => void
}

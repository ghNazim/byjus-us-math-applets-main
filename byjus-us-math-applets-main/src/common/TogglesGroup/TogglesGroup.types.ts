export interface TogglesGroupProps {
  optionArray: string[]
  onChange?: (activeState: number) => void
  disabled?: boolean
  initialActive?: number
  childDimensions: { width: number; height: number }
  dimensions?: { width: number; height: number }
  position?: { left: number; top: number }
  isImage?: boolean
  isHorizontal?: boolean
  textColor?: string
  showOnBoarding?: boolean
  highlightColor: string
  colorState?: 'default' | 'right' | 'wrong' | 'disable'
}

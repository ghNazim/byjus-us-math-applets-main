export interface GroupToggleProps {
  onChange?: (activeState: number) => void
  disabled?: boolean
  images: string[]
  colorState?: 'default' | 'right' | 'wrong' | 'disable'
}

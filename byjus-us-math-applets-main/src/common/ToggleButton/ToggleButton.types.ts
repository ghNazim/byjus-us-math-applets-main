import { ReactNode } from 'react'

export interface ToggleButtonProps {
  id: number
  selected?: boolean
  onChange?: (id: number, status: boolean) => void
  children?: ReactNode
  disabled?: boolean
  highlight?: boolean
  width: number
  height: number
  isImage?: boolean
  textColor?: string
  highlightColor: string
  colorState?: 'default' | 'right' | 'wrong' | 'disable'
}

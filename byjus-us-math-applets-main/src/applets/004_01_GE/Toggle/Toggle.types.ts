import { ReactNode } from 'react'

export interface ToggleProps {
  id: number
  selected?: boolean
  onChange?: (id: number, status: boolean) => void
  children?: ReactNode
  disabled?: boolean
}

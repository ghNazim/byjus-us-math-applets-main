import { ReactNode } from 'react'

export interface DropdownProps<T extends ReactNode> {
  dropDownArray: readonly T[]
  listOrientation?: 'horizontal' | 'vertical'
  position?: 'top' | 'bottom'
  checkStatus?: 'correct' | 'incorrect' | 'default'
  value?: number
  onValueChange?: (value: number) => void
  disabled?: boolean
}

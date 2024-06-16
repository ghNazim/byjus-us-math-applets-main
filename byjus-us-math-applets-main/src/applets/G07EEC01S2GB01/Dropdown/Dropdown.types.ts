import { ReactNode } from 'react'

export interface DropdownProps<T extends ReactNode> {
  dropDownArray: readonly T[]
  onValueChange?: (value: T) => void
  disabled?: boolean
}

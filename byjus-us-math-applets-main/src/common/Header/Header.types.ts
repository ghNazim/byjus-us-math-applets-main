import { ReactNode } from 'react'

export interface HeaderProps {
  children?: ReactNode
  animationDuration?: number
  backgroundColor?: string
  buttonColor?: string
  hideButton?: boolean
  className?: string
}

export type TextHeaderProps = Omit<HeaderProps, 'children'> & { text: string }

import { ReactNode } from 'react'

export interface IncorrectFeedbackProps {
  showPopAnimation: boolean
  disclaimer: string
  onClose: () => void
  children: ReactNode
}

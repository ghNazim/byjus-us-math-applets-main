import { ReactNode } from 'react'

export interface CalloutProps {
  elements?: ReactNode | Array<ReactNode>
  activeIndex?: number
  animationDuration?: number
  backgroundColor?: string
}

export type TextCalloutProps = Omit<CalloutProps, 'children'> & { text: string | string[] }

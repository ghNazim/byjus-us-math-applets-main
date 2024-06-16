import { ReactNode } from 'react'

export interface ContentScalerProps {
  designWidth: number
  designHeight: number
  onScaleChange?: (scale: number) => void
  children?: ReactNode
  className?: string
}

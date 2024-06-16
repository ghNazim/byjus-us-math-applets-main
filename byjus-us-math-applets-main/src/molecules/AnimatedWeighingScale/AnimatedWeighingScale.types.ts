import { HTMLAttributes, ReactNode } from 'react'

export interface AnimatedWeighingScaleProps extends HTMLAttributes<HTMLDivElement> {
  leftValue: number
  rightValue: number
  maxValueDifference: number
  comparisonType?: 'inequality' | 'comparison'
  checkStatus?: 'default' | 'correct' | 'incorrect'
  leftPanContent?: ReactNode
  leftPanLabel?: ReactNode
  rightPanContent?: ReactNode
  rightPanLabel?: ReactNode
}

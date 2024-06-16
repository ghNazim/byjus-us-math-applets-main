import { ComponentType } from 'react'

export interface InputFactorTreeRef {
  isExpandComplete: boolean
  expandedFactors: number[]
  currentFactors: number[]
}

export interface InputFactorTreeProps {
  value: number
  treeDisplayDepth?: number
  inputFactors?: number[]
  inputComponent?: ComponentType<{ parentNodeValue: number }>
  onComplete?: (isComplete: boolean) => void
  className?: string
}

import { ComponentType } from 'react'

export interface VariableFactorTreeRef {
  isExpandComplete: boolean
  expandedFactors: ['x', ...number[]] | []
}

export interface VariableFactorTreeProps {
  expression: string
  treeDisplayDepth?: number
  inputFactors?: ['x', ...number[]] | []
  inputComponent?: ComponentType<{ parentNodeValue: number }>
  onComplete?: (isComplete: boolean) => void
  className?: string
}

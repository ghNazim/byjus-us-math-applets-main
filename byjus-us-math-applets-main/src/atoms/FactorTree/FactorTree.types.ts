import { ComponentType } from 'react'

import { Options } from '../Tree/helpers/position'

export interface FactorTreeRef {
  isExpandComplete: boolean
  expandedFactors: number[]
  currentFactors: number[]
}

export type InputComponent = ComponentType<{ parentNodeValue: number }>

export interface FactorTreeProps extends Partial<Options> {
  value: number
  treeDisplayDepth?: number
  inputFactors?: Array<number | [number, 'right' | 'left']>
  inputComponentLeft?: InputComponent
  inputComponentRight?: InputComponent
  nodeSize?: number
  onComplete?: (isComplete: boolean) => void
  className?: string
  themeProps?: FactorTreeThemeType
}

export interface FactorTreeThemeType {
  firstNodeColor: string
  leftNodeColor: string
  rightNodeColor: string
  rightNodeBgColor: string
  firstNodeBgColor: string
  leftNodeBgColor: string
  firstNodeStrokeColor: string
  leftNodeStrokeColor?: string
  rightNodeStrokeColor?: string
  strokeColor?: string
}

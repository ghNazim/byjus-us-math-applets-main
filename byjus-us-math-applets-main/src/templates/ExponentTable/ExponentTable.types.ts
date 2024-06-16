import { SpringRef } from '@react-spring/web'
import { ComponentType } from 'react'

export interface Values {
  a: number
  m: number
  n: number
}

export interface ExponentProps<T extends number | string> {
  base: T
  power: T
  powerColor: string
}

export interface GroupExponentProps<T extends number | string> {
  base1: T
  base2: T
  baseColor1: string
  baseColor2: string
  power: T
  operator: 'product' | 'division'
}

export type ExpandedProps = ExponentProps<number> & { below?: boolean; showRange?: boolean }

export type ValueCellProps = Values
export type ExpandedCellProps = Values & { springRef: SpringRef }
export type FinalCellProps = Values & { showFull: boolean }

export interface InteractiveRowProps {
  a: number
  m: number
  n: number
  simplify?: boolean
  isActive?: boolean
  isLastColumnActive?: boolean
  valueCell: ComponentType<ValueCellProps>
  expandedCell: ComponentType<ExpandedCellProps>
  finalCell: ComponentType<FinalCellProps>
}

export interface ExponentTableProps {
  type: 'product' | 'division' | 'power' | 'product-group' | 'division-group'
}

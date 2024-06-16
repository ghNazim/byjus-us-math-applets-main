import { HTMLAttributes } from 'react'

export type Animal = 'cat' | 'dog' | 'rabbit'

export interface ReviewTableProps extends HTMLAttributes<HTMLDivElement> {
  activeAnimals?: Animal[]
  isCatWeightShown?: boolean
  isDogWeightShown?: boolean
  isRabbitWeightShown?: boolean
}

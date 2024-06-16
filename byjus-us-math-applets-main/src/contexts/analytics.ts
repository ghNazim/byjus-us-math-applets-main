import { createContext } from 'react'
export type AppletInteractionCallback = (appletId: string, interaction: Interaction) => void

export type Interaction =
  | 'tap'
  | 'drag'
  | 'drop'
  | 'slide'
  | 'move-point'
  | 'next'
  | 'previous'
  | 'reset'
  | 'increase'
  | 'decrease'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const AnalyticsContext = createContext((interaction: Interaction) => {})

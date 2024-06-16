import { ReactNode } from 'react'
import { DefaultTheme } from 'styled-components'

import { palette } from '@/themes'

import { AppletInteractionCallback } from '../../contexts/analytics'

export interface AppletContainerProps {
  id: string
  aspectRatio: number
  onEvent: AppletInteractionCallback
  borderColor: string
  children?: ReactNode
  className?: string
  themeName?: keyof typeof palette
}

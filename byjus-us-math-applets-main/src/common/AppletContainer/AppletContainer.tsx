import React, { createContext, RefObject, useCallback, useContext, useRef } from 'react'
import styled, { ThemeProvider } from 'styled-components'

import { ContentScaler } from '@/atoms/ContentScaler'
import { palette } from '@/themes'
import { nunito } from '@/utils/fonts'
import { styleReset } from '@/utils/style-reset'

import { AnalyticsContext, Interaction } from '../../contexts/analytics'
import { AppletContainerProps } from './AppletContainer.types'

const BorderedContentScaler = styled(ContentScaler)<{ borderColor: string }>`
  ${styleReset}
  ${nunito}
  background-color: white;
  border: 1px solid ${(props) => props.borderColor};
  border-radius: 20px;
  overflow: hidden;
`

const AppletContainerContext = createContext<RefObject<HTMLDivElement> | null>(null)

export function useAppletContainer() {
  const ref = useContext(AppletContainerContext)
  if (!ref) {
    throw new Error('useAppletContainer must be used within an AppletContainer')
  }
  return ref
}

export const AppletContainer: React.FC<AppletContainerProps> = ({
  id,
  onEvent,
  aspectRatio,
  borderColor,
  children,
  className,
  themeName = 'purple',
}) => {
  const onInteraction = useCallback(
    (interaction: Interaction) => {
      onEvent(id, interaction)
    },
    [onEvent, id],
  )
  const ref = useRef<HTMLDivElement>(null)

  return (
    <AnalyticsContext.Provider value={onInteraction}>
      <BorderedContentScaler
        borderColor={borderColor}
        designWidth={720}
        designHeight={720 / aspectRatio}
        className={className}
        ref={ref}
      >
        <AppletContainerContext.Provider value={ref}>
          <ThemeProvider theme={palette[themeName]}>{children}</ThemeProvider>
        </AppletContainerContext.Provider>
      </BorderedContentScaler>
    </AnalyticsContext.Provider>
  )
}

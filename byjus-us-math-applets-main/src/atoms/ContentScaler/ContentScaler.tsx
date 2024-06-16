import React, { createContext, forwardRef, useContext, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { useMemoizedCallback } from '@/hooks/useMemoizedCallback'

import { ContentScalerProps } from './ContentScaler.types'

const ContentScaleContext = createContext(1)

const ScaleTarget = styled.div<{
  designWidth: number
  designHeight: number
  scale: number
}>`
  position: absolute;
  width: ${(props) => props.designWidth}px;
  height: ${(props) => props.designHeight}px;
  top: 50%;
  left: 50%;
  translate: -50% -50%;
  scale: ${(props) => props.scale};
`

const Scaler = styled.div`
  position: relative;
  transition: all 0.2s;
  width: 100%;
  height: 100%;
`

export const ContentScaler = forwardRef<HTMLDivElement, ContentScalerProps>(
  ({ designWidth, designHeight, onScaleChange, children, className }, ref) => {
    const scaleContainer = useRef<HTMLDivElement>(null)
    const [scale, setScale] = useState(1)

    useEffect(() => {
      onScaleChange?.(scale)
    }, [onScaleChange, scale])

    const onResize = useMemoizedCallback((entries) => {
      for (const entry of entries) {
        const { width: availableWidth, height: availableHeight } = entry.contentRect
        setScale(Math.min(availableWidth / designWidth, availableHeight / designHeight))
      }
    })

    const observer = useRef(new ResizeObserver(onResize))

    useEffect(() => {
      if (!scaleContainer.current) return
      observer.current.observe(scaleContainer.current)
    }, [])

    return (
      <Scaler ref={scaleContainer}>
        <ScaleTarget {...{ designWidth, designHeight, scale, className }} ref={ref}>
          <ContentScaleContext.Provider value={scale}>{children}</ContentScaleContext.Provider>
        </ScaleTarget>
      </Scaler>
    )
  },
)
ContentScaler.displayName = 'ContentScaler'

export function useContentScale() {
  return useContext(ContentScaleContext)
}

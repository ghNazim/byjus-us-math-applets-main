import { Player } from '@lottiefiles/react-lottie-player'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { isString } from '@/utils/types'

import useDebounce from '../../hooks/useDebounce'
import useIntersectionObserver from '../../hooks/useIntersectionObserver'
import { useScript } from '../../hooks/useScript'
import { GeogebraAppApi, GeogebraProps } from './Geogebra.types'

declare const GGBApplet: any

const AppletDiv = styled.div`
  .appletStyle {
    border-style: hidden !important;
  }
`

const LottieContainer = styled(Player)<{ top: number; left: number; transition: number }>`
  position: absolute;
  left: ${(props) => props.left}px;
  top: ${(props) => props.top}px;
  translate: -50% -30%;
  pointer-events: none;
  z-index: 1;
  transition: ${(props) => props.transition}ms;
  width: 100%;
  height: 100%;
`

export const Geogebra: React.FC<GeogebraProps> = ({
  materialId,
  width,
  height,
  className,
  onApiReady,
  transparentGraphics,
  pointToTrack,
  transition = 0,
  showOnBoarding,
  onboardingAnimationSrc,
}) => {
  const scriptStatus = useScript('https://www.geogebra.org/apps/deployggb.js')
  const appletDiv = useRef<HTMLDivElement>(null)
  const entry = useIntersectionObserver(appletDiv, { threshold: 0.1 })
  const isVisible = useDebounce(!!entry?.isIntersecting, 1000)
  const ggbApi = useRef<GeogebraAppApi | null>(null)
  const [isLoaded, setLoaded] = useState(false)
  const [pointer, setPointer] = useState({ leftPixel: 100, topPixel: 100 })
  const xmlCache = useRef('')
  // const [trackGgb, setTrackGgb] = useState({ leftPixel: 100, topPixel: 100 })

  const loadApplet = useCallback(() => {
    const ggbParams = {
      appName: 'classic',
      width,
      height,
      // eslint-disable-next-line camelcase
      material_id: materialId,
      showToolBar: false,
      showAlgebraInput: false,
      showMenuBar: false,
      scaleContainerClass: 'ggb-container',
      transparentGraphics,
      appletOnLoad: (api: GeogebraAppApi | null) => {
        ggbApi.current = api
        setLoaded(true)
      },
    }
    const applet = new GGBApplet(ggbParams, true)
    applet.inject(materialId)
    return () => {
      ggbApi.current = null
      setLoaded(false)
    }
  }, [height, materialId, transparentGraphics, width])

  useEffect(() => {
    if (isLoaded) {
      const api = ggbApi.current
      if (api == null) return
      // setPointer(locatePoint2d(`${trackPoint}`, api))
      if (xmlCache.current) api.setXML(xmlCache.current)
      onApiReady?.(ggbApi.current)
    } else {
      xmlCache.current = ggbApi.current?.getXML() ?? ''
      setLoaded(false)
      onApiReady?.(null)
    }
  }, [isLoaded, onApiReady])

  useEffect(() => {
    if (scriptStatus === 'ready' && typeof GGBApplet != 'undefined' && isVisible)
      return loadApplet()
  }, [isVisible, loadApplet, scriptStatus])

  useEffect(() => {
    const api = ggbApi.current
    if (!isLoaded || !pointToTrack || !showOnBoarding || api == null) return
    setPointer(locatePoint2d(pointToTrack, api))
    api.registerObjectUpdateListener(`${pointToTrack}`, () => {
      setPointer(locatePoint2d(pointToTrack, api))
    })
    return () => ggbApi.current?.unregisterObjectUpdateListener(pointToTrack)
  }, [pointToTrack, isLoaded, showOnBoarding])

  return (
    <div className={className ? `ggb-container ${className}` : 'ggb-container'} ref={appletDiv}>
      <AppletDiv id={materialId}>
        {showOnBoarding && onboardingAnimationSrc && (
          <LottieContainer
            transition={transition}
            top={pointer.topPixel}
            left={pointer.leftPixel}
            src={onboardingAnimationSrc}
            loop
            autoplay
          />
        )}
      </AppletDiv>
    </div>
  )
}

export function locatePoint2d(
  pointName: string,
  ggbApi: GeogebraAppApi,
): { leftPixel: number; topPixel: number }
export function locatePoint2d(
  point: { x: number; y: number },
  ggbApi: GeogebraAppApi,
): { leftPixel: number; topPixel: number }
export function locatePoint2d(point: string | { x: number; y: number }, ggbApi: GeogebraAppApi) {
  const pointX = isString(point) ? ggbApi.getValue(`x(${point})`) : point.x
  const pointY = isString(point) ? ggbApi.getValue(`y(${point})`) : point.y
  const cornor1X = ggbApi.getValue('x(Corner(1))')
  const cornor1Y = ggbApi.getValue('y(Corner(1))')
  const cornor2X = ggbApi.getValue('x(Corner(2))')
  const cornor4Y = ggbApi.getValue('y(Corner(4))')
  const heightInPixel = ggbApi.getValue('y(Corner(5))')
  const widthInPixel = ggbApi.getValue('x(Corner(5))')

  return {
    leftPixel: ((pointX - cornor1X) / (cornor2X - cornor1X)) * widthInPixel,
    topPixel: heightInPixel - ((pointY - cornor1Y) / (cornor4Y - cornor1Y)) * heightInPixel,
  }
}

export function getPointFromPixel(
  left: number,
  top: number,
  ggbApi: GeogebraAppApi,
): { xCoord: number; yCoord: number } {
  const widthInPixel = ggbApi.getValue('x(Corner(5))')
  const heightInPixel = ggbApi.getValue('y(Corner(5))')
  const x = left
  const y = heightInPixel - top
  const cornor1X = ggbApi.getValue('x(Corner(1))')
  const cornor1Y = ggbApi.getValue('y(Corner(1))')
  const cornor2X = ggbApi.getValue('x(Corner(2))')
  const cornor4Y = ggbApi.getValue('y(Corner(4))')

  return {
    xCoord: (x / widthInPixel) * (cornor2X - cornor1X) + cornor1X,
    yCoord: (y / heightInPixel) * (cornor4Y - cornor1Y) + cornor1Y,
  }
}

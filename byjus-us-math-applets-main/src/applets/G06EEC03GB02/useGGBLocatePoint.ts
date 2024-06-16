import { useCallback, useEffect, useRef, useState } from 'react'

import { GeogebraAppApi } from '../../common/Geogebra/Geogebra.types'

interface Position {
  left: number
  top: number
}
export function useGGBLocatePoint(
  pointName: string,
  ggbApi: React.MutableRefObject<GeogebraAppApi | null>,
  activeTracking = true,
) {
  const [position, setPosition] = useState<Position>({ left: 0, top: 0 })
  // const ggbApi = useRef<GeogebraAppApi | null>(api)
  // ggbApi.current = api
  const locatePoint = (ggbApi: GeogebraAppApi | null, pointName: string) => {
    if (!ggbApi)
      return {
        pointX: 0,
        cornor1X: 0,
        cornor2X: 1,
        widthInPixel: 1,
        heightInPixel: 1,
        pointY: 0,
        cornor1Y: 0,
        cornor4Y: 1,
      }
    const pointX = ggbApi.getValue(`x(${pointName})`)
    const pointY = ggbApi.getValue(`y(${pointName})`)
    const cornor1X = ggbApi.getValue('x(Corner(1))')
    const cornor1Y = ggbApi.getValue('y(Corner(1))')
    const cornor2X = ggbApi.getValue('x(Corner(2))')
    const cornor4Y = ggbApi.getValue('y(Corner(4))')
    const heightInPixel = ggbApi.getValue('y(Corner(5))')
    const widthInPixel = ggbApi.getValue('x(Corner(5))')
    return { pointX, cornor1X, cornor2X, widthInPixel, heightInPixel, pointY, cornor1Y, cornor4Y }
  }

  useEffect(() => {
    if (!ggbApi) return
    const { pointX, cornor1X, cornor2X, widthInPixel, heightInPixel, pointY, cornor1Y, cornor4Y } =
      locatePoint(ggbApi.current, pointName)
    setPosition({
      left: ((pointX - cornor1X) / (cornor2X - cornor1X)) * widthInPixel,
      top: heightInPixel - ((pointY - cornor1Y) / (cornor4Y - cornor1Y)) * heightInPixel,
    })

    return () => {
      if (activeTracking) ggbApi.current?.unregisterObjectUpdateListener(`${pointName}`)
    }
  }, [pointName, activeTracking, ggbApi])

  const listener = useCallback(() => {
    if (!ggbApi.current) return
    ggbApi.current.registerObjectUpdateListener(`${pointName}`, () => {
      if (!ggbApi.current) return
      const {
        pointX,
        cornor1X,
        cornor2X,
        widthInPixel,
        heightInPixel,
        pointY,
        cornor1Y,
        cornor4Y,
      } = locatePoint(ggbApi.current, pointName)
      setPosition({
        left: ((pointX - cornor1X) / (cornor2X - cornor1X)) * widthInPixel,
        top: heightInPixel - ((pointY - cornor1Y) / (cornor4Y - cornor1Y)) * heightInPixel,
      })
    })
  }, [ggbApi, pointName, position])

  useEffect(() => {
    if (activeTracking) listener()
  }, [position, ggbApi, activeTracking, listener])
  return { position }
}

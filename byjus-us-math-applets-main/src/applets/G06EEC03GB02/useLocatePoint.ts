import { useCallback, useEffect, useState } from 'react'

import { GeogebraAppApi } from '../../common/Geogebra/Geogebra.types'
interface Position {
  left: number
  top: number
}
export function useLocatePoint(
  pointName: string,
  ggbApi: GeogebraAppApi | null,
  activeTracking = true,
) {
  const [position, setPosition] = useState<Position>({ left: 0, top: 0 })

  const locatePoint = (ggbApi: GeogebraAppApi, pointName: string) => {
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
      locatePoint(ggbApi, pointName)
    setPosition({
      left: ((pointX - cornor1X) / (cornor2X - cornor1X)) * widthInPixel,
      top: heightInPixel - ((pointY - cornor1Y) / (cornor4Y - cornor1Y)) * heightInPixel,
    })
  }, [pointName, ggbApi])

  const listener = useCallback(() => {
    ggbApi?.registerObjectUpdateListener(`${pointName}`, () => {
      const {
        pointX,
        cornor1X,
        cornor2X,
        widthInPixel,
        heightInPixel,
        pointY,
        cornor1Y,
        cornor4Y,
      } = locatePoint(ggbApi, pointName)
      setPosition({
        left: ((pointX - cornor1X) / (cornor2X - cornor1X)) * widthInPixel,
        top: heightInPixel - ((pointY - cornor1Y) / (cornor4Y - cornor1Y)) * heightInPixel,
      })
    })
  }, [ggbApi, pointName])
  if (activeTracking) listener()
  return { position }
}

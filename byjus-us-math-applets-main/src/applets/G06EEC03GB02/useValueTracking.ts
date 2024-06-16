import { useCallback, useEffect, useState } from 'react'

import { GeogebraAppApi } from '../../common/Geogebra/Geogebra.types'

export function useValueTracking(
  objectName: string,
  ggbApi: GeogebraAppApi | null,
  activeTracking = true,
  initialValue = 0,
) {
  const [value, setValue] = useState<number>(initialValue)
  useEffect(() => {
    if (!ggbApi) return
    setValue(ggbApi.getValue(`${objectName}`))
  }, [objectName, ggbApi])

  const listener = useCallback(() => {
    if (!ggbApi) return
    ggbApi.registerObjectUpdateListener(`${objectName}`, () => {
      setValue(ggbApi.getValue(`${objectName}`))
    })
  }, [ggbApi, objectName])
  if (activeTracking) listener()
  return { value }
}

import { useState } from 'react'

import { useLayoutEffectPostLoad } from './useEffectPostLoad'

export const useHasChanged = <T>(value: T) => {
  const [hasChanged, setChanged] = useState(false)
  useLayoutEffectPostLoad(() => setChanged(true), [value])
  return hasChanged
}

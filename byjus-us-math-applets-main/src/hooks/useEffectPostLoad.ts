import { useEffect, useLayoutEffect, useRef } from 'react'

type EffectHookType = typeof useEffect | typeof useLayoutEffect

const createUpdateEffect: (hook: EffectHookType) => EffectHookType = (hook) => (effect, deps) => {
  const isMounted = useRef(false)

  // for react-refresh
  hook(() => {
    return () => {
      isMounted.current = false
    }
  }, [])

  hook(() => {
    if (!isMounted.current) {
      isMounted.current = true
    } else {
      return effect()
    }
  }, deps)
}

export const useEffectPostLoad = createUpdateEffect(useEffect)
export const useLayoutEffectPostLoad = createUpdateEffect(useLayoutEffect)

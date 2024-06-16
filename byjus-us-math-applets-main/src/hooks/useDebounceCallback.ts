import { useCallback, useEffect, useRef } from 'react'

import { useMemoizedCallback } from './useMemoizedCallback'

type noop = (...args: any[]) => void

export function useDebounceCallback<T extends noop>(fn: T, delay?: number) {
  const fnRef = useMemoizedCallback(fn)
  const wrappedFnRef = useRef(() => {})
  const timerRef = useRef<NodeJS.Timer | null>(null)

  const clear = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }
  }, [])

  const debouncedFn = useMemoizedCallback((...args: Parameters<T>) => {
    clear()
    wrappedFnRef.current = () => fnRef(...args)
    timerRef.current = setTimeout(wrappedFnRef.current, delay)
  })

  useEffect(() => {
    return clear
  }, [clear])

  return debouncedFn
}

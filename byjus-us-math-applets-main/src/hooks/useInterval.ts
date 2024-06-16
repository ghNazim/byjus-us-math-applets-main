import { useCallback, useEffect, useRef } from 'react'

import { isNumber } from '@/utils/types'

import { useMemoizedCallback } from './useMemoizedCallback'

/**
 *
 * @param callback The function to be executed every {@link delay} milliseconds.
 * @param delay The time in milliseconds, the timer should delay in between executions of the specified function. The timer will be cancelled if {@link delay} is `null | undefined`.
 * @param options
 * @returns
 */
export function useInterval(
  callback: () => void,
  delay?: number | null,
  options: { immediate?: boolean } = {},
) {
  const timerCallback = useMemoizedCallback(callback)
  const timerRef = useRef<NodeJS.Timer | null>(null)

  const clear = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
  }, [])

  useEffect(() => {
    if (!isNumber(delay) || delay < 0) return
    if (options.immediate) timerCallback()
    timerRef.current = setInterval(timerCallback, delay)
    return clear
    // timerCallback and clear should not change and hence not included in the dependency list.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [delay])

  return clear
}

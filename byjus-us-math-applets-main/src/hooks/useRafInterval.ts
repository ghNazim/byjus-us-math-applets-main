import { useCallback, useEffect, useRef } from 'react'

import { isNumber } from '@/utils/types'

import { useLatest } from './useLatest'

interface Handle {
  id: number | NodeJS.Timer
}

const setRafInterval = function (callback: () => void, delay = 0): Handle {
  if (typeof requestAnimationFrame === typeof undefined) {
    return {
      id: setInterval(callback, delay),
    }
  }
  let start = new Date().getTime()
  const handle: Handle = {
    id: 0,
  }
  const loop = () => {
    const current = new Date().getTime()
    if (current - start >= delay) {
      callback()
      start = new Date().getTime()
    }
    handle.id = requestAnimationFrame(loop)
  }
  handle.id = requestAnimationFrame(loop)
  return handle
}

function cancelAnimationFrameIsNotDefined(t: any): t is NodeJS.Timer {
  return typeof cancelAnimationFrame === typeof undefined
}

const clearRafInterval = function (handle: Handle) {
  if (cancelAnimationFrameIsNotDefined(handle.id)) {
    return clearInterval(handle.id)
  }
  cancelAnimationFrame(handle.id)
}

export function useRafInterval(
  fn: () => void,
  delay: number | null,
  options?: {
    immediate?: boolean
  },
) {
  const immediate = options?.immediate

  const fnRef = useLatest(fn)
  const timerRef = useRef<Handle>()

  useEffect(() => {
    if (!isNumber(delay) || delay < 0) return
    if (immediate) {
      fnRef.current()
    }
    timerRef.current = setRafInterval(() => {
      fnRef.current()
    }, delay)
    return () => {
      if (timerRef.current) {
        clearRafInterval(timerRef.current)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [delay])

  const clear = useCallback(() => {
    if (timerRef.current) {
      clearRafInterval(timerRef.current)
    }
  }, [])

  return clear
}

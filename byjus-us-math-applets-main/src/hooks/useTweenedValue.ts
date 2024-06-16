import { useEffect, useRef } from 'react'

import { approxeq, lerp } from '@/utils/math'

import { easingsFunctions } from './../utils/easings'
import { useForceRender } from './useForceRender'
import { useRafInterval } from './useRafInterval'

export function useTweenedValue(
  value: number,
  easing: keyof typeof easingsFunctions = 'linear',
  speed = 1,
) {
  const currentValueRef = useRef(value)
  const progressRef = useRef(0)

  const reRender = useForceRender()

  useEffect(() => {
    progressRef.current = 0
  }, [value])

  useRafInterval(
    () => {
      const current = currentValueRef.current
      currentValueRef.current = lerp(current, value, easingsFunctions[easing](progressRef.current))
      progressRef.current += speed * 0.05
      reRender()
    },
    !approxeq(currentValueRef.current, value) ? 50 : null,
  )
  return currentValueRef.current
}

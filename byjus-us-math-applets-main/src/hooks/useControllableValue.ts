import { SetStateAction, useMemo, useRef } from 'react'

import { isFunction } from '@/utils/types'

import { useForceRender } from './useForceRender'
import { useMemoizedCallback } from './useMemoizedCallback'

export interface Props<T> {
  value?: T
  defaultValue: T
  onChange?: (val: T) => void
}

/**
 * Hook that allows the state to be managed by itself or the parent component.
 *
 * If there is no value in props, the component manage state by self.
 *
 * If props has the value field, then the state is controlled by it's parent
 *
 * @param props `{ value, defaultValue, onChange }`
 * @returns
 */
export function useControllableValue<T>({ value, defaultValue, onChange }: Props<T>) {
  const isControlled = value != null

  const initialValue = useMemo(() => {
    return value ?? defaultValue
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const stateRef = useRef<T>(initialValue)
  if (isControlled) {
    stateRef.current = value
  }

  const reRender = useForceRender()

  function setState(v: SetStateAction<T>) {
    const r = isFunction(v) ? v(stateRef.current) : v

    if (!isControlled) {
      stateRef.current = r
      reRender()
    }
    onChange?.(r)
  }

  return [stateRef.current, useMemoizedCallback(setState)] as const
}

import { useMemo, useRef } from 'react'

type base = (this: any, ...args: any[]) => any

type PickFunction<T extends base> = (
  this: ThisParameterType<T>,
  ...args: Parameters<T>
) => ReturnType<T>

/**
 * Hook for persistent functions. In theory, `useMemoizedFn` can be used instead of `useCallback`.
 * @description In some scenarios, we need to use `useCallback` to cache a function, but when the
 * second parameter deps changes, the function will be regenerated, causing the function reference
 * to change.
 * Using useMemoizedFn, you can omit the second parameter deps, and ensure that the function
 * reference never change.
 * @param fn Function that requires persistance.
 * @returns Function whose reference never changes.
 */
export function useMemoizedCallback<T extends base>(fn: T) {
  const fnRef = useRef<T>(fn)

  // `fnRef.current = fn` does not work with the shallow rendering of react devtools.
  fnRef.current = useMemo(() => fn, [fn])

  const memoizedFn = useRef<PickFunction<T>>()
  if (!memoizedFn.current) {
    memoizedFn.current = function (this, ...args) {
      return fnRef.current.apply(this, args)
    }
  }

  return memoizedFn.current as T
}

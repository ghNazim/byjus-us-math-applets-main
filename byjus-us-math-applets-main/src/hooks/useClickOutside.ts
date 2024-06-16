import { RefCallback, useEffect, useRef } from 'react'

export function useClickOutside(handler: (ev: DocumentEventMap['click']) => void) {
  const targetRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const handlerWrap = (ev: DocumentEventMap['click']) => {
      if (targetRef.current && !targetRef.current.contains(ev.target as HTMLElement)) {
        handler(ev)
      }
    }
    document.addEventListener('click', handlerWrap)
    return () => document.removeEventListener('click', handlerWrap)
  }, [handler])

  const ref: RefCallback<HTMLElement> = (element) => {
    if (element) {
      targetRef.current = element
    } else {
      targetRef.current = null
    }
  }

  return ref
}

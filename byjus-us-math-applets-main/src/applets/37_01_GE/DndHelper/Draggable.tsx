import { useDraggable } from '@dnd-kit/core'
import { useEffect } from 'react'

import { useContentScale } from '@/atoms/ContentScaler/ContentScaler'
import { useSFX } from '@/hooks/useSFX'

export function Draggable(props: any) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: props.id,
  })
  const DragSound = useSFX('mouseIn')
  const DropSound = useSFX('mouseOut')
  useEffect(() => {
    if (isDragging) DragSound()
    else DropSound()
  }, [isDragging])
  const appletScale = useContentScale()

  const style: any = transform
    ? {
        transform: `translate3d(${transform.x / appletScale}px, ${
          transform.y / appletScale
        }px, 0) ${isDragging ? 'rotate(5deg)' : ''}`,
        // translate: `${transform.x / appletScale}px ${transform.y / appletScale}px`,
        cursor: `${isDragging ? 'grabbing' : ''}`,
        position: 'absolute',
        top: 0,
        left: 0,
        // opacity: isDragging ? 0.5 : 1
      }
    : {
        transform: `translate3d(${0}px, ${0}px, 0) ${isDragging ? 'rotate(5deg)' : ''}`,
        cursor: '',
        position: 'absolute',
        top: 0,
        left: 0,
      }

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {props.children}
    </div>
  )
}

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
  return (
    <div
      ref={setNodeRef}
      style={{
        position: props.top == null ? undefined : 'absolute',
        top: props.top,
        left: props.left,
        transform:
          transform != null
            ? `translate3d(${transform.x / appletScale}px, ${transform.y / appletScale}px, 0) ${
                isDragging ? 'rotate(5deg)' : ''
              }`
            : undefined,
        cursor: `${isDragging ? 'grabbing' : ''}`,
      }}
      {...listeners}
      {...attributes}
    >
      {props.children}
    </div>
  )
}

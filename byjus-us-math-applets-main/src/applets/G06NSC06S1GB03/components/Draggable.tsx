import { useDraggable } from '@dnd-kit/core'
import React, { FC } from 'react'

import { useContentScale } from '@/atoms/ContentScaler/ContentScaler'

export interface DraggableProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode
  id: string
  parentId: string
}

const Draggable: FC<DraggableProps> = ({ children, id, ...props }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: id })
  const appletScale = useContentScale()
  const style = transform
    ? {
        // transform: CSS.Translate.toString(transform),
        transform: `translate3d(${transform.x / appletScale}px, ${transform.y / appletScale}px, 0)`,
      }
    : {
        transform: `translate3d(${0}px, ${0}px, 0)`,
      }
  return (
    <div
      className={props.className}
      ref={setNodeRef}
      style={{ ...style, ...props.style }}
      {...listeners}
      {...attributes}
    >
      {children}
    </div>
  )
}

export default Draggable

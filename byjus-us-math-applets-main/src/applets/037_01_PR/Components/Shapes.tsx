import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import React from 'react'

interface shapeProps {
  id: string
  name: string
  src: string
  isFirstElement?: boolean
  isReplica: boolean
}

const Shapes: React.FC<shapeProps> = ({ id, name, src, isReplica, isFirstElement }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
    data: { isReplica },
  })

  // const style = transform
  //   ? {
  //       transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  //     }
  //   : undefined
  const style = {
    transform: CSS.Translate.toString(transform),
  }

  return (
    <img
      src={src}
      ref={setNodeRef}
      alt={name}
      style={{ ...style, touchAction: 'none' }}
      {...attributes}
      {...listeners}
    />
  )
}

export default Shapes

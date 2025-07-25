import { useDroppable } from '@dnd-kit/core'
import React, { useEffect } from 'react'

export function Droppable(props: any) {
  const { isOver, setNodeRef } = useDroppable({
    id: props.id,
    data: {
      type: `type${props.id}`,
    },
  })

  const style = {
    color: isOver ? 'green' : undefined,
  }

  return (
    <div ref={setNodeRef} style={style}>
      {props.children}
    </div>
  )
}

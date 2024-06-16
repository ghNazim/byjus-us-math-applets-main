import { useDroppable } from '@dnd-kit/core'
import React, { useEffect } from 'react'

export function Droppable(props: any) {
  const { isOver, setNodeRef, rect } = useDroppable({
    id: props.id,
    data: {
      type: `type${props.id}`,
    },
  })

  const _rect = rect

  useEffect(() => {
    if (props.getRect) props.getRect(_rect.current)
  }, [props.getRect])

  const style = {
    color: isOver ? 'green' : undefined,
  }

  return (
    <div ref={setNodeRef} style={style}>
      {props.children}
    </div>
  )
}

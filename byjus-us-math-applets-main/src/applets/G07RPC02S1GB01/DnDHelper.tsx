import { useDraggable, useDroppable } from '@dnd-kit/core'
import { FC, HTMLAttributes } from 'react'

import { DragBox, DropZone } from './Applet.styles'

interface DraggableProps extends HTMLAttributes<HTMLDivElement> {
  id: string
}

export const Draggable: FC<DraggableProps> = ({ id, ...props }) => {
  const { attributes, listeners, setNodeRef } = useDraggable({ id })

  return <DragBox {...attributes} {...listeners} {...props} ref={setNodeRef} />
}

export const Droppable: FC<
  Omit<HTMLAttributes<HTMLDivElement>, 'id'> & { id: number; showWrong: boolean }
> = ({ id, ...props }) => {
  const { setNodeRef } = useDroppable({ id })

  return <DropZone {...props} ref={setNodeRef} />
}

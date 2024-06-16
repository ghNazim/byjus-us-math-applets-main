import { useDroppable } from '@dnd-kit/core'
import React from 'react'
import styled from 'styled-components'

interface DroppableBox {
  id: 'LHS' | 'RHS'
  left: number
  top: number
  color: string
  isActive: boolean
  isVisible?: boolean
}

const DroppbaleBox = styled.div<{
  left: number
  top: number
  color: string
  isActive: boolean
}>`
  position: absolute;
  left: ${(props) => props.left}px;
  top: ${(props) => props.top}px;
  width: 400px;
  height: 75px;
  background: ${(props) => (props.isActive ? props.color : '#ececec)')};
  border: 1px dashed #888888;
`

const Droppable: React.FC<DroppableBox> = (props) => {
  const { setNodeRef, rect } = useDroppable({
    id: props.id,
  })
  return (
    <>
      <DroppbaleBox
        color={props.color}
        isActive={props.isActive}
        left={props.left}
        top={props.top}
        ref={setNodeRef}
      ></DroppbaleBox>
    </>
  )
}

export default Droppable

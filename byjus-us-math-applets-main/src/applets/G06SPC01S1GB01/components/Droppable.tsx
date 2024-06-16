import { useDroppable } from '@dnd-kit/core'
import React, { FC } from 'react'
import styled from 'styled-components'

const DropHere = styled.div`
  border: 2px dashed gray;
  color: gray;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  flex: 1;
`

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
  background-color: none;
  flex: 1;
  padding: 10px;
`

export interface DroppableProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode
  id: string
}

const Droppable: FC<DroppableProps> = ({ children, id, ...props }) => {
  const { isOver, setNodeRef } = useDroppable({ id: id })
  const style = {
    opacity: isOver ? 0.5 : 1,
  }
  return (
    <Container className={props.className} ref={setNodeRef} style={{ ...style, ...props.style }}>
      {children}
      {isOver ? <DropHere>Drop here</DropHere> : undefined}
    </Container>
  )
}

export default Droppable

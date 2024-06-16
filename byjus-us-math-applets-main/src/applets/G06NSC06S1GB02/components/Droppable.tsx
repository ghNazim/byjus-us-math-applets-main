import { useDroppable } from '@dnd-kit/core'
import React, { FC, useEffect } from 'react'
import styled from 'styled-components'

import { DroppableIds } from './DroppableContainer'

const DropHere = styled.div`
  /* border: 2px dashed gray; */
  color: gray;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  position: absolute;
  width: 100%;
  height: 100%;
`

const Container = styled.div`
  position: relative;
  display: flex;
  justify-content: flex-start;
  background-color: none;
`

export interface DroppableProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode
  id: DroppableIds
}

const Droppable: FC<DroppableProps> = ({ children, id, ...props }) => {
  const { isOver, setNodeRef } = useDroppable({ id: id })
  const style = {
    opacity: isOver ? 0.5 : 1,
  }

  return (
    <Container className={props.className} ref={setNodeRef} style={{ ...style, ...props.style }}>
      {children}
      {/* {isOver ? <DropHere>Drop here</DropHere> : undefined} */}
    </Container>
  )
}

export default Droppable

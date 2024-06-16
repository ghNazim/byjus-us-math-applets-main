import React, { FC, useState } from 'react'
import styled from 'styled-components'

import Droppable from './Droppable'

export type DroppableIds = 'left' | 'middle' | 'right'
export interface DroppableProps {
  title: DroppableIds
  // titleColor: string
  // bodyColor: string
  image: string
}
const DroppableContain = styled.div`
  display: flex;
  position: absolute;
  justify-content: center;
  align-items: center;
`

const InvisibleBoxes = styled.div<{ width: number }>`
  width: ${(a) => a.width}px;
  height: 300px;
  /* opacity: 0.3; */
  /* background-color: red; */
`

const DroppableContainer = () => {
  return (
    <DroppableContain>
      <Droppable id={'left'}>
        <InvisibleBoxes width={180} />
      </Droppable>
      <Droppable id={'middle'}>
        <InvisibleBoxes width={118} />
      </Droppable>
      <Droppable id={'right'}>
        <InvisibleBoxes width={180} />
      </Droppable>
    </DroppableContain>
  )
}

export default DroppableContainer

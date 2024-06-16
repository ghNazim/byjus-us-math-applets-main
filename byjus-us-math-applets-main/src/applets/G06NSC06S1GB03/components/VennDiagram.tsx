import React, { FC } from 'react'
import styled from 'styled-components'

import leftDroppable from '../assets/left.svg'
import middleDroppable from '../assets/middle.svg'
import rightDroppable from '../assets/right.svg'
import { DroppableIds } from './DroppableContainer'

interface VennDiagram {
  image: string
  childrens: React.ReactNode
}

const ImageHolder = styled.div<{ move: number; opacity?: number }>`
  transform: translateX(${(a) => a.move}%);
  position: relative;
  opacity: ${(a) => (a.opacity ? a.opacity : 1)};
`

const Container = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
`

interface ChildrenProps {
  shape: React.ReactNode
  parent: DroppableIds
}

export interface VennDiagramProps {
  currentOver: DroppableIds | null
  children?: ChildrenProps[]
  imageArr: string[]
}

const VennDiagram: FC<VennDiagramProps> = ({ imageArr, children, currentOver }) => {
  return (
    <Container>
      <ImageHolder move={0} opacity={currentOver ? (currentOver === 'left' ? 1 : 0.3) : 1}>
        <img src={imageArr[0]} />
      </ImageHolder>
      <ImageHolder
        move={-53}
        style={{ zIndex: '5', scale: '1.01' }}
        opacity={currentOver ? (currentOver === 'middle' ? 1 : 0.3) : 1}
      >
        <img src={imageArr[1]} />
      </ImageHolder>
      <ImageHolder move={-53} opacity={currentOver ? (currentOver === 'right' ? 1 : 0.3) : 1}>
        <img src={imageArr[2]} />
      </ImageHolder>
    </Container>
  )
}

export default VennDiagram

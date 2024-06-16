import React, { FC } from 'react'
import styled from 'styled-components'

import Droppable from './Droppable'

type Heading = 'Addition' | 'Subtraction'
interface TitleProps {
  title: Heading
  titleColor: string
  bodyColor: string
  children?: React.ReactNode[]
}
const DroppableContain = styled.div`
  display: flex;
  width: 100%;
  height: 60%;
  position: absolute;
  top: 100px;
  justify-content: stretch;
  align-items: stretch;
  padding: 0 20px;
  gap: 20px;
`

const DroppableTarget = styled(Droppable)<{ bgColor: string }>`
  background: ${(props) => props.bgColor};
  padding: 20px 40px;
  border-radius: 0 0 5px 5px;
`
const DroppableColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  /* gap: 10px; */
  flex: 1;
`

const DroppableTitle = styled.div<{ bgColor: string }>`
  color: white;
  background-color: ${(props) => props.bgColor};
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: Nunito;
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  border-radius: 5px 5px 0 0;
  padding: 10px;
  user-select: none;
`

interface DroppableContainerProps extends React.HTMLAttributes<HTMLElement> {
  droppableData: TitleProps[]
}

const DroppableContainer: FC<DroppableContainerProps> = ({ droppableData }) => {
  return (
    <DroppableContain>
      {droppableData
        ? droppableData.map((ele) => (
            <DroppableColumn key={ele.title}>
              <DroppableTitle bgColor={ele.titleColor}>{ele.title}</DroppableTitle>
              <DroppableTarget id={ele.title} bgColor={ele.bodyColor}>
                {ele.children?.map((child) => child)}
              </DroppableTarget>
            </DroppableColumn>
          ))
        : undefined}
    </DroppableContain>
  )
}

export default DroppableContainer

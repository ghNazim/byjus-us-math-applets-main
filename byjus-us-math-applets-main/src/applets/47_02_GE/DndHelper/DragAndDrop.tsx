import {
  DndContext,
  DragEndEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { useEffect, useState } from 'react'
import styled from 'styled-components'

import { Draggable } from './Draggable'
import { Droppable } from './Droppable'
import { PagePalette } from './PagePalette'

const CatContainer = styled.div<{ top?: number; left?: number }>`
  position: absolute;
  top: ${(props) => props.top || 143}px;
  left: ${(props) => props.left || 252}px;
`
const DropContainers = styled.div<{ top: number; left: number; dropped: boolean; show: boolean }>`
  position: absolute;
  top: ${(props) => props.top}px;
  left: ${(props) => props.left}px;
  opacity: ${(props) => (props.dropped ? 1 : 0.2)};
  visibility: ${(props) => (props.show ? 'visible' : 'hidden')};
`

const ImageBackGround = styled.img`
  position: sticky;
  left: 0;
  top: 0px;
  pointer-events: none;
  opacity: 0.2;
`

interface DragAndDropProps {
  DraggableList: Array<string>
  DropZonePosition: Array<{ left: number; top: number }>
  DropBackgroundPosition?: { left: number; top: number }
  DropBackgroundImage?: string
  InitialState: any
  elementsPerPage?: number
  total?: number
  showDropHint?: boolean
  onAllDragComplete?: (allDragComplete: boolean) => void
  onSingleDragStart?: (singleDragStart: boolean) => void
  onPageChange?: (current: number) => void
}
export const DragAndDrop: React.FC<DragAndDropProps> = ({
  DraggableList,
  DropZonePosition,
  DropBackgroundPosition,
  DropBackgroundImage,
  InitialState,
  showDropHint = true,
  elementsPerPage = 4,
  total = 2,
  onAllDragComplete,
  onSingleDragStart,
  onPageChange,
}) => {
  const [isDropped, setIsDropped] = useState(InitialState)
  const [showDropZone, setShowDropZone] = useState(InitialState)
  const [allDragComplete, setAllDragComplete] = useState(false)
  const [singleDragStart, setSingleDragStart] = useState(false)

  const handleDragEnd = ({ over, active }: DragEndEvent) => {
    setShowDropZone(InitialState)
    if (over && over.id === active.id) {
      setIsDropped((isD: any) => {
        const d = { ...isD }
        d[over.id] = true
        return d
      })
    }
  }

  const handleDragStart = ({ active }: DragEndEvent) => {
    setSingleDragStart(true)
    if (active && active.id === active.id) {
      setShowDropZone((isD: any) => {
        const d = { ...isD }
        d[active.id] = true
        return d
      })
    }
  }
  const mouseSensor = useSensor(MouseSensor, {
    // Require the mouse to move by 0 pixels before activating
    activationConstraint: {
      distance: 0,
    },
  })
  const touchSensor = useSensor(TouchSensor, {
    // Press delay of 0ms, with tolerance of 0px of movement
    activationConstraint: {
      delay: 0,
      tolerance: 0,
    },
  })
  const sensors = useSensors(mouseSensor, touchSensor)

  useEffect(() => {
    if (onAllDragComplete) onAllDragComplete(allDragComplete)
  }, [onAllDragComplete, allDragComplete])
  useEffect(() => {
    if (onSingleDragStart) onSingleDragStart(singleDragStart)
  }, [onSingleDragStart, singleDragStart])

  useEffect(() => {
    const isNull =
      Object.keys(isDropped).filter((key) => isDropped[key] !== true).length === 0 ? true : false
    setAllDragComplete(isNull)
  }, [isDropped])
  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
      <CatContainer left={DropBackgroundPosition?.left} top={DropBackgroundPosition?.top}>
        <img src={DropBackgroundImage ?? undefined} />
        {DropZonePosition.map((dropPosition, i: number) => (
          <DropContainers
            key={i}
            top={dropPosition.top}
            left={dropPosition.left}
            dropped={isDropped[i]}
            show={(showDropZone[i] && showDropHint) || isDropped[i]}
          >
            <Droppable id={`${i}`}>
              <img src={DraggableList[i]} />
            </Droppable>
          </DropContainers>
        ))}
      </CatContainer>
      {!allDragComplete &&
        DraggableList.map((dragSrc, i) => (
          <div key={i} style={{ position: 'relative', display: 'inline-block' }}>
            <Draggable key={i} id={`${i}`}>
              <img
                style={{
                  display: !isDropped[i] ? 'block' : 'none',
                }}
                src={dragSrc}
              />
            </Draggable>
          </div>
        ))}
    </DndContext>
  )
}

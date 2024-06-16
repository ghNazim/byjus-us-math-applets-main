import { Player } from '@lottiefiles/react-lottie-player'
import { useEffect, useReducer, useState } from 'react'
import styled from 'styled-components'

import { AppletContainer } from '../../common/AppletContainer'
import DropAnimation from '../../common/handAnimations/dragAndDropEnd.json'
import HoldAnimation from '../../common/handAnimations/dragAndDropHold.json'
import DragAnimation from '../../common/handAnimations/dragAndDropStart.json'
import { TextHeader } from '../../common/Header'
import { AppletInteractionCallback } from '../../contexts/analytics'
import { useInterval } from '../../hooks/useInterval'
import Cat from './Assets/Cat.svg'
import Drag1 from './Assets/Drag1.svg'
import Drag2 from './Assets/Drag2.svg'
import Drag3 from './Assets/Drag3.svg'
import Drag4 from './Assets/Drag4.svg'
import Drag5 from './Assets/Drag5.svg'
import Drag6 from './Assets/Drag6.svg'
import Drag7 from './Assets/Drag7.svg'
import DragOption13 from './Assets/Option1/Drag3.svg'
import DragOption14 from './Assets/Option1/Drag4.svg'
import DragOption15 from './Assets/Option1/Drag5.svg'
import DragOption16 from './Assets/Option1/Drag6.svg'
import DragOption17 from './Assets/Option1/Drag7.svg'
import Drop from './Assets/Option1/Drop.svg'
import DragOption21 from './Assets/Option2/Drag1.svg'
import DragOption22 from './Assets/Option2/Drag2.svg'
import DragOption23 from './Assets/Option2/Drag3.svg'
import DragOption24 from './Assets/Option2/Drag4.svg'
import DragOption25 from './Assets/Option2/Drag5.svg'
import DragOption26 from './Assets/Option2/Drag6.svg'
import DragOption27 from './Assets/Option2/Drag7.svg'
import Duck from './Assets/Option2/duck.svg'
import { DragAndDrop } from './DndHelper/DragAndDrop'

//dependancy
const DraggableList = [Drag1, Drag2, Drag3, Drag4, Drag5, Drag6, Drag7]
const DraggableOption2List = [
  DragOption21,
  DragOption22,
  DragOption23,
  DragOption24,
  DragOption25,
  DragOption26,
  DragOption27,
]
const DraggableOption1List = [
  DragOption21,
  DragOption22,
  DragOption13,
  DragOption14,
  DragOption15,
  DragOption16,
  DragOption17,
]
const DropPosition = [
  { left: 1, top: 49 },
  { left: 49, top: 0 },
  { left: 42, top: 84 },
  { left: 0, top: 0 },
  { left: 41, top: 150 },
  { left: 71, top: 188 },
  { left: 108, top: 91 },
]
const DropPositionOption2 = [
  { left: 204, top: 1 },
  { left: 135, top: 120 },
  { left: 1, top: 26.6 },
  { left: 136, top: 206 },
  { left: 204, top: 50 },
  { left: 0, top: 94.5 },
  { left: 0, top: 94.5 },
]
const DropPositionOption1 = [
  { left: 290, top: 48 },
  { left: 95, top: 97 },
  { left: 98, top: 232 },
  { left: 242, top: 1 },
  { left: 47.5, top: 232 },
  { left: 96.5, top: 0.5 },
  { left: 1, top: 95.5 },
]
const InitialState = {
  '0': false,
  '1': false,
  '2': false,
  '3': false,
  '4': false,
  '5': false,
  '6': false,
}

const animationSequence = [DragAnimation, HoldAnimation, DropAnimation]
const animationPosition = { left: 234, top: 180 }
const increments = { left: (234 - 114) / 100, top: (180 - 540) / 100 }
const TryNewShapeContainer = styled.div<{ selection?: number }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 12px 16px;
  position: absolute;
  width: 170px;
  height: 48px;
  /* left: ${(props) => (props.selection == -1 ? 285 : 500)}px;
  top: ${(props) => (props.selection == -1 ? 576 : 440)}px; */
  left: 285px;
  top: 576px;
  background: #8c69ff;
  border-radius: 10px;
`

const PlayerContainer = styled(Player)<{ top: number; left: number }>`
  position: absolute;
  left: ${(props) => props.left}px;
  top: ${(props) => props.top}px;
  pointer-events: none;
`
const InitialTransition = {
  left: 114,
  top: 540,
}

const indexes = [-1, 0, 1]
//Applet
export const Applet3701Ge: React.FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const [tryNew, setTryNew] = useState(false)
  const [selection, setSelection] = useState(-1)
  const [showOnBording, setShowOnBoarding] = useState(true)
  const [transitionState, setTransitionState] = useState(InitialTransition)
  const [index, setIndex] = useState(0)
  const [pageindex, setPageindex] = useState(0)

  const onAllDragCompleteHandle = (allDragComplete: boolean) => {
    setTryNew(allDragComplete)
  }
  const onSingleDragStart = (singleDragStart: boolean) => {
    setShowOnBoarding(!singleDragStart)
  }
  const onTryNewClickHandle = () => {
    setSelection((p) => (p == 0 || p == -1 ? p + 1 : -1))
    //indexes[chooseRandom(indexes.findIndex((e) => e === selection))]
    setTryNew(false)
  }
  // const chooseRandom = (num: number): number => {
  //   const random = Math.floor(Math.random() * 3)
  //   return num === random ? chooseRandom(num) : random
  // }
  const onPageChange = (current: number) => {
    setPageindex(current)
  }
  useInterval(
    () => {
      if (transitionState.left < animationPosition.left)
        setTransitionState({
          left: transitionState.left + increments.left,
          top: transitionState.top + increments.top,
        })
      else {
        setIndex(0)
        setTransitionState(InitialTransition)
      }

      if (transitionState.left > InitialTransition.left + increments.left * 1) setIndex(1)
      else setIndex(0)
      if (transitionState.left > InitialTransition.left + increments.left * 98) setIndex(2)
    },
    showOnBording ? (index == 1 ? 15 : 500) : null,
  )

  return (
    <AppletContainer
      {...{
        aspectRatio: 1,
        borderColor: '#D1F7FF',
        id: '37_01_GE',
        onEvent,
        className,
      }}
    >
      <TextHeader
        text="Place the given pieces into the space provided to form a composite shape."
        backgroundColor="#E7FBFF"
        buttonColor="#D1F7FF"
      />
      {tryNew && (
        <TryNewShapeContainer onClick={onTryNewClickHandle}>Try New Shape</TryNewShapeContainer>
      )}
      {selection === -1 && (
        <DragAndDrop
          DraggableList={DraggableList}
          DropZonePosition={DropPosition}
          InitialState={InitialState}
          DropBackgroundImage={Cat}
          onAllDragComplete={onAllDragCompleteHandle}
          onSingleDragStart={onSingleDragStart}
          onPageChange={(e: number) => {
            onPageChange(e)
          }}
        />
      )}
      {selection === 1 && (
        <DragAndDrop
          DraggableList={DraggableOption2List}
          DropZonePosition={DropPositionOption2}
          InitialState={InitialState}
          DropBackgroundImage={Duck}
          onAllDragComplete={onAllDragCompleteHandle}
        />
      )}
      {selection === 0 && (
        <DragAndDrop
          DraggableList={DraggableOption1List}
          DropZonePosition={DropPositionOption1}
          InitialState={InitialState}
          DropBackgroundImage={Drop}
          onAllDragComplete={onAllDragCompleteHandle}
        />
      )}
      {showOnBording && pageindex == 0 && (
        <PlayerContainer
          src={animationSequence[index]}
          top={transitionState.top}
          left={transitionState.left}
          autoplay
          loop
        />
      )}
    </AppletContainer>
  )
}

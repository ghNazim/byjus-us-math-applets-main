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
import CorrectPlank from './Assets/CorrectFig/plankc.svg'
import CorrectRobot from './Assets/CorrectFig/robotc.svg'
import CorrectTV from './Assets/CorrectFig/tvc.svg'
import Drag1 from './Assets/Option0/Drag1.svg'
import Drag2 from './Assets/Option0/Drag2.svg'
import Drag3 from './Assets/Option0/Drag3.svg'
import Drag4 from './Assets/Option0/Drag4.svg'
import Drag5 from './Assets/Option0/Drag5.svg'
import Drag6 from './Assets/Option0/Drag6.svg'
import Drag7 from './Assets/Option0/Drag7.svg'
import Drag8 from './Assets/Option0/Drag8.svg'
import Drag9 from './Assets/Option0/Drag9.svg'
import robot from './Assets/Option0/robot.svg'
import DragOption11 from './Assets/Option1/Drag1.svg'
import DragOption12 from './Assets/Option1/Drag2.svg'
import DragOption13 from './Assets/Option1/Drag3.svg'
import DragOption14 from './Assets/Option1/Drag4.svg'
import DragOption15 from './Assets/Option1/Drag5.svg'
import DragOption16 from './Assets/Option1/Drag6.svg'
import DragOption17 from './Assets/Option1/Drag7.svg'
import Plank from './Assets/Option1/Plank.svg'
import DragOption21 from './Assets/Option2/Drag1.svg'
import DragOption22 from './Assets/Option2/Drag2.svg'
import DragOption23 from './Assets/Option2/Drag3.svg'
import DragOption24 from './Assets/Option2/Drag4.svg'
import Television from './Assets/Option2/TV.svg'
import { DragAndDrop } from './DndHelper/DragAndDrop'

//dependancy
const DraggableList = [Drag5, Drag6, Drag7, Drag9, Drag8, Drag1, Drag2, Drag3, Drag4]
const DraggableOption2List = [DragOption22, DragOption21, DragOption23, DragOption24]
const DraggableOption1List = [
  DragOption17,
  DragOption16,
  DragOption11,
  DragOption14,
  DragOption15,
  DragOption12,
  DragOption13,
]
const DropPosition = [
  { left: 114, top: 210 }, //Drag4
  { left: 68, top: 210 }, //Drag5
  { left: 2, top: 130 }, //Drag6
  { left: 186, top: 130 }, //Drag9
  { left: 160, top: 110 }, //Drag7
  { left: 40, top: 85 }, //Drag0
  { left: 65, top: 40 }, //Drag1
  { left: 50, top: 2 }, //Drag2
  { left: 2, top: 110 }, //Drag3
  { left: 2, top: 110 }, //Drag3
]
const DropPositionOption2 = [
  { left: 58, top: 130 },
  { left: 0, top: 10 },
  { left: 100, top: 160 },
  { left: 60, top: 0 },
]
const DropPositionOption1 = [
  { left: 418, top: 205 },
  { left: 360, top: 170 },
  { left: 315, top: 180 },
  { left: 250, top: 230 },
  { left: 240, top: 175 },
  { left: 250, top: 270 },
  { left: 222, top: 235 },
]
const InitialState = {
  '0': false,
  '1': false,
  '2': false,
  '3': false,
  '4': false,
  '5': false,
  '6': false,
  '7': false,
  '8': false,
}
const InitialState1 = {
  '0': false,
  '1': false,
  '2': false,
  '3': false,
  '4': false,
  '5': false,
  '6': false,
}
const InitialState2 = {
  '0': false,
  '1': false,
  '2': false,
  '3': false,
}

const CorrectFigure = styled.img`
  position: absolute;
  left: 320px;
  top: 210px;
  z-index: 1;
`
const CorrectFigure1 = styled.img`
  position: absolute;
  left: 305px;
  top: 215px;
  z-index: 1;
`

const CorrectFigure2 = styled.img`
  position: absolute;
  left: 255px;
  top: 145px;
  z-index: 1;
`

const animationSequence = [DragAnimation, HoldAnimation, DropAnimation]
const animationPosition = { left: 250, top: 200 }
const increments = { left: (400 - 90) / 100, top: (200 - 550) / 100 }
const TryNewShapeContainer = styled.div<{ selection?: number }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 12px 16px;
  position: absolute;
  width: 170px;
  height: 48px;
  cursor: pointer;
  /* left: ${(props) => (props.selection == -1 ? 285 : 500)}px;
  top: ${(props) => (props.selection == -1 ? 576 : 440)}px; */
  left: 285px;
  top: 576px;
  background: #8c69ff;
  border-radius: 10px;
  z-index: 1;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 18px;
  line-height: 24px;
  text-align: center;
  color: #ffffff;
  flex: none;
  order: 1;
  flex-grow: 0;
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
export const Applet04202Ge: React.FC<{
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
        borderColor: '#FFECF1',
        id: '37_01_GE',
        onEvent,
        className,
      }}
    >
      <TextHeader
        text="Place the rectangular prisms in the provided space and form a composite solid."
        backgroundColor="#FFECF1"
        buttonColor="#FFD1D1"
      />

      {tryNew && (
        <>
          <TryNewShapeContainer onClick={onTryNewClickHandle}>Try New Shape</TryNewShapeContainer>
          {selection === -1 && <CorrectFigure src={CorrectRobot} />}
          {selection === 0 && <CorrectFigure1 src={CorrectPlank} />}
          {selection === 1 && <CorrectFigure2 src={CorrectTV} />}
        </>
      )}
      {selection === -1 && (
        <DragAndDrop
          DraggableList={DraggableList}
          DropZonePosition={DropPosition}
          InitialState={InitialState}
          DropBackgroundImage={robot}
          total={2}
          elementsPerPage={5}
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
          InitialState={InitialState2}
          total={2}
          elementsPerPage={3}
          DropBackgroundImage={Television}
          onAllDragComplete={onAllDragCompleteHandle}
        />
      )}
      {selection === 0 && (
        <DragAndDrop
          DraggableList={DraggableOption1List}
          DropZonePosition={DropPositionOption1}
          InitialState={InitialState1}
          total={3}
          elementsPerPage={3}
          DropBackgroundImage={Plank}
          DropBackgroundPosition={{ left: 40, top: 30 }}
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

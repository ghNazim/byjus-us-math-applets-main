import {
  DndContext,
  DragEndEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { Player } from '@lottiefiles/react-lottie-player'
import React, { useContext, useState } from 'react'
import styled from 'styled-components'

import { AppletContainer } from '../../common/AppletContainer'
import DropAnimation from '../../common/handAnimations/dragAndDropEnd.json'
import HoldAnimation from '../../common/handAnimations/dragAndDropHold.json'
import DragAnimation from '../../common/handAnimations/dragAndDropStart.json'
import { TextHeader } from '../../common/Header'
import { AnalyticsContext, AppletInteractionCallback } from '../../contexts/analytics'
import { useInterval } from '../../hooks/useInterval'
import Apple from './Assets/apple.svg'
import Apple2 from './Assets/apple2.svg'
import Banana from './Assets/banana.svg'
import Bar from './Assets/bar.svg'
import Dropzone from './Assets/DropZone.svg'
import Middlebar from './Assets/middlebar.svg'
import Pineapple from './Assets/pineapple.svg'
import Pineapple2 from './Assets/pineapple2.svg'
import Placeholder from './Assets/placeHolder.svg'
import Plate from './Assets/plates.svg'
import Watermelon from './Assets/watermelon.svg'
import { Draggable } from './DndHelper/Draggable'
import { Droppable } from './DndHelper/Droppable'
const CenterImageContainer = styled.div<{
  top: number
  left: number
  rotate?: number
  anchor?: number
}>`
  position: absolute;
  left: ${(props) => props.left}px;
  top: ${(props) => props.top}px;
  transform: rotate(${(props) => props.rotate ?? 0}deg);
  transform-origin: ${(props) => props.anchor ?? 0}% 0%;
  transition: 300ms;
  z-index: 0;
  pointer-events: none;
`
const BottomDisplayContainer = styled.div`
  position: absolute;
  width: 672px;
  height: 134px;
  left: 24px;
  top: 632px;
  background: #faf2ff;
  display: flex;
  gap: 5px;
  align-items: center;
  justify-content: space-evenly;
`
const DropZone = styled.img`
  position: absolute;
  top: 50px;
  left: -10px;
`

const PlayerContainer = styled(Player)<{ top: number; left: number }>`
  position: absolute;
  left: ${(props) => props.left}px;
  top: ${(props) => props.top}px;
  pointer-events: none;
  z-index: 2;
`

const TextContainer = styled.div`
  color: white;
  text-align: center;
  position: absolute;
  left: 35px;
  top: 150px;
  font-size: 20px;
  transition: 0.3s;
  transition-delay: 1s;
`
const DropContainer = styled.div`
  position: absolute;
  left: 10px;
  top: 77px;
  z-index: -1;
`

const InitialTransition = {
  left: 30,
  top: 660,
}
const animationSequence = [DragAnimation, HoldAnimation, DropAnimation]
const animationPosition = { left: 134, top: 380 }
const increments = { left: (134 - 30) / 100, top: (180 - 540) / 100 }
const fruits = [Banana, Apple, Apple2, Pineapple, Pineapple2, Watermelon]
const weights = [0.5, 0.25, 0.5, 0.75, 1, 1]
const InitialState = [
  { isSnap: -1 },
  { isSnap: -1 },
  { isSnap: -1 },
  { isSnap: -1 },
  { isSnap: -1 },
  { isSnap: -1 },
]
const DropInitialState = [{ dropped: -1 }, { dropped: -1 }]
const InitialWeight = [{ weight: 0 }, { weight: 0 }]

export const Applet03601Ge: React.FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const [angle, setAngle] = useState(0)
  const [dragParam, setDragParam] = useState(InitialState)
  const [dropParam, setDropParam] = useState(DropInitialState)
  const [weight, setWeight] = useState(InitialWeight)
  const onInteraction = useContext(AnalyticsContext)
  const [showOnBording, setShowOnBoarding] = useState(true)
  const [showDropZone, setShowDropZone] = useState(false)
  const [transitionState, setTransitionState] = useState(InitialTransition)
  const [index, setIndex] = useState(0)

  const onDragEndHandle = ({ over, active }: DragEndEvent) => {
    if (over) {
      setDragParam((p) => {
        const d = { ...p }
        const index = Object.keys(d).findIndex((key, i) => d[i].isSnap === over.id)
        if (index !== -1) d[index].isSnap = -1
        d[active.id as number].isSnap = over.id as number
        return d
      })
      setWeight((p) => {
        const d = { ...p }
        d[over.id as number].weight = weights[active.id as number]
        return d
      })
      setDropParam((p) => {
        const d = { ...p }
        d[over.id as number].dropped = active.id as number
        return d
      })
      onInteraction('drop')
    } else {
      setDragParam((p) => {
        const d = { ...p }
        d[active.id as number].isSnap = -1
        return d
      })
      setDropParam((p) => {
        const d = { ...p }
        const index = Object.keys(d).findIndex((e, i) => d[i].dropped === (active.id as number))
        if (index !== -1) d[index].dropped = -1
        return d
      })
    }
    setShowDropZone(false)
  }
  const onDragStart = () => {
    onInteraction('drag')
    setShowOnBoarding(false)
    setShowDropZone(true)
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

  useInterval(
    () => {
      const x = (weight[1].weight - weight[0].weight) * 20
      setAngle((a) => {
        const inc = a > x ? -0.1 : 0.1
        return a + inc
      })
    },
    Math.floor(angle) === Math.floor((weight[1].weight - weight[0].weight) * 20) ? null : 5,
  )

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
        aspectRatio: 0.9,
        borderColor: '#FAF2FF',
        id: '036_01_GE',
        onEvent,
        className,
      }}
    >
      <TextHeader
        text="Place the fruits on the weighing balance to compare their weights."
        backgroundColor="#FAF2FF"
        buttonColor="#EACCFF"
      />
      <DndContext sensors={sensors} onDragEnd={onDragEndHandle} onDragStart={onDragStart}>
        <CenterImageContainer left={280} top={200}>
          <img src={Middlebar} />
          <CenterImageContainer left={-92} top={25} rotate={angle} anchor={45}>
            <img src={Bar} />
            <CenterImageContainer left={-48} top={40} anchor={50} rotate={-angle}>
              <Droppable id={`${0}`}>
                <img src={Plate} />
              </Droppable>
              {dropParam[0].dropped === -1 && showDropZone && <DropZone src={Dropzone} />}
              {Object.keys(dropParam).map(
                (key, i) =>
                  dropParam[i].dropped !== -1 && (
                    <DropContainer key={i}>
                      <Draggable id={`${i + 6}`}>
                        <img src={fruits[dropParam[0].dropped]} />
                      </Draggable>
                    </DropContainer>
                  ),
              )}

              <TextContainer>
                {Math.floor(angle) === Math.floor((weight[1].weight - weight[0].weight) * 20) &&
                dropParam[0].dropped !== -1 &&
                dropParam[1].dropped !== -1
                  ? (angle < 1.5 && angle > 0) || (angle > -1.5 && angle < 0) || angle == 0
                    ? 'Equal'
                    : angle > 0
                    ? 'Lighter'
                    : 'Heavier'
                  : '--------'}
              </TextContainer>
            </CenterImageContainer>
            <CenterImageContainer left={275} top={40} anchor={50} rotate={-angle}>
              {Object.keys(dropParam).map(
                (key, i) =>
                  dropParam[i].dropped !== -1 && (
                    <DropContainer key={i}>
                      <Draggable id={`${i + 6}`}>
                        <img src={fruits[dropParam[1].dropped]} />
                      </Draggable>
                    </DropContainer>
                  ),
              )}
              <Droppable id={`${1}`}>
                <img src={Plate} />
              </Droppable>
              {dropParam[1].dropped === -1 && showDropZone && <DropZone src={Dropzone} />}
              <TextContainer>
                {Math.floor(angle) === Math.floor((weight[1].weight - weight[0].weight) * 20) &&
                dropParam[0].dropped !== -1 &&
                dropParam[1].dropped !== -1
                  ? (angle < 1.5 && angle > 0) || (angle > -1.5 && angle < 0) || angle == 0
                    ? 'Equal'
                    : angle > 0
                    ? 'Heavier'
                    : 'Lighter'
                  : '--------'}
              </TextContainer>
            </CenterImageContainer>
          </CenterImageContainer>
        </CenterImageContainer>
        <BottomDisplayContainer>
          {fruits.map((fruit, i) =>
            dragParam[i].isSnap !== -1 ? (
              <Droppable key={i} id={`${i + 2}`}>
                <img src={Placeholder} />
              </Droppable>
            ) : (
              <Draggable id={`${i}`} key={i}>
                <img src={fruit} />
              </Draggable>
            ),
          )}
        </BottomDisplayContainer>
      </DndContext>
      {showOnBording && (
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

import { DndContext, rectIntersection } from '@dnd-kit/core'
import React, { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'

import { useSFX } from '@/hooks/useSFX'

import { AppletContainer } from '../../common/AppletContainer'
import { TextHeader } from '../../common/Header'
import { AppletInteractionCallback } from '../../contexts/analytics'
import ButtonBase, { getQuestionShapes, trySvg } from './assets/assetLib'
import Grid from './assets/GridElement'
import PopUp from './assets/PopUp'
import Shapes from './assets/Shapes'

interface CellPositionProps {
  id: string
  positionX: number
  positionY: number
}

const ButtonHolder = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-content: center;
  margin-top: 70px;
`

const Button = styled.button`
  position: absolute;
  left: 50%;
  margin-bottom: 40px;
  translate: -50%;
  bottom: 52px;
  border: none;
  background: #8c69ff;
  border-radius: 10px;
  cursor: pointer;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 500;
  font-size: 24px;
  line-height: 42px;
  text-align: center;
  color: #ffffff;
  align-items: center;
  display: flex;
  justify-content: center;
  &:disabled {
    cursor: default;
    opacity: 0.2;
  }
  &:hover {
    background: #7f5cf4;
  }
  &:active {
    background: #6549c2;
  }
`

let copyArray = [0, 1, 2, 3]

//properties of grid
const gridProps = {
  cellWidth: 35,
  cellHeight: 35,
  rows: 11,
  columns: 18,
}

let occupationArray: Array<string> = []
let startOccupation: Array<string> = []
let overOccupation: Array<string> = []

export const Applet04501Pr: React.FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const [qn, setQn] = useState(0)
  const [currentSel, setCurrentSel] = useState(4)
  const [popup, setPopup] = useState(false)
  const [endOfLine, setEndOfLine] = useState(false)
  const playMouseIn = useSFX('mouseIn')
  const playMouseOut = useSFX('mouseClick')
  const playCorrect = useSFX('correct')
  const playIncorrect = useSFX('incorrect')

  const [shapeState, setShapeState] = useState(getQuestionShapes(0))
  const [forceRerender, setForceRerender] = useState(false)

  const [draggedObject, setDraggedObject] = useState('')
  const [overObject, setOverObject] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const [buttonState, setButtonState] = useState(0)

  const returnFromArray = () => {
    let returnedNumber
    if (copyArray.length === 1) {
      returnedNumber = copyArray[0]
      copyArray = [0, 1, 2, 3]
    } else {
      returnedNumber = copyArray.getRandomAndRemove()
    }

    if (returnedNumber === undefined) playMouseIn()
    else {
      return returnedNumber
    }
  }

  const gridCellPositions: { [key: string]: CellPositionProps } = useMemo(() => {
    const positions: { [key: string]: CellPositionProps } = {}
    for (let i = 0; i < gridProps.rows; i++) {
      for (let j = 0; j < gridProps.columns; j++) {
        const row = i
        const col = j
        const idOfCell = `cell-${row}-${col}`
        const x = col * gridProps.cellWidth
        const y = row * gridProps.cellHeight
        positions[idOfCell] = { id: idOfCell, positionX: x, positionY: y }
      }
    }
    return positions
  }, [])

  const handleDragEnd = (event: any) => {
    setIsDragging(false)
    const droppedObject = shapeState.find((item) => item.id === event.active.id)
    const droppedSlot = gridCellPositions[event.over.id]
    if (droppedObject !== undefined && droppedSlot !== undefined) {
      if (overOccupation.includes('cell-outside')) {
        playIncorrect()
      } else {
        const returnVal = crossCheck(overOccupation, occupationArray)
        if (!returnVal.elementPresent) {
          droppedObject.left = droppedSlot.positionX
          droppedObject.top = droppedSlot.positionY
        }
        occupationArray = returnVal.largeArray
      }
    }

    setForceRerender(true)
  }

  const getGridId = (positionX: number, positionY: number) => {
    for (const id in gridCellPositions) {
      const cell = gridCellPositions[id]
      if (cell.positionX === positionX && cell.positionY === positionY) {
        return id
      }
    }
    return 'cell-outside'
  }

  const crossCheck = (smallArray: Array<string>, largeArray: Array<string>) => {
    const elementPresent = false
    const copyArray: Array<string> = []
    copyArray.push(...largeArray)

    // remove all already occupied cells
    copyArray.removeArrayFromArray(startOccupation)

    // check if all elements of dropped array are there in occArray

    if (copyArray.containsAny(smallArray)) {
      return { elementPresent: true, largeArray: largeArray }
    } else {
      copyArray.push(...smallArray)
    }
    return { elementPresent: elementPresent, largeArray: copyArray }
  }

  const cellsOccupiedByThisShape = (
    positionX: number,
    positionY: number,
    widthOfShape: number,
    heightOfShape: number,
  ) => {
    const gridPosTopLeftX = positionX
    const gridPosTopLeftY = positionY
    const gridPosTopRightX = gridPosTopLeftX + (widthOfShape - 1) * gridProps.cellWidth
    const gridPosBotRightY = gridPosTopLeftY + (heightOfShape - 1) * gridProps.cellHeight
    const gridCellsOccupied = []

    for (let i = gridPosTopLeftX; i <= gridPosTopRightX; i = i + gridProps.cellWidth) {
      for (let j = gridPosTopLeftY; j <= gridPosBotRightY; j = j + gridProps.cellHeight) {
        gridCellsOccupied.push(getGridId(i, j))
      }
    }
    return gridCellsOccupied
  }

  useEffect(() => {
    setForceRerender(false)
  }, [forceRerender])

  const handleClick = (props: number) => {
    setButtonState(1)
    setCurrentSel(props)
  }

  useEffect(() => setShapeState(getQuestionShapes(qn)), [qn])

  useEffect(() => {
    playMouseOut()
  }, [currentSel, playMouseOut])

  useEffect(() => {
    ResetQuestion()
  }, [])

  useEffect(() => {
    const temArray: string[] = []
    for (let i = 0, k = shapeState.length; i < k; i++) {
      const occupiedCells = cellsOccupiedByThisShape(
        shapeState[i].left,
        shapeState[i].top,
        shapeState[i].width,
        shapeState[i].height,
      )
      for (let j = 0, l = occupiedCells.length; j < l; j++) {
        temArray.push(occupiedCells[j])
      }
    }
  }, [overObject])

  const checkAnswer = () => {
    if (currentSel === 4) return
    if (!endOfLine && currentSel === qn) {
      setEndOfLine(true)
      playCorrect()
      setButtonState(2)
    }
    if (endOfLine) {
      setEndOfLine(false)
      ResetQuestion()
      setButtonState(0)
    }
    if (currentSel !== qn && !endOfLine) {
      playIncorrect()
      setButtonState(3)
      setPopup(true)
    }
  }

  useEffect(() => {
    occupationArray = []
    for (let i = 0, k = shapeState.length; i < k; i++) {
      const occupiedCells = cellsOccupiedByThisShape(
        shapeState[i].left,
        shapeState[i].top,
        shapeState[i].width,
        shapeState[i].height,
      )
      occupationArray.push(...occupiedCells)
    }
  }, [qn])

  const ResetQuestion = () => {
    setCurrentSel(4)
    const tempNum = returnFromArray()
    if (tempNum !== undefined) {
      setQn(tempNum)
    } else {
      setQn(4)
      setEndOfLine(true)
    }
  }

  const handleDragOver = (event: any) => {
    if (event.over != null) {
      const draggedElement = shapeState.find((item) => item.id === draggedObject)
      const droppedElement = gridCellPositions[event.over.id]
      if (draggedElement !== undefined && droppedElement !== undefined) {
        const tempArray = cellsOccupiedByThisShape(
          droppedElement?.positionX,
          droppedElement?.positionY,
          draggedElement?.width,
          draggedElement?.height,
        )
        overOccupation = tempArray
      }
      setOverObject(event.over.id)
    }
  }

  const handleDragStart = (event: any) => {
    setIsDragging(true)
    setDraggedObject(event.active.id)
    const draggedElement = shapeState.find((item) => item.id === event.active.id)
    if (draggedElement !== undefined) {
      startOccupation = cellsOccupiedByThisShape(
        draggedElement?.left,
        draggedElement?.top,
        draggedElement?.width,
        draggedElement?.height,
      )
    }
  }

  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#FAF2FF',
        id: '045_01_PR',
        onEvent,
        className,
      }}
    >
      <TextHeader
        text="Select the solid that can be built using the plane figures shown below. "
        backgroundColor="#FAF2FF"
        buttonColor="#EACCFF"
      />
      <DndContext
        collisionDetection={rectIntersection}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div
          style={{
            justifyContent: 'center',
            width: '720px',
            marginTop: '120px',
            marginLeft: '45px',
            position: 'absolute',
          }}
        >
          {shapeState.map((shape) => (
            <Shapes
              key={shape.id}
              id={shape.id}
              src={shape.shapeSource}
              name={shape.name}
              leftOffset={shape.leftOffset}
              topOffset={shape.topOffset}
              left={shape.left + shape.leftOffset}
              top={shape.top + shape.topOffset}
              angle={shape.angle}
              width={shape.width}
              height={shape.height}
            />
          ))}
        </div>
        <div style={{ position: 'absolute', top: '20px', zIndex: -1 }}>
          <Grid
            cellWidth={gridProps.cellWidth}
            cellHeight={gridProps.cellHeight}
            rows={gridProps.rows}
            columns={gridProps.columns}
            highlightArray={overOccupation}
            isDragging={isDragging}
          />
        </div>
      </DndContext>
      <ButtonHolder>
        <ButtonBase
          onClick={handleClick}
          buttonState={buttonState}
          data={{
            btnNumber: 0,
            currentSel: currentSel,
          }}
        />
        <ButtonBase
          onClick={handleClick}
          buttonState={buttonState}
          data={{
            btnNumber: 1,
            currentSel: currentSel,
          }}
        />
        <ButtonBase
          onClick={handleClick}
          buttonState={buttonState}
          data={{
            btnNumber: 2,
            currentSel: currentSel,
          }}
        />
        <ButtonBase
          onClick={handleClick}
          buttonState={buttonState}
          data={{
            btnNumber: 3,
            currentSel: currentSel,
          }}
        />
      </ButtonHolder>
      <Button
        style={{
          height: '60px',
          width: '200px',
          fontSize: '24px',
          lineHeight: '24px',
          bottom: '0px',
        }}
        onClick={checkAnswer}
      >
        {endOfLine ? (
          <span
            style={{
              width: '140px',
              display: 'flex',
              justifyContent: 'space-between',
              alignContent: 'center',
            }}
          >
            <img src={trySvg} />
            <p>Try again</p>
          </span>
        ) : (
          'Check'
        )}
      </Button>
      {popup ? <PopUp qnNo={qn} onclick={() => setPopup(false)} /> : null}
    </AppletContainer>
  )
}

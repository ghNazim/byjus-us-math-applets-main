import { DndContext, DragEndEvent, DragOverEvent } from '@dnd-kit/core'
import { Player } from '@lottiefiles/react-lottie-player'
import React, { useContext, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'

import { useSFX } from '@/hooks/useSFX'

import { AppletContainer } from '../../common/AppletContainer'
import DropAnimation from '../../common/handAnimations/dragAndDropEnd.json'
import HoldAnimation from '../../common/handAnimations/dragAndDropHold.json'
import DragAnimation from '../../common/handAnimations/dragAndDropStart.json'
import { Header } from '../../common/Header'
import { RestartButton } from '../../common/PageControl/Buttons'
import { AnalyticsContext, AppletInteractionCallback } from '../../contexts/analytics'
import { useInterval } from '../../hooks/useInterval'
import rectangle3UnitsGray from './Assets/Draggables/gray/Rectangle(3 squares)_gray.svg'
import rectagle6unitsGray from './Assets/Draggables/gray/Rectangle(6 squares)_gray.svg'
import square4unitsGray from './Assets/Draggables/gray/square(4 squares)_gray.svg'
import triangle2UnitsGray from './Assets/Draggables/gray/triangle(2 squares)_gray.svg'
import rectangle3Units from './Assets/Draggables/Rectangle(3 squares).svg'
import rectangle6Units from './Assets/Draggables/Rectangle(6 squares).svg'
import square4Units from './Assets/Draggables/square(4 squares).svg'
import triangle2Units from './Assets/Draggables/triangle(2 squares).svg'
import successAnimation from './Assets/TickAnimation.json'
import Grid from './Components/Grid'
import PopUp from './Components/PopUp'
import Shapes from './Components/Shapes'

const Button = styled.button`
  position: absolute;
  width: 160px;
  height: 60px;
  left: 50%;
  translate: -50%;
  bottom: 32px;
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

const GeogebraPlayer = styled(Player)`
  position: absolute;
  /* top: 190px; */
  margin: auto;
  width: 720px;
  height: 800px;
  pointer-events: none;
`

interface ShapesProps {
  id: string
  isTriangle: boolean
  name: string
  shapeSource: any
  order?: number
  isReplica: boolean
  position: {
    x: number
    y: number
  }
  width: number
  height: number
  color?: string
  isFirstElement?: boolean
}

interface CellPositionProps {
  id: string
  positionX: number
  positionY: number
}

//the shapes on top
const shapes: ShapesProps[] = [
  {
    id: 'Rec6Uni',
    name: 'Rectangle6Units',
    shapeSource: rectangle6Units,
    order: 1,
    position: { x: 0, y: 0 },
    width: 3,
    height: 2,
    isTriangle: false,
    isReplica: false,
    color: 'rgba(255, 210, 166, 0.5)',
  },
  {
    id: 'Squ4Uni',
    name: 'Square4Units',
    shapeSource: square4Units,
    order: 2,
    position: { x: 0, y: 0 },
    width: 2,
    height: 2,
    isTriangle: false,
    isReplica: false,
    color: 'rgba(166, 240, 255, 0.5)',
  },
  {
    id: 'Tri2Uni',
    name: 'Triangle2Units',
    shapeSource: triangle2Units,
    order: 3,
    position: { x: 0, y: 0 },
    width: 2,
    height: 2,
    isTriangle: true,
    isReplica: false,
    color: 'rgba(188, 211, 255, 0.5)',
  },
  {
    id: 'Rec3Uni',
    name: 'Rectangle3Units',
    shapeSource: rectangle3Units,
    order: 4,
    position: { x: 0, y: 0 },
    width: 3,
    height: 1,
    isTriangle: false,
    isReplica: false,
    color: 'rgba(255, 220, 115, 0.5)',
  },
]

const grayShapes = [rectagle6unitsGray, square4unitsGray, triangle2UnitsGray, rectangle3UnitsGray]

//properties of grid
const gridProps = {
  cellWidth: 48,
  cellHeight: 48,
  rows: 10,
  columns: 12,
}

const thisShapeDoesntExist: ShapesProps = {
  id: 'nullShape',
  name: 'nullShape',
  shapeSource: null,
  position: { x: 0, y: 0 },
  width: 0,
  height: 0,
  isTriangle: false,
  isReplica: false,
}

const initialFocusColorArr = () => {
  const colors = []
  for (let i = 0; i < 120; i++) {
    colors[i] = 'transparent'
  }
  return colors
}

const colors = initialFocusColorArr()

const PlayerContainer = styled(Player)<{ top: number; left: number }>`
  position: absolute;
  left: ${(props) => props.left}px;
  top: ${(props) => props.top}px;
  pointer-events: none;
`

const animationSequence = [DragAnimation, HoldAnimation, DropAnimation]
const animationPosition = { left: 236, top: 100 }
const InitialTransition = {
  left: 114,
  top: 100,
}
const increments = { left: (234 - 114) / 100, top: 240 / 100 }

const Restart = styled.div`
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.5);
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  z-index: 100;
  padding: 100px;
`

export const Applet03701Pr: React.FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const [newShapes, setNewShapes] = useState<ShapesProps[]>([])
  const [firstElementPlaced, setFirstElementPLaced] = useState(false)
  const [randArea, setRandArea] = useState(0)
  const [compositeShapeArea, setCompositeShapeArea] = useState(0)
  const [showAreaPopUp, setAreaShowPopUp] = useState(false)
  const [showShapeWarning, setShowShapeWarning] = useState(false)
  const [indexOfNewShape, setIndexOfNewShape] = useState(0)
  const [neighbouringCellIds, setNeighbouringCellIds] = useState<string[]>([])
  const [occupiedCellIds, setOccupiedCellIds] = useState<string[]>([])
  const [playSuccessAnimation, setPlaySuccessAnimation] = useState(false)
  const [focusColor, setFocusColor] = useState<string[]>(colors)
  const [showOnBording, setShowOnBoarding] = useState(true)
  const [transitionState, setTransitionState] = useState(InitialTransition)
  const [index, setIndex] = useState(0)
  const onInteraction = useContext(AnalyticsContext)
  const playMouseIn = useSFX('mouseIn')
  const playMouseOut = useSFX('mouseOut')
  const playCorrectAnswer = useSFX('correct')
  const playInCorrectAnswer = useSFX('incorrect')
  const [showReplayBtn, setShowReplayBtn] = useState(false)

  const restart = () => {
    setNewShapes([])
    setCompositeShapeArea(0)
    setFirstElementPLaced(false)
    setIndexOfNewShape(0)
    setNeighbouringCellIds([])
    setOccupiedCellIds([])
    setPlaySuccessAnimation(false)
    setShowOnBoarding(true)
    setShowReplayBtn(false)
    randomNumberForArea()
  }

  const randomNumberForArea = () => {
    const minVal = 7
    const maxVal = 25
    const rand = Math.round(Math.random() * (maxVal - minVal) + minVal)
    setRandArea(rand)
  }

  useEffect(() => {
    randomNumberForArea()
  }, [])

  const gridCellPositions: { [key: string]: CellPositionProps } = useMemo(() => {
    const positions: { [key: string]: CellPositionProps } = {}
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 12; j++) {
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

  const disclaimerMessages = [
    `Current area covered is ${compositeShapeArea} squares. Try using the shapes to cover ${randArea} squares.`,
    'Keep the shapes next to each other to create a composite shape.',
  ]

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

      if (transitionState.left > InitialTransition.left + increments.left) setIndex(1)
      else setIndex(0)
      if (transitionState.left > InitialTransition.left + increments.left * 99) setIndex(2)
    },
    showOnBording ? (index == 1 ? 15 : 500) : null,
  )

  const calcArea = (isTriangle: boolean, width: number, height: number) => {
    if (!isTriangle) return width * height
    else return (width * height) / 2
  }

  const getShapeDetails = (id: string) => {
    const shape = shapes.find((shape) => shape.id === id)
    if (shape !== undefined) return shape
    else {
      return thisShapeDoesntExist
    }
  }

  const findMiddlePointOfShape = (width: number, height: number) => {
    const x = Math.floor(width / 2) * gridProps.cellWidth
    const y = Math.floor(height / 2) * gridProps.cellHeight
    return [x, y]
  }

  const checkIfShapeFitsInsideGrid = (
    xPos: number,
    yPos: number,
    width: number,
    height: number,
  ) => {
    //return true,false if the shape at xPos,yPos is inside the grid
    const gridRight = gridProps.cellWidth * gridProps.columns
    const gridBottom = gridProps.cellHeight * gridProps.rows

    const widthOfShapeInAbsUnits = width * gridProps.cellWidth
    const heightOfShapeInAbsUnits = height * gridProps.cellHeight
    const shapeTopLeft = [xPos, yPos]
    const shapeTopRight = [xPos + widthOfShapeInAbsUnits, yPos]
    const shapeBottomLeft = [xPos, yPos + heightOfShapeInAbsUnits]

    if (shapeTopLeft[0] >= 0 && shapeTopRight[0] <= gridRight) {
      if (shapeTopLeft[1] >= 0 && shapeBottomLeft[1] <= gridBottom) {
        return true
      }
    }
    return false
  }

  const neighbouringCellIdsToThisShape = (
    shapeId: string,
    positionX: number,
    positionY: number,
    widthOfShape: number,
    heightOfShape: number,
  ) => {
    const [X, Y] = [positionX, positionY]
    const neighbouringCells: string[] = []
    //here, new shape can be placed above, below, left and right side
    //of the shape. So, finding the position of all those cells and
    //then finding the ids of those cells so that, when adding new
    //position , it can be checked
    const addToNeigbouringArray = (id: string) => {
      neighbouringCells.push(id)
    }
    //points in the right direction
    const rightIncrements = []
    for (let i = 0; i < widthOfShape; i++) {
      rightIncrements.push(X + i * gridProps.cellWidth)
    }
    //points in the y direction
    const bottomIncrements = []
    for (let i = 0; i < heightOfShape; i++) {
      bottomIncrements.push(Y + i * gridProps.cellHeight)
    }

    const xBoundaries = [
      rightIncrements[0] - gridProps.cellWidth,
      rightIncrements[rightIncrements.length - 1] + gridProps.cellWidth,
    ]

    const yBoundaries = [
      bottomIncrements[0] - gridProps.cellHeight,
      bottomIncrements[bottomIncrements.length - 1] + gridProps.cellHeight,
    ]
    if (shapeId !== 'Tri2Uni') {
      for (let i = 0; i < heightOfShape; i++) {
        //right boundary cells
        const rightBound = getGridId(xBoundaries[1], bottomIncrements[i])
        if (rightBound !== 'cell-outside') {
          addToNeigbouringArray(rightBound)
        }
      }
      for (let i = 0; i < widthOfShape; i++) {
        //top boundary cells
        const topBound = getGridId(rightIncrements[i], yBoundaries[0])

        if (topBound !== 'cell-outside') {
          addToNeigbouringArray(topBound)
        }
      }
    }
    for (let i = 0; i < heightOfShape; i++) {
      //left boundary cells
      const leftBound = getGridId(xBoundaries[0], bottomIncrements[i])
      if (leftBound !== 'cell-outside') {
        addToNeigbouringArray(leftBound)
      }
    }

    for (let i = 0; i < widthOfShape; i++) {
      //bottom boundary cells
      const bottomBound = getGridId(rightIncrements[i], yBoundaries[1])
      if (bottomBound !== 'cell-outside') {
        addToNeigbouringArray(bottomBound)
      }
    }
    return neighbouringCells
  }

  const cellsOccupiedByThisShape = (
    shapeId: string,
    positionX: number,
    positionY: number,
    widthOfShape: number,
    heightOfShape: number,
  ) => {
    //return the ids of cells occupied at [positionX, positionY]
    const gridPosTopLeftX = positionX
    const gridPosTopLeftY = positionY
    const gridPosTopRightX = gridPosTopLeftX + (widthOfShape - 1) * gridProps.cellWidth
    const gridPosBotRightY = gridPosTopLeftY + (heightOfShape - 1) * gridProps.cellHeight
    const gridCellsOccupied = []

    if (shapeId !== 'Tri2Uni') {
      for (let i = gridPosTopLeftX; i <= gridPosTopRightX; i = i + gridProps.cellWidth) {
        for (let j = gridPosTopLeftY; j <= gridPosBotRightY; j = j + gridProps.cellHeight) {
          gridCellsOccupied.push(getGridId(i, j))
        }
      }
    } else {
      for (let i = gridPosTopLeftX; i <= gridPosTopRightX; i = i + gridProps.cellWidth) {
        for (let j = gridPosTopLeftY; j <= gridPosBotRightY; j = j + gridProps.cellHeight) {
          if (!(i !== gridPosTopLeftX && j !== gridPosBotRightY)) {
            gridCellsOccupied.push(getGridId(i, j))
          }
        }
      }
    }
    return gridCellsOccupied
  }

  const checkOverlapping = (
    currentlyOccupiedCells: string[],
    shapeId: string,
    positionX: number,
    positionY: number,
    width: number,
    height: number,
  ) => {
    //return if overlapping is there with the new shape and current cells
    const cellsOccupidByShape = cellsOccupiedByThisShape(
      shapeId,
      positionX,
      positionY,
      width,
      height,
    )
    const isOverlapping = cellsOccupidByShape.some((element) => {
      return currentlyOccupiedCells.includes(element)
    })

    return isOverlapping
  }

  const getGridPos = (id: string) => {
    const position = gridCellPositions[id]
    if (position) {
      return [position.positionX, position.positionY]
    } else {
      return [-1, -1]
    }
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
  const compareArraysForCommonElements = (arr1: string[], arr2: string[]) => {
    const commonElements = arr1.filter((elem) => arr2.includes(elem))
    return commonElements
  }

  const removeArr1FromArr2 = (arr1: string[], arr2: string[]) => {
    const newArr = arr2.filter(function (el) {
      return !arr1.includes(el)
    })
    return newArr
  }

  const checkAllSidesOfNewShapeToSnap = (
    shapeId: string,
    positionX: number,
    positionY: number,
    width: number,
    height: number,
  ) => {
    //here I'm checking 2 cells in the perpendicular direction of the new
    //shape in all possible directions, also i'm checking if it's getting
    //overlapped. I'm considering all the properties of the shape and
    //returning an array of cell Ids where the shape can be placed to make
    //a combound shape.
    const topLeft = [positionX, positionY]
    const topLeftCellId = getGridId(positionX, positionY)
    const topRight = [positionX + width * gridProps.cellWidth, positionY]
    const bottomLeft = [positionX, positionY + gridProps.cellHeight * height]
    const bottomRight = [
      positionX + width * gridProps.cellWidth,
      positionY + gridProps.cellHeight * height,
    ]
    const gridCellHeight = gridProps.cellHeight
    const gridCellWidth = gridProps.cellWidth
    const maxDistanceToCheckInYDir = gridCellHeight
    const maxDistaneToCheckInXDir = gridCellWidth
    const heightOfShapeInAbsUnits = height * gridProps.cellHeight

    let droppableNeighbouringIds: string[] = []
    const middlePoint = findMiddlePointOfShape(width, height)
    if (shapeId !== 'Tri2Uni') {
      // //checking top side
      for (let i = topLeft[0] - gridProps.cellWidth; i <= topRight[0]; ) {
        for (let j = topLeft[1] - gridCellHeight; j > topLeft[1] - maxDistanceToCheckInYDir; ) {
          const id = getGridId(i, j)
          const tempOccupiedCells = cellsOccupiedByThisShape(shapeId, i, j, width, height)
          const commonCellsWithCurrNeighbourCells = compareArraysForCommonElements(
            tempOccupiedCells,
            neighbouringCellIds,
          )
          if (commonCellsWithCurrNeighbourCells.length > 0) {
            const isOverlapping = checkOverlapping(occupiedCellIds, shapeId, i, j, width, height)
            if (!isOverlapping) droppableNeighbouringIds.push(id)
          }
          j -= gridCellHeight
        }
        i += gridCellWidth
      }

      // // checking right side
      for (
        let i = topRight[0] - gridProps.cellHeight;
        i < topRight[0] + maxDistaneToCheckInXDir;

      ) {
        for (
          let j = topRight[1] - gridProps.cellWidth;
          j < bottomRight[1] + maxDistanceToCheckInYDir;

        ) {
          const id = getGridId(i, j)
          const tempOccupiedCells = cellsOccupiedByThisShape(shapeId, i, j, width, height)
          const commonCellsWithCurrNeighbourCells = compareArraysForCommonElements(
            tempOccupiedCells,
            neighbouringCellIds,
          )
          if (commonCellsWithCurrNeighbourCells.length > 0) {
            const isOverlapping = checkOverlapping(occupiedCellIds, shapeId, i, j, width, height)
            if (!isOverlapping) droppableNeighbouringIds.push(id)
          }
          j += gridCellHeight
        }
        i += gridCellWidth
      }
    }

    //checking bottom side
    if (shapeId === 'Tri2Uni') {
      for (let i = bottomLeft[0] - gridProps.cellWidth; i <= bottomRight[0]; ) {
        for (
          let j = bottomLeft[1] - gridProps.cellHeight;
          j <= bottomLeft[1] + maxDistanceToCheckInYDir;

        ) {
          const id = getGridId(i, j)
          if (neighbouringCellIds.includes(id)) {
            const tempPosition = getGridPos(id)
            const correctPosition = [
              tempPosition[0],
              tempPosition[1] - heightOfShapeInAbsUnits + middlePoint[1],
            ]
            const correctId = getGridId(correctPosition[0], correctPosition[1])

            const position = getGridPos(correctId)
            const isOverlapping = checkOverlapping(
              occupiedCellIds,
              shapeId,
              position[0],
              position[1],
              width,
              height,
            )
            if (!isOverlapping) {
              droppableNeighbouringIds.push(correctId)
            }
          }
          j += gridCellHeight
        }
        i += gridCellWidth
      }
    } else {
      for (let i = bottomLeft[0]; i <= bottomRight[0]; ) {
        for (let j = bottomLeft[1]; j < bottomLeft[1] + gridCellHeight; ) {
          const id = getGridId(i, j)

          const tempOccupiedCells = cellsOccupiedByThisShape(shapeId, i, j, width, height)
          const commonCellsWithCurrNeighbourCells = compareArraysForCommonElements(
            tempOccupiedCells,
            neighbouringCellIds,
          )
          if (commonCellsWithCurrNeighbourCells.length > 0) {
            const isOverlapping = checkOverlapping(occupiedCellIds, shapeId, i, j, width, height)
            if (!isOverlapping) droppableNeighbouringIds.push(id)
          }
          j += gridCellHeight
        }
        i += gridCellWidth
      }
    }

    //left side
    if (shapeId === 'Tri2Uni') {
      for (let i = topLeft[0] - gridProps.cellWidth; i > topLeft[0] - gridProps.cellWidth; ) {
        for (let j = topLeft[1]; j < topLeft[1] + gridProps.cellWidth; ) {
          const id = getGridId(i, j)
          if (neighbouringCellIds.includes(id)) {
            const position = getGridPos(id)
            const isOverlapping = checkOverlapping(
              occupiedCellIds,
              shapeId,
              position[0],
              position[1],
              width,
              height,
            )
            if (!isOverlapping) {
              droppableNeighbouringIds.push(id)
            }
          }
          j += gridCellHeight
        }
        i -= gridCellWidth
      }
    } else {
      for (let i = topLeft[0]; i >= topLeft[0] - maxDistaneToCheckInXDir; ) {
        for (let j = topLeft[1]; j < topLeft[1] + maxDistanceToCheckInYDir; ) {
          const id = getGridId(i, j)
          const tempOccupiedCells = cellsOccupiedByThisShape(shapeId, i, j, width, height)
          const commonCellsWithCurrNeighbourCells = compareArraysForCommonElements(
            tempOccupiedCells,
            neighbouringCellIds,
          )
          if (commonCellsWithCurrNeighbourCells.length > 0) {
            const isOverlapping = checkOverlapping(occupiedCellIds, shapeId, i, j, width, height)
            if (!isOverlapping) droppableNeighbouringIds.push(id)
          }
          j += gridCellHeight
        }
        i -= gridCellWidth
      }
    }
    droppableNeighbouringIds = arrangeCellsAccordingToDistance(
      topLeftCellId,
      droppableNeighbouringIds,
    )
    return droppableNeighbouringIds
  }

  const distanceBetweenTwoCells = (cell1: string, cell2: string) => {
    const Cell1Properties = gridCellPositions[cell1]
    const Cell2Properties = gridCellPositions[cell2]
    if (Cell1Properties !== undefined && Cell2Properties !== undefined) {
      const cell1pos = [Cell1Properties.positionX, Cell1Properties.positionY]
      const cell2pos = [Cell2Properties.positionX, Cell2Properties.positionY]
      const dist = Math.sqrt(
        Math.pow(cell1pos[0] - cell2pos[0], 2) + Math.pow(cell1pos[1] - cell2pos[1], 2),
      )
      return dist
    }
    return Infinity
  }

  const arrangeCellsAccordingToDistance = (cellTarget: string, cellArray: string[]) => {
    //this will arrange the cellids in the ascending order of distance
    //between the target
    const distArr = []

    for (let i = 0; i < cellArray.length; i++) {
      const dist = distanceBetweenTwoCells(cellTarget, cellArray[i])
      distArr.push(dist)
    }

    const pairs = distArr.map((val, index) => ({ num: val, str: cellArray[index] }))

    pairs.sort((a, b) => a.num - b.num)

    return pairs.map((pair) => pair.str)
  }

  const newNeighbourinCellIdsOfTheUnion = (
    currentNeighbouringCellIDs: string[],
    currentCellsOccupied: string[],
    cellsOccupiedByNewShape: string[],
    neighbouringCellsOfNewShape: string[],
  ) => {
    //this function will update the current neighbouring cells
    // return a new set of cells that has to be added to neighbouring
    //cell array

    //this elements should be removed from neighbouring cells state
    const newNeighbouringArray: { [key: string]: string[] } = {}
    const commElemOldNeighbToNewArea = compareArraysForCommonElements(
      currentNeighbouringCellIDs,
      cellsOccupiedByNewShape,
    )

    newNeighbouringArray.cellsToBeRemoved = commElemOldNeighbToNewArea
    const lengthOfOldNeighbToNewArea = commElemOldNeighbToNewArea.length

    if (lengthOfOldNeighbToNewArea > 0) {
      const tmpArr = removeArr1FromArr2(neighbouringCellIds, commElemOldNeighbToNewArea)
      newNeighbouringArray.cellsToBeAdded = tmpArr
      // newNeighbourArr.map((el) => newNeighbouringArray.cellsToBeAdded.push(el))
    }

    //new neighbouring elements minus these cells has to be added to
    //neighbouring cells state
    const commElemOldAreaToNewNeighb = compareArraysForCommonElements(
      currentCellsOccupied,
      neighbouringCellsOfNewShape,
    )

    const lengthOfOldAreaToNewNeighb = commElemOldAreaToNewNeighb.length
    const newNeighbouringCellIds = neighbouringCellsOfNewShape
    if (lengthOfOldAreaToNewNeighb > 0) {
      const tmpArr = removeArrayFromArr1toArr2(newNeighbouringCellIds, commElemOldAreaToNewNeighb)
      const prevTmpArr = newNeighbouringArray.cellsToBeAdded
      newNeighbouringArray.cellsToBeAdded = tmpArr.concat(prevTmpArr)
    }

    const commElemOldNeighbToNewNeighb = compareArraysForCommonElements(
      currentNeighbouringCellIDs,
      neighbouringCellsOfNewShape,
    )
    if (commElemOldNeighbToNewNeighb.length > 0) {
      newNeighbouringArray.cellsToBeAdded = removeArr1FromArr2(
        commElemOldNeighbToNewNeighb,
        newNeighbouringArray.cellsToBeAdded,
      )
    }
    return newNeighbouringArray
  }

  const showOverlay = (e: DragOverEvent) => {
    // overlay in the grid to show the position where shape is going to
    //be snapped
    const idOfCell = String(e.over?.id)
    const shapeId = String(e.active.id)
    const cellPosition = getGridPos(idOfCell)
    const isTriangle = shapeId === 'Tri2Uni' ? true : false
    const shapeProperties = getShapeDetails(shapeId)
    const middlePoint = findMiddlePointOfShape(shapeProperties.width, shapeProperties.height)
    const positionX = cellPosition[0] - middlePoint[0]
    const positionY = cellPosition[1] - middlePoint[1]
    const color = shapeProperties.color !== undefined ? shapeProperties.color : 'transparent'
    const droppableCells = checkAllSidesOfNewShapeToSnap(
      isTriangle ? 'Tri2Uni' : 'id',
      positionX,
      positionY,
      shapeProperties.width,
      shapeProperties.height,
    )
    arrangeCellsAccordingToDistance(idOfCell, droppableCells)
    if (e.over !== null) {
      if (droppableCells.length > 0) {
        //this is when the next shape is being dragged and it's
        //currently being dragged nearby the current shape
        for (let i = 0; i < arrangeCellsAccordingToDistance.length; ) {
          const cellPos = { position: getGridPos(droppableCells[i]) }
          const cellsOccupied = cellsOccupiedByThisShape(
            shapeId,
            cellPos.position[0],
            cellPos.position[1],
            shapeProperties.width,
            shapeProperties.height,
          )
          const tmpIndexes = () =>
            cellsOccupied.map((ele) => {
              if (ele !== 'cell-outside') {
                const [_, dRow, dCol] = ele.split('-')
                const index = +dRow * 12 + +dCol
                return index
              }
            })
          if (tmpIndexes !== undefined) {
            const tmp = initialFocusColorArr()
            for (let i = 0; i < 120; i++) {
              if (tmpIndexes().includes(i)) {
                tmp[i] = color
              } else {
                tmp[i] = 'transparent'
              }
            }
            setFocusColor(tmp)
          }
          break
        }
      } else if (droppableCells.length === 0 && firstElementPlaced) {
        //when the next shape is far from the boundary of current shape
        setFocusColor(initialFocusColorArr())
      } else {
        //the first shape
        const isInsideGrid = checkIfShapeFitsInsideGrid(
          positionX,
          positionY,
          shapeProperties.width,
          shapeProperties.height,
        )
        const cellsOccupied = cellsOccupiedByThisShape(
          shapeId,
          positionX,
          positionY,
          shapeProperties.width,
          shapeProperties.height,
        )
        const tmpIndexes = () =>
          cellsOccupied.map((ele) => {
            if (ele !== 'cell-outside') {
              const [_, dRow, dCol] = ele.split('-')
              const index = +dRow * 12 + +dCol
              return index
            }
          })
        if (isInsideGrid) {
          if (tmpIndexes !== undefined) {
            const tmp = initialFocusColorArr()
            for (let i = 0; i < 120; i++) {
              if (tmpIndexes().includes(i)) {
                tmp[i] = color
              } else {
                tmp[i] = 'transparent'
              }
            }
            setFocusColor(tmp)
          }
        }
      }
    }
  }
  // console.log(neighbouringCellIdsToThisShape('id', 0, 0, 2, 2))
  //when dragging down shapes to grid
  const handleDragEnd = (e: DragEndEvent) => {
    onInteraction('drop')
    playMouseOut()
    setFocusColor(initialFocusColorArr())

    const idOfCell = String(e.over?.id)
    const newShapeId = String(e.active.id)
    const cellPosition = getGridPos(idOfCell)
    const isTriangle = newShapeId === 'Tri2Uni' ? true : false
    const shapeProperties = getShapeDetails(newShapeId)
    const middlePoint = findMiddlePointOfShape(shapeProperties.width, shapeProperties.height)
    const positionX = cellPosition[0] - middlePoint[0]
    const positionY = cellPosition[1] - middlePoint[1]
    const idForNewShape = String(indexOfNewShape)
    const cellsOccupied = cellsOccupiedByThisShape(
      newShapeId,
      positionX,
      positionY,
      shapeProperties.width,
      shapeProperties.height,
    )
    //if placing inside the grid
    if (e.over !== null) {
      //placing inside the grid
      if (!firstElementPlaced && !shapeProperties.isReplica) {
        cellsOccupied.map((cellId) => {
          if (cellId !== 'cell-outside')
            setOccupiedCellIds((prevCellArr) => [...prevCellArr, cellId])
        })
        const neighbouringCells = neighbouringCellIdsToThisShape(
          newShapeId,
          positionX,
          positionY,
          shapeProperties.width,
          shapeProperties.height,
        )

        const newObject: ShapesProps = {
          isTriangle: isTriangle,
          id: idForNewShape,
          name: shapeProperties.name,
          shapeSource: shapeProperties.shapeSource,
          position: { x: positionX, y: positionY },
          width: shapeProperties.width,
          height: shapeProperties.height,
          isReplica: true,
          isFirstElement: true,
        }

        const isInsideGrid = checkIfShapeFitsInsideGrid(
          positionX,
          positionY,
          shapeProperties.width,
          shapeProperties.height,
        )

        if (isInsideGrid) {
          const area = calcArea(isTriangle, shapeProperties.width, shapeProperties.height)
          setCompositeShapeArea((prevVal) => prevVal + area)
          setNewShapes((prevVal) => [...prevVal, newObject])
          setIndexOfNewShape((prevVal) => prevVal + 1)
          neighbouringCells.map((neighbouringCell) => {
            if (
              neighbouringCell !== 'cell-outside' &&
              !occupiedCellIds.includes(neighbouringCell)
            ) {
              setNeighbouringCellIds((prevArr) => [...prevArr, neighbouringCell])
            }
          })
          setFirstElementPLaced(true)
        }
      } else {
        //second shape onwards
        const newShapeId = String(e.active.id)
        const ogShapeIds: string[] = []
        shapes.map((shape) => ogShapeIds.push(shape.id))
        const isReplica = ogShapeIds.includes(newShapeId) ? false : true
        //replica is shapes placed inside the grid
        if (!isReplica) {
          const droppableId = checkAllSidesOfNewShapeToSnap(
            isTriangle ? 'Tri2Uni' : idForNewShape,
            positionX,
            positionY,
            shapeProperties.width,
            shapeProperties.height,
          )

          arrangeCellsAccordingToDistance(idOfCell, droppableId)

          if (droppableId.length > 0) {
            //i'm looping through the droppableIds and checking if it's
            //possible to place it there.
            const lengthOfDroppableIDs = droppableId.length
            for (let i = 0; i < lengthOfDroppableIDs; i++) {
              const position = getGridPos(droppableId[i])

              const isInsideGrid = checkIfShapeFitsInsideGrid(
                position[0],
                position[1],
                shapeProperties.width,
                shapeProperties.height,
              )
              const tempOcuupiedArea = cellsOccupiedByThisShape(
                shapeProperties.id,
                position[0],
                position[1],
                shapeProperties.width,
                shapeProperties.height,
              )
              const commonElementsToCurrentNeighbourAndTempArea = () => {
                const commonElem = tempOcuupiedArea.filter((elem) =>
                  neighbouringCellIds.includes(elem),
                )
                return commonElem.length > 0
              }

              if (isInsideGrid && commonElementsToCurrentNeighbourAndTempArea()) {
                const area = calcArea(isTriangle, shapeProperties.width, shapeProperties.height)
                setCompositeShapeArea((prevVal) => prevVal + area)

                const tempNeighbouringCellIds = neighbouringCellIdsToThisShape(
                  isTriangle ? 'Tri2Uni' : idForNewShape,
                  position[0],
                  position[1],
                  shapeProperties.width,
                  shapeProperties.height,
                )

                const neighbouringCellIdsToBeAdded = newNeighbourinCellIdsOfTheUnion(
                  neighbouringCellIds,
                  occupiedCellIds,
                  tempOcuupiedArea,
                  tempNeighbouringCellIds,
                )

                const currentNeighbouringCellids =
                  neighbouringCellIdsToBeAdded.cellsToBeAdded.concat(neighbouringCellIds)

                const neighbouringCellIdsAfterRemovingCommonEle = removeArr1FromArr2(
                  neighbouringCellIdsToBeAdded.cellsToBeRemoved,
                  currentNeighbouringCellids,
                )

                setNeighbouringCellIds(neighbouringCellIdsAfterRemovingCommonEle)

                tempOcuupiedArea.map((element) =>
                  setOccupiedCellIds((prevVal) => [...prevVal, element]),
                )

                const newObject: ShapesProps = {
                  isTriangle: isTriangle,
                  id: idForNewShape,
                  name: shapeProperties.name,
                  shapeSource: shapeProperties.shapeSource,
                  position: { x: position[0], y: position[1] },
                  width: shapeProperties.width,
                  height: shapeProperties.height,
                  isReplica: true,
                }

                setNewShapes((prevVal) => [...prevVal, newObject])
                setIndexOfNewShape((prevVal) => prevVal + 1)
                break
              }
            }
          } else {
            //not able to place anywhere or further from the current shape
            setShowShapeWarning(true)
          }
        }
      }
    } else {
      const newShapeId = String(e.active.id)
      const ogShapeIds: string[] = []
      shapes.map((shape) => ogShapeIds.push(shape.id))
      const isReplica = ogShapeIds.includes(newShapeId) ? false : true
      if (isReplica) {
        //when drqagging replicas outside the gid to remove them
        const currentCellsOccupied = occupiedCellIds
        const newShapeArr = newShapes
        const shape = newShapeArr.find((element) => element.id === newShapeId)
        if (shape !== undefined) {
          const indexOfNewShape = newShapeArr.indexOf(shape)
          const position = shape.position
          const isTriangle = shape.isTriangle
          const areaOccupByShape = cellsOccupiedByThisShape(
            shape.id,
            position.x,
            position.y,
            shape.width,
            shape.height,
          )
          const tempTotalAreaOccupied = removeArrayFromArr1toArr2(
            currentCellsOccupied,
            areaOccupByShape,
          )
          const area = calcArea(isTriangle, shape.width, shape.height)
          const isRemovable =
            newShapes.length > 1 ? checkIfCellsAreConnected(tempTotalAreaOccupied) : true

          if (isRemovable) {
            setCompositeShapeArea((prevVal) => prevVal - area)
            const updatedShapes = [...newShapes]
            updatedShapes.splice(indexOfNewShape, 1)

            if (newShapes.length < 1) {
              setFirstElementPLaced(false)
            } else {
              updateNeighbourIdsAndCellsOccupied(shape)
            }
            setNewShapes(updatedShapes)
          }
        }
      } else {
        //placing shapes outside the grid
        // setShowShapeWarning(true)
      }
    }
  }

  const updateNeighbourIdsAndCellsOccupied = (shape: ShapesProps) => {
    //updating the neighbour cells and occupied cells after placing a
    //new shape
    const updatedShapeArr = newShapes.filter((el) => el !== shape)

    if (updatedShapeArr.length > 0) {
      const idOfFirstElement = updatedShapeArr[0].isTriangle ? 'Tri2Uni' : newShapes[0].id
      const positionOfFirstShape = [updatedShapeArr[0].position.x, updatedShapeArr[0].position.y]
      const widthOfFirstShape = updatedShapeArr[0].width
      const heighOfNewShape = updatedShapeArr[0].height
      const isTriangle = updatedShapeArr[0].isTriangle
      const neighbouringIdForShape1 = neighbouringCellIdsToThisShape(
        idOfFirstElement,
        positionOfFirstShape[0],
        positionOfFirstShape[1],
        widthOfFirstShape,
        heighOfNewShape,
      )
      setNeighbouringCellIds(neighbouringIdForShape1)

      const cellsOccupiedByShape1 = cellsOccupiedByThisShape(
        isTriangle ? 'Tri2Uni' : idOfFirstElement,
        positionOfFirstShape[0],
        positionOfFirstShape[1],
        widthOfFirstShape,
        heighOfNewShape,
      )
      setOccupiedCellIds(cellsOccupiedByShape1)
      for (let i = 1; i < updatedShapeArr.length; i++) {
        const isTriangle = updatedShapeArr[i].isTriangle
        const id = updatedShapeArr[i].id
        const position = [updatedShapeArr[i].position.x, updatedShapeArr[i].position.y]
        const width = updatedShapeArr[i].width
        const height = updatedShapeArr[i].height
        const tempNeighbouringCellIds = neighbouringCellIdsToThisShape(
          isTriangle ? 'Tri2Uni' : id,
          position[0],
          position[1],
          width,
          height,
        )
        const tempOcuupiedArea = cellsOccupiedByThisShape(
          isTriangle ? 'Tri2Uni' : id,
          position[0],
          position[1],
          width,
          height,
        )
        const tempTotalArea = tempOcuupiedArea.concat(occupiedCellIds)

        const neighbouringCellIdsToBeAdded = newNeighbourinCellIdsOfTheUnion(
          neighbouringIdForShape1,
          cellsOccupiedByShape1,
          tempTotalArea,
          tempNeighbouringCellIds,
        )

        neighbouringCellIdsToBeAdded.cellsToBeAdded.map((element) =>
          setNeighbouringCellIds((prevVal) => [...prevVal, element]),
        )
        tempOcuupiedArea.map((elmenet) => setOccupiedCellIds((currArr) => [...currArr, elmenet]))
      }
    } else {
      //this condition where all shapes are dragged out of the grid
      setFirstElementPLaced(false)
      setNeighbouringCellIds([])
      setOccupiedCellIds([])
    }
  }

  const removeArrayFromArr1toArr2 = (arr1: string[], arr2: string[]) => {
    arr2.forEach(function (item) {
      const index = arr1.indexOf(item)
      if (index !== -1) {
        arr1.splice(index, 1)
      }
    })
    return arr1
  }

  const checkArea = () => {
    if (compositeShapeArea === randArea) {
      setPlaySuccessAnimation(true)
      playCorrectAnswer()
      setShowReplayBtn(true)
    } else {
      setAreaShowPopUp(true)
      playInCorrectAnswer()
    }
  }

  const areaPopCloseHandle: React.MouseEventHandler = () => {
    // playMouseClick()
    // onInteraction('tap')
    setAreaShowPopUp(false)
  }

  const shapePopCloseHandle = () => {
    setShowShapeWarning(false)
  }

  const checkIfCellsAreConnected = (cellIds: string[]) => {
    //when removing a replica shape from the grid, the remaining shapes
    //should form a combound shape or the removal should not be
    //allowed. Sp, here I'm running a recursion to see if the cellids
    //given are connected. That is atlease one cell should be there
    //adjacent to each cell
    const unSeenCells = new Set(cellIds)
    const seenCells = new Set()

    const exploreCell = (cellId: string) => {
      unSeenCells.delete(cellId)
      seenCells.add(cellId)

      //neighbouring cells
      const [_, row, col] = cellId.split('-')
      for (const [dRow, dCol] of [
        [-1, 0],
        [0, -1],
        [1, 0],
        [0, 1],
      ]) {
        const neighbourRow = parseInt(row) + dRow
        const neighbourCol = parseInt(col) + dCol

        if (
          neighbourRow >= 0 &&
          neighbourRow < gridProps.rows &&
          neighbourCol >= 0 &&
          neighbourCol < gridProps.columns
        ) {
          const neighbourId = `cell-${neighbourRow}-${neighbourCol}`
          if (unSeenCells.has(neighbourId) && !seenCells.has(neighbourId)) {
            exploreCell(neighbourId)
          }
        }
      }
    }
    exploreCell(cellIds[0])

    return unSeenCells.size === 0
  }

  const handleDragStart = () => {
    setShowOnBoarding(false)
    onInteraction('drag')
    playMouseIn()
  }

  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#F1EDFF',
        id: '037_01_PR',
        onEvent,
        className,
      }}
    >
      <Header backgroundColor="#FAF2FF" buttonColor="rgb(234, 204, 255,0  )">
        <div
          style={{
            color: '#444',
            fontFamily: 'Nunito',
            fontSize: '20px',
            fontWeight: '700',
            margin: '0',
            maxWidth: '600px',
            textAlign: 'center',
          }}
        >
          Drag shapes onto the grid to create a composite shape of area of {randArea} squares.
        </div>
      </Header>

      <div style={{ position: 'absolute', top: '20px' }}>
        <div
          style={{
            display: 'flex',
            gap: '20px',
            justifyContent: 'center',
            width: '720px',
            marginTop: '80px',
            position: 'absolute',
          }}
        >
          {grayShapes.map((shape) => (
            <img key={shape} src={shape} alt="" />
          ))}
        </div>

        <DndContext
          onDragEnd={handleDragEnd}
          onDragOver={showOverlay}
          onDragStart={handleDragStart}
          // collisionDetection={closestCenter}
        >
          <div
            style={{
              display: 'flex',
              gap: '20px',
              justifyContent: 'center',
              width: '720px',
              marginTop: '80px',
              position: 'absolute',
            }}
          >
            {shapes.map((shape) => (
              <Shapes
                key={shape.id}
                id={shape.id}
                src={shape.shapeSource}
                name={shape.name}
                isReplica={false}
              />
            ))}
          </div>
          <div style={{ position: 'absolute', top: '200px' }}>
            <Grid
              cellWidth={gridProps.cellWidth}
              cellHeight={gridProps.cellHeight}
              rows={gridProps.rows}
              columns={gridProps.columns}
              focusColor={focusColor}
            />
          </div>
          <div
            style={{
              position: 'absolute',
              top: '200px',
              width: `${gridProps.cellWidth * gridProps.columns}px`,
              height: `${gridProps.cellHeight * gridProps.rows}px`,
              left: '72px',
            }}
          >
            {newShapes.map((item: ShapesProps) => (
              <div
                key={item.id}
                style={{
                  position: 'absolute',
                  left: `${item.position.x}px`,
                  top: `${item.position.y}px`,
                }}
              >
                <Shapes
                  key={item.id}
                  id={item.id}
                  src={item.shapeSource}
                  name={item.name}
                  isReplica={true}
                />
              </div>
            ))}
          </div>
        </DndContext>
      </div>

      {showAreaPopUp && <PopUp onclick={areaPopCloseHandle} message={disclaimerMessages[0]} />}
      {showShapeWarning && <PopUp onclick={shapePopCloseHandle} message={disclaimerMessages[1]} />}

      <Button
        style={{
          height: '40px',
          width: '100px',
          fontSize: '16px',
          lineHeight: '24px',
          bottom: '32px',
        }}
        onClick={checkArea}
      >
        Check
      </Button>
      {playSuccessAnimation && <GeogebraPlayer src={successAnimation} autoplay loop={false} />}
      {showOnBording && (
        <PlayerContainer
          src={animationSequence[index]}
          top={transitionState.top}
          left={transitionState.left}
          autoplay
          loop
        />
      )}
      {showReplayBtn && (
        <>
          <Button
            style={{
              height: '40px',
              width: '100px',
              fontSize: '16px',
              lineHeight: '24px',
              bottom: '32px',
            }}
            onClick={restart}
          >
            Try again
          </Button>
          {/* <RestartButton onClick={restart} /> */}
        </>
      )}
    </AppletContainer>
  )
}

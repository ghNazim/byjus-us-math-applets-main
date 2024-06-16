import { useDroppable } from '@dnd-kit/core'
import { useEffect, useState } from 'react'

interface GridProps {
  cellWidth: number
  cellHeight: number
  rows: number
  columns: number
  focused?: number[]
  highlightArray: Array<string>
  isDragging?: boolean
}
interface PosData {
  id: string
  left: number
  top: number
}
//this cell is outside the boundary and doesn't exist
const gridCellOutside: PosData = { id: 'cell-outside', left: -1, top: -1 }
//dynamic droppable element
function Droppable(prop: any) {
  const { setNodeRef, rect } = useDroppable({
    id: prop.id,
  })
  return (
    <div
      style={{
        position: 'absolute',
        left: `${prop.x}px`,
        top: `${prop.y}px`,
        width: `${prop.cellWidth}px`,
        height: `${prop.cellHeight}px`,
      }}
      ref={setNodeRef}
    >
      {prop.children}
    </div>
  )
}
//this array is used to export the poisition data of each droppable according
//to the id of droppable
const posData: PosData[] = []
//to get gridPos to snap it to the grid in applet
export const getGridPos = (id: string): PosData => {
  const result = posData.find((element) => element.id === id)
  return result ? result : gridCellOutside
}
export const getGridId = (x: number, y: number): PosData => {
  const result = posData.find((element) => element.left === x && element.top === y)
  return result ? result : gridCellOutside
}
const gridCellFocus = {}
const Grid = (gridProps: GridProps) => {
  const [cellFocused, setCellFocused] = useState(Array.from({ length: 120 }, () => false))
  const grid = {
    rows: gridProps.rows,
    cols: gridProps.columns,
    cellWidth: gridProps.cellWidth,
    cellHeight: gridProps.cellHeight,
    left: (720 - gridProps.columns * gridProps.cellWidth) / 2,
    width: gridProps.columns * gridProps.cellWidth,
    height: gridProps.rows * gridProps.cellHeight,
    getCellPosition(row: number, col: number) {
      return {
        x: col * this.cellWidth,
        y: row * this.cellHeight,
      }
    },
    snapToGrid(x: number, y: number) {
      return {
        x: Math.round(x / this.cellWidth) * this.cellWidth,
        y: Math.round(y / this.cellHeight) * this.cellHeight,
      }
    },
  }
  //this will make the posData arr
  const makePosDataArr = () => {
    //console.log('making posdata array')
    for (let row = 0; row < grid.rows; row++) {
      for (let col = 0; col < grid.cols; col++) {
        const { x, y } = grid.getCellPosition(row, col)
        const id = `cell-${row}-${col}`
        posData.push({ id: id, left: x, top: y })
      }
    }
  }
  useEffect(() => {
    makePosDataArr()
  }, [])

  return (
    <div
      style={{
        top: '100px',
        display: 'flex',
        flexDirection: 'row',
        position: 'absolute',
        left: grid.left,
        width: grid.width,
        height: grid.height,
      }}
    >
      {[...Array(grid.rows * grid.cols)].map((_, i) => {
        const row = Math.floor(i / grid.cols)
        const col = i % grid.cols
        const { x, y } = grid.getCellPosition(row, col)
        const id = `cell-${row}-${col}`
        return (
          <Droppable
            id={id}
            key={id}
            x={x}
            y={y}
            cellWidth={grid.cellWidth}
            cellHeight={grid.cellHeight}
          >
            <div
              style={{
                position: 'absolute',
                width: grid.cellWidth,
                height: grid.cellHeight,
                border: '0.5px solid rgba(188, 211, 255, 1)',
                boxSizing: 'border-box',
                backgroundColor:
                  gridProps.isDragging && gridProps.highlightArray.includes(id)
                    ? 'rgba(202,166,237,0.5)'
                    : 'white',
              }}
            />
          </Droppable>
        )
      })}
    </div>
  )
}
export default Grid

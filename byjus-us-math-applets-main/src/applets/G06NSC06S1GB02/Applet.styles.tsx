import { boolean } from 'mathjs'
import styled from 'styled-components'

import Draggable from './components/Draggable'
import InputContainer from './components/InputContainer'

export const DraggableItem = styled(Draggable)`
  background-color: white;
  border: 1px solid var(--interactives-300, #c7c7c7);
  box-shadow: 0px -4px 0px 0px #c7c7c7 inset;
  font-family: Nunito;
  user-select: none;
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  padding: 10px 20px;
  cursor: grab;
  border-radius: 5px;
  :active {
    cursor: grabbing;
  }
  justify-content: center;
  align-items: center;
  display: flex;
`
export const DraggableContainer = styled.div`
  position: absolute;
  bottom: 120px;
  width: 100%;
  display: flex;
  justify-content: center;
  z-index: 30;

  align-content: center;
  justify-content: center;
  gap: 20px;
`

export const Inputs = styled(InputContainer)`
  position: absolute;
  top: 300px;
`
export const Bg = styled.div<{ isAnswerCorrect: boolean | null }>`
  position: absolute;
  width: 96%;
  margin: 0 2%;
  background-color: ${(a) =>
    a.isAnswerCorrect === null ? '#f3f7fe' : a.isAnswerCorrect ? '#ECFFD9' : '#FFECF1'};
  height: 50%;
  top: 100px;
  z-index: -100;
  user-select: none;
`
export const ButtonHolder = styled.div`
  position: absolute;
  width: 100%;
  display: flex;
  justify-content: center;
  bottom: 50px;
`
export const Button = styled.div<{ disabled: boolean }>`
  opacity: ${(a) => (a.disabled ? 0.3 : 1)};
  background-color: #1a1a1a;
  color: white;
  padding: 10px 20px;
  font-family: Nunito;
  font-size: 24px;
  font-weight: 700;
  line-height: 32px;
  letter-spacing: 0px;
  text-align: center;
  border-radius: 10px;
  cursor: ${(a) => (a.disabled ? 'default' : 'pointer')};
  display: flex;
  gap: 5px;
  justify-content: center;
  align-items: center;
`
export const BottomText = styled.div<{ bottom?: number }>`
  font-family: Nunito;
  font-size: 24px;
  font-weight: 700;
  line-height: 32px;
  letter-spacing: 0px;
  text-align: center;
  position: absolute;
  /* bottom: 150px; */
  bottom: ${(a) => (a.bottom ? a.bottom : 150)}px;
  width: 100%;
  color: #444444;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 0 10%;
`
export const AnimatedFactorTreeContainer = styled.div`
  position: absolute;
  display: grid;
  grid-template-columns: auto auto;
  height: 60%;
  top: 100px;
  width: 100%;
  /* background-color: red; */
  justify-content: flex-start;
  align-items: center;
`

export const AdjustableBoxWIthPosAndSize = styled.div<{
  left: number
  top: number
  width: number
  height: number
}>`
  position: absolute;
  width: ${(a) => a.width}px;
  height: ${(a) => a.height}px;
  left: ${(a) => a.left}px;
  top: ${(a) => a.top}px;
  /* border: 1px solid red; */
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 5px;
`

export const ColoredSpan = styled.span<{ color: string; bgColor: string }>`
  background-color: ${(a) => a.bgColor};
  color: ${(a) => a.color};
  padding: 3px 8px;
  border-radius: 5px;
`
export const DroppableCanvas = styled.div<{ moveUp?: boolean }>`
  width: 100%;
  display: flex;
  /* justify-content: center; */
  margin-left: 13%;
  position: absolute;
  top: ${(a) => (a.moveUp ? 150 : 230)}px;
  left: 50px;
  scale: 0.9;

  user-select: none;
`
export const Label = styled.div<{ left: number; top: number }>`
  position: absolute;
  left: ${(a) => a.left}px;
  top: ${(a) => a.top}px;
  z-index: 20;
  font-family: Nunito;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
`
export const TableHolder = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  top: 120px;
  width: 100%;
`
export const Table = styled.div`
  display: flex;
  background-color: #ececec;
  color: #444;
  border-radius: 5px;
  flex-direction: column;
  border: 1px solid var(--monotone-100, #444);
`
export const Row = styled.div`
  border: 1px solid var(--monotone-100, #444);
  font-family: Nunito;
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: 32px;
  padding: 5px 10px;
  text-align: left;
`
export const Cell = styled.span<{ isCommon: boolean; placed: boolean }>`
  color: ${(a) => (a.placed ? (a.isCommon ? '#1CB9D9' : 'inherit') : 'inherit')};
  opacity: ${(a) => (a.placed ? 0.5 : 1)};
`

export const Container = styled.div`
  display: flex;
  position: absolute;
  justify-content: center;
  align-items: center;
  z-index: 10;
`
export const InvisibleBoxes = styled.div<{
  width: number
  height?: number
  isMiddle?: boolean
  numberOfElements: number
}>`
  width: ${(a) => a.width}px;
  height: ${(a) => (a.height ? a.height : 250)}px;
  /* background-color: red; */
  /* opacity: 0.4; */
  /* border: 1px solid black; */
  position: relative;
  display: ${(a) => (a.numberOfElements > 3 ? 'grid' : 'flex')};
  flex-direction: column;
  grid-template-rows: ${(a) => `repeat(${Math.ceil(a.numberOfElements / 2)}, 1fr)`};
  grid-template-columns: repeat(2, 1fr);
  align-content: space-evenly;
  padding: 50px 20px;
  justify-content: ${(a) => (a.numberOfElements > 3 ? 'center' : 'space-evenly')};

  user-select: none;
`
export const ShapesAfterPlacing = styled.div<{
  move: boolean
  isRightSide?: boolean
  isGrid: boolean
  isMiddle: boolean
  middleColor: string
  sideTextColor: string
}>`
  z-index: 10;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-left: ${(a) => (a.move ? (a.isRightSide ? 20 : 30) : 0)}px;
  font-family: Nunito;
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  color: ${(a) => (a.isMiddle ? `${a.middleColor}` : `${a.sideTextColor}`)};
  /* color: ${(a) => (a.isMiddle ? '#1CB9D9' : '#646464')}; */
`

export const TextHolder = styled.div<{ top: number }>`
  position: absolute;
  top: ${(a) => a.top}px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: 1rem;
  width: 100%;
  //styleName: Sub heading/Bold;
  font-family: Nunito;
  font-size: 20px;
  font-weight: 700;
  line-height: 28px;
  letter-spacing: 0px;
  text-align: center;
`

export const ColoredSpanWithBorder = styled.span<{ color: string; bgColor: string }>`
  background-color: ${(a) => a.bgColor};
  color: ${(a) => a.color};
  padding: 3px 8px;
  border-radius: 5px;
  border: ${(a) => `2px solid ${a.color}`};
  font-size: 24px;
`

export const RowFlexBox = styled.div`
  display: flex;
  gap: 5px;
  align-items: center;
`
export const ColumnFlexBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`

export const ToggleHolder = styled.div`
  position: absolute;
  bottom: 130px;
  width: 100%;
  display: flex;
  justify-content: center;
`

export const ToggleContainer = styled.div`
  font-family: Nunito;
  font-size: 20px;
  font-weight: 700;
  line-height: 28px;
  letter-spacing: 0px;
  text-align: center;
  border: 1px solid #1a1a1a;
  border-radius: 9px;
  display: flex;
  /* gap: 3px; */
`
export const Toggle = styled.div<{ isActive: boolean }>`
  margin: 4px;
  background-color: ${(a) => (a.isActive ? '#1a1a1a' : 'white')};
  color: ${(a) => (a.isActive ? 'white' : '#646464')};
  font-weight: ${(a) => (a.isActive ? 700 : 400)};
  transition: all cubic-bezier(0.215, 0.61, 0.355, 1) 0.3s;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
`

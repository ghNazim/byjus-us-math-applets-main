import { useEffect, useState } from 'react'
import styled from 'styled-components'

import btn0 from './0btn.svg'
import warn0 from './0warn.svg'
import btn1 from './1btn.svg'
import warn1 from './1warn.svg'
import btn2 from './2btn.svg'
import warn2 from './2warn.svg'
import btn3 from './3btn.svg'
import warn3 from './3warn.svg'
import gridSvg from './grid.svg'
import svRectangle from './sv-Rectangle.svg'
import svSquare from './sv-Square.svg'
import svTriangle from './sv-Triangle.svg'
import svTriangleInv from './sv-TriangleInv.svg'
import svTriangleLeft from './sv-TriangleLeft.svg'
import svTriangleRight from './sv-TriangleRight.svg'
import trysvg from './tryNew.svg'

export const btnImages = [btn0, btn1, btn2, btn3]
export const warnImages = [warn0, warn1, warn3, warn2]
export const grid = gridSvg
export const trySvg = trysvg
export const warnMessages = [
  'A cube has 6 square faces.',
  'A triangular prism has 3 rectangular faces and 2 triangular faces.',
  'A square pyramid has 1 square face and 4 triangular faces.',
  'A rectangular prism has 6 rectangular faces.',
]

interface ButtonProps {
  borderCol: string
  insideCol: string
  shadowColor: string
  disabled: boolean
}

declare global {
  interface Array<T> {
    getRandomAndRemove(): T | undefined
    removeArrayFromArray(arr: T[]): T[]
    containsAll(arr: T[]): boolean
    containsAny(arr: T[]): boolean
  }
}

Array.prototype.getRandomAndRemove = function <T>() {
  if (this.length === 0) {
    return undefined
  }

  const randomIndex = Math.floor(Math.random() * this.length)
  const removedElement = this.splice(randomIndex, 1)[0]
  return removedElement
}

Array.prototype.containsAll = function <T>(array: T[]): boolean {
  for (let i = 0; i < array.length; i++) {
    if (this.indexOf(array[i]) === -1) {
      return false
    }
  }
  return true
}

Array.prototype.containsAny = function <T>(array: T[]): boolean {
  for (let i = 0; i < array.length; i++) {
    if (this.includes(array[i])) {
      return true
    }
  }
  return false
}

Array.prototype.removeArrayFromArray = function <T>(array: T[]): T[] {
  for (let i = 0; i < array.length; i++) {
    const index = this.indexOf(array[i])
    if (index !== -1) {
      this.splice(index, 1)
    }
  }
  return this
}

Image.prototype.rotateBy = function (angle: number) {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  canvas.height = this.height
  canvas.width = this.width
  ctx?.translate(this.width / 2, this.height / 2)
  ctx?.rotate(angle)
  ctx?.drawImage(this, -this.with / 2, -this.height / 2)
  return canvas.toDataURL()
}

const unclickedButton: ButtonProps = {
  borderCol: 'C882FA',
  insideCol: 'fff',
  shadowColor: 'fff',
  disabled: false,
}

const clickedButton: ButtonProps = {
  borderCol: 'C882FA',
  insideCol: 'FAF2FF',
  shadowColor: 'ccc',
  disabled: false,
}

const rightAnsButton: ButtonProps = {
  borderCol: '85CC29',
  insideCol: 'ECFFD9',
  shadowColor: 'ccc',
  disabled: true,
}

const wrongAnsButton: ButtonProps = {
  borderCol: 'F57A7A',
  insideCol: 'FFF2F2',
  shadowColor: 'ccc',
  disabled: true,
}

const StyledDiv = styled.div<ButtonProps>`
  width: 120px;
  height: 120px;
  margin-top: 470px;
  border: 5px solid #${(props) => props.borderCol};
  border-radius: 20px;
  background-color: #${(props) => props.insideCol};
  box-shadow: 0px 10px 15px #${(props) => props.shadowColor};
  cursor: pointer;
`

const InsideImg = styled.img`
  width: 90px;
  height: 90px;
  margin-top: 10px;
  margin-left: 10px;
`

const ButtonBase = (props: {
  onClick: any
  data: { btnNumber: number; currentSel: number }
  buttonState: number
}) => {
  const [clicked, setClicked] = useState(false)
  const [buttonConfig, setButtonConfig] = useState(unclickedButton)

  useEffect(() => {
    if (props.data.btnNumber === props.data.currentSel) {
      setClicked(true)
      ColorSetter(props.buttonState)
    } else {
      setClicked(false)
      setButtonConfig(unclickedButton)
    }
  }, [props.data.currentSel])

  const ColorSetter = (props: any) => {
    // console.log(props)
    switch (props) {
      case 0:
        setButtonConfig(unclickedButton)
        break
      case 1:
        setButtonConfig(clickedButton)
        break
      case 2:
        setButtonConfig(rightAnsButton)
        break
      case 3:
        setButtonConfig(wrongAnsButton)
        break
    }
  }

  return (
    <StyledDiv
      className="Box"
      borderCol={buttonConfig.borderCol}
      insideCol={buttonConfig.insideCol}
      shadowColor={buttonConfig.shadowColor}
      disabled={buttonConfig.disabled}
      onClick={() => {
        props.onClick(props.data.btnNumber)
      }}
    >
      <InsideImg src={btnImages[props.data.btnNumber]} />
    </StyledDiv>
  )
}

export default ButtonBase

const qn0Svgs = [
  {
    id: 'square-0-0',
    name: 'square',
    shapeSource: svSquare,
    order: 1,
    position: {},
    top: 280,
    left: 210,
    width: 2,
    height: 2,
    angle: '0',
    leftOffset: 0,
    topOffset: 0,
  },
  {
    id: 'square-0-1',
    name: 'square',
    shapeSource: svSquare,
    order: 1,
    position: {},
    top: 140,
    left: 140,
    width: 2,
    height: 2,
    angle: '0',
    leftOffset: 0,
    topOffset: 0,
  },
  {
    id: 'square-0-2',
    name: 'square',
    shapeSource: svSquare,
    order: 1,
    position: {},
    top: 280,
    left: 350,
    width: 2,
    height: 2,
    angle: '0',
    leftOffset: 0,
    topOffset: 0,
  },
  {
    id: 'square-0-3',
    name: 'square',
    shapeSource: svSquare,
    order: 1,
    position: {},
    top: 70,
    left: 385,
    width: 2,
    height: 2,
    angle: '0',
    leftOffset: 0,
    topOffset: 0,
  },
  {
    id: 'square-0-4',
    name: 'square',
    shapeSource: svSquare,
    order: 1,
    position: {},
    top: 35,
    left: 35,
    width: 2,
    height: 2,
    angle: '0',
    leftOffset: 0,
    topOffset: 0,
  },
  {
    id: 'square-0-5',
    name: 'square',
    shapeSource: svSquare,
    order: 1,
    position: {},
    top: 105,
    left: 245,
    width: 2,
    height: 2,
    angle: '0',
    leftOffset: 0,
    topOffset: 0,
  },
]

const qn1Svgs = [
  {
    id: 'square-1-0',
    name: 'square',
    shapeSource: svRectangle,
    order: 1,
    position: {},
    top: 175,
    left: 350,
    width: 2,
    height: 4,
    angle: '0',
    leftOffset: 0,
    topOffset: 0,
  },
  {
    id: 'square-1-1',
    name: 'square',
    shapeSource: svRectangle,
    order: 1,
    position: {},
    top: 175,
    left: 210,
    width: 2,
    height: 4,
    angle: '0',
    leftOffset: 0,
    topOffset: 0,
  },
  {
    id: 'square-1-2',
    name: 'square',
    shapeSource: svRectangle,
    order: 1,
    position: {},
    top: 70,
    left: 70,
    width: 2,
    height: 4,
    angle: '0',
    leftOffset: 0,
    topOffset: 0,
  },
  {
    id: 'triangle-1-3',
    name: 'triangle',
    shapeSource: svTriangle,
    order: 1,
    position: {},
    top: 70,
    left: 350,
    width: 2,
    height: 2,
    angle: '0',
    leftOffset: 0,
    topOffset: 14,
  },
  {
    id: 'triangle-1-4',
    name: 'triangle',
    shapeSource: svTriangleInv,
    order: 1,
    position: {},
    top: 70,
    left: 175,
    width: 2,
    height: 2,
    angle: '0',
    leftOffset: 0,
    topOffset: 0,
  },
]

const qn2Svgs = [
  {
    id: 'triangle-2-0',
    name: 'triangle',
    shapeSource: svTriangleLeft,
    order: 1,
    position: {},
    top: 70,
    left: 350,
    width: 2,
    height: 2,
    angle: '0',
    leftOffset: 14,
    topOffset: 0,
  },
  {
    id: 'triangle-2-1',
    name: 'triangle',
    shapeSource: svTriangleInv,
    order: 1,
    position: {},
    top: 210,
    left: 210,
    width: 2,
    height: 2,
    angle: '0',
    leftOffset: 0,
    topOffset: 0,
  },
  {
    id: 'triangle-2-2',
    name: 'triangle',
    shapeSource: svTriangleRight,
    order: 1,
    position: {},
    top: 70,
    left: 70,
    width: 2,
    height: 2,
    angle: '0',
    leftOffset: 0,
    topOffset: 0,
  },
  {
    id: 'triangle-2-3',
    name: 'triangle',
    shapeSource: svTriangle,
    order: 1,
    position: {},
    top: 70,
    left: 210,
    width: 2,
    height: 2,
    angle: '0',
    leftOffset: 0,
    topOffset: 14,
  },
  {
    id: 'square-2-4',
    name: 'square',
    shapeSource: svSquare,
    order: 1,
    position: {},
    top: 280,
    left: 280,
    width: 2,
    height: 2,
    angle: '90',
    leftOffset: 0,
    topOffset: 0,
  },
]

const qn3Svgs = [
  {
    id: 'rectangle-3-0',
    name: 'rectangle',
    shapeSource: svRectangle,
    order: 1,
    position: {},
    top: 70,
    left: 70,
    width: 4,
    height: 2,
    angle: '90',
    leftOffset: 0,
    topOffset: 0,
  },
  {
    id: 'rectangle-3-1',
    name: 'rectangle',
    shapeSource: svRectangle,
    order: 1,
    position: {},
    top: 245,
    left: 70,
    width: 4,
    height: 2,
    angle: '90',
    leftOffset: 0,
    topOffset: 0,
  },
  {
    id: 'rectangle-3-2',
    name: 'rectangle',
    shapeSource: svRectangle,
    order: 1,
    position: {},
    top: 105,
    left: 350,
    width: 4,
    height: 2,
    angle: '90',
    leftOffset: 0,
    topOffset: 0,
  },
  {
    id: 'rectangle-3-3',
    name: 'rectangle',
    shapeSource: svRectangle,
    order: 1,
    position: {},
    top: 245,
    left: 280,
    width: 4,
    height: 2,
    angle: '90',
    leftOffset: 0,
    topOffset: 0,
  },
  {
    id: 'square-3-4',
    name: 'square',
    shapeSource: svSquare,
    order: 1,
    position: {},
    top: 35,
    left: 350,
    width: 2,
    height: 2,
    angle: '90',
    leftOffset: 0,
    topOffset: 0,
  },
  {
    id: 'square-3-5',
    name: 'square',
    shapeSource: svSquare,
    order: 1,
    position: {},
    top: 280,
    left: 490,
    width: 2,
    height: 2,
    angle: '90',
    leftOffset: 0,
    topOffset: 0,
  },
]

const shapes = [qn0Svgs, qn1Svgs, qn2Svgs, qn3Svgs]
export const getQuestionShapes = (q: number) => {
  return shapes[q].map((x) => ({ ...x }))
}

import { DndContext, DragEndEvent } from '@dnd-kit/core'
import { useCallback, useEffect, useState } from 'react'
import styled, { keyframes } from 'styled-components'

import { PageControl } from '@/common/PageControl'
import { useInterval } from '@/hooks/useInterval'

import ArrowBlue from './assets/Arrow 2.svg'
import ArrowOrange from './assets/ArrowOrange.svg'
import DragAndDropAnimation from './Components/DragAndDropAnimation'
import Draggable from './Components/Draggable'
import Droppable from './Components/Droppable'
import ResizableBoxes from './Components/ResizableBoxes'

const BoxHolder = styled.div`
  display: flex;
  gap: 20px;
  justify-content: center;
  width: 720px;
  height: 80px;
  margin-top: 80px;
  position: absolute;
  top: 480px;
`

interface Boxprops {
  left: number
  top: number
  value: string
  width: number
  height: number
  color: string
  opacity: number
  canInteract?: boolean
  changeShown?: boolean
  isReplicable?: boolean
}

const DropWrapper = styled.div`
  position: absolute;
  width: 682px;
  height: 266px;
  left: 19px;
  top: 202px;

  border: 1px solid #c7c7c7;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-around;
  pointer-events: none;
`

const EquationWrapper = styled.div`
  position: absolute;
  width: 219px;
  height: 40px;
  left: 251px;
  top: 130px;

  /* Heading 3/Regular */

  font-family: 'Nunito';
  font-style: normal;
  font-weight: 400;
  font-size: 28px;
  line-height: 40px;
  /* identical to box height, or 143% */

  text-align: center;

  /* Monotone/100 */

  color: #444444;
`

const Equation = styled.div<{ top: number }>`
  position: absolute;
  width: 200px;
  top: ${(prop) => prop.top}px;
  /* padding: 10px 80px; */
  font-size: 28px;
  text-align: center;
  /* background-color: red; */
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 400;
`

const Infotext = styled.div`
  position: absolute;
  width: 573px;
  height: 44px;
  left: 74px;
  top: 580px;

  font-family: 'Nunito';
  font-style: normal;
  font-weight: 400;
  font-size: 20px;
  line-height: 28px;
  /* or 140% */

  text-align: center;

  color: #444444;
  pointer-events: none;
`

const AnimatedLines = styled.div<{ height: number; left: number }>`
  border: 1px dashed #1cb9d9;
  width: 0px;
  position: absolute;
  left: ${(props) => props.left}px;
  top: 245px;
  height: ${(props) => props.height}px;
`

const SolutionBoxArray = [
  {
    left: 84,
    top: 245,
    value: 'x',
    width: 100,
    height: 74,
    color: '#A6F0FF',
    opacity: 1,
  },
  {
    left: 184,
    top: 245,
    value: 'x',
    width: 100,
    height: 74,
    color: '#A6F0FF',
    opacity: 1,
  },
  {
    left: 284,
    top: 245,
    value: 'x',
    width: 100,
    height: 74,
    color: '#A6F0FF',
    opacity: 1,
  },
  {
    left: 384,
    top: 245,
    value: 'x',
    width: 100,
    height: 74,
    color: '#A6F0FF',
    opacity: 1,
  },
  {
    left: 84,
    top: 364,
    value: '6',
    width: 100,
    height: 74,
    color: '#FFD2A6',
    opacity: 1,
  },
  {
    left: 184,
    top: 364,
    value: '6',
    width: 100,
    height: 74,
    color: '#FFD2A6',
    opacity: 1,
  },
  {
    left: 284,
    top: 364,
    value: '6',
    width: 100,
    height: 74,
    color: '#FFD2A6',
    opacity: 1,
  },
  {
    left: 384,
    top: 364,
    value: '6',
    width: 100,
    height: 74,
    color: '#FFD2A6',
    opacity: 1,
  },
]

const IntitalBoxArray = [
  {
    left: 84,
    top: 245,
    value: 'x',
    width: 100,
    height: 74,
    color: '#A6F0FF',
    opacity: 1,
  },
  {
    left: 184,
    top: 245,
    value: 'x',
    width: 100,
    height: 74,
    color: '#A6F0FF',
    opacity: 1,
  },
  {
    left: 284,
    top: 245,
    value: 'x',
    width: 100,
    height: 74,
    color: '#A6F0FF',
    opacity: 1,
  },
  {
    left: 384,
    top: 245,
    value: 'x',
    width: 100,
    height: 74,
    color: '#A6F0FF',
    opacity: 1,
  },
  {
    left: 84,
    top: 364,
    value: '24',
    width: 400,
    height: 74,
    color: '#FFD2A6',
    opacity: 1,
  },
]

interface questtionProp {
  reset: () => void
}

const ArrowAnimation = keyframes`
      0%{
    scale: 0;
  }
  100%{
    scale:1;
  }
`

const ArrowHolder = styled.img<{ top: number }>`
  position: absolute;
  top: ${(prop) => prop.top}px;
  left: 84px;
  width: 400px;
  animation: ${ArrowAnimation} 0.8s ease-in;
`

const question = [0, 4, 24] //4x =24
const DROPPABLE_WIDTH = 400
const DROPPABLE_HEIGHT = 70
const DROPPABLE_LHS_LEFT = 84
const DROPPABLE_LHS_TOP = 245
const DROPPABLE_RHS_LEFT = 84
const DROPPABLE_RHS_TOP = 364

export const Question2 = (props: questtionProp) => {
  const [newBoxes, setNewBoxes] = useState<Boxprops[]>([])
  const [currentEquationIndex, setCurrentEquationIndex] = useState(1)
  const [infoText, setInfoText] = useState('')

  const [showEqualTerms, setShowEquaTerms] = useState(true)
  const [currenPageNumber, setCurrenPageNumber] = useState(0)
  const [xIndex, setXIndex] = useState(0) //when xCoefficient is more than 1
  const currentQuestion = question
  const [currentHeightDashed, setCurrentHeightDashed] = useState(0)
  const [lhsText, setLhsText] = useState('---')
  const [rhsText, setRhsText] = useState('---')

  const retry = () => {
    props.reset()
    setNewBoxes([])
    setCurrentEquationIndex(1)
    setInfoText('')
    setShowEquaTerms(true)
    setCurrenPageNumber(0)
    setXIndex(0)
    setCurrentHeightDashed(0)
  }

  const calcWidth = (a: number) => {
    return DROPPABLE_WIDTH / (a + 1)
  }

  const calcLeft = (a: number) => {
    return DROPPABLE_LHS_LEFT + a * calcWidth(a)
  }

  const rearrangeBoxes = () => {
    let newLeft = DROPPABLE_RHS_LEFT
    const nwWidth = calcWidth(xIndex)

    if (xIndex < 5) {
      setNewBoxes((prevVal) => {
        return prevVal.map((box) => {
          box.width = nwWidth
          box.left = newLeft
          newLeft += nwWidth
          return { ...box }
        })
      })
    }
  }

  const handleDragEnd = (e: DragEndEvent) => {
    const over = e.over?.id
    const activeBox = e.active.data.current ? e.active.data.current.equationSide : undefined
    const value = String(e.active.id)[1] //need to change
    const isVariable = isNaN(parseInt(value))
    const opacity = 1

    if (over === activeBox) {
      if (!isVariable) {
        const width = DROPPABLE_WIDTH
        const left = DROPPABLE_LHS_LEFT
        const top = activeBox === 'LHS' ? DROPPABLE_LHS_TOP : DROPPABLE_RHS_TOP
        const height = DROPPABLE_HEIGHT + 4
        const color = activeBox === 'LHS' ? '#A6F0FF' : '#FFD2A6'
        const newBox: Boxprops = {
          left: left,
          top: top,
          value: String(e.active.id),
          width: width,
          height: height,
          color: color,
          opacity: opacity,
        }
        setNewBoxes((prevVal) => [...prevVal, newBox])

        setCurrentEquationIndex((prevNum) => prevNum + 1)
      } else {
        setXIndex((prevVal) => prevVal + 1)
        const width = calcWidth(xIndex)
        const left = calcLeft(xIndex)
        const top = activeBox === 'LHS' ? DROPPABLE_LHS_TOP : DROPPABLE_RHS_TOP
        const height = DROPPABLE_HEIGHT + 4
        const color = activeBox === 'LHS' ? '#A6F0FF' : '#FFD2A6'

        const newBox: Boxprops = {
          left: left,
          top: top,
          value: value,
          width: width,
          height: height,
          color: color,
          opacity: opacity,
        }
        setNewBoxes((prevVal) => [...prevVal, newBox])
        if (xIndex === 3) setCurrentEquationIndex((prevNum) => prevNum + 1)
        rearrangeBoxes()
      }
    }
  }

  const showDivision = () => {
    setNewBoxes(SolutionBoxArray)
  }

  useEffect(() => {
    let intervel: NodeJS.Timer
    switch (currenPageNumber) {
      case 0:
        setLhsText(() => {
          if (xIndex > 0) return `${xIndex > 1 ? xIndex : ''}x`
          else return '---'
        })
        setRhsText(() => {
          if (currentEquationIndex === 3) {
            return `${currentQuestion[2]}`
          } else {
            return '---'
          }
        })
        break
      case 1:
        setNewBoxes(IntitalBoxArray)
        setCurrentHeightDashed(0)
        intervel = setInterval(() => {
          setInfoText('Note that the length of the tapes are equal.')
        }, 800)
        break
      case 2:
        setNewBoxes(IntitalBoxArray)
        setInfoText(
          "As the equation's left side contains 4 x's, we can divide 24 into 4 equal parts accordingly.",
        )
        break
      case 3:
        setLhsText('4x')
        setRhsText('24')
        showDivision()
        setNewBoxes((prevBoxes) => {
          //dehighlighting of box when reversing
          return prevBoxes.map((box, i) => {
            if (i === 0) {
              box.color = '#A6F0FF'
              return { ...box }
            } else if (i === 4) {
              box.color = '#FFD2A6'
              return { ...box }
            }
            return { ...box }
          })
        })
        break
      case 4:
        setLhsText('x')
        setRhsText('6')
        setInfoText('Length of x is 6.')
        setNewBoxes((prevBoxes) => {
          //highlighting of boxes
          return prevBoxes.map((box, i) => {
            if (i === 0) {
              box.color = '#2AD3F5'
              return { ...box }
            } else if (i === 4) {
              box.color = '#FF8F1F'
              return { ...box }
            }
            return { ...box }
          })
        })
        break
      default:
        setInfoText('')
        break
    }
    return () => clearInterval(intervel)
  }, [currenPageNumber, xIndex, currentEquationIndex, currentQuestion])

  const handlePageChange = useCallback((e: number) => {
    setCurrenPageNumber(e)
  }, [])

  const handleNextDisabled = () => {
    switch (currenPageNumber) {
      case 0:
        return newBoxes.length < 5
      case 2:
        return currentHeightDashed + 2 <= DROPPABLE_RHS_TOP - DROPPABLE_LHS_TOP + DROPPABLE_HEIGHT
      default:
        return false
    }
  }

  useInterval(
    () => {
      setCurrentHeightDashed((prevVal) => prevVal + 5)
    },
    currenPageNumber === 2
      ? currentHeightDashed < DROPPABLE_RHS_TOP - DROPPABLE_LHS_TOP + DROPPABLE_HEIGHT
        ? 50
        : null
      : null,
  )

  const fontColor = (boxColor: string) => {
    switch (boxColor) {
      case '#FFD2A6':
        return `#D97A1A`
      case '#A6F0FF':
        return '#1CB9D9'
      case '#2AD3F5':
        return 'white'
      case '#FF8F1F':
        return 'white'
      default:
        return '#444'
    }
  }

  return (
    <>
      <DndContext onDragEnd={handleDragEnd}>
        {showEqualTerms ? (
          <>
            {' '}
            <Droppable
              id="LHS"
              left={DROPPABLE_LHS_LEFT}
              top={DROPPABLE_LHS_TOP}
              isActive={currentEquationIndex !== 2}
              color="#E7FBFF"
            />
            <Droppable
              id="RHS"
              left={DROPPABLE_RHS_LEFT}
              top={DROPPABLE_RHS_TOP}
              isActive={currentEquationIndex === 2}
              color="#E7FBFF"
            />
          </>
        ) : undefined}
        {newBoxes.map((box, i) => (
          <ResizableBoxes
            key={i}
            left={box.left}
            top={box.top}
            color={box.color}
            width={box.width}
            height={box.height}
            value={box.value}
            canInteract={box.canInteract}
            onClick={() => {
              if (box.canInteract) setShowEquaTerms(false)
            }}
            show={box.canInteract ? showEqualTerms : true}
            fontColor={fontColor(box.color)}
          />
        ))}
        <BoxHolder>
          <Draggable
            xCoefficient={4 - xIndex}
            equationSide="LHS"
            isActive={currentEquationIndex === 1}
            id="4x"
            width={100}
            color="#A6F0FF"
            isVisible={xIndex < 4}
            fontColor={currentEquationIndex === 1 ? '#1CB9D9' : '#C7C7C7'}
          />
          <Draggable
            equationSide="RHS"
            isActive={currentEquationIndex === 2}
            id="24"
            width={300}
            value={24}
            color="#FFD2A6"
            isVisible={currentEquationIndex < 3}
            fontColor={currentEquationIndex === 2 ? '#D97A1A' : '#C7C7C7'}
          />
        </BoxHolder>
      </DndContext>

      {currenPageNumber === 1 ? (
        <>
          <ArrowHolder src={ArrowBlue} top={320} />
          <ArrowHolder src={ArrowOrange} top={440} />
        </>
      ) : undefined}

      <EquationWrapper>4x = 24</EquationWrapper>

      <DropWrapper>
        <Equation top={60}>{lhsText}</Equation>
        <Equation top={180}>{rhsText}</Equation>
      </DropWrapper>

      {newBoxes.map((box) => {
        if (box.left !== DROPPABLE_LHS_LEFT && currenPageNumber < 3)
          return <AnimatedLines height={currentHeightDashed} left={box.left} />
      })}

      {newBoxes.length < 2 ? (
        <DragAndDropAnimation
          initialPos={{ left: 120, top: 530 }}
          finalPos={{ left: 200, top: 200 }}
        />
      ) : undefined}

      {infoText.length > 0 ? <Infotext>{infoText}</Infotext> : undefined}
      <PageControl
        onReset={retry}
        nextDisabled={handleNextDisabled()}
        total={5}
        onChange={handlePageChange}
      />
    </>
  )
}

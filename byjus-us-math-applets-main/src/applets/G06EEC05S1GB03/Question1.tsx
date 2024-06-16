import { DndContext, DragEndEvent } from '@dnd-kit/core'
import { useCallback, useEffect, useState } from 'react'
import styled, { keyframes } from 'styled-components'

import { OnboardingAnimation } from '@/atoms/OnboardingAnimation'
import { OnboardingController } from '@/atoms/OnboardingController'
import { OnboardingStep } from '@/atoms/OnboardingStep'
import { PageControl } from '@/common/PageControl'
import { useInterval } from '@/hooks/useInterval'

import ArrowBlue from './assets/Arrow 2.svg'
import ArrowOrange from './assets/ArrowOrange.svg'
import DragAndDropAnimation from './Components/DragAndDropAnimation'
import Draggable from './Components/Draggable'
import Droppable from './Components/Droppable'
import ResizableBoxes from './Components/ResizableBoxes'

const ClickAnimation1 = styled(OnboardingAnimation).attrs({ type: 'click' })`
  position: absolute;
  top: 350px;
  left: 312px;
`

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
  /* justify-content: space-around; */
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
    left: 295.7647058823529,
    top: 245,
    value: '8',
    width: 188.23529411764707,
    height: 74,
    color: '#A6F0FF',
    opacity: 1,
    canInteract: false,
  },
  {
    left: 84,
    top: 245,
    value: 'x',
    width: 211.76470588235293,
    height: 74,
    color: '#A6F0FF',
    opacity: 1,
    canInteract: false,
  },
  {
    left: 295.7647058823529,
    top: 364,
    value: '8',
    width: 188.23529411764707,
    height: 74,
    color: '#FFD2A6',
    opacity: 1,
    canInteract: false,
  },
  {
    left: 84,
    top: 364,
    value: '17 - 8',
    width: 211.76470588235293,
    height: 74,
    color: '#FFD2A6',
    opacity: 1,
    canInteract: false,
  },
]

const IntitalBoxArray = [
  {
    left: 295.7647058823529,
    top: 245,
    value: '8',
    width: 188.23529411764707,
    height: 74,
    color: '#A6F0FF',
    opacity: 1,
  },
  {
    left: 84,
    top: 245,
    value: 'x',
    width: 211.76470588235293,
    height: 74,
    color: '#A6F0FF',
    opacity: 1,
  },
  {
    left: 84,
    top: 364,
    value: '17',
    width: 400,
    height: 74,
    color: '#FFD2A6',
    opacity: 1,
  },
]

const question1 = [8, 1, 17] //x+8 =17

const DROPPABLE_WIDTH = 400
const DROPPABLE_HEIGHT = 70
const DROPPABLE_LHS_LEFT = 84
const DROPPABLE_LHS_TOP = 245
const DROPPABLE_RHS_LEFT = 84
const DROPPABLE_RHS_TOP = 364

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
  animation: ${ArrowAnimation} 0.8s ease-in;
  width: 400px;
`

interface props {
  reset: () => void
}

export const Question1 = (props: props) => {
  const [newBoxes, setNewBoxes] = useState<Boxprops[]>([])
  const [currentEquationIndex, setCurrentEquationIndex] = useState(0)
  const [currentLeft, setCurrentLeft] = useState(DROPPABLE_LHS_LEFT + DROPPABLE_WIDTH) //for absolute positioning of new boxes
  const [infoText, setInfoText] = useState('')
  const [currentQuestion, setCurrentQuestion] = useState(question1)
  const [showEqualTerms, setShowEquaTerms] = useState(true)
  const [currenPageNumber, setCurrenPageNumber] = useState(0)
  const [previousPageNumber, setPreviousPageNumber] = useState(0)
  const [currentHeightDashed, setCurrentHeightDashed] = useState(0)
  const [lhsText, setLhsText] = useState('---')
  const [rhsText, setRhsText] = useState('---')

  const retry = () => {
    setNewBoxes([])
    setCurrentEquationIndex(0)
    setCurrentLeft(DROPPABLE_LHS_LEFT + DROPPABLE_WIDTH)
    setInfoText('')
    setShowEquaTerms(true)
    setCurrentHeightDashed(0)
    setCurrenPageNumber(0)
    props.reset()
  }

  const calcWidth = (a: number) => {
    const unit = DROPPABLE_WIDTH / question1[2]
    return a * unit
  }

  const calcRemainingWidth = () => {
    return currentLeft - DROPPABLE_LHS_LEFT
  }

  const calcLeft = (a: number) => {
    return currentLeft - calcWidth(a)
  }

  const handleDragEndForQuestion1 = (e: DragEndEvent) => {
    const over = e.over?.id
    const activeBox = e.active.data.current ? e.active.data.current.equationSide : undefined
    const value = String(e.active.id) //need to change
    const isVariable = isNaN(parseInt(value))
    const opacity = 1
    if (over === activeBox) {
      if (!isVariable) {
        const width = calcWidth(parseInt(value))
        const left = calcLeft(parseInt(value))
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
        setCurrentLeft((prevVal) => prevVal - width)
      } else {
        const width = calcRemainingWidth()
        const left = DROPPABLE_LHS_LEFT
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
        setCurrentLeft((prevVal) => prevVal - width)
      }

      setCurrentEquationIndex((prevNum) => prevNum + 1)

      currentEquationIndex == 1 ? setCurrentLeft(DROPPABLE_LHS_LEFT + DROPPABLE_WIDTH) : undefined
    }
  }

  const showDivision = () => {
    SolutionBoxArray.map((box) => {
      if (box.color === '#2AD3F5') {
        box.color = '#A6F0FF'
        return { ...box }
      } else if (box.color === '#FF8F1F') {
        box.color = '#FFD2A6'
        return { ...box }
      }
      return { ...box }
    }),
      setNewBoxes(SolutionBoxArray)
  }

  useEffect(() => {
    setLhsText(() => {
      switch (currentEquationIndex) {
        case 1:
          return `${currentQuestion[0]}`
        case 2:
          return ` ${currentQuestion[1] !== 1 ? currentQuestion[1] : ''}x + ${currentQuestion[0]} `
        case 3:
          return `${currentQuestion[1] !== 1 ? currentQuestion[1] : ''}x + ${currentQuestion[0]}`
        default:
          return '---'
      }
    })
    setRhsText(() => {
      if (currentEquationIndex === 3) {
        return `${currentQuestion[2]}`
      } else {
        return '---'
      }
    })
  }, [currentEquationIndex, currentQuestion])

  useEffect(() => {
    let intervel: NodeJS.Timer
    switch (currenPageNumber) {
      case 1:
        setNewBoxes(IntitalBoxArray)
        setCurrentHeightDashed(0)
        intervel = setInterval(() => {
          setInfoText('Note that the length of the tapes are equal.')
        }, 800)
        break
      case 2:
        setInfoText(
          "Split 17 into (17 - 8) and 8, as 8 corresponds to the known value on the equation's left side.",
        )
        if (currentHeightDashed > DROPPABLE_RHS_TOP - DROPPABLE_LHS_TOP + DROPPABLE_HEIGHT - 5) {
          showDivision()
        }

        setLhsText(`${currentQuestion[1] !== 1 ? currentQuestion[1] : ''}x + ${currentQuestion[0]}`)
        setRhsText(`${currentQuestion[2]}`)
        break

      case 3:
        setLhsText(() => {
          if (showEqualTerms) {
            return `${currentQuestion[1] !== 1 ? currentQuestion[1] : ''}x + ${currentQuestion[0]}`
          } else {
            return 'x'
          }
        })
        setRhsText(() => {
          if (showEqualTerms) {
            return `${currentQuestion[2] - currentQuestion[0]} + ${currentQuestion[0]}`
          } else {
            return '9'
          }
        })
        setInfoText('Remove equal terms from both tapes to maintain the equality.')

        setNewBoxes((prevBoxes) => {
          return prevBoxes.map((box) => {
            if (box.value === '8') {
              return { ...box, canInteract: true }
            } else if (box.value === '17 - 8') {
              return { ...box, value: '9' }
            } else {
              return box
            }
          })
        })

        if (previousPageNumber === 4) {
          setShowEquaTerms(true)
          setNewBoxes((prevBoxes) => {
            //dehighlighting of box when reversing
            return prevBoxes.map((box, i) => {
              if (i === 1) {
                box.color = '#A6F0FF'
                return { ...box }
              } else if (i === 3) {
                box.color = '#FFD2A6'
                return { ...box }
              }
              return { ...box }
            })
          })
        }

        break

      case 4:
        setNewBoxes((prevBoxes) => {
          return prevBoxes.map((box, i) => {
            if (i === 1) {
              box.color = '#2AD3F5'
              return { ...box }
            } else if (i === 3) {
              box.color = '#FF8F1F'
              return { ...box }
            }
            return { ...box }
          })
        })
        setInfoText('Length of x is 9.')
        break

      default:
        setInfoText('')
        break
    }
    return () => clearInterval(intervel)
  }, [currenPageNumber, showEqualTerms, previousPageNumber])

  const handlePageChange = useCallback((e: number) => {
    setCurrenPageNumber((prevPage) => {
      setPreviousPageNumber(prevPage)
      return e
    })
  }, [])

  const handleNextDisabled = () => {
    switch (currenPageNumber) {
      case 0:
        return newBoxes.length < 3
      case 1:
        return
      case 2:
        return currentHeightDashed + 2 <= DROPPABLE_RHS_TOP - DROPPABLE_LHS_TOP + DROPPABLE_HEIGHT
      case 3:
        return showEqualTerms
      default:
        return false
    }
  }

  useInterval(
    () => {
      setCurrentHeightDashed((prevVal) => prevVal + 5)
      if (currentHeightDashed > DROPPABLE_RHS_TOP - DROPPABLE_LHS_TOP + DROPPABLE_HEIGHT - 5) {
        showDivision()
      }
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
      <DndContext onDragEnd={handleDragEndForQuestion1}>
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
            equationSide="LHS"
            isActive={currentEquationIndex === 0}
            id="8"
            width={100}
            value={8}
            color="#A6F0FF"
            isVisible={newBoxes.length === 0}
            fontColor={currentEquationIndex === 0 ? '#1CB9D9' : '#C7C7C7'}
          />
          <Draggable
            equationSide="LHS"
            isActive={currentEquationIndex === 1}
            id="x"
            width={100}
            color="#A6F0FF"
            isVisible={newBoxes.length < 2}
            fontColor={currentEquationIndex === 1 ? '#1CB9D9' : '#C7C7C7'}
          />
          <Draggable
            equationSide="RHS"
            isActive={currentEquationIndex === 2}
            id="17"
            width={300}
            value={17}
            color="#FFD2A6"
            isVisible={newBoxes.length < 3}
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

      <EquationWrapper>x + 8 = 17</EquationWrapper>
      <DropWrapper>
        <Equation top={60}>{lhsText}</Equation>
        <Equation top={180}>{rhsText}</Equation>
      </DropWrapper>

      {newBoxes.map((box) => {
        if (box.left !== DROPPABLE_LHS_LEFT && currenPageNumber < 3)
          return <AnimatedLines height={currentHeightDashed} left={box.left} />
      })}

      {infoText.length > 0 ? <Infotext>{infoText}</Infotext> : undefined}
      <PageControl
        onReset={retry}
        nextDisabled={handleNextDisabled()}
        total={5}
        onChange={handlePageChange}
      />
      {newBoxes.length < 1 ? (
        <DragAndDropAnimation
          initialPos={{ left: 90, top: 530 }}
          finalPos={{ left: 200, top: 200 }}
        />
      ) : undefined}

      {currenPageNumber > 2 ? (
        <OnboardingController>
          <OnboardingStep index={0}>
            <ClickAnimation1 type="click" complete={!showEqualTerms} />
          </OnboardingStep>
        </OnboardingController>
      ) : undefined}
    </>
  )
}

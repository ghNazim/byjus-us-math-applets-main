import { DndContext, DragEndEvent } from '@dnd-kit/core'
import { Player } from '@lottiefiles/react-lottie-player'
import { FC, useCallback, useEffect, useState } from 'react'
import styled, { keyframes } from 'styled-components'

import { AppletContainer } from '@/common/AppletContainer'
import CLickAnimation from '@/common/handAnimations/click.json'
import { TextHeader } from '@/common/Header'
import { PageControl } from '@/common/PageControl'
import { AppletInteractionCallback } from '@/contexts/analytics'
import { useSFX } from '@/hooks/useSFX'

import ArrowBlue from './Assets/bluearrow.svg'
import ArrowOrange from './Assets/orangearrow.svg'
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

const ClickAnimation = styled(Player)<{ left: number; top: number }>`
  position: absolute;
  left: ${(props) => props.left}px;
  top: ${(props) => props.top}px;
  pointer-events: none;
`

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
    value: 'a',
    width: 57.142857142857146,
    height: 74,
    color: '#A6F0FF',
    opacity: 1,
  },
  {
    left: 141.14285714285714,
    top: 245,
    value: 'a',
    width: 57.142857142857146,
    height: 74,
    color: '#A6F0FF',
    opacity: 1,
  },
  {
    left: 198.28571428571428,
    top: 245,
    value: 'a',
    width: 57.142857142857146,
    height: 74,
    color: '#A6F0FF',
    opacity: 1,
  },
  {
    left: 255.42857142857142,
    top: 245,
    value: 'a',
    width: 57.142857142857146,
    height: 74,
    color: '#A6F0FF',
    opacity: 1,
  },
  {
    left: 84,
    top: 364,
    value: '10',
    width: 57.142857142857146,
    height: 74,
    color: '#FFD2A6',
    opacity: 1,
  },
  {
    left: 141.14285714285714,
    top: 364,
    value: '10',
    width: 57.142857142857146,
    height: 74,
    color: '#FFD2A6',
    opacity: 1,
  },
  {
    left: 198.28571428571428,
    top: 364,
    value: '10',
    width: 57.142857142857146,
    height: 74,
    color: '#FFD2A6',
    opacity: 1,
  },
  {
    left: 255.42857142857142,
    top: 364,
    value: '10',
    width: 57.142857142857146,
    height: 74,
    color: '#FFD2A6',
    opacity: 1,
  },
]

const IntitalBoxArray: Boxprops[] = [
  {
    left: 84,
    top: 245,
    value: 'a',
    width: 57.142857142857146,
    height: 74,
    color: '#A6F0FF',
    opacity: 1,
  },
  {
    left: 141.14285714285714,
    top: 245,
    value: 'a',
    width: 57.142857142857146,
    height: 74,
    color: '#A6F0FF',
    opacity: 1,
  },
  {
    left: 198.28571428571428,
    top: 245,
    value: 'a',
    width: 57.142857142857146,
    height: 74,
    color: '#A6F0FF',
    opacity: 1,
  },
  {
    left: 255.42857142857142,
    top: 245,
    value: 'a',
    width: 57.142857142857146,
    height: 74,
    color: '#A6F0FF',
    opacity: 1,
  },
  {
    left: 312.57142857142856,
    top: 245,
    value: '30',
    width: 171.42857142857142,
    height: 74,
    color: '#A6F0FF',
    opacity: 1,
  },
  {
    left: 84,
    top: 364,
    value: '70',
    width: 400,
    height: 74,
    color: '#FFD2A6',
    opacity: 1,
  },
]

const newBoxArrForStep3: Boxprops[] = [
  {
    left: 84,
    top: 245,
    value: 'a',
    width: 57.142857142857146,
    height: 74,
    color: '#A6F0FF',
    opacity: 1,
    canInteract: false,
  },
  {
    left: 141.14285714285714,
    top: 245,
    value: 'a',
    width: 57.142857142857146,
    height: 74,
    color: '#A6F0FF',
    opacity: 1,
    canInteract: false,
  },
  {
    left: 198.28571428571428,
    top: 245,
    value: 'a',
    width: 57.142857142857146,
    height: 74,
    color: '#A6F0FF',
    opacity: 1,
    canInteract: false,
  },
  {
    left: 255.42857142857142,
    top: 245,
    value: 'a',
    width: 57.142857142857146,
    height: 74,
    color: '#A6F0FF',
    opacity: 1,
    canInteract: false,
  },
  {
    left: 312.57142857142856,
    top: 245,
    value: '30',
    width: 171.42857142857142,
    height: 74,
    color: '#A6F0FF',
    opacity: 1,
    canInteract: false,
  },
  {
    left: 84,
    top: 364,
    value: '40',
    width: 228.57142857142858,
    height: 74,
    color: '#FFD2A6',
    opacity: 1,
    canInteract: false,
  },
  {
    left: 312.57142857142856,
    top: 364,
    value: '30',
    width: 171.42857142857144,
    height: 74,
    color: '#FFD2A6',
    opacity: 1,
    canInteract: false,
  },
]

const newBoxArrForStep2BeforeDividing: Boxprops[] = [
  {
    left: 84,
    top: 245,
    value: 'a',
    width: 57.142857142857146,
    height: 74,
    color: '#A6F0FF',
    opacity: 1,
    canInteract: false,
  },
  {
    left: 141.14285714285714,
    top: 245,
    value: 'a',
    width: 57.142857142857146,
    height: 74,
    color: '#A6F0FF',
    opacity: 1,
    canInteract: false,
  },
  {
    left: 198.28571428571428,
    top: 245,
    value: 'a',
    width: 57.142857142857146,
    height: 74,
    color: '#A6F0FF',
    opacity: 1,
    canInteract: false,
  },
  {
    left: 255.42857142857142,
    top: 245,
    value: 'a',
    width: 57.142857142857146,
    height: 74,
    color: '#A6F0FF',
    opacity: 1,
    canInteract: false,
  },
  {
    left: 312.57142857142856,
    top: 245,
    value: '30',
    width: 171.42857142857142,
    height: 74,
    color: '#A6F0FF',
    opacity: 1,
    canInteract: false,
  },
  {
    left: 84,
    top: 364,
    value: '70',
    width: 400,
    height: 74,
    color: '#FFD2A6',
    opacity: 1,
  },
]

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

const question = [0, 4, 70] //4x =24
const DROPPABLE_WIDTH = 400
const DROPPABLE_HEIGHT = 70
const DROPPABLE_LHS_LEFT = 84
const DROPPABLE_LHS_TOP = 245
const DROPPABLE_RHS_LEFT = 84
const DROPPABLE_RHS_TOP = 364
const WIDTH_OF_30 = (DROPPABLE_WIDTH * 30) / 70 //fixed width for 30 when dragging when dragging 30
const LEFT_OF_30 = DROPPABLE_LHS_LEFT - WIDTH_OF_30 + DROPPABLE_WIDTH

export const AppletG06EEC05S1GB01: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const [newBoxes, setNewBoxes] = useState<Boxprops[]>([])
  //since coming back-previous step, it was difficult to maintain the state of previous boxes

  const [currentEquationIndex, setCurrentEquationIndex] = useState(1)
  const [infoText, setInfoText] = useState('')
  const [showEqualTerms, setShowEquaTerms] = useState(true)
  const [currenPageNumber, setCurrenPageNumber] = useState(0)
  const [xIndex, setXIndex] = useState(0) //when xCoefficient is more than 1
  const currentQuestion = question
  const [currentHeightDashed, setCurrentHeightDashed] = useState(0)
  const [lhsText, setLhsText] = useState('---')
  const [rhsText, setRhsText] = useState('---')

  //sound
  const playMouseClick = useSFX('mouseClick')
  const playMouseIn = useSFX('mouseIn')
  const playMouseOut = useSFX('mouseOut')

  const retry = () => {
    // props.reset()
    setNewBoxes([])
    setCurrentEquationIndex(1)
    setInfoText('')
    setShowEquaTerms(true)
    setCurrenPageNumber(0)
    setXIndex(0)
    setCurrentHeightDashed(0)
  }

  const calcWidth = (a: number) => {
    return (DROPPABLE_WIDTH - WIDTH_OF_30) / a
  }

  const calcLeft = (a: number) => {
    return DROPPABLE_LHS_LEFT + a * calcWidth(a)
  }

  const calcNewBoxArrAfterDividing = () => {
    const lastBox = IntitalBoxArray[IntitalBoxArray.length - 1]
    const tmp = [...IntitalBoxArray]
    tmp.pop()
    const subBox1: Boxprops = {
      ...lastBox,
      value: '70-30',
      width: (DROPPABLE_WIDTH / 7) * 4,
    }

    const subBox2: Boxprops = {
      ...lastBox,
      value: '30',
      left: lastBox.left + (DROPPABLE_WIDTH / 7) * 4,
      width: (DROPPABLE_WIDTH / 7) * 3,
    }
    const newArr = [...tmp, subBox1, subBox2]
    newArr.map((box) => (box.canInteract = false))

    return newArr
  }

  const handleInterctivityOfBoxes = (boxArr: Boxprops[], boo: boolean) => {
    if (boo) {
      const tmp = [...boxArr]
      tmp[tmp.length - 1].canInteract = boo
      tmp[tmp.length - 3].canInteract = boo
      tmp[tmp.length - 2].value = '40'
      return tmp
    } else {
      boxArr.map((box) => (box.canInteract = boo))
      return boxArr
    }
  }

  const rearrangeBoxes = () => {
    let newLeft = DROPPABLE_RHS_LEFT
    const nwWidth = calcWidth(xIndex)

    if (xIndex < 5) {
      setNewBoxes((prevVal) => {
        return prevVal.map((box) => {
          if (box.value === 'a') {
            box.width = nwWidth
            box.left = newLeft
            newLeft += nwWidth
            return { ...box }
          }
          return box
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
    const isLhs = e.active.data.current?.equationSide === 'LHS'
    playMouseOut()
    // console.log(e)
    if (over === activeBox) {
      if (!isVariable) {
        const width = isLhs ? WIDTH_OF_30 : DROPPABLE_WIDTH
        const left = isLhs ? LEFT_OF_30 : DROPPABLE_LHS_LEFT
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
        isLhs
          ? setXIndex((prevVal) => prevVal + 1)
          : setCurrentEquationIndex((prevNum) => prevNum + 1)
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
        setNewBoxes((prevVal) => [newBox, ...prevVal])
        if (xIndex === 4) setCurrentEquationIndex((prevNum) => prevNum + 1)
        rearrangeBoxes()
      }
    }
  }

  const showDivision = () => {
    setNewBoxes(SolutionBoxArray)
  }

  useEffect(() => {
    setLhsText('4a')
    setRhsText('40')
  }, [showEqualTerms])

  useEffect(() => {
    let intervel: NodeJS.Timer
    let timeOut: NodeJS.Timeout
    switch (currenPageNumber) {
      case 0:
        setLhsText(() => {
          // if (xIndex > 0) return `${xIndex > 2 ? xIndex : ''}x`
          if (xIndex > 1) return `${xIndex - 1 === 1 ? '' : xIndex - 1}a +30`
          else if (xIndex === 1) return `30`
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
        return () => clearInterval(intervel)
      case 2:
        setLhsText('4a+30')
        setRhsText('40')
        setInfoText(
          "Split 70 into (70-30) and 30, as 30 corresponds to the known value on the equation's left side",
        )
        setNewBoxes(newBoxArrForStep2BeforeDividing)

        intervel = setInterval(() => {
          setCurrentHeightDashed((prevVal) => {
            if (prevVal + 5 > DROPPABLE_RHS_TOP - DROPPABLE_LHS_TOP + DROPPABLE_HEIGHT) {
              clearInterval(intervel)
              setNewBoxes(() => calcNewBoxArrAfterDividing())
              return DROPPABLE_RHS_TOP - DROPPABLE_LHS_TOP + DROPPABLE_HEIGHT
            }
            return prevVal + 5
          })
        }, 50)

        return () => {
          clearTimeout(timeOut)
        }

      // break
      case 3:
        setInfoText('Remove equal terms from both sides to maintain the equality')
        setCurrentHeightDashed(0)
        setShowEquaTerms(true)
        setNewBoxes(newBoxArrForStep3)
        if (newBoxes[newBoxes.length - 1].value === '30') {
          setNewBoxes((prev) => handleInterctivityOfBoxes(prev, true))
        }
        // showDivision()

        break
      case 4:
        setLhsText('4a')
        setRhsText('40')
        setInfoText(
          "As the equation's left side contains 4 a's, divide 40 into 4 equal parts accordingly.",
        )

        if (currentHeightDashed < DROPPABLE_RHS_TOP - DROPPABLE_LHS_TOP + DROPPABLE_HEIGHT) {
          intervel = setInterval(() => {
            setCurrentHeightDashed((prevVal) => {
              if (prevVal + 5 > DROPPABLE_RHS_TOP - DROPPABLE_LHS_TOP + DROPPABLE_HEIGHT) {
                clearInterval(intervel)
                showDivision()
                setNewBoxes((prevBoxes) => {
                  //dehighlighting of box when reversing
                  return prevBoxes.map((box, i) => {
                    if (box.color === '#2AD3F5') {
                      box.color = '#A6F0FF'
                      return { ...box }
                    } else if (box.color === '#FF8F1F') {
                      box.color = '#FFD2A6'
                      return { ...box }
                    }
                    return { ...box }
                  })
                })
                // console.log(SolutionBoxArray)
                return DROPPABLE_RHS_TOP - DROPPABLE_LHS_TOP + DROPPABLE_HEIGHT
              }
              return prevVal + 5
            })
          }, 20)

          return () => clearInterval(intervel)
        }
        break

      case 5:
        setLhsText('')
        setRhsText('')
        setInfoText('Length of a is 10.')
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
        return newBoxes.length < 6
      case 2:
        return currentHeightDashed + 2 <= DROPPABLE_RHS_TOP - DROPPABLE_LHS_TOP + DROPPABLE_HEIGHT
      case 3:
        return showEqualTerms
      case 4:
        return currentHeightDashed + 2 <= DROPPABLE_RHS_TOP - DROPPABLE_LHS_TOP + DROPPABLE_HEIGHT
      default:
        return false
    }
  }

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

  const handleDragStart = () => {
    playMouseIn()
  }

  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#f6f6f6',
        id: 'g07-eec03-s1-gb02',
        onEvent,
        className,
        themeName: 'dark',
      }}
    >
      <TextHeader
        text="Use the tape diagram to find length of a."
        backgroundColor="#f6f6f6"
        buttonColor="#1a1a1a"
      />
      <DndContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
        {showEqualTerms ? (
          <>
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
              if (box.canInteract) {
                setShowEquaTerms(false)
                playMouseClick()
              }
            }}
            show={box.canInteract ? showEqualTerms : true}
            fontColor={fontColor(box.color)}
          />
        ))}
        <BoxHolder>
          <Draggable
            // xCoefficient={4 - xIndex}
            value={30}
            equationSide="LHS"
            isActive={currentEquationIndex === 1}
            id="30"
            width={100}
            color="#A6F0FF"
            isVisible={xIndex < 1}
            fontColor={currentEquationIndex === 1 ? '#1CB9D9' : '#C7C7C7'}
          />
          <Draggable
            // xCoefficient={1}
            equationSide="LHS"
            isActive={currentEquationIndex === 1 && xIndex > 0}
            id="4a"
            width={100}
            color={'#A6F0FF'}
            isVisible={xIndex < 5}
            fontColor={currentEquationIndex === 1 && xIndex > 0 ? '#1CB9D9' : '#C7C7C7'}
          />

          <Draggable
            equationSide="RHS"
            isActive={currentEquationIndex === 2}
            id="70"
            width={300}
            value={70}
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

      <EquationWrapper>4a+ 30 = 70</EquationWrapper>

      <DropWrapper>
        <Equation top={60}>{lhsText}</Equation>
        <Equation top={180}>{rhsText}</Equation>
      </DropWrapper>

      {currenPageNumber === 2 &&
        newBoxes.map((box, index) => {
          if (box.left !== DROPPABLE_LHS_LEFT && index == 4)
            return <AnimatedLines height={currentHeightDashed} left={box.left} />
        })}

      {currenPageNumber === 4 &&
        newBoxes.map((box, index) => {
          if (box.left !== DROPPABLE_LHS_LEFT && index < 4)
            return <AnimatedLines height={currentHeightDashed} left={box.left} />
        })}

      {newBoxes.length < 1 && (
        <DragAndDropAnimation
          initialPos={{ left: 80, top: 530 }}
          finalPos={{ left: 200, top: 200 }}
        />
      )}
      {newBoxes.length === 1 && (
        <DragAndDropAnimation
          initialPos={{ left: 180, top: 530 }}
          finalPos={{ left: 200, top: 200 }}
        />
      )}

      {currenPageNumber === 3 && showEqualTerms && (
        <ClickAnimation left={350} top={350} src={CLickAnimation} autoplay loop />
      )}

      {infoText.length > 0 ? <Infotext>{infoText}</Infotext> : undefined}
      <PageControl
        onReset={retry}
        nextDisabled={handleNextDisabled()}
        total={6}
        onChange={handlePageChange}
      />
    </AppletContainer>
  )
}

import { DndContext, DragEndEvent, DragOverEvent } from '@dnd-kit/core'
import { gcd, lcm } from 'mathjs'
import { FC, useCallback, useContext, useEffect, useMemo, useReducer, useState } from 'react'
import styled from 'styled-components'

import { FactorTreeThemeType } from '@/atoms/FactorTree/FactorTree.types'
import { DnDOnboardingAnimation, OnboardingAnimation } from '@/atoms/OnboardingAnimation'
import { OnboardingController } from '@/atoms/OnboardingController'
import { OnboardingStep } from '@/atoms/OnboardingStep'
import { AppletContainer } from '@/common/AppletContainer'
import { TextHeader } from '@/common/Header'
import { AnalyticsContext, AppletInteractionCallback } from '@/contexts/analytics'
import { useSFX } from '@/hooks/useSFX'
import { expandedPrimeFactors } from '@/utils/math'

import { AnimatedFactorTree } from './AnimatedFactorTree'
import {
  AdjustableBoxWIthPosAndSize,
  AnimatedFactorTreeContainer,
  Bg,
  BottomText,
  Button,
  ButtonHolder,
  Cell,
  ColoredSpan,
  ColoredSpanWithBorder,
  ColumnFlexBox,
  Container,
  DraggableContainer,
  DraggableItem,
  DroppableCanvas,
  Inputs,
  InvisibleBoxes,
  Label,
  Row,
  RowFlexBox,
  ShapesAfterPlacing,
  Table,
  TableHolder,
  TextHolder,
  TextWrapper,
  UserInputDiv,
  UserInputHolder,
} from './Applet.styles'
import finalScreenLeft from './assets/finalScreen/left.svg'
import finalScreenMiddle from './assets/finalScreen/middle.svg'
import finalScreenRight from './assets/finalScreen/right.svg'
import labelLeft from './assets/Labels/left.svg'
import labelMiddle from './assets/Labels/middle.svg'
import labelRight from './assets/Labels/right.svg'
import leftImage from './assets/left.svg'
import middleImage from './assets/middle.svg'
import rightImage from './assets/right.svg'
import tooltipLeft from './assets/toolTip/tooltipLeft.svg'
import tooltipRight from './assets/toolTip/tooltipRight.svg'
import tryNewIcon from './assets/tryNew.svg'
import DroppableContainer, {
  DroppableIds as DroppablePosition,
} from './components/DroppableContainer'
import InputField from './components/InputField'
import VennDiagram from './components/VennDiagram'

const finalScreenImagArray = [finalScreenLeft, finalScreenMiddle, finalScreenRight]

const OnboardingAnimationStyled = styled(OnboardingAnimation)<{ left: number; top: number }>`
  position: absolute;
  top: ${(a) => a.top}px;
  left: ${(a) => a.left}px;
`

const DndOnBoardingStyled = styled(DnDOnboardingAnimation)`
  z-index: 50;
`

interface FactorData {
  value: number
  placed: boolean
  correctPosition: DroppablePosition
  droppedAt: DroppablePosition | null
}
interface Data {
  list1: Array<FactorData>
  list2: Array<FactorData>
}

const FactorTreeTheme: FactorTreeThemeType = {
  firstNodeBgColor: '#646464',
  firstNodeColor: '#fff',
  firstNodeStrokeColor: '#646464',
  leftNodeBgColor: '#ececec',
  leftNodeColor: '#444',
  rightNodeBgColor: '#fff',
  rightNodeColor: '#646464',
  leftNodeStrokeColor: '#444',
  rightNodeStrokeColor: '#646464',
  strokeColor: '#444',
}

type CountOfDataItems = Record<DroppablePosition, number>

type Action =
  | {
      type: 'place'
      value: number
      position: DroppablePosition
    }
  | {
      type: 'initialize'
      value: Data
    }
  | { type: 'reset'; value: Data }

function reducer(current: Data, action: Action) {
  if (action.type === 'place') {
    const list1 = [...current.list1]
    const list2 = [...current.list2]
    if (action.position === 'left') {
      const updateIndex = list1.findIndex(
        (factor) =>
          factor.value === action.value &&
          (factor.correctPosition === action.position || factor.correctPosition === 'middle') &&
          factor.placed === false,
      )
      const currentFactorState = list1[updateIndex]
      list1[updateIndex] = { ...currentFactorState, placed: true, droppedAt: action.position }
    }
    if (action.position === 'right') {
      const updateIndex = list2.findIndex(
        (factor) =>
          factor.value === action.value &&
          (factor.correctPosition === action.position || factor.correctPosition === 'middle') &&
          factor.placed === false,
      )
      const currentFactorState = list2[updateIndex]
      list2[updateIndex] = { ...currentFactorState, placed: true, droppedAt: action.position }
    }
    if (action.position === 'middle') {
      const updateIndex1 = list1.findIndex(
        (factor) =>
          factor.value === action.value &&
          // factor.correctPosition === action.position &&
          factor.placed === false,
      )
      if (updateIndex1 >= 0) {
        const currentFactorState1 = list1[updateIndex1]
        list1[updateIndex1] = { ...currentFactorState1, placed: true, droppedAt: action.position }
        const updateIndex2 = list2.findIndex(
          (factor) => factor.value === action.value && factor.placed === false,
        )
        const currentFactorState2 = list2[updateIndex2]
        list2[updateIndex2] = { ...currentFactorState2, placed: true, droppedAt: action.position }
      }
    }

    return { list1, list2 }
  } else if (action.type === 'initialize') {
    return action.value
  } else if (action.type === 'reset') {
    return action.value
  }
  return current
}

type RenderArrayForDroppedNumbersType = Record<DroppablePosition, number[]>
const RenderDraggedItems: FC<{
  renderArray: RenderArrayForDroppedNumbersType
  commonNumbersColor: string
  leftNrightColor: string
}> = ({ renderArray, commonNumbersColor, leftNrightColor }) => {
  //this will render the numbers
  return (
    <Container>
      <InvisibleBoxes
        width={155}
        numberOfElements={renderArray.left.length}
        isMiddle={renderArray.left.length > 3}
      >
        {renderArray.left.map((ele, ind) => (
          <ShapesAfterPlacing
            middleColor={commonNumbersColor}
            sideTextColor={leftNrightColor}
            isMiddle={false}
            move
            key={ind}
            isGrid={renderArray.left.length > 3}
          >
            {ele}
          </ShapesAfterPlacing>
        ))}
      </InvisibleBoxes>
      <InvisibleBoxes width={90} height={190} isMiddle numberOfElements={renderArray.middle.length}>
        {renderArray.middle.map((ele, ind) => (
          <ShapesAfterPlacing
            middleColor={commonNumbersColor}
            sideTextColor={leftNrightColor}
            isMiddle
            isGrid={renderArray.middle.length > 3}
            key={ind}
            move={false}
          >
            {ele}
          </ShapesAfterPlacing>
        ))}
      </InvisibleBoxes>
      <InvisibleBoxes width={155} numberOfElements={renderArray.right.length}>
        {renderArray.right.map((ele, ind) => (
          <ShapesAfterPlacing
            middleColor={commonNumbersColor}
            sideTextColor={leftNrightColor}
            isMiddle={false}
            isGrid={renderArray.right.length > 3}
            key={ind}
            move={false}
          >
            {ele}
          </ShapesAfterPlacing>
        ))}
      </InvisibleBoxes>
    </Container>
  )
}

const checkIfAllNumbersArePlacedAtTheCorrectPos = (data: Data) => {
  const correctCount: CountOfDataItems = { left: 0, middle: 0, right: 0 }
  const userDraggedCount: CountOfDataItems = { left: 0, middle: 0, right: 0 }

  for (const ele of data.list1) {
    const correctPositionKey = ele.correctPosition as DroppablePosition
    const userPlaedPositionKey = ele.droppedAt as DroppablePosition

    correctCount[correctPositionKey]++
    userDraggedCount[userPlaedPositionKey]++
  }
  for (const ele of data.list2) {
    const correctPositionKey = ele.correctPosition as DroppablePosition
    const userPlaedPositionKey = ele.droppedAt as DroppablePosition

    if (correctPositionKey !== 'middle') {
      correctCount[correctPositionKey]++
    }
    if (userPlaedPositionKey !== 'middle') {
      userDraggedCount[userPlaedPositionKey]++
    }
  }
  // console.log('correct count', correctCount, 'dragged ', userDraggedCount, data)

  return (
    correctCount.left + correctCount.middle + correctCount.right ===
    userDraggedCount.left + userDraggedCount.middle + userDraggedCount.right
  )
}

export const AppletG06NSC06S1GB03: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const [userInput1, setUserInput1] = useState(0)
  const [userInput2, setUserInput2] = useState(0)
  const [currentlyOver, setCurrentlyOver] = useState<DroppablePosition | null>(null)
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null)
  const [currentStage, setCurrentStage] = useState(0)
  const [showDraggables, setShowDraggables] = useState(true)
  const [hideDndOnboardingAnimation, setHideDndOnboardingAnimation] = useState(false)
  const [userInputLcm, setUserInputLcm] = useState(-1)
  const [userInputGcf, setUserInputGcf] = useState(-1)
  const [gcfArr, setGcfArr] = useState<number[]>([])
  const [isCheckBtnPressed, setIsCheckBtnPressed] = useState(false)
  const [isUserLcmInputCorrect, setIsUserLcmInputCorrect] = useState(false)
  const [isUserGcfInputCorrect, setIsUserGcfInputCorrect] = useState(false)

  const playMouseIn = useSFX('mouseIn')
  const playWronAnswerSound = useSFX('incorrect')
  const playCorrectAnswerSound = useSFX('correct')
  const playMouseClick = useSFX('mouseClick')
  const onInteraction = useContext(AnalyticsContext)

  const [data, dispatch] = useReducer(reducer, { list1: [], list2: [] })

  const [renderArray, setRenderArray] = useState<RenderArrayForDroppedNumbersType>({
    left: [],
    middle: [],
    right: [],
  })
  useEffect(() => {
    //this will convert the data to {left:[], middle:[], right:[]}
    //to be rendered
    const left: number[] = []
    const middle: number[] = []
    const right: number[] = []
    data.list1.map((ele) => {
      if (ele.placed) {
        if (ele.droppedAt === 'left') {
          left.push(ele.value)
        } else if (ele.droppedAt === 'middle') {
          middle.push(ele.value)
        }
      }
    })

    data.list2.map((ele) => {
      if (ele.placed) {
        if (ele.droppedAt === 'right') {
          right.push(ele.value)
        }
      }
    })

    const list1Placed = () => {
      for (const ele of data.list1) {
        if (!ele.placed) {
          return false
        }
      }
      return true
    }

    const list2Placed = () => {
      for (const ele of data.list2) {
        if (!ele.placed) {
          return false
        }
      }
      return true
    }

    if (list1Placed() && list2Placed()) {
      setShowDraggables(false)
    } else {
      setShowDraggables(true)
    }
    setRenderArray({ left: left, middle: middle, right: right })
  }, [data])

  const canPlace = useCallback(
    (value: number, position: DroppablePosition) => {
      //this will check if it's possible to render or not
      if (position === 'middle') {
        //if it's in the middle, i'm checking if that value is placed
        //in both list 1 and list 2. This will return true only if the
        //element with same value and placed=false exists in both list 1 and list2
        for (const factor of data.list1) {
          if (
            factor.value === value &&
            (factor.correctPosition === 'left' || factor.correctPosition === 'middle') &&
            !factor.placed
          ) {
            for (const factor2 of data.list2) {
              if (
                factor2.value === value &&
                (factor2.correctPosition === 'middle' || factor2.correctPosition === 'right') &&
                !factor2.placed
              ) {
                return true
              }
            }
          }
        }
      } else if (position == 'left') {
        //checking the list1 for elements that are not placed yet
        //with the same value
        for (const factor of data.list1) {
          if (
            factor.value === value &&
            (factor.correctPosition === 'left' || factor.correctPosition === 'middle') &&
            !factor.placed
          ) {
            return true
          }
        }
      } else {
        //checking the list2 for elements that are not placed yet
        //with the same value
        for (const factor of data.list2) {
          if (
            factor.value === value &&
            (factor.correctPosition === 'right' || factor.correctPosition === 'middle') &&
            !factor.placed
          ) {
            return true
          }
        }

        return false
      }
    },

    [data.list1, data.list2],
  )

  //gcf Of the Numbers given
  const gcfOfNumbers = useMemo(() => gcd(userInput1, userInput2), [userInput1, userInput2])

  const lcmOfNumbers = useMemo(() => lcm(userInput1, userInput2), [userInput1, userInput2])

  //prime factor array for both inputs- numbers are not uique
  //that is for 8 the array will be [2,2,2]
  const primeFactorArrayForInput1 = useMemo(() => expandedPrimeFactors(userInput1), [userInput1])
  const primeFactorArrayForInput2 = useMemo(() => expandedPrimeFactors(userInput2), [userInput2])

  //this is the value sent to reducer function with action initialization
  // this function maps through the  primaryFactorInput array and segregate
  const initializationVal = useMemo(() => {
    const value: Data = {
      list1: [],
      list2: [],
    }
    const sortedFactors1 = [...primeFactorArrayForInput1].sort()
    const sortedFactors2 = [...primeFactorArrayForInput2].sort()

    while (sortedFactors1.length > 0 || sortedFactors2.length > 0) {
      if (sortedFactors1.length === 0) {
        value.list2.push(
          ...sortedFactors2.map((val) => ({
            value: val,
            correctPosition: 'right' as const,
            placed: false,
            droppedAt: null,
          })),
        )
        break
      }
      const [factor1] = sortedFactors1.splice(0, 1)

      const indexInList2 = sortedFactors2.indexOf(factor1)

      if (indexInList2 >= 0) {
        const rightFactors = sortedFactors2.splice(0, indexInList2)
        value.list2.push(
          ...rightFactors.map((val) => ({
            value: val,
            correctPosition: 'right' as const,
            placed: false,
            droppedAt: null,
          })),
        )
        const [middleFactor] = sortedFactors2.splice(0, 1)
        value.list1.push({
          value: middleFactor,
          correctPosition: 'middle',
          placed: false,
          droppedAt: null,
        })
        value.list2.push({
          value: middleFactor,
          correctPosition: 'middle',
          placed: false,
          droppedAt: null,
        })
        // setGcfArr((prev) => [...prev, middleFactor])
      } else {
        value.list1.push({
          value: factor1,
          correctPosition: 'left',
          placed: false,
          droppedAt: null,
        })
      }
    }

    value.list1.sort((a, b) => a.value - b.value)
    value.list2.sort((a, b) => a.value - b.value)
    return value
  }, [primeFactorArrayForInput1, primeFactorArrayForInput2])

  useEffect(() => {
    //creating gcf array
    const tmp = data.list1.filter((ele) => ele.correctPosition === 'middle')
    setGcfArr(tmp.map((ele) => ele.value))
  }, [data.list1])

  //dispatch initialization
  useEffect(() => {
    if (currentStage === 2) {
      dispatch({ type: 'initialize', value: initializationVal })
    }
  }, [currentStage, initializationVal, primeFactorArrayForInput1, primeFactorArrayForInput2])

  //these are the unique numbers of the union of both prime factor array
  const draggableOptions = useMemo(() => {
    const tmp = primeFactorArrayForInput1
    const tmp2 = primeFactorArrayForInput2

    const set = new Set([...tmp, ...tmp2])
    //getting unique numbers

    return Array.from(set)
  }, [primeFactorArrayForInput1, primeFactorArrayForInput2])

  const handleNext = () => {
    setCurrentStage((prev) => prev + 1)
  }

  const handleDragOver = (e: DragOverEvent) => {
    if (e.over) {
      setCurrentlyOver(e.over.id as DroppablePosition)
    } else {
      setCurrentlyOver(null)
    }
  }

  const handleDragStart = () => {
    playMouseIn()
    onInteraction('drag')
  }

  const handleDragEnd = (e: DragEndEvent) => {
    if (e.over) {
      if (!hideDndOnboardingAnimation) {
        setHideDndOnboardingAnimation(true)
      }
      onInteraction('drop')
      const over = e.over.id as DroppablePosition
      const active = Number(e.active.id)

      //checking if it's possible to place it in the given position
      const isPossible = canPlace(active, over)

      if (isPossible) {
        playCorrectAnswerSound()
        dispatch({ value: active, position: over, type: 'place' })
      } else {
        playWronAnswerSound()
      }
    }

    setCurrentlyOver(null)
    //this state controlls the opacity of the venn digram regions
    //null is the default option
  }

  const handleCheck = () => {
    playMouseClick()

    //this function will check the count of left,middle, and right placed
    //values and compare
    const isAllNumbersPlacedAtCorrectPos = checkIfAllNumbersArePlacedAtTheCorrectPos(data)
    if (isAllNumbersPlacedAtCorrectPos) {
      setCurrentStage((prev) => prev + 1)
    } else {
      setIsAnswerCorrect(false)
    }
  }

  const handleReset = () => {
    setIsAnswerCorrect(null)
    dispatch({ type: 'reset', value: initializationVal })
    setShowDraggables(true)
  }

  const handleTryNew = () => {
    setCurrentStage(0)
    setUserInput1(0)
    setUserInput2(0)
    setIsAnswerCorrect(null)
    setUserInputGcf(0)
    setUserInputLcm(0)
  }

  const handleAnswerCheck = () => {
    if (userInputLcm === lcmOfNumbers && userInputGcf === gcfOfNumbers) {
      setIsAnswerCorrect(true)
      setCurrentStage((prev) => prev + 1)
    } else {
      setIsAnswerCorrect(false)
    }

    setIsCheckBtnPressed(true)

    const timer = setTimeout(() => {
      setIsCheckBtnPressed(false)
    }, 200)

    return () => {
      clearTimeout(timer)
    }
  }

  useEffect(() => {
    //this is to control the color of the inout boxes.
    if (isCheckBtnPressed) {
      if (!isUserGcfInputCorrect) {
        if (userInputGcf === gcfOfNumbers) setIsUserGcfInputCorrect(true)
      }

      if (!isUserLcmInputCorrect) {
        if (userInputLcm === lcmOfNumbers) setIsUserLcmInputCorrect(true)
      }
    }
  }, [isCheckBtnPressed])

  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#f6f6f6',
        id: 'g06-nsc06-s1-gb02',
        onEvent,
        className,
      }}
    >
      <TextHeader
        text="Find the LCM and GCF of two numbers using Venn diagram."
        backgroundColor="#f6f6f6"
        buttonColor="#1a1a1a"
      />
      <Bg isAnswerCorrect={null} />
      <OnboardingController>
        {currentStage === 0 ? (
          <>
            <TextHolder top={250}>Enter the numbers:</TextHolder>
            <Inputs onChangeValue1={setUserInput1} onChangeValue2={setUserInput2} />
            <BottomText>Enter any two numbers between 1 and 99.</BottomText>
            <ButtonHolder>
              <Button
                onClick={userInput1 > 1 && userInput2 > 1 ? handleNext : undefined}
                disabled={userInput1 < 2 || userInput2 < 2}
              >
                Next
              </Button>
            </ButtonHolder>
            <OnboardingStep index={0}>
              <OnboardingAnimationStyled
                type="click"
                complete={!(userInput1 < 2 && userInput2 < 2)}
                top={283}
                left={220}
              />
            </OnboardingStep>
          </>
        ) : null}

        {currentStage === 1 ? (
          <>
            <AnimatedFactorTreeContainer>
              <AnimatedFactorTree value={userInput1} themeProps={FactorTreeTheme} />
              <AnimatedFactorTree value={userInput2} themeProps={FactorTreeTheme} />
            </AnimatedFactorTreeContainer>
            <BottomText>
              <div>Prime factorization</div>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    gap: '10px',
                  }}
                >
                  <div>
                    <ColoredSpan color="white" bgColor="#646464">
                      {userInput1}
                    </ColoredSpan>{' '}
                    ={' '}
                    <ColoredSpan color="#444" bgColor="#edeaec">
                      {primeFactorArrayForInput1.toString().replaceAll(',', ' × ')}
                    </ColoredSpan>
                  </div>
                  <div>
                    <ColoredSpan color="white" bgColor="#646464">
                      {userInput2}
                    </ColoredSpan>{' '}
                    ={' '}
                    <ColoredSpan color="#444" bgColor="#edeaec">
                      {primeFactorArrayForInput2.toString().replaceAll(',', ' × ')}
                    </ColoredSpan>
                  </div>
                </div>
              </div>
            </BottomText>
            <ButtonHolder>
              <Button disabled={false} onClick={handleNext}>
                Next
              </Button>
            </ButtonHolder>
          </>
        ) : null}

        {currentStage === 2 ? (
          <>
            <BottomText bottom={180}>
              {isAnswerCorrect === false ? (
                <>
                  Uh-oh! It seems like you haven’t shown the factors properly in the Venn diagram.
                </>
              ) : (
                <>Place the numbers in the Venn diagram to show unique and common factors.</>
              )}
            </BottomText>
            <DndContext
              onDragOver={handleDragOver}
              onDragEnd={handleDragEnd}
              onDragStart={handleDragStart}
            >
              <DroppableCanvas>
                <VennDiagram
                  currentOver={currentlyOver}
                  imageArr={[leftImage, middleImage, rightImage]}
                />
                <DroppableContainer />
                <RenderDraggedItems
                  renderArray={renderArray}
                  commonNumbersColor="#1CB9D9"
                  leftNrightColor="#646464"
                />
              </DroppableCanvas>

              <DraggableContainer>
                {showDraggables &&
                  draggableOptions.sort().map((ele, ind) => (
                    <DraggableItem parentId="left" id={ele.toString()} key={ind}>
                      {ele}
                    </DraggableItem>
                  ))}
              </DraggableContainer>
            </DndContext>
            <ButtonHolder>
              {isAnswerCorrect !== false ? (
                <Button disabled={showDraggables} onClick={handleCheck}>
                  Check
                </Button>
              ) : (
                <Button disabled={false} onClick={handleReset}>
                  Reset
                </Button>
              )}
            </ButtonHolder>
            <TableHolder>
              <Table>
                <Row>
                  {userInput1} ={' '}
                  {data.list1.map((factor, ind) => (
                    <Cell isCommon={factor.droppedAt === 'middle'} placed={factor.placed} key={ind}>
                      {factor.value} {ind !== data.list1.length - 1 && ' × '}
                    </Cell>
                  ))}
                </Row>
                <Row>
                  {userInput2} ={' '}
                  {data.list2.map((factor, ind) => (
                    <Cell isCommon={factor.droppedAt === 'middle'} placed={factor.placed} key={ind}>
                      {factor.value} {ind !== data.list2.length - 1 && ' × '}
                    </Cell>
                  ))}
                </Row>
              </Table>
            </TableHolder>
            <OnboardingStep index={1}>
              <DndOnBoardingStyled
                initialPosition={{ left: 300, top: 600 }}
                finalPosition={{ left: 180, top: 270 }}
                complete={hideDndOnboardingAnimation}
              />
            </OnboardingStep>
          </>
        ) : null}
        {currentStage > 1 ? (
          <>
            {/* labels for the venn diagram */}
            <Label left={48} top={398}>
              <img src={labelLeft} />
              <AdjustableBoxWIthPosAndSize height={46} left={0} top={36} width={130}>
                Factors of {userInput1}
              </AdjustableBoxWIthPosAndSize>
            </Label>
            <Label left={357} top={181}>
              <img src={labelMiddle} />
              <AdjustableBoxWIthPosAndSize height={80} left={217} top={0} width={99}>
                Factors of {userInput1} & {userInput2}
              </AdjustableBoxWIthPosAndSize>
            </Label>
            <Label left={currentStage == 1 ? 527 : 520} top={398}>
              <img src={labelRight} />
              <AdjustableBoxWIthPosAndSize height={46} left={22} top={36} width={130}>
                Factors of {userInput2}
              </AdjustableBoxWIthPosAndSize>
            </Label>
          </>
        ) : null}

        {currentStage > 2 ? (
          <>
            <DroppableCanvas>
              <VennDiagram currentOver={currentlyOver} imageArr={finalScreenImagArray} />
              <RenderDraggedItems
                renderArray={renderArray}
                commonNumbersColor={'#1CB9D9'}
                leftNrightColor={'#444444'}
              />
            </DroppableCanvas>

            <TableHolder>
              <Table>
                <Row>
                  {userInput1} ={' '}
                  {data.list1.map((factor, ind) => (
                    <Cell
                      isCommon={factor.droppedAt === 'middle'}
                      placed={false}
                      key={ind}
                      avoidIsPlaced
                    >
                      {factor.value} {ind !== data.list1.length - 1 && ' × '}
                    </Cell>
                  ))}
                </Row>
                <Row>
                  {userInput2} ={' '}
                  {data.list2.map((factor, ind) => (
                    <Cell
                      isCommon={factor.droppedAt === 'middle'}
                      placed={false}
                      key={ind}
                      avoidIsPlaced
                    >
                      {factor.value} {ind !== data.list2.length - 1 && ' × '}
                    </Cell>
                  ))}
                </Row>
              </Table>
            </TableHolder>
          </>
        ) : null}

        {currentStage === 3 ? (
          <>
            {isAnswerCorrect === false && userInputLcm !== lcmOfNumbers ? (
              <Label left={67} top={538}>
                <img src={tooltipLeft} />
              </Label>
            ) : null}
            {isAnswerCorrect == false && userInputGcf !== gcfOfNumbers ? (
              <Label left={490} top={514}>
                <img src={tooltipRight} />
              </Label>
            ) : null}

            <UserInputHolder>
              <UserInputDiv>
                <ColoredSpanWithBorder bgColor="#fdf2e5" color="#cc7a22">
                  LCM :
                </ColoredSpanWithBorder>
                <InputField
                  onChange={(val) => {
                    setUserInputLcm(val)
                  }}
                  placeHolder=""
                  state={
                    isAnswerCorrect === null
                      ? 'default'
                      : isUserLcmInputCorrect
                      ? 'correct'
                      : 'wrong'
                  }
                  max={10000}
                />
              </UserInputDiv>
              <UserInputDiv>
                <ColoredSpanWithBorder bgColor="#ebfbff" color="#58b9d8">
                  GCF :
                </ColoredSpanWithBorder>
                <InputField
                  onChange={(val) => {
                    setUserInputGcf(val)
                  }}
                  placeHolder=""
                  state={
                    isAnswerCorrect === null
                      ? 'default'
                      : isUserGcfInputCorrect
                      ? 'correct'
                      : 'wrong'
                  }
                  max={10000}
                />
              </UserInputDiv>
            </UserInputHolder>
            <BottomText bottom={200}>Check the LCM and GCF of the numbers.</BottomText>
            <ButtonHolder>
              <Button disabled={userInputGcf < 1 || userInputLcm < 1} onClick={handleAnswerCheck}>
                Check
              </Button>
            </ButtonHolder>
          </>
        ) : null}

        {currentStage === 4 ? (
          <>
            <TextHolder top={550}>
              <ColumnFlexBox>
                <TextWrapper>
                  <ColoredSpanWithBorder bgColor="#fdf2e5" color="#cc7a22">
                    LCM
                  </ColoredSpanWithBorder>{' '}
                  <ColumnFlexBox style={{ fontSize: '24px' }}>
                    <RowFlexBox>
                      <div>
                        {' '}
                        ={' '}
                        {data.list1.map((factor, ind) => (
                          <span key={ind}>
                            {ind !== 0 && ' × '} {factor.value}
                          </span>
                        ))}
                        {data.list2.map((factor, ind) =>
                          factor.correctPosition !== 'middle' ? (
                            <span key={ind}>
                              {' × '} {factor.value}
                            </span>
                          ) : null,
                        )}
                      </div>
                      <div>=</div>
                      <div>
                        <ColoredSpanWithBorder bgColor="#fdf2e5" color="#cc7a22">
                          {lcm(userInput1, userInput2)}
                        </ColoredSpanWithBorder>
                      </div>
                    </RowFlexBox>
                  </ColumnFlexBox>
                </TextWrapper>
                <TextWrapper>
                  <ColoredSpanWithBorder bgColor="#ebfbff" color="#58b9d8">
                    GCF
                  </ColoredSpanWithBorder>{' '}
                  {gcfOfNumbers > 1 ? (
                    <ColumnFlexBox style={{ fontSize: '24px' }}>
                      <RowFlexBox>
                        <div>
                          {' '}
                          ={' '}
                          {gcfArr.map((factor, ind) => (
                            <span key={ind}>
                              {factor} {ind !== gcfArr.length - 1 && ' × '}
                            </span>
                          ))}
                        </div>
                        <div>=</div>
                        <div>
                          <ColoredSpanWithBorder bgColor="#ebfbff" color="#58b9d8">
                            {gcfOfNumbers}
                          </ColoredSpanWithBorder>
                        </div>
                      </RowFlexBox>
                    </ColumnFlexBox>
                  ) : (
                    <div>= 1, since there are no shared factors</div>
                  )}
                </TextWrapper>
              </ColumnFlexBox>
            </TextHolder>
            <ButtonHolder>
              <Button disabled={false} onClick={handleTryNew}>
                <img src={tryNewIcon} />
                Try Again
              </Button>
            </ButtonHolder>
          </>
        ) : null}
      </OnboardingController>
    </AppletContainer>
  )
}

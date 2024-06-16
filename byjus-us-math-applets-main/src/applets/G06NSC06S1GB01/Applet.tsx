import { DndContext, DragEndEvent, DragOverEvent } from '@dnd-kit/core'
import { FC, useContext, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'

import { DnDOnboardingAnimation } from '@/atoms/OnboardingAnimation'
import { OnboardingController } from '@/atoms/OnboardingController'
import { OnboardingStep } from '@/atoms/OnboardingStep'
import { AppletContainer } from '@/common/AppletContainer'
import { TextHeader } from '@/common/Header'
import { AnalyticsContext, AppletInteractionCallback } from '@/contexts/analytics'
import { useSFX } from '@/hooks/useSFX'

import leftLabel from './assets/labels/leftLabel.svg'
import middleLabel from './assets/labels/middleLabel.svg'
import rightLabel from './assets/labels/rightLabel.svg'
import shape1 from './assets/shapes/shape1.svg'
import shape2 from './assets/shapes/shape2.svg'
import shape3 from './assets/shapes/shape3.svg'
import shape4 from './assets/shapes/shape4.svg'
import shape5 from './assets/shapes/shape5.svg'
import shape6 from './assets/shapes/shape6.svg'
import shape7 from './assets/shapes/shape7.svg'
import shape8 from './assets/shapes/shape8.svg'
import shape9 from './assets/shapes/shape9.svg'
import shape10 from './assets/shapes/shape10.svg'
import shape11 from './assets/shapes/shape11.svg'
import shape12 from './assets/shapes/shape12.svg'
import shape13 from './assets/shapes/shape13.svg'
import shape14 from './assets/shapes/shape14.svg'
import shape15 from './assets/shapes/shape15.svg'
import shape16 from './assets/shapes/shape16.svg'
import shape17 from './assets/shapes/shape17.svg'
import shape18 from './assets/shapes/shape18.svg'
import shape19 from './assets/shapes/shape19.svg'
import shape20 from './assets/shapes/shape20.svg'
import shape21 from './assets/shapes/shape21.svg'
import shape22 from './assets/shapes/shape22.svg'
import shape23 from './assets/shapes/shape23.svg'
import shape24 from './assets/shapes/shape24.svg'
import shape25 from './assets/shapes/shape25.svg'
import shape26 from './assets/shapes/shape26.svg'
import tryNewIcon from './assets/tryNew.svg'
import Draggable from './components/Draggable'
import DroppableContainer, { DroppableIds } from './components/DroppableContainer'
import VennDiagram from './components/VennDiagram'

const DraggableContainer = styled.div`
  position: absolute;
  bottom: 50px;
  width: 100%;
  display: flex;
  justify-content: center;
  z-index: 100;
  display: grid;
  grid-template-columns: auto auto auto auto auto;
  align-content: center;
  justify-content: center;
  gap: 20px;
`

const DraggableItem = styled(Draggable)`
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

const DroppableCanvas = styled.div`
  width: 100%;
  display: flex;
  /* justify-content: center; */
  margin-left: 10%;
  position: absolute;
  top: 150px;
  left: 50px;
  user-select: none;
`

interface DraggableProps {
  shape: string
  parentId: DroppableIds
}

const DraggablesRefArr: DraggableProps[] = [
  {
    shape: shape1,
    parentId: 'left',
  },
  {
    shape: shape2,
    parentId: 'right',
  },
  {
    shape: shape3,
    parentId: 'middle',
  },
  {
    shape: shape4,
    parentId: 'right',
  },
  {
    shape: shape5,
    parentId: 'left',
  },
  {
    shape: shape6,
    parentId: 'right',
  },
  {
    shape: shape7,
    parentId: 'left',
  },
  {
    shape: shape8,
    parentId: 'left',
  },
  {
    shape: shape9,
    parentId: 'middle',
  },
  {
    shape: shape10,
    parentId: 'middle',
  },
  { shape: shape11, parentId: 'right' },
  { shape: shape12, parentId: 'left' },
  { shape: shape13, parentId: 'middle' },
  { shape: shape14, parentId: 'middle' },
  { shape: shape15, parentId: 'right' },
  { shape: shape16, parentId: 'left' },
  { shape: shape17, parentId: 'left' },
  { shape: shape18, parentId: 'right' },
  { shape: shape19, parentId: 'left' },
  { shape: shape20, parentId: 'left' },
  { shape: shape21, parentId: 'left' },
  { shape: shape22, parentId: 'left' },
  { shape: shape23, parentId: 'middle' },
  { shape: shape24, parentId: 'left' },
  { shape: shape25, parentId: 'left' },
  { shape: shape26, parentId: 'left' },
]

interface RenderDraggedProps {
  elements: DraggableProps[]
}

const Container = styled.div`
  display: flex;
  position: absolute;
  justify-content: center;
  align-items: center;
  z-index: 10;
  user-select: none;
`

const InvisibleBoxes = styled.div<{ width: number; height?: number; isMiddle?: boolean }>`
  width: ${(a) => a.width}px;
  height: ${(a) => (a.height ? a.height : 300)}px;
  /* background-color: red; */
  /* opacity: 0.4; */
  /* border: 1px solid black; */
  position: relative;
  display: grid;
  /* flex-direction: column; */
  grid-template-rows: auto auto auto auto;
  align-content: space-evenly;
  padding: 10px 40px;
  justify-content: ${(a) => (a.isMiddle ? 'center' : 'flex-start')};
  user-select: none;
`

const ShapesAfterPlacing = styled.div<{
  move: boolean
  isRightSide?: boolean
}>`
  z-index: 10;
  display: flex;
  justify-content: flex-start;
  padding-left: ${(a) => (a.move ? (a.isRightSide ? 40 : 60) : 0)}px;
  user-select: none;
`

const ShapesAfterPlacingInTheMiddle = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  height: 100%;
  gap: 10px;
  padding: 40px 0;
  user-select: none;
`

const DroppableBg = styled.div<{ isAnswerCorrect: boolean | null }>`
  position: absolute;
  margin: 0 3%;
  width: 94%;
  background-color: ${(a) =>
    a.isAnswerCorrect === null ? '#f3f7fe' : a.isAnswerCorrect ? '#ECFFD9' : '#FFECF1'};
  height: 450px;
  top: 90px;
  transition: cubic-bezier(0.075, 0.82, 0.165, 1) 0.5s;
  user-select: none;
`
const Label = styled.div<{ left: number; top: number }>`
  position: absolute;
  left: ${(a) => a.left}px;
  top: ${(a) => a.top}px;
  z-index: 20;
  user-select: none;
`

const StylizedDnDOnboardingAnimation = styled(DnDOnboardingAnimation)`
  z-index: 100;
`

const ButtonHolder = styled.div`
  position: absolute;
  width: 100%;
  display: flex;
  justify-content: center;
  bottom: 50px;
`

const Button = styled.div`
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
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
`
const BottomText = styled.div`
  text-align: center;
  font-family: Nunito;
  font-size: 24px;
  font-weight: 700;
  line-height: 32px;
  letter-spacing: 0px;
  position: absolute;
  bottom: 140px;
  width: 100%;
`

type ElementsSegregatedProps = {
  [key in DroppableIds]: DraggableProps[]
}

const RenderDraggedItems: FC<RenderDraggedProps> = ({ elements }) => {
  const resetElements: ElementsSegregatedProps = {
    left: [],
    middle: [],
    right: [],
  }
  const [elementsSegregated, setElementsSegregated] =
    useState<ElementsSegregatedProps>(resetElements)

  useEffect(() => {
    setElementsSegregated(resetElements)
    elements.map((ele) =>
      setElementsSegregated((prev) => {
        const newObj = prev
        newObj[ele.parentId].push(ele)
        return newObj
      }),
    )
  }, [elements])

  useEffect(() => {
    // console.log(elementsSegregated)
  }, [elementsSegregated])
  return (
    <Container>
      <InvisibleBoxes width={180}>
        {elementsSegregated.left.map((ele, ind) =>
          ele.parentId === 'left' ? (
            <ShapesAfterPlacing key={ind} move={ind === 0 || ind === 3}>
              <img src={ele.shape} />
            </ShapesAfterPlacing>
          ) : (
            <></>
          ),
        )}
      </InvisibleBoxes>
      <InvisibleBoxes width={118} height={240} isMiddle>
        <ShapesAfterPlacingInTheMiddle>
          {elementsSegregated.middle.map((ele, ind) =>
            ele.parentId === 'middle' ? (
              <div key={ind}>
                <img src={ele.shape} />
              </div>
            ) : (
              <></>
            ),
          )}
        </ShapesAfterPlacingInTheMiddle>
      </InvisibleBoxes>
      <InvisibleBoxes width={180}>
        {elementsSegregated.right.map((ele, ind) =>
          ele.parentId === 'right' ? (
            <ShapesAfterPlacing key={ind} move={ind === 1 || ind === 2} isRightSide>
              <img src={ele.shape} />
            </ShapesAfterPlacing>
          ) : (
            <></>
          ),
        )}
      </InvisibleBoxes>
    </Container>
  )
}

function shuffleArray(array: DraggableProps[]): DraggableProps[] {
  for (let i = array.length - 1; i > 1; i--) {
    const j = Math.floor(Math.random() * (i + 1) + 1)
    ;[array[i], array[j]] = [array[j], array[i]]
  }

  const tmpArr = []
  let numOfMiddleItems = 0
  let numOfLeftItems = 0
  let numOfRightItems = 0

  for (const shape of array) {
    if (shape.parentId === 'left') {
      if (numOfLeftItems < 4) {
        numOfLeftItems++
        tmpArr.push(shape)
      }
    } else if (shape.parentId === 'middle') {
      if (numOfMiddleItems < 3) {
        numOfMiddleItems++
        tmpArr.push(shape)
      }
    } else {
      if (numOfRightItems < 3) {
        numOfRightItems++
        tmpArr.push(shape)
      }
    }
  }

  return tmpArr
}

export const AppletG06NSC06S1GB01: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const [resetApplet, setResetApplet] = useState(0)
  const shuffledShapesMemo = useMemo(() => shuffleArray(DraggablesRefArr), [resetApplet])
  const [currentlyOver, setCurrentlyOver] = useState<DroppableIds | null>(null)
  const [draggables, setDraggables] = useState<DraggableProps[]>(shuffledShapesMemo)
  const [draggedItems, setDraggedItems] = useState<DraggableProps[]>([])
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null)
  const [hideOnboarding, setHideOnboarding] = useState(false)
  //im using this state to recalculate the shape array such that it'll shuffle every time
  // the user resets

  const playMouseIn = useSFX('mouseIn')
  const playMouseOut = useSFX('mouseOut')
  const playWronAnswerSound = useSFX('incorrect')
  const playCorrectAnswerSound = useSFX('correct')
  const playMouseClick = useSFX('mouseClick')
  const onInteraction = useContext(AnalyticsContext)

  const handleDragEnd = (e: DragEndEvent) => {
    onInteraction('drop')
    playMouseOut()
    setCurrentlyOver(null) //this state controlls the opacity of the venn digram regions
    //so on drag end im making it null

    const draggedItem = DraggablesRefArr.find((ele) => ele.shape === e.active.id)

    if (draggedItem && draggedItem.parentId === e.over?.id) {
      if (!hideOnboarding) {
        setHideOnboarding(true)
      }
      playCorrectAnswerSound()
      //checking if correct parent or not
      if (draggedItem) setDraggedItems((prev) => [...prev, draggedItem])
      setDraggables((prev) => prev.filter((ele) => ele.shape !== e.active.id))
    } else {
      setIsAnswerCorrect(false)
      playWronAnswerSound()
    }
  }

  useEffect(() => {
    if (draggables.length === 0) {
      setIsAnswerCorrect(true)
    }
  }, [draggables])

  useEffect(() => {
    if (!isAnswerCorrect) {
      const disableRedColor = setTimeout(() => {
        setIsAnswerCorrect(null)
      }, 2000)

      return () => {
        clearTimeout(disableRedColor)
      }
    }
  }, [isAnswerCorrect])

  const handleDragOver = (e: DragOverEvent) => {
    if (e.over) {
      setCurrentlyOver(e.over.id as DroppableIds)
    } else {
      setCurrentlyOver(null)
    }
  }

  const handleDragStart = () => {
    playMouseIn()
    onInteraction('drag')
  }

  const handleResetBtn = () => {
    setDraggables(shuffledShapesMemo)
    setDraggedItems([])
    playMouseClick()
    setIsAnswerCorrect(null)
    setResetApplet((prev) => prev + 1)
  }
  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#f6f6f6',
        id: 'g06-nsc06-s1-gb01',
        onEvent,
        className,
      }}
    >
      <TextHeader
        text="Place the given shapes in the Venn diagram."
        backgroundColor="#f6f6f6"
        buttonColor="#1a1a1a"
      />
      <OnboardingController>
        <DroppableBg isAnswerCorrect={isAnswerCorrect} />

        <DndContext
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
          onDragStart={handleDragStart}
          // collisionDetection={closestCorners}
        >
          <DroppableCanvas>
            <VennDiagram currentOver={currentlyOver} />
            <DroppableContainer />
            <RenderDraggedItems elements={draggedItems} />
          </DroppableCanvas>
          <DraggableContainer>
            {draggables.map((draggable, index) => (
              <DraggableItem key={index} id={draggable.shape} parentId={draggable.parentId}>
                <img src={draggable.shape} />
              </DraggableItem>
            ))}
          </DraggableContainer>
        </DndContext>
        <Label left={58} top={428}>
          <img src={leftLabel} />
        </Label>
        <Label left={330} top={118}>
          <img src={middleLabel} />
        </Label>
        <Label left={482} top={428}>
          <img src={rightLabel} />
        </Label>
        <OnboardingStep index={0}>
          <StylizedDnDOnboardingAnimation
            key={1}
            className=""
            speed={1}
            complete={hideOnboarding}
            initialPosition={{ left: 50, top: 560 }}
            finalPosition={{ left: 160, top: 200 }}
          />
        </OnboardingStep>
        {draggables.length === 0 ? (
          <>
            <BottomText>Nice job on the Venn diagram!</BottomText>
            <ButtonHolder>
              <Button onClick={handleResetBtn}>
                <img src={tryNewIcon} />
                Try new
              </Button>
            </ButtonHolder>
          </>
        ) : null}
      </OnboardingController>
    </AppletContainer>
  )
}

import { Data, DndContext } from '@dnd-kit/core'
import React, { FC, useContext, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'

import { DnDOnboardingAnimation } from '@/atoms/OnboardingAnimation'
import { OnboardingController } from '@/atoms/OnboardingController'
import { OnboardingStep } from '@/atoms/OnboardingStep'
import { useSFX } from '@/hooks/useSFX'

import { AppletContainer } from '../../common/AppletContainer'
import { TextHeader } from '../../common/Header'
import { AnalyticsContext, AppletInteractionCallback } from '../../contexts/analytics'
import ResetIcon from './assets/resetIcon.svg'
import Draggable from './components/Draggable'
import Droppable from './components/Droppable'

const DroppableContainer = styled.div`
  display: flex;
  width: 100%;
  height: 68%;
  position: absolute;
  top: 100px;
  justify-content: stretch;
  align-items: stretch;
  padding: 0 20px;
  gap: 5px;
`
const DroppableColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 10px;
  flex: 1;
`

const DroppableTarget = styled(Droppable)<{ borderColor: string }>`
  border: ${(props) => `1px solid ${props.borderColor}`};
`

const DroppableTitle = styled.div<{ bgColor: string }>`
  color: white;
  background-color: ${(props) => props.bgColor};
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: Nunito;
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  border-radius: 5px;
  padding: 10px;
  user-select: none;
`

const DraggableContainer = styled.div`
  position: absolute;
  bottom: 50px;
  width: 100%;
  display: flex;
  justify-content: center;
`

const Button = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 16px;
  border-radius: 10px;
  border: 2px solid #212121;
  background: var(--monotone-500, #fff);
  padding: 10px 20px;
  font-family: Nunito;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: 24px; /* 150% */
  color: #212121;
  position: absolute;
  bottom: 30px;
  cursor: pointer;
`

const DraggableItem = styled(Draggable)<{ bgColor: string; borderColor: string; isFixed: boolean }>`
  background-color: ${(props) => props.bgColor};
  border: ${(props) => `1px solid ${props.borderColor}`};
  font-family: Nunito;
  user-select: none;
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  color: #444;
  line-height: normal;
  padding: 10px 20px;
  cursor: grab;
  border-radius: 5px;
  width: ${(props) => (props.isFixed ? '100%' : 'auto')};
  :active {
    cursor: grabbing;
  }
`

const BottomText = styled.div`
  position: absolute;
  width: 100%;
  padding: 10px 30px;
  bottom: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--monotone-100, #444);
  text-align: center;
  /* Sub heading/Bold */
  font-family: Nunito;
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
`

//rendering the child inside the droppable
const ChildDivsAfterDragging = styled.div<{
  bgColor: string
  borderColor: string
  isFixed: boolean
}>`
  background-color: ${(props) => props.bgColor};
  border: ${(props) => `1px solid ${props.borderColor}`};
  color: ${(props) => props.borderColor};
  font-family: Nunito;
  font-size: 19px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  padding: 10px 20px;
  border-radius: 5px;
  width: ${(props) => (props.isFixed ? '100%' : 'auto')};
  text-align: center;
  margin-bottom: 10px;
  user-select: none;
`

type Heading = 'Addition' | 'Subtraction' | 'Multiplication' | 'Division'

interface TitleProps {
  title: Heading
  color: string
  children?: React.ReactNode[]
}

interface DraggableProps {
  title: string
  bgColor: string
  borderColor: string
  parentId: Heading
}
const TITLES: TitleProps[] = [
  { title: 'Addition', color: '#FF9A9A', children: [] },
  { title: 'Subtraction', color: '#41D98D', children: [] },
  { title: 'Multiplication', color: '#C882FA', children: [] },
  { title: 'Division', color: '#81B3FF', children: [] },
]

const DRAGGABLES: DraggableProps[] = [
  { title: 'Added to', parentId: 'Addition', bgColor: '#FFD1D1', borderColor: '#CC6666' },
  { title: 'Sum of', parentId: 'Addition', bgColor: '#FFD1D1', borderColor: '#CC6666' },
  { title: 'Plus', parentId: 'Addition', bgColor: '#FFD1D1', borderColor: '#CC6666' },
  { title: 'More than', parentId: 'Addition', bgColor: '#FFD1D1', borderColor: '#CC6666' },
  { title: 'Total of', parentId: 'Addition', bgColor: '#FFD1D1', borderColor: '#CC6666' },
  { title: 'Increased by', parentId: 'Addition', bgColor: '#FFD1D1', borderColor: '#CC6666' },
  { title: 'Subtracted from', parentId: 'Subtraction', bgColor: '#cfd', borderColor: '#32A66C' },
  { title: 'Difference of', parentId: 'Subtraction', bgColor: '#cfd', borderColor: '#32A66C' },
  { title: 'Less than', parentId: 'Subtraction', bgColor: '#cfd', borderColor: '#32A66C' },
  { title: 'Take away', parentId: 'Subtraction', bgColor: '#cfd', borderColor: '#32A66C' },
  { title: 'Decreased by', parentId: 'Subtraction', bgColor: '#cfd', borderColor: '#32A66C' },
  { title: 'Fewer than', parentId: 'Subtraction', bgColor: '#cfd', borderColor: '#32A66C' },
  {
    title: 'Multiplied by',
    parentId: 'Multiplication',
    bgColor: '#FAF2FF',
    borderColor: '#AA5EE0',
  },
  { title: 'Product of', parentId: 'Multiplication', bgColor: '#FAF2FF', borderColor: '#AA5EE0' },
  { title: 'Twice of', parentId: 'Multiplication', bgColor: '#FAF2FF', borderColor: '#AA5EE0' },
  { title: 'Divided by', parentId: 'Division', bgColor: '#E8F0FE', borderColor: '#6595DE' },
  { title: 'Quotient of', parentId: 'Division', bgColor: '#E8F0FE', borderColor: '#6595DE' },
]

function shuffleArray(array: any[]) {
  for (let i = array.length - 1; i > 1; i--) {
    const j = Math.floor(Math.random() * (i + 1) + 1)
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

//props fot the child inside the droppable
interface DraggableAfterDraggingProps {
  title: string
  bgColor: string
  borderColor: string
}

const ChildDivsInsideColumns: FC<DraggableAfterDraggingProps> = ({
  title,
  bgColor,
  borderColor,
}) => {
  return (
    <ChildDivsAfterDragging isFixed bgColor={bgColor} borderColor={borderColor}>
      {title}
    </ChildDivsAfterDragging>
  )
}

export const AppletG06EEC02GB01: React.FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const shuffledArray = useMemo(() => shuffleArray(DRAGGABLES), [])
  const [currentDraggableIndex, setCurrentDraggableIndex] = useState<number>(0)
  const activeDraggable: DraggableProps = shuffledArray[currentDraggableIndex]
  const [droppableData, setDroppableData] = useState<TitleProps[]>(
    JSON.parse(JSON.stringify(TITLES)),
  )
  //I had to do this because copying was causing problems while reloading
  const onInteraction = useContext(AnalyticsContext)
  //sound
  const playMouseIn = useSFX('mouseIn')
  const playMouseOut = useSFX('mouseOut')
  const playWronAnswerSound = useSFX('incorrect')
  const playCorrectAnswerSound = useSFX('correct')
  const playMouseClick = useSFX('mouseClick')

  function handleDragEnd({ over }: Data) {
    onInteraction('drop')
    if (over.id === activeDraggable.parentId) {
      //placed in correct column
      playCorrectAnswerSound()
      setDroppableData((prev) => {
        const index = prev.findIndex((item) => item.title === over.id)
        const newDroppableData = [...prev]
        newDroppableData[index].children?.push(
          <ChildDivsInsideColumns
            title={activeDraggable.title}
            bgColor={activeDraggable.bgColor}
            borderColor={activeDraggable.borderColor}
            key={activeDraggable.title}
          />,
        )
        return newDroppableData
      })
      setCurrentDraggableIndex((prev) => prev + 1)
    } else {
      //placed in wrong column
      playWronAnswerSound()
    }
  }

  function handleDragStart() {
    onInteraction('drag')
    playMouseIn()
  }

  function handleDragCancel() {
    playMouseOut()
  }

  const handleResetBtn = () => {
    playMouseClick()
    onInteraction('tap')
    setCurrentDraggableIndex(0)
    setDroppableData((prev) => {
      const childrenRemoved = prev.map((title) => ({ ...title, children: [] }))
      return childrenRemoved
    })
  }
  useEffect(() => {
    // console.log(prev=>prev.map(title=>{...title,children:[]}))
  }, [droppableData])

  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#F6F6F6',
        id: 'G06EEC02GB01',
        onEvent,
        className,
        themeName: 'dark',
      }}
    >
      <TextHeader
        text="Classify the phrases into the appropriate groups based on their usage for the given mathematical operations."
        backgroundColor="#F6F6F6"
        buttonColor="#1A1A1A"
      />
      <OnboardingController>
        <DndContext
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
          onDragStart={handleDragStart}
        >
          <DroppableContainer>
            {droppableData.map((ele) => (
              <DroppableColumn key={ele.title}>
                <DroppableTitle bgColor={ele.color}>{ele.title}</DroppableTitle>
                <DroppableTarget id={ele.title} borderColor={ele.color}>
                  {ele.children?.map((child) => child)}
                </DroppableTarget>
              </DroppableColumn>
            ))}
          </DroppableContainer>

          {currentDraggableIndex < DRAGGABLES.length ? (
            <DraggableContainer>
              <DraggableItem
                parentId={activeDraggable.parentId}
                isFixed={false}
                id={activeDraggable.title}
                bgColor="#E7FBFF"
                borderColor="#2AD3F5"
              >
                {activeDraggable.title}
              </DraggableItem>
            </DraggableContainer>
          ) : (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Button onClick={handleResetBtn}>
                <img src={ResetIcon} />
                Reset
              </Button>
            </div>
          )}
        </DndContext>
        {currentDraggableIndex >= DRAGGABLES.length ? (
          <BottomText>
            <>
              Great work! You nailed the classification of phrases based on mathematical operations
            </>
            :
          </BottomText>
        ) : null}
        <OnboardingStep index={0}>
          <DnDOnboardingAnimation
            key={1}
            className=""
            speed={1}
            complete={currentDraggableIndex !== 0}
            initialPosition={{ left: 300, top: 660 }}
            finalPosition={{ left: 50, top: 110 }}
          />
        </OnboardingStep>
      </OnboardingController>
    </AppletContainer>
  )
}

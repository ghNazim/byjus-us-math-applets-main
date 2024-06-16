import { Data, DndContext } from '@dnd-kit/core'
import { FC, useContext, useMemo, useState } from 'react'
import styled from 'styled-components'

import { DnDOnboardingAnimation } from '@/atoms/OnboardingAnimation'
import { OnboardingController } from '@/atoms/OnboardingController'
import { OnboardingStep } from '@/atoms/OnboardingStep'
import { AppletContainer } from '@/common/AppletContainer'
import { TextHeader } from '@/common/Header'
import { AnalyticsContext, AppletInteractionCallback } from '@/contexts/analytics'
import { useSFX } from '@/hooks/useSFX'

import CategoricalData from './assets/categoricalDaTA.svg'
import NumericalDataLabel from './assets/numericalData.svg'
import ResetIcon from './assets/resetIcon.svg'
import Draggable from './components/Draggable'
import DroppableContainer from './components/DroppableContainer'

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
  bottom: 50px;
  cursor: pointer;
`

const DraggableItem = styled(Draggable)<{ isFixed: boolean }>`
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
  width: ${(props) => (props.isFixed ? '100%' : 'auto')};
  :active {
    cursor: grabbing;
  }
`

//rendering the child inside the droppable
const ChildDivsAfterDragging = styled.div<{
  bgColor: string
  isFixed: boolean
}>`
  font-weight: 400;
  background-color: ${(props) => props.bgColor};
  color: #212121;
  font-family: Nunito;
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  padding: 10px 20px;
  border-radius: 5px;
  width: ${(props) => (props.isFixed ? '100%' : 'auto')};
  text-align: center;
  margin-bottom: 10px;
  user-select: none;
  /* margin: 0 30px; */
`

const BottomText = styled.div`
  position: absolute;
  width: 100%;
  padding: 10px 30px;
  bottom: 120px;
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

type Heading = 'Number' | 'Not a number'

interface TitleProps {
  title: Heading
  titleColor: string
  bodyColor: string
  children?: React.ReactNode[]
}

interface DraggableProps {
  title: string
  bgColor: string
  parentId: Heading
}
const TITLES: TitleProps[] = [
  { title: 'Number', titleColor: '#C882FA', children: [], bodyColor: '#FAF2FF' },
  { title: 'Not a number', titleColor: '#81B3FF', children: [], bodyColor: '#F3F7FE' },
]

const LabelContainer = styled.div`
  position: absolute;
  display: flex;
  justify-content: space-around;
  bottom: 320px;
  width: 100%;
`

const DRAGGABLES: DraggableProps[] = [
  { title: 'Age = 15', parentId: 'Number', bgColor: '#F4E5FF' },
  { title: 'Height = 160 cm', parentId: 'Number', bgColor: '#F4E5FF' },
  { title: 'Weight = 40 kg', parentId: 'Number', bgColor: '#F4E5FF' },
  { title: 'Name = Jack', parentId: 'Not a number', bgColor: '#E8F0FE' },
  { title: 'Color = Green', parentId: 'Not a number', bgColor: '#E8F0FE' },
  { title: 'Pet = Dog', parentId: 'Not a number', bgColor: '#E8F0FE' },
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
}

const ChildDivsInsideColumns: FC<DraggableAfterDraggingProps> = ({ title, bgColor }) => {
  return (
    <ChildDivsAfterDragging isFixed bgColor={bgColor}>
      {title}
    </ChildDivsAfterDragging>
  )
}

export const AppletG06SPC01S1GB01: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const shuffledArray = useMemo(() => shuffleArray(DRAGGABLES), [])
  const [currentDraggableIndex, setCurrentDraggableIndex] = useState<number>(0)
  const [droppableData, setDroppableData] = useState<TitleProps[]>(
    JSON.parse(JSON.stringify(TITLES)),
  )
  //I had to do this because copying was causing problems while reloading
  const activeDraggable: DraggableProps = shuffledArray[currentDraggableIndex]
  const onInteraction = useContext(AnalyticsContext)
  //sound
  const playMouseIn = useSFX('mouseIn')
  const playMouseOut = useSFX('mouseOut')
  const playWronAnswerSound = useSFX('incorrect')
  const playCorrectAnswerSound = useSFX('correct')
  const playMouseClick = useSFX('mouseClick')

  function handleDragStart() {
    onInteraction('drag')
    playMouseIn()
  }

  function handleDragCancel() {
    playMouseOut()
  }
  const handleDragEnd = ({ over }: Data) => {
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

  const handleResetBtn = () => {
    playMouseClick()
    onInteraction('tap')
    setCurrentDraggableIndex(0)
    setDroppableData((prev) => {
      const childrenRemoved = prev.map((title) => ({ ...title, children: [] }))
      return childrenRemoved
    })
  }
  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#f6f6f6',
        id: 'g06-spc01-s1-gb01',
        onEvent,
        className,
      }}
    >
      <TextHeader
        text="Explore different types of data."
        backgroundColor="#f6f6f6"
        buttonColor="#1a1a1a"
      />
      <OnboardingController>
        <DndContext
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
          onDragStart={handleDragStart}
        >
          <DroppableContainer droppableData={droppableData} />
          {currentDraggableIndex < DRAGGABLES.length ? (
            <>
              <DraggableContainer>
                <DraggableItem
                  parentId={activeDraggable.parentId}
                  isFixed={false}
                  id={activeDraggable.title}
                >
                  {activeDraggable.title}
                </DraggableItem>
              </DraggableContainer>
              <BottomText>Categorize the data into their respective bins.</BottomText>
              <OnboardingStep index={0}>
                <DnDOnboardingAnimation
                  key={1}
                  className=""
                  speed={1}
                  complete={currentDraggableIndex !== 0}
                  initialPosition={{ left: 300, top: 660 }}
                  finalPosition={{ left: 90, top: 110 }}
                />
              </OnboardingStep>
            </>
          ) : (
            <>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Button onClick={handleResetBtn}>
                  <img src={ResetIcon} />
                  Reset
                </Button>
              </div>
              <BottomText>Perfect! You have categorized the data. </BottomText>
              <LabelContainer>
                <img src={NumericalDataLabel} alt="numerical data" />
                <img src={CategoricalData} alt="categorical data" />
              </LabelContainer>
            </>
          )}
        </DndContext>
      </OnboardingController>
    </AppletContainer>
  )
}

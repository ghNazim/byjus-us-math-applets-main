import { DndContext, DragEndEvent, DragMoveEvent, DragOverlay, DragStartEvent } from '@dnd-kit/core'
import { FC, useEffect, useMemo, useReducer, useState } from 'react'
import { createPortal } from 'react-dom'

import { useContentScale } from '@/atoms/ContentScaler/ContentScaler'
import { DnDOnboardingAnimation } from '@/atoms/OnboardingAnimation'
import { OnboardingStep } from '@/atoms/OnboardingStep'
import { useSFX } from '@/hooks/useSFX'
import { interleave, shuffle } from '@/utils/array'
import { sum } from '@/utils/math'

import {
  animalImages,
  AnimalZone,
  Container,
  CtaButton,
  CtaContainer,
  DraggablesContainer,
  FeedbackContainer,
  HighlightedExpression,
  InteractionContainer,
  ReviewTotalGrid,
  VisualArea,
  WhiteTotalCell,
} from './Applet.styles'
import { Animal } from './Applet.types'
import resetIcon from './assets/reset.svg'
import tryNewIcon from './assets/try-new.svg'
import { animalWeights } from './data'
import { Draggable, Droppable } from './DnDHelper'
import { InfoPopup } from './InfoButton'
import { ReviewTable } from './ReviewTable'

const CTA_TEXT = {
  default: 'Check',
  correct: (
    <>
      <img src={tryNewIcon} alt="try-new=icon" /> Try new
    </>
  ),
  incorrect: (
    <>
      <img src={resetIcon} alt="reset-icon" /> Reset
    </>
  ),
}

interface State {
  checkStatus: 'default' | 'correct' | 'incorrect'
  currentAnimals: Array<Animal | null>
  counts: Array<{ animal: Animal; count: number }>
}

const initialState: State = (() => {
  // choose 6 animals with atleast 1 each of cat, dog and rabbit
  const randomAnimals = shuffle(Object.keys(animalWeights) as Animal[])
  const counts: Array<{ animal: Animal; count: number }> = []
  for (let i = 0; i < randomAnimals.length; i++) {
    const total = sum(counts.map(({ count }) => count))
    const remaining = 6 - total
    const randomCount = i === 2 ? remaining : Math.floor(Math.random() * Math.min(3, remaining)) + 1
    counts.push({ animal: randomAnimals[i], count: randomCount })
  }
  return {
    checkStatus: 'default',
    currentAnimals: [null, null, null, null, null, null],
    counts,
  }
})()

function findAnimalCheckStatus(
  animals: State['currentAnimals'],
  counts: State['counts'],
): Array<State['checkStatus']> {
  const tempCounts = new Map<Animal, number>(counts.map(({ animal, count }) => [animal, count]))
  return animals.map((animal) => {
    if (animal) {
      const count = tempCounts.get(animal)
      if (count && count > 0) {
        // If count is 0 -> this animal is incorrect.
        tempCounts.set(animal, count - 1)
        return 'correct'
      }

      return 'incorrect'
    }
    return 'default'
  })
}

type Action = { type: 'cta' } | { type: 'drop'; payload: Animal; index: number }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'cta': {
      // Check
      if (state.checkStatus === 'default') {
        const currentCounts = state.currentAnimals.reduce(
          (acc, animal) => {
            if (animal) {
              acc[animal]++
            }
            return acc
          },
          { cat: 0, dog: 0, rabbit: 0 },
        )
        return {
          ...state,
          checkStatus: state.counts.every(({ animal, count }) => currentCounts[animal] === count)
            ? 'correct'
            : 'incorrect',
        }
      }
      if (state.checkStatus === 'incorrect') {
        const currentStatus = findAnimalCheckStatus(state.currentAnimals, state.counts)
        const currentAnimals = state.currentAnimals.map((animal, i) =>
          currentStatus[i] === 'correct' ? animal : null,
        )

        return {
          ...state,
          checkStatus: 'default',
          currentAnimals,
        }
      }

      return state
    }
    case 'drop': {
      const currentAnimals = [...state.currentAnimals]
      currentAnimals[action.index] = action.payload
      return {
        ...state,
        currentAnimals,
      }
    }
    default:
      return state
  }
}

export const TableDnDQuestionPage: FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const playDrag = useSFX('mouseIn')
  const playDrop = useSFX('mouseOut')
  const playClick = useSFX('mouseClick')
  const playCorrect = useSFX('correct')
  const playIncorrect = useSFX('incorrect')
  const scale = useContentScale()
  const [state, dispatch] = useReducer(reducer, initialState)
  const [dragAnimal, setDragAnimal] = useState<Animal | null>(null)
  const [dragHoverIndex, setDragHoverIndex] = useState<number | null>(null)

  const currentAnimalCheckStatus = useMemo(
    () => findAnimalCheckStatus(state.currentAnimals, state.counts),
    [state.counts, state.currentAnimals],
  )

  const handleDragStart = (event: DragStartEvent) => {
    playDrag()
    setDragAnimal(event.active.id as Animal)
  }
  const handleDragMove = (event: DragMoveEvent) => {
    const { over } = event
    if (over) {
      const index = Number(over.id)
      if (dragHoverIndex !== index) {
        setDragHoverIndex(index)
      }
    }
  }
  const handleDragEnd = (event: DragEndEvent) => {
    playDrop()
    const { active, over } = event
    if (over) {
      const index = Number(over.id)
      dispatch({ type: 'drop', payload: active.id as Animal, index })
    }
    setDragAnimal(null)
    setDragHoverIndex(null)
  }

  useEffect(() => {
    if (state.checkStatus === 'correct') {
      playCorrect()
    }
    if (state.checkStatus === 'incorrect') {
      playIncorrect()
    }
  }, [playCorrect, playIncorrect, state.checkStatus])

  return (
    <Container>
      <DndContext
        onDragStart={handleDragStart}
        onDragMove={handleDragMove}
        onDragEnd={handleDragEnd}
      >
        <InfoPopup>
          <VisualArea showGreenBackground={state.checkStatus === 'correct'}>
            <ReviewTable />
            <ReviewTotalGrid>
              <WhiteTotalCell>Animals</WhiteTotalCell>
              <WhiteTotalCell>No. of sandbags</WhiteTotalCell>
              <WhiteTotalCell>
                {state.checkStatus === 'correct'
                  ? state.currentAnimals.map((animal, i) => (
                      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- we know it's not null
                      <AnimalZone key={i} animal={animal!}>
                        {animal && <img src={animalImages[animal]} />}
                      </AnimalZone>
                    ))
                  : state.currentAnimals.map((animal, i) => (
                      <Droppable
                        id={i}
                        key={i}
                        showWrong={
                          state.checkStatus === 'incorrect' &&
                          currentAnimalCheckStatus[i] === 'incorrect'
                        }
                      >
                        {i === dragHoverIndex && dragAnimal != null ? (
                          <img src={animalImages[dragAnimal]} data-is-over={i === dragHoverIndex} />
                        ) : (
                          animal && <img src={animalImages[animal]} />
                        )}
                      </Droppable>
                    ))}
              </WhiteTotalCell>
              <WhiteTotalCell>
                {[
                  ...interleave(
                    state.counts.map(({ animal, count }) => (
                      <HighlightedExpression key={`${animal}`} animal={animal}>
                        {count} × {animalWeights[animal]}
                      </HighlightedExpression>
                    )),
                    Array.from({ length: 2 }, (_, i) => (
                      <span style={{ margin: '0px 6px' }} key={2 + i}>
                        +
                      </span>
                    )),
                  ),
                ]}
              </WhiteTotalCell>
            </ReviewTotalGrid>
          </VisualArea>
        </InfoPopup>
        <FeedbackContainer>
          {state.checkStatus === 'correct'
            ? 'Awesome! You have filled the table correctly.'
            : state.checkStatus === 'incorrect'
            ? 'Uh-oh! Check the number of sandbags per animal and try again.'
            : 'Place the animals to match the given mathematical representation.'}
        </FeedbackContainer>
        <InteractionContainer>
          {state.checkStatus === 'default' && (
            <DraggablesContainer>
              {(Object.keys(animalWeights) as Animal[]).map((animal) => (
                <Draggable key={animal} id={animal}>
                  <img src={animalImages[animal]} draggable={false} />
                </Draggable>
              ))}
            </DraggablesContainer>
          )}
        </InteractionContainer>
        {createPortal(
          <DragOverlay adjustScale style={{ scale }}>
            {dragAnimal && (
              <img
                style={{ width: 60, height: 60 }}
                src={animalImages[dragAnimal]}
                draggable={false}
              />
            )}
          </DragOverlay>,
          document.body,
        )}
        <CtaContainer>
          <CtaButton
            onClick={() => {
              playClick()
              state.checkStatus === 'correct' ? onComplete?.() : dispatch({ type: 'cta' })
            }}
            disabled={state.currentAnimals.some((animal) => animal === null)}
          >
            {CTA_TEXT[state.checkStatus]}
          </CtaButton>
        </CtaContainer>
        <OnboardingStep index={4}>
          <DnDOnboardingAnimation
            initialPosition={{ left: 190, top: 580 }}
            finalPosition={{ left: 20, top: 360 }}
            complete={state.currentAnimals.some(Boolean)}
          />
        </OnboardingStep>
      </DndContext>
    </Container>
  )
}

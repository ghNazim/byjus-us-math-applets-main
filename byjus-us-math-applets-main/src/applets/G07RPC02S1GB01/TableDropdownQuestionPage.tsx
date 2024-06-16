import { FC, useEffect, useMemo, useReducer } from 'react'

import { OnboardingStep } from '@/atoms/OnboardingStep'
import { useSFX } from '@/hooks/useSFX'
import { Dropdown } from '@/molecules/Dropdown'
import { interleave, shuffle } from '@/utils/array'

import {
  animalImages,
  Container,
  CtaButton,
  CtaContainer,
  FeedbackContainer,
  HighlightedExpression,
  InteractionContainer,
  ReviewTotalGrid,
  VisualArea,
  WhiteTotalCell,
} from './Applet.styles'
import { Animal } from './Applet.types'
import { animalWeights } from './data'
import { InfoPopup } from './InfoButton'
import { ReviewTable } from './ReviewTable'

interface State {
  activeIndex: number
  selectedIndex: number
  checkStatus: 'default' | 'correct' | 'incorrect'
  // Random order of animals
  counts: Array<{ animal: Animal; count: number }>
}

type Action = { type: 'cta' } | { type: 'select'; index: number }

const initialState: State = (() => {
  const randomAnimalCounts = shuffle(Object.keys(animalWeights) as Animal[]).map((animal) => ({
    animal,
    count: Math.round(Math.random() * 2) + 1,
  }))

  return {
    activeIndex: 0,
    selectedIndex: -1,
    checkStatus: 'default',
    counts: randomAnimalCounts,
  }
})()

const animalOrder = ['cat', 'dog', 'rabbit']

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'cta': {
      // Check
      const isCorrect = state.counts[state.activeIndex].animal === animalOrder[state.selectedIndex]
      return {
        ...state,
        selectedIndex: isCorrect ? -1 : state.selectedIndex,
        activeIndex: isCorrect ? state.activeIndex + 1 : state.activeIndex,
        checkStatus: isCorrect ? 'default' : 'incorrect',
      }
    }
    case 'select': {
      return {
        ...state,
        selectedIndex: action.index,
        checkStatus: 'default',
      }
    }
  }
}

export const TableDropdownQuestionPage: FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const playClick = useSFX('mouseClick')
  const playCorrect = useSFX('correct')
  const playIncorrect = useSFX('incorrect')
  useEffect(() => {
    if (
      state.checkStatus === 'correct' ||
      (state.activeIndex > 0 && state.checkStatus === 'default')
    )
      playCorrect()
    if (state.checkStatus === 'incorrect') playIncorrect()
  }, [state.checkStatus, playCorrect, playIncorrect, state.activeIndex])

  const inputs = useMemo(() => {
    const operands = state.counts.map(({ animal, count }, i) =>
      i < state.activeIndex ? (
        <HighlightedExpression key={`${animal}`} animal={animal}>
          {count} × {animalWeights[animal]}
        </HighlightedExpression>
      ) : i === 0 ? (
        <OnboardingStep index={3} key={`${animal}`}>
          <Dropdown
            dropDownArray={Object.values(animalWeights).map((weight) => (
              <span key={weight} style={{ whiteSpace: 'nowrap' }}>
                {count} × {weight}
              </span>
            ))}
            disabled={state.activeIndex !== i}
            value={i === state.activeIndex ? state.selectedIndex : -1}
            onValueChange={(value) => dispatch({ type: 'select', index: value })}
            checkStatus={state.activeIndex === i ? state.checkStatus : 'default'}
            position="bottom"
          />
        </OnboardingStep>
      ) : (
        <Dropdown
          key={`${animal}`}
          dropDownArray={Object.values(animalWeights).map((weight) => (
            <span key={weight} style={{ whiteSpace: 'nowrap' }}>
              {count} × {weight}
            </span>
          ))}
          disabled={state.activeIndex !== i}
          value={i === state.activeIndex ? state.selectedIndex : -1}
          onValueChange={(value) => dispatch({ type: 'select', index: value })}
          checkStatus={state.activeIndex === i ? state.checkStatus : 'default'}
          position="bottom"
        />
      ),
    )

    return [
      ...interleave(
        operands,
        Array.from({ length: operands.length - 1 }, (_, i) => (
          <span style={{ margin: '0px 6px' }} key={operands.length + i}>
            +
          </span>
        )),
      ),
    ]
  }, [state.activeIndex, state.checkStatus, state.counts, state.selectedIndex])

  return (
    <Container>
      <InfoPopup>
        <VisualArea>
          <ReviewTable />
          <ReviewTotalGrid>
            <WhiteTotalCell>Animals</WhiteTotalCell>
            <WhiteTotalCell>No. of sandbags</WhiteTotalCell>
            <WhiteTotalCell style={{ flexShrink: 1 }}>
              {state.counts.flatMap(({ animal, count }, i) => {
                const animalImage = animalImages[animal]
                return Array.from({ length: count }).map((_, j) => (
                  <img
                    src={animalImage}
                    data-animal={animal}
                    data-disable={
                      state.activeIndex < 3 && animal !== state.counts[state.activeIndex].animal
                    }
                    key={`${animal}-${i}-${j}`}
                  />
                ))
              })}
            </WhiteTotalCell>
            <WhiteTotalCell>{inputs}</WhiteTotalCell>
          </ReviewTotalGrid>
        </VisualArea>
      </InfoPopup>
      <FeedbackContainer>
        {state.activeIndex < 3
          ? state.checkStatus === 'incorrect'
            ? `Check the number of sandbags per ${
                state.counts[state.activeIndex].animal
              } and try again.`
            : 'Select the correct option to fill the table.'
          : 'Awesome! You have filled the table correctly.'}
      </FeedbackContainer>
      <InteractionContainer></InteractionContainer>
      <CtaContainer>
        <CtaButton
          onClick={() => {
            playClick()
            state.activeIndex >= 3 ? onComplete?.() : dispatch({ type: 'cta' })
          }}
          disabled={state.activeIndex < 3 && state.selectedIndex === -1}
        >
          {state.activeIndex >= 3 ? 'Next' : 'Check'}
        </CtaButton>
      </CtaContainer>
    </Container>
  )
}

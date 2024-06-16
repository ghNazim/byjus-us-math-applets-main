import { FC, useEffect, useMemo, useReducer, useState } from 'react'

import { OnboardingStep } from '@/atoms/OnboardingStep'
import { useInterval } from '@/hooks/useInterval'
import { useSFX } from '@/hooks/useSFX'
import { AnimatedWeighingScale } from '@/molecules/AnimatedWeighingScale'
import { StepInput } from '@/molecules/StepInput'
import { cumsum } from '@/utils/math'

import {
  Container,
  CtaButton,
  CtaContainer,
  FeedbackContainer,
  InteractionContainer,
  PanAnimalContainer,
  PanImage,
  VisualArea,
} from './Applet.styles'
import { Animal } from './Applet.types'
import visualizeIcon from './assets/visualize.svg'
import { animalWeights } from './data'
import { InfoButton, InfoContent, InfoPopup } from './InfoButton'
import { ReviewTable } from './ReviewTable'
import { ReviewTotalTable } from './ReviewTotalTable'
import { Sandbags } from './Sandbags'

interface State {
  subPage: 0 | 1
  checkStatus: 'default' | 'correct' | 'incorrect'
  counts: {
    cat: number
    dog: number
    rabbit: number
  }
  totalWeight: number
  currentWeight: number
}

const initialState: State = {
  subPage: 0,
  checkStatus: 'default',
  counts: {
    cat: 0,
    dog: 0,
    rabbit: 0,
  },
  totalWeight: 0,
  currentWeight: 0,
}

type Action =
  | { type: 'cta' }
  | { type: 'weightChange'; value: number }
  | { type: 'initialize'; possibleAnimalTypes: 1 | 2 | 3 }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'cta': {
      // Check
      if (state.subPage === 0 && state.checkStatus !== 'correct') {
        return {
          ...state,
          checkStatus: state.currentWeight === state.totalWeight ? 'correct' : 'incorrect',
        }
      }

      // Next
      if (state.subPage === 0 && state.checkStatus === 'correct') {
        return {
          ...state,
          subPage: 1,
        }
      }

      return state
    }

    case 'weightChange': {
      return {
        ...state,
        checkStatus: 'default',
        currentWeight: action.value,
      }
    }
    case 'initialize': {
      // The counts are initialized to a random number between 1 and 3
      // The possible animal types determines which animals are possible
      // 1 = cat only or dog only or rabbit only
      // 2 = cat and dog or cat and rabbit or dog and rabbit
      // 3 = cat and dog and rabbit

      state = { ...initialState }

      // If 1,then lets us randomly choose one animal and assign it to either 2 or 3.
      if (action.possibleAnimalTypes === 1) {
        const randomAnimal = Object.keys(animalWeights)[Math.floor(Math.random() * 3)] as Animal
        const randomAnimalCount = Math.round(Math.random()) + 2

        return {
          ...state,
          counts: {
            ...state.counts,
            [randomAnimal]: randomAnimalCount,
          },
          totalWeight: randomAnimalCount * animalWeights[randomAnimal],
        }
      }

      // If 2, then lets us randomly choose two animals and assign counts.
      if (action.possibleAnimalTypes === 2) {
        const randomAnimals = Object.keys(animalWeights)
          .sort(() => Math.random() - 0.5)
          .slice(0, 2) as Animal[]

        const randomAnimalCounts = randomAnimals.map(() => Math.round(Math.random() * 2) + 1)

        return {
          ...state,
          counts: {
            ...state.counts,
            [randomAnimals[0]]: randomAnimalCounts[0],
            [randomAnimals[1]]: randomAnimalCounts[1],
          },
          totalWeight:
            randomAnimalCounts[0] * animalWeights[randomAnimals[0]] +
            randomAnimalCounts[1] * animalWeights[randomAnimals[1]],
        }
      }

      // If 3, then lets us assign counts.
      if (action.possibleAnimalTypes === 3) {
        const randomAnimalCounts = Object.keys(state.counts).map(
          () => Math.round(Math.random() * 2) + 1,
        )

        return {
          ...state,
          counts: {
            ...state.counts,
            cat: randomAnimalCounts[0],
            dog: randomAnimalCounts[1],
            rabbit: randomAnimalCounts[2],
          },
          totalWeight:
            randomAnimalCounts[0] * animalWeights.cat +
            randomAnimalCounts[1] * animalWeights.dog +
            randomAnimalCounts[2] * animalWeights.rabbit,
        }
      }

      return state
    }
  }
}

export const ScaleQuestionPage: FC<{ possibleAnimalTypes: 1 | 2 | 3; onComplete: () => void }> = ({
  possibleAnimalTypes,
  onComplete,
}) => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const animals = useMemo(
    () =>
      (Object.keys(state.counts) as Animal[]).flatMap((animal) =>
        Array.from({ length: state.counts[animal] }, () => animal),
      ),
    [state.counts],
  )
  const [playHighlight, setPlayHighlight] = useState(false)
  const [animalHighlightIndex, setAnimalHighlightIndex] = useState(-1)

  const playClick = useSFX('mouseClick')
  const playCorrect = useSFX('correct')
  const playIncorrect = useSFX('incorrect')

  const cumulativeAnimalWeights = useMemo(
    () => cumsum(animals.map((animal) => animalWeights[animal])),
    [animals],
  )
  const incorrectAnimals = useMemo(
    () => animals.map((_, i) => cumulativeAnimalWeights[i] > state.currentWeight),
    [animals, cumulativeAnimalWeights, state.currentWeight],
  )
  const firstIncorrectAnimalIndex = useMemo(
    () => incorrectAnimals.indexOf(true),
    [incorrectAnimals],
  )

  useEffect(() => dispatch({ type: 'initialize', possibleAnimalTypes }), [possibleAnimalTypes])
  useEffect(() => setPlayHighlight(state.checkStatus === 'incorrect'), [state.checkStatus])
  useEffect(() => {
    if (playHighlight) setAnimalHighlightIndex(-1)
  }, [playHighlight])
  useInterval(
    () =>
      setAnimalHighlightIndex((i) =>
        // When extra sandbags are present i.e, the input weight is more than needed
        // - the animation should play one more tick
        (state.totalWeight < state.currentWeight && i === animals.length) ||
        // When the input weight is less than the needed weight
        // - the animation should play one more tick more than the first incorrect animal
        (state.totalWeight > state.currentWeight && i === firstIncorrectAnimalIndex + 1)
          ? -1
          : i + 1,
      ),
    playHighlight ? 1600 : null,
  )
  useEffect(() => {
    if (state.checkStatus === 'correct') playCorrect()
    if (state.checkStatus === 'incorrect') playIncorrect()
  }, [state.checkStatus, playCorrect, playIncorrect])

  const extraCount =
    state.checkStatus === 'incorrect' ? Math.max(state.currentWeight - state.totalWeight, 0) : 0
  const incorrectCount =
    state.checkStatus === 'incorrect' && state.currentWeight < state.totalWeight
      ? incorrectAnimals.reduce((acc, incorrect, i) => {
          const animalWeight = animalWeights[animals[i]]
          if (incorrect) return acc
          const remaining = acc - animalWeight
          return remaining
        }, state.currentWeight)
      : 0
  const leftPanContent = useMemo(() => {
    return (
      <PanAnimalContainer>
        {animals.map((animal, i) => (
          <PanImage
            key={`${animal}-${i}`}
            animal={animal}
            alt={animal}
            highlight={
              playHighlight &&
              (i <= animalHighlightIndex ||
                (animalHighlightIndex > firstIncorrectAnimalIndex &&
                  i > firstIncorrectAnimalIndex &&
                  firstIncorrectAnimalIndex !== -1))
            }
            mode={incorrectAnimals[i] ? 'incorrect' : 'default'}
          />
        ))}
      </PanAnimalContainer>
    )
  }, [animals, playHighlight, animalHighlightIndex, firstIncorrectAnimalIndex, incorrectAnimals])

  return (
    <Container>
      <InfoPopup>
        <VisualArea>
          {state.subPage === 0 ? (
            <>
              <AnimatedWeighingScale
                leftValue={state.totalWeight}
                rightValue={state.checkStatus !== 'default' ? state.currentWeight : 0}
                maxValueDifference={state.totalWeight + 5}
                checkStatus={state.checkStatus}
                leftPanContent={leftPanContent}
                rightPanContent={
                  state.checkStatus !== 'default' && (
                    <Sandbags
                      {...{
                        totalCount: state.currentWeight,
                        incorrectCount,
                        extraCount,
                        highlightUptoIndex:
                          state.checkStatus === 'incorrect'
                            ? animalHighlightIndex >= animals.length
                              ? state.currentWeight
                              : animalHighlightIndex >= 0
                              ? cumulativeAnimalWeights[animalHighlightIndex] - 1
                              : -1
                            : -1,
                      }}
                    />
                  )
                }
                // rightPanLabel={
                //   state.checkStatus === 'default' ? (
                //     <>Number of sandbags {state.currentWeight}</>
                //   ) : null
                // }
              />
              <InfoButton />
              <InfoContent>
                <ReviewTable />
              </InfoContent>
            </>
          ) : (
            <>
              <ReviewTable
                activeAnimals={(Object.keys(animalWeights) as Animal[]).filter(
                  (key) => state.counts[key] > 0,
                )}
              />
              <ReviewTotalTable animalCounts={state.counts} />
            </>
          )}
        </VisualArea>
      </InfoPopup>
      <FeedbackContainer>
        {state.subPage === 0 &&
          (state.checkStatus === 'default' ? (
            <>Select the number of sandbags required to balance the scale.</>
          ) : state.checkStatus === 'correct' ? (
            <>That&apos;s correct! Now let&apos;s see its mathematical representation.</>
          ) : state.currentWeight > state.totalWeight ? (
            <>
              Uh-oh! This is not the correct value.
              <br />
              Try reducing the number of sandbags.
            </>
          ) : (
            <>
              Uh-oh! This is not the correct value.
              <br />
              Try adding more sandbags.
            </>
          ))}
        {state.subPage === 1 && possibleAnimalTypes === 3 && (
          <>Awesome! Now let&apos;s practice some questions.</>
        )}
      </FeedbackContainer>
      <InteractionContainer>
        {state.subPage === 0 && (
          <OnboardingStep index={2}>
            <StepInput
              value={state.currentWeight}
              onChange={(value) => dispatch({ type: 'weightChange', value })}
              max={state.totalWeight + 10}
              disabled={state.checkStatus === 'correct'}
              min={0}
              label={`Number of sandbags`}
              showLabel
            />
          </OnboardingStep>
        )}
      </InteractionContainer>
      <CtaContainer>
        <CtaButton
          onClick={() => {
            playClick()
            state.subPage === 1 ? onComplete?.() : dispatch({ type: 'cta' })
          }}
          disabled={state.subPage === 0 && state.currentWeight === 0}
        >
          {state.subPage === 0 ? (
            state.checkStatus === 'correct' ? (
              <>
                <img src={visualizeIcon} alt="visualize-icon" /> Visualize
              </>
            ) : (
              'Check'
            )
          ) : (
            'Next'
          )}
        </CtaButton>
      </CtaContainer>
    </Container>
  )
}

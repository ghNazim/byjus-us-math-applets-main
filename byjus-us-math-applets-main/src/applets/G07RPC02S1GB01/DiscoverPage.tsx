import { FC, useReducer } from 'react'

import { OnboardingStep } from '@/atoms/OnboardingStep'
import { useSFX } from '@/hooks/useSFX'
import { AnimatedWeighingScale } from '@/molecules/AnimatedWeighingScale'

import {
  animalImages,
  Container,
  CtaButton,
  CTAClickOnboarding,
  CtaContainer,
  FeedbackContainer,
  HighlightedText,
  InteractionContainer,
  PanAnimalContainer,
  PanImage,
  Toggle,
  ToggleClickOnboarding,
  ToggleContainer,
  VisualArea,
} from './Applet.styles'
import { Animal } from './Applet.types'
import { animalWeights } from './data'
import { InfoButton, InfoContent, InfoPopup } from './InfoButton'
import { ReviewTable } from './ReviewTable'
import { Sandbags } from './Sandbags'

interface State {
  selected: Animal | null
  completed: {
    [key in Animal]: boolean
  }
}

const initialState: State = {
  selected: null,
  completed: {
    cat: false,
    dog: false,
    rabbit: false,
  },
}

type Action = {
  type: 'select'
  payload: Animal
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'select': {
      const completed = {
        ...state.completed,
        [action.payload]: true,
      }

      return {
        ...state,
        selected: action.payload,
        completed,
      }
    }
    default:
      return state
  }
}

const FEEDBACKS = {
  default: 'Tap on the animals to find their weight.',
  cat: (
    <span>
      1 cat weighs equivalent to{' '}
      <HighlightedText animal="cat">{animalWeights.cat} sandbags.</HighlightedText>
    </span>
  ),
  dog: (
    <span>
      1 dog weighs equivalent to{' '}
      <HighlightedText animal="dog">{animalWeights.dog} sandbags.</HighlightedText>
    </span>
  ),
  rabbit: (
    <span>
      1 rabbit weighs equivalent to{' '}
      <HighlightedText animal="rabbit">{animalWeights.rabbit} sandbags.</HighlightedText>
    </span>
  ),
}

const PAN_CONTENTS = {
  none: null,
  cat: <PanImage animal="cat" />,
  dog: <PanImage animal="dog" />,
  rabbit: <PanImage animal="rabbit" />,
}

export const DiscoverPage: FC<{ onComplete?: () => void }> = ({ onComplete }) => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const playClick = useSFX('mouseClick')
  return (
    <Container>
      <InfoPopup>
        <VisualArea>
          <AnimatedWeighingScale
            leftValue={0}
            rightValue={0}
            maxValueDifference={10}
            leftPanContent={
              <PanAnimalContainer>{PAN_CONTENTS[state.selected ?? 'none']}</PanAnimalContainer>
            }
            rightPanContent={
              state.selected && <Sandbags totalCount={animalWeights[state.selected]} />
            }
          />
          {(state.completed.rabbit || state.completed.cat || state.completed.dog) && <InfoButton />}
          <InfoContent>
            <ReviewTable
              isRabbitWeightShown={state.completed.rabbit}
              isCatWeightShown={state.completed.cat}
              isDogWeightShown={state.completed.dog}
            />
          </InfoContent>
        </VisualArea>
      </InfoPopup>
      <FeedbackContainer>{FEEDBACKS[state.selected ?? 'default']}</FeedbackContainer>
      <InteractionContainer>
        <ToggleContainer>
          {(Object.keys(animalImages) as Animal[]).map((animal) => (
            <Toggle
              key={animal}
              isSelected={state.selected === animal}
              disabled={state.completed[animal] && state.selected !== animal}
              onClick={() => {
                playClick()
                dispatch({ type: 'select', payload: animal })
              }}
              animal={animal}
            >
              <div>
                <img src={animalImages[animal]} alt={animal} draggable={false} />
              </div>
            </Toggle>
          ))}
          <OnboardingStep index={0}>
            <ToggleClickOnboarding
              complete={state.completed.cat || state.completed.dog || state.completed.rabbit}
            />
          </OnboardingStep>
        </ToggleContainer>
      </InteractionContainer>
      <CtaContainer>
        <CtaButton
          disabled={!state.completed.cat || !state.completed.dog || !state.completed.rabbit}
          onClick={() => {
            playClick()
            onComplete?.()
          }}
        >
          Next
          {state.completed.cat && state.completed.dog && state.completed.rabbit && (
            <OnboardingStep index={2}>
              <CTAClickOnboarding complete={false} />
            </OnboardingStep>
          )}
        </CtaButton>
      </CtaContainer>
    </Container>
  )
}

import { FC, useContext, useMemo, useReducer, useState } from 'react'
import styled from 'styled-components'

import { StepperButton } from '@/atoms/StepperButton'
import { AnalyticsContext } from '@/contexts/analytics'
import { useSFX } from '@/hooks/useSFX'

import {
  BasketBallContainer,
  BottomText,
  Button,
  ButtonHolder,
  ColoredSpan,
  ColumnFlex,
  StepperButtoContainer,
} from '../appletStyles'
import basketBallImg from '../assets/basketBall/basketballCourt.svg'
import leftScoreCard from '../assets/basketBall/scorecardLeft.svg'
import scoreCardRightCorrect from '../assets/basketBall/scoreCardRightCorrectState.svg'
import scoreCardRightDefault from '../assets/basketBall/scoreCardRightDefault.svg'
import tryNewIcon from '../assets/tryNew.svg'

const ScoreCardContainer = styled.div`
  display: flex;
  position: absolute;
  top: 158px;
  width: 100%;
  justify-content: space-around;
  padding: 0 10%;
`

const ColoredBg = styled.div<{ color: string }>`
  position: absolute;
  width: 360px;
  height: 210px;
  top: 270px;
  left: 330px;
  background-color: ${(a) => a.color};
  z-index: -1;
`

const Score = styled.div<{ left: number; top: number; correctAns?: boolean }>`
  position: absolute;
  left: ${(a) => a.left}px;
  top: ${(a) => a.top}px;
  width: 80px;
  height: 40px;
  /* border: 1px solid red; */
  display: flex;
  justify-content: center;
  align-items: center;

  color: ${(a) => (a.correctAns ? '#6CA621' : '#1a1a1a')};
  text-align: center;

  /* Sub heading/Bold */
  font-family: Nunito;
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: 28px; /* 140% */
`

interface Data {
  initialWhiteCount: number
  initialBlueCount: number
  currentBlueCount: number
  currentWhiteCount: number
}

type Action =
  | {
      type: 'increment'
    }
  | { type: 'decrement' }

const reducer = (current: Data, action: Action): Data => {
  switch (action.type) {
    case 'increment': {
      return { ...current, currentBlueCount: current.currentBlueCount + 1 }
    }

    case 'decrement': {
      return { ...current, currentBlueCount: current.currentBlueCount - 1 }
    }

    default:
      return current
  }
}

const BasketBallProblem: FC<{
  onCompletion: () => void
}> = ({ onCompletion: completed }) => {
  const [initialWhiteCount] = useState(Math.round(Math.random() * 3) + 1)
  const [randomMultiplier] = useState(Math.round(Math.random() * 2) + 2)
  //this random number is used to multiply the inintial white, and the user has
  //to find the number of blues according to the ratio for that instance
  const initialBlueCount = useMemo(() => {
    const tmp = Math.round(Math.random() * 3) + 1
    if (tmp == initialWhiteCount) {
      if (tmp === 4) {
        return 3
      } else return tmp + 1
    }

    return tmp
  }, [initialWhiteCount])

  // here im receiving initial white count and initial blue count
  // and when im initiating the useReducer, multiplying
  // intialWhiteCount by 3 and assigning to finalWhiteCount
  // that is the user has to solve the case when the ratio is multiplied
  // by 3

  const finalBlue = [80, 133, 211]
  const ans = randomMultiplier * initialBlueCount
  const stepperBlue = finalBlue.map((i) => (255 - i) / ans)
  //sound
  const playWronAnswerSound = useSFX('incorrect')
  const playCorrectAnswerSound = useSFX('correct')
  const playMouseClick = useSFX('mouseClick')

  const onInteraction = useContext(AnalyticsContext)

  const colorMixing = (numOfWhite: number, numOfBlue: number) => {
    const r = 255 - numOfBlue * stepperBlue[0]
    const g = 255 - numOfBlue * stepperBlue[1]
    const b = 255 - numOfBlue * stepperBlue[2]
    return `rgb(${r},${g},${b})`
  }

  const [state, dispatch] = useReducer(reducer, {
    currentBlueCount: 0,
    currentWhiteCount: initialWhiteCount * randomMultiplier,
    initialBlueCount: initialBlueCount,
    initialWhiteCount: initialWhiteCount,
  })
  const [checkBtnPressed, setCheckBtnPressed] = useState(false)

  const initialRatioColor = colorMixing(state.currentWhiteCount, state.currentBlueCount)

  const handleCheck = () => {
    setCheckBtnPressed(true)
    onInteraction('tap')
    if (state.currentBlueCount === correctAnswer) {
      playCorrectAnswerSound()
    } else {
      playWronAnswerSound()
    }
  }

  const correctAnswer = state.initialBlueCount * randomMultiplier
  return (
    <div>
      <BasketBallContainer>
        {/* the image here is transparent on the right court, i placed a
        div below it and is controlling the color of the div
        by calculating the color mix using user inputs */}
        <img src={basketBallImg} style={{ width: '100%', height: '100%' }} />
      </BasketBallContainer>
      <ColoredBg color={initialRatioColor} />
      <ScoreCardContainer>
        {/* these are base images for scorecard. I've used 3 images here
        one for the left score card, and one on the right side with the
        question mark on the box of blue buckets. when the user answer
        is correct, im swapping the right image where the box for blue paint
        is green */}
        <img src={leftScoreCard} />
        <img
          src={
            state.currentBlueCount === correctAnswer && checkBtnPressed
              ? scoreCardRightCorrect
              : scoreCardRightDefault
          }
        />
      </ScoreCardContainer>

      {/* these are texts on top of the scorecard */}
      <Score left={215} top={193}>
        {state.initialWhiteCount}
      </Score>
      <Score left={215} top={229}>
        {state.initialBlueCount}
      </Score>
      <Score left={502} top={193}>
        {state.currentWhiteCount}
      </Score>
      {state.currentBlueCount === correctAnswer && checkBtnPressed && (
        <Score left={502} top={229} correctAns>
          {state.currentBlueCount}
        </Score>
      )}
      <StepperButtoContainer bottom={100}>
        <ColumnFlex>
          Blue cans
          <StepperButton
            max={correctAnswer + 4}
            onChange={(val) => {
              onInteraction('tap')
              state.currentBlueCount < val
                ? dispatch({ type: 'increment' })
                : dispatch({ type: 'decrement' })
              setCheckBtnPressed(false)
              playMouseClick()
            }}
            value={state.currentBlueCount}
            min={0}
            disabled={state.currentBlueCount === correctAnswer && checkBtnPressed}
          />
        </ColumnFlex>
      </StepperButtoContainer>
      <BottomText bottom={200}>
        {!checkBtnPressed ? (
          <>
            Oops! I have already used{' '}
            <ColoredSpan bgColor="#ebfbff" color="#58b9d8">
              {state.currentWhiteCount}
            </ColoredSpan>{' '}
            white cans to color the right court, how many blue cans do i need to use now?
          </>
        ) : state.currentBlueCount !== correctAnswer ? (
          <>
            Uh Oh! Try again with {state.currentBlueCount < correctAnswer ? 'more' : 'fewer'} blue
            cans.
          </>
        ) : (
          <>
            Great! You got the same color because <br />
            <ColoredSpan bgColor="#ebfbff" color="#58b9d8">
              {state.initialWhiteCount}:{state.initialBlueCount}
            </ColoredSpan>{' '}
            is equivalent to{' '}
            <ColoredSpan bgColor="#ebfbff" color="#58b9d8">
              {state.currentWhiteCount}:{state.currentBlueCount}
            </ColoredSpan>
          </>
        )}
      </BottomText>
      <ButtonHolder bottom={10}>
        {!(checkBtnPressed && state.currentBlueCount === correctAnswer) ? (
          <Button isActive={state.currentBlueCount !== 0} onClick={() => handleCheck()}>
            Check
          </Button>
        ) : (
          <Button
            isActive
            onClick={() => {
              playMouseClick()
              completed()
              onInteraction('tap')
            }}
          >
            <img src={tryNewIcon} />
            Try new
          </Button>
        )}
      </ButtonHolder>
    </div>
  )
}

export default BasketBallProblem

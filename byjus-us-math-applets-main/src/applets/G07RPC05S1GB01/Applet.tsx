import { FC, useContext, useEffect, useReducer } from 'react'

import { OnboardingController } from '@/atoms/OnboardingController'
import { OnboardingStep } from '@/atoms/OnboardingStep'
import { StepperButton } from '@/atoms/StepperButton'
import { AppletContainer } from '@/common/AppletContainer'
import { TextHeader } from '@/common/Header'
import { AnalyticsContext, AppletInteractionCallback } from '@/contexts/analytics'
import { useSFX } from '@/hooks/useSFX'
import { mix } from '@/utils/math'

import {
  BottomText,
  Button,
  ButtonHolder,
  ColoredBox,
  ColoredSpan,
  ColumnFlex,
  Container,
  OnboardingAnim,
  OutPutColor,
  OutPutColorContainer,
  PaintBox,
  PaintBoxContainer,
  RowFlex,
  StepperButtoContainer,
  TitleBox,
} from './appletStyles'
import bluePaintBucket from './assets/paintBuckets/blue.svg'
import whitePaintBucket from './assets/paintBuckets/white.svg'
import ColorTable from './components/colorTable'
// import BasketBallProblem from './components/BasketBallProblem'

const WHITE = 255
const findBLueRgbAccordingToRatio = (
  numOfWhite: number,
  numOfBlue: number,
  targetRgbArr: number[],
) => {
  const BLUE_R = (targetRgbArr[0] * (numOfBlue + numOfWhite) - numOfWhite * WHITE) / numOfBlue

  const BLUE_G = (targetRgbArr[1] * (numOfBlue + numOfWhite) - numOfWhite * WHITE) / numOfBlue

  const BLUE_B = (targetRgbArr[2] * (numOfBlue + numOfWhite) - numOfWhite * WHITE) / numOfBlue

  return { BLUE_B, BLUE_G, BLUE_R }
}

interface Data {
  stage: number
  initialWhiteCount: number
  initialBlueCount: number
  finalWhiteCount: number
  finalBlueCount: number
  numberOfWhite: number
  numberOfBlue: number
  randomMultiplier: number
  checkStatus: 'correct' | 'wrong' | 'default'
}

const initialData: Data = {
  stage: 0,
  initialWhiteCount: 1,
  initialBlueCount: 1,
  finalWhiteCount: 2,
  finalBlueCount: 0,
  numberOfBlue: 1,
  numberOfWhite: 1,
  randomMultiplier: 1,
  checkStatus: 'default',
}

type Color = 'white' | 'blue'

type Action =
  | {
      type: 'increment'
      color: Color
    }
  | { type: 'decrement'; color: Color }
  | { type: 'next' }
  | { type: 'reset' }
  | { type: 'check' }

const reducer = (current: Data, action: Action): Data => {
  switch (action.type) {
    case 'next': {
      // incrementing stage, when stage is 0, im multiplying the number of
      // white with randomMultiplier and assigning to final white count, that is the user has
      // to solve the ratio when number of white is randomMultiplier times the
      //   initial number

      // Set the random multiplier to a random number such that the total number of cans is less than 36.
      const initialTotal = current.initialWhiteCount + current.initialBlueCount
      const maxMultiplier = Math.floor(36 / initialTotal)
      const randomMultiplier = Math.max(2, Math.round(Math.random() * maxMultiplier))
      return {
        ...current,
        stage: current.stage + 1,
        randomMultiplier,
        finalWhiteCount: current.initialWhiteCount * randomMultiplier,
      }
    }

    case 'increment': {
      if (current.stage === 0) {
        //incrementing number of white/blue- when stage is zero -> initialColorCount++
        //when stage is one-> finalColorCount++
        if (action.color === 'white')
          return {
            ...current,
            checkStatus: 'default',
            initialWhiteCount: current.initialWhiteCount + 1,
          }
        else
          return {
            ...current,
            checkStatus: 'default',
            initialBlueCount: current.initialBlueCount + 1,
          }
      } else if (current.stage === 1)
        return { ...current, checkStatus: 'default', finalBlueCount: current.finalBlueCount + 1 }

      return current
    }

    case 'decrement': {
      //decrementing number of colors
      if (current.stage === 0) {
        if (action.color === 'white')
          return {
            ...current,
            checkStatus: 'default',
            initialWhiteCount: current.initialWhiteCount - 1,
          }
        else
          return {
            ...current,
            checkStatus: 'default',
            initialBlueCount: current.initialBlueCount - 1,
          }
      } else if (current.stage === 1)
        return { ...current, checkStatus: 'default', finalBlueCount: current.finalBlueCount - 1 }

      return current
    }

    case 'reset':
      return {
        ...initialData,
        numberOfBlue: Math.round(Math.random() * 3) + 1,
        numberOfWhite: Math.round(Math.random() * 3) + 1,
        checkStatus: 'default',
      }
    case 'check':
      if (current.stage === 1) {
        if (current.initialBlueCount * current.randomMultiplier === current.finalBlueCount) {
          return { ...current, checkStatus: 'correct' }
        } else {
          return { ...current, checkStatus: 'wrong' }
        }
      }
      return current
    default:
      return current
  }
}

export const AppletG07RPC05S1GB01: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const [state, dispatch] = useReducer(reducer, initialData)

  // const { BLUE_B, BLUE_G, BLUE_R } = findBLueRgbAccordingToRatio(
  //   state.numberOfWhite,
  //   state.numberOfBlue,
  //   [103, 211, 244],
  // )

  //note: the ratio user gives on stage 0 is being used in stage 1

  const { BLUE_B, BLUE_G, BLUE_R } = findBLueRgbAccordingToRatio(1, 1, [103, 211, 244])

  //sound
  const playWronAnswerSound = useSFX('incorrect')
  const playCorrectAnswerSound = useSFX('correct')
  const playMouseClick = useSFX('mouseClick')

  const onInteraction = useContext(AnalyticsContext)

  const colorMixing = (numOfWhite: number, numOfBlue: number) => {
    const r = mix(WHITE, numOfWhite, BLUE_R, numOfBlue)
    const g = mix(WHITE, numOfWhite, BLUE_G, numOfBlue)
    const b = mix(WHITE, numOfWhite, BLUE_B, numOfBlue)

    return `rgb(${r},${g},${b})`
  }

  const initialRatioColor = colorMixing(state.initialWhiteCount, state.initialBlueCount)
  const finalRatioColor = colorMixing(state.finalWhiteCount, state.finalBlueCount)
  const handleCheck = () => {
    dispatch({ type: 'check' })
    playMouseClick()
    onInteraction('tap')
  }

  useEffect(() => {
    if (state.checkStatus === 'correct') {
      playCorrectAnswerSound()
    } else if (state.checkStatus === 'wrong') {
      playWronAnswerSound()
    }
  }, [playCorrectAnswerSound, playWronAnswerSound, state.checkStatus])

  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#f6f6f6',
        id: 'g07-rpc03-s1-gb01',
        onEvent,
        className,
      }}
      themeName="dark"
    >
      <TextHeader
        text="Learning ratios using paints."
        backgroundColor="#f6f6f6"
        buttonColor="#1a1a1a"
      />
      <OnboardingController>
        {state.stage < 2 ? (
          <>
            <Container>
              <ColoredBox color={state.stage === 0 ? '#fdf6dc' : '#ececec'} span={1}>
                {/* these are the colored coulmns */}
                {state.stage == 0 && (
                  // title is needed for the first stage only
                  <TitleBox color="#1a1a1a" bgColor="white">
                    White cans
                  </TitleBox>
                )}
                <PaintBoxContainer>
                  {/* container for paintbox */}
                  {state.stage === 0 ? (
                    <RowFlex>
                      {Array.from({ length: state.initialWhiteCount }, (_, ind) => (
                        <PaintBox key={ind}>
                          <img src={whitePaintBucket} />
                        </PaintBox>
                      ))}
                    </RowFlex>
                  ) : (
                    // when stage is 1
                    <>
                      <RowFlex>
                        {/* white buckets */}
                        {Array.from({ length: state.initialWhiteCount }, (_, ind) => (
                          <PaintBox key={ind} className="white">
                            <img src={whitePaintBucket} />
                          </PaintBox>
                        ))}
                      </RowFlex>
                      <RowFlex>
                        {/* blue buckets */}
                        {Array.from({ length: state.initialBlueCount }, (_, ind) => (
                          <PaintBox key={ind}>
                            <img src={bluePaintBucket} />
                          </PaintBox>
                        ))}
                      </RowFlex>
                    </>
                  )}
                </PaintBoxContainer>
              </ColoredBox>
              <ColoredBox color="#fdf6dc" span={state.stage == 0 ? 1 : 2}>
                {/* right column */}
                {state.stage == 0 && (
                  <TitleBox color="#1CB9D9" bgColor="#f1fdff">
                    Blue cans
                  </TitleBox>
                )}
                <PaintBoxContainer>
                  {state.stage == 0 ? (
                    <RowFlex>
                      {/* rendering blue cans when stage is zero */}
                      {Array.from({ length: state.initialBlueCount }, (_, ind) => (
                        <PaintBox key={ind}>
                          <img src={bluePaintBucket} />
                        </PaintBox>
                      ))}
                    </RowFlex>
                  ) : (
                    <>
                      <RowFlex>
                        {Array.from({ length: state.finalWhiteCount }, (_, ind) => (
                          // rendering white cans on the right side when stage is 1
                          // 3x of initial white
                          <PaintBox key={ind}>
                            <img src={whitePaintBucket} />
                          </PaintBox>
                        ))}
                      </RowFlex>
                      <RowFlex>
                        {Array.from({ length: state.finalBlueCount }, (_, ind) => (
                          // rendering blue cans according to user input
                          <PaintBox key={ind} className="blue">
                            <img src={bluePaintBucket} />
                          </PaintBox>
                        ))}
                      </RowFlex>
                    </>
                  )}
                </PaintBoxContainer>
              </ColoredBox>
              <OutPutColorContainer middle={state.stage === 0}>
                {state.stage !== 0 && (
                  <OutPutColor
                    isFullWidth={state.stage === 0}
                    color={initialRatioColor}
                    style={{ transform: 'translateX(.5%)' }}
                  />
                  // when stage is not, showing the target color to be achieved
                )}
                {/* showing the mixed color of user inputs when stage is zero and when stage is 1,
                showing the mixed color of user input of blue, */}
                <OutPutColor
                  isFullWidth={state.stage === 0}
                  color={state.stage == 0 ? initialRatioColor : finalRatioColor}
                />
              </OutPutColorContainer>
            </Container>
            <OnboardingStep index={0}>
              <OnboardingAnim
                type="click"
                left={210}
                top={600}
                complete={state.initialBlueCount > 1 || state.initialWhiteCount > 1}
              />
            </OnboardingStep>
            <OnboardingStep index={0}>
              <OnboardingAnim
                type="click"
                left={500}
                top={600}
                complete={state.initialBlueCount > 1 || state.initialWhiteCount > 1}
              />
            </OnboardingStep>

            <OnboardingStep index={2}>
              <OnboardingAnim type="click" left={290} top={700} complete={state.stage === 1} />
            </OnboardingStep>
            <OnboardingStep index={3}>
              <OnboardingAnim
                type="click"
                left={355}
                top={600}
                complete={state.finalBlueCount > 0}
              />
            </OnboardingStep>

            {state.stage == 0 ? (
              // 2 stepper buttons when stage is zero, these buttons will
              // change state.initial values which is being used to find the color mix in stage 0
              <StepperButtoContainer>
                <ColumnFlex>
                  <>White cans</>
                  <StepperButton
                    max={8}
                    onChange={(val) => {
                      onInteraction('tap')
                      playMouseClick()
                      state.initialWhiteCount < val
                        ? dispatch({ type: 'increment', color: 'white' })
                        : dispatch({ color: 'white', type: 'decrement' })
                    }}
                    value={state.initialWhiteCount}
                    min={1}
                  />
                </ColumnFlex>
                <ColumnFlex>
                  <>Blue cans</>
                  <StepperButton
                    max={8}
                    onChange={(val) => {
                      onInteraction('tap')
                      playMouseClick()
                      state.initialBlueCount < val
                        ? dispatch({ type: 'increment', color: 'blue' })
                        : dispatch({ type: 'decrement', color: 'blue' })
                    }}
                    value={state.initialBlueCount}
                    min={1}
                  />
                </ColumnFlex>
              </StepperButtoContainer>
            ) : (
              //stepper button for stage 1
              state.checkStatus !== 'correct' && (
                <StepperButtoContainer>
                  <ColumnFlex>
                    Blue cans
                    <StepperButton
                      max={36 - state.finalWhiteCount}
                      onChange={(val) => {
                        onInteraction('tap')
                        playMouseClick()
                        state.finalBlueCount < val
                          ? dispatch({ type: 'increment', color: 'blue' })
                          : dispatch({ color: 'blue', type: 'decrement' })
                      }}
                      value={state.finalBlueCount}
                      min={0}
                    />
                  </ColumnFlex>
                </StepperButtoContainer>
              )
            )}
            <BottomText bottom={state.checkStatus === 'correct' ? 200 : 230}>
              {/* here when check button is not pressed the default text will
              render, once the check button is pressed, im checking if it's correct value
              or not and rendering the feedback. once check button is pressed, checkCbtnPressed
              state will become true and upon changing any value fromn there
              the state will become false again. Also, stepper button becomes
              disabled once correct answer is given and checkbtn is pressed */}
              {state.stage === 0 ? (
                <> Change the values to make a new color.</>
              ) : state.checkStatus === 'default' ? (
                <>
                  Select the cans of blue paint that should be mixed with{' '}
                  {state.initialWhiteCount * state.randomMultiplier} cans of white paint to give the
                  same color.
                </>
              ) : state.checkStatus === 'correct' ? (
                <>
                  Great! You got the same color because <br />
                  <ColoredSpan bgColor="#ebfbff" color="#58b9d8">
                    {state.initialWhiteCount}:{state.initialBlueCount}
                  </ColoredSpan>{' '}
                  is equivalent to{' '}
                  <ColoredSpan bgColor="#ebfbff" color="#58b9d8">
                    {state.finalWhiteCount}:{state.finalBlueCount}
                  </ColoredSpan>
                  .
                </>
              ) : (
                <>
                  That’s not correct! Try again with{' '}
                  {state.finalBlueCount < state.initialBlueCount * state.randomMultiplier
                    ? 'more'
                    : 'fewer'}{' '}
                  blue cans.
                </>
              )}
            </BottomText>
            <ButtonHolder>
              {/* when stage is zero, next btn will be rendered and upon clicking
              it dispatch('next'). in stage 1, im using the checkBtnpressed title and
              if the user given correct value to toggle next and check btns */}
              {state.stage === 0 ? (
                <Button
                  isActive={state.initialBlueCount !== 1 || state.initialWhiteCount !== 1}
                  onClick={() => {
                    playMouseClick()
                    if (state.initialBlueCount !== 1 || state.initialWhiteCount !== 1) {
                      dispatch({ type: 'next' })
                    }
                  }}
                >
                  Next
                </Button>
              ) : state.checkStatus !== 'correct' ? (
                <Button isActive={state.finalBlueCount > 0} onClick={handleCheck}>
                  Check
                </Button>
              ) : (
                <Button
                  isActive
                  onClick={() => {
                    playMouseClick()
                    dispatch({ type: 'next' })
                  }}
                >
                  Next
                </Button>
              )}
            </ButtonHolder>
          </>
        ) : null}

        {state.stage === 2 ? (
          <>
            {/* this is kind of same applet with same logics, but with different visuals */}
            {/* <BasketBallProblem
              onCompletion={() => {
                dispatch({ type: 'reset' })
                setCheckBtnPressed(false)
              }}
              initialData={{
                initialBlueCount: numberOfBlueForBasketballCourt,
                initialWhiteCount: numberOfWhiteForBasketballCourt,
              }}
            /> */}
            <ColorTable
              onComplete={() => {
                dispatch({ type: 'reset' })
              }}
            />
          </>
        ) : null}
      </OnboardingController>
    </AppletContainer>
  )
}

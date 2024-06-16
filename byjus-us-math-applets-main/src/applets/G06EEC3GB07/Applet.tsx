import { Player } from '@lottiefiles/react-lottie-player'
import { FC, useEffect, useRef, useState } from 'react'
import styled, { keyframes } from 'styled-components'

import { OnboardingAnimation } from '@/atoms/OnboardingAnimation'
import { OnboardingController } from '@/atoms/OnboardingController'
import { OnboardingStep } from '@/atoms/OnboardingStep'
import { AppletContainer } from '@/common/AppletContainer'
import { TextHeader } from '@/common/Header'
import { RestartButton } from '@/common/PageControl/Buttons'
import { AppletInteractionCallback } from '@/contexts/analytics'
import { useInterval } from '@/hooks/useInterval'
import { useSFX } from '@/hooks/useSFX'

import animation from './assets/G06EEC3GB07_animation.json'

const TopBox = styled.div`
  display: flex;
  align-items: center;
  background: #f0ebff;
  border: 4px solid rgba(127, 92, 244, 0.4);
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 5px;
  width: 576px;
  height: 81px;
  margin: 0 auto;
  margin-top: 99px;
  color: #646464;
  font-weight: 700;
  font-size: 20px;
  justify-content: center;
`
const Numbers = styled.div`
  display: flex;
  align-items: center;
`

const NumberContainer = styled.div<{ isActive?: boolean; isClickable?: boolean }>`
  width: 54px;
  height: 54px;
  box-shadow: ${(props) => (props.isActive ? '0px 4px 4px rgba(0, 0, 0, 0.25)' : undefined)};
  border-radius: 6px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: ${(props) =>
    (props.isActive ? '#F1EDFF' : props.isClickable ? '#6549C2' : 'white') || '#6549C2'};
  background-color: ${(props) =>
    (props.isActive ? ' #8C69FF' : props.isClickable ? '#D9CDFF' : ' #B3B1B1') || '#D9CDFF'};
  font-size: 20px;
  font-weight: 700;
  margin: 15px;
  cursor: ${(props) => (props.isClickable ? 'pointer' : 'default' || 'pointer')};
`

const LottiePlayer = styled(Player)`
  position: absolute;
  top: 0px;
  z-index: -1;
  overflow: hidden;
`

const ClickAnimation1 = styled(OnboardingAnimation).attrs({ type: 'click' })<{ opacity: number }>`
  opacity: ${(props) => props.opacity};
  position: absolute;
  top: 100px;
  left: 212px;
`
const ClickAnimation2 = styled(OnboardingAnimation).attrs({ type: 'click' })`
  position: absolute;
  top: 100px;
  left: 300px;
`

const FadeIn = keyframes`
  0%{
    opacity: 0;
  }
  100%{
    opacity: 1;
  }
`

const BottomText = styled.div`
  text-align: center;
  font-weight: 700;
  font-size: 20px;
  color: #646464;
  display: flex;
  height: 500px;
  flex-direction: column;
  justify-content: flex-end;
  animation: ${FadeIn} 0.2s ease-in;
`

const RestartHolder = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: 20px;
`

//what if user press next number before finishing the animation

const NumberArray = [2, 3, 4, 5]

const TOTAL_FRAMES = animation.op - 1
const PROGRESS_STEP = 1 / TOTAL_FRAMES

export const AppletG06EEC3GB07: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const playerRef = useRef<Player>(null)
  const [currentNum, setCurrentNum] = useState(0)
  const [targetProgress, setTargetProgress] = useState(0)
  const [currentProgress, setCurrentProgress] = useState(0)
  const [hasFirstOnboardingChanged, setHasFirstOnboardingChanged] = useState(false)
  const [hasSecondOnboardingChanged, setHasSecondOnboardingChanged] = useState(false)
  const [clickableNumbers, setClickableNumbers] = useState<number[]>(NumberArray)
  const [isFirstAnimComplete, setIsFirstAnimComplete] = useState(false)

  useInterval(
    () => {
      setCurrentProgress((p) => {
        if (p > targetProgress)
          return p - PROGRESS_STEP > targetProgress ? p - PROGRESS_STEP : targetProgress
        if (p < targetProgress)
          return p + PROGRESS_STEP < targetProgress ? p + PROGRESS_STEP : targetProgress
        return p
      })
    },
    targetProgress != currentProgress ? 1000 / animation.fr : null,
  )

  useEffect(() => {
    playerRef.current?.setSeeker(currentProgress * TOTAL_FRAMES)
    if (currentProgress !== 0) {
      currentProgress === targetProgress ? setIsFirstAnimComplete(true) : undefined
    }
  }, [currentProgress])

  useEffect(() => {
    if (currentNum !== 0) {
      !hasFirstOnboardingChanged
        ? setHasFirstOnboardingChanged(true)
        : setHasSecondOnboardingChanged(true)
      setCurrentProgress((currentNum - 2) * 0.25)
      setTargetProgress((currentNum - 1) * 0.25)
      setClickableNumbers((prevArr) => prevArr.filter((e) => e !== currentNum))
      //animations are at equal intervels, total 4 animations
    }
  }, [currentNum])

  const playClick = useSFX('mouseClick')

  const restart = () => {
    setCurrentProgress(0)
    setTargetProgress(0)
    setIsFirstAnimComplete(false)
    setCurrentNum(0)
    setClickableNumbers(NumberArray)
    setHasFirstOnboardingChanged(false)
  }

  const animComplete = currentProgress !== 0 && currentProgress === targetProgress

  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#F6F6F6',
        id: 'g06-eec3-gb07',
        onEvent,
        className,
        themeName: 'dark',
      }}
    >
      <TextHeader
        text="Let’s explore evaluating expressions at multiple values of the variable."
        backgroundColor="#F6F6F6"
        buttonColor=" #1a1a1a"
      />
      <TopBox>
        Value of y :{' '}
        {NumberArray.map((val) => (
          <NumberContainer
            onClick={() => {
              if (clickableNumbers.includes(val)) {
                playClick()
                setCurrentNum(val)
              }
            }}
            isActive={currentNum === val}
            isClickable={clickableNumbers.includes(val)}
            key={val}
          >
            {val}
          </NumberContainer>
        ))}
      </TopBox>

      {animComplete ? (
        <BottomText>
          When the value of “y” is {currentNum}, the output of the expression is{' '}
          {3 * (3 + currentNum)}.
        </BottomText>
      ) : undefined}
      <LottiePlayer src={animation} ref={playerRef} />
      {clickableNumbers.length === 0 && animComplete ? (
        <RestartHolder>
          <RestartButton onClick={restart} />
        </RestartHolder>
      ) : undefined}
      <OnboardingController>
        <OnboardingStep index={0}>
          <ClickAnimation1
            opacity={hasFirstOnboardingChanged ? 0 : 1}
            type="click"
            complete={hasFirstOnboardingChanged && isFirstAnimComplete}
          />
        </OnboardingStep>
        <OnboardingStep index={1}>
          <ClickAnimation2 type="click" complete={hasSecondOnboardingChanged} />
        </OnboardingStep>
      </OnboardingController>
    </AppletContainer>
  )
}

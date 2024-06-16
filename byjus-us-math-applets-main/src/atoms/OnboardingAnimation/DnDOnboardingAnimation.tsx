import { Player, PlayerEvent } from '@lottiefiles/react-lottie-player'
import { FC, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import * as animations from '@/assets/onboarding'
import { useInterval } from '@/hooks/useInterval'

import { useOnboardingStepContext } from '../OnboardingStep/OnboardingStepContext'
import { DnDOnboardingAnimationProps, Position } from './OnboardingAnimation.types'

const StylizedPlayer = styled(Player)<{ left: number; top: number; index: number }>`
  position: absolute;
  left: ${(props) => props.left}px;
  top: ${(props) => props.top}px;
  pointer-events: none;
`

const animationSequence = [
  animations['dragAndDropStart'],
  animations['dragAndDropHold'],
  animations['dragAndDropEnd'],
]

const distance = (point1: Position, point2: Position) => {
  const dist = Math.sqrt(
    Math.pow(point1.left - point2.left, 2) + Math.pow(point1.top - point2.top, 2),
  )
  return dist
}

export const DnDOnboardingAnimation: FC<DnDOnboardingAnimationProps> = ({
  initialPosition,
  finalPosition,
  speed = 1,
  complete,
  className,
}) => {
  const [index, setIndex] = useState(0)
  const [currentPos, setCurrentPos] = useState(initialPosition)
  const PlayerRef: React.LegacyRef<Player> = useRef(null)
  const { show, setComplete } = useOnboardingStepContext()

  useEffect(() => {
    if (show && complete) setComplete()
  }, [complete, setComplete, show])

  const increment = [
    ((finalPosition.left - initialPosition.left) * speed) / 100,
    ((finalPosition.top - initialPosition.top) * speed) / 100,
  ]

  useInterval(
    () => {
      switch (index) {
        case 0:
          setIndex(1)
          break
        case 1:
          PlayerRef.current?.setPlayerSpeed(1.6)
          if (
            distance(currentPos, finalPosition) >
            distance(finalPosition, {
              left: finalPosition.left + increment[0],
              top: finalPosition.top + increment[1],
            })
          ) {
            setCurrentPos((prevVal) => {
              const newPosLeft =
                prevVal.left !== finalPosition.left ? prevVal.left + increment[0] : prevVal.left
              const newPosTop =
                prevVal.top !== finalPosition.top ? prevVal.top + increment[1] : prevVal.top

              return { left: newPosLeft, top: newPosTop }
            })
          }

          break
        case 2:
          setIndex(0)
          setCurrentPos(initialPosition)

          break
        default:
          break
      }
    },
    // 10,
    index == 1 ? 10 : index === 2 ? 1500 : 1800,
  )

  const handleAnimationComplete = (e: PlayerEvent) => {
    if (e === 'complete') {
      if (index === 1) {
        setIndex(2)
      }
    }
  }

  return (
    <>
      {show && (
        <StylizedPlayer
          left={currentPos.left}
          top={currentPos.top}
          index={index}
          ref={PlayerRef}
          autoplay
          loop={false}
          src={animationSequence[index]}
          onEvent={handleAnimationComplete}
          keepLastFrame={false}
          className={className}
        />
      )}
    </>
  )
}

import { Player, PlayerEvent } from '@lottiefiles/react-lottie-player'
import React, { useRef, useState } from 'react'
import styled from 'styled-components'

import * as animations from '@/assets/onboarding'
import { useInterval } from '@/hooks/useInterval'

interface PositionProps {
  top: number
  left: number
}

interface DragProps {
  initialPos: PositionProps
  finalPos: PositionProps
  speed?: number
}

const PlayerHolder = styled.div<{ left: number; top: number; index: number }>`
  position: absolute;
  left: ${(props) => props.left}px;
  top: ${(props) => props.top}px;
  display: flex;
  justify-content: center;
  align-items: center;
`

const animationSequence = [
  animations['dragAndDropStart'],
  animations['dragAndDropHold'],
  animations['dragAndDropEnd'],
]

const DragAndDropAnimation: React.FC<DragProps> = (props) => {
  const [index, setIndex] = useState(0)
  const [currentPos, setCurrentPos] = useState(props.initialPos)
  const PlayerRef: React.LegacyRef<Player> = useRef(null)

  const distance = (point1: PositionProps, point2: PositionProps) => {
    const dist = Math.sqrt(
      Math.pow(point1.left - point2.left, 2) + Math.pow(point1.top - point2.top, 2),
    )
    return dist
  }

  const increment = [
    ((props.finalPos.left - props.initialPos.left) * (props.speed ?? 1)) / 100,
    ((props.finalPos.top - props.initialPos.top) * (props.speed ?? 1)) / 100,
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
            distance(currentPos, props.finalPos) >
            distance(props.finalPos, {
              left: props.finalPos.left + increment[0],
              top: props.finalPos.top + increment[1],
            })
          ) {
            setCurrentPos((prevVal) => {
              const newPosLeft =
                prevVal.left !== props.finalPos.left ? prevVal.left + increment[0] : prevVal.left
              const newPosTop =
                prevVal.top !== props.finalPos.top ? prevVal.top + increment[1] : prevVal.top

              return { left: newPosLeft, top: newPosTop }
            })
          }

          break
        case 2:
          setIndex(0)
          setCurrentPos(props.initialPos)

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
    <PlayerHolder left={currentPos.left} top={currentPos.top} index={index}>
      <Player
        ref={PlayerRef}
        autoplay
        loop={false}
        src={animationSequence[index]}
        onEvent={handleAnimationComplete}
        keepLastFrame={false}
      />
    </PlayerHolder>
    // </div>
  )
}

export default DragAndDropAnimation

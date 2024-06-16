import { forwardRef, useImperativeHandle, useState } from 'react'
import styled, { keyframes } from 'styled-components'

import frame0 from './assets/frame0.png'
import frame1 from './assets/frame1.png'
import frame2 from './assets/frame2.png'
import frame3 from './assets/frame3.png'
import frame4 from './assets/frame4.png'
import frame5 from './assets/frame5.png'
import { FrogJumpProps, FrogJumpRef, Position } from './FrogJump.types'

const frames = [frame0, frame1, frame2, frame3, frame4, frame5] as const

const jump = (height: number) => keyframes`
  0% {
    translate: 0px;
    background-image: url('${frames[0]}');
  }
  15% {
    translate: 0px;
    background-image: url('${frames[1]}');
  }
  25% {
    background-image: url('${frames[2]}');
  }
  35% {
    translate: 0px -${height}px;
    background-image: url('${frames[3]}');
  }
  70% {
    translate: 0px -${height}px;
    background-image: url('${frames[3]}');
  }
  80% {
    background-image: url('${frames[4]}');
  }
  90% {
    translate: 0px 0px;
    background-image: url('${frames[5]}');
  }
  100% {
    translate: 0px 0px;
    background-image: url('${frames[0]}');
  }
`

const DefaultImage = styled.div`
  background-image: url('${frames[0]}');
  background-size: contain;
  background-repeat: none;
  background-position: center;
  width: 100%;
  height: 100%;
`

const Image = styled(DefaultImage)<{ height: number; duration: number }>`
  animation: ${(props) => props.duration}ms forwards 1 ${(props) => jump(props.height)};
`

const move = (startX: number, startY: number, endX: number, endY: number) => keyframes`
  0% {
    left: ${startX}px;
    top: ${startY}px;
  }
  100% {
    left: ${endX}px;
    top: ${endY}px;
  }
`
const DefaultMove = styled.div<{ startX: number; startY: number }>`
  position: relative;
  left: ${(props) => props.startX}px;
  top: ${(props) => props.startY}px;
  width: 100px;
  height: 100px;
`

const Move = styled(DefaultMove)<{
  duration: number
  startX: number
  startY: number
  endX: number
  endY: number
}>`
  transform: ${({ startX, endX }) => (endX >= startX ? 'scale(1, 1)' : 'scale(-1, 1)')};
  animation: ${(props) => props.duration}ms forwards 1
    ${({ startX, startY, endX, endY }) => move(startX, startY, endX, endY)};
`

export const FrogJump = forwardRef<FrogJumpRef, FrogJumpProps>(
  ({ duration = 1000, height = 50, onJumpComplete, className }, ref) => {
    const [isPlaying, setPlaying] = useState(false)
    const [startPosition, setStartPosition] = useState<Position>({ left: 0, top: 0 })
    const [endPosition, setEndPosition] = useState<Position>({ left: 0, top: 0 })
    useImperativeHandle(ref, () => ({
      jumpTo(target, from) {
        if (from != null) {
          setStartPosition(from)
        }
        setEndPosition(target)
        setPlaying(true)
      },
    }))

    return (
      <>
        {isPlaying ? (
          <Move
            className={className}
            duration={duration}
            startX={startPosition.left}
            startY={startPosition.top}
            endX={endPosition.left}
            endY={endPosition.top}
            onAnimationEnd={() => {
              setStartPosition(endPosition)
              setPlaying(false)
              onJumpComplete?.()
            }}
          >
            <Image height={height} duration={duration} />
          </Move>
        ) : (
          <DefaultMove className={className} startX={startPosition.left} startY={startPosition.top}>
            <DefaultImage />
          </DefaultMove>
        )}
      </>
    )
  },
)

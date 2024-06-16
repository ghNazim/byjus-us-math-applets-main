import { Player, PlayerEvent } from '@lottiefiles/react-lottie-player'
import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { useInterval } from '../../hooks/useInterval'

type position = { left: number; top: number }

interface DNDanimationProps {
  startPostion: position
  endPostion: position
  animationSource: Array<any>
}

const LottieContainer = styled(Player)<{ top?: number; left?: number }>`
  position: absolute;
  left: ${(props) => props.left ?? 90}px;
  top: ${(props) => props.top ?? 690}px;
  pointer-events: none;
`

export const CustomDNDanimation: React.FC<DNDanimationProps> = ({
  startPostion,
  endPostion,
  animationSource,
}) => {
  const [index, setIndex] = useState(0)
  const [position, setPosition] = useState(startPostion)
  const PlayerRef = useRef<any>(null)

  const onEventHandle = (event: PlayerEvent) => {
    if (event === 'complete') setIndex((i) => (i < animationSource.length - 1 ? i + 1 : 0))
  }

  useEffect(() => {
    if (index === 0) setPosition(startPostion)
    PlayerRef.current?.play()
  }, [index, startPostion])

  useInterval(
    () => {
      setPosition({
        left: position.left + (endPostion.left - startPostion.left) / 100,
        top: position.top + (endPostion.top - startPostion.top) / 100,
      })
    },
    index === 1
      ? ((PlayerRef.current.state.instance.totalFrames /
          PlayerRef.current.state.instance.frameRate) *
          1000) /
          100
      : null,
  )

  return (
    <>
      {animationSource.map(
        (src, i) =>
          index === i && (
            <LottieContainer
              key={i}
              src={src}
              left={position.left}
              top={position.top}
              ref={PlayerRef}
              onEvent={onEventHandle}
              autoplay
            />
          ),
      )}
    </>
  )
}

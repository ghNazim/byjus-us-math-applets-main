import { Player } from '@lottiefiles/react-lottie-player'
import { FC, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { OnboardingController } from '@/atoms/OnboardingController'
import { OnboardingStep } from '@/atoms/OnboardingStep'
import { AppletContainer } from '@/common/AppletContainer'
import { TextHeader } from '@/common/Header'
import { AppletInteractionCallback } from '@/contexts/analytics'
import { useInterval } from '@/hooks/useInterval'
import { RangeInput } from '@/molecules/RangeInput'

import animation from './assets/animation.json'

const Slider = styled(RangeInput)`
  margin: 20px auto 32px;
`

const PlayerContainer = styled.div`
  display: flex;
  justify-content: center;
  overflow: hidden;
  height: 650px;
`

const BottomText = styled.div`
  position: absolute;
  width: 600px;
  height: 61px;
  left: 60px;
  top: 615px;

  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;
  /* or 140% */

  text-align: center;

  /* Monotone/110 */

  color: #646464;
`

// Accounting for empty frames.
const TOTAL_FRAMES = animation.op - 2
const PROGRESS_STEP = 1 / TOTAL_FRAMES

export const AppletG06EEC01GB03: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const playerRef = useRef<Player>(null)
  const [targetProgress, setTargetProgress] = useState(0)
  const [currentProgress, setCurrentProgress] = useState(0)
  const [showBottomText, setShowBottomText] = useState(false)

  useInterval(
    () => {
      setCurrentProgress((p) => {
        if (p > targetProgress) return p - PROGRESS_STEP > 0 ? p - PROGRESS_STEP : 0
        if (p < targetProgress) return p + PROGRESS_STEP < 1 ? p + PROGRESS_STEP : 1
        return p
      })
    },
    targetProgress != currentProgress ? 1000 / animation.fr : null,
  )

  useEffect(() => {
    playerRef.current?.setSeeker(currentProgress * TOTAL_FRAMES)
    if (currentProgress === 1) setShowBottomText(true)
  }, [currentProgress])

  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#F6F6F6',
        id: 'g06-eec01-gb03',
        onEvent,
        className,
        themeName: 'dark',
      }}
    >
      <TextHeader
        text="Vary the number of times ‘2’ is added or multiplied and observe the results."
        backgroundColor="#F6F6F6"
        buttonColor="#1A1A1A"
      />
      <PlayerContainer>
        <Player src={animation} ref={playerRef} />
      </PlayerContainer>
      <OnboardingController>
        <OnboardingStep index={0}>
          <Slider
            min={1}
            max={8}
            onChange={(_, ratio) => {
              setTargetProgress(ratio)
            }}
          />
        </OnboardingStep>
      </OnboardingController>
      {showBottomText && (
        <BottomText>
          The result of repeated multiplication grows exponentially whereas the result of repeated
          addition grows linearly.
        </BottomText>
      )}
    </AppletContainer>
  )
}

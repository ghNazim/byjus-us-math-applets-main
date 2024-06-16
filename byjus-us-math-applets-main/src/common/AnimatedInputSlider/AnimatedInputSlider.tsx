import { Player } from '@lottiefiles/react-lottie-player'
import React, { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'

import { useSFX } from '@/hooks/useSFX'

import { AnalyticsContext } from '../../contexts/analytics'
import { useInterval } from '../../hooks/useInterval'
import handAnimation from '../handAnimations/slider.json'
import { AnimatedInputSliderProps } from './AnimatedInputSlider.types'
import { PauseIcon, PlayIcon, ReplayIcon } from './icons'

const Container = styled.div<{ backgroundColor: string }>`
  background-color: ${(props) => props.backgroundColor};
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  border-radius: 10px;
  width: 400px;
  height: 68px;
`
const OnboardingAnimation = styled(Player)`
  position: absolute;
  left: 30px;
  top: -8px;
  pointer-events: none;
`
const Button = styled.button`
  aspect-ratio: 1;
  cursor: pointer;
  width: 44px;
  border: 0;
  padding: 0;
  margin: 5px 0;
  background-color: transparent;

  #primary {
    fill: ${(props) => props.theme.default};
  }

  #secondary {
    fill: ${(props) => props.theme.disabled};
  }

  &:hover {
    scale: 1.1;
    transition: 0.3s;

    #primary {
      fill: ${(props) => props.theme.hover};
    }

    #secondary {
      fill: ${(props) => props.theme.hover};
    }
  }

  &:disabled {
    #primary {
      fill: ${(props) => props.theme.disabled};
    }

    #secondary {
      fill: ${(props) => props.theme.disabled};
    }
  }

  &:active {
    #primary {
      fill: ${(props) => props.theme.disabled};
    }

    #secondary {
      fill: ${(props) => props.theme.disabled};
    }
  }
`

const RangeInput = styled.input.attrs(() => ({ type: 'range' }))<{ progress: number }>`
  appearance: none;
  background: transparent;
  cursor: grab;
  width: 100%;
  height: 10px;
  vertical-align: middle;

  &:focus {
    outline: none;
  }

  &:active {
    cursor: grabbing;
  }

  &::-webkit-slider-runnable-track {
    background: ${(props) =>
      `linear-gradient(to right, ${props.theme.trackColor} ${props.progress}%, ${props.theme.sliderColor} ${props.progress}%)`};
    height: 8px;
    border-radius: 4px;
  }

  &::-moz-range-track {
    background: ${(props) =>
      `linear-gradient(to right,${props.theme.trackColor}  ${props.progress}%, ${props.theme.sliderColor} ${props.progress}%)`};
    height: 8px;
    border-radius: 4px;
  }

  &::-ms-track {
    background: ${(props) =>
      `linear-gradient(to right, ${props.theme.trackColor}  ${props.progress}%, ${props.theme.sliderColor} ${props.progress}%)`};
    height: 8px;
    border-radius: 4px;
  }

  &::-webkit-slider-thumb {
    appearance: none;
    margin-top: -12px; /* Centers thumb on the track - margin-top = (track height in pixels / 2) - (thumb height in pixels /2) */
    background: white;
    border: 5.84px solid ${(props) => props.theme.default};
    height: 32px;
    width: 32px;
    border-radius: 50%;

    &:disabled {
      border-color: ${(props) => props.theme.disabled};
    }

    &:hover {
      border-color: ${(props) => props.theme.hover};
      scale: 1.1;
    }

    &:active {
      border-color: ${(props) => props.theme.default};
    }
  }

  &::-moz-range-thumb {
    appearance: none;
    margin-top: -12px; /* Centers thumb on the track - margin-top = (track height in pixels / 2) - (thumb height in pixels /2) */
    background: white;
    border: 5.84px solid ${(props) => props.theme.default};
    height: 32px;
    width: 32px;
    border-radius: 50%;

    &:disabled {
      border-color: ${(props) => props.theme.disabled};
    }

    &:hover {
      border-color: ${(props) => props.theme.hover};
      scale: 1.1;
    }

    &:active {
      border-color: ${(props) => props.theme.default};
    }
  }

  &::-ms-thumb {
    appearance: none;
    margin-top: -12px; /* Centers thumb on the track - margin-top = (track height in pixels / 2) - (thumb height in pixels /2) */
    background: white;
    border: 5.84px solid ${(props) => props.theme.default};
    height: 32px;
    width: 32px;
    border-radius: 50%;

    &:disabled {
      border-color: ${(props) => props.theme.disabled};
    }

    &:hover {
      border-color: ${(props) => props.theme.hover};
      scale: 1.1;
    }

    &:active {
      border-color: ${(props) => props.theme.default};
    }
  }
`

type ButtonState = 'play' | 'pause' | 'replay'

export const AnimatedInputSlider: React.FC<AnimatedInputSliderProps> = ({
  value = 0,
  min = 0,
  max = 1,
  reset = false,
  animDuration = 1600,
  animationStep: propAnimStep,
  forceHideHandAnimation = false,
  disabled,
  className,
  onChangePercent,
}) => {
  const [valuePercent, setValuePercent] = useState(0)
  const [buttonState, setButtonState] = useState<ButtonState>('play')
  const [showHand, setShowHand] = useState(true)
  const [isAnimating, setAnimating] = useState(false)
  const playMouseInAudio = useSFX('mouseIn')
  const playMouseOutAudio = useSFX('mouseOut')

  const animStep = propAnimStep ?? animDuration / 100
  const progressStep = (animStep * 100) / animDuration

  useEffect(() => {
    setValuePercent(((value - min) / (max - min)) * 100)
  }, [value, max, min])

  useEffect(() => {
    if (valuePercent === 100) {
      setButtonState('replay')
      setAnimating(false)
    }

    if (valuePercent === 0) {
      setButtonState('play')
    }
  }, [valuePercent])

  useEffect(() => {
    if (onChangePercent) {
      onChangePercent(valuePercent)
    }
  }, [valuePercent, onChangePercent])

  useEffect(() => {
    if (reset) {
      setAnimating(false)
      setValuePercent(0)
    }
  }, [reset])

  useEffect(() => {
    if (isAnimating) {
      setButtonState('pause')
      playMouseInAudio()
    } else {
      setButtonState((s) => (s !== 'replay' ? 'play' : 'replay'))
      playMouseOutAudio()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAnimating])

  useInterval(
    () => {
      setValuePercent((v) => v + progressStep)
    },
    !disabled && isAnimating && valuePercent < 100 ? animStep : null,
  )

  const onInteraction = useContext(AnalyticsContext)

  useEffect(() => {
    onInteraction('slide')
  }, [valuePercent, onInteraction])

  const onClicked = () => {
    setShowHand(false)
    switch (buttonState) {
      case 'play':
        setButtonState('pause')
        setAnimating(true)
        break
      case 'pause':
        setButtonState('play')
        setAnimating(false)
        break
      case 'replay':
        setButtonState('pause')
        setValuePercent(0)
        setAnimating(true)
        break

      default:
        break
    }
  }

  const getCurrentIcon = () => {
    switch (buttonState) {
      case 'play':
        return <PlayIcon />

      case 'pause':
        return <PauseIcon />

      case 'replay':
        return <ReplayIcon />
    }
  }

  return (
    <Container backgroundColor="#F6F6F6" className={className}>
      <Button
        // onPointerEnter={() => setButtonHover(true)}
        // onPointerLeave={() => setButtonHover(false)}
        onClick={onClicked}
      >
        {getCurrentIcon()}
      </Button>
      <div style={{ width: '75%' }}>
        <RangeInput
          progress={valuePercent}
          disabled={disabled}
          value={valuePercent}
          onChange={(e) => {
            setShowHand(false)
            setValuePercent(+e.currentTarget.value)
          }}
          onMouseDown={() => playMouseInAudio()}
          onMouseUp={() => playMouseOutAudio()}
        />
        {showHand && !forceHideHandAnimation && (
          <OnboardingAnimation src={handAnimation} loop autoplay />
        )}
      </div>
    </Container>
  )
}

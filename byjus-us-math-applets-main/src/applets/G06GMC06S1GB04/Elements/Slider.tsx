import { MouseEventHandler, useEffect, useState } from 'react'
import styled from 'styled-components'

import { OnboardingAnimation } from '@/atoms/OnboardingAnimation'
import { OnboardingController } from '@/atoms/OnboardingController'
import { OnboardingStep } from '@/atoms/OnboardingStep'

import PauseBtn from './assets/pauseBtn.svg'
import PlayBtn from './assets/playBtn.svg'
import ResetBtn from './assets/resetbtn.svg'

interface SliderProps {
  onChange: (val: number) => void
  min: number
  max: number
  fr: number
}

const StyledSlider = styled.input`
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 5px;
  background: #c7c7c7;
  outline: none;
  opacity: 0.7;
  transition: opacity 0.2s;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 18px;
    height: 18px;
    background: #1a1a1a;
    border-radius: 50%;
    cursor: pointer;
  }

  &::-moz-range-thumb {
    width: 18px;
    height: 18px;
    background: #1a1a1a;
    cursor: pointer;
  }

  &::-moz-range-progress {
    background: #1a1a1a;
  }

  /* &::-webkit-slider-runnable-track {
    background: #1a1a1a;
  } */

  &::-webkit-progress-value {
    background: black;
    height: 10px;
  }
`

const SliderContainer = styled.div`
  position: relative;
  left: -10px;

  background-color: white;
  height: 60px;
  border-radius: 10px;
  gap: 20px;

  padding-top: 5px;
  padding-left: 20px;
  padding-right: 20px;

  display: flex;
  align-items: center;
  justify-content: center;
`

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;

  position: absolute;
  bottom: 130px;
  left: 70px;
`

const OnboardingAnima = styled(OnboardingAnimation)<{ left: number; top: number }>`
  position: absolute;
  left: ${(a) => a.left}px;
  top: ${(a) => a.top}px;
  scale: 0.8;
  z-index: 5;
`

const Slider: React.FC<SliderProps> = ({ onChange, max, fr }) => {
  const [currentVal, setCurrentVal] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [hideOnboarding, setHideOnboarding] = useState(false)

  // Update the value every 100ms when the animation is playing
  useEffect(() => {
    if (!isPlaying) return
    setHideOnboarding(true)
    const timeout = setTimeout(() => {
      setCurrentVal((val) => Math.min(val + 3, 100))
    }, 1000 / fr)

    onChange((currentVal * max) / 100)

    return () => clearTimeout(timeout)
  }, [isPlaying, currentVal])

  useEffect(() => {
    if (currentVal === 100) {
      setIsPlaying(false)
    }
  }, [currentVal])

  const playSlider = () => {
    setIsPlaying(true)
  }

  const pauseSlider = () => {
    setIsPlaying(false)
  }

  const replaySlider = () => {
    setCurrentVal(0)
    setIsPlaying(true)
  }

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentVal(Number(e.target.value))
    onChange((parseFloat(e.target.value) * max) / 100)
  }

  const handleManualSeek = (e: React.MouseEvent<HTMLInputElement>) => {
    setIsPlaying(false)
  }

  return (
    <Container>
      <SliderContainer>
        {currentVal !== 100 ? (
          <div onClick={isPlaying ? pauseSlider : playSlider}>
            <img src={isPlaying ? PauseBtn : PlayBtn} />
          </div>
        ) : (
          <div onClick={replaySlider}>
            <img src={ResetBtn} alt="Reset" />
          </div>
        )}
        <StyledSlider
          type="range"
          min={0}
          max={100}
          step={1}
          value={currentVal}
          onChange={handleSeekChange}
          style={{ width: '500px' }}
          onClick={handleManualSeek}
        />
      </SliderContainer>
      <OnboardingController>
        <OnboardingStep index={0}>
          <OnboardingAnima left={-45} top={-15} type="click" complete={hideOnboarding} />
        </OnboardingStep>
      </OnboardingController>
    </Container>
  )
}

export default Slider

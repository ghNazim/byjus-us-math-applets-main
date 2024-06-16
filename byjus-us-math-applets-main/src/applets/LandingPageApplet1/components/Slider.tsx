import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import styled from 'styled-components'

import { OnboardingAnimation } from '@/atoms/OnboardingAnimation'
import { OnboardingController } from '@/atoms/OnboardingController'
import { OnboardingStep } from '@/atoms/OnboardingStep'
import { useSFX } from '@/hooks/useSFX'

import PauseBtn from '../assets/pauseBtn.svg'
import PlayBtn from '../assets/playBtn.svg'
import ResetBtn from '../assets/resetbtn.svg'

interface SliderProps {
  onChange: (val: number) => void
  max: number
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
    border-radius: 50%;
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

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  background: white;
  padding: 10px 20px;
  position: relative;
  border-radius: 10px;
  margin: 0 70px;
`

const OnboardingAnima = styled(OnboardingAnimation)<{ left: number; top: number }>`
  position: absolute;
  top: ${(a) => a.top}px;
  left: ${(a) => a.left}px;
`

const PlayBtns = styled.div`
  cursor: pointer;
`

export interface SliderRefProps {
  reset: () => void
}

const Slider = forwardRef<SliderRefProps, SliderProps>(({ onChange, max }, ref) => {
  const [currentVal, setCurrentVal] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const playMouseClick = useSFX('mouseClick')

  useImperativeHandle(ref, () => ({
    reset() {
      setCurrentVal(0)
      setIsPlaying(false)
    },
  }))

  useEffect(() => {
    if (!isPlaying) return

    const timeout = setTimeout(() => {
      setCurrentVal((val) => Math.min(val + 1, 100))
    }, 25)

    onChange((currentVal * max) / 100)

    return () => clearTimeout(timeout)
  }, [isPlaying, currentVal])

  const playSlider = () => {
    playMouseClick()
    setIsPlaying(true)
  }

  const pauseSlider = () => {
    playMouseClick()
    setIsPlaying(false)
  }

  const replaySlider = () => {
    playMouseClick()
    setCurrentVal(0)
    setIsPlaying(true)
  }

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentVal(Number(e.target.value))
    onChange((parseFloat(e.target.value) * max) / 100)
    setIsPlaying(false)
  }

  return (
    <Container>
      {currentVal !== 100 ? (
        <PlayBtns onClick={isPlaying ? pauseSlider : playSlider}>
          <img src={isPlaying ? PauseBtn : PlayBtn} style={{ pointerEvents: 'none' }} />
        </PlayBtns>
      ) : (
        <PlayBtns onClick={replaySlider}>
          <img src={ResetBtn} alt="Reset" style={{ pointerEvents: 'none' }} />
        </PlayBtns>
      )}

      <StyledSlider
        type="range"
        min={0}
        max={100}
        step={1}
        value={currentVal}
        onChange={handleSeekChange}
        style={{ width: '500px' }}
      />
    </Container>
  )
})

export default Slider

import { useEffect, useState } from 'react'
import styled from 'styled-components'

import PauseBtn from '../assets/pauseBtn.svg'
import PlayBtn from '../assets/playBtn.svg'
import ResetBtn from '../assets/resetbtn.svg'

interface SliderProps {
  onChange: (val: number) => void
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

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
`

const Slider: React.FC<SliderProps> = ({ onChange }) => {
  const [currentVal, setCurrentVal] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  // Update the value every 100ms when the animation is playing
  useEffect(() => {
    if (!isPlaying) return

    const timeout = setTimeout(() => {
      setCurrentVal((val) => Math.min(val + 5, 100))
    }, 200)

    onChange(currentVal / 10)

    return () => clearTimeout(timeout)
  }, [isPlaying, currentVal])

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
    onChange(parseFloat(e.target.value) / 10)
  }
  return (
    <Container>
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
        value={currentVal}
        onChange={handleSeekChange}
        style={{ width: '500px' }}
      />
    </Container>
  )
}

export default Slider

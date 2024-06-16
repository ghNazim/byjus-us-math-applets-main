import { Player } from '@lottiefiles/react-lottie-player'
import { FC, useCallback, useRef, useState } from 'react'
import styled from 'styled-components'

import { AnimatedInputSlider } from '@/common/AnimatedInputSlider'
import { AppletContainer } from '@/common/AppletContainer'
import { TextHeader } from '@/common/Header'
import { AppletInteractionCallback } from '@/contexts/analytics'

import handClick from '../../common/handAnimations/click.json'
import house1Default from './assets/House01.mp4'
import house2Default from './assets/House02.mp4'
import house3Default from './assets/House03.mp4'
import selectFrame from './assets/select.png'
import ToggleGroupC from './ToggleGroup/ToggleGroup'

const SelectFrame = styled.img`
  width: 398;
  height: 362;
  position: absolute;
  top: 80px;
  left: 50%;
  translate: -50%;
`
const PlacedSlider = styled(AnimatedInputSlider)`
  position: absolute;
  left: 50%;
  translate: -50%;
  bottom: 200px;
`
const PlacedPlayer = styled(Player)`
  position: absolute;
  left: 60px;
  bottom: -20px;
  pointer-events: none;
`
const ShapePlayer = styled.video`
  width: 680px;
  height: 680px;
  position: absolute;
  left: 50%;
  translate: -50%;
  top: 10px;
  pointer-events: none;
  border: none;
`
const HideComponent = styled.div`
  width: 600px;
  height: 600px;
  position: absolute;
  left: 50%;
  translate: -50%;
  top: 20px;
  background-color: white;
`
const animations = [[house1Default], [house2Default], [house3Default]]
const frames = [1.5, 1.5, 1.5]
export const AppletG07GMC08S1GB01: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const [resetSlider, setResetSlider] = useState(false)
  const [showHandPointer, setShowHandPointer] = useState(true)
  const [playerControl, setPlayerControl] = useState(-1)
  const playerRef = useRef<HTMLVideoElement>(null)
  const playerTextRef = useRef<HTMLVideoElement>(null)

  const onSliderChange = (value: number) => {
    if (playerTextRef.current == null) return
    setResetSlider(false)
    playerTextRef.current.currentTime = isFinite(playerTextRef.current.duration)
      ? (value / 100) * frames[playerControl]
      : 0
    if (playerRef.current !== null)
      playerRef.current.currentTime = isFinite(playerRef.current.duration)
        ? (value / 100) * frames[playerControl]
        : 0
  }

  const handleToggleChange = useCallback((activeId: number) => {
    if (activeId < 0) return
    setResetSlider(true)
    setPlayerControl(activeId)
    setShowHandPointer(false)
  }, [])
  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#F6F6F6',
        id: 'g07-gmc08-s1-gb01',
        onEvent,
        className,
        themeName: 'dark',
      }}
    >
      <TextHeader
        text="Explore Composite Solids."
        backgroundColor="#F6F6F6"
        buttonColor="#1A1A1A"
      />
      {showHandPointer && <SelectFrame src={selectFrame} />}
      {!showHandPointer && <HideComponent />}
      {!showHandPointer && (
        <ShapePlayer src={animations[playerControl][0]} muted ref={playerTextRef} />
      )}

      {!showHandPointer && (
        <PlacedSlider
          reset={resetSlider}
          onChangePercent={(e) => {
            onSliderChange(e)
          }}
          min={0}
          max={100}
        />
      )}
      <ToggleGroupC noOfChildren={3} onChange={handleToggleChange} disabled={resetSlider} />
      {showHandPointer && <PlacedPlayer src={handClick} autoplay loop />}
    </AppletContainer>
  )
}

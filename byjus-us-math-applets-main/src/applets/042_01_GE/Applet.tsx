import { Player } from '@lottiefiles/react-lottie-player'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { AnimatedInputSlider } from '../../common/AnimatedInputSlider'
import { AppletContainer } from '../../common/AppletContainer'
import handClick from '../../common/handAnimations/click.json'
import { TextHeader } from '../../common/Header'
import { AppletInteractionCallback } from '../../contexts/analytics'
import cameraDefault from './assets/camera_01.mp4'
import cameraText from './assets/camera_02.mp4'
import houseDefault from './assets/house_01.mp4'
import houseText from './assets/house_02.mp4'
import rocketDefault from './assets/rocket_01.mp4'
import rocketText from './assets/rocket_02.mp4'
import selectFrame from './assets/selectShape.png'
import ToggleGroup from './ToggleGroup/ToggleGroup'
const SelectFrame = styled.img`
  width: 398;
  height: 362;
  position: absolute;
  top: 126px;
  left: 50%;
  translate: -50%;
`
const PlacedSlider = styled(AnimatedInputSlider)`
  position: absolute;
  left: 50%;
  translate: -50%;
  bottom: 210px;
`
const PlacedPlayer = styled(Player)`
  position: absolute;
  left: 60px;
  bottom: -20px;
  pointer-events: none;
`
const ShapePlayer = styled.video`
  width: 600px;
  height: 600px;
  position: absolute;
  left: 50%;
  translate: -50%;
  top: 20px;
  pointer-events: none;
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
const animations = [
  [cameraDefault, cameraText],
  [rocketDefault, rocketText],
  [houseDefault, houseText],
]
const frames = [1, 1, 1.516]
export const Applet04201Ge: React.FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const [resetSlider, setResetSlider] = useState(false)
  const [showHandPointer, setShowHandPointer] = useState(true)
  const [playerControl, setPlayerControl] = useState(-1)
  const playerRef = useRef<HTMLVideoElement>(null)
  const playerTextRef = useRef<HTMLVideoElement>(null)
  const [textDisplay, setTextDisplay] = useState(false)
  const onSliderChange = (value: number) => {
    if (playerTextRef.current == null) return
    setResetSlider(false)
    playerTextRef.current.currentTime = isFinite(playerTextRef.current.duration)
      ? (value / 100) * frames[playerControl]
      : 0
    if (!textDisplay && playerRef.current !== null)
      playerRef.current.currentTime = isFinite(playerRef.current.duration)
        ? (value / 100) * frames[playerControl]
        : 0

    if (value === 100 && !resetSlider) {
      setTextDisplay(true)
    }
  }

  const handleToggleChange = useCallback((activeId: number) => {
    if (activeId < 0) return
    setResetSlider(true)
    setTextDisplay(false)
    setPlayerControl(activeId)
    setShowHandPointer(false)
  }, [])
  useEffect(() => {})
  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#FFECF2',
        id: '042_01_GE',
        onEvent,
        className,
      }}
    >
      <TextHeader
        text="Disassemble the given object to observe its constituent shapes."
        backgroundColor="#FFECF2"
        buttonColor="#FFCCDB"
      />
      {showHandPointer && <SelectFrame src={selectFrame} />}
      {!showHandPointer && (
        <ShapePlayer src={animations[playerControl][1]} muted ref={playerTextRef} />
      )}
      {!showHandPointer && !textDisplay && <HideComponent />}
      {!showHandPointer && !textDisplay && (
        <ShapePlayer src={animations[playerControl][0]} muted ref={playerRef} />
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
      <ToggleGroup noOfChildren={3} onChange={handleToggleChange} disabled={resetSlider} />
      {showHandPointer && <PlacedPlayer src={handClick} autoplay loop />}
    </AppletContainer>
  )
}

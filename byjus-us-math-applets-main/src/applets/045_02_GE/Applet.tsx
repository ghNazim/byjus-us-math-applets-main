import { Player } from '@lottiefiles/react-lottie-player'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { AnimatedInputSlider } from '../../common/AnimatedInputSlider'
import { AppletContainer } from '../../common/AppletContainer'
import { Geogebra } from '../../common/Geogebra'
import { GeogebraAppApi } from '../../common/Geogebra/Geogebra.types'
import handClick from '../../common/handAnimations/click.json'
import { TextHeader } from '../../common/Header'
import { AppletInteractionCallback } from '../../contexts/analytics'
import selectPrism from './assets/selectPrism.png'
import ToggleGroup from './ToggleGroup/ToggleGroup'
const SelectPrism = styled.img`
  position: absolute;
  top: 70px;
  left: 50%;
  translate: -50%;
`
const GGB = styled(Geogebra)`
  position: absolute;
  top: 80px;
  left: 50%;
  translate: -50%;
`
const PlacedPlayer = styled(Player)`
  position: absolute;
  left: 60px;
  bottom: -20px;
  pointer-events: none;
`
const PlacedSlider = styled(AnimatedInputSlider)`
  position: absolute;
  left: 50%;
  translate: -50%;
  bottom: 210px;
`
const Text = styled.div`
  position: absolute;
  width: 600px;
  height: 70px;
  top: 447px;
  left: 50%;
  translate: -50%;

  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;
  text-align: center;
  color: #646464;
`
const texts = [
  'The net of the rectangular prism has 6 rectangular faces.',
  'The net of the triangular prism has 3 rectangular faces and 2 triangular faces.',
  'The net of the square prism has 6 square faces.',
]
export const Applet04502Ge: React.FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const [resetSlider, setResetSlider] = useState(false)
  const [showHandPointer, setShowHandPointer] = useState(true)
  const [playerControl, setPlayerControl] = useState(-1)
  const [ggbLoaded, setGGBLoaded] = useState(false)
  const [showText, setShowText] = useState(false)
  const ggbApi = useRef<GeogebraAppApi | null>(null)
  const onHandleGGB = useCallback((api: GeogebraAppApi | null) => {
    ggbApi.current = api
    if (api == null) return
    setGGBLoaded(true)
  }, [])
  const onSliderChange = (value: number) => {
    if (ggbApi.current == null) return
    setResetSlider(false)
    switch (playerControl) {
      case 0:
        ggbApi.current.setValue('cuboid', value / 100)
        break
      case 1:
        ggbApi.current.setValue('triangularprism', value / 100)
        break
      case 2:
        ggbApi.current.setValue('cub', value / 100)
        break
    }
    if (value === 100 && !resetSlider) {
      setShowText(true)
    }
  }
  const handleToggleChange = useCallback((activeId: number) => {
    if (activeId < 0) return
    setResetSlider(true)
    setShowText(false)
    setPlayerControl(activeId)
    setShowHandPointer(false)
  }, [])
  useEffect(() => {
    const api = ggbApi.current
    if (api == null) return
    api.setValue('cub', 0)
    api.setValue('cuboid', 0)
    api.setValue('triangularprism', 0)
    api.setValue('Prisms', playerControl)
  }, [playerControl])
  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#FAF2FF',
        id: '045_02_GE',
        onEvent,
        className,
      }}
    >
      <TextHeader
        text="Unfold the given prisms to observe their nets."
        backgroundColor="#FAF2FF"
        buttonColor="#EACCFF"
      />
      <GGB
        width={500}
        height={400}
        materialId="nmdbhbcv"
        onApiReady={onHandleGGB}
        isApplet2D={true}
      />
      {!showHandPointer && ggbLoaded && (
        <PlacedSlider
          reset={resetSlider}
          onChangePercent={(e) => {
            onSliderChange(e)
          }}
          min={0}
          max={100}
        />
      )}
      {ggbLoaded && (
        <ToggleGroup noOfChildren={3} onChange={handleToggleChange} disabled={resetSlider} />
      )}
      {showText && <Text>{texts[playerControl]}</Text>}
      {showHandPointer && ggbLoaded && <PlacedPlayer src={handClick} autoplay loop />}
      {showHandPointer && <SelectPrism src={selectPrism} />}
    </AppletContainer>
  )
}

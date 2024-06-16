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
import ToggleGroup from './ToggleGroup/ToggleGroup'

const HandPointer = styled(Player)`
  position: absolute;
  bottom: 0;
  left: 210px;
  pointer-events: none;
`
const GGBLeft = styled(Geogebra)`
  position: absolute;
  right: 360px;
  top: 80px;
  pointer-events: none;
  scale: 0.9;
`
const Border = styled.div`
  width: 342px;
  height: 283px;
  position: absolute;
  left: 358px;
  top: 135px;
  border: 1.5px solid #c882fa;
  border-radius: 9px;
  pointer-events: none;
`
const GGBRight = styled(Geogebra)`
  position: absolute;
  left: 340px;
  top: 80px;
  pointer-events: none;
  scale: 0.9;
`
const PlacedSlider = styled(AnimatedInputSlider)`
  position: absolute;
  left: 50%;
  translate: -50%;
  top: 500px;
`
export const Applet4504Ge: React.FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const [resetSlider, setResetSlider] = useState(true)
  const [activeToggle, setActiveToggle] = useState(0)
  const ggbApiLeft = useRef<GeogebraAppApi | null>(null)
  const ggbApiRight = useRef<GeogebraAppApi | null>(null)
  const [ggbLoaded, setGGBLoaded] = useState(false)
  const [showHand, setShowHands] = useState(0)
  const onHandleGGBLeft = useCallback((api: GeogebraAppApi | null) => {
    ggbApiLeft.current = api
    if (api == null) return
  }, [])
  const onHandleGGBRight = useCallback((api: GeogebraAppApi | null) => {
    ggbApiRight.current = api
    if (api == null) return
    setGGBLoaded(true)
  }, [])
  const onSliderChange = (value: number) => {
    if (ggbApiRight.current == null) return
    setResetSlider(false)
    ggbApiRight.current.setValue('d', 1 - value / 100)
    if (value === 100) {
      setShowHands((v) => {
        return v == 0 || v == 1 ? 1 : 2
      })
    }
  }
  const handleToggleChange = useCallback((activeId: number) => {
    if (activeId < 0) return
    setShowHands((v) => (v !== 0 ? 2 : 0))
    setResetSlider(true)
    setActiveToggle(activeId)
  }, [])
  useEffect(() => {
    const option = activeToggle + 1
    if (ggbApiRight.current == null || ggbApiLeft.current == null) return
    ggbApiRight.current.setValue('o', option)
    ggbApiLeft.current.setValue('d', option)
  }, [activeToggle])
  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#FAF2FF',
        id: '45_04_GE',
        onEvent,
        className,
      }}
    >
      <TextHeader
        text="Unfold the rectangular prism and observe its nets."
        backgroundColor="#FAF2FF"
        buttonColor="#F4E5FF"
      />
      <GGBLeft
        width={380}
        height={388}
        materialId="d8brgryq"
        onApiReady={onHandleGGBLeft}
        isApplet2D={true}
      />
      <GGBRight
        width={380}
        height={388}
        materialId="snqdfr9m"
        onApiReady={onHandleGGBRight}
        isApplet2D={true}
      />
      {ggbLoaded && <Border />}
      {ggbLoaded && (
        <PlacedSlider
          onChangePercent={(e) => {
            onSliderChange(e)
          }}
          reset={resetSlider}
          min={0}
          max={1}
        />
      )}
      {ggbLoaded && (
        <ToggleGroup noOfChildren={5} onChange={handleToggleChange} disabled={resetSlider} />
      )}
      {showHand === 1 && <HandPointer src={handClick} autoplay loop />}
    </AppletContainer>
  )
}

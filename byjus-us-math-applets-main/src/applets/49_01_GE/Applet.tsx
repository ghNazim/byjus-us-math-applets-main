import { Player } from '@lottiefiles/react-lottie-player'
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import styled, { keyframes } from 'styled-components'

import { useSFX } from '@/hooks/useSFX'

import { AnimatedInputSlider } from '../../common/AnimatedInputSlider'
import { AppletContainer } from '../../common/AppletContainer'
import { Geogebra } from '../../common/Geogebra'
import { GeogebraAppApi } from '../../common/Geogebra/Geogebra.types'
import clickAnim from '../../common/handAnimations/click.json'
import { TextHeader } from '../../common/Header'
import { AnalyticsContext, AppletInteractionCallback } from '../../contexts/analytics'
import { ButtonBase, qnConfigs } from './Assets/assetLib'

const fadeInRight = keyframes`
  from {
    opacity: 0;
    transform: translate3d(100%, 0, 0);
  }

  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
`

const ButtonHolder = styled.div`
  width: 100%;
  height: 100px;
  display: flex;
  justify-content: center;
  margin-top: 650px;
  gap: 60px;
`

const ClickAnim = styled(Player)`
  position: absolute;
  bottom: 0px;
  left: 50px;
  pointer-events: none;
`

const StyledGeogebra = styled(Geogebra)`
  position: absolute;
  width: 600px;
  top: 60px;
  left: 70px;
  z-index: -1;
`

const TextHolder = styled.div`
  position: absolute;
  width: 80%;
  top: 450px;
  left: 70px;
  z-index: 5;

  animation-duration: 500ms;
  animation-timing-function: ease;
  animation-delay: 0s;
  animation-iteration-count: 1;
  animation-direction: normal;
  animation-fill-mode: both;
  animation-play-state: running;
  animation-name: ${fadeInRight};
`

const SliderContainer = styled.div`
  position: absolute;
  top: 520px;
  left: 160px;
  width: 291.71px;
`

const PlaceHolder = styled.div`
  position: absolute;
  top: 100px;
  left: 120px;
  width: 500px;
  height: 350px;
  border: 4px dotted #1cb9d9;
  border-radius: 15px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25) inset;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Nunito';
  font-size: 20px;
  font-weight: 700;
  color: #646464;
`

export const Applet4901Ge: React.FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const [ggbLoaded, setGgbLoaded] = useState(false)
  const ggbApi = useRef<GeogebraAppApi | null>(null)
  const [currentSel, setCurrentSel] = useState(4)
  const [showText, setShowText] = useState(false)
  const playMouseIn = useSFX('mouseIn')
  const [sliderVal, setSliderVal] = useState(0)
  const onInteraction = useContext(AnalyticsContext)
  const [resetSlider, setResetSlider] = useState(false)
  const [showClickAnim, setShowClickAnim] = useState(true)

  const onGGBLoaded = useCallback((api: GeogebraAppApi | null) => {
    setGgbLoaded(true)
    ggbApi.current = api
    api?.setValue('Options', currentSel + 1)
  }, [])

  const handleClick = (props: number) => {
    setShowClickAnim(false)
    onInteraction('tap')
    playMouseIn()
    setShowText(false)
    setResetSlider(false)
    setCurrentSel(props)
    ggbApi.current?.setValue('Options', props + 1)
  }

  const buttonRenderer = () => {
    return qnConfigs.map((value, index) => (
      <ButtonBase
        key={index}
        onClick={handleClick}
        data={{ btnNumber: value.buttoNo, currentSel: currentSel, imageSrc: value.imageSrc }}
      />
    ))
  }

  const onSliderChange = (value: any) => {
    setResetSlider(true)
    setSliderVal(value)
    if (ggbApi.current) ggbApi.current.setValue('α', (value * 3.14159) / 100)
  }

  useEffect(() => {
    if (sliderVal === 100) setShowText(true)
  }, [sliderVal])

  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#D1F7FF',
        id: '49_01_GE',
        onEvent,
        className,
      }}
    >
      <TextHeader
        text="Select a triangle and observe how the measures of its internal angles add up."
        backgroundColor="#E7FBFF"
        buttonColor="#D1F7FF"
      />
      {currentSel === 4 ? (
        <PlaceHolder>Select a triangle</PlaceHolder>
      ) : (
        <StyledGeogebra materialId="pkjkmqzy" onApiReady={onGGBLoaded} />
      )}
      <SliderContainer>
        {ggbLoaded ? (
          <AnimatedInputSlider onChangePercent={onSliderChange} reset={!resetSlider} />
        ) : null}
      </SliderContainer>
      {showText ? (
        <TextHolder>
          <div
            style={{
              color: '#646464',
              fontFamily: 'Nunito',
              fontSize: '20px',
              fontWeight: '700',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}
          >
            <div>The sum of the measures of angles of a triangle is 180°.</div>
          </div>
        </TextHolder>
      ) : null}
      <ButtonHolder className="holder">{buttonRenderer()}</ButtonHolder>
      {showClickAnim ? <ClickAnim src={clickAnim} loop autoplay /> : undefined}
    </AppletContainer>
  )
}

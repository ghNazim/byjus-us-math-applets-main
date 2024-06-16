import { Player } from '@lottiefiles/react-lottie-player'
import { FC, useCallback, useEffect, useRef, useState } from 'react'
import styled, { keyframes } from 'styled-components'
import { Stage, useTransition } from 'transition-hook'
import useSound from 'use-sound'

import { slider } from '@/assets/onboarding'
import { AppletContainer } from '@/common/AppletContainer'
import { Geogebra } from '@/common/Geogebra'
import { GeogebraAppApi } from '@/common/Geogebra/Geogebra.types'
import { TextHeader } from '@/common/Header'
import { AnalyticsContext, AppletInteractionCallback } from '@/contexts/analytics'
import { useSFX } from '@/hooks/useSFX'
import { RangeInput } from '@/molecules/RangeInput'

import page0T from './assets/page0Text.svg'
import ConstantText from './assets/Page1Constant.svg'
import DecreasingText from './assets/Page1Decreasing.svg'
import IncreasingText from './assets/Page1Increasing.svg'
import TryNewB from './assets/TryeNew.svg'
import VBActive from './assets/Visualise.svg'
import VBInactive from './assets/VisualiseInactive.svg'

const GGBContainer = styled(Geogebra)`
  position: absolute;
  display: flex;
  left: 50%;
  translate: -50%;
  top: 100px;
  z-index: 0;
`

const Slider = styled(RangeInput)<{ left: number }>`
  position: absolute;
  left: ${(p) => p.left}px;
  top: 630px;
  width: 40%;
`
const VisualizeButtonActiveButton = styled.img`
  position: absolute;
  left: 50%;
  translate: -50%;
  top: 720px;
  z-index: 1;
`
const VisualizeButtonInactive = styled.img`
  position: absolute;
  left: 50%;
  translate: -50%;
  top: 720px;
  z-index: 0;
`
const ImageTexts = styled.img`
  position: absolute;
  left: 50%;
  translate: -50%;
  top: 540px;
`
const TryNewButton = styled.img`
  position: absolute;
  left: 50%;
  translate: -50%;
  top: 720px;
  z-index: 2;
`
export const AppletFakeApplet: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const [ggbLoaded, setGGBLoaded] = useState(false)
  const ggbApi = useRef<GeogebraAppApi | null>(null)
  const [slider1Value, setSlider1Value] = useState(0)
  const [slider2Value, setSlider2Value] = useState(0)
  const [isButtonActive, setIsButtonActive] = useState(false)
  const [isButtonInActive, setIsButtonInActive] = useState(true)
  const [page0TextVisible, setpage0TextVisible] = useState(true)

  const [isTryNewActive, setIsTryNewActive] = useState(false)
  const [slider1Interacted, setSlider1Interacted] = useState(false)
  const [slider2Interacted, setSlider2Interacted] = useState(false)

  const playClick = useSFX('mouseClick')

  const onGGBLoaded = useCallback(
    (api: GeogebraAppApi | null) => {
      ggbApi.current = api
      setGGBLoaded(true)
    },
    [ggbLoaded],
  )

  const handleSlider1Change = (value: number) => {
    setSlider1Value(value)
    setSlider1Interacted(true)
    VisualizeButtonActivation()
    ggbApi.current?.setValue('m', value)
  }

  const handleSlider2Change = (value: number) => {
    setSlider2Value(value)
    setSlider2Interacted(true)
    VisualizeButtonActivation()
    ggbApi.current?.setValue('c', value)
  }

  const VisualizeButtonActivation = () => {
    if (slider1Interacted || slider2Interacted) {
      setIsButtonActive(true)
    } else {
      setIsButtonActive(false)
    }
  }

  const handleVisualizeButtonClick = () => {
    playClick()

    ggbApi.current?.evalCommand('RunClickScript(button1)')
    setIsButtonActive(false)
    setIsButtonInActive(false)
    if (ggbApi != null && ggbLoaded) {
      ggbApi.current?.registerObjectUpdateListener('an', () => {
        const animationValue = ggbApi.current?.getValue('an')
        if (animationValue === 20) {
          setIsTryNewActive(true)
        }
      })
    }
    setpage0TextVisible(false)
  }
  const handleTryeNewButton = () => {
    playClick()
    ggbApi.current?.evalCommand('RunClickScript(button2)')
    setSlider1Value(0)
    setSlider2Value(0)
    setIsTryNewActive(false)
    setIsButtonInActive(true)
    setpage0TextVisible(true)
  }
  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#F6F6F6',
        id: 'fake-applet',
        onEvent,
        className,
        themeName: 'dark',
      }}
    >
      <TextHeader
        text="Discover the characteristics of increasing, decreasing, and constant functions based on their equations."
        backgroundColor="#F6F6F6"
        buttonColor="#1A1A1A"
      />
      <GGBContainer materialId="tw2zxhe4" onApiReady={onGGBLoaded} width={696} height={419} />
      {
        <Slider
          label={'Line Slope'}
          min={-5}
          max={5}
          left={30}
          defaultValue={0}
          value={slider1Value}
          onChange={handleSlider1Change}
          step={1}
        />
      }
      {
        <Slider
          label={'Y-Intercept'}
          min={-3}
          max={3}
          left={380}
          defaultValue={0}
          value={slider2Value}
          onChange={handleSlider2Change}
          step={1}
        />
      }
      {isButtonActive && (
        <VisualizeButtonActiveButton src={VBActive} onClick={handleVisualizeButtonClick} />
      )}
      {isButtonInActive && <VisualizeButtonInactive src={VBInactive} />}
      {isTryNewActive && <TryNewButton src={TryNewB} onClick={handleTryeNewButton} />}
      {page0TextVisible && <ImageTexts src={page0T} />}

      {slider1Value > 0 && isTryNewActive && <ImageTexts src={IncreasingText} />}
      {slider1Value < 0 && isTryNewActive && <ImageTexts src={DecreasingText} />}
      {slider1Value === 0 && isTryNewActive && <ImageTexts src={ConstantText} />}
    </AppletContainer>
  )
}

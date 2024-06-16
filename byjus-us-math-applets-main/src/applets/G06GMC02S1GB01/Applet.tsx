import { Player } from '@lottiefiles/react-lottie-player'
import { number } from 'mathjs'
import { FC, useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { AnimatedInputSlider } from '@/common/AnimatedInputSlider'
import { AppletContainer } from '@/common/AppletContainer'
import { Geogebra } from '@/common/Geogebra'
import { GeogebraAppApi } from '@/common/Geogebra/Geogebra.types'
import { TextHeader } from '@/common/Header'
import { AppletInteractionCallback } from '@/contexts/analytics'
import { useSFX } from '@/hooks/useSFX'

import ClickAnimation from '../../common/handAnimations/click.json'
import patch from './assets/p1.jpg'

const GeogebraContainer = styled(Geogebra)<{ top: number; left: number }>`
  position: absolute;
  left: ${(props) => props.left}px;
  top: ${(props) => props.top}px;
`

const SliderContainer = styled(AnimatedInputSlider)`
  position: absolute;
  top: 500px;
  left: 150px;
`

const PatchContainer = styled.img`
  position: absolute;
  width: 50px;
  height: 50px;
  left: 10px;
  top: 745px;
  z-index: 1;
`
const OnboardingAnimationContainer = styled(Player)<{ left: number; top: number }>`
  position: absolute;
  left: ${(a) => a.left}px;
  top: ${(a) => a.top}px;
  pointer-events: none;
`
export const AppletG06GMC02S1GB01: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const [ggbloaded, setGgbLoaded1] = useState(false)
  const ggb = useRef<GeogebraAppApi | null>(null)
  const [slider, setSilder] = useState(number)
  const [counter, setCounter] = useState(0)
  const playMouseCLick = useSFX('mouseClick')
  const [showOnboarding1, setShowOnboarding1] = useState(true)
  const [triggerClickNext, setTriggerClickNext] = useState(false)
  const [triggerClickPrevious, setTriggerClickPrevious] = useState(false)
  const [triggerClickTryAgain, setTriggerClickTryAgain] = useState(false)
  const [isNextActive, setIsNextActive] = useState(false)

  const onGGBLoaded = useCallback((api: GeogebraAppApi | null) => {
    ggb.current = api
    setGgbLoaded1(api != null)
  }, [])

  const onSliderChange = (value: number) => {
    setSilder(value * 0.5)
  }

  useEffect(() => {
    ggb.current?.setValue('sliderforshow', slider)
  }, [slider, counter])

  useEffect(() => {
    const api = ggb.current
    if (!ggbloaded || api == null) return

    api.registerObjectUpdateListener('counter', () => {
      const sliderValue = api.getValue('counter')
      setCounter(sliderValue)
    })

    api.registerObjectClickListener('NextActive', () => {
      setTriggerClickNext(true)
      setShowOnboarding1(false)
    })

    api.registerObjectClickListener('PrevActive', () => {
      playMouseCLick()
    })

    api.registerObjectClickListener('Tryagain', () => {
      playMouseCLick()
    })

    return () => {
      ggb.current?.unregisterObjectUpdateListener('counter')
      api.unregisterObjectClickListener('NextActive')
      api.unregisterObjectClickListener('PrevActive')
      api.unregisterObjectClickListener('Tryagain')
    }
  }, [ggbloaded, playMouseCLick])

  useEffect(() => {
    if (triggerClickNext) {
      setTriggerClickNext(false)
      playMouseCLick()
    }
  }, [triggerClickNext, playMouseCLick])

  useEffect(() => {
    if (triggerClickPrevious) {
      setTriggerClickPrevious(false)
      playMouseCLick()
    }
  }, [triggerClickPrevious, playMouseCLick])

  useEffect(() => {
    if (triggerClickTryAgain) {
      setTriggerClickTryAgain(false)
      playMouseCLick()
    }
  }, [triggerClickTryAgain, playMouseCLick])

  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#F6F6F6',
        id: 'g06-gmc02-s1-gb01',
        onEvent,
        className,
        themeName: 'dark',
      }}
    >
      <TextHeader
        text="Explore the relationship between points, lines, angles, triangles, and circles."
        backgroundColor="#F6F6F6"
        buttonColor="#1A1A1A"
      />
      <GeogebraContainer
        materialId="vmmwryrp"
        top={85}
        left={5}
        width={700}
        height={700}
        onApiReady={onGGBLoaded}
      />

      {ggbloaded && counter === 4 && (
        <SliderContainer
          value={0}
          min={3}
          max={50}
          onChangePercent={onSliderChange}
          reset={slider === 0}
        />
      )}

      <PatchContainer src={patch}></PatchContainer>
      {showOnboarding1 && (
        <>
          <OnboardingAnimationContainer left={320} top={690} src={ClickAnimation} loop autoplay />
        </>
      )}
    </AppletContainer>
  )
}

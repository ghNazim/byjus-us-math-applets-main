import { Player } from '@lottiefiles/react-lottie-player'
import { number } from 'mathjs'
import { FC, useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { moveAllDirections, moveHorizontally } from '@/assets/onboarding'
import { AnimatedInputSlider } from '@/common/AnimatedInputSlider'
import { AppletContainer } from '@/common/AppletContainer'
import { Geogebra } from '@/common/Geogebra'
import { ClientListener, GeogebraAppApi } from '@/common/Geogebra/Geogebra.types'
import { TextHeader } from '@/common/Header'
import { AppletInteractionCallback } from '@/contexts/analytics'
import { useSFX } from '@/hooks/useSFX'
const GeogebraContainer = styled(Geogebra)<{ top: number; left: number }>`
  position: absolute;
  left: ${(props) => props.left}px;
  top: ${(props) => props.top}px;
`
const HandPlayer = styled(Player)`
  position: absolute;
  left: -95px;
  top: 60px;
  pointer-events: none;
  z-index: 1;
`

const HandPlayer1 = styled(Player)`
  position: absolute;
  left: 60px;
  top: 110px;
  pointer-events: none;
  z-index: 1;
`
const HandPlayer2 = styled(Player)`
  position: absolute;
  left: 130px;
  top: 85px;
  pointer-events: none;
  z-index: 1;
`

const SliderContainer = styled(AnimatedInputSlider)`
  position: absolute;
  top: 475px;
  left: 140px;
  width: 450px;
`

export const AppletG06GMC02S1GB02: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const [ggbLoaded, setGGBLoaded1] = useState(false)
  const ggb = useRef<GeogebraAppApi | null>(null)
  const playMouseIn = useSFX('mouseIn')
  const playMouseOut = useSFX('mouseOut')
  const playMouseClick = useSFX('mouseClick')
  const [showOnboarding1, setShowOnboarding1] = useState(true)
  const [showOnboarding2, setShowOnboarding2] = useState(false)
  const [showOnboarding3, setShowOnboarding3] = useState(false)

  const [slider, setSlider] = useState(number)
  const [counter, setCounter] = useState(0)

  const onGGBLoaded = useCallback((api: GeogebraAppApi | null) => {
    ggb.current = api
    setGGBLoaded1(api != null)
  }, [])

  const onSliderChange = (value: number) => {
    const adjustedValue = value * 0.03 + 2
    setSlider(adjustedValue)
  }

  useEffect(() => {
    ggb.current?.setValue('distance', slider)
  }, [slider, counter])

  useEffect(() => {
    const api = ggb.current
    if (api != null && ggbLoaded) {
      const onGGBClient: ClientListener = (e) => {
        if (e.type === 'mouseDown' && e.hits[0] === 'pic2') {
          playMouseIn()
          setShowOnboarding1(false)
        } else if (e.type === 'dragEnd' && e.target === 'PSC1') {
          playMouseOut()
        } else if (e.type === 'mouseDown' && e.hits[0] === 'Handle') {
          playMouseIn()
          setShowOnboarding2(false)
          setShowOnboarding3(false)
        } else if (e.type === 'dragEnd' && e.target === 'Handle') {
          playMouseOut()
        } else if (e.type === 'dragEnd' && e.target === 'pic2') {
          playMouseOut()
        }

        api.registerObjectUpdateListener('screencount', () => {
          const valueScreenCount = api.getValue('screencount')
          if (valueScreenCount === 2) {
            setShowOnboarding2(true)
          } else if (valueScreenCount === 4) {
            setShowOnboarding3(true)
          } else if (valueScreenCount === 5) {
            setSlider(3)
            setCounter(valueScreenCount)
          }
        })
        api.registerObjectClickListener('pic16', () => {
          playMouseClick()
          setShowOnboarding1(true)
        })

        api.registerObjectClickListener('pic17', () => {
          playMouseClick()
        })
      }
      api.registerClientListener(onGGBClient)

      return () => {
        ggb.current?.unregisterClientListener(onGGBClient)
        ggb.current?.unregisterObjectUpdateListener('screencount')
        ggb.current?.unregisterObjectUpdateListener('pic16')
        ggb.current?.unregisterObjectUpdateListener('pic17')
      }
    }
  }, [ggbLoaded, playMouseClick, playMouseIn, playMouseOut])

  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#F6F6F6',
        id: 'g06-gmc02-s1-gb02',
        onEvent,
        className,
        themeName: 'dark',
      }}
    >
      <TextHeader
        text="Visualizing different types of quadrilaterals by changing shapes."
        backgroundColor="#F6F6F6"
        buttonColor="#1A1A1A"
      />
      <GeogebraContainer materialId="umqxef6w" top={100} left={35} onApiReady={onGGBLoaded} />
      {ggbLoaded && (
        <>
          {showOnboarding1 && <HandPlayer src={moveAllDirections} loop autoplay />}
          {showOnboarding2 && <HandPlayer1 src={moveHorizontally} loop autoplay />}
          {showOnboarding3 && <HandPlayer2 src={moveHorizontally} loop autoplay />}
        </>
      )}

      {ggbLoaded && counter === 5 && slider < 5 && (
        <SliderContainer
          value={3}
          min={3}
          max={5}
          onChangePercent={onSliderChange}
          reset={slider === 0}
        />
      )}
    </AppletContainer>
  )
}

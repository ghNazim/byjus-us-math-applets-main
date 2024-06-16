import { Player } from '@lottiefiles/react-lottie-player'
import { number } from 'mathjs'
import { FC, useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { moveHorizontally } from '@/assets/onboarding'
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
const SliderContainer = styled(AnimatedInputSlider)`
  position: absolute;
  top: 475px;
  left: 130px;
  width: 450px;
`
const HandPlayer = styled(Player)`
  position: absolute;
  left: 130px;
  top: 230px;
  pointer-events: none;
  z-index: 1;
`
export const AppletG07GMC02S1GB07: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const [ggbLoaded, setGGBLoaded1] = useState(false)
  const ggb = useRef<GeogebraAppApi | null>(null)
  const playMouseIn = useSFX('mouseIn')
  const playMouseOut = useSFX('mouseOut')
  const playMouseClick = useSFX('mouseClick')
  const [slider, setSlider] = useState(number)
  const [counter, setCounter] = useState(1)
  const [showOnboarding1, setShowOnboarding1] = useState(true)
  const [valueScreenCount, setValueScreenCount] = useState(1)

  const onGGBLoaded = useCallback((api: GeogebraAppApi | null) => {
    ggb.current = api
    setGGBLoaded1(api != null)
  }, [])

  const onSliderChange = (value: number) => {
    const adjustedValue = value * 0.02 + 1
    setSlider(adjustedValue)
  }

  useEffect(() => {
    ggb.current?.setValue('Size', slider)
  }, [slider, counter])

  useEffect(() => {
    const api = ggb.current
    if (api != null && ggbLoaded) {
      const onGGBClient: ClientListener = (e) => {
        if (e.type === 'mouseDown' && e.hits[0] === 'pic3') {
          playMouseIn()
          setShowOnboarding1(false)
        } else if (e.type === 'dragEnd' && e.target === 'pic3') {
          playMouseOut()
        }

        api.registerObjectClickListener('pic5', () => {
          playMouseClick()
        })
        api.registerObjectClickListener('pic8', () => {
          playMouseClick()
          setShowOnboarding1(true)
        })

        api.registerObjectUpdateListener('screen', () => {
          const newValueScreenCount = api.getValue('screen')
          setValueScreenCount(newValueScreenCount)
        })
      }
      api.registerClientListener(onGGBClient)

      return () => {
        ggb.current?.unregisterClientListener(onGGBClient)
        ggb.current?.unregisterObjectUpdateListener('pic5')
        ggb.current?.unregisterObjectUpdateListener('pic8')
      }
    }
  }, [ggbLoaded, playMouseClick, playMouseIn, playMouseOut])
  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#F6F6F6',
        id: 'g07-gmc02-s1-gb07',
        onEvent,
        className,
        themeName: 'dark',
      }}
    >
      <TextHeader
        text="Explore how many triangles can be formed with a given set of angles."
        backgroundColor="#F6F6F6"
        buttonColor="#1A1A1A"
      />
      <GeogebraContainer materialId="dwdhncjb" top={90} left={35} onApiReady={onGGBLoaded} />
      {ggbLoaded && valueScreenCount === 2 && (
        <SliderContainer
          value={0}
          min={0}
          max={3}
          onChangePercent={onSliderChange}
          reset={slider === 0}
        />
      )}
      {ggbLoaded && <>{showOnboarding1 && <HandPlayer src={moveHorizontally} loop autoplay />}</>}
    </AppletContainer>
  )
}

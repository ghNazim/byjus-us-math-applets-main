import { Player } from '@lottiefiles/react-lottie-player'
import { FC, useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { AppletContainer } from '@/common/AppletContainer'
import { Geogebra } from '@/common/Geogebra'
import { GeogebraAppApi } from '@/common/Geogebra/Geogebra.types'
import { TextHeader } from '@/common/Header'
import { AppletInteractionCallback } from '@/contexts/analytics'
import { useSFX } from '@/hooks/useSFX'

import click from '../../common/handAnimations/click.json'
import rotate from '../../common/handAnimations/Rotatebothsides.json'

const GeogebraContainer = styled(Geogebra)<{ top: number; left: number }>`
  position: absolute;
  left: 50%;
  top: 55%;
  transform: translate(-50%, -50%);
  scale: 0.98;
`
const OnboardingAnimationContainer = styled(Player)<{ left: number; top: number }>`
  position: absolute;
  left: ${(a) => a.left}px;
  top: ${(a) => a.top}px;
  pointer-events: none;
  z-index: 1;
`

export const AppletG07GMC03S1GB08: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const [ggbLoaded, setGGBLoaded] = useState(false)
  const ggb = useRef<GeogebraAppApi | null>(null)
  const playMouseClick = useSFX('mouseClick')
  const playMouseIn = useSFX('mouseIn')
  const playMouseOut = useSFX('mouseOut')

  const [showOnboarding1, setShowOnboarding1] = useState(true)
  const [showOnboarding2, setShowOnboarding2] = useState(false)
  const [showOnboarding3, setShowOnboarding3] = useState(false)
  const [showOnboarding4, setShowOnboarding4] = useState(false)

  const onGGBLoaded = useCallback((api: GeogebraAppApi | null) => {
    ggb.current = api
    setGGBLoaded(api != null)
  }, [])

  useEffect(() => {
    const api = ggb.current

    type EventType = any

    const elementsToWatch = [
      'Button2',
      'Button4',
      'Button6',
      'Anext',
      'Bnext',
      'Cnext',
      'pic4_{1}',
      'pic4',
      'pic4_{2}',
      'Button2Seleted',
      'Button4Seleted',
      'Button6Seleted',
    ]

    const onGGBClient = (e: EventType) => {
      if (e.type === 'mouseDown' && elementsToWatch.includes(e.hits[0])) {
        playMouseClick()
        setShowOnboarding1(false)
      } else if (e.type === 'mouseDown' && e.hits[0] === 'MoveImage') {
        playMouseIn()
      } else if (e.type === 'dragEnd' && e.target === 'MoveImage') {
        playMouseOut()
        setShowOnboarding2(false)
        setShowOnboarding3(false)
        setShowOnboarding4(false)
      }
    }

    if (api != null && ggbLoaded) {
      api.registerClientListener(onGGBClient)
      api.registerObjectUpdateListener('r', () => {
        const valuer = Boolean(api.getValue('r'))
        if (valuer === true) {
          setShowOnboarding2(true)
          setShowOnboarding4(false)
        }
      })
      api.registerObjectUpdateListener('t', () => {
        const valuet = Boolean(api.getValue('t'))
        if (valuet === true) {
          setShowOnboarding3(true)
          setShowOnboarding4(false)
        }
      })
      api.registerObjectUpdateListener('u', () => {
        const valuer = Boolean(api.getValue('r'))
        const valuet = Boolean(api.getValue('t'))
        const valueu = Boolean(api.getValue('u'))
        if (valueu === true && valuer === false && valuet === false) {
          setShowOnboarding4(true)
        }
      })
    }

    return () => {
      api?.unregisterClientListener(onGGBClient)
    }
  }, [ggb, ggbLoaded, playMouseClick, playMouseIn, playMouseOut])

  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#F6F6F6',
        id: 'g07-gmc03-s1-gb08',
        onEvent,
        className,
      }}
    >
      <TextHeader
        text="Determine the number of triangles that can be formed when two sides and a non-included angle are given."
        backgroundColor="#F6F6F6"
        buttonColor="#1A1A1A"
      />
      <GeogebraContainer materialId="pxffpkam" top={70} left={0} onApiReady={onGGBLoaded} />
      {showOnboarding1 && ggbLoaded && (
        <>
          <OnboardingAnimationContainer left={250} top={600} src={click} loop autoplay />
        </>
      )}
      {showOnboarding2 && (
        <OnboardingAnimationContainer left={270} top={270} src={rotate} loop autoplay />
      )}
      {showOnboarding3 && (
        <OnboardingAnimationContainer left={270} top={200} src={rotate} loop autoplay />
      )}
      {showOnboarding4 && (
        <OnboardingAnimationContainer left={270} top={130} src={rotate} loop autoplay />
      )}
    </AppletContainer>
  )
}

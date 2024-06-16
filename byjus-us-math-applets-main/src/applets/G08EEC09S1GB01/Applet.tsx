import { Player } from '@lottiefiles/react-lottie-player'
import { FC, useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { AppletContainer } from '@/common/AppletContainer'
import { Geogebra } from '@/common/Geogebra'
import { ClientListener, GeogebraAppApi } from '@/common/Geogebra/Geogebra.types'
import { TextHeader } from '@/common/Header'
import { AppletInteractionCallback } from '@/contexts/analytics'
import { useSFX } from '@/hooks/useSFX'

import dragalldirection from '../../common/handAnimations/moveVertically.json'
import patch from './assets/p1.jpg'

const GeogebraContainer = styled(Geogebra)`
  width: 100%;
  height: 820px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: -1;
`
const PatchContainer = styled.img`
  position: absolute;
  width: 25px;
  height: 25px;
  left: 28px;
  top: 710px;
  z-index: 1;
`
const OnboardingAnimationContainer = styled(Player)<{ left: number; top: number }>`
  position: absolute;
  left: ${(a) => a.left}px;
  top: ${(a) => a.top}px;
  pointer-events: none;
`
export const AppletG08EEC09S1GB01: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const ggbApi = useRef<GeogebraAppApi | null>(null)
  const [ggbLoaded, setGgbLoaded] = useState(false)
  const [showOnboarding1, setShowOnboarding1] = useState(true)
  const playMouseIn = useSFX('mouseIn')
  const playMouseOut = useSFX('mouseOut')
  const playMouseCLick = useSFX('mouseClick')
  const onGGBLoaded = useCallback((api: GeogebraAppApi | null) => {
    ggbApi.current = api
    setGgbLoaded(true)
  }, [])

  useEffect(() => {
    const api = ggbApi.current

    if (api != null && ggbLoaded) {
      if (!ggbApi.current) return

      const onGGBClient: ClientListener = (e) => {
        if (e.type === 'mouseDown' && (e.hits[0] === 'A' || e.hits[0] === 'B')) {
          playMouseIn()
          setShowOnboarding1(false)
        } else if (e.type === 'dragEnd' && (e.target === 'A' || e.target === 'B')) {
          playMouseOut()
        }
      }
      api.registerObjectClickListener('pic3', () => playMouseCLick())
      api.registerObjectClickListener('pic4', () => playMouseCLick())
      api.registerObjectClickListener('pic5', () => playMouseCLick())
      api.registerClientListener(onGGBClient)
    }
  }, [ggbLoaded, playMouseIn, playMouseOut, setShowOnboarding1])

  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#F6F6F6',
        id: 'g08-eec09-s1-gb01',
        onEvent,
        className,
      }}
    >
      <TextHeader
        text="Guide your plane to the island."
        backgroundColor="#F6F6F6"
        buttonColor="#1A1A1A"
      />
      <GeogebraContainer materialId="j9gjs7zz" width={680} height={670} onApiReady={onGGBLoaded} />
      {showOnboarding1 && (
        <OnboardingAnimationContainer left={310} top={190} src={dragalldirection} loop autoplay />
      )}
      <PatchContainer src={patch}></PatchContainer>
    </AppletContainer>
  )
}

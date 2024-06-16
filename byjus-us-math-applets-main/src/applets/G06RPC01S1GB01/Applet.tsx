import { Player } from '@lottiefiles/react-lottie-player'
import { FC, useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { AppletContainer } from '@/common/AppletContainer'
import { Geogebra } from '@/common/Geogebra'
import { ClientListener, GeogebraAppApi } from '@/common/Geogebra/Geogebra.types'
import { TextHeader } from '@/common/Header'
import { AppletInteractionCallback } from '@/contexts/analytics'
import { useSFX } from '@/hooks/useSFX'

import click from '../../common/handAnimations/click.json'
import moveHorizontal from '../../common/handAnimations/clickAndDrag.json'
const GeogebraContainer = styled(Geogebra)`
  position: absolute;
  left: 45%;
  translate: -45%;
  top: 35px;
  scale: 0.85;
`

const OnboardingAnimationContainer = styled(Player)<{ left: number; top: number }>`
  position: absolute;
  left: ${(a) => a.left}px;
  top: ${(a) => a.top}px;
  pointer-events: none;
  z-index: 1;
`
export const AppletG06RPC01S1GB01: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const [ggbLoaded, setGGBLoaded1] = useState(false)
  const ggb = useRef<GeogebraAppApi | null>(null)

  const playMouseClick = useSFX('mouseClick')
  const playMouseIn = useSFX('mouseIn')
  const playMouseOut = useSFX('mouseOut')

  const [showOnboarding1, setShowOnboarding1] = useState(true)
  const [showOnboarding2, setShowOnboarding2] = useState(false)
  const [showOnboarding3, setShowOnboarding3] = useState(false)

  const onGGBLoaded = useCallback((api: GeogebraAppApi | null) => {
    ggb.current = api
    setGGBLoaded1(api != null)
  }, [])

  useEffect(() => {
    const api = ggb.current

    if (api != null && ggbLoaded) {
      const onGGBClient: ClientListener = (e) => {
        if (e.type === 'mouseDown' && e.hits[0] === 'CTAStart') {
          playMouseClick()
          setShowOnboarding1(false)
        } else if (e.type === 'mouseDown' && e.hits[0] === 'plus') {
          playMouseClick()
          setShowOnboarding2(false)
        } else if (e.type === 'mouseDown' && e.hits[0] === 'CTACheck') {
          playMouseClick()
        } else if (e.type === 'mouseDown' && e.hits[0] === 'CTANext') {
          playMouseClick()
        } else if (e.type === 'mouseDown' && e.hits[0] === 'CTACheck2') {
          playMouseClick()
        } else if (e.type === 'mouseDown' && e.hits[0] === 'CTATrynew') {
          playMouseClick()
        } else if (e.type === 'mouseDown' && e.hits[0] === 'CTAReset') {
          playMouseClick()
        } else if (e.type === 'mouseDown' && e.hits[0] === 'minus') {
          playMouseClick()
          setShowOnboarding2(false)
        } else if (e.type === 'mouseDown' && e.hits[0] === 'Dragger') {
          playMouseIn()
          setShowOnboarding3(false)
        } else if (e.type === 'dragEnd' && e.target === 'Dragger') {
          playMouseOut()
        }

        api.registerObjectUpdateListener('layer', () => {
          const valueLayer = api.getValue('layer')
          if (valueLayer === 2) {
            setShowOnboarding2(true)
          } else if (valueLayer === 5) {
            setShowOnboarding3(true)
          }
        })

        return () => {
          ggb.current?.unregisterClientListener(onGGBClient)
          ggb.current?.unregisterObjectUpdateListener('layer')
        }
      }

      api.registerClientListener(onGGBClient)
    }
  }, [ggbLoaded, playMouseClick, playMouseIn, playMouseOut])
  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#F6F6F6',
        id: 'g06-rpc01-s1-gb01',
        onEvent,
        className,
      }}
    >
      <TextHeader
        text="Represent the following ratio using tape diagram."
        backgroundColor="#F6F6F6"
        buttonColor="#1A1A1A"
        hideButton={true}
      />
      <GeogebraContainer materialId="ynqujv3p" onApiReady={onGGBLoaded} />
      {showOnboarding1 && ggbLoaded && (
        <OnboardingAnimationContainer left={300} top={680} src={click} loop autoplay />
      )}
      {showOnboarding2 && (
        <OnboardingAnimationContainer left={360} top={610} src={click} loop autoplay />
      )}
      {showOnboarding3 && (
        <OnboardingAnimationContainer left={170} top={370} src={moveHorizontal} loop autoplay />
      )}
    </AppletContainer>
  )
}

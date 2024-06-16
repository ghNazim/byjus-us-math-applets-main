import { Player } from '@lottiefiles/react-lottie-player'
import { FC, useCallback, useRef, useState } from 'react'
import styled from 'styled-components'

import { AppletContainer } from '@/common/AppletContainer'
import { Geogebra } from '@/common/Geogebra'
import { ClientListener, GeogebraAppApi } from '@/common/Geogebra/Geogebra.types'
import { TextHeader } from '@/common/Header'
import { AppletInteractionCallback } from '@/contexts/analytics'
import { useSFX } from '@/hooks/useSFX'

const GeogebraContainer = styled(Geogebra)`
  position: absolute;
  display: flex;
  justify-content: center;
  width: 740px;
  height: 730px;
  top: 75px;
  border: none;
  scale: 0.97;
  z-index: 0;
`

const OnboardingAnimationContainer = styled(Player)<{ left: number; top: number }>`
  position: absolute;
  left: ${(a) => a.left}px;
  top: ${(a) => a.top}px;
  pointer-events: none;
  z-index: 2;
`

export const AppletG08GMC08S2GB04: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const ggb = useRef<GeogebraAppApi | null>(null)
  const [ggbLoaded, setGGBLoaded] = useState(false)
  const playMouseClick = useSFX('mouseClick')
  const playMouseIn = useSFX('mouseIn')
  const playMouseOut = useSFX('mouseOut')
  const [showOnboarding1, setShowOnboarding1] = useState(true)

  const api = ggb.current

  const onGGBLoaded = useCallback(
    (api: GeogebraAppApi | null) => {
      ggb.current = api
      setGGBLoaded(true)

      const handleGGBEvent: ClientListener = (e) => {
        if (e.type === 'mouseDown' && e.hits[0] === 'start') {
          playMouseClick()
          setShowOnboarding1(false)
        } else if (e.type === 'mouseDown' && e.hits[0] === 'radd') {
          playMouseIn()
          setShowOnboarding1(false)
        } else if (e.type === 'mouseDown' && e.hits[0] === 'next') {
          playMouseClick()
          setShowOnboarding1(false)
        } else if (e.type === 'mouseDown' && e.hits[0] === 'pour') {
          playMouseClick()
          setShowOnboarding1(false)
        } else if (e.type === 'mouseDown' && e.hits[0] === 'retry') {
          playMouseClick()
          setShowOnboarding1(false)
        } else if (e.type === 'dragEnd' && e.target === 'radd') {
          playMouseOut()
        }
      }
      if (api != null && ggbLoaded) {
        api.registerClientListener(handleGGBEvent)
      }

      return () => {
        if (api != null) {
          api.unregisterClientListener(handleGGBEvent)
        }
      }
    },
    [ggbLoaded, playMouseClick, playMouseIn, playMouseOut],
  )
  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#1A1A1A',
        id: 'g08-gmc08-s2-gb04',
        onEvent,
        className,
        themeName: 'dark',
      }}
    >
      <TextHeader
        text="Relation between volume of cone and sphere of same radius."
        backgroundColor="#F6F6F6"
        buttonColor="#1A1A1A"
      />
      <GeogebraContainer materialId="mvn9r9fk" onApiReady={onGGBLoaded} />
    </AppletContainer>
  )
}

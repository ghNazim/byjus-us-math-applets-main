import { Player } from '@lottiefiles/react-lottie-player'
import { FC, useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { AppletContainer } from '@/common/AppletContainer'
import { Geogebra } from '@/common/Geogebra'
import { ClientListener, GeogebraAppApi } from '@/common/Geogebra/Geogebra.types'
import { TextHeader } from '@/common/Header'
import { AppletInteractionCallback } from '@/contexts/analytics'
import { useSFX } from '@/hooks/useSFX'

import alldirection from '../../common/handAnimations/moveAllDirections.json'

const CenteredGGBLeft = styled(Geogebra)`
  position: absolute;
  display: flex;
  justify-content: center;
  width: 740px;
  height: 730px;
  left: -10px;
  top: 60px;
  z-index: 0;
  margin-right: -1px;
  border: none;
  scale: 0.92;
  z-index: 0;
`
const OnboardingAnimationContainer = styled(Player)<{ left: number; top: number }>`
  position: absolute;
  left: ${(a) => a.left}px;
  top: ${(a) => a.top}px;
  pointer-events: none;
`

export const AppletG08GMC06S1GB01: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const ggbApi = useRef<GeogebraAppApi | null>(null)
  const [ggbLoaded, setGGBLoaded] = useState(false)

  const [showOnboarding1, setShowOnboarding1] = useState(true)

  const playMouseClick = useSFX('mouseClick')
  const playMouseIn = useSFX('mouseIn')
  const playMouseOut = useSFX('mouseOut')
  const playCorrect = useSFX('correct')
  const playInCorrect = useSFX('incorrect')

  const onGGBLoaded = useCallback(
    (api: GeogebraAppApi | null) => {
      ggbApi.current = api
      setGGBLoaded(true)

      const handleGGBEvent: ClientListener = (e) => {
        if (e.type === 'mouseDown' && e.hits[0] === 'c_1') {
          playMouseIn()
          setShowOnboarding1(false)
        } else if (e.type === 'mouseDown' && e.hits[0] === 'e_1') {
          playMouseIn()
          setShowOnboarding1(false)
        } else if (e.type === 'mouseDown' && e.hits[0] === 'd_1') {
          playMouseIn()
          setShowOnboarding1(false)
        } else if (e.type === 'mouseDown' && e.hits[0] === 'pic1_{1}') {
          playMouseIn()
          setShowOnboarding1(false)
        } else if (e.type === 'mouseDown' && e.hits[0] === 'pic6') {
          playMouseIn()
          setShowOnboarding1(false)
        } else if (e.type === 'mouseDown' && e.hits[0] === 'pic7') {
          playMouseIn()
          setShowOnboarding1(false)
        } else if (e.type === 'dragEnd' && e.target === 'c_1') {
          playMouseOut()
        } else if (e.type === 'dragEnd' && e.target === 'e_1') {
          playMouseOut()
        } else if (e.type === 'dragEnd' && e.target === 'd_1') {
          playMouseOut()
        } else if (e.type === 'dragEnd' && e.target === 'pic1_{1}') {
          playMouseOut()
        } else if (e.type === 'dragEnd' && e.target === 'pic6') {
          playMouseOut()
        } else if (e.type === 'dragEnd' && e.target === 'pic7') {
          playMouseOut()
        } else if (e.type === 'mouseDown' && e.hits[0] === 'Next1') {
          playMouseClick()
        } else if (e.type === 'mouseDown' && e.hits[0] === 'Next2') {
          playMouseClick()
        } else if (e.type === 'mouseDown' && e.hits[0] === 'Wrong') {
          playMouseClick()
        }

        if (e.type === 'mouseDown' && e.hits[0] === 'Retry') {
          playMouseClick()
          setShowOnboarding1(true)
        }
      }
      if (api != null && ggbLoaded) {
        api.registerClientListener(handleGGBEvent)
      }

      ggbApi.current?.registerObjectUpdateListener('e', () => {
        if (ggbApi.current?.getValue('e') === 3) {
          playCorrect()
        }
      })

      ggbApi.current?.registerObjectUpdateListener('u', () => {
        const booleanu = Boolean(ggbApi.current?.getValue('u'))
        if (booleanu == true) {
          playInCorrect()
        }
      })

      ggbApi.current?.registerObjectUpdateListener('o', () => {
        const booleano = Boolean(ggbApi.current?.getValue('o'))
        if (booleano == true) {
          playMouseClick()
        }
      })
      return () => {
        if (api != null) {
          api.unregisterClientListener(handleGGBEvent)
        }
      }
    },
    [ggbLoaded, playCorrect, playInCorrect, playMouseClick, playMouseIn, playMouseOut],
  )

  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#F6F6F6',
        id: 'g08-gmc06-s1-gb01',
        onEvent,
        className,
      }}
    >
      <CenteredGGBLeft materialId={'bemaq8ye'} onApiReady={onGGBLoaded} width={740} height={730} />
      <TextHeader
        text="Exploration of the Pythagorean theorem."
        backgroundColor="#F6F6F6"
        buttonColor="#1A1A1A"
      />

      {showOnboarding1 && ggbApi && (
        <OnboardingAnimationContainer left={80} top={80} src={alldirection} loop autoplay />
      )}
    </AppletContainer>
  )
}

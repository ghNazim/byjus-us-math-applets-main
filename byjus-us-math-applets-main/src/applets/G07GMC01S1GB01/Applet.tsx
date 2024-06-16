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

const GeogebraContainer = styled(Geogebra)<{ top: number; left: number }>`
  position: absolute;
  left: 37.5%;
  top: 45%;
  transform: translate(-50%, -50%);
  scale: 0.8;
`
const OnboardingAnimationContainer = styled(Player)<{ left: number; top: number }>`
  position: absolute;
  left: ${(a) => a.left}px;
  top: ${(a) => a.top}px;
  pointer-events: none;
  z-index: 1;
`

export const AppletG07GMC01S1GB01: FC<{
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

  const onGGBLoaded = useCallback((api: GeogebraAppApi | null) => {
    ggb.current = api
    setGGBLoaded(api != null)
  }, [])

  useEffect(() => {
    const api = ggb.current

    type EventType = any

    const elementsToWatch = [
      'Next1',
      'Next2',
      'Next3',
      'Next4',
      'Next5',
      'Next6',
      'Reset',
      'Pop1_1',
      'Selector1_1',
      'SelectorC',
      'SelectorC_{1}',
      'Pop1_2',
      'Pop1_3',
      'SelectE',
      'AWrong',
      'Cwrong_1',
      'WrongC',
      'SelectD',
      'SelectF',
      'SelectE_1',
      'SelectD_1',
      'SelectF_1',
      'SelectE_2',
      'SelectD_2',
      'SelectF_2',
      'SelectorAngleC_{1}',
      'SelectAngleB',
      'SelectAngleA',
      'pic1',
      'pic2',
      'pic3',
      'pic4',
      'pic5',
      'pic6',
      'pic7',
      'pic8',
      'pic9',
      'SelectorAngleC',
      'SelectorBB',
      'SelectorAB',
      'SelectorAA',
      'AnAWrong',
      'WrongSelectAngB',
      'SelectWrongAngC',
      'SelectorCA_{1}',
      'ABSelector',
      'SelectorBC_{1}',
      'SelectorCA',
      'SelectorBC',
      'pic10',
      'pic11',
      'pic12',
      'pic13',
      'pic14',
      'pic15',
      'pic16',
      'pic17',
      'pic18',
      'WrongCA',
      'WrongAB',
      'WrongBC',
      'Slider',
    ]

    const onGGBClient = (e: EventType) => {
      if (e.type === 'mouseDown' && elementsToWatch.includes(e.hits[0])) {
        playMouseClick()
        setShowOnboarding1(false)
      } else if (e.type === 'mouseDown' && e.hits[0] === 'Slider') {
        playMouseIn()
      } else if (e.type === 'dragEnd' && e.target === 'Slider') {
        playMouseOut()
        setShowOnboarding2(false)
      }
    }

    if (api != null && ggbLoaded) {
      api.registerClientListener(onGGBClient)
      api.registerObjectUpdateListener('Duplicate', () => {
        const valueLayer = api.getValue('Duplicate')
        if (valueLayer === 1) {
          setShowOnboarding2(true)
        }
      })

      api.registerObjectUpdateListener('layer', () => {
        const layer = api.getValue('layer')
        if (layer === 1) {
          setShowOnboarding1(true)
        }
      })
    }

    return () => {
      api?.unregisterClientListener(onGGBClient)
    }
  }, [ggbLoaded, playMouseClick, playMouseIn, playMouseOut])

  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#F6F6F6',
        id: 'g07-gmc01-s1-gb01',
        onEvent,
        className,
      }}
    >
      <TextHeader
        text="Scaling a triangle to find corresponding parts."
        backgroundColor="E#F6F6F6"
        buttonColor="#1A1A1A"
      />
      <GeogebraContainer materialId="tbxyufuk" top={70} left={0} onApiReady={onGGBLoaded} />
      {showOnboarding1 && ggbLoaded && (
        <>
          <OnboardingAnimationContainer left={300} top={700} src={click} loop autoplay />
        </>
      )}
      {showOnboarding2 && (
        <OnboardingAnimationContainer left={160} top={570} src={moveHorizontal} loop autoplay />
      )}
    </AppletContainer>
  )
}

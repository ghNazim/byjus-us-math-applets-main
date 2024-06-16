import { Player } from '@lottiefiles/react-lottie-player'
import { FC, useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { AppletContainer } from '@/common/AppletContainer'
import { Geogebra } from '@/common/Geogebra'
import { ClientListener, GeogebraAppApi } from '@/common/Geogebra/Geogebra.types'
import { TextHeader } from '@/common/Header'
import { AppletInteractionCallback } from '@/contexts/analytics'
import { useSFX } from '@/hooks/useSFX'

import dragleftright from '../../common/handAnimations/moveHorizontally.json'
import slideranimation from '../../common/handAnimations/slider.json'
import tryNewSymb from './assets/tryNewSymb.svg'

const GeogebraContainer = styled(Geogebra)`
  position: absolute;
  left: 50%;
  translate: -50%;
  top: 0px;
  scale: 0.8;
  width: 900px;
  height: 860px;
`
const TryNewButton = styled.button`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: flex-end;
  padding: 9px 18px;

  position: absolute;
  width: 160px;
  height: 60px;
  left: 280px;
  top: 730px;
  border: none;
  cursor: pointer;
  transition: 0.2s;

  background: #1a1a1a;
  border-radius: 10px;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 22px;
  line-height: 42px;
  text-align: center;
  color: #ffffff;

  z-index: 1;
`
const TryNewSymbol = styled.img`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
  padding: 9px 10px;

  position: absolute;
  width: 45px;
  height: 45px;
  left: 290px;
  top: 737px;
  border: none;
  cursor: pointer;
  transition: 0.2s;
  z-index: 1;
`
const OnboardingAnimationContainer1 = styled(Player)<{ left: number; top: number }>`
  position: absolute;
  left: ${(a) => a.left}px;
  top: ${(a) => a.top}px;
  pointer-events: none;
`

const OnboardingAnimationContainer2 = styled(Player)<{ left: number; top: number }>`
  position: absolute;
  left: ${(a) => a.left}px;
  top: ${(a) => a.top}px;
  pointer-events: none;
`
export const AppletG06NSC08S1GB02: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const ggbApi = useRef<GeogebraAppApi | null>(null)
  const [ggbLoaded, setGgbLoaded] = useState(false)
  const playMouseIn = useSFX('mouseIn')
  const playMouseOut = useSFX('mouseOut')
  const playMouseCLick = useSFX('mouseClick')

  const [showOnboarding1, setShowOnboarding1] = useState(true)

  const [showOnboarding2, setShowOnboarding2] = useState(false)

  const [showTryButton, setShowTryButton] = useState(false)

  const onGGBLoaded = useCallback((api: any) => {
    ggbApi.current = api
    setGgbLoaded(api != null)
  }, [])

  useEffect(() => {
    const api = ggbApi.current
    if (api != null && ggbLoaded) {
      const onGgb1Client: ClientListener = (e) => {
        if (e.type === 'mouseDown' && (e.hits[0] === 'Dagger' || e.hits[0] === 'Pointer')) {
          playMouseIn()
          setShowOnboarding1(false)
          setShowOnboarding2(false)
        } else if (
          e.type === 'dragEnd' &&
          (e.target === 'Dagger' || e.target === 'Next1' || e.target === 'Pointer')
        ) {
          playMouseOut()
        } else if (e.type === 'mouseDown' && e.hits[0] === 'Dagger') {
          setShowOnboarding1(false)
        } else if (e.type === 'mouseDown' && e.hits[0] === 'Pointer') {
          setShowOnboarding2(false)
        } else if (e.type === 'mouseDown' && e.type === 'mouseDown' && e.hits[0] === 'Next1') {
          playMouseCLick()
        }
      }
      api.registerClientListener(onGgb1Client)

      let dragcomplete = 0
      const CheckOnboarding2Value = 0
      api.registerObjectUpdateListener('Answer', () => {
        dragcomplete = api.getValue('Answer')

        if (dragcomplete === 1) {
          setShowTryButton(true)
        } else {
          setShowTryButton(false)
        }
      })
      api.registerObjectUpdateListener('layer', () => {
        const layerValue = api.getValue('layer')
        if (layerValue === 2) {
          setShowOnboarding2(true)
        }
      })
      return () => {
        ggbApi.current?.unregisterClientListener(onGgb1Client)
        ggbApi.current?.unregisterObjectUpdateListener('pointValue')
        ggbApi.current?.unregisterObjectUpdateListener('layer')
      }
    }
  }, [ggbLoaded, playMouseCLick, playMouseIn, playMouseOut])

  const onTryNewClick = () => {
    playMouseCLick()

    let Q1Value = 0
    let Q2Value = 0
    let Q3Value = 0
    Q1Value = Number(ggbApi.current?.getValue('Nume'))
    Q2Value = Number(ggbApi.current?.getValue('Nume'))
    Q3Value = Number(ggbApi.current?.getValue('Nume'))

    if (ggbApi.current?.getValue('Nume') === 3) {
      ggbApi.current?.evalCommand('RunClickScript(TryNew)')
      playMouseCLick()
      setShowTryButton(false)
    } else if (ggbApi.current?.getValue('Nume') === 5) {
      ggbApi.current?.evalCommand('RunClickScript(TryNew2)')
      playMouseCLick()
      setShowTryButton(false)
    } else if (ggbApi.current?.getValue('Nume') === -1) {
      ggbApi.current?.evalCommand('RunClickScript(TryNew3)')
      playMouseCLick()
      setShowTryButton(false)
    }
  }
  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#F6F6F6',
        id: 'g06-nsc08-s1-gb02',
        onEvent,
        className,
      }}
    >
      <TextHeader
        text="Plot the rational number on the number line."
        backgroundColor="#F6F6F6"
        buttonColor="#1A1A1A"
        hideButton={true}
      />
      <GeogebraContainer materialId="ruqaekuf" onApiReady={onGGBLoaded} />
      {showTryButton && (
        <>
          <TryNewButton onClick={onTryNewClick}>Try New</TryNewButton>
          <TryNewSymbol src={tryNewSymb}></TryNewSymbol>
        </>
      )}
      {showOnboarding1 && (
        <OnboardingAnimationContainer1 left={-30} top={600} src={slideranimation} loop autoplay />
      )}

      {showOnboarding2 && (
        <OnboardingAnimationContainer2 left={155} top={380} src={dragleftright} loop autoplay />
      )}
    </AppletContainer>
  )
}

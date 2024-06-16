import { Player } from '@lottiefiles/react-lottie-player'
import { number, setIntersect } from 'mathjs'
import { FC, useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { AppletContainer } from '@/common/AppletContainer'
import { Geogebra } from '@/common/Geogebra'
import { ClientListener, GeogebraAppApi } from '@/common/Geogebra/Geogebra.types'
import { TextHeader } from '@/common/Header'
import { AppletInteractionCallback } from '@/contexts/analytics'
import { useSFX } from '@/hooks/useSFX'

import dragalldirections from '../../common/handAnimations/moveAllDirections.json'
import activetryenewSymb from './assets/activeTryeNew.svg'
import nonactivetryenewSymb from './assets/nonactivetryNewSymb.svg'
import patch1 from './assets/p1.jpg'
import patch2 from './assets/p2.jpg'
import patch3 from './assets/p3.jpg'
import ImageText from './assets/text.svg'

const GeogebraContainer = styled(Geogebra)<{ top: number; left: number }>`
  position: absolute;
  left: ${(props) => props.left}px;
  top: ${(props) => props.top}px;
`
const NonActiveTryNewSymbol = styled.img`
  position: absolute;
  left: 260px;
  top: 700px;
  cursor: pointer;
  transition: 0.2s;
  z-index: 1;
`
const ActiveTryNewSymbol = styled.img`
  position: absolute;
  left: 260px;
  top: 700px;
  cursor: pointer;
  transition: 0.2s;
  z-index: 2;
`
const TextImage = styled.img`
  position: absolute;
  left: 150px;
  top: 640px;
  cursor: pointer;
  transition: 0.2s;
  z-index: 2;
`
const OnboardingAnimationContainer = styled(Player)<{ left: number; top: number }>`
  position: absolute;
  left: ${(a) => a.left}px;
  top: ${(a) => a.top}px;
  pointer-events: none;
`
const PatchContainer = styled.img`
  position: absolute;
  width: 25px;
  height: 25px;
  left: 42px;
  top: 563px;
  z-index: 1;
`

export const AppletG07GMC04S1GB01: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const [index, setIndex] = useState(number)

  const [GGBLoaded1, setGGBLoaded1] = useState(false)
  const [GGBLoaded2, setGGBLoaded2] = useState(false)
  const [GGBLoaded3, setGGBLoaded3] = useState(false)

  const ggb1 = useRef<GeogebraAppApi | null>(null)
  const ggb2 = useRef<GeogebraAppApi | null>(null)
  const ggb3 = useRef<GeogebraAppApi | null>(null)

  const [showOnboarding1, setShowOnboarding1] = useState(true)
  const [showTryButton, setShowTryButton] = useState(false)

  const [ggb1Key, setGgb1Key] = useState(Date.now())
  const [ggb2Key, setGgb2Key] = useState(Date.now())
  const [ggb3Key, setGgb3Key] = useState(Date.now())

  const [ggb1patch, setShowggb1patch] = useState(true)
  const [ggb2patch, setShowggb2patch] = useState(false)
  const [ggb3patch, setShowggb3patch] = useState(false)

  const playMouseIn = useSFX('mouseIn')
  const playMouseOut = useSFX('mouseOut')
  const playMouseCLick = useSFX('mouseClick')

  const onGGB1Loaded = useCallback((api: GeogebraAppApi | null) => {
    ggb1.current = api
    setGGBLoaded1(api != null)
  }, [])

  useEffect(() => {
    const api = ggb1.current
    if (api != null && GGBLoaded1) {
      const onGgb1Client: ClientListener = (e) => {
        if (e.type === 'mouseDown' && e.hits[0] === 'lens') {
          setShowOnboarding1(false)
          playMouseIn()
        } else if (e.type === 'dragEnd' && e.target === 'lens') {
          playMouseOut()
        }
      }
      api.registerClientListener(onGgb1Client)

      let dragcomplete = false

      api.registerObjectUpdateListener('p', () => {
        dragcomplete = Boolean(api.getValue('p'))
        if (dragcomplete === true) {
          setShowTryButton(true)
        } else {
          setShowTryButton(false)
        }
      })
      return () => {
        ggb1.current?.unregisterClientListener(onGgb1Client)
        ggb1.current?.unregisterObjectUpdateListener('p')
      }
    }
  }, [GGBLoaded1, playMouseCLick, playMouseIn, playMouseOut])

  const onGGB2Loaded = useCallback((api: GeogebraAppApi | null) => {
    ggb2.current = api
    setGGBLoaded2(api != null)
  }, [])

  useEffect(() => {
    const api = ggb2.current
    if (api != null && GGBLoaded2) {
      const onGgb2Client: ClientListener = (e) => {
        if (e.type === 'mouseDown' && e.hits[0] === 'pic2') {
          setShowOnboarding1(false)
          playMouseIn()
        } else if (e.type === 'dragEnd' && e.target === 'pic2') {
          playMouseOut()
        }
      }
      api.registerClientListener(onGgb2Client)

      let dragcomplete = false

      api.registerObjectUpdateListener('tb', () => {
        dragcomplete = Boolean(api.getValue('tb'))
        if (dragcomplete === true) {
          setShowTryButton(true)
        } else {
          setShowTryButton(false)
        }
      })

      return () => {
        ggb2.current?.unregisterClientListener(onGgb2Client)
        ggb2.current?.unregisterObjectUpdateListener('tb')
      }
    }
  }, [GGBLoaded2, playMouseCLick, playMouseIn, playMouseOut])

  const onGGB3Loaded = useCallback((api: GeogebraAppApi | null) => {
    ggb3.current = api
    setGGBLoaded3(api != null)
  }, [])

  useEffect(() => {
    const api = ggb3.current
    if (api != null && GGBLoaded3) {
      const onGgb3Client: ClientListener = (e) => {
        if (e.type === 'mouseDown' && e.hits[0] === 'mg1') {
          setShowOnboarding1(false)
          playMouseIn()
        } else if (e.type === 'dragEnd' && e.target === 'mg1') {
          playMouseOut()
        }
      }
      api.registerClientListener(onGgb3Client)

      let dragcomplete = false

      api.registerObjectUpdateListener('master', () => {
        dragcomplete = Boolean(api.getValue('master'))
        if (dragcomplete === true) {
          setShowTryButton(true)
        } else {
          setShowTryButton(false)
        }
      })
      return () => {
        ggb3.current?.unregisterClientListener(onGgb3Client)
        ggb3.current?.unregisterObjectUpdateListener('master')
      }
    }
  }, [GGBLoaded3, playMouseCLick, playMouseIn, playMouseOut])

  const onTryNewClick = () => {
    playMouseCLick()
    const ggb1Boolean = Boolean(ggb1.current?.getValue('p'))
    const ggb2Boolean = Boolean(ggb2.current?.getValue('tb'))
    const ggb3Boolean = Boolean(ggb3.current?.getValue('master'))
    if (ggb1Boolean === true && index === 0) {
      setGGBLoaded1(false)
      setShowggb1patch(false)
      setShowggb2patch(true)
      setShowggb3patch(false)
      setGgb1Key(Date.now())
      setIndex(1)
      setShowTryButton(false)
    } else if (ggb2Boolean === true && index === 1) {
      setGGBLoaded2(false)
      setShowggb1patch(false)
      setShowggb2patch(false)
      setShowggb3patch(true)
      setGgb2Key(Date.now())
      setIndex(2)
      setShowTryButton(false)
    } else if (ggb3Boolean === true && index === 2) {
      setGGBLoaded3(false)
      setShowggb1patch(true)
      setShowggb2patch(false)
      setShowggb3patch(false)
      setGgb3Key(Date.now())
      setIndex(0)
      setShowTryButton(false)
    }
  }

  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#F6F6F6',
        id: 'g07-gmc04-s1-gb01',
        onEvent,
        className,
      }}
    >
      <TextHeader
        text="Explore angles in everyday life."
        backgroundColor="#F6F6F6"
        buttonColor="#1A1A1A"
        hideButton={true}
      />

      <div style={{ visibility: index === 0 ? 'visible' : 'hidden' }}>
        <GeogebraContainer
          key={ggb1Key}
          materialId="a9qz2pna"
          top={100}
          left={35}
          onApiReady={onGGB1Loaded}
        />
      </div>
      <div style={{ visibility: index === 1 ? 'visible' : 'hidden' }}>
        <GeogebraContainer
          key={ggb2Key}
          materialId="bvmjfqka"
          top={100}
          left={35}
          onApiReady={onGGB2Loaded}
        />
      </div>
      <div style={{ visibility: index === 2 ? 'visible' : 'hidden' }}>
        <GeogebraContainer
          key={ggb3Key}
          materialId="thhv6mux"
          top={100}
          left={35}
          onApiReady={onGGB3Loaded}
        />
      </div>

      {showTryButton && (
        <>
          <ActiveTryNewSymbol src={activetryenewSymb} onClick={onTryNewClick}></ActiveTryNewSymbol>
        </>
      )}
      {<NonActiveTryNewSymbol src={nonactivetryenewSymb}></NonActiveTryNewSymbol>}
      {showOnboarding1 && GGBLoaded1 && (
        <>
          <OnboardingAnimationContainer left={50} top={370} src={dragalldirections} loop autoplay />
        </>
      )}
      {GGBLoaded1 && ggb1patch && <PatchContainer src={patch1}></PatchContainer>}
      {GGBLoaded2 && ggb2patch && <PatchContainer src={patch2}></PatchContainer>}
      {GGBLoaded3 && ggb3patch && <PatchContainer src={patch3}></PatchContainer>}

      <TextImage src={ImageText}></TextImage>
    </AppletContainer>
  )
}

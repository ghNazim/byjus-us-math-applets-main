import { Player } from '@lottiefiles/react-lottie-player'
import { FC, useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { AppletContainer } from '@/common/AppletContainer'
import { Geogebra } from '@/common/Geogebra'
import { ClientListener, GeogebraAppApi } from '@/common/Geogebra/Geogebra.types'
import { TextHeader } from '@/common/Header'
import { AppletInteractionCallback } from '@/contexts/analytics'
import { useSFX } from '@/hooks/useSFX'

import ClickAnimation from '../../common/handAnimations/moveAllDirections.json'
import tryNewSymb from './assets/tryNewSymb.svg'
const GeogebraContainer = styled(Geogebra)<{ top: number; left: number }>`
  position: absolute;
  left: ${(props) => props.left}px;
  top: ${(props) => props.top}px;
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

const OnboardingAnimationContainer = styled(Player)<{ left: number; top: number }>`
  position: absolute;
  left: ${(a) => a.left}px;
  top: ${(a) => a.top}px;
  pointer-events: none;
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

export const AppletG06NSC09S1GB01: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const [index, setIndex] = useState(0)

  const [GGBLoaded1, setGGBLoaded1] = useState(false)
  const [GGBLoaded2, setGGBLoaded2] = useState(false)
  const [GGBLoaded3, setGGBLoaded3] = useState(false)
  const [GGBLoaded4, setGGBLoaded4] = useState(false)
  const [GGBLoaded5, setGGBLoaded5] = useState(false)
  const [GGBLoaded6, setGGBLoaded6] = useState(false)

  const ggb1 = useRef<GeogebraAppApi | null>(null)
  const ggb2 = useRef<GeogebraAppApi | null>(null)
  const ggb3 = useRef<GeogebraAppApi | null>(null)
  const ggb4 = useRef<GeogebraAppApi | null>(null)
  const ggb5 = useRef<GeogebraAppApi | null>(null)
  const ggb6 = useRef<GeogebraAppApi | null>(null)

  const playMouseIn = useSFX('mouseIn')
  const playMouseOut = useSFX('mouseOut')
  const playMouseCLick = useSFX('mouseClick')

  const [showOnboarding1, setShowOnboarding1] = useState(true)
  const [showTryButton, setShowTryButton] = useState(false)

  const onGGB1Loaded = useCallback((api: GeogebraAppApi | null) => {
    ggb1.current = api
    setGGBLoaded1(api != null)
  }, [])

  useEffect(() => {
    const api = ggb1.current
    if (api != null && GGBLoaded1) {
      const onGgb1Client: ClientListener = (e) => {
        if (
          e.type === 'mouseDown' &&
          (e.hits[0] === 'q' ||
            e.hits[0] === 'TT' ||
            e.hits[0] === 'NNN' ||
            e.hits[0] === 'RP' ||
            e.hits[0] === 'r' ||
            e.hits[0] === 's' ||
            e.hits[0] === 't')
        ) {
          setShowOnboarding1(false)
          playMouseIn()
        } else if (
          e.type === 'dragEnd' &&
          (e.target === 'q' ||
            e.target === 'TT' ||
            e.target === 'NNN' ||
            e.target === 'RP' ||
            e.target === 'r' ||
            e.target === 's' ||
            e.target === 't')
        ) {
          playMouseOut()
        } else if (e.type === 'mouseDown' && e.hits[0] === 'check') {
          playMouseCLick()
        }
      }
      api.registerClientListener(onGgb1Client)

      let dragcomplete = false

      api.registerObjectUpdateListener('green', () => {
        dragcomplete = Boolean(api.getValue('green'))
        if (dragcomplete === true) {
          setShowTryButton(true)
        } else {
          setShowTryButton(false)
        }
      })
      return () => {
        ggb1.current?.unregisterClientListener(onGgb1Client)
        ggb1.current?.unregisterObjectUpdateListener('green')
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
        if (
          e.type === 'mouseDown' &&
          (e.hits[0] === 'q' ||
            e.hits[0] === 'TT' ||
            e.hits[0] === 'NNN' ||
            e.hits[0] === 'RP' ||
            e.hits[0] === 'r' ||
            e.hits[0] === 's' ||
            e.hits[0] === 't')
        ) {
          setShowOnboarding1(false)
          playMouseIn()
        } else if (
          e.type === 'dragEnd' &&
          (e.target === 'q' ||
            e.target === 'TT' ||
            e.target === 'NNN' ||
            e.target === 'RP' ||
            e.target === 'r' ||
            e.target === 's' ||
            e.target === 't')
        ) {
          playMouseOut()
        } else if (e.type === 'mouseDown' && e.hits[0] === 'check') {
          playMouseCLick()
        }
      }
      api.registerClientListener(onGgb2Client)

      let dragcomplete = false

      api.registerObjectUpdateListener('green', () => {
        dragcomplete = Boolean(api.getValue('green'))
        if (dragcomplete === true) {
          setShowTryButton(true)
        } else {
          setShowTryButton(false)
        }
      })
      return () => {
        ggb2.current?.unregisterClientListener(onGgb2Client)
        ggb2.current?.unregisterObjectUpdateListener('green')
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
        if (
          e.type === 'mouseDown' &&
          (e.hits[0] === 'q' ||
            e.hits[0] === 'TT' ||
            e.hits[0] === 'NNN' ||
            e.hits[0] === 'RP' ||
            e.hits[0] === 'r' ||
            e.hits[0] === 's' ||
            e.hits[0] === 't')
        ) {
          setShowOnboarding1(false)
          playMouseIn()
        } else if (
          e.type === 'dragEnd' &&
          (e.target === 'q' ||
            e.target === 'TT' ||
            e.target === 'NNN' ||
            e.target === 'RP' ||
            e.target === 'r' ||
            e.target === 's' ||
            e.target === 't')
        ) {
          playMouseOut()
        } else if (e.type === 'mouseDown' && e.hits[0] === 'check') {
          playMouseCLick()
        }
      }
      api.registerClientListener(onGgb3Client)

      let dragcomplete = false

      api.registerObjectUpdateListener('green', () => {
        dragcomplete = Boolean(api.getValue('green'))
        if (dragcomplete === true) {
          setShowTryButton(true)
        } else {
          setShowTryButton(false)
        }
      })
      return () => {
        ggb3.current?.unregisterClientListener(onGgb3Client)
        ggb3.current?.unregisterObjectUpdateListener('green')
      }
    }
  }, [GGBLoaded3, playMouseCLick, playMouseIn, playMouseOut])

  const onGGB4Loaded = useCallback((api: GeogebraAppApi | null) => {
    ggb4.current = api
    setGGBLoaded4(api != null)
  }, [])

  useEffect(() => {
    const api = ggb4.current
    if (api != null && GGBLoaded4) {
      const onGgb4Client: ClientListener = (e) => {
        if (
          e.type === 'mouseDown' &&
          (e.hits[0] === 'q' ||
            e.hits[0] === 'TT' ||
            e.hits[0] === 'NNN' ||
            e.hits[0] === 'RP' ||
            e.hits[0] === 'r' ||
            e.hits[0] === 's' ||
            e.hits[0] === 't')
        ) {
          setShowOnboarding1(false)
          playMouseIn()
        } else if (
          e.type === 'dragEnd' &&
          (e.target === 'q' ||
            e.target === 'TT' ||
            e.target === 'NNN' ||
            e.target === 'RP' ||
            e.target === 'r' ||
            e.target === 's' ||
            e.target === 't')
        ) {
          playMouseOut()
        } else if (e.type === 'mouseDown' && e.hits[0] === 'check') {
          playMouseCLick()
        }
      }
      api.registerClientListener(onGgb4Client)

      let dragcomplete = false

      api.registerObjectUpdateListener('green', () => {
        dragcomplete = Boolean(api.getValue('green'))
        if (dragcomplete === true) {
          setShowTryButton(true)
        } else {
          setShowTryButton(false)
        }
      })
      return () => {
        ggb4.current?.unregisterClientListener(onGgb4Client)
        ggb4.current?.unregisterObjectUpdateListener('green')
      }
    }
  }, [GGBLoaded4, playMouseCLick, playMouseIn, playMouseOut])

  const onGGB5Loaded = useCallback((api: GeogebraAppApi | null) => {
    ggb5.current = api
    setGGBLoaded5(api != null)
  }, [])

  useEffect(() => {
    const api = ggb5.current
    if (api != null && GGBLoaded5) {
      const onGgb5Client: ClientListener = (e) => {
        if (
          e.type === 'mouseDown' &&
          (e.hits[0] === 'q' ||
            e.hits[0] === 'TT' ||
            e.hits[0] === 'NNN' ||
            e.hits[0] === 'RP' ||
            e.hits[0] === 'r' ||
            e.hits[0] === 's' ||
            e.hits[0] === 't')
        ) {
          setShowOnboarding1(false)
          playMouseIn()
        } else if (
          e.type === 'dragEnd' &&
          (e.target === 'q' ||
            e.target === 'TT' ||
            e.target === 'NNN' ||
            e.target === 'RP' ||
            e.target === 'r' ||
            e.target === 's' ||
            e.target === 't')
        ) {
          playMouseOut()
        } else if (e.type === 'mouseDown' && e.hits[0] === 'check') {
          playMouseCLick()
        }
      }
      api.registerClientListener(onGgb5Client)

      let dragcomplete = false

      api.registerObjectUpdateListener('green', () => {
        dragcomplete = Boolean(api.getValue('green'))
        if (dragcomplete === true) {
          setShowTryButton(true)
        } else {
          setShowTryButton(false)
        }
      })
      return () => {
        ggb5.current?.unregisterClientListener(onGgb5Client)
        ggb5.current?.unregisterObjectUpdateListener('green')
      }
    }
  }, [GGBLoaded5, playMouseCLick, playMouseIn, playMouseOut])

  const onGGB6Loaded = useCallback((api: GeogebraAppApi | null) => {
    ggb6.current = api
    setGGBLoaded6(api != null)
  }, [])

  useEffect(() => {
    const api = ggb6.current
    if (api != null && GGBLoaded6) {
      const onGgb6Client: ClientListener = (e) => {
        if (
          e.type === 'mouseDown' &&
          (e.hits[0] === 'q' ||
            e.hits[0] === 'TT' ||
            e.hits[0] === 'NNN' ||
            e.hits[0] === 'RP' ||
            e.hits[0] === 'r' ||
            e.hits[0] === 's' ||
            e.hits[0] === 't')
        ) {
          setShowOnboarding1(false)
          playMouseIn()
        } else if (
          e.type === 'dragEnd' &&
          (e.target === 'q' ||
            e.target === 'TT' ||
            e.target === 'NNN' ||
            e.target === 'RP' ||
            e.target === 'r' ||
            e.target === 's' ||
            e.target === 't')
        ) {
          playMouseOut()
        } else if (e.type === 'mouseDown' && e.hits[0] === 'check') {
          playMouseCLick()
        }
      }
      api.registerClientListener(onGgb6Client)

      let dragcomplete = false

      api.registerObjectUpdateListener('green', () => {
        dragcomplete = Boolean(api.getValue('green'))
        if (dragcomplete === true) {
          setShowTryButton(true)
        } else {
          setShowTryButton(false)
        }
      })
      return () => {
        ggb6.current?.unregisterClientListener(onGgb6Client)
        ggb6.current?.unregisterObjectUpdateListener('green')
      }
    }
  }, [GGBLoaded6, playMouseCLick, playMouseIn, playMouseOut])

  const onTryNewClick = () => {
    if (ggb1.current?.getXcoord('NNN') === 2 && ggb1.current?.getYcoord('NNN') === 4) {
      setIndex(1)
      playMouseCLick()
      ggb1.current?.evalCommand('RunClickScript(button1)')
      setShowTryButton(false)
    } else if (ggb2.current?.getXcoord('NNN') === -4 && ggb2.current?.getYcoord('NNN') === -2) {
      setIndex(2)
      playMouseCLick()
      ggb2.current?.evalCommand('RunClickScript(button1)')
      setShowTryButton(false)
    } else if (ggb3.current?.getXcoord('NNN') === -3 && ggb3.current?.getYcoord('NNN') === 5) {
      setIndex(3)
      playMouseCLick()
      ggb3.current?.evalCommand('RunClickScript(button1)')
      setShowTryButton(false)
    } else if (ggb4.current?.getXcoord('NNN') === 3 && ggb4.current?.getYcoord('NNN') === -2) {
      setIndex(4)
      playMouseCLick()
      ggb4.current?.evalCommand('RunClickScript(button1)')
      setShowTryButton(false)
    } else if (ggb5.current?.getXcoord('NNN') === 4 && ggb5.current?.getYcoord('NNN') === 0) {
      setIndex(5)
      playMouseCLick()
      ggb5.current?.evalCommand('RunClickScript(button1)')
      setShowTryButton(false)
    } else if (ggb6.current?.getXcoord('NNN') === 0 && ggb6.current?.getYcoord('NNN') === -2) {
      setIndex(0)
      playMouseCLick()
      ggb6.current?.evalCommand('RunClickScript(button1)')
      setShowTryButton(false)
    }
  }

  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#F6F6F6',
        id: 'g06-nsc09-s1-gb01',
        onEvent,
        className,
      }}
    >
      <TextHeader
        text="Plot the given point on the coordinate plane."
        backgroundColor="#F6F6F6"
        buttonColor="#1A1A1A"
        hideButton={true}
      />

      <div style={{ visibility: index === 0 ? 'visible' : 'hidden' }}>
        <GeogebraContainer materialId="gcxjpyjh" top={100} left={23} onApiReady={onGGB1Loaded} />
      </div>
      <div style={{ visibility: index === 1 ? 'visible' : 'hidden' }}>
        <GeogebraContainer materialId="gqsfegkx" top={100} left={23} onApiReady={onGGB2Loaded} />
      </div>
      <div style={{ visibility: index === 2 ? 'visible' : 'hidden' }}>
        <GeogebraContainer materialId="fuvz8vpb" top={100} left={23} onApiReady={onGGB3Loaded} />
      </div>
      <div style={{ visibility: index === 3 ? 'visible' : 'hidden' }}>
        <GeogebraContainer materialId="fsrs4uzk" top={100} left={23} onApiReady={onGGB4Loaded} />
      </div>
      <div style={{ visibility: index === 4 ? 'visible' : 'hidden' }}>
        <GeogebraContainer materialId="k2b3kpas" top={100} left={23} onApiReady={onGGB5Loaded} />
      </div>
      <div style={{ visibility: index === 5 ? 'visible' : 'hidden' }}>
        <GeogebraContainer materialId="ptrn6zyz" top={100} left={23} onApiReady={onGGB6Loaded} />
      </div>

      {showTryButton && (
        <>
          <TryNewButton onClick={onTryNewClick}>Try New</TryNewButton>
          <TryNewSymbol src={tryNewSymb}></TryNewSymbol>
        </>
      )}
      {showOnboarding1 && (
        <>
          <OnboardingAnimationContainer left={50} top={570} src={ClickAnimation} loop autoplay />
        </>
      )}
    </AppletContainer>
  )
}

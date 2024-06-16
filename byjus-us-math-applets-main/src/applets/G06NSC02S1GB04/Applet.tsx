import { Player } from '@lottiefiles/react-lottie-player'
import { FC, useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { AppletContainer } from '@/common/AppletContainer'
import { Geogebra } from '@/common/Geogebra'
import { ClientListener, GeogebraAppApi } from '@/common/Geogebra/Geogebra.types'
import { TextHeader } from '@/common/Header'
import { AppletInteractionCallback } from '@/contexts/analytics'
import { useSFX } from '@/hooks/useSFX'

import ClickAnimation from '../../common/handAnimations/clickAndDrag.json'
import patch from './assets/p1.jpg'
import tryNewSymb from './assets/tryNewSymb.svg'
const GeogebraContainer = styled(Geogebra)<{ top: number; left: number }>`
  position: absolute;
  left: ${(props) => props.left}px;
  top: ${(props) => props.top}px;
`
const OnboardingAnimationContainer = styled(Player)<{ left: number; top: number }>`
  position: absolute;
  left: ${(a) => a.left}px;
  top: ${(a) => a.top}px;
  pointer-events: none;
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
const PatchContainer = styled.img`
  position: absolute;
  width: 40px;
  height: 40px;
  left: 25px;
  top: 735px;
  z-index: 1;
`
export const AppletG06NSC02S1GB04: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const [index, setIndex] = useState(0)
  const [GGBLoaded1, setGGBLoaded1] = useState(false)
  const [GGBLoaded2, setGGBLoaded2] = useState(false)
  const [GGBLoaded3, setGGBLoaded3] = useState(false)
  const [GGBLoaded4, setGGBLoaded4] = useState(false)
  const ggb1 = useRef<GeogebraAppApi | null>(null)
  const ggb2 = useRef<GeogebraAppApi | null>(null)
  const ggb3 = useRef<GeogebraAppApi | null>(null)
  const ggb4 = useRef<GeogebraAppApi | null>(null)
  const [showTryButton, setShowTryButton] = useState(false)
  const playMouseIn = useSFX('mouseIn')
  const playMouseOut = useSFX('mouseOut')
  const playMouseCLick = useSFX('mouseClick')
  const [showOnboarding1, setShowOnboarding1] = useState(true)

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
          (e.hits[0] === 'E' ||
            e.hits[0] === 'G' ||
            e.hits[0] === 'Q' ||
            e.hits[0] === 'R' ||
            e.hits[0] === 'W')
        ) {
          playMouseIn()
          setShowOnboarding1(false)
        } else if (
          e.type === 'dragEnd' &&
          (e.target === 'E' ||
            e.target === 'G' ||
            e.target === 'Q' ||
            e.target === 'R' ||
            e.target === 'W')
        ) {
          playMouseOut()
        } else if (e.type === 'mouseDown' && e.hits[0] === 'E') {
          setShowOnboarding1(false)
        } else if (
          e.type === 'mouseDown' &&
          e.type === 'mouseDown' &&
          (e.hits[0] === 'divide1' || e.hits[0] === 'divide3' || e.hits[0] === 'divide2')
        ) {
          playMouseCLick()
        }
      }
      api.registerClientListener(onGgb1Client)

      let dragcomplete = false

      api.registerObjectUpdateListener('bool9', () => {
        dragcomplete = Boolean(api.getValue('bool9'))
        if (dragcomplete === true) {
          setShowTryButton(true)
        } else {
          setShowTryButton(false)
        }
      })
      return () => {
        ggb1.current?.unregisterClientListener(onGgb1Client)
        ggb1.current?.unregisterObjectUpdateListener('bool9')
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
          (e.hits[0] === 'E' ||
            e.hits[0] === 'G' ||
            e.hits[0] === 'Q' ||
            e.hits[0] === 'R' ||
            e.hits[0] === 'W')
        ) {
          playMouseIn()
        } else if (
          e.type === 'dragEnd' &&
          (e.target === 'E' ||
            e.target === 'G' ||
            e.target === 'Q' ||
            e.target === 'R' ||
            e.target === 'W')
        ) {
          playMouseOut()
        } else if (
          e.type === 'mouseDown' &&
          e.type === 'mouseDown' &&
          (e.hits[0] === 'divide1' || e.hits[0] === 'divide3' || e.hits[0] === 'divide2')
        ) {
          playMouseCLick()
        }
      }
      api.registerClientListener(onGgb2Client)

      let dragcomplete = false

      api.registerObjectUpdateListener('bool9', () => {
        dragcomplete = Boolean(api.getValue('bool9'))
        if (dragcomplete === true) {
          setShowTryButton(true)
        } else {
          setShowTryButton(false)
        }
      })
      return () => {
        ggb2.current?.unregisterClientListener(onGgb2Client)
        ggb2.current?.unregisterObjectUpdateListener('bool9')
      }
    }
  }, [GGBLoaded1, GGBLoaded2, playMouseCLick, playMouseIn, playMouseOut])

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
          (e.hits[0] === 'E' || e.hits[0] === 'G' || e.hits[0] === 'Q')
        ) {
          playMouseIn()
        } else if (
          e.type === 'dragEnd' &&
          (e.target === 'E' || e.target === 'G' || e.target === 'Q')
        ) {
          playMouseOut()
        } else if (
          e.type === 'mouseDown' &&
          e.type === 'mouseDown' &&
          (e.hits[0] === 'divide1' || e.hits[0] === 'divide3' || e.hits[0] === 'divide2')
        ) {
          playMouseCLick()
        }
      }
      api.registerClientListener(onGgb3Client)

      let dragcomplete = false

      api.registerObjectUpdateListener('Q4', () => {
        dragcomplete = Boolean(api.getValue('Q4'))
        if (dragcomplete === true) {
          setShowTryButton(true)
        } else {
          setShowTryButton(false)
        }
      })
      return () => {
        ggb3.current?.unregisterClientListener(onGgb3Client)
        ggb3.current?.unregisterObjectUpdateListener('Q4')
      }
    }
  }, [GGBLoaded1, GGBLoaded2, GGBLoaded3, playMouseCLick, playMouseIn, playMouseOut])

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
          (e.hits[0] === 'E' || e.hits[0] === 'G' || e.hits[0] === 'Q')
        ) {
          playMouseIn()
        } else if (
          e.type === 'dragEnd' &&
          (e.target === 'E' || e.target === 'G' || e.target === 'Q')
        ) {
          playMouseOut()
        } else if (
          e.type === 'mouseDown' &&
          e.type === 'mouseDown' &&
          (e.hits[0] === 'divide1' || e.hits[0] === 'divide3' || e.hits[0] === 'divide2')
        ) {
          playMouseCLick()
        }
      }
      api.registerClientListener(onGgb4Client)

      let dragcomplete = false

      api.registerObjectUpdateListener('Q7', () => {
        dragcomplete = Boolean(api.getValue('Q7'))
        if (dragcomplete === true) {
          setShowTryButton(true)
        } else {
          setShowTryButton(false)
        }
      })
      return () => {
        ggb4.current?.unregisterClientListener(onGgb4Client)
        ggb4.current?.unregisterObjectUpdateListener('Q7')
      }
    }
  }, [GGBLoaded1, GGBLoaded2, GGBLoaded3, GGBLoaded4, playMouseCLick, playMouseIn, playMouseOut])

  const onTryNewClick = () => {
    let Q4Bool = false
    let Q7Bool = false
    let Q7Bool1 = false

    Q4Bool = Boolean(ggb3.current?.getValue('Q4'))
    Q7Bool = Boolean(ggb4.current?.getValue('Q7'))
    Q7Bool1 = Boolean(ggb4.current?.getValue('QRtrue'))

    if (ggb1.current?.getValue('anime1') === 1.5) {
      setIndex(1)
      ggb1.current?.evalCommand('RunClickScript(button1)')
      playMouseCLick()
      setShowTryButton(false)
    } else if (ggb2.current?.getValue('anime1') === 1.5) {
      setIndex(2)
      ggb2.current?.evalCommand('RunClickScript(button1)')
      playMouseCLick()
      setShowTryButton(false)
    } else if (Q4Bool === true) {
      setIndex(3)
      ggb3.current?.evalCommand('RunClickScript(button1)')
      playMouseCLick()
      setShowTryButton(false)
    } else if (Q7Bool === true || Q7Bool1 === true) {
      setIndex(0)
      ggb4.current?.evalCommand('RunClickScript(button1)')
      playMouseCLick()
      setShowTryButton(false)
    }
  }
  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#F6F6F6',
        id: 'g06-nsc02-s1-gb04',
        onEvent,
        className,
      }}
    >
      <TextHeader
        text="Represent the decimal number on the number line."
        backgroundColor="#F6F6F6"
        buttonColor="#1A1A1A"
        hideButton={true}
      />
      <div style={{ visibility: index === 0 ? 'visible' : 'hidden' }}>
        <GeogebraContainer materialId="ujbzs79j" top={80} left={23} onApiReady={onGGB1Loaded} />
      </div>
      <div style={{ visibility: index === 1 ? 'visible' : 'hidden' }}>
        <GeogebraContainer materialId="wmp5bryw" top={80} left={23} onApiReady={onGGB2Loaded} />
      </div>
      <div style={{ visibility: index === 2 ? 'visible' : 'hidden' }}>
        <GeogebraContainer materialId="gkwvjpwu" top={80} left={23} onApiReady={onGGB3Loaded} />
      </div>
      <div style={{ visibility: index === 3 ? 'visible' : 'hidden' }}>
        <GeogebraContainer materialId="dnfvex3e" top={80} left={23} onApiReady={onGGB4Loaded} />
      </div>
      {showOnboarding1 && (
        <>
          <OnboardingAnimationContainer left={-120} top={500} src={ClickAnimation} loop autoplay />
        </>
      )}

      {showTryButton && (
        <>
          <TryNewButton onClick={onTryNewClick}>Try New</TryNewButton>
          <TryNewSymbol src={tryNewSymb}></TryNewSymbol>
        </>
      )}
      <PatchContainer src={patch}></PatchContainer>
    </AppletContainer>
  )
}

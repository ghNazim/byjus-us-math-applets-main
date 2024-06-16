import { Player } from '@lottiefiles/react-lottie-player'
import { FC, useCallback, useEffect, useRef, useState } from 'react'
import styled, { keyframes } from 'styled-components'

import { AppletContainer } from '@/common/AppletContainer'
import { Geogebra } from '@/common/Geogebra'
import { ClientListener, GeogebraAppApi } from '@/common/Geogebra/Geogebra.types'
import { TextHeader } from '@/common/Header'
import { AppletInteractionCallback } from '@/contexts/analytics'
import { useSFX } from '@/hooks/useSFX'

import ClickAnimation from '../../common/handAnimations/click.json'
import ClickandDragAnimation from '../../common/handAnimations/clickAndDrag.json'
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

  background: #8c69ff;
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
const CorrectLabel = styled.label`
  position: absolute;
  width: 526px;
  height: 28px;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;
  display: flex;
  align-items: center;
  text-align: center;
  color: #444444;
  flex: none;
  top: 555px;
  left: 100px;
  order: 0;
  flex-grow: 0;
`
const OnboardingAnimationContainer = styled(Player)<{ left: number; top: number }>`
  position: absolute;
  left: ${(a) => a.left}px;
  top: ${(a) => a.top}px;
  pointer-events: none;
`
export const AppletG06EEC07S1GB03: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const [index, setIndex] = useState(0)
  const [GGBLoaded1, setGGBLoaded1] = useState(false)
  const [GGBLoaded2, setGGBLoaded2] = useState(false)
  const [GGBLoaded3, setGGBLoaded3] = useState(false)
  const ggb1 = useRef<GeogebraAppApi | null>(null)
  const ggb2 = useRef<GeogebraAppApi | null>(null)
  const ggb3 = useRef<GeogebraAppApi | null>(null)
  const [showTryButton, setShowTryButton] = useState(false)
  const [showLabel, setShowLabel] = useState(false)
  const playMouseIn = useSFX('mouseIn')
  const playMouseOut = useSFX('mouseOut')
  const playMouseCLick = useSFX('mouseClick')
  const [showOnboarding1, setShowOnboarding1] = useState(true)
  const [showOnboarding2, setShowOnboarding2] = useState(false)
  const [showOnboarding3, setShowOnboarding3] = useState(false)
  const [showOnboarding4, setShowOnboarding4] = useState(false)

  const onGGB1Loaded = useCallback((api: GeogebraAppApi | null) => {
    ggb1.current = api
    setGGBLoaded1(api != null)
  }, [])

  useEffect(() => {
    const api = ggb1.current
    if (api != null && GGBLoaded1) {
      const onGgb1Client: ClientListener = (e) => {
        if (e.type === 'mouseDown' && e.hits[0] === 'C') {
          playMouseIn()
          setShowOnboarding3(false)
        } else if (e.type === 'dragEnd' && e.target === 'C') {
          playMouseOut()
        }
      }
      api.registerClientListener(onGgb1Client)

      api.registerObjectUpdateListener('q1', () => {
        const qValue1 = ggb1.current?.getValue('q1')
        if (qValue1 === 1) {
          setShowTryButton(true)
          setShowLabel(true)
        } else {
          setShowTryButton(false)
        }
      })

      let leftButtonValue = 0
      let rightButtonValue = 0
      let dragcomplete = false

      api.registerObjectUpdateListener('leftbutton', () => {
        leftButtonValue = api.getValue('leftbutton')
        if (leftButtonValue > 1 && rightButtonValue > 1) {
          setShowOnboarding3(true)
        } else {
          setShowOnboarding3(false)
        }
      })

      api.registerObjectUpdateListener('rightbutton', () => {
        rightButtonValue = api.getValue('rightbutton')
        if (leftButtonValue > 1 && rightButtonValue > 1) {
          setShowOnboarding3(true)
        } else {
          setShowOnboarding3(false)
        }
      })

      api.registerObjectUpdateListener('dragend', () => {
        dragcomplete = Boolean(api.getValue('dragend'))
        if (dragcomplete === true) {
          setShowOnboarding4(true)
        } else {
          setShowOnboarding4(false)
        }
      })

      api.registerObjectClickListener('buttonright', () => playMouseCLick())
      api.registerObjectClickListener('buttonleft', () => {
        playMouseCLick(), setShowOnboarding1(false), setShowOnboarding2(true)
      })
      api.registerObjectClickListener('overlayleftbutton1', () => {
        playMouseCLick(), setShowOnboarding2(false)
      })
      api.registerObjectClickListener('overlayleftbutton2', () => {
        playMouseCLick(), setShowOnboarding2(false)
      })
      api.registerObjectClickListener('overlayleftbutton3', () => {
        playMouseCLick(), setShowOnboarding2(false)
      })
      api.registerObjectClickListener('overlayleftbutton4', () => {
        playMouseCLick(), setShowOnboarding2(false)
      })
      api.registerObjectClickListener('rightoverlay1', () => playMouseCLick())
      api.registerObjectClickListener('rightoverlay2', () => playMouseCLick())
      api.registerObjectClickListener('rightoverlay3', () => playMouseCLick())
      api.registerObjectClickListener('rightoverlay4', () => playMouseCLick())
      api.registerObjectClickListener('pic19', () => {
        playMouseCLick(), setShowOnboarding4(false)
      })
      api.registerObjectClickListener('rangeselectorright', () => {
        playMouseCLick(), setShowOnboarding4(false)
      })
      api.registerObjectClickListener('inclusivityleft', () => {
        playMouseCLick(), setShowOnboarding4(false)
      })
      api.registerObjectClickListener('pic21', () => {
        playMouseCLick(), setShowOnboarding4(false)
      })
      api.registerObjectClickListener('check', () => playMouseCLick())

      return () => {
        ggb1.current?.unregisterClientListener(onGgb1Client)
        ggb1.current?.unregisterObjectUpdateListener('q1')
        ggb1.current?.unregisterObjectClickListener('buttonright')
        ggb1.current?.unregisterObjectClickListener('buttonleft')
        ggb1.current?.unregisterObjectClickListener('overlayleftbutton1')
        ggb1.current?.unregisterObjectClickListener('overlayleftbutton2')
        ggb1.current?.unregisterObjectClickListener('overlayleftbutton3')
        ggb1.current?.unregisterObjectClickListener('overlayleftbutton4')
        ggb1.current?.unregisterObjectClickListener('rightoverlay1')
        ggb1.current?.unregisterObjectClickListener('rightoverlay2')
        ggb1.current?.unregisterObjectClickListener('rightoverlay3')
        ggb1.current?.unregisterObjectClickListener('rightoverlay4')
        ggb1.current?.unregisterObjectClickListener('pic19')
        ggb1.current?.unregisterObjectClickListener('rangeselectorright')
        ggb1.current?.unregisterObjectClickListener('inclusivityleft')
        ggb1.current?.unregisterObjectClickListener('pic21')
        ggb1.current?.unregisterObjectClickListener('check')
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
        if (e.type === 'mouseDown' && e.hits[0] === 'C') {
          playMouseIn()
        } else if (e.type === 'dragEnd' && e.target === 'C') {
          playMouseOut()
        }
      }
      api.registerClientListener(onGgb2Client)

      ggb2.current?.registerObjectUpdateListener('q2', () => {
        const qValue2 = ggb2.current?.getValue('q2')
        if (qValue2 === 1) {
          setShowTryButton(true)
          setShowLabel(true)
        } else {
          setShowTryButton(false)
        }
      })

      api.registerObjectClickListener('buttonright', () => playMouseCLick())
      api.registerObjectClickListener('buttonleft', () => playMouseCLick())
      api.registerObjectClickListener('overlayleftbutton1', () => playMouseCLick())
      api.registerObjectClickListener('overlayleftbutton2', () => playMouseCLick())
      api.registerObjectClickListener('overlayleftbutton3', () => playMouseCLick())
      api.registerObjectClickListener('overlayleftbutton4', () => playMouseCLick())
      api.registerObjectClickListener('rightoverlay1', () => playMouseCLick())
      api.registerObjectClickListener('rightoverlay2', () => playMouseCLick())
      api.registerObjectClickListener('rightoverlay3', () => playMouseCLick())
      api.registerObjectClickListener('rightoverlay4', () => playMouseCLick())
      api.registerObjectClickListener('pic19', () => playMouseCLick())
      api.registerObjectClickListener('rangeselectorright', () => playMouseCLick())
      api.registerObjectClickListener('inclusivityleft', () => playMouseCLick())
      api.registerObjectClickListener('pic21', () => playMouseCLick())
      api.registerObjectClickListener('check', () => playMouseCLick())

      return () => {
        ggb2.current?.unregisterClientListener(onGgb2Client)
        ggb2.current?.unregisterObjectUpdateListener('q1')
        ggb2.current?.unregisterObjectClickListener('buttonright')
        ggb2.current?.unregisterObjectClickListener('buttonleft')
        ggb2.current?.unregisterObjectClickListener('overlayleftbutton1')
        ggb2.current?.unregisterObjectClickListener('overlayleftbutton2')
        ggb2.current?.unregisterObjectClickListener('overlayleftbutton3')
        ggb2.current?.unregisterObjectClickListener('overlayleftbutton4')
        ggb2.current?.unregisterObjectClickListener('rightoverlay1')
        ggb2.current?.unregisterObjectClickListener('rightoverlay2')
        ggb2.current?.unregisterObjectClickListener('rightoverlay3')
        ggb2.current?.unregisterObjectClickListener('rightoverlay4')
        ggb2.current?.unregisterObjectClickListener('pic19')
        ggb2.current?.unregisterObjectClickListener('rangeselectorright')
        ggb2.current?.unregisterObjectClickListener('inclusivityleft')
        ggb2.current?.unregisterObjectClickListener('pic21')
        ggb2.current?.unregisterObjectClickListener('check')
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
        if (e.type === 'mouseDown' && e.hits[0] === 'I') {
          playMouseIn()
        } else if (e.type === 'dragEnd' && e.target === 'I') {
          playMouseOut()
        }
      }
      api.registerClientListener(onGgb3Client)

      ggb3.current?.registerObjectUpdateListener('q3', () => {
        const qValue3 = ggb3.current?.getValue('q3')
        if (qValue3 === 1) {
          setShowTryButton(true)
          setShowLabel(true)
        } else {
          setShowTryButton(false)
        }
      })

      api.registerObjectClickListener('pic5', () => playMouseCLick())
      api.registerObjectClickListener('pic7', () => playMouseCLick())
      api.registerObjectClickListener('pic8', () => playMouseCLick())
      api.registerObjectClickListener('pic9', () => playMouseCLick())
      api.registerObjectClickListener('pic10', () => playMouseCLick())
      api.registerObjectClickListener('RD1', () => playMouseCLick())
      api.registerObjectClickListener('RD2', () => playMouseCLick())
      api.registerObjectClickListener('RD3', () => playMouseCLick())
      api.registerObjectClickListener('RD4', () => playMouseCLick())
      api.registerObjectClickListener('pic30', () => playMouseCLick())
      api.registerObjectClickListener('pic31', () => playMouseCLick())
      api.registerObjectClickListener('pic32', () => playMouseCLick())
      api.registerObjectClickListener('pic33', () => playMouseCLick())
      api.registerObjectClickListener('pic39', () => playMouseCLick())
      api.registerObjectClickListener('pic6', () => playMouseCLick())

      return () => {
        ggb3.current?.unregisterObjectUpdateListener('pic5')
        ggb3.current?.unregisterObjectClickListener('pic7')
        ggb3.current?.unregisterClientListener(onGgb3Client)
        ggb3.current?.unregisterObjectClickListener('pic8')
        ggb3.current?.unregisterObjectClickListener('pic9')
        ggb3.current?.unregisterObjectClickListener('pic10')
        ggb3.current?.unregisterObjectClickListener('RD1')
        ggb3.current?.unregisterObjectClickListener('RD2')
        ggb3.current?.unregisterObjectClickListener('RD3')
        ggb3.current?.unregisterObjectClickListener('RD4')
        ggb3.current?.unregisterObjectClickListener('pic30')
        ggb3.current?.unregisterObjectClickListener('pic31')
        ggb3.current?.unregisterObjectClickListener('pic32')
        ggb3.current?.unregisterObjectClickListener('pic33')
        ggb3.current?.unregisterObjectClickListener('pic39')
        ggb3.current?.unregisterObjectClickListener('pic6')
      }
    }
  }, [GGBLoaded3, playMouseCLick, playMouseIn, playMouseOut])

  const onTryNewClick = () => {
    if (ggb1.current?.getValue('q1') === 1) {
      setIndex(1)
      ggb1.current?.evalCommand('RunClickScript(button1)')
      setShowLabel(false)
      playMouseCLick()
      setShowTryButton(false)
    }

    if (ggb2.current?.getValue('q2') === 1) {
      setIndex(2)
      ggb2.current?.evalCommand('RunClickScript(pic52)')
      playMouseCLick()
      setShowLabel(false)
      setShowTryButton(false)
    }
    if (ggb3.current?.getValue('q3') === 1) {
      setIndex(0)
      ggb3.current?.evalCommand('RunClickScript(button1)')
      playMouseCLick()
      setShowLabel(false)
      setShowTryButton(false)
    }
  }
  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#FAF2FF',
        id: 'g06-eec07-s1-gb03',
        onEvent,
        className,
      }}
    >
      <TextHeader
        text="Express the statement as an inequality and plot it on the number line."
        backgroundColor="#FAF2FF"
        buttonColor="#EACCFF"
        hideButton={true}
      />
      <div style={{ visibility: index === 0 ? 'visible' : 'hidden' }}>
        <GeogebraContainer materialId="tcd8bbwb" top={100} left={20} onApiReady={onGGB1Loaded} />
      </div>
      <div style={{ visibility: index === 1 ? 'visible' : 'hidden' }}>
        <GeogebraContainer materialId="vcrxceyp" top={100} left={20} onApiReady={onGGB2Loaded} />
      </div>
      <div style={{ visibility: index === 2 ? 'visible' : 'hidden' }}>
        <GeogebraContainer materialId="tpcwnvkt" top={100} left={20} onApiReady={onGGB3Loaded} />
      </div>

      {showTryButton && (
        <>
          <TryNewButton onClick={onTryNewClick}>Try New</TryNewButton>
          <TryNewSymbol src={tryNewSymb}></TryNewSymbol>
        </>
      )}

      {showLabel && (
        <CorrectLabel>Great job! Let’s try it with a different word problem now.</CorrectLabel>
      )}
      {showOnboarding1 && (
        <>
          <OnboardingAnimationContainer left={280} top={210} src={ClickAnimation} loop autoplay />
        </>
      )}
      {showOnboarding2 && (
        <>
          <OnboardingAnimationContainer left={280} top={280} src={ClickAnimation} loop autoplay />
        </>
      )}
      {showOnboarding3 && (
        <>
          <OnboardingAnimationContainer
            left={-50}
            top={420}
            src={ClickandDragAnimation}
            loop
            autoplay
          />
        </>
      )}
      {showOnboarding4 && (
        <>
          <OnboardingAnimationContainer left={0} top={620} src={ClickAnimation} loop autoplay />
        </>
      )}
    </AppletContainer>
  )
}
function onInteraction(arg0: string) {
  throw new Error('Function not implemented.')
}

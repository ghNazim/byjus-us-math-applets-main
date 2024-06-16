import { Player } from '@lottiefiles/react-lottie-player'
import { FC, useCallback, useRef, useState } from 'react'
import styled from 'styled-components'

import { AppletContainer } from '@/common/AppletContainer'
import { Geogebra } from '@/common/Geogebra'
import { ClientListener, GeogebraAppApi } from '@/common/Geogebra/Geogebra.types'
import { TextHeader } from '@/common/Header'
import { AppletInteractionCallback } from '@/contexts/analytics'
import { useSFX } from '@/hooks/useSFX'

import ClickAnimation from '../../common/handAnimations/click.json'
import trynew from './assets/trynew.svg'

const CenteredGGBFirst = styled(Geogebra)`
  position: absolute;
  width: 720px;
  height: 711px;
  justify-content: center;
  left: 0px;
  top: 80px;
  z-index: 0;
  border: none;
  scale: 0.95;
  z-index: 0;
`

const CenteredGGBSecond = styled(Geogebra)`
  position: absolute;
  width: 720px;
  height: 713px;
  justify-content: center;
  left: 5px;
  top: 80px;
  z-index: 0;
  border: none;
  scale: 0.95;
  z-index: 0;
`

const TryNewButtonContainer = styled.img`
  position: absolute;
  left: 50%;
  translate: -50%;
  bottom: 20px;
  z-index: 1;
  -webkit-user-drag: none;
`

const OnboardingAnimationContainer = styled(Player)<{ left: number; top: number }>`
  position: absolute;
  left: ${(a) => a.left}px;
  top: ${(a) => a.top}px;
  pointer-events: none;
  z-index: 1;
`
export const AppletG06SPC02S1GB01: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const [ggbLoadedFirst, setGGBLoadedFirst] = useState(false)
  const [ggbLoadedSecond, setGGBLoadedSecond] = useState(false)
  const ggbApiFirst = useRef<GeogebraAppApi | null>(null)
  const ggbApiSecond = useRef<GeogebraAppApi | null>(null)
  const [index, setIndex] = useState(0)
  const playMouseClick = useSFX('mouseClick')
  const playMouseCorrect = useSFX('correct')
  const playMouseIncorrect = useSFX('incorrect')
  const [showTryNewButton, setShowTryNewButton] = useState(false)
  const [showOnboarding1, setShowOnboarding1] = useState(true)
  const [showOnboarding2, setShowOnboarding2] = useState(false)
  const [showOnboarding3, setShowOnboarding3] = useState(false)
  const [showOnboarding4, setShowOnboarding4] = useState(false)

  const onGGBLoadedFirst = useCallback(
    (api: GeogebraAppApi | null) => {
      ggbApiFirst.current = api
      setGGBLoadedFirst(true)

      ggbApiFirst.current?.registerObjectUpdateListener('c', () => {
        if (ggbApiFirst.current?.getValue('c') === 3) {
          setShowTryNewButton(true)
        }
      })

      type ElementMappings = {
        [key: string]: () => void
      }

      const elementMappings: ElementMappings = {
        Start: () => {
          playMouseClick()
          setShowOnboarding1(false)
          setShowOnboarding2(true)
        },
        pic21: () => {
          playMouseClick()
          setShowOnboarding2(false)
        },
        pic22: playMouseClick,
        pic23: playMouseClick,
        text13: playMouseCorrect,
        text14: playMouseIncorrect,
        text15: playMouseIncorrect,
        text16: playMouseIncorrect,
        text17: playMouseIncorrect,
        pic24: () => {
          playMouseClick()
          setShowOnboarding2(false)
        },
        text18: playMouseIncorrect,
        text19: playMouseIncorrect,
        text20: playMouseIncorrect,
        text21: playMouseIncorrect,
        text22: playMouseCorrect,
        Next: () => {
          playMouseClick()
          setShowOnboarding3(true)
        },
        Option1: () => {
          playMouseClick()
          setShowOnboarding3(false)
          setShowOnboarding4(true)
        },
        Option2: () => {
          playMouseClick()
          setShowOnboarding3(false)
          setShowOnboarding4(true)
        },
        Option3: () => {
          playMouseClick()
          setShowOnboarding3(false)
          setShowOnboarding4(true)
        },
        Option4: () => {
          playMouseClick()
          setShowOnboarding3(false)
          setShowOnboarding4(true)
        },
        Option5: () => {
          playMouseClick()
          setShowOnboarding3(false)
          setShowOnboarding4(true)
        },
        text30: playMouseClick,
        text31: playMouseClick,
        'text30_{1}': playMouseClick,
        'text31_{1}': playMouseClick,
        'text30_{2}': playMouseClick,
        'text31_{2}': playMouseClick,
        'text30_{3}': playMouseClick,
        'text31_{3}': playMouseClick,
        'text30_{4}': playMouseClick,
        'text31_{4}': playMouseClick,
        Check: () => {
          setShowOnboarding4(false)
          const value = ggbApiFirst.current?.getValue('p')
          if (value === 1) playMouseCorrect()
          else playMouseIncorrect()
        },
        'Check_{1}': () => {
          setShowOnboarding4(false)
          const value = ggbApiFirst.current?.getValue('q')
          if (value === 4) playMouseCorrect()
          else playMouseIncorrect()
        },
        'Check_{2}': () => {
          setShowOnboarding4(false)
          const value = ggbApiFirst.current?.getValue('r')
          if (value === 3) playMouseCorrect()
          else playMouseIncorrect()
        },
        'Check_{3}': () => {
          setShowOnboarding4(false)
          const value = ggbApiFirst.current?.getValue('s')
          if (value === 1) playMouseCorrect()
          else playMouseIncorrect()
        },
        'Check_{4}': () => {
          setShowOnboarding4(false)
          const value = ggbApiFirst.current?.getValue('t')
          if (value === 1) playMouseCorrect()
          else playMouseIncorrect()
        },
      }

      const playMouseSound = (elementId: string, correct: boolean) => {
        const soundFunction = elementMappings[elementId]
        if (soundFunction) {
          soundFunction() // Call the function
        }
      }

      if (api != null) {
        const onGGBClient: ClientListener = (e) => {
          if (e.type === 'mouseDown') {
            const elementId = e.hits[0]
            const isCorrect =
              (elementId === 'Check' && ggbApiFirst.current?.getValue('p') === 1) ||
              (elementId === 'Check_{1}' && ggbApiFirst.current?.getValue('q') === 4) ||
              (elementId === 'Check_{2}' && ggbApiFirst.current?.getValue('r') === 3) ||
              (elementId === 'Check_{3}' && ggbApiFirst.current?.getValue('s') === 1) ||
              (elementId === 'Check_{4}' && ggbApiFirst.current?.getValue('t') === 1)

            playMouseSound(elementId, isCorrect)
          }
        }

        api.registerClientListener(onGGBClient)
      }
    },
    [playMouseClick, playMouseCorrect, playMouseIncorrect],
  )
  const onGGBLoadedSecond = useCallback(
    (api: GeogebraAppApi | null) => {
      ggbApiSecond.current = api
      setGGBLoadedSecond(true)

      ggbApiSecond.current?.registerObjectUpdateListener('c', () => {
        if (ggbApiSecond.current?.getValue('c') === 3) {
          setShowTryNewButton(true)
        }
      })

      type ElementMappings = {
        [key: string]: () => void
      }

      const elementMappings: ElementMappings = {
        Start: playMouseClick,
        pic21: playMouseClick,
        pic22: playMouseClick,
        pic23: playMouseClick,
        text13: playMouseCorrect,
        text14: playMouseIncorrect,
        text15: playMouseIncorrect,
        text16: playMouseIncorrect,
        text17: playMouseIncorrect,
        pic24: playMouseClick,
        text18: playMouseIncorrect,
        text19: playMouseIncorrect,
        text20: playMouseIncorrect,
        text21: playMouseIncorrect,
        text22: playMouseCorrect,
        Next: playMouseClick,
        Option1: playMouseClick,
        Option2: playMouseClick,
        Option3: playMouseClick,
        Option4: playMouseClick,
        Option5: playMouseClick,
        text30: playMouseClick,
        text31: playMouseClick,
        text25: playMouseClick,
        text62: playMouseClick,

        'text17_{1}': playMouseIncorrect,
        'text17_{2}': playMouseIncorrect,
        'text21_{1}': playMouseIncorrect,
        'text21_{2}': playMouseIncorrect,
        'text30_{1}': playMouseClick,
        'text31_{1}': playMouseClick,
        'text30_{2}': playMouseClick,
        'text31_{2}': playMouseClick,
        'text30_{3}': playMouseClick,
        'text31_{3}': playMouseClick,
        'text30_{4}': playMouseClick,
        'text31_{4}': playMouseClick,
        'text30_{5}': playMouseClick,
        'text31_{5}': playMouseClick,
        'text30_{6}': playMouseClick,
        'text31_{6}': playMouseClick,
        Check: () => {
          const value = ggbApiSecond.current?.getValue('p')
          if (value === 1) playMouseCorrect()
          else playMouseIncorrect()
        },
        'Check_{1}': () => {
          const value = ggbApiSecond.current?.getValue('q')
          if (value === 0) playMouseCorrect()
          else playMouseIncorrect()
        },
        'Check_{2}': () => {
          const value = ggbApiSecond.current?.getValue('r')
          if (value === 2) playMouseCorrect()
          else playMouseIncorrect()
        },
        'Check_{3}': () => {
          const value = ggbApiSecond.current?.getValue('s')
          if (value === 1) playMouseCorrect()
          else playMouseIncorrect()
        },
        'Check_{4}': () => {
          const value = ggbApiSecond.current?.getValue('t')
          if (value === 2) playMouseCorrect()
          else playMouseIncorrect()
        },
        'Check_{5}': () => {
          const value = ggbApiSecond.current?.getValue('b')
          if (value === 3) playMouseCorrect()
          else playMouseIncorrect()
        },
        'Check_{6}': () => {
          const value = ggbApiSecond.current?.getValue('o')
          if (value === 1) playMouseCorrect()
          else playMouseIncorrect()
        },
      }

      const playMouseSound = (elementId: string, correct: boolean) => {
        const soundFunction = elementMappings[elementId]
        if (soundFunction) {
          soundFunction() // Call the function
        }
      }

      if (api != null) {
        const onGGBClient: ClientListener = (e) => {
          if (e.type === 'mouseDown') {
            const elementId = e.hits[0]
            const isCorrect =
              (elementId === 'Check' && ggbApiFirst.current?.getValue('p') === 1) ||
              (elementId === 'Check_{1}' && ggbApiSecond.current?.getValue('q') === 4) ||
              (elementId === 'Check_{2}' && ggbApiSecond.current?.getValue('r') === 3) ||
              (elementId === 'Check_{3}' && ggbApiSecond.current?.getValue('s') === 1) ||
              (elementId === 'Check_{4}' && ggbApiSecond.current?.getValue('t') === 2) ||
              (elementId === 'Check_{5}' && ggbApiSecond.current?.getValue('b') === 3) ||
              (elementId === 'Check_{6}' && ggbApiSecond.current?.getValue('o') === 1)

            playMouseSound(elementId, isCorrect)
          }
        }

        api.registerClientListener(onGGBClient)
      }
    },
    [playMouseClick, playMouseCorrect, playMouseIncorrect],
  )

  const onTryNewClick = () => {
    playMouseClick()
    setShowTryNewButton(false)
    if (ggbApiFirst.current?.getValue('c') === 3) {
      setIndex(1)
      ggbApiFirst.current.evalCommand('RunClickScript(button1)')
    }
    if (ggbApiSecond.current?.getValue('c') === 3) {
      setIndex(0)
      ggbApiSecond.current.evalCommand('RunClickScript(button1)')
      setShowOnboarding1(true)
    }
  }
  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#F6F6F6',
        id: 'g06-spc02-s1-gb01',
        onEvent,
        className,
      }}
    >
      <TextHeader text="Plotting a dot plot." backgroundColor="#F6F6F6" buttonColor="#1A1A1A" />
      {
        <div style={{ visibility: index === 0 ? 'visible' : 'hidden' }}>
          <CenteredGGBFirst
            materialId={'k59vxacy'}
            onApiReady={onGGBLoadedFirst}
            width={720}
            height={711}
          />
        </div>
      }
      {
        <div style={{ visibility: index === 1 ? 'visible' : 'hidden' }}>
          <CenteredGGBSecond
            materialId={'ngk3yngs'}
            onApiReady={onGGBLoadedSecond}
            width={720}
            height={713}
          />
        </div>
      }
      {showTryNewButton && ggbLoadedSecond && ggbLoadedFirst && (
        <TryNewButtonContainer src={trynew} onClick={onTryNewClick} />
      )}

      {showOnboarding1 && (
        <>
          <OnboardingAnimationContainer left={280} top={690} src={ClickAnimation} loop autoplay />
        </>
      )}
      {showOnboarding2 && (
        <>
          <OnboardingAnimationContainer left={50} top={420} src={ClickAnimation} loop autoplay />
        </>
      )}
      {showOnboarding3 && (
        <>
          <OnboardingAnimationContainer left={10} top={420} src={ClickAnimation} loop autoplay />
        </>
      )}
      {showOnboarding4 && (
        <>
          <OnboardingAnimationContainer left={280} top={690} src={ClickAnimation} loop autoplay />
        </>
      )}
    </AppletContainer>
  )
}

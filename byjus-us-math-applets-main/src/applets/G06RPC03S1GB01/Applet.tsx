import { Player } from '@lottiefiles/react-lottie-player'
import { number } from 'mathjs'
import { FC, useCallback, useRef, useState } from 'react'
import styled from 'styled-components'

import { AppletContainer } from '@/common/AppletContainer'
import { Geogebra } from '@/common/Geogebra'
import { ClientListener, GeogebraAppApi } from '@/common/Geogebra/Geogebra.types'
import { TextHeader } from '@/common/Header'
import { AppletInteractionCallback } from '@/contexts/analytics'
import { useSFX } from '@/hooks/useSFX'

import click from '../../common/handAnimations/click.json'
import nextbut from './assets/next.svg'
import retrybut from './assets/retry.svg'

const CenteredGGBFirst = styled(Geogebra)`
  position: absolute;
  width: 720px;
  height: 715px;
  justify-content: center;
  left: 0px;
  top: 70px;
  z-index: 0;
  border: none;
  scale: 0.9;
  z-index: 0;
`

const CenteredGGBSecond = styled(Geogebra)`
  position: absolute;
  width: 720px;
  height: 715px;
  justify-content: center;
  left: 0px;
  top: 70px;
  z-index: 0;
  border: none;
  scale: 0.9;
  z-index: 0;
`
const CenteredGGBThird = styled(Geogebra)`
  position: absolute;
  width: 971px;
  height: 955px;
  justify-content: center;
  left: -120px;
  top: -50px;
  z-index: 0;
  border: none;
  scale: 0.7;
  z-index: 0;
`
const CenteredGGBFourth = styled(Geogebra)`
  position: absolute;
  width: 1138px;
  height: 1139px;
  justify-content: center;
  left: -210px;
  top: -130px;
  z-index: 0;
  border: none;
  scale: 0.6;
  z-index: 0;
`

const OnboardingAnimationContainer = styled(Player)<{ left: number; top: number }>`
  position: absolute;
  left: ${(a) => a.left}px;
  top: ${(a) => a.top}px;
  pointer-events: none;
`
const TryNewButtonContainer = styled.img`
  position: absolute;
  left: 50%;
  translate: -50%;
  bottom: 20px;
  z-index: 2;
`

export const AppletG06RPC03S1GB01: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const [ggbLoadedFirst, setGGBLoadedFirst] = useState(false)
  const [ggbLoadedSecond, setGGBLoadedSecond] = useState(false)
  const [ggbLoadedThird, setGGBLoadedThird] = useState(false)
  const [ggbLoadedFourth, setGGBLoadedFourth] = useState(false)

  const ggbApiFirst = useRef<GeogebraAppApi | null>(null)
  const ggbApiSecond = useRef<GeogebraAppApi | null>(null)
  const ggbApiThird = useRef<GeogebraAppApi | null>(null)
  const ggbApiFourth = useRef<GeogebraAppApi | null>(null)

  const playMouseClick = useSFX('mouseClick')
  const playMouseCorrect = useSFX('correct')
  const playMouseIncorrect = useSFX('incorrect')

  const [showOnboarding1, setShowOnboarding1] = useState(true)
  const [showNextButton, setShowNextButton] = useState(false)
  const [showRetrybutton, setShowRetryButton] = useState(false)
  const [index, setIndex] = useState(0)

  const onGGBLoadedFirst = useCallback(
    (api: GeogebraAppApi | null) => {
      ggbApiFirst.current = api
      setGGBLoadedFirst(true)
      ggbApiFirst.current?.registerObjectUpdateListener('counter', () => {
        const counterValue = ggbApiFirst.current?.getValue('counter')

        if (counterValue === 10) {
          const isClaudTrue = Boolean(ggbApiFirst.current?.getValue('Claud'))
          const isJonaTrue = Boolean(ggbApiFirst.current?.getValue('Jona'))

          if (isClaudTrue) {
            setShowNextButton(true)
            playMouseCorrect()
          } else if (isJonaTrue) {
            setShowNextButton(true)
            playMouseIncorrect()
          }
        }
      })

      if (api != null) {
        const onGGBClient: ClientListener = (e) => {
          if (e.type === 'mouseDown' && e.hits[0] === 'Next') {
            playMouseClick()
            setShowOnboarding1(false)
          } else if (e.type === 'mouseDown' && e.hits[0] === 'Option2Default') {
            playMouseClick()
          } else if (e.type === 'mouseDown' && e.hits[0] === 'Option1Default') {
            playMouseClick()
          } else if (e.type === 'mouseDown' && e.hits[0] === 'VisualiseButtonEnabled') {
            playMouseClick()
          } else if (e.type === 'mouseDown' && e.hits[0] === 'pic12') {
            playMouseClick()
            setShowOnboarding1(false)
          } else if (e.type === 'mouseDown' && e.hits[0] === 'pic13') {
            playMouseClick()
            setShowOnboarding1(false)
          } else if (e.type === 'mouseDown' && e.hits[0] === 'pic2') {
            playMouseClick()
          }
          return () => {
            ggbApiFirst.current?.unregisterClientListener(onGGBClient)
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

      ggbApiSecond.current?.registerObjectUpdateListener('counter', () => {
        const counterValue = ggbApiSecond.current?.getValue('counter')

        if (counterValue === 10) {
          const isJayTrue = Boolean(ggbApiSecond.current?.getValue('Jay'))
          const isKayaTrue = Boolean(ggbApiSecond.current?.getValue('Kaya'))

          if (isJayTrue) {
            setShowNextButton(true)
            playMouseCorrect()
          } else if (isKayaTrue) {
            setShowNextButton(true)
            playMouseIncorrect()
          }
        }
      })

      if (api != null) {
        const onGGBClient: ClientListener = (e) => {
          if (e.type === 'mouseDown' && e.hits[0] === 'Next') {
            playMouseClick()
            setShowOnboarding1(false)
          } else if (e.type === 'mouseDown' && e.hits[0] === 'pic6') {
            playMouseClick()
          } else if (e.type === 'mouseDown' && e.hits[0] === 'pic7') {
            playMouseClick()
          } else if (e.type === 'mouseDown' && e.hits[0] === 'VisualiseButtonEnabled') {
            playMouseClick()
          }
          return () => {
            ggbApiSecond.current?.unregisterClientListener(onGGBClient)
          }
        }

        api.registerClientListener(onGGBClient)
      }
    },
    [playMouseClick, playMouseCorrect, playMouseIncorrect],
  )

  const onGGBLoadedThird = useCallback(
    (api: GeogebraAppApi | null) => {
      ggbApiThird.current = api
      setGGBLoadedSecond(true)

      ggbApiThird.current?.registerObjectUpdateListener('frame', () => {
        if (ggbApiThird.current?.getValue('frame') === 6) {
          setShowNextButton(true)
        }
      })
      // ggbApiThird.current?.registerObjectUpdateListener('a', () => {
      //   if (ggbApiThird.current?.getValue('a') === 7) {
      //     playMouseCorrect()
      //   } else {
      //     playMouseIncorrect()
      //   }
      // })

      if (api != null) {
        const onGGBClient: ClientListener = (e) => {
          if (e.type === 'mouseDown' && e.hits[0] === 'next') {
            playMouseClick()
            setShowOnboarding1(false)
          } else if (e.type === 'mouseDown' && e.hits[0] === 'check') {
            playMouseClick()
          } else if (e.type === 'mouseDown' && e.hits[0] === 'pic7') {
            playMouseClick()
          } else if (e.type === 'mouseDown' && e.hits[0] === 'VisualiseButtonEnabled') {
            playMouseClick()
          }
          return () => {
            ggbApiThird.current?.unregisterClientListener(onGGBClient)
          }
        }

        api.registerClientListener(onGGBClient)
      }
    },
    [playMouseClick],
  )
  const onGGBLoadedFourth = useCallback(
    (api: GeogebraAppApi | null) => {
      ggbApiFourth.current = api
      setGGBLoadedSecond(true)

      ggbApiFourth.current?.registerObjectUpdateListener('pp', () => {
        if (ggbApiFourth.current?.getValue('pp') === 1) {
          setShowRetryButton(true)
        }
      })
      ggbApiFourth.current?.registerObjectUpdateListener('wrongpic', () => {
        if (ggbApiFourth.current?.getVisible('wrongpic') === true) {
          playMouseIncorrect()
        } else {
          null
        }
      })
      ggbApiFourth.current?.registerObjectUpdateListener('rightpic', () => {
        if (ggbApiFourth.current?.getVisible('rightpic') === true) {
          playMouseCorrect()
        } else {
          null
        }
      })

      if (api != null) {
        const onGGBClient: ClientListener = (e) => {
          if (e.type === 'mouseDown' && e.hits[0] === 'Next') {
            playMouseClick()
            setShowOnboarding1(false)
          } else if (e.type === 'mouseDown' && e.hits[0] === 'pic6') {
            playMouseClick()
          } else if (e.type === 'mouseDown' && e.hits[0] === 'pic7') {
            playMouseClick()
          } else if (e.type === 'mouseDown' && e.hits[0] === 'VisualiseButtonEnabled') {
            playMouseClick()
          }
          return () => {
            ggbApiFourth.current?.unregisterClientListener(onGGBClient)
          }
        }

        api.registerClientListener(onGGBClient)
      }
    },
    [playMouseClick, playMouseCorrect, playMouseIncorrect],
  )
  const onTryNewClick = () => {
    playMouseClick()
    if (ggbApiFirst.current?.getValue('counter') === 10) {
      setIndex(1)
      setShowNextButton(false)
      ggbApiFirst.current?.setValue('screen', 1)
      ggbApiFirst.current?.setValue('moveslider', 0)
      ggbApiFirst.current?.setValue('delayslider', 0)
      ggbApiFirst.current?.setValue('counter', 0)
    }

    if (ggbApiSecond.current?.getValue('counter') === 10) {
      setIndex(2)
      setShowNextButton(false)
      ggbApiSecond.current?.setValue('screen', 1)
      ggbApiSecond.current?.setValue('moveslider', 0)
      ggbApiSecond.current?.setValue('delayslider', 0)
      ggbApiSecond.current?.setValue('counter', 0)
    }

    if (ggbApiThird.current?.getValue('frame') === 6) {
      setIndex(3)
      setShowNextButton(false)
      ggbApiThird.current?.evalCommand('RunClickScript(button1)')
    }
  }

  const onRetryClick = () => {
    playMouseClick()
    if (ggbApiFourth.current?.getValue('pp') === 1) {
      setIndex(0)
      setShowRetryButton(false)
      ggbApiFourth.current?.evalCommand('RunClickScript(retry)')
    }
  }
  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#F6F6F6',
        id: 'g06-rpc03-s1-gb01',
        onEvent,
        className,
      }}
    >
      <TextHeader text="Application of rates" backgroundColor="#F6F6F6" buttonColor="#1A1A1A" />
      {
        <div style={{ visibility: index === 0 ? 'visible' : 'hidden' }}>
          <CenteredGGBFirst
            materialId={'dmedkt2q'}
            onApiReady={onGGBLoadedFirst}
            width={720}
            height={715}
          />
        </div>
      }
      {
        <div style={{ visibility: index === 1 ? 'visible' : 'hidden' }}>
          <CenteredGGBSecond
            materialId={'sqrzvhkc'}
            onApiReady={onGGBLoadedSecond}
            width={720}
            height={715}
          />
        </div>
      }
      {
        <div style={{ visibility: index === 2 ? 'visible' : 'hidden' }}>
          <CenteredGGBThird
            materialId={'urukychk'}
            onApiReady={onGGBLoadedThird}
            width={971}
            height={955}
          />
        </div>
      }
      {
        <div style={{ visibility: index === 3 ? 'visible' : 'hidden' }}>
          <CenteredGGBFourth
            materialId={'had2dfyp'}
            onApiReady={onGGBLoadedFourth}
            width={1138}
            height={1119}
          />
        </div>
      }
      {showOnboarding1 && ggbApiFirst && (
        <OnboardingAnimationContainer left={280} top={670} src={click} loop autoplay />
      )}
      {showNextButton && (
        <TryNewButtonContainer src={nextbut} draggable={false} onClick={onTryNewClick} />
      )}
      {showRetrybutton && (
        <TryNewButtonContainer src={retrybut} draggable={false} onClick={onRetryClick} />
      )}
    </AppletContainer>
  )
}

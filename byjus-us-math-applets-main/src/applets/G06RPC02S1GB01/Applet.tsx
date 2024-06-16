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
import AppleImage from './assets/apple.svg'
import boxone from './assets/box1.svg'
import OrangeImage from './assets/orange.svg'
import resetimg from './assets/reset.svg'
import questionimage from './assets/static.svg'
import trynew from './assets/trynewbutton.svg'

const CenteredGGBFirst = styled(Geogebra)`
  position: absolute;
  width: 850px;
  height: 820px;
  justify-content: center;
  left: -60px;
  top: 30px;
  z-index: 0;
  border: none;
  scale: 0.85;
`

const CenteredGGBSecond = styled(Geogebra)`
  position: absolute;
  width: 850px;
  height: 820px;
  justify-content: center;
  left: -60px;
  top: 30px;
  z-index: 0;
  border: none;
  scale: 0.85;
`
const CenteredGGBThird = styled(Geogebra)`
  position: absolute;
  width: 850px;
  height: 820px;
  justify-content: center;
  left: -60px;
  top: 30px;
  z-index: 0;
  border: none;
  scale: 0.85;
`
const CenteredGGBFourth = styled(Geogebra)`
  position: absolute;
  width: 850px;
  height: 820px;
  justify-content: center;
  left: -60px;
  top: 30px;
  z-index: 0;
  border: none;
  scale: 0.85;
`
const TryNewButtonContainer = styled.img`
  position: absolute;
  left: 50%;
  translate: -50%;
  bottom: 20px;
  z-index: 2;
`

const Box1Location = styled.div`
  display: grid;
  justify-items: center;
  align-items: center;
  position: absolute;
  bottom: 390px;
  z-index: 2;
  left: 63%;
  translate: -63%;
`
const Box2Location = styled(Box1Location)`
  left: 76%;
  translate: -76%;
`
const Box3Location = styled(Box1Location)`
  left: 89%;
  translate: -89%;
`

const Box1LocationRight = styled.div`
  display: grid;
  justify-items: center;
  align-items: center;
  position: absolute;
  bottom: 400px;
  z-index: 2;
  left: 62%;
  translate: -62%;
`

const Box2LocationRight = styled(Box1LocationRight)`
  bottom: 400px;
  left: 71%;
  translate: -71%;
`
const Box3LocationRight = styled(Box1LocationRight)`
  bottom: 400px;
  left: 80%;
  translate: -80%;
`

const Img = styled.img`
  grid-row: 1;
  grid-column: 1;
`

const StaticImage = styled.img`
  position: absolute;
  left: 25%;
  translate: -25%;
  bottom: 400px;
  z-index: 2;
`
const OnboardingAnimationContainer = styled(Player)<{ left: number; top: number }>`
  position: absolute;
  left: ${(a) => a.left}px;
  top: ${(a) => a.top}px;
  pointer-events: none;
  z-index: 2;
`

export const AppletG06RPC02S1GB01: FC<{
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

  const [boxoff, setBoxOff] = useState(true)

  const [showTryNewButton, setShowTryNewButton] = useState(false)
  const [showRetryButton, setShowRetryButton] = useState(false)

  const [index, setIndex] = useState(0)
  const playMouseClick = useSFX('mouseClick')

  const playMouseCorrect = useSFX('correct')
  const playMouseIncorrect = useSFX('incorrect')

  const [showOnboarding1, setShowOnboarding1] = useState(true)

  const [boxList, setBoxList] = useState<Array<'apple' | 'orange'>>([])

  const onGGBLoadedFirst = useCallback(
    (api: GeogebraAppApi | null) => {
      ggbApiFirst.current = api
      setGGBLoadedFirst(true)

      ggbApiFirst.current?.registerObjectUpdateListener('layer', () => {
        if (ggbApiFirst.current?.getValue('layer') === 3) {
          setShowTryNewButton(true)
          playMouseCorrect()
        } else if (ggbApiFirst.current?.getValue('layer') === 2) {
          playMouseIncorrect()
        }
      })

      if (api != null) {
        const onGGBClient: ClientListener = (e) => {
          if (e.type === 'mouseDown' && e.hits[0] === 'plus') {
            playMouseClick()
            setShowOnboarding1(false)
          } else if (e.type === 'mouseDown' && e.hits[0] === 'minus') {
            playMouseClick()
            setShowOnboarding1(false)
          } else if (e.type === 'mouseDown' && e.hits[0] === 'StepperBase') {
            playMouseClick()
            setShowOnboarding1(false)
          } else if (e.type === 'mouseDown' && e.hits[0] === 'CTACheck') {
            playMouseClick()
          } else if (e.type === 'mouseDown' && e.hits[0] === 'CTATryAgain') {
            playMouseClick()
          }
          return () => {
            ggbApiSecond.current?.unregisterClientListener(onGGBClient)
          }
        }

        api.registerClientListener(onGGBClient)
      }
    },
    [playMouseCorrect, playMouseIncorrect, playMouseClick],
  )

  const onGGBLoadedSecond = useCallback(
    (api: GeogebraAppApi | null) => {
      ggbApiSecond.current = api
      setGGBLoadedSecond(true)

      ggbApiSecond.current?.registerObjectUpdateListener('layer', () => {
        if (ggbApiSecond.current?.getValue('layer') === 3) {
          setShowTryNewButton(true)
          playMouseCorrect()
        } else if (ggbApiSecond.current?.getValue('layer') === 2) {
          playMouseIncorrect()
        }
      })

      if (api != null) {
        const onGGBClient: ClientListener = (e) => {
          if (e.type === 'mouseDown' && e.hits[0] === 'plus') {
            playMouseClick()
          } else if (e.type === 'mouseDown' && e.hits[0] === 'minus') {
            playMouseClick()
          } else if (e.type === 'mouseDown' && e.hits[0] === 'StepperBase') {
            playMouseClick()
          } else if (e.type === 'mouseDown' && e.hits[0] === 'CTACheck') {
            playMouseClick()
          } else if (e.type === 'mouseDown' && e.hits[0] === 'CTATryAgain') {
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

  const onGGBLoadedThird = useCallback(
    (api: GeogebraAppApi | null) => {
      ggbApiThird.current = api
      setGGBLoadedThird(true)

      ggbApiThird.current?.registerObjectUpdateListener('layer', () => {
        if (ggbApiThird.current?.getValue('layer') === 3) {
          setShowTryNewButton(true)
          playMouseCorrect()
        } else if (ggbApiThird.current?.getValue('layer') === 2) {
          playMouseIncorrect()
        }
      })
      if (api != null) {
        const onGGBClient: ClientListener = (e) => {
          if (e.type === 'mouseDown' && e.hits[0] === 'plus') {
            playMouseClick()
          } else if (e.type === 'mouseDown' && e.hits[0] === 'minus') {
            playMouseClick()
          } else if (e.type === 'mouseDown' && e.hits[0] === 'StepperBase') {
            playMouseClick()
          } else if (e.type === 'mouseDown' && e.hits[0] === 'CTACheck') {
            playMouseClick()
          } else if (e.type === 'mouseDown' && e.hits[0] === 'CTATryAgain') {
            playMouseClick()
          }
          return () => {
            ggbApiThird.current?.unregisterClientListener(onGGBClient)
          }
        }

        api.registerClientListener(onGGBClient)
      }
    },
    [playMouseClick, playMouseCorrect, playMouseIncorrect],
  )

  const onGGBLoadedFourth = useCallback(
    (api: GeogebraAppApi | null) => {
      ggbApiFourth.current = api
      setGGBLoadedFourth(true)

      ggbApiFourth.current?.registerObjectUpdateListener('layer', () => {
        if (ggbApiFourth.current?.getValue('layer') === 3) {
          setShowRetryButton(true)
          playMouseCorrect()
          setBoxOff(false)
        } else if (ggbApiFourth.current?.getValue('layer') === 2) {
          playMouseIncorrect()
          setBoxOff(false)
        }
      })

      ggbApiFourth.current?.registerObjectUpdateListener('Orange', () => {
        const newOranges = ggbApiFourth.current?.getValue('Orange') ?? 0
        setBoxList((list) => {
          const currentOranges = list.reduce(
            (count, type) => (type === 'orange' ? count + 1 : count),
            0,
          )
          const isIncreased = newOranges > currentOranges
          if (isIncreased) return [...list, 'orange']
          // Else remove last orange
          const lastOrange = list.lastIndexOf('orange')
          list.splice(lastOrange, 1)
          return [...list]
        })
      })

      ggbApiFourth.current?.registerObjectUpdateListener('Apple', () => {
        const newApples = ggbApiFourth.current?.getValue('Apple') ?? 0
        setBoxList((list) => {
          const currentApples = list.reduce(
            (count, type) => (type === 'apple' ? count + 1 : count),
            0,
          )
          const isIncreased = newApples > currentApples
          if (isIncreased) return [...list, 'apple']
          // Else remove last apple
          const lastApple = list.lastIndexOf('apple')
          list.splice(lastApple, 1)
          return [...list]
        })
      })

      if (api != null) {
        const onGGBClient: ClientListener = (e) => {
          if (e.type === 'mouseDown' && e.hits[0] === 'PlusApple') {
            playMouseClick()
          } else if (e.type === 'mouseDown' && e.hits[0] === 'MinusApple') {
            playMouseClick()
          } else if (e.type === 'mouseDown' && e.hits[0] === 'PlusOrange') {
            playMouseClick()
          } else if (e.type === 'mouseDown' && e.hits[0] === 'MinusOrange') {
            playMouseClick()
          } else if (e.type === 'mouseDown' && e.hits[0] === 'StepperBase') {
            playMouseClick()
          } else if (e.type === 'mouseDown' && e.hits[0] === 'Check1') {
            playMouseClick()
          } else if (e.type === 'mouseDown' && e.hits[0] === 'TryAgain') {
            setBoxList([])
            playMouseClick()
            setBoxOff(true)
          } else if (e.type === 'mouseDown' && e.hits[0] === 'Steppers') {
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

    if (index === 0 && ggbApiFirst.current?.getValue('layer') === 3) {
      setIndex(1)

      setShowTryNewButton(false)
      ggbApiFirst.current?.evalCommand('RunClickScript(button1)')
    }
    if (index === 1 && ggbApiSecond.current?.getValue('layer') === 3) {
      setIndex(2)
      setShowTryNewButton(false)
      ggbApiSecond.current?.evalCommand('RunClickScript(button1)')
    }
    if (index === 2 && ggbApiThird.current?.getValue('layer') === 3) {
      setIndex(3)
      setShowTryNewButton(false)
      ggbApiThird.current?.evalCommand('RunClickScript(button1)')
    }
  }

  const onRetryClick = () => {
    playMouseClick()
    setIndex(0)

    if (ggbApiFourth.current?.getValue('layer') === 3) {
      setShowRetryButton(false)
      ggbApiFourth.current?.evalCommand('RunClickScript(Reset)')
      setBoxList([])
      setBoxOff(true)
    }
  }
  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#F6F6F6',
        id: 'g06-rpc02-s1-gb01',
        onEvent,
        className,
      }}
    >
      <TextHeader
        text="Model the equivalent ratio using the given items."
        backgroundColor="#F6F6F6"
        buttonColor="#1A1A1A"
      />
      <div style={{ visibility: index === 0 ? 'visible' : 'hidden' }}>
        <CenteredGGBFirst
          materialId={'zyzubfey'}
          onApiReady={onGGBLoadedFirst}
          width={850}
          height={820}
        />
      </div>
      <div style={{ visibility: index === 1 ? 'visible' : 'hidden' }}>
        <CenteredGGBSecond
          materialId={'nb7xfmrg'}
          onApiReady={onGGBLoadedSecond}
          width={850}
          height={820}
        />
      </div>
      <div style={{ visibility: index === 2 ? 'visible' : 'hidden' }}>
        <CenteredGGBThird
          materialId={'yxrwqqyk'}
          onApiReady={onGGBLoadedThird}
          width={850}
          height={820}
        />
      </div>
      <div style={{ visibility: index === 3 ? 'visible' : 'hidden' }}>
        <CenteredGGBFourth
          materialId={'sfcvsxcg'}
          onApiReady={onGGBLoadedFourth}
          width={850}
          height={820}
        />
      </div>
      {showTryNewButton && <TryNewButtonContainer src={trynew} onClick={onTryNewClick} />}
      {showRetryButton && <TryNewButtonContainer src={resetimg} onClick={onRetryClick} />}
      {index === 3 && boxoff && (
        <div>
          <Box1Location>
            {<Img src={boxone} />}
            {boxList[0] && <Img src={boxList[0] === 'apple' ? AppleImage : OrangeImage} />}
          </Box1Location>
          <Box2Location>
            {<Img src={boxone} />}
            {boxList[1] && <Img src={boxList[1] === 'apple' ? AppleImage : OrangeImage} />}
          </Box2Location>
          <Box3Location>
            {<Img src={boxone} />}
            {boxList[2] && <Img src={boxList[2] === 'apple' ? AppleImage : OrangeImage} />}
          </Box3Location>
        </div>
      )}

      {index === 3 &&
        (ggbApiFourth.current?.getValue('layer') === 3 ||
          ggbApiFourth.current?.getValue('layer') === 2) && (
          <div>
            <Box1LocationRight>
              {boxList[0] && <Img src={boxList[0] === 'apple' ? AppleImage : OrangeImage} />}
            </Box1LocationRight>
            <Box2LocationRight>
              {boxList[1] && <Img src={boxList[1] === 'apple' ? AppleImage : OrangeImage} />}
            </Box2LocationRight>
            <Box3LocationRight>
              {boxList[2] && <Img src={boxList[2] === 'apple' ? AppleImage : OrangeImage} />}
            </Box3LocationRight>
          </div>
        )}

      {index === 3 && <StaticImage src={questionimage} />}
      {showOnboarding1 && (
        <>
          <OnboardingAnimationContainer left={370} top={600} src={click} loop autoplay />
        </>
      )}
    </AppletContainer>
  )
}

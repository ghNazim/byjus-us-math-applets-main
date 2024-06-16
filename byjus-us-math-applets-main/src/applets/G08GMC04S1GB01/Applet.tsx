import { Player } from '@lottiefiles/react-lottie-player'
import { FC, useCallback, useRef, useState } from 'react'
import styled from 'styled-components'

import { AppletContainer } from '@/common/AppletContainer'
import { Geogebra } from '@/common/Geogebra'
import { ClientListener, GeogebraAppApi } from '@/common/Geogebra/Geogebra.types'
import { TextHeader } from '@/common/Header'
import { AppletInteractionCallback } from '@/contexts/analytics'
import { useSFX } from '@/hooks/useSFX'

import click from '../../common/handAnimations/click.json'
import trynew from './assets/trynewbutton.svg'
const CenteredGGBLeft = styled(Geogebra)`
  position: absolute;
  display: flex;
  justify-content: center;
  width: 698px;
  height: 708px;
  left: 5px;
  top: 100px;
  z-index: 0;
  margin-right: -1px;
  border: none;
  scale: 1;
`

const CenteredGGBRight1 = styled(Geogebra)`
  position: absolute;
  display: flex;
  justify-content: center;
  width: 698px;
  height: 708px;
  left: 5px;
  top: 100px;
  z-index: 0;
  margin-right: -1px;
  border: none;
  scale: 1;
`
const CenteredGGBRight2 = styled(Geogebra)`
  position: absolute;
  display: flex;
  justify-content: center;
  width: 698px;
  height: 708px;
  left: 5px;
  top: 100px;
  z-index: 0;
  margin-right: -1px;
  border: none;
  scale: 1;
`

const TryNewButtonContainer = styled.img`
  position: absolute;
  left: 50%;
  translate: -50%;
  bottom: 20px;
  z-index: 2;
`

const OnboardingAnimationContainer = styled(Player)<{ left: number; top: number }>`
  position: absolute;
  left: ${(a) => a.left}px;
  top: ${(a) => a.top}px;
  pointer-events: none;
`

export const AppletG08GMC04S1GB01: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const [ggbLoadedFirst, setGGBLoadedFirst] = useState(false)
  const [ggbLoadedSecond, setGGBLoadedSecond] = useState(false)
  const [ggbLoadedThird, setGGBLoadedThird] = useState(false)
  const ggbApiFirst = useRef<GeogebraAppApi | null>(null)
  const ggbApiSecond = useRef<GeogebraAppApi | null>(null)
  const ggbApiThird = useRef<GeogebraAppApi | null>(null)

  const [showRetryButton, setShowRetryButton] = useState(false)
  const [index, setIndex] = useState(0)
  const playMouseClick = useSFX('mouseClick')
  const playMouseIn = useSFX('mouseIn')
  const playMouseOut = useSFX('mouseOut')
  const [showOnboarding1, setShowOnboarding1] = useState(true)

  const onGGBLoadedLeft = useCallback(
    (api: GeogebraAppApi | null) => {
      ggbApiFirst.current = api
      setGGBLoadedFirst(api!==null)
      let dragOption1Complete = false

      ggbApiFirst.current?.registerObjectUpdateListener('green', () => {
        dragOption1Complete = Boolean(ggbApiFirst.current?.getValue('green'))

        if (dragOption1Complete === true) {
          setShowRetryButton(true)
        }
      })

      if (api != null) {
        const onGGBClient: ClientListener = (e) => {
          if (e.type === 'mouseDown' && e.hits[0] === 'Q') {
            playMouseIn()
          } else if (e.type === 'mouseDown' && e.hits[0] === 'pic10') {
            playMouseClick()
            setShowOnboarding1(false)
          } else if (e.type === 'mouseDown' && e.hits[0] === 'next') {
            playMouseClick()
          } else if (e.type === 'mouseDown' && e.hits[0] === 'pic11') {
            playMouseClick()
            setShowOnboarding1(false)
          } else if (e.type === 'mouseDown' && e.hits[0] === 'pic12') {
            playMouseClick()
            setShowOnboarding1(false)
          } else if (e.type === 'mouseDown' && e.hits[0] === 'pic13') {
            playMouseClick()
            setShowOnboarding1(false)
          } else if (e.type === 'mouseDown' && e.hits[0] === 'pic2') {
            playMouseClick()
          } else if (e.type === 'mouseDown' && e.hits[0] === 'R') {
            playMouseIn()
          } else if (e.type === 'mouseDown' && e.hits[0] === 'S') {
            playMouseIn()
          } else if (e.type === 'mouseDown' && e.hits[0] === 'pic5') {
            playMouseClick()
          } else if (e.type === 'dragEnd' && e.target[0] === 'Q') {
            playMouseOut()
          } else if (e.type === 'dragEnd' && e.target[0] === 'R') {
            playMouseOut()
          } else if (e.type === 'dragEnd' && e.target[0] === 'S') {
            playMouseOut()
          }
          return () => {
            ggbApiFirst.current?.unregisterClientListener(onGGBClient)
          }
        }

        api.registerClientListener(onGGBClient)
      }
    },
    [playMouseIn, playMouseClick, playMouseOut],
  )

  const onGGBLoadedRight1 = useCallback(
    (api: GeogebraAppApi | null) => {
      ggbApiSecond.current = api
      setGGBLoadedSecond(true)
      let dragOption2Complete = false

      ggbApiSecond.current?.registerObjectUpdateListener('green', () => {
        dragOption2Complete = Boolean(ggbApiSecond.current?.getValue('green'))

        if (dragOption2Complete === true) {
          setShowRetryButton(true)
        }
      })

      if (api != null) {
        const onGGBClient: ClientListener = (e) => {
          if (e.type === 'mouseDown' && e.hits[0] === 'Q') {
            playMouseIn()
          } else if (e.type === 'mouseDown' && e.hits[0] === 'pic10') {
            playMouseClick()
          } else if (e.type === 'mouseDown' && e.hits[0] === 'next') {
            playMouseClick()
          } else if (e.type === 'mouseDown' && e.hits[0] === 'pic11') {
            playMouseClick()
          } else if (e.type === 'mouseDown' && e.hits[0] === 'pic12') {
            playMouseClick()
          } else if (e.type === 'mouseDown' && e.hits[0] === 'pic13') {
            playMouseClick()
          } else if (e.type === 'mouseDown' && e.hits[0] === 'pic2') {
            playMouseClick()
          } else if (e.type === 'mouseDown' && e.hits[0] === 'R') {
            playMouseIn()
          } else if (e.type === 'mouseDown' && e.hits[0] === 'S') {
            playMouseIn()
          } else if (e.type === 'mouseDown' && e.hits[0] === 'pic5') {
            playMouseClick()
          } else if (e.type === 'dragEnd' && e.target[0] === 'Q') {
            playMouseOut()
          } else if (e.type === 'dragEnd' && e.target[0] === 'R') {
            playMouseOut()
          } else if (e.type === 'dragEnd' && e.target[0] === 'S') {
            playMouseOut()
          }
          return () => {
            ggbApiSecond.current?.unregisterClientListener(onGGBClient)
          }
        }

        api.registerClientListener(onGGBClient)
      }
    },
    [playMouseClick, playMouseIn, playMouseOut],
  )

  const onGGBLoadedRight2 = useCallback(
    (api: GeogebraAppApi | null) => {
      ggbApiThird.current = api
      setGGBLoadedThird(true)
      let dragOption3Complete = false

      ggbApiThird.current?.registerObjectUpdateListener('green', () => {
        dragOption3Complete = Boolean(ggbApiThird.current?.getValue('green'))

        if (dragOption3Complete === true) {
          setShowRetryButton(true)
        }
      })
      if (api != null) {
        const onGGBClient: ClientListener = (e) => {
          if (e.type === 'mouseDown' && e.hits[0] === 'Q') {
            playMouseIn()
          } else if (e.type === 'mouseDown' && e.hits[0] === 'pic10') {
            playMouseClick()
          } else if (e.type === 'mouseDown' && e.hits[0] === 'next') {
            playMouseClick()
          } else if (e.type === 'mouseDown' && e.hits[0] === 'pic11') {
            playMouseClick()
          } else if (e.type === 'mouseDown' && e.hits[0] === 'pic12') {
            playMouseClick()
          } else if (e.type === 'mouseDown' && e.hits[0] === 'pic13') {
            playMouseClick()
          } else if (e.type === 'mouseDown' && e.hits[0] === 'pic2') {
            playMouseClick()
          } else if (e.type === 'mouseDown' && e.hits[0] === 'R') {
            playMouseIn()
          } else if (e.type === 'mouseDown' && e.hits[0] === 'S') {
            playMouseIn()
          } else if (e.type === 'mouseDown' && e.hits[0] === 'pic5') {
            playMouseClick()
          } else if (e.type === 'dragEnd' && e.target[0] === 'Q') {
            playMouseOut()
          } else if (e.type === 'dragEnd' && e.target[0] === 'R') {
            playMouseOut()
          } else if (e.type === 'dragEnd' && e.target[0] === 'S') {
            playMouseOut()
          }
          return () => {
            ggbApiThird.current?.unregisterClientListener(onGGBClient)
          }
        }

        api.registerClientListener(onGGBClient)
      }
    },
    [playMouseClick, playMouseIn, playMouseOut],
  )
  const onTryNewClick = () => {
    playMouseClick()
    if (ggbApiFirst.current?.getValue('green') === 1) {
      setIndex(1)
      setShowRetryButton(false)
      ggbApiFirst.current?.evalCommand('RunClickScript(resetbutton)')
    }
    if (ggbApiSecond.current?.getValue('green') === 1) {
      setIndex(2)
      setShowRetryButton(false)
      ggbApiSecond.current?.evalCommand('RunClickScript(resetbutton)')
    }

    if (ggbApiThird.current?.getValue('green') === 1) {
      setIndex(0)
      setShowRetryButton(false)
      ggbApiThird.current?.evalCommand('RunClickScript(resetbutton)')
    }
  }

  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#F6F6F6',
        id: 'g08-gmc04-s1-gb01',
        onEvent,
        className,
      }}
    >
      <TextHeader
        text="Determine the combination of transformations required
to match the given figure to the image."
        backgroundColor="#F6F6F6"
        buttonColor="#1A1A1A"
      />
      <div style={{ visibility: index === 0 ? 'visible' : 'hidden' }}>
        <CenteredGGBLeft
          materialId={'eeydrfwa'}
          onApiReady={onGGBLoadedLeft}
          width={990}
          height={990}
        />
      </div>
      <div style={{ visibility: index === 1 ? 'visible' : 'hidden' }}>
        <CenteredGGBRight1
          materialId={'fyq8kbr4'}
          onApiReady={onGGBLoadedRight1}
          width={990}
          height={990}
        />
      </div>
      <div style={{ visibility: index === 2 ? 'visible' : 'hidden' }}>
        <CenteredGGBRight2
          materialId={'d4vpfjzg'}
          onApiReady={onGGBLoadedRight2}
          width={990}
          height={990}
        />
      </div>
      {showRetryButton && <TryNewButtonContainer draggable={false} src={trynew} onClick={onTryNewClick} />}

      {showOnboarding1 && ggbLoadedFirst && (
        <OnboardingAnimationContainer left={10} top={620} src={click} loop autoplay />
      )}
    </AppletContainer>
  )
}

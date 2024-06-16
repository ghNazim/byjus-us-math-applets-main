import { FC, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import styled from 'styled-components'

import { OnboardingAnimation } from '@/atoms/OnboardingAnimation'
import { OnboardingController } from '@/atoms/OnboardingController'
import { OnboardingStep } from '@/atoms/OnboardingStep'
import { AppletContainer } from '@/common/AppletContainer'
import { Geogebra } from '@/common/Geogebra'
import { locatePoint2d } from '@/common/Geogebra/Geogebra'
import { ClientListener, GeogebraAppApi } from '@/common/Geogebra/Geogebra.types'
import { TextHeader } from '@/common/Header'
import { AnalyticsContext, AppletInteractionCallback } from '@/contexts/analytics'
import { useSFX } from '@/hooks/useSFX'

import InputField, { InputRefProps } from './components/InputField'

const StyledGgb = styled(Geogebra)`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: flex-end;
  /* padding: 0 10px; */
  padding-bottom: 20px;
`

const Input = styled.div<{ left: number; top: number }>`
  position: absolute !important;
  top: ${(a) => a.top}px;
  left: ${(a) => a.left}px;
`

type PositionProps = {
  left: number
  top: number
}

const OnboardAnimation = styled(OnboardingAnimation)<{ left: number; top: number }>`
  position: absolute;
  left: ${(a) => a.left}px;
  top: ${(a) => a.top}px;
`

export const AppletG07NSC02S2GB02: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  // dev note:the ggb material id is different from the one in the Sheet, the creator
  // of the ggb was not available so i made a copy and did some changes myself
  const [ggbLoaded, setGgbLoaded] = useState(false)
  const ggbApi = useRef<GeogebraAppApi | null>(null)
  const [showInput, setShowInput] = useState(false)
  const [point1Pos, setPoint1Pos] = useState<PositionProps>({ left: 0, top: 0 })
  const [point2Pos, setPoint2Pos] = useState<PositionProps>({ left: 0, top: 0 })
  const [hideFirstOnBoarding, setHideFirstOnboarding] = useState(false)
  const playMouseClick = useSFX('mouseClick')
  const playMouseIn = useSFX('mouseIn')
  const playMouseOut = useSFX('mouseOut')
  const onInteraction = useContext(AnalyticsContext)
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<undefined | boolean>(undefined)
  const [inputVal, setInputVal] = useState(0)
  const inputRef = useRef<InputRefProps | null>(null)
  const onGgbReady = useCallback((api: GeogebraAppApi | null) => {
    if (api) {
      ggbApi.current = api
      setGgbLoaded(true)
      api.registerClientListener(clientListener)

      return () => {
        api.unregisterClientListener(clientListener)
      }
    }
  }, [])

  //objects for mouseclick sound
  const mouseClickSoundListeners = ['UnNext', 'Check', 'trynew']
  // objects for mouseIn sound
  const mouseInSoundListeners = ['ctrl', 'ctrl_{1}']

  const clientListener: ClientListener = (e) => {
    // console.log(e)

    if (e.type === 'mouseDown') {
      if (mouseInSoundListeners.includes(e.hits[0])) {
        if (!hideFirstOnBoarding) setHideFirstOnboarding(true)
        playMouseIn()
        onInteraction('drag')
      } else if (mouseClickSoundListeners.includes(e.hits[0])) {
        if (e.hits[0] === 'UnNext') {
          //on clicking next the react input should appear
          //setShowInput(true)
        }
        if (e.hits[0] === 'trynew') {
          //trynew in GGB
          setShowInput(false)
          setIsAnswerCorrect(undefined)
          if (inputRef.current) {
            //resetting input value
            inputRef.current.reset()
          }
        }

        playMouseClick()
        onInteraction('tap')
      }
    } else if (e.type === 'dragEnd') {
      playMouseOut()
      onInteraction('drop')
    }
  }

  useEffect(() => {
    if (ggbApi.current) {
      ggbApi.current.registerObjectUpdateListener('ctrl', () => {
        if (ggbApi.current) {
          const pos = locatePoint2d('G', ggbApi.current)
          setPoint1Pos({ left: pos.leftPixel, top: pos.topPixel })
        }
      })
      ggbApi.current.registerObjectUpdateListener('ctrl_{1}', () => {
        if (ggbApi.current) {
          const pos = locatePoint2d('G_{2}', ggbApi.current)
          setPoint2Pos({ left: pos.leftPixel, top: pos.topPixel })
        }
      })

      ggbApi.current.registerObjectUpdateListener('Awesome', () => {
        setIsAnswerCorrect(ggbApi.current?.getVisible('Awesome'))
      })

      return () => {
        ggbApi.current?.unregisterObjectUpdateListener('ctrl')
        ggbApi.current?.unregisterObjectUpdateListener('ctrl_{1}')
        ggbApi.current?.unregisterObjectUpdateListener('Awesome')
      }
    }
  }, [ggbLoaded])

  useEffect(() => {
    //updating input in GGB
    if (ggbApi.current) {
      ggbApi.current.setValue('input', inputVal)
    }
  }, [inputVal])

  useEffect(() => {
    // console.log(point1Pos, point2Pos)
  }, [point1Pos, point2Pos])

  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#f6f6f6',
        id: 'g07-nsc02-s2-gb02',
        onEvent,
        className,
      }}
    >
      <TextHeader
        text="Find the distance between the given integers
on the number line."
        backgroundColor="#f6f6f6"
        buttonColor="#1a1a1a"
      />
      <StyledGgb materialId="ubtgndtd" onApiReady={onGgbReady} />
      {ggbLoaded ? (
        <OnboardingController>
          {showInput ? (
            <Input left={(point1Pos.left + point2Pos.left) / 2 - 40} top={426}>
              <InputField
                onChange={(val) => {
                  setInputVal(val)
                }}
                state={isAnswerCorrect ? 'correct' : 'default'}
                ref={inputRef}
              />
            </Input>
          ) : null}
          <OnboardingStep index={0}>
            <OnboardAnimation
              complete={hideFirstOnBoarding}
              top={438}
              left={161}
              type="moveHorizontally"
            />
          </OnboardingStep>
        </OnboardingController>
      ) : null}
    </AppletContainer>
  )
}

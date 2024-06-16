import { Player } from '@lottiefiles/react-lottie-player'
import { FC, useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { AppletContainer } from '@/common/AppletContainer'
import { Geogebra } from '@/common/Geogebra'
import { ClientListener, GeogebraAppApi } from '@/common/Geogebra/Geogebra.types'
import { TextHeader } from '@/common/Header'
import { AppletInteractionCallback } from '@/contexts/analytics'
import { useSFX } from '@/hooks/useSFX'

import nextbutton from '../../applets/G08EEC10S1GB01/assets/Next.svg'
import option1text from '../../applets/G08EEC10S1GB01/assets/Option1.svg'
import patchimg from '../../applets/G08EEC10S1GB01/assets/patch.jpg'
import retrybutton from '../../applets/G08EEC10S1GB01/assets/Retry.svg'
import questionstatement from '../../applets/G08EEC10S1GB01/assets/Text1.svg'
import option2text from '../../applets/G08EEC10S1GB01/assets/Text2.svg'
import option3text from '../../applets/G08EEC10S1GB01/assets/Text3.svg'
import viewbutton from '../../applets/G08EEC10S1GB01/assets/View.svg'
import dragalldirection from '../../common/handAnimations/moveAllDirections.json'

const GeogebraContainer = styled(Geogebra)`
  width: 100%;
  height: 73%;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 2;
`
const OnboardingAnimationContainer = styled(Player)<{ left: number; top: number }>`
  position: absolute;
  left: ${(a) => a.left}px;
  top: ${(a) => a.top}px;
  pointer-events: none;
`
const ConstantText = styled.img`
  position: absolute;
  left: 200px;
  top: 650px;
  display: flex;
  align-items: center;
  text-align: center;
  z-index: 1;
`
const ViewSlopeButton = styled.div`
  position: absolute;
  cursor: pointer;
  top: 680px;
`
const NextButton = styled.div`
  position: absolute;
  cursor: pointer;
  top: 680px;
`
const Patchimage = styled.img`
  position: absolute;
  top: 680px;
  left: 250px;
  display: flex;
  align-items: center;
  z-index: 1;
`

const OptionText1 = styled.img`
  position: absolute;
  left: 155px;
  top: 600px;
  display: flex;
  align-items: center;
  text-align: center;
  z-index: 1;
`
const OptionText2 = styled.img`
  position: absolute;
  left: 155px;
  top: 600px;
  display: flex;
  align-items: center;
  text-align: center;
  z-index: 0;
`
export const AppletG08EEC10S1GB01: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const ggbApi = useRef<GeogebraAppApi | null>(null)
  const [ggbLoaded, setGgbLoaded] = useState(false)
  const playMouseIn = useSFX('mouseIn')
  const playMouseOut = useSFX('mouseOut')
  const playMouseCLick = useSFX('mouseClick')
  const [showText1, setShowText1] = useState(true)
  const [showOnboarding1, setShowOnboarding1] = useState(true)
  const [showOnboarding2, setShowOnboarding2] = useState(false)
  const [showOnboarding3, setShowOnboarding3] = useState(false)
  const [showViewButton, setShowViewButton] = useState(false)
  const [showOptionText1, setshowOptionText1] = useState(false)
  const [showOptionText2, setshowOptionText2] = useState(false)
  const [showOptionText3, setshowOptionText3] = useState(false)
  const [showNextButton, setShowNextButton] = useState(false)
  const [showRetryButton, setShowRetryButton] = useState(false)
  const [showPatch, setShowPatch] = useState(true)

  const onGGBLoaded = useCallback((api: any) => {
    ggbApi.current = api
    setGgbLoaded(api != null)
  }, [])

  const onViewClick = () => {
    const optionsValue = ggbApi.current?.getValue('Options')
    playMouseCLick()
    if (optionsValue == 1) {
      setshowOptionText1(false)
      ggbApi.current?.setValue('View', 2)
      setShowOnboarding3(true)
    } else if (optionsValue == 2) {
      ggbApi.current?.setValue('View1', 1)
      setshowOptionText2(false)
      setShowNextButton(true)
    } else if (optionsValue == 3) {
      ggbApi.current?.setValue('View2', 1)
      setshowOptionText3(false)
    }
    setShowViewButton(false)
  }

  const onNextClick = () => {
    playMouseCLick()
    ggbApi.current?.setValue('View', 2)
    if (ggbApi.current?.getValue('Options') === 1) {
      ggbApi.current?.setValue('Options', 2)
      setShowNextButton(false)
      setShowText1(true)
    } else if (ggbApi.current?.getValue('Options') === 2) {
      ggbApi.current?.setValue('Options', 3)
      setShowNextButton(false)
      setshowOptionText2(false)
      setShowText1(true)
    }
  }
  const onRetryClick = () => {
    playMouseCLick()
    ggbApi.current?.evalCommand('RunClickScript(button2)')
    setShowRetryButton(false)
  }

  useEffect(() => {
    const api = ggbApi.current
    let dragOption1Complete = false
    let dragOption2Complete = 0
    let dragOption3Complete = 0
    let dragOption4Complete = false
    let qValue = 1

    if (api != null && ggbLoaded) {
      const onGGBClient: ClientListener = (e) => {
        if (e.type === 'mouseDown') {
          if (e.hits[0] === 'B') {
            playMouseIn()
            setShowOnboarding1(false)
            setShowOnboarding2(true)
          } else if (e.hits[0] === 'C') {
            playMouseIn()
            setShowOnboarding2(false)
            setShowOnboarding1(false)
          } else if (e.hits[0] === 'J') {
            playMouseIn()
            setShowOnboarding3(false)
          } else if (e.hits[0] === 's') {
            playMouseIn()
          } else if (e.hits[0] === "s'") {
            playMouseIn()
          } else if (e.hits[0] === 'k_1') {
            playMouseIn()
          } else if (e.hits[0] === 'h_1') {
            playMouseIn()
          } else if (e.hits[0] === 'N') {
            playMouseIn()
            setShowRetryButton(true)
          }
        } else if (
          e.type === 'dragEnd' &&
          (e.target === 'C' ||
            e.target === 'B' ||
            e.target === 'J' ||
            e.target === 's' ||
            e.target === "s'" ||
            e.target === 'k_1' ||
            e.target === 'h_1' ||
            e.target === 'N')
        ) {
          playMouseOut()
        }
      }

      api.registerClientListener(onGGBClient)

      ggbApi.current?.registerObjectUpdateListener('Options', () => {
        qValue = ggbApi.current?.getValue('Options') ?? 1

        // if (showNextButton) {
        //   if (qValue === 1) {
        //     setshowOptionText1(false)
        //   } else if (qValue === 2) {
        //     setshowOptionText2(false)
        //   }
        // }
      })
      ggbApi.current?.registerObjectUpdateListener('a', () => {
        dragOption1Complete = Boolean(api.getValue('a'))

        if (qValue !== 1) return
        if (dragOption1Complete === true) {
          setShowText1(false)
          setshowOptionText1(true)
          setShowPatch(false)
          setShowViewButton(true)
        } else {
          setShowViewButton(false)
          setshowOptionText1(false)
          setShowText1(true)
          setShowPatch(true)
        }
      })

      ggbApi.current?.registerObjectUpdateListener('b', () => {
        dragOption4Complete = Boolean(api.getValue('b'))

        if (qValue !== 2) return
        if (dragOption4Complete === true) {
          setShowText1(false)
          setshowOptionText2(true)
          setShowPatch(false)
          setShowViewButton(true)
        } else {
          setShowViewButton(false)
          setshowOptionText2(false)
          setShowText1(true)
          setShowPatch(true)
        }
      })
      ggbApi.current?.registerObjectUpdateListener('o', () => {
        dragOption4Complete = Boolean(api.getValue('o'))

        if (qValue !== 3) return
        if (dragOption4Complete === true) {
          setShowText1(false)
          setshowOptionText3(true)
          setShowPatch(false)
          setShowViewButton(true)
        } else {
          setShowViewButton(false)
          setshowOptionText3(false)
          setShowText1(true)
          setShowPatch(true)
        }
      })

      ggbApi.current?.registerObjectUpdateListener('J', () => {
        dragOption2Complete = api.getXcoord('J')
        dragOption3Complete = api.getYcoord('J')
        if (qValue !== 1) return
        if (dragOption2Complete > -4 && dragOption3Complete === 0) {
          setShowNextButton(true)
        } else {
          setShowNextButton(false)
        }
      })

      return () => {
        ggbApi.current?.unregisterClientListener(onGGBClient)
      }
    }
  }, [ggbLoaded, playMouseCLick, playMouseIn, playMouseOut])

  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#F6F6F6',
        id: 'g08-eec10-s1-gb01',
        onEvent,
        className,
      }}
    >
      <TextHeader
        text="Explore different line types and their slope and intercept characteristics."
        backgroundColor="#F6F6F6"
        buttonColor="#1A1A1A"
      />

      <GeogebraContainer materialId="jdhdm7jd" onApiReady={onGGBLoaded} />
      {showViewButton && (
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <ViewSlopeButton onClick={onViewClick}>
            <img src={viewbutton} />
          </ViewSlopeButton>
        </div>
      )}

      {showNextButton && (
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <NextButton onClick={onNextClick}>
            <img src={nextbutton} />
          </NextButton>
        </div>
      )}
      {showRetryButton && (
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <NextButton onClick={onRetryClick}>
            <img src={retrybutton} />
          </NextButton>
        </div>
      )}
      {showOnboarding1 && (
        <OnboardingAnimationContainer left={-90} top={60} src={dragalldirection} loop autoplay />
      )}
      {showOnboarding2 && (
        <OnboardingAnimationContainer left={290} top={330} src={dragalldirection} loop autoplay />
      )}
      {showOnboarding3 && (
        <OnboardingAnimationContainer left={-90} top={160} src={dragalldirection} loop autoplay />
      )}
      {showText1 && <ConstantText src={questionstatement} />}
      {showOptionText1 && <OptionText1 src={option1text} />}
      {showOptionText2 && <OptionText2 src={option2text} />}
      {showOptionText3 && <OptionText1 src={option3text} />}
      {showPatch && <Patchimage src={patchimg} />}
    </AppletContainer>
  )
}

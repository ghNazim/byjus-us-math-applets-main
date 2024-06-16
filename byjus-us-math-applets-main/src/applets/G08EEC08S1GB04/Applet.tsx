import { Player } from '@lottiefiles/react-lottie-player'
import { animated, useSpring } from '@react-spring/web'
import { FC, useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { AppletContainer } from '@/common/AppletContainer'
import { Geogebra } from '@/common/Geogebra'
import { ClientListener, GeogebraAppApi } from '@/common/Geogebra/Geogebra.types'
import { TextHeader } from '@/common/Header'
import { AppletInteractionCallback } from '@/contexts/analytics'
import { useSFX } from '@/hooks/useSFX'

import nextbutton from '../../applets/G08EEC08S1GB04/assets/Next.svg'
import option1text from '../../applets/G08EEC08S1GB04/assets/option1.svg'
import option2text from '../../applets/G08EEC08S1GB04/assets/option2.svg'
import option3text from '../../applets/G08EEC08S1GB04/assets/option3.svg'
import option4text from '../../applets/G08EEC08S1GB04/assets/option4.svg'
import option5text from '../../applets/G08EEC08S1GB04/assets/option5.svg'
import option6text from '../../applets/G08EEC08S1GB04/assets/option6.svg'
import resetbutton from '../../applets/G08EEC08S1GB04/assets/Retry.svg'
import initialstatement1 from '../../applets/G08EEC08S1GB04/assets/Text1.svg'
import initialstatement2 from '../../applets/G08EEC08S1GB04/assets/Text2.svg'
import initialstatement3 from '../../applets/G08EEC08S1GB04/assets/Text3.svg'
import initialstatement4 from '../../applets/G08EEC08S1GB04/assets/Text4.svg'
import initialstatement5 from '../../applets/G08EEC08S1GB04/assets/Text5.svg'
import initialstatement6 from '../../applets/G08EEC08S1GB04/assets/Text6.svg'
import viewSlopeButton from '../../applets/G08EEC08S1GB04/assets/viewslope.svg'
import dragalldirection from '../../common/handAnimations/moveAllDirections.json'

const GeogebraContainer = styled(Geogebra)`
  width: 100%;
  height: 700px;
  /* background-color: red; */
  display: flex;
  align-items: center;
  justify-content: center;
  /* scale: 1.3; */
`
const OnboardingAnimationContainer = styled(Player)<{ left: number; top: number }>`
  position: absolute;
  left: ${(a) => a.left}px;
  top: ${(a) => a.top}px;
  pointer-events: none;
`
const ViewSlopeButton = styled.div`
  position: absolute;
  cursor: pointer;
`
const NextButton = styled.div`
  position: absolute;
  cursor: pointer;
`

const ResetButton = styled.div`
  position: absolute;
  cursor: pointer;
`
const ConstantText = styled.img`
  position: absolute;
  left: 100px;
  top: 650px;
  display: flex;
  align-items: center;
  text-align: center;
  z-index: 1;
`

const ConstantText3 = styled.img`
  position: absolute;
  left: 120px;
  top: 650px;
  display: flex;
  align-items: center;
  text-align: center;
  z-index: 1;
`
const ConstantText4 = styled.img`
  position: absolute;
  left: 80px;
  top: 650px;
  display: flex;
  align-items: center;
  text-align: center;
  z-index: 1;
`
const OptionText1 = styled.img`
  position: absolute;
  left: 55px;
  top: 600px;
  display: flex;
  align-items: center;
  text-align: center;
  z-index: 1;
`
const OptionText2 = styled.img`
  position: absolute;
  left: 210px;
  top: 600px;
  display: flex;
  align-items: center;
  text-align: center;
  z-index: 1;
`

export const AppletG08EEC08S1GB04: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const ggbApi = useRef<GeogebraAppApi | null>(null)
  const [ggbLoaded, setGgbLoaded] = useState(false)
  const [showSlopeButton, setShowSlopeButton] = useState(false)
  const playMouseIn = useSFX('mouseIn')
  const playMouseOut = useSFX('mouseOut')
  const playMouseCLick = useSFX('mouseClick')
  const [showOnboarding1, setShowOnboarding1] = useState(true)
  const [showOnboarding2, setShowOnboarding2] = useState(false)
  const [showText1, setShowText1] = useState(true)
  const [showText2, setShowText2] = useState(false)
  const [showText3, setShowText3] = useState(false)
  const [showText4, setShowText4] = useState(false)
  const [showText5, setShowText5] = useState(false)
  const [showText6, setShowText6] = useState(false)
  const [showOptionText1, setshowOptionText1] = useState(false)
  const [showOptionText2, setshowOptionText2] = useState(false)
  const [showOptionText3, setshowOptionText3] = useState(false)
  const [showOptionText4, setshowOptionText4] = useState(false)
  const [showOptionText5, setshowOptionText5] = useState(false)
  const [showOptionText6, setshowOptionText6] = useState(false)
  const [showNextButton, setShowNextButton] = useState(false)
  const [showRetryButton, setShowRetryButton] = useState(false)

  const onGGBLoaded = useCallback((api: any) => {
    ggbApi.current = api
    setGgbLoaded(api != null)
  }, [])

  const onViewSlopeClick = () => {
    ggbApi.current?.setValue('ViewSlope', 1)
    playMouseCLick()
    if (ggbApi.current?.getValue('Options') === 1) {
      setshowOptionText1(true)
      setShowNextButton(true)
    } else if (ggbApi.current?.getValue('Options') === 2) {
      setshowOptionText2(true)
      setShowNextButton(true)
    } else if (ggbApi.current?.getValue('Options') === 3) {
      setshowOptionText3(true)
      setShowNextButton(true)
    } else if (ggbApi.current?.getValue('Options') === 4) {
      setshowOptionText4(true)
      setShowNextButton(true)
    } else if (ggbApi.current?.getValue('Options') === 5) {
      setshowOptionText5(true)
      setShowNextButton(true)
    } else if (ggbApi.current?.getValue('Options') === 6) {
      setshowOptionText6(true)
      setShowRetryButton(true)
    }
    setShowSlopeButton(false)
  }

  const onNextClick = () => {
    playMouseCLick()
    ggbApi.current?.setValue('ViewSlope', 0)
    if (ggbApi.current?.getValue('Options') === 1) {
      ggbApi.current?.setValue('Options', 2)
      setShowNextButton(false)
      setshowOptionText1(false)
      setShowText1(false)
      setShowText2(true)
      setShowText3(false)
      setShowText4(false)
      setShowText5(false)
      setShowText6(false)
      setShowSlopeButton(false)
    } else if (ggbApi.current?.getValue('Options') === 2) {
      ggbApi.current?.setValue('Options', 3)
      setShowNextButton(false)
      setshowOptionText2(false)
      setShowText1(false)
      setShowText2(false)
      setShowText3(true)
      setShowText4(false)
      setShowText5(false)
      setShowText6(false)
      setShowSlopeButton(false)
    } else if (ggbApi.current?.getValue('Options') === 3) {
      ggbApi.current?.setValue('Options', 4)
      setShowNextButton(false)
      setshowOptionText3(false)
      setShowText1(false)
      setShowText2(false)
      setShowText3(false)
      setShowText4(true)
      setShowText5(false)
      setShowText6(false)
      setShowSlopeButton(false)
    } else if (ggbApi.current?.getValue('Options') === 4) {
      ggbApi.current?.setValue('Options', 5)
      setShowNextButton(false)
      setshowOptionText4(false)
      setShowText1(false)
      setShowText2(false)
      setShowText3(false)
      setShowText4(false)
      setShowText5(true)
      setShowText6(false)
      setShowSlopeButton(false)
    } else if (ggbApi.current?.getValue('Options') === 5) {
      ggbApi.current?.setValue('Options', 6)
      setShowNextButton(false)
      setshowOptionText5(false)
      setShowText1(false)
      setShowText2(false)
      setShowText3(false)
      setShowText4(false)
      setShowText5(false)
      setShowText6(true)
      setShowSlopeButton(false)
    } else if (ggbApi.current?.getValue('Options') === 6) {
      ggbApi.current?.setValue('Options', 1)
      setShowRetryButton(false)
      setshowOptionText6(false)
      setShowText1(true)
      setShowText2(false)
      setShowText3(false)
      setShowText4(false)
      setShowText5(false)
      setShowText6(false)
      setShowSlopeButton(false)
    }
  }

  useEffect(() => {
    const api = ggbApi.current
    let clickedB = false
    let clickedC = false
    let dragOption1Complete = false
    let dragOption2Complete = false
    let dragOption3Complete = false
    let dragOption4Complete = false
    let dragOption5Complete = false
    let dragOption6Complete = false
    let qValue = 1

    if (api != null && ggbLoaded) {
      const onGGBClient: ClientListener = (e) => {
        if (e.type === 'mouseDown') {
          if (e.hits[0] === 'B') {
            playMouseIn()
            setShowOnboarding1(false)
            setShowOnboarding2(true)
            clickedB = true
            if (clickedC) {
              setShowOnboarding2(false)
            }
          } else if (e.hits[0] === 'C') {
            playMouseIn()
            setShowOnboarding2(false)
            clickedC = true
            if (clickedB) {
              setShowOnboarding1(false)
            }
          }
        } else if (e.type === 'dragEnd' && (e.target === 'C' || e.target === 'B')) {
          playMouseOut()
        }
      }

      api.registerClientListener(onGGBClient)

      ggbApi.current?.registerObjectUpdateListener('Options', () => {
        qValue = api.getValue('Options')
      })

      ggbApi.current?.registerObjectUpdateListener('a', () => {
        dragOption1Complete = Boolean(api.getValue('a'))

        if (qValue !== 1) return
        if (dragOption1Complete === true) {
          setShowText1(false)
          setShowSlopeButton(true)
        } else {
          setShowSlopeButton(false)
          setShowText1(true)
        }
      })

      ggbApi.current?.registerObjectUpdateListener('b', () => {
        dragOption2Complete = Boolean(api.getValue('b'))

        if (qValue !== 2) return
        if (dragOption2Complete === true) {
          setShowText2(false)
          setShowSlopeButton(true)
        } else {
          setShowSlopeButton(false)
          setShowText2(true)
        }
      })
      ggbApi.current?.registerObjectUpdateListener('o', () => {
        dragOption3Complete = Boolean(api.getValue('o'))

        if (qValue !== 3) return
        if (dragOption3Complete === true) {
          setShowText3(false)
          setShowSlopeButton(true)
        } else {
          setShowSlopeButton(false)
          setShowText3(true)
        }
      })

      ggbApi.current?.registerObjectUpdateListener('u', () => {
        dragOption4Complete = Boolean(api.getValue('u'))

        if (qValue !== 4) return
        if (dragOption4Complete === true) {
          setShowText4(false)
          setShowSlopeButton(true)
        } else {
          setShowSlopeButton(false)
          setShowText4(true)
        }
      })
      ggbApi.current?.registerObjectUpdateListener('v', () => {
        dragOption5Complete = Boolean(api.getValue('v'))

        if (qValue !== 5) return
        if (dragOption5Complete === true) {
          setShowText5(false)
          setShowSlopeButton(true)
        } else {
          setShowSlopeButton(false)
          setShowText5(true)
        }
      })
      ggbApi.current?.registerObjectUpdateListener('w', () => {
        dragOption6Complete = Boolean(api.getValue('w'))

        if (qValue !== 6) return
        if (dragOption6Complete === true) {
          setShowText6(false)
          setShowSlopeButton(true)
        } else {
          setShowSlopeButton(false)
          setShowText6(true)
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
        borderColor: '#444',
        id: 'g08-eec08-s1-gb04',
        onEvent,
        className,
        themeName: 'dark',
      }}
    >
      <TextHeader
        text="Explore the different types of slope of a line."
        backgroundColor="#F6F6F6"
        buttonColor="#1A1A1A"
      />
      <GeogebraContainer materialId="df3eqqkx" width={700} height={500} onApiReady={onGGBLoaded} />
      {showSlopeButton && (
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <ViewSlopeButton onClick={onViewSlopeClick}>
            <img src={viewSlopeButton} width={'230px'} />
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
          <NextButton onClick={onNextClick}>
            <img src={resetbutton} />
          </NextButton>
        </div>
      )}
      {showOnboarding1 && (
        <OnboardingAnimationContainer left={285} top={115} src={dragalldirection} loop autoplay />
      )}
      {showOnboarding2 && (
        <OnboardingAnimationContainer left={-100} top={300} src={dragalldirection} loop autoplay />
      )}
      {showText1 && <ConstantText src={initialstatement1} />}
      {showText2 && <ConstantText src={initialstatement2} />}
      {showText3 && <ConstantText3 src={initialstatement3} />}
      {showText4 && <ConstantText4 src={initialstatement4} />}
      {showText5 && <ConstantText src={initialstatement5} />}
      {showText6 && <ConstantText4 src={initialstatement6} />}

      {showOptionText1 && <OptionText1 src={option1text} />}
      {showOptionText2 && <OptionText1 src={option2text} />}
      {showOptionText3 && <OptionText2 src={option3text} />}
      {showOptionText4 && <OptionText2 src={option4text} />}
      {showOptionText5 && <OptionText2 src={option5text} />}
      {showOptionText6 && <OptionText2 src={option6text} />}
    </AppletContainer>
  )
}

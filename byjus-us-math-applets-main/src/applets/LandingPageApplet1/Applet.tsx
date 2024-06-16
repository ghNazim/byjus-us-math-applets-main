import { FC, useCallback, useEffect, useRef, useState } from 'react'
import styled, { keyframes } from 'styled-components'

import { OnboardingAnimation } from '@/atoms/OnboardingAnimation'
import { OnboardingController } from '@/atoms/OnboardingController'
import { OnboardingStep } from '@/atoms/OnboardingStep'
import { AppletContainer } from '@/common/AppletContainer'
import { Geogebra } from '@/common/Geogebra'
import { ClientListener, GeogebraAppApi } from '@/common/Geogebra/Geogebra.types'
import { TextHeader } from '@/common/Header'
import { AppletInteractionCallback } from '@/contexts/analytics'
import { useSFX } from '@/hooks/useSFX'

import DummyGgbImg from './assets/loadingSvg.svg'
import RadioButton, { ButtonState } from './components/RadioButton'
import Slider, { SliderRefProps } from './components/Slider'
import Sound from './components/Sound'

type ButtonSelected = 'none' | 'interiorAngle' | 'exteriorAngle' | 'locked'

const FONT_SIZE_FOR_MOBILE = 26
const ColoredSpan = styled.span<{ bgColor: string; color: string }>`
  color: ${(a) => a.color};
  background: ${(a) => a.bgColor};
  padding: 5px;
  border-radius: 5px;
  margin: 0 8px;
`

const GeogebraStyled = styled(Geogebra)<{ opacity: number }>`
  width: 100%;
  height: 75%;
  opacity: ${(a) => a.opacity}%;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  padding-left: 4px; //ggb is slightly towards left
`

const DummyImgContainer = styled.div`
  width: 97.5%;
  height: 73%;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  /* padding-left: 10px; */
  position: absolute;
  top: 0;
  z-index: -10;
  /* border: 1px solid black; */
`

const ButtonHolder = styled.div`
  position: absolute;
  bottom: 66px;
  width: 100%;
  display: flex;
  gap: 2rem;
  justify-content: center;
`

const BottomText = styled.div<{ bottom: number }>`
  position: absolute;
  bottom: ${(a) => a.bottom}px;
  width: 100%;
  text-align: center;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  @media (max-width: 768px) {
    font-size: ${FONT_SIZE_FOR_MOBILE}px;
  }
  line-height: 28px;
  color: #444;
  align-items: center;
  display: flex;
  justify-content: center;
`

const SliderContainer = styled.div`
  position: absolute;
  width: 100%;
  display: flex;
  top: 455px;
  justify-content: center;
`

const OnboardingAnima = styled(OnboardingAnimation)<{ left: number; top: number }>`
  position: absolute;
  top: ${(a) => a.top}px;
  left: ${(a) => a.left}px;
  width: 400px;
`

const StyledTextHeader = styled(TextHeader)`
  /* font-size: 28px !important; */
  p {
    font-size: 20px;
    @media (max-width: 768px) {
      font-size: ${FONT_SIZE_FOR_MOBILE}px;
    }
  }
`

export const AppletLandingPageApplet1: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const ggbApi = useRef<GeogebraAppApi | null>(null)
  const [ggbLoaded, setGgbLoaded] = useState(false)
  const [currentButtonSelected, setCurrentButtonSelected] = useState<ButtonSelected>('locked')
  const [interiorAngleSliderVal, setInteriorAngleSliderVal] = useState(0)
  const [exteriorAngleSliderVal, setexteriorAngleSliderVal] = useState(0)
  const sliderRef = useRef<SliderRefProps | null>(null)
  const [currentAudioIndex, setCurrentAudioIndex] = useState(0)
  const [hideFirstOnboarding, setHideFirstOnboarding] = useState(false)
  const [hideLastOnboarding, setHideLastOnboarding] = useState(false)

  //sound
  const playMouseIn = useSFX('mouseIn')
  const playMouseOut = useSFX('mouseOut')

  const ggbClientListener: ClientListener = useCallback((e) => {
    if (e.type === 'dragEnd' && e.target === 'C') {
      setCurrentButtonSelected((prev) => (prev === 'locked' ? 'none' : prev))
      setHideFirstOnboarding((prev) => (!prev ? true : prev))
    }

    if (e.type == 'mouseDown' && e.hits.includes('C')) {
      playMouseIn()
    } else if (e.type === 'dragEnd' && e.target === 'C') {
      playMouseOut()
    }

    //deselecting after dragEnd
    if (e.type === 'dragEnd') {
      ggbApi.current?.setFixed(e.target, false, false)

      const timer = setTimeout(() => {
        ggbApi.current?.setFixed(e.target, false, true)
      }, 100)

      return () => {
        clearTimeout(timer)
      }
    }
  }, [])

  const onGgbReady = useCallback(
    (api: GeogebraAppApi | null) => {
      if (api !== null) {
        ggbApi.current = api
        setGgbLoaded(true)
        api.registerClientListener(ggbClientListener)

        return () => {
          ggbApi.current?.unregisterClientListener(ggbClientListener)
        }
      }
    },

    [ggbClientListener],
  )

  useEffect(() => {
    if (ggbApi.current === null) return

    if (currentButtonSelected === 'interiorAngle') {
      ggbApi.current.setValue('ninex', 1)
    } else if (currentButtonSelected === 'exteriorAngle') {
      ggbApi.current.setValue('ninex', 2)
    }
  }, [currentButtonSelected])

  //id:1 for interior angle and id:2 for interior angle
  const handleBtnState = (id: number): ButtonState => {
    if (currentButtonSelected === 'locked') {
      return 'disabled'
    } else if (currentButtonSelected === 'interiorAngle' && id === 1) {
      return 'selected'
    } else if (currentButtonSelected === 'exteriorAngle' && id === 2) {
      return 'selected'
    }
    return 'default'
  }

  const handleButtonClick = (id: number) => {
    if (currentButtonSelected !== 'locked') {
      sliderRef.current?.reset()
      if (id === 1) {
        setCurrentButtonSelected((prev) => {
          if (prev === 'exteriorAngle') setHideLastOnboarding(true)
          return 'interiorAngle'
        })
        setCurrentAudioIndex(2)
      } else if (id === 2) {
        setCurrentButtonSelected((prev) => {
          if (prev === 'interiorAngle') setHideLastOnboarding(true)
          return 'exteriorAngle'
        })
        setCurrentAudioIndex(4)
      }
    }
  }

  const convertToDiffRange = (currVal: number, maxVal: number) => {
    //100 is the max value from slider
    return (currVal * maxVal) / 100
  }

  const handleSliderChange = (val: number) => {
    if (currentButtonSelected === 'interiorAngle') {
      //3.14 from GGB
      setInteriorAngleSliderVal(convertToDiffRange(val, 3.15))
    } else if (currentButtonSelected === 'exteriorAngle') {
      //1 from GGB
      setexteriorAngleSliderVal(convertToDiffRange(val, 1))
    }
  }

  useEffect(() => {
    if (currentButtonSelected === 'none') {
      if (currentAudioIndex < 1) {
        setCurrentAudioIndex(1)
      }
    } else if (currentButtonSelected === 'interiorAngle') {
      setexteriorAngleSliderVal(0)
      //3.14 from GGB
      if (ggbApi.current) {
        ggbApi.current.setValue('th', interiorAngleSliderVal)

        interiorAngleSliderVal > 3.12 ? setCurrentAudioIndex(3) : undefined
      }
    } else if (currentButtonSelected === 'exteriorAngle') {
      setInteriorAngleSliderVal(0)
      //1 from GGB
      if (ggbApi.current) {
        ggbApi.current.setValue('tr', exteriorAngleSliderVal)
        exteriorAngleSliderVal > 0.9 ? setCurrentAudioIndex(5) : undefined
      }
    }
  }, [interiorAngleSliderVal, exteriorAngleSliderVal, currentButtonSelected])

  const BottomTextWIthVal = (currentState: ButtonSelected) => {
    if (currentState === 'interiorAngle') {
      if (interiorAngleSliderVal < 3.14) {
        return <>Measure the sum of the interior angles.</>
      } else {
        return (
          <>
            The sum of measures of the{' '}
            <ColoredSpan bgColor="#F1EDFF" color="#6549C2">
              interior angles
            </ColoredSpan>{' '}
            is{' '}
            <ColoredSpan color="#428C94" bgColor="#F1FDFF">
              180º
            </ColoredSpan>
          </>
        )
      }
    } else if (currentButtonSelected === 'exteriorAngle') {
      if (exteriorAngleSliderVal < 1) {
        return <>Measure the sum of the exterior angles.</>
      } else {
        return (
          <>
            The sum of measures of the{' '}
            <ColoredSpan bgColor="#F1EDFF" color="#6549C2">
              exterior angles
            </ColoredSpan>{' '}
            is{' '}
            <ColoredSpan color="#428C94" bgColor="#F1FDFF">
              360º
            </ColoredSpan>
          </>
        )
      }
    }
    return <></>
  }
  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#f6f6f6',
        id: 'landing-page-applet1',
        onEvent,
        className,
      }}
    >
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        <DummyImgContainer>
          <img src={DummyGgbImg} style={{ width: '100%' }} />
        </DummyImgContainer>
      </div>
      <StyledTextHeader
        text="Explore the properties of angles of a triangle."
        backgroundColor="#f6f6f6"
        buttonColor="#1a1a1a"
      />
      <GeogebraStyled materialId="psduhfgk" onApiReady={onGgbReady} opacity={ggbLoaded ? 100 : 0} />
      {ggbLoaded && (
        <OnboardingController>
          <OnboardingStep index={0}>
            <OnboardingAnima
              type="moveAllDirections"
              complete={hideFirstOnboarding}
              top={147}
              left={156}
            />
          </OnboardingStep>
          <ButtonHolder>
            <RadioButton
              value="Interior Angles"
              currentBtnState={handleBtnState(1)}
              onClick={handleButtonClick}
              id={1}
            />

            <RadioButton
              id={2}
              value="Exterior Angles"
              currentBtnState={handleBtnState(2)}
              onClick={handleButtonClick}
            />
          </ButtonHolder>
          <BottomText bottom={150}>
            <Sound index={currentAudioIndex} />
            {currentButtonSelected === 'locked' ? (
              <>Drag the point to create your own triangle</>
            ) : currentButtonSelected === 'none' ? (
              <>Select the angle theorem you wish to explore.</>
            ) : (
              BottomTextWIthVal(currentButtonSelected)
            )}
          </BottomText>
          <SliderContainer>
            {(currentButtonSelected === 'exteriorAngle' ||
              currentButtonSelected === 'interiorAngle') && (
              <Slider ref={sliderRef} onChange={handleSliderChange} max={100} />
            )}
          </SliderContainer>

          <OnboardingStep index={1}>
            <OnboardingAnima
              type="click"
              complete={currentButtonSelected !== 'none' && currentButtonSelected !== 'locked'}
              top={650}
              left={37}
            />
          </OnboardingStep>

          <OnboardingStep index={2}>
            <OnboardingAnima
              top={435}
              left={-55}
              type="moveRight"
              complete={interiorAngleSliderVal !== 0 || exteriorAngleSliderVal !== 0}
            />
          </OnboardingStep>

          {(interiorAngleSliderVal > 3.13 || exteriorAngleSliderVal > 0.9) && (
            <OnboardingStep index={3}>
              <OnboardingAnima
                type="click"
                complete={hideLastOnboarding}
                top={650}
                left={currentButtonSelected === 'exteriorAngle' ? 37 : 290}
              />
            </OnboardingStep>
          )}
        </OnboardingController>
      )}
    </AppletContainer>
  )
}

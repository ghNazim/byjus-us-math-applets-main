import { Player } from '@lottiefiles/react-lottie-player'
import { FC, useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { OnboardingController } from '@/atoms/OnboardingController'
import { OnboardingStep } from '@/atoms/OnboardingStep'
import { AppletContainer } from '@/common/AppletContainer'
import { Geogebra } from '@/common/Geogebra'
import { ClientListener, GeogebraAppApi } from '@/common/Geogebra/Geogebra.types'
import { TextHeader } from '@/common/Header'
import { AppletInteractionCallback } from '@/contexts/analytics'
import { useSFX } from '@/hooks/useSFX'
import { StepInput } from '@/molecules/StepInput'

import movediagonally from '../../common/handAnimations/moveAllDirections.json'
import moveHorizontally from '../../common/handAnimations/moveHorizontally.json'
import moveVertically from '../../common/handAnimations/moveVertically.json'

const GeogebraContainer = styled(Geogebra)`
  position: absolute;
  left: 50%;
  translate: -50%;
  top: 5px;
  scale: 0.8;
`
const StepInputContainer1 = styled.div`
  position: absolute;
  bottom: 112px;
  margin: 0 32px;
  display: flex;
  gap: 28px;
  left: 10px;
  top: 600px;
  align-items: center;
  justify-content: center;
`
const StepInputContainer2 = styled.div`
  position: absolute;
  bottom: 112px;
  margin: 0 32px;
  display: flex;
  gap: 28px;
  left: 230px;
  top: 600px;
  align-items: center;
  justify-content: center;
`

const StepInputContainer3 = styled.div`
  position: absolute;
  bottom: 112px;
  margin: 0 32px;
  display: flex;
  gap: 28px;
  left: 450px;
  top: 600px;
  align-items: center;
  justify-content: center;
`
const DEFAULT_A = 1
const DEFAULT_B = 1
const DEFAULT_C = 1

const ColoredSpan = styled.span<{ color: string }>`
  color: ${(props) => props.color};
`
const Text = styled.label`
  font-size: 24px;
  font-family: 'Nunito';
  font-weight: 700;
  color: #444444;
  text-align: center;
`
const StepperLabel: React.FC<{ color: string; children: string }> = ({ color, children }) => (
  <Text>
    <ColoredSpan color={color}>{children}</ColoredSpan>
  </Text>
)

const OnboardingAnimationContainer = styled(Player)<{ left: number; top: number }>`
  position: absolute;
  left: ${(a) => a.left}px;
  top: ${(a) => a.top}px;
  pointer-events: none;
  z-index: 1;
`

export const AppletG06GMC04S1GB01: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const [ggbLoaded, setGGBLoaded1] = useState(false)
  const ggb = useRef<GeogebraAppApi | null>(null)
  const [stepperValue1, setStepperValue1] = useState(DEFAULT_A)
  const [stepperValue2, setStepperValue2] = useState(DEFAULT_B)
  const [stepperValue3, setStepperValue3] = useState(DEFAULT_C)

  const playMouseClick = useSFX('mouseClick')
  const playMouseIn = useSFX('mouseIn')
  const playMouseOut = useSFX('mouseOut')

  const [showStepper1, setShowStepper1] = useState(false)
  const [showStepper2, setShowStepper2] = useState(false)
  const [showStepper3, setShowStepper3] = useState(false)

  const [maxValue1, setMaxValue1] = useState(4)
  const [maxValue2, setMaxValue2] = useState(4)
  const [maxValue3, setMaxValue3] = useState(4)

  const [showOnboarding1, setShowOnboarding1] = useState(true)
  const [showOnboarding2, setShowOnboarding2] = useState(false)
  const [showOnboarding3, setShowOnboarding3] = useState(false)
  const [resetButtonClicks, setResetButtonClicks] = useState(0)

  const [clickOrder, setClickOrder] = useState<string[]>([])

  const onGGBLoaded = useCallback((api: GeogebraAppApi | null) => {
    ggb.current = api
    setGGBLoaded1(api != null)
    setShowOnboarding1(true)
  }, [])

  const onChangeStepperButton1 = (value: number) => {
    if (value > stepperValue1) {
      ggb.current?.evalCommand('RunClickScript(LengthPositive)')
    } else if (value < stepperValue1) {
      ggb.current?.evalCommand('RunClickScript(LengthNegative)')
    }
    setStepperValue1(value)
  }

  const onChangeStepperButton2 = (value: number) => {
    if (value > stepperValue2) {
      ggb.current?.evalCommand('RunClickScript(WidthPositive)')
    } else if (value < stepperValue2) {
      ggb.current?.evalCommand('RunClickScript(WidthNegative)')
    }
    setStepperValue2(value)
  }

  const onChangeStepperButton3 = (value: number) => {
    if (value > stepperValue3) {
      ggb.current?.evalCommand('RunClickScript(HeightPositive)')
    } else if (value < stepperValue3) {
      ggb.current?.evalCommand('RunClickScript(HeightNegative)')
    }
    setStepperValue3(value)
  }

  useEffect(() => {
    if (showOnboarding1 && showOnboarding2 && showOnboarding3) {
      setResetButtonClicks(0)
    }
  }, [showOnboarding1, showOnboarding2, showOnboarding3])

  useEffect(() => {
    const api = ggb.current

    if (api != null && ggbLoaded) {
      const onGGBClient: ClientListener = (e) => {
        if (e.type === 'mouseDown' && e.hits[0] === 'Next1') {
          playMouseClick()
        } else if (e.type === 'mouseDown' && e.hits[0] === 'ResetButton') {
          setResetButtonClicks((prevCount) => prevCount + 1)
          setShowOnboarding1(true)
          setShowOnboarding2(false)
          setShowOnboarding3(false)
          setClickOrder([])
          playMouseClick()
        } else if (e.type === 'mouseDown' && e.hits[0] === 'Visualize') {
          playMouseClick()
        }
        if (e.type === 'mouseDown' && e.hits[0] === 'DragA') {
          setClickOrder((prevOrder) => [...prevOrder, 'DragA'])
          setShowOnboarding1(false)
          setShowOnboarding2(true)
          setShowOnboarding3(false)
          playMouseIn()
        } else if (e.type === 'mouseDown' && e.hits[0] === 'DragB') {
          setClickOrder((prevOrder) => [...prevOrder, 'DragB'])
          setShowOnboarding1(false)
          setShowOnboarding2(false)
          setShowOnboarding3(true)
          playMouseIn()
        } else if (e.type === 'mouseDown' && e.hits[0] === 'DragC') {
          setClickOrder((prevOrder) => [...prevOrder, 'DragC'])
          setShowOnboarding1(false)
          setShowOnboarding2(false)
          setShowOnboarding3(false)
          playMouseIn()
        } else if (e.type === 'dragEnd' && e.target === 'DragA') {
          playMouseOut()
        } else if (e.type === 'dragEnd' && e.target === 'DragB') {
          playMouseOut()
        } else if (e.type === 'dragEnd' && e.target === 'DragC') {
          playMouseOut()
        }
        api.registerObjectUpdateListener('layer', () => {
          const valueLayer = api.getValue('layer')
          if (valueLayer === 1) {
            setShowStepper1(false)
            setShowStepper2(false)
            setShowStepper3(false)
          } else if (valueLayer === 2) {
            setShowStepper1(true)
            setShowStepper2(true)
            setShowStepper3(true)
            setStepperValue1(DEFAULT_A)
            setStepperValue2(DEFAULT_B)
            setStepperValue3(DEFAULT_C)
          } else if (valueLayer === 3) {
            setShowStepper1(false)
            setShowStepper2(false)
            setShowStepper3(false)
          } else if (valueLayer === 4) {
            setShowStepper1(false)
            setShowStepper2(false)
            setShowStepper3(false)
          }
        })

        api.registerObjectUpdateListener('a', () => {
          const ValueA = api.getValue('a')
          setMaxValue1(ValueA + 1)
        })

        api.registerObjectUpdateListener('b', () => {
          const ValueB = api.getValue('b')
          setMaxValue2(ValueB + 1)
        })

        api.registerObjectUpdateListener('c', () => {
          const ValueC = api.getValue('c')
          setMaxValue3(ValueC + 1)
        })

        return () => {
          ggb.current?.unregisterClientListener(onGGBClient)
          ggb.current?.unregisterObjectUpdateListener('layer')
        }
      }

      api.registerClientListener(onGGBClient)
    }
  }, [ggbLoaded, playMouseClick, playMouseIn, playMouseOut, setMaxValue1])

  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#F6F6F6',
        id: 'g06-gmc04-s1-gb01',
        onEvent,
        className,
        themeName: 'dark',
      }}
    >
      <TextHeader
        text="Find the volume of prism using unit cubes."
        backgroundColor="#F6F6F6"
        buttonColor="#1A1A1A"
      />
      <GeogebraContainer materialId="wxwshgff" onApiReady={onGGBLoaded} />
      {ggbLoaded && showStepper1 && showStepper2 && showStepper3 && (
        <>
          <OnboardingController>
            <StepInputContainer1>
              <OnboardingStep index={0}>
                <StepInput
                  min={1}
                  max={maxValue1}
                  defaultValue={DEFAULT_A}
                  onChange={onChangeStepperButton1}
                  label={() => <StepperLabel color="#1CB9D9">Length</StepperLabel>}
                />
              </OnboardingStep>
            </StepInputContainer1>
            <StepInputContainer2>
              <OnboardingStep index={1}>
                <StepInput
                  min={1}
                  max={maxValue2}
                  defaultValue={DEFAULT_B}
                  onChange={onChangeStepperButton2}
                  label={() => <StepperLabel color="#CF8B04">Width</StepperLabel>}
                />
              </OnboardingStep>
            </StepInputContainer2>
            <StepInputContainer3>
              <OnboardingStep index={2}>
                <StepInput
                  min={1}
                  max={maxValue3}
                  defaultValue={DEFAULT_C}
                  onChange={onChangeStepperButton3}
                  label={() => <StepperLabel color="#6549C2">Height</StepperLabel>}
                />
              </OnboardingStep>
            </StepInputContainer3>
          </OnboardingController>
        </>
      )}
      {showOnboarding1 && !clickOrder.includes('DragA') && (
        <OnboardingAnimationContainer left={200} top={320} src={moveHorizontally} loop autoplay />
      )}
      {showOnboarding2 && !clickOrder.includes('DragB') && (
        <OnboardingAnimationContainer left={-40} top={240} src={movediagonally} loop autoplay />
      )}
      {showOnboarding3 && !clickOrder.includes('DragC') && (
        <OnboardingAnimationContainer left={260} top={80} src={moveVertically} loop autoplay />
      )}
    </AppletContainer>
  )
}

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

import patch from './assets/p1.jpg'

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
  left: 80px;
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
  left: 350px;
  top: 600px;
  align-items: center;
  justify-content: center;
`
const PatchContainer = styled.img`
  position: absolute;
  width: 50px;
  height: 50px;
  left: 10px;
  top: 745px;
  z-index: 1;
`
const DEFAULT_A = 1
const DEFAULT_B = 1

export const AppletG06GMC02S1GB03: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const [ggbLoaded, setGGBLoaded1] = useState(false)
  const ggb = useRef<GeogebraAppApi | null>(null)
  const [stepperValue1, setStepperValue1] = useState(DEFAULT_A)
  const [stepperValue2, setStepperValue2] = useState(DEFAULT_A)
  const playMouseClick = useSFX('mouseClick')
  const [showStepper1, setShowStepper1] = useState(true)
  const [showStepper2, setShowStepper2] = useState(true)
  const onGGBLoaded = useCallback((api: GeogebraAppApi | null) => {
    ggb.current = api
    setGGBLoaded1(api != null)
  }, [])

  const onChangeStepperButton1 = (value: number) => {
    if (value > stepperValue1) {
      ggb.current?.evalCommand('RunClickScript(LengthPlus)')
    } else if (value < stepperValue1) {
      ggb.current?.evalCommand('RunClickScript(LengthMinus)')
    }
    setStepperValue1(value)
  }

  const onChangeStepperButton2 = (value: number) => {
    if (value > stepperValue2) {
      ggb.current?.evalCommand('RunClickScript(WidthPlus)')
    } else if (value < stepperValue2) {
      ggb.current?.evalCommand('RunClickScript(WidthMinus)')
    }
    setStepperValue2(value)
  }

  useEffect(() => {
    const api = ggb.current
    if (api != null && ggbLoaded) {
      const onGGBClient: ClientListener = (e) => {
        if (e.type === 'mouseDown' && e.hits[0] === 'TryNew') {
          playMouseClick()
        } else if (e.type === 'mouseDown' && e.hits[0] === 'Next') {
          playMouseClick()
        } else if (e.type === 'mouseDown' && e.hits[0] === 'Visualize') {
          playMouseClick()
        }
        api.registerObjectUpdateListener('layer', () => {
          const valueLayer = api.getValue('layer')
          if (valueLayer === 2) {
            setShowStepper1(false)
            setShowStepper2(false)
          } else if (valueLayer === 1) {
            setShowStepper1(true)
            setShowStepper2(true)
            setStepperValue1(DEFAULT_A)
            setStepperValue2(DEFAULT_B)
          }
        })
        return () => {
          ggb.current?.unregisterClientListener(onGGBClient)
          ggb.current?.unregisterObjectUpdateListener('layer')
        }
      }

      api.registerClientListener(onGGBClient)
    }
  }, [ggbLoaded, playMouseClick])

  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#F6F6F6',
        id: 'g06-gmc02-s1-gb03',
        onEvent,
        className,
        themeName: 'dark',
      }}
    >
      <TextHeader
        text="Find the area of rectangle using unit squares."
        backgroundColor="#F6F6F6"
        buttonColor="#1A1A1A"
      />
      <GeogebraContainer materialId="hkqhhkrx" onApiReady={onGGBLoaded} />
      {ggbLoaded && showStepper1 && showStepper2 && (
        <>
          <OnboardingController>
            <StepInputContainer1>
              <OnboardingStep index={0}>
                <StepInput
                  min={1}
                  max={9}
                  defaultValue={DEFAULT_A}
                  onChange={onChangeStepperButton1}
                  label={'Length'}
                />
              </OnboardingStep>
            </StepInputContainer1>
            <StepInputContainer2>
              <OnboardingStep index={1}>
                <StepInput
                  min={1}
                  max={7}
                  defaultValue={DEFAULT_B}
                  onChange={onChangeStepperButton2}
                  label={'Width'}
                />
              </OnboardingStep>
            </StepInputContainer2>
          </OnboardingController>
        </>
      )}
      <PatchContainer src={patch}></PatchContainer>
    </AppletContainer>
  )
}

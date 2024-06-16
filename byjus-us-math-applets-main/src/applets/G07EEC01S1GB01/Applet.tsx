import { Player } from '@lottiefiles/react-lottie-player'
import { FC, useCallback, useContext, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { OnboardingController } from '@/atoms/OnboardingController'
import { OnboardingStep } from '@/atoms/OnboardingStep'
import { AppletContainer } from '@/common/AppletContainer'
import { Geogebra } from '@/common/Geogebra'
import { GeogebraAppApi } from '@/common/Geogebra/Geogebra.types'
import { TextHeader } from '@/common/Header'
import { AnalyticsContext, AppletInteractionCallback } from '@/contexts/analytics'
import { useSFX } from '@/hooks/useSFX'
import { StepInput } from '@/molecules/StepInput'

import ClickAnimation from '../../common/handAnimations/click.json'
import tryNewSymb from './asset/tryNewSymb.svg'
const GeoGebraContainer = styled(Geogebra)`
  position: absolute;
  display: flex;
  justify-content: center;
  width: 650px;
  height: 500px;
  bottom: 255px;
  left: 40px;
  top: 90px;
  z-index: -1;
`
const RadioDiv = styled.div<{ left: number; checked: boolean }>`
  box-sizing: border-box;
  padding: 4px;
  position: absolute;
  width: 177px;
  height: 60px;
  left: ${(props) => props.left}px;
  top: 350px;
  background: #ffffff;
  border: 1px solid ${(props) => (props.checked ? '#6549C2' : '#d9cdff')};
  ${(props) =>
    props.checked
      ? ''
      : 'box-shadow: 0px 3px 0px #dad2f7, inset 0px 2px 0px rgba(255, 255, 255, 0.2);'}
  border-radius: 12px;
  cursor: pointer;
`
const RadioInnerDiv = styled.div<{ checked: boolean }>`
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
  width: 100%;
  height: 100%;
  background: ${(props) => (props.checked ? '#F1EDFF' : '#ffffff')};
  border-radius: 8px;
  pointer-events: none;
`
const RadioLabel = styled.label`
  width: 104px;
  height: 28px;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;
  text-align: center;
  color: #444444;
  pointer-events: none;
`
const RadioButton = styled.div<{ checked: boolean }>`
  width: 22px;
  height: 22px;
  border: 2px solid #6549c2;
  border-radius: 50%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  span {
    width: 12px;
    height: 12px;
    background-color: #6549c2;
    border-radius: 50%;
    display: ${(props) => (props.checked ? 'block' : 'none')};
    pointer-events: none;
  }
`
const ColorText = styled.span<{ color: string }>`
  display: inline-block;
  color: ${(props) => props.color};
  margin: 0;
  pointer-events: none;
`
const StepInputContainer1 = styled.div`
  position: absolute;
  bottom: 112px;
  margin: 0 32px;
  display: flex;
  gap: 28px;
  left: 100px;
  top: 650px;
  align-items: center;
  justify-content: center;
`
const StepInputContainer2 = styled.div`
  position: absolute;
  bottom: 112px;
  margin: 0 32px;
  display: flex;
  gap: 28px;
  left: 320px;
  top: 650px;
  align-items: center;
  justify-content: center;
`

const DEFAULT_A = 0

const Text = styled.label`
  font-size: 24px;
  font-family: 'Nunito';
  font-weight: 700;
  color: #444444;
  text-align: center;
`
const StepperColoredSpan = styled.span<{ color: string }>`
  color: ${(props) => props.color};
  font-size: 24px;
  font-family: 'Nunito';
  font-weight: 700;
`
const NumberColoredSpan = styled.span<{ color: string }>`
  color: ${(props) => props.color};
  font-size: 24px;
  font-family: 'Nunito';
  font-weight: 700;
`

const Number = styled.text<{ left: number }>`
  position: absolute;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;
  color: #4444;
  left: ${(props) => props.left}px;
  top: 470px;
  z-index: 1;
`

const StepperLabel: React.FC<{ color: string; children: string }> = ({ color, children }) => (
  <Text>
    <StepperColoredSpan color={color}>{children}</StepperColoredSpan>
  </Text>
)

const TryNewSymbol = styled.img`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
  padding: 9px 10px;

  position: absolute;
  width: 45px;
  height: 45px;
  left: 290px;
  top: 737px;
  border: none;
  cursor: pointer;
  transition: 0.2s;
  z-index: 2;
`

const TryNewButton = styled.button`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: flex-end;
  padding: 9px 18px;

  position: absolute;
  width: 160px;
  height: 60px;
  left: 280px;
  top: 730px;
  border: none;
  cursor: pointer;
  transition: 0.2s;

  background: #8c69ff;
  border-radius: 10px;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 22px;
  line-height: 42px;
  text-align: center;
  color: #ffffff;

  z-index: 1;
`
const OnboardingAnimationContainer = styled(Player)<{ left: number; top: number }>`
  position: absolute;
  width: 100px;
  left: ${(a) => a.left}px;
  top: ${(a) => a.top}px;
  pointer-events: none;
`
export const AppletG07EEC01S1GB01: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const ggbApi = useRef<GeogebraAppApi | null>(null)
  const [GGBLoaded, setGGBLoaded] = useState(false)
  const [option1, setOption1] = useState(false)
  const [option2, setOption2] = useState(false)
  const playClick = useSFX('mouseClick')
  const [valueA, setValueA] = useState(DEFAULT_A)
  const [valueB, setValueB] = useState(DEFAULT_A)
  const [valueC, setValueC] = useState(DEFAULT_A)
  const [showNumber, setShowNumber] = useState(false)
  const onInteraction = useContext(AnalyticsContext)
  const [isComplete, setComplete] = useState(false)
  const [showOnboarding1, setShowOnboarding1] = useState(true)

  const onGGBLoaded = useCallback((api: GeogebraAppApi | null) => {
    ggbApi.current = api
    if (api == null) return
    setGGBLoaded(api != null)

    ggbApi.current?.registerObjectUpdateListener('A1', () => {
      const xCoord = ggbApi.current?.getXcoord('A1')
      const qValue = ggbApi.current?.getValue('q')

      if (xCoord === -8 && qValue === 0) {
        setComplete(true)
      } else if (xCoord === 2 && qValue === 1) {
        setComplete(true)
        ggbApi.current?.setVisible('pic54', true)
      } else if (xCoord === -6 && qValue === 2) {
        setComplete(true)
        ggbApi.current?.setVisible('pic55', true)
      } else if (xCoord === 7 && qValue === 3) {
        setComplete(true)
        ggbApi.current?.setVisible('pic54', true)
      } else if (xCoord === -2 && qValue === 4) {
        setComplete(true)
        ggbApi.current?.setVisible('pic54', true)
      } else {
        setComplete(false)
      }
    })
  }, [])

  const onClickHandle = (e: any) => {
    playClick()
    onInteraction('tap')
    switch (e.target.id) {
      case '1':
        setOption1((v) => !v)
        setOption2(false)
        ggbApi.current?.setVisible('Hide', false)
        ggbApi.current?.setValue('ss', 2)
        ggbApi.current?.setFilling('pic18', 1)
        ggbApi.current?.setFilling('pic19', 0)
        setShowNumber(true)
        setShowOnboarding1(false)

        break
      case '2':
        setOption2((v) => !v)
        setOption1(false)
        ggbApi.current?.setVisible('Hide', false)
        ggbApi.current?.setValue('ss', 1)
        ggbApi.current?.setFilling('pic18', 0)
        ggbApi.current?.setFilling('pic19', 1)
        setShowNumber(true)
        setShowOnboarding1(false)
        break
    }
  }

  const onChangeStepperButton1 = (value: number) => {
    setValueA(value)
  }

  const onChangeStepperButton2 = (value: number) => {
    setValueB(value)
    setValueC(Math.abs(value))
  }

  useEffect(() => {
    ggbApi.current?.setValue('ad', valueA)
  }, [valueA])
  useEffect(() => ggbApi.current?.setValue('sb', valueB), [valueB])
  useEffect(() => {
    ggbApi.current?.setValue('sbb', valueC)
  }, [valueC])

  const onTryNewClick = () => {
    playClick()
    const xCoord = ggbApi.current?.getXcoord('A1')
    if (xCoord == -8) {
      ggbApi.current?.setCoords('I1', 2, 0)
      ggbApi.current?.setValue('q', 1)
      ggbApi.current?.setValue('gr', 2)
    }
    if (xCoord == 2) {
      ggbApi.current?.setCoords('I1', -6, 0)
      ggbApi.current?.setValue('q', 2)
      ggbApi.current?.setValue('gr', 3)
    }
    if (xCoord == -6) {
      ggbApi.current?.setCoords('I1', 7, 0)
      ggbApi.current?.setValue('q', 3)
      ggbApi.current?.setValue('gr', 4)
    }
    if (xCoord == 7) {
      ggbApi.current?.setCoords('I1', -2, 0)
      ggbApi.current?.setValue('q', 4)
      ggbApi.current?.setValue('gr', 5)
    }
    if (xCoord == -2) {
      ggbApi.current?.setCoords('I1', -8, 0)
      ggbApi.current?.setValue('q', 0)
      ggbApi.current?.setValue('gr', 0)
    }
  }

  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#F1FDFF',
        id: 'g07-eec01-s1-gb01',
        onEvent,
        className,
      }}
    >
      <TextHeader
        text="Move and help the bird reach the eggs."
        backgroundColor="#F1FDFF"
        buttonColor="#BCDFDF"
        hideButton={true}
      />

      <GeoGebraContainer
        materialId={'wda3wrba'}
        onApiReady={onGGBLoaded}
        width={650}
        height={500}
      />
      <>
        <RadioDiv left={160} checked={option1} id={'1'} onClick={onClickHandle}>
          <RadioInnerDiv checked={option1}>
            <RadioButton checked={option1}>
              <span></span>
            </RadioButton>
            <RadioLabel>
              <ColorText color={'#6549C2'}>Addition</ColorText>
            </RadioLabel>
          </RadioInnerDiv>
        </RadioDiv>
        <RadioDiv left={374} checked={option2} id={'2'} onClick={onClickHandle}>
          <RadioInnerDiv checked={option2}>
            <RadioButton checked={option2}>
              <span></span>
            </RadioButton>
            <RadioLabel>
              <ColorText color={'#6549C2'}>Subtraction</ColorText>
            </RadioLabel>
          </RadioInnerDiv>
        </RadioDiv>
        {showOnboarding1 && (
          <OnboardingAnimationContainer left={140} top={350} src={ClickAnimation} loop autoplay />
        )}
      </>
      {showNumber && GGBLoaded && (
        <>
          <Number left={182}>
            <NumberColoredSpan color="#AA5EE0">{valueA}</NumberColoredSpan>
          </Number>

          <Number left={300}>
            <NumberColoredSpan color="#F57A7A">{valueB}</NumberColoredSpan>
          </Number>
          <Number left={418}>
            <NumberColoredSpan color="#646464">{valueA}</NumberColoredSpan>
          </Number>
          <Number left={533}>
            <NumberColoredSpan color="#646464">{valueC}</NumberColoredSpan>
          </Number>
          <OnboardingController>
            <StepInputContainer1>
              <OnboardingStep index={0}>
                <StepInput
                  min={-5}
                  max={5}
                  defaultValue={DEFAULT_A}
                  onChange={onChangeStepperButton1}
                  showLabel={true}
                  label={() => <StepperLabel color="#AA5EE0">First Number</StepperLabel>}
                />
              </OnboardingStep>
            </StepInputContainer1>
            <StepInputContainer2>
              <OnboardingStep index={1}>
                <StepInput
                  min={-5}
                  max={5}
                  defaultValue={DEFAULT_A}
                  onChange={onChangeStepperButton2}
                  label={() => <StepperLabel color="#F57A7A">Second Number</StepperLabel>}
                />
              </OnboardingStep>
            </StepInputContainer2>
          </OnboardingController>
        </>
      )}
      {isComplete && (
        <>
          <TryNewButton onClick={onTryNewClick}>Try New</TryNewButton>
          <TryNewSymbol src={tryNewSymb}></TryNewSymbol>
        </>
      )}
    </AppletContainer>
  )
}

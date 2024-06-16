import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { OnboardingAnimation } from '@/atoms/OnboardingAnimation'
import { OnboardingController } from '@/atoms/OnboardingController'
import { OnboardingStep } from '@/atoms/OnboardingStep'
import { useSFX } from '@/hooks/useSFX'
import { StepInput } from '@/molecules/StepInput'

import { AppletContainer } from '../../common/AppletContainer'
import { Geogebra } from '../../common/Geogebra'
import { GeogebraAppApi } from '../../common/Geogebra/Geogebra.types'
import { TextHeader } from '../../common/Header'
import { AnalyticsContext, AppletInteractionCallback } from '../../contexts/analytics'
const GGB = styled(Geogebra)`
  position: absolute;
  top: 90px;
  left: 50%;
  translate: -50%;
  scale: 0.92;
`
const GGBBorder = styled.div`
  position: absolute;
  top: 100px;
  left: 50%;
  translate: -50%;
  width: 515px;
  height: 325px;
  border-radius: 14px;
  border-top: 15px solid #f9f7ff;
  border-right: 40px solid #f9f7ff;
  border-left: 36px solid #f9f7ff;
  border-bottom: 20px solid #f9f7ff;
`
const HelperText = styled.div<{ top: number }>`
  position: absolute;
  width: 369px;
  height: 43px;
  top: ${(props) => props.top}px;
  left: 50%;
  translate: -50%;
  display: flex;
  flex-direction: 'row';
  justify-content: space-evenly;
  align-items: center;
  background: #fff2f2;
  border-radius: 6px;
`
const LabelText = styled.div<{ pos: number }>`
  width: ${(props) => (props.pos == 1 ? 120 : 249)}px;
  height: 28px;

  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;
  text-align: center;
  color: ${(props) => (props.pos == 1 ? '#F57A7A' : '#444444')};
`
const ColorText = styled.span<{ color: string }>`
  display: inline-block;
  color: ${(props) => props.color};
  margin: 0;
  pointer-events: none;
`

const RadioDiv = styled.div<{ left: number; checked: boolean }>`
  box-sizing: border-box;
  padding: 4px;
  position: absolute;
  width: 177px;
  height: 60px;
  left: ${(props) => props.left}px;
  top: 449px;
  background: #f3f3f3;
  border: 1px solid ${(props) => (props.checked ? '#646464' : '#FFFFFF')};
  ${(props) => (props.checked ? '' : 'box-shadow: 0px 3px 0px #646464, inset 0px 2px 0px #646464;')}
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
  background: ${(props) => (props.checked ? '#C7C7C750' : '#ffffff')};
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

const ClickOnboarding = styled(OnboardingAnimation).attrs({ type: 'click' })`
  position: absolute;
  top: 430px;
  left: 215px;
  pointer-events: none;
`
const StepInputContainer = styled.div`
  position: absolute;
  bottom: 50px;
  margin: 0 32px;
  display: flex;
  gap: 28px;
  align-items: center;
  justify-content: center;
`
const StepperColoredSpan = styled.span<{ color: string }>`
  color: ${(props) => props.color};
  font-size: 20px;
  font-family: 'Nunito';
  font-weight: 700;
`
const Text = styled.label`
  font-size: 20px;
  font-family: 'Nunito';
  font-weight: 700;
  color: #444444;
  text-align: center;
`

const StepperLabel: React.FC<{ color: string; children: string }> = ({ color, children }) => (
  <Text>
    Value of <StepperColoredSpan color={color}>{children}</StepperColoredSpan>
  </Text>
)
export const AppletG06EEC03GB03: React.FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const ggbApi = useRef<GeogebraAppApi | null>(null)
  const [values, setValues] = useState({ a: 2, b: 1, c: 3 })
  const [ggbLoaded, setGGBLoaded] = useState(false)
  const [showText, setShowText] = useState(false)
  const [option1, setOption1] = useState(false)
  const [option2, setOption2] = useState(false)
  const playClick = useSFX('mouseClick')
  const onInteraction = useContext(AnalyticsContext)
  const [onBoardCompleted, setOnBoardCompleted] = useState(false)
  const onGGBHandle = useCallback((api: GeogebraAppApi | null) => {
    ggbApi.current = api
    if (api == null) return
    setGGBLoaded(true)
  }, [])
  const onStepperAHandle = (value: number) => {
    if (!ggbApi.current) return
    ggbApi.current.setValue('a', value - 1)
    setValues((v) => {
      const d = { ...v }
      d.a = value
      return d
    })
  }
  const onStepperBHandle = (value: number) => {
    if (!ggbApi.current) return
    ggbApi.current.setValue('b', value - 1)
    setValues((v) => {
      const d = { ...v }
      d.b = value
      return d
    })
  }
  const onStepperCHandle = (value: number) => {
    if (!ggbApi.current) return
    ggbApi.current.setValue('c', value - 1)
    setValues((v) => {
      const d = { ...v }
      d.c = value
      return d
    })
  }
  const onClickHandle = (e: any) => {
    playClick()
    onInteraction('tap')
    switch (e.target.id) {
      case '1':
        setOption1((v) => !v)
        setOption2(false)
        setOnBoardCompleted(true)
        break
      case '2':
        setOption2((v) => !v)
        setOption1(false)
        break
    }
  }
  useEffect(() => {
    if (!ggbApi.current) return
    if (option1) {
      ggbApi.current.setValue('Toggle', -1)
      setShowText(true)
    } else if (option2) {
      ggbApi.current.setValue('Toggle', 1)
      setShowText(true)
    } else if (!option1 && !option2) {
      ggbApi.current.setValue('Toggle', 0)
      setShowText(false)
    }
  }, [option1, option2])
  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#F6F6F6',
        id: 'G06EEC03GB03',
        onEvent,
        className,
        themeName: 'dark',
      }}
    >
      <TextHeader
        text="Modify the number of squares in both the groups to understand the associative property of addition."
        backgroundColor="#F6F6F6"
        buttonColor="#1A1A1A"
      />
      <GGB materialId="uktzz8am" onApiReady={onGGBHandle} />
      {ggbLoaded && (
        <OnboardingController>
          <GGBBorder />
          <RadioDiv left={170} checked={option1} id={'1'} onClick={onClickHandle}>
            <RadioInnerDiv checked={option1}>
              <RadioButton checked={option1}>
                <span></span>
              </RadioButton>
              <RadioLabel>
                {'( '}
                <ColorText color={'#D97A1A'}>a</ColorText>
                {' + '}
                <ColorText color={'#1CB9D9'}>b</ColorText>
                {' ) + '}
                <ColorText color={'#AA5EE0'}>c</ColorText>
              </RadioLabel>
            </RadioInnerDiv>
          </RadioDiv>
          <RadioDiv left={374} checked={option2} id={'2'} onClick={onClickHandle}>
            <RadioInnerDiv checked={option2}>
              <RadioButton checked={option2}>
                <span></span>
              </RadioButton>
              <RadioLabel>
                <ColorText color={'#D97A1A'}>a</ColorText>
                {' + ( '}
                <ColorText color={'#1CB9D9'}>b</ColorText>
                {' + '}
                <ColorText color={'#AA5EE0'}>c</ColorText>
                {' )'}
              </RadioLabel>
            </RadioInnerDiv>
          </RadioDiv>
          {showText && (
            <>
              <HelperText top={524}>
                <LabelText pos={1}>Arithmetic</LabelText>
                <LabelText pos={2}>
                  {'( '}
                  <ColorText color={'#D97A1A'}>{values.a}</ColorText>
                  {' + '}
                  <ColorText color={'#1CB9D9'}>{values.b}</ColorText>
                  {' ) + '}
                  <ColorText color={'#AA5EE0'}>{values.c}</ColorText>
                  {' = '}
                  <ColorText color={'#D97A1A'}>{values.a}</ColorText>
                  {' + ( '}
                  <ColorText color={'#1CB9D9'}>{values.b}</ColorText>
                  {' + '}
                  <ColorText color={'#AA5EE0'}>{values.c}</ColorText>
                  {' )'}
                </LabelText>
              </HelperText>
              <HelperText top={574}>
                <LabelText pos={1}>Algebra</LabelText>
                <LabelText pos={2}>
                  {'( '}
                  <ColorText color={'#D97A1A'}>a</ColorText>
                  {' + '}
                  <ColorText color={'#1CB9D9'}>b</ColorText>
                  {' ) + '}
                  <ColorText color={'#AA5EE0'}>c</ColorText>
                  {' = '}
                  <ColorText color={'#D97A1A'}>a</ColorText>
                  {' + ( '}
                  <ColorText color={'#1CB9D9'}>b</ColorText>
                  {' + '}
                  <ColorText color={'#AA5EE0'}>c</ColorText>
                  {' )'}
                </LabelText>
              </HelperText>
            </>
          )}
          <OnboardingStep index={1}>
            <ClickOnboarding complete={onBoardCompleted} />
          </OnboardingStep>
          <>
            <StepInputContainer>
              <OnboardingStep index={0}>
                <StepInput
                  value={values.a}
                  min={1}
                  max={5}
                  step={1}
                  showLabel={true}
                  label={() => <StepperLabel color="#CF8B04">a</StepperLabel>}
                  onChange={onStepperAHandle}
                />
              </OnboardingStep>
              <StepInput
                value={values.b}
                min={1}
                max={5}
                step={1}
                showLabel={true}
                label={() => <StepperLabel color="#1CB9D9">b</StepperLabel>}
                onChange={onStepperBHandle}
              />
              <StepInput
                value={values.c}
                min={1}
                max={5}
                step={1}
                showLabel={true}
                label={() => <StepperLabel color="#AA5EE0">c</StepperLabel>}
                onChange={onStepperCHandle}
              />
            </StepInputContainer>
          </>
        </OnboardingController>
      )}
    </AppletContainer>
  )
}

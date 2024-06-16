import React, { useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { OnboardingAnimation } from '@/atoms/OnboardingAnimation'
import { OnboardingController } from '@/atoms/OnboardingController'
import { OnboardingStep } from '@/atoms/OnboardingStep'
import { AppletInteractionCallback } from '@/contexts/analytics'
import { useHasChanged } from '@/hooks/useHasChanged'
import { useInterval } from '@/hooks/useInterval'
import { useSFX } from '@/hooks/useSFX'
import { StepInput } from '@/molecules/StepInput'

import { AppletContainer } from '../../common/AppletContainer'
import { Geogebra } from '../../common/Geogebra'
import { GeogebraAppApi } from '../../common/Geogebra/Geogebra.types'
import { TextHeader } from '../../common/Header'
import patch from './Assets/patch.svg'

const GeogebraFrame = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  bottom: 420px;
  left: 190px;
  width: 550px;
  height: 250px;
  overflow: hidden;
  z-index: -1;
  /* border: 1px solid black; */
`
const StepInputContainer = styled.div`
  position: absolute;
  bottom: 112px;
  margin: 0 32px;
  display: flex;
  gap: 28px;
  align-items: center;
  justify-content: center;
`
const RectangleBG = styled.div`
  box-sizing: border-box;

  position: absolute;
  width: 656px;
  height: 300px;
  left: 32px;
  top: 102px;
  border: 1px solid #d97a1a;
  border-radius: 10px;
`

const RectangleTextBG1 = styled.div`
  position: absolute;
  width: 369px;
  height: 43px;
  left: 176px;
  top: 441px;
  background: #fff2f2;
  border-radius: 2px 0px 0px 2px;
`
const RectangleTextBG2 = styled.div`
  position: absolute;
  width: 369px;
  height: 43px;
  left: 176px;
  top: 490px;
  background: #fff2f2;
  border-radius: 2px 0px 0px 2px;
`
const HelperText1Name = styled.div`
  position: absolute;
  width: 99px;
  height: 28px;
  left: 190px;
  top: 448px;

  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;

  text-align: center;

  color: #f57a7a;
`
const PatchContainer = styled.img`
  position: absolute;
  width: 25px;
  height: 25px;
  left: 200px;
  top: 340px;
`
const HelperText1 = styled.div`
  position: absolute;
  top: 450px;
  left: 63%;
  translate: -63%;
  height: 20px;
  width: 230px;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;
  text-align: center;
  z-index: 1;
`
const HelperText2Name = styled.div`
  position: absolute;
  width: 75px;
  height: 28px;
  left: 202px;
  top: 497px;

  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;

  text-align: center;

  color: #f57a7a;
`
const HelperText2 = styled.div`
  position: absolute;
  top: 500px;
  left: 62%;
  translate: -62%;
  height: 20px;
  width: 230px;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;
  text-align: center;
  z-index: 1;
`
const ClickOnboarding = styled(OnboardingAnimation).attrs({ type: 'click' })`
  position: absolute;
  top: 690px;
  left: 250px;
  pointer-events: none;
`
const ToggleButtonContainer = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
  padding: 4px;
  position: absolute;
  width: 304px;
  height: 60px;
  left: 208px;
  top: 708px;
  background: #ffffff;
  border: 1px solid #1a1a1a;
  border-radius: 12px;
  gap: 2px;
`

// const ToggleButtonAnimation = styled.div`
//   display: flex;
// `
const TButton = styled.button<{ clickState: boolean }>`
  width: 148px;
  height: 52px;
  cursor: pointer;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 42px;
  text-align: center;
  color: ${(props) => (props.clickState ? '#ffffff' : '#646464')};
  background-color: ${(props) => (props.clickState ? '#1a1a1a' : '#fff')};
  align-items: center;
  display: flex;
  justify-content: center;
  border-radius: 8px;
  border: none;
`

const StepperColoredSpan = styled.span<{ color: string }>`
  color: ${(props) => props.color};
  font-size: 24px;
  font-family: 'Nunito';
  font-weight: 700;
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
    Value of <StepperColoredSpan color={color}>{children}</StepperColoredSpan>
  </Text>
)

const DEFAULT_A = 3
const DEFAULT_B = 2
const DEFAULT_C = 4

export const AppletG06EEC03GB05: React.FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const ggbApi = useRef<GeogebraAppApi | null>(null)
  const [ggbLoaded, setGgbLoaded] = useState(false)
  const [joinAnimation, setJoinAnimation] = useState(false)
  const [valueA, setValueA] = useState(DEFAULT_A)
  const [valueB, setValueB] = useState(DEFAULT_B)
  const [valueC, setValueC] = useState(DEFAULT_C)
  const [toggle, setToggle] = useState(false)
  const [showToggleContainer, setShowToggleContainer] = useState(false)
  const playMouseCLick = useSFX('mouseClick')

  const hasToggled = useHasChanged(toggle)

  const handleGGBReady = useCallback((api: GeogebraAppApi | null) => {
    ggbApi.current = api
    setGgbLoaded(true)
  }, [])
  const onChangeStepperButton1 = (value: number) => {
    setValueA(value)
  }
  const onChangeStepperButton2 = (value: number) => {
    setValueB(value)
  }
  const onChangeStepperButton3 = (value: number) => {
    setValueC(value)
  }
  const onClickJoinButton = () => {
    setToggle(false)
    playMouseCLick()
    if (ggbApi.current) {
      const api = ggbApi.current
      if (api.getValue('Sep') > 0) {
        api.setValue('Sep', 2)
        setJoinAnimation(true)
      }
    }
  }
  const onClickSplitButton = () => {
    setToggle(true)
    playMouseCLick()
    setJoinAnimation(false)

    if (ggbApi.current) {
      const api = ggbApi.current
      api.evalCommand('StartAnimation(Sep,true)')
    }
  }
  useInterval(
    () => {
      if (!ggbApi.current) return
      if (ggbApi.current.getValue('Sep') > 0)
        ggbApi.current.setValue('Sep', ggbApi.current.getValue('Sep') - 0.2)
      else setJoinAnimation(false)
    },
    joinAnimation ? 50 : null,
  )

  useEffect(() => ggbApi.current?.setValue('a', valueA), [valueA])
  useEffect(() => ggbApi.current?.setValue('b', valueB), [valueB])
  useEffect(() => ggbApi.current?.setValue('c', valueC), [valueC])
  useEffect(() => {
    if (valueA !== DEFAULT_A || valueB !== DEFAULT_B || valueC !== DEFAULT_C)
      setShowToggleContainer(true)
  }, [valueA, valueB, valueC])

  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#F6F6F6',
        id: 'G06EEC03GB05',
        onEvent,
        className,
        themeName: 'dark',
      }}
    >
      <TextHeader
        text=" Increase the number of squares and observe the relation between repeated addition and multiplication."
        backgroundColor="#F6F6F6"
        buttonColor="#1A1A1A"
      />
      <GeogebraFrame>
        <Geogebra materialId="qzmjpbfc" onApiReady={handleGGBReady} width={550} height={250} />
      </GeogebraFrame>
      {ggbLoaded && (
        <OnboardingController>
          <StepInputContainer>
            <OnboardingStep index={0}>
              <StepInput
                min={1}
                max={4}
                defaultValue={DEFAULT_A}
                onChange={onChangeStepperButton1}
                label={() => <StepperLabel color="#CF8B04">a</StepperLabel>}
                showLabel={true}
              />
            </OnboardingStep>

            <StepInput
              label={() => <StepperLabel color="#2AD3F5">b</StepperLabel>}
              showLabel={true}
              min={1}
              max={5}
              defaultValue={DEFAULT_B}
              onChange={onChangeStepperButton2}
            />

            <StepInput
              label={() => <StepperLabel color="#C882FA">c</StepperLabel>}
              showLabel={true}
              min={1}
              max={6}
              defaultValue={DEFAULT_C}
              onChange={onChangeStepperButton3}
            />
          </StepInputContainer>
          <RectangleBG></RectangleBG>
          <RectangleTextBG1> </RectangleTextBG1>
          <RectangleTextBG2> </RectangleTextBG2>
          <HelperText1Name>Arithmetic </HelperText1Name>
          <HelperText1>
            <span style={{ color: ' #D97A1A' }}>
              {valueA}
              <span style={{ color: ' #444444' }}>{' ( '}</span>
              <span style={{ color: ' #1CB9D9' }}>{valueB}</span>
              <span style={{ color: ' #444444' }}>{' + '}</span>
              <span style={{ color: ' #AA5EE0' }}>{valueC}</span>
              <span style={{ color: ' #444444' }}>{' ) '}</span>
              <span style={{ color: ' #444444' }}>{' ='}</span>
              <span style={{ color: '#D97A1A' }}> {valueA}</span>
              <span style={{ color: ' #444444' }}>{' × '}</span>
              <span style={{ color: ' #1CB9D9' }}>{valueB}</span>
              <span style={{ color: ' #444444' }}>{' + '}</span>
              <span style={{ color: '#D97A1A' }}> {valueA}</span>
              <span style={{ color: ' #444444' }}>{' × '}</span>
              <span style={{ color: ' #AA5EE0' }}>{valueC}</span>
            </span>
          </HelperText1>
          <HelperText2Name>Algebra</HelperText2Name>
          <HelperText2>
            {' '}
            <span style={{ color: ' #D97A1A' }}>
              {'a'}
              <span style={{ color: ' #444444' }}>{' ( '}</span>
              <span style={{ color: ' #1CB9D9' }}>{'b'}</span>
              <span style={{ color: ' #444444' }}>{' + '}</span>
              <span style={{ color: ' #AA5EE0' }}>{'c'}</span>
              <span style={{ color: ' #444444' }}>{' ) '}</span>
              <span style={{ color: ' #444444' }}>{' ='}</span>
              <span style={{ color: '#D97A1A' }}> {'a'}</span>
              <span style={{ color: ' #444444' }}>{' × '}</span>
              <span style={{ color: ' #1CB9D9' }}>{'b'}</span>
              <span style={{ color: ' #444444' }}>{' + '}</span>
              <span style={{ color: '#D97A1A' }}>{'a'}</span>
              <span style={{ color: ' #444444' }}>{' × '}</span>
              <span style={{ color: ' #AA5EE0' }}>{'c'}</span>
            </span>
          </HelperText2>
          <>
            {showToggleContainer && (
              <ToggleButtonContainer>
                <TButton onClick={onClickSplitButton} clickState={toggle}>
                  {'Split'}
                </TButton>
                <TButton onClick={onClickJoinButton} clickState={!toggle}>
                  {'Join'}
                </TButton>
              </ToggleButtonContainer>
            )}
            <OnboardingStep index={1}>
              <ClickOnboarding complete={hasToggled} />
            </OnboardingStep>
          </>
          <PatchContainer src={patch}></PatchContainer>
        </OnboardingController>
      )}
    </AppletContainer>
  )
}

import React, { useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { OnboardingController } from '@/atoms/OnboardingController'
import { OnboardingStep } from '@/atoms/OnboardingStep'
import { AppletInteractionCallback } from '@/contexts/analytics'
import { StepInput } from '@/molecules/StepInput'

import { AppletContainer } from '../../common/AppletContainer'
import { Geogebra } from '../../common/Geogebra'
import { GeogebraAppApi } from '../../common/Geogebra/Geogebra.types'
import { TextHeader } from '../../common/Header'
import Exp from './Assets/Expression.svg'
import patch from './Assets/patch.svg'

const GeogebraFrameLeft = styled.div`
  position: absolute;
  justify-content: center;
  bottom: 320px;
  left: 55px;
  width: 288px;
  height: 330px;
  z-index: 1;
  border-radius: 0px 0px 5px 5px;
`
const RectangleBGLeft = styled.div`
  box-sizing: border-box;
  position: absolute;
  width: 290px;
  height: 331.5px;
  left: 54px;
  top: 147px;
  border: 1px solid #c882fa;
  border-radius: 0px 0px 5px 5px;
`
const UpperRectangleBGLeft = styled.div`
  box-sizing: border-box;
  position: absolute;
  width: 290px;
  height: 36px;
  left: 54px;
  top: 111px;
  border: 1px solid #c882fa;
  border-radius: 5px 5px 0px 0px;
`
const GeogebraFrameRight = styled.div`
  position: absolute;
  justify-content: center;
  bottom: 320px;
  left: 375px;
  width: 288px;
  height: 330px;
  z-index: 1;
  border-radius: 0px 0px 5px 5px;
`
const RectangleBGRight = styled.div`
  box-sizing: border-box;
  position: absolute;
  width: 290px;
  height: 331.5px;
  left: 374px;
  top: 147px;
  border: 1px solid #c882fa;
  border-radius: 0px 0px 5px 5px;
`

const UpperRectangleBGRight = styled.div`
  box-sizing: border-box;
  position: absolute;
  width: 290px;
  height: 36px;
  left: 374px;
  top: 111px;
  border: 1px solid #c882fa;
  border-radius: 5px 5px 0px 0px;
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
const RectangleTextBG1 = styled.div`
  position: absolute;
  width: 369px;
  height: 43px;
  left: 176px;
  top: 520px;
  background: #fff2f2;
  border-radius: 2px 0px 0px 2px;
`
const RectangleTextBG2 = styled.div`
  position: absolute;
  width: 369px;
  height: 43px;
  left: 176px;
  top: 570px;
  background: #fff2f2;
  border-radius: 2px 0px 0px 2px;
`
const HelperText1Name = styled.div`
  position: absolute;
  width: 99px;
  height: 28px;
  left: 190px;
  top: 530px;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;
  text-align: center;
  color: #f57a7a;
`
const HelperText1 = styled.div`
  position: absolute;
  top: 530px;
  left: 63%;
  translate: -63%;
  height: 20px;
  width: 240px;
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
  top: 580px;
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
  top: 580px;
  left: 62.5%;
  translate: -62.5%;
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
const PatchContainerLeft = styled.img`
  position: absolute;
  width: 25px;
  height: 25px;
  left: 62px;
  top: 445px;
  z-index: 1;
`
const PatchContainerRight = styled.img`
  position: absolute;
  width: 25px;
  height: 25px;
  left: 382px;
  top: 445px;
  z-index: 1;
`

const Expression = styled.img`
  position: absolute;
  left: 135px;
  top: 120px;
  z-index: 1;
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

const DEFAULT_A = 1
const DEFAULT_B = 2
const DEFAULT_C = 3

export const AppletG06EEC03GB04: React.FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const ggbApiLeft = useRef<GeogebraAppApi | null>(null)
  const ggbApiRight = useRef<GeogebraAppApi | null>(null)

  const [ggbLoaded, setGgbLoaded] = useState(false)

  const [valueA, setValueA] = useState(DEFAULT_A)
  const [valueB, setValueB] = useState(DEFAULT_B)
  const [valueC, setValueC] = useState(DEFAULT_C)

  const handleGGBReadyLeft = useCallback((api: GeogebraAppApi | null) => {
    ggbApiLeft.current = api
    setGgbLoaded(ggbApiLeft.current != null && ggbApiRight.current != null)
  }, [])

  const handleGGBReadyRight = useCallback((api: GeogebraAppApi | null) => {
    ggbApiRight.current = api
    setGgbLoaded(ggbApiLeft.current != null && ggbApiRight.current != null)
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

  useEffect(() => {
    ggbApiRight.current?.setValue('a', valueA)
    ggbApiLeft.current?.setValue('a', valueA)
  }, [valueA])
  useEffect(() => {
    ggbApiRight.current?.setValue('b', valueB)
    ggbApiLeft.current?.setValue('b', valueB)
  }, [valueB])
  useEffect(() => {
    ggbApiRight.current?.setValue('c', valueC)
    ggbApiLeft.current?.setValue('c', valueC)
  }, [valueC])

  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#F6F6F6',
        id: 'G06EEC03GB04',
        onEvent,
        className,
        themeName: 'dark',
      }}
    >
      <TextHeader
        text="Change the values and observe their grouping to understand the associative property of multiplication."
        backgroundColor="#F6F6F6"
        buttonColor="#1A1A1A"
      />

      <GeogebraFrameLeft>
        <Geogebra materialId="yqcdkadc" onApiReady={handleGGBReadyLeft} width={288} height={330} />
      </GeogebraFrameLeft>

      <GeogebraFrameRight>
        <Geogebra materialId="yrjx7qyb" onApiReady={handleGGBReadyRight} width={288} height={330} />
      </GeogebraFrameRight>

      {ggbLoaded && (
        <>
          <OnboardingController>
            <StepInputContainer>
              <OnboardingStep index={0}>
                <StepInput
                  min={1}
                  max={5}
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
                max={5}
                defaultValue={DEFAULT_C}
                onChange={onChangeStepperButton3}
              />
            </StepInputContainer>
            <RectangleBGLeft />
            <UpperRectangleBGLeft />
            <RectangleBGRight />
            <UpperRectangleBGRight />
            <RectangleTextBG1> </RectangleTextBG1>
            <RectangleTextBG2> </RectangleTextBG2>

            <HelperText1Name>Arithmetic </HelperText1Name>
            <HelperText1>
              <span style={{ color: ' #444444' }}>{' ( '}</span>
              <span style={{ color: ' #D97A1A' }}>
                {valueA}
                <span style={{ color: ' #444444' }}>{' × '}</span>
                <span style={{ color: ' #1CB9D9' }}>{valueB}</span>
                <span style={{ color: ' #444444' }}>{' ) '}</span>
                <span style={{ color: ' #444444' }}>{' × '}</span>
                <span style={{ color: ' #AA5EE0' }}>{valueC}</span>

                <span style={{ color: ' #444444' }}>{' ='}</span>
                <span style={{ color: '#D97A1A' }}> {valueA}</span>
                <span style={{ color: ' #444444' }}>{' × '}</span>
                <span style={{ color: ' #444444' }}>{' ( '}</span>
                <span style={{ color: ' #1CB9D9' }}>{valueB}</span>
                <span style={{ color: ' #444444' }}>{' × '}</span>
                <span style={{ color: ' #AA5EE0' }}>{valueC}</span>
                <span style={{ color: ' #444444' }}>{' ) '}</span>
              </span>
            </HelperText1>
            <HelperText2Name>Algebra</HelperText2Name>
            <HelperText2>
              <span style={{ color: ' #444444' }}>{' ( '}</span>
              <span style={{ color: ' #D97A1A' }}>
                {'a'}
                <span style={{ color: ' #444444' }}>{' × '}</span>
                <span style={{ color: ' #1CB9D9' }}>{'b'}</span>
                <span style={{ color: ' #444444' }}>{' ) '}</span>
                <span style={{ color: ' #444444' }}>{' × '}</span>
                <span style={{ color: ' #AA5EE0' }}>{'c'}</span>
                <span style={{ color: ' #444444' }}>{' ='}</span>
                <span style={{ color: '#D97A1A' }}>{' a '}</span>
                <span style={{ color: ' #444444' }}>{' × '}</span>
                <span style={{ color: ' #444444' }}>{' ( '}</span>
                <span style={{ color: ' #1CB9D9' }}>{'b'}</span>
                <span style={{ color: ' #444444' }}>{' × '}</span>
                <span style={{ color: ' #AA5EE0' }}>{'c'}</span>
                <span style={{ color: ' #444444' }}>{' ) '}</span>
              </span>
            </HelperText2>

            <PatchContainerLeft src={patch}></PatchContainerLeft>
            <PatchContainerRight src={patch}></PatchContainerRight>
            <Expression src={Exp}></Expression>
          </OnboardingController>
        </>
      )}
    </AppletContainer>
  )
}

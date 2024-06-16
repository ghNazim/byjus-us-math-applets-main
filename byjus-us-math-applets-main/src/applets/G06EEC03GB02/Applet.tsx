import React, { useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { AppletInteractionCallback } from '@/contexts/analytics'
import { StepInput } from '@/molecules/StepInput'

import { AnimatedInputSlider } from '../../common/AnimatedInputSlider'
import { AppletContainer } from '../../common/AppletContainer'
import { Geogebra } from '../../common/Geogebra'
import { GeogebraAppApi } from '../../common/Geogebra/Geogebra.types'
import { TextHeader } from '../../common/Header'
import reset from './Assets/reset.svg'
import text1 from './Assets/text1.svg'
import text2 from './Assets/text2.svg'

const CenterContainer = styled.div`
  box-sizing: border-box;

  position: absolute;
  width: 656px;
  height: 460px;
  left: 32px;
  top: 104px;

  border: 2px solid #8c69ff;
  border-radius: 20px;
`
const Scaler = styled.div`
  position: absolute;
  top: 1px;
  left: 30px;
  scale: 0.85;
`
const TextContainer = styled.img<{ top: number; left: number }>`
  position: absolute;
  top: ${(props) => props.top - 12}px;
  left: ${(props) => props.left - 45}px;
`
const SliderContainer = styled(AnimatedInputSlider)`
  position: absolute;
  top: 365px;
  left: 130px;
`
const StepperContainer = styled.div<{ visible: boolean }>`
  position: absolute;
  left: 50%;
  translate: -50%;
  bottom: 32px;
  display: ${(props) => (props.visible ? 'flex' : 'none')};
  justify-content: center;
  align-items: center;
  gap: 28px;
`
const TextBackground = styled.div<{ top?: number; left?: number }>`
  position: absolute;
  width: 369px;
  height: 43px;
  top: ${(props) => props.top ?? 579}px;
  left: ${(props) => props.left ?? 176}px;
  background: #fff2f2;
  border-radius: 6px;

  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 25px;
  padding: 0 40px;

  font-family: 'Nunito';
`
const Text = styled.div`
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;
  color: #f57a7a;
  width: 20px;
  text-align: center;
`

const StepperColoredSpan = styled.span<{ color: string }>`
  color: ${(props) => props.color};
  font-size: 24px;
  font-family: 'Nunito';
  font-weight: 700;
`

const LabelText = styled.label`
  font-size: 24px;
  font-family: 'Nunito';
  font-weight: 700;
  color: #444444;
  text-align: center;
`

const StepperLabel: React.FC<{ color: string; children: string }> = ({ color, children }) => (
  <LabelText>
    Value of <StepperColoredSpan color={color}>{children}</StepperColoredSpan>
  </LabelText>
)
const Reset = styled.img`
  position: absolute;
  width: 160px;
  height: 60px;
  left: 280px;
  bottom: 32px;
  transition: all.3s;
  :hover {
    scale: 1.05;
    cursor: pointer;
  }
`
export const AppletG06EEC03GB02: React.FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const ggbApi = useRef<GeogebraAppApi | null>(null)
  const [ggbLoaded, setGgbLoaded] = useState(false)
  const [slider, setSilder] = useState(0)
  const [valueA, setValueA] = useState(2)
  const [valueB, setValueB] = useState(4)
  const [textMove, setTextMove] = useState({ left: 0, top: 0 })
  const [textStatic, setTextStatic] = useState({ left: 0, top: 0 })

  const onGgbLoaded = useCallback((api: GeogebraAppApi | null) => {
    ggbApi.current = api
    setGgbLoaded(api != null)
  }, [])

  useEffect(() => {
    const api = ggbApi.current
    if (!ggbLoaded || api == null) return
    setTextMove(locatePoint(api, 'TextRefMove'))
    setTextStatic(locatePoint(api, 'TextRefStatic'))
    api.registerObjectUpdateListener('TextRefMove', () => {
      setTextMove(locatePoint(api, 'TextRefMove'))
    })
    api.registerObjectUpdateListener('TextRefStatic', () => {
      setTextStatic(locatePoint(api, 'TextRefStatic'))
    })

    return () => {
      ggbApi.current?.unregisterObjectUpdateListener('TextRefMove')
      ggbApi.current?.unregisterObjectUpdateListener('TextRefStatic')
    }
  }, [ggbLoaded])

  const onSliderChange = (value: number) => {
    setSilder(value * 0.02)
  }

  useEffect(() => {
    ggbApi.current?.setValue('a', valueA)
  }, [valueA])

  useEffect(() => {
    ggbApi.current?.setValue('b', valueB)
  }, [valueB])

  useEffect(() => {
    ggbApi.current?.setValue('master', slider)
  }, [slider])

  const OnResetHandle = () => {
    setSilder(0)
    setValueA(2)
    setValueB(4)
  }
  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#F6F6F6',
        id: 'G06EEC03GB02',
        onEvent,
        className,
        themeName: 'dark',
      }}
    >
      <TextHeader
        text="Change the number of tiles to understand the commutative property of multiplication."
        backgroundColor="#F6F6F6"
        buttonColor="#1A1A1A"
      />
      <CenterContainer>
        <Scaler>
          <Geogebra materialId="pmdjaxbr" width={650} height={400} onApiReady={onGgbLoaded} />
          {ggbLoaded && slider === 2 && (
            <TextContainer src={text2} top={textMove.top} left={textMove.left} />
          )}
          {ggbLoaded && <TextContainer src={text1} top={textStatic.top} left={textStatic.left} />}
        </Scaler>
        {ggbLoaded && (
          <SliderContainer value={0} onChangePercent={onSliderChange} reset={slider === 0} />
        )}
      </CenterContainer>
      <StepperContainer visible={slider <= 1}>
        <>
          <StepInput
            value={valueA}
            defaultValue={2}
            min={2}
            max={6}
            step={1}
            label={() => <StepperLabel color="#CF8B04">a</StepperLabel>}
            onChange={setValueA}
          />
          <StepInput
            value={valueB}
            defaultValue={4}
            min={2}
            max={6}
            step={1}
            onChange={setValueB}
            label={() => <StepperLabel color="#2AD3F5">b</StepperLabel>}
          />
        </>
      </StepperContainer>

      {slider == 2 && ggbLoaded && (
        <TextBackground>
          <Text>Arithmetic</Text>
          <div
            style={{ fontWeight: '700', fontSize: '20px', lineHeight: '28px', color: '#555555' }}
          >
            <span style={{ color: '#CF8B04', fontWeight: 700 }}> {valueA}</span> x
            <span style={{ color: '#2AD3F5', fontWeight: 700 }}> {valueB}</span> =
            <span style={{ color: '#2AD3F5', fontWeight: 700 }}> {valueB}</span> x
            <span style={{ color: '#CF8B04', fontWeight: 700 }}> {valueA}</span>
          </div>
        </TextBackground>
      )}
      {slider == 2 && ggbLoaded && (
        <TextBackground top={630}>
          <div
            style={{
              width: '50px',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <Text> Algebra </Text>
          </div>
          <div
            style={{
              fontWeight: '700',
              fontSize: '20px',
              lineHeight: '28px',
              color: '#555555',
            }}
          >
            <span style={{ color: '#CF8B04', fontWeight: 700 }}> {'a'}</span> x
            <span style={{ color: '#2AD3F5', fontWeight: 700 }}> {'b'}</span> =
            <span style={{ color: '#2AD3F5', fontWeight: 700 }}> {'b'}</span> x
            <span style={{ color: '#CF8B04', fontWeight: 700 }}> {'a'}</span>
          </div>
        </TextBackground>
      )}
      {slider === 2 && <Reset src={reset} onClick={OnResetHandle} />}
    </AppletContainer>
  )
}
const locatePoint = (ggbApi: GeogebraAppApi, pointName: string) => {
  if (!ggbApi)
    return {
      left: 0,
      top: 0,
    }
  const pointX = ggbApi.getValue(`x(${pointName})`)
  const pointY = ggbApi.getValue(`y(${pointName})`)
  const cornor1X = ggbApi.getValue('x(Corner(1))')
  const cornor1Y = ggbApi.getValue('y(Corner(1))')
  const cornor2X = ggbApi.getValue('x(Corner(2))')
  const cornor4Y = ggbApi.getValue('y(Corner(4))')
  const heightInPixel = ggbApi.getValue('y(Corner(5))')
  const widthInPixel = ggbApi.getValue('x(Corner(5))')
  return {
    left: ((pointX - cornor1X) / (cornor2X - cornor1X)) * widthInPixel,
    top: heightInPixel - ((pointY - cornor1Y) / (cornor4Y - cornor1Y)) * heightInPixel,
  }
}

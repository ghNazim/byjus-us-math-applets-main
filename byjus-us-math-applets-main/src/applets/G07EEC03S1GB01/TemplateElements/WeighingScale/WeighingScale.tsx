import React, { ComponentType, useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { Geogebra } from '@/common/Geogebra'
import { GeogebraAppApi } from '@/common/Geogebra/Geogebra.types'
import { useInterval } from '@/hooks/useInterval'

import { GridProps } from '../../Applet'
import {
  IParameters,
  IQuestionModular as IQuestion,
  ISliderValues,
  useQuestion,
} from './WeighingScale.context'

const WeighingMachine = styled.div`
  position: relative;
  width: 500px;
  height: 350px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
  overflow: hidden;
`

const SignDisplay = styled.div`
  position: absolute;
  z-index: 2;
  top: 52%;
  left: 44.8%;
  width: 45px;
  height: 44px;
`
const ScaleDisplay = styled.div<{ left: number; top: number }>`
  position: absolute;
  top: ${(props) => props.top - 27}px;
  left: ${(props) => props.left - 101}px;
  width: 188px;
  height: 10px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: end;
`
const EquationDisplay = styled.div<{ bgColor: string; color: string }>`
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 8px 36px;
  border-radius: 10px;
  background: ${(props) => props.bgColor};
  border: 2px solid ${(props) => props.color};
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 24px;
  line-height: 32px;
  color: ${(props) => props.color};
`
const TextDisplay = styled.div<{ left: number; top: number; color: string }>`
  position: absolute;
  top: ${(props) => props.top - 14}px;
  left: ${(props) => props.left - 50}px;
  width: 100px;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;
  color: ${(props) => props.color};
`

interface SliderValueProps {
  sliderValues: ISliderValues
  parameters: IParameters
  questionParse: IQuestion
  ggbLoadComplete: () => void
  LeftProp: ComponentType<GridProps>
  RightProp: ComponentType<GridProps>
}

const CombinedScaleMap = (question: IQuestion, parameters: IParameters) => {
  const eSlider = question.evalFn(parameters).calcVals
  const eMinMax = question.minMaxValues
  const lhsValue = (40 * (eSlider.lhs - eMinMax.lhs)) / (eMinMax.rhs - eMinMax.lhs)
  const rhsValue = (40 * (eSlider.rhs - eMinMax.lhs)) / (eMinMax.rhs - eMinMax.lhs)
  return { lhs: lhsValue, rhs: rhsValue }
}

export const WeighingScale: React.FC<SliderValueProps> = ({
  sliderValues,
  parameters,
  questionParse,
  ggbLoadComplete,
  LeftProp,
  RightProp,
}) => {
  const { question, setQuestion, currentCalculation, setCurrentCalculation } = useQuestion()
  const [ggbLoaded, setGgbLoaded] = useState(false)
  const ggbApi = useRef<GeogebraAppApi | null>(null)
  const { position: TextA } = useGGBLocatePoint('TextpaneA', ggbApi.current)
  const { position: TextB } = useGGBLocatePoint('TextpaneB', ggbApi.current)

  const [currentValues, setCurrentValues] = useState(question.evalFn(parameters).calcVals)

  const [valuesToBe, setValuesToBe] = useState(currentValues)

  const onGGBLoaded = useCallback((api: GeogebraAppApi | null) => {
    ggbApi.current = api
    if (!api) return
    ggbLoadComplete()
    setGgbLoaded(true)
    api.setValue('maxScale', question.scalePrecision)
    api.setValue(
      'a',
      question.static === 'right'
        ? CombinedScaleMap(question, parameters).lhs
        : CombinedScaleMap(question, parameters).rhs,
    )
    api.setValue(
      'b',
      question.static === 'right'
        ? CombinedScaleMap(question, parameters).rhs
        : CombinedScaleMap(question, parameters).lhs,
    )
  }, [])

  useEffect(() => {
    setQuestion(questionParse)
  }, [questionParse])

  useEffect(() => {
    if (!ggbApi.current) return
    setValuesToBe(CombinedScaleMap(question, parameters))
    setCurrentValues({ lhs: ggbApi.current.getValue('a'), rhs: ggbApi.current.getValue('b') })
  }, [sliderValues, question])

  useEffect(() => {
    if (!ggbApi.current) return
    ggbApi.current.setValue('a', currentValues.lhs)
    ggbApi.current.setValue('b', currentValues.rhs)
    setCurrentCalculation(question.evalFn(parameters))
  }, [currentValues])

  const incVal = 0.5

  useInterval(
    () => {
      if (!ggbApi.current) return
      if (valuesToBe.lhs < currentValues.lhs) {
        if (currentValues.lhs - incVal < valuesToBe.lhs)
          setCurrentValues((prev) => {
            prev.lhs = valuesToBe.lhs
            return { ...prev }
          })
        else {
          setCurrentValues((prev) => {
            prev.lhs = prev.lhs - incVal
            return { ...prev }
          })
        }
      } else {
        if (currentValues.lhs + incVal > valuesToBe.lhs)
          setCurrentValues((prev) => {
            prev.lhs = valuesToBe.lhs
            return { ...prev }
          })
        else {
          setCurrentValues((prev) => {
            prev.lhs = prev.lhs + incVal
            return { ...prev }
          })
        }
      }
    },
    valuesToBe.lhs !== currentValues.lhs ? 16 : null,
  )

  useInterval(
    () => {
      if (!ggbApi.current) return
      if (valuesToBe.rhs < currentValues.rhs) {
        if (currentValues.rhs - incVal < valuesToBe.rhs)
          setCurrentValues((prev) => {
            prev.rhs = valuesToBe.rhs
            return { ...prev }
          })
        else {
          setCurrentValues((prev) => {
            prev.rhs = prev.rhs - incVal
            return { ...prev }
          })
        }
      } else {
        if (currentValues.rhs + incVal > valuesToBe.rhs)
          setCurrentValues((prev) => {
            prev.rhs = valuesToBe.rhs
            return { ...prev }
          })
        else {
          setCurrentValues((prev) => {
            prev.rhs = prev.rhs + incVal
            return { ...prev }
          })
        }
      }
    },
    valuesToBe.rhs !== currentValues.rhs ? 16 : null,
  )

  useEffect(() => {
    if (!ggbApi.current) return
    if (currentCalculation.answer) ggbApi.current.setValue('colourchange', 1)
    else ggbApi.current.setValue('colourchange', 0)
  }, [currentCalculation.answer])

  return (
    <WeighingMachine>
      <Geogebra materialId="bhjun8at" onApiReady={onGGBLoaded} />
      {ggbLoaded && (
        <>
          <LeftProp TextPos={TextA} />
          <TextDisplay left={TextA.left - 100} top={TextA.top} color="white">
            {question.evalFn(parameters).calcExpression?.lhs}
          </TextDisplay>
          <RightProp TextPos={TextB} />
          <TextDisplay left={TextB.left - 100} top={TextB.top + 2.5} color="white">
            {question.evalFn(parameters).calcExpression?.rhs}
          </TextDisplay>
        </>
      )}
    </WeighingMachine>
  )
}

export interface Position {
  left: number
  top: number
}
function useGGBLocatePoint(pointName: string, api: GeogebraAppApi | null, activeTracking = true) {
  const [position, setPosition] = useState<Position>({ left: 0, top: 0 })
  const ggbApi = useRef<GeogebraAppApi | null>(null)
  ggbApi.current = api
  const locatePoint = (ggbApi: GeogebraAppApi, pointName: string) => {
    const pointX = ggbApi.getValue(`x(${pointName})`)
    const pointY = ggbApi.getValue(`y(${pointName})`)
    const cornor1X = ggbApi.getValue('x(Corner(1))')
    const cornor1Y = ggbApi.getValue('y(Corner(1))')
    const cornor2X = ggbApi.getValue('x(Corner(2))')
    const cornor4Y = ggbApi.getValue('y(Corner(4))')
    const heightInPixel = ggbApi.getValue('y(Corner(5))')
    const widthInPixel = ggbApi.getValue('x(Corner(5))')
    return { pointX, cornor1X, cornor2X, widthInPixel, heightInPixel, pointY, cornor1Y, cornor4Y }
  }
  useEffect(() => {
    if (!ggbApi.current) return
    const { pointX, cornor1X, cornor2X, widthInPixel, heightInPixel, pointY, cornor1Y, cornor4Y } =
      locatePoint(ggbApi.current, pointName)
    setPosition({
      left: ((pointX - cornor1X) / (cornor2X - cornor1X)) * widthInPixel,
      top: heightInPixel - ((pointY - cornor1Y) / (cornor4Y - cornor1Y)) * heightInPixel,
    })
  }, [pointName, ggbApi.current])
  const listener = useCallback(() => {
    if (!ggbApi.current) return
    ggbApi.current.registerObjectUpdateListener(`${pointName}`, () => {
      if (!ggbApi.current) return
      const {
        pointX,
        cornor1X,
        cornor2X,
        widthInPixel,
        heightInPixel,
        pointY,
        cornor1Y,
        cornor4Y,
      } = locatePoint(ggbApi.current, pointName)
      setPosition({
        left: ((pointX - cornor1X) / (cornor2X - cornor1X)) * widthInPixel,
        top: heightInPixel - ((pointY - cornor1Y) / (cornor4Y - cornor1Y)) * heightInPixel,
      })
    })
  }, [ggbApi, pointName])
  if (activeTracking) listener()
  return { position }
}
function useValueTracking(
  objectName: string,
  api: GeogebraAppApi | null,
  activeTracking = true,
  initialValue = 0,
) {
  const [value, setValue] = useState<number>(initialValue)
  const ggbApi = useRef<GeogebraAppApi | null>(null)
  ggbApi.current = api
  useEffect(() => {
    if (!ggbApi.current) return
    setValue(ggbApi.current.getValue(`${objectName}`))
  }, [objectName, ggbApi.current])

  const listener = useCallback(() => {
    if (!ggbApi.current) return
    ggbApi.current.registerObjectUpdateListener(`${objectName}`, () => {
      if (!ggbApi.current) return
      setValue(ggbApi.current.getValue(`${objectName}`))
    })
  }, [ggbApi, objectName])
  if (activeTracking) listener()
  return { value }
}

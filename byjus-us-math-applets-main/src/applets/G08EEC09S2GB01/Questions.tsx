import styled from 'styled-components'

import { Math as Latex } from '@/common/Math'

import { IQuestion } from '../G08EEC09S2GB01/Applet'

let currentIndex = 1

export function fetchNextQuestion() {
  const keys = Object.keys(QuestionsList)
  if (currentIndex === keys.length) currentIndex = 0
  while (currentIndex < keys.length) {
    const currentKey = keys[currentIndex]
    const currentValue = QuestionsList[currentKey]

    currentIndex++

    return currentValue
  }
}

const questionZero: IQuestion = {
  id: 0,
  questionExp: <>y = -x + 1</>,
  intercept: 1,
  numerator: -1,
  denominator: 1,
  ggbID: 'mysxgr3v',
  wrongIntercept: (
    <>
      In, y = mx + b, <br />b is the y-intercept.
    </>
  ),
  wrongNumerator: (
    <>
      Slope can be thought of as
      <br /> the change in y if x changes by 1.
    </>
  ),
  wrongDenominator: (
    <>
      Slope can be thought of
      <br /> as the change in y if x changes by 1.
    </>
  ),
}

const questionOne: IQuestion = {
  id: 1,
  questionExp: <>y = -2x - 3</>,
  intercept: -3,
  numerator: -2,
  denominator: 1,
  ggbID: 'mysxgr3v',
  wrongIntercept: (
    <>
      In, y = mx + b, <br />b is the y-intercept.
    </>
  ),
  wrongNumerator: (
    <>
      Slope can be thought of as
      <br /> the change in y if x changes by 1.
    </>
  ),
  wrongDenominator: (
    <>
      Slope can be thought of
      <br /> as the change in y if x changes by 1.
    </>
  ),
}

const FontStyler = styled.div`
  font-size: 36;
  font-family: 'Nunito';
  font-weight: 700;
  line-height: 28px;
  scale: 1.5;
  padding: 10px 10px;
`

const divisionDiv = (numerator: string, denominator: string) => {
  return (
    <FontStyler>
      <Latex>{String.raw`\frac{${numerator}}{${denominator}}`}</Latex>
    </FontStyler>
  )
}

const questionTwo: IQuestion = {
  id: 2,
  questionExp: <>y = {divisionDiv('1', '5')}x + 2</>,
  intercept: 2,
  numerator: 1,
  denominator: 5,
  ggbID: 'mysxgr3v',
  wrongIntercept: (
    <>
      In, y = mx + b, <br />b is the y-intercept.
    </>
  ),
  wrongNumerator: (
    <>
      Slope can be thought of as
      <br /> the change in y if x changes by 1.
    </>
  ),
  wrongDenominator: (
    <>
      Slope can be thought of
      <br /> as the change in y if x changes by 1.
    </>
  ),
}

const questionThree: IQuestion = {
  id: 3,
  questionExp: <>y = -{divisionDiv('1', '5')}x + 3</>,
  intercept: 3,
  numerator: -1,
  denominator: 2,
  ggbID: 'mysxgr3v',
  wrongIntercept: (
    <>
      In, y = mx + b, <br />b is the y-intercept.
    </>
  ),
  wrongNumerator: (
    <>
      Slope can be thought of as
      <br /> the change in y if x changes by 1.
    </>
  ),
  wrongDenominator: (
    <>
      Slope can be thought of
      <br /> as the change in y if x changes by 1.
    </>
  ),
}

export const QuestionsList: Record<string, IQuestion> = {
  zero: questionZero,
  one: questionOne,
  two: questionTwo,
  three: questionThree,
}

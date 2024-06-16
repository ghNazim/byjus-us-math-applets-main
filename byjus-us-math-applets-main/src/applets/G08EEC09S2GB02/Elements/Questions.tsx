import { IQuestionPointSlope } from '../Applet'

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

const questionZero: IQuestionPointSlope = {
  id: 0,
  slope: { numerator: 2, denominator: 1 },
  pointVal: { a: 0, b: 2 },
  ggbID: 'wrt3e2xw',
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

const questionOne: IQuestionPointSlope = {
  id: 1,
  pointVal: { a: 1, b: 2 },
  slope: { numerator: 1, denominator: 3 },
  ggbID: 'fxgxx9b2',
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

const questionTwo: IQuestionPointSlope = {
  id: 2,
  slope: { numerator: -2, denominator: 1 },
  pointVal: { a: 0, b: 3 },
  ggbID: 'xup9gevr',
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

const questionThree: IQuestionPointSlope = {
  id: 3,
  slope: { numerator: -1, denominator: 4 },
  pointVal: { a: -2, b: 2 },
  ggbID: 'x8wm7ang',
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

export const QuestionsList: Record<string, IQuestionPointSlope> = {
  zero: questionZero,
  one: questionOne,
  two: questionTwo,
  three: questionThree,
}

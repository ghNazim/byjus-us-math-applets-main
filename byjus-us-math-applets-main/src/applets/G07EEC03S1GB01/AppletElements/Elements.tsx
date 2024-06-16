import { Children, ReactNode } from 'react'
import styled from 'styled-components'

import { Header } from '../TemplateElements/Header'
import {
  IParameters,
  IQuestionModular as IQuestion,
  ISliderExpressions,
} from '../TemplateElements/WeighingScale/WeighingScale.context'

/*--------------Template Component------------*/

const ComponentsHolder = styled.div`
  width: 100%;
  height: 100%;
  /* background-color: wheat; */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 20px;
  padding: 0px 32px 32px;
`

const VisualArea = styled.div`
  border-radius: 10px;
  /* background-color: tan; */
  display: flex;
  align-items: center;
  justify-content: center;
`

interface DividedTemplate {
  children: any
  callOutText: ReactNode
}

export function DividedTemplate({ children, callOutText }: DividedTemplate) {
  const arrayChildren = Children.toArray(children)
  return (
    <ComponentsHolder className="components-holder">
      <Header backgroundColor="#FAF2FF" buttonColor="#EACCFF">
        <div
          style={{
            color: '#444',
            fontFamily: 'Nunito',
            fontSize: '20px',
            textAlign: 'center',
            fontWeight: 600,
          }}
        >
          {callOutText}
        </div>
      </Header>
      {Children.map(arrayChildren, (child) => {
        return <VisualArea>{child}</VisualArea>
      })}
    </ComponentsHolder>
  )
}

/*--------------------Questions------------------*/

// 2x + 4 = 10 ------- x = 3
const questionOne: IQuestion = {
  question: '2x + 4 = 10',
  targetParameters: {
    leftCoefficient: 2,
    leftConstant: 4,
    rightCoefficient: 0,
    rightConstant: 10,
  },
  evalFn: (Parameters: IParameters) => {
    const lhsVal = 3 * Parameters.leftCoefficient + Parameters.leftConstant
    const rhsVal = Parameters.rightConstant + 3 * Parameters.rightCoefficient
    // console.log('lhs: ', lhsVal, 'rhs: ', rhsVal)
    if (lhsVal === rhsVal) {
      {
        return {
          calcVals: { lhs: lhsVal, rhs: rhsVal },
          calcExpression: getExpression(Parameters),
          answer: true,
          parseText: 'true',
        }
      }
    } else {
      return {
        calcVals: { lhs: lhsVal, rhs: rhsVal },
        calcExpression: getExpression(Parameters),
        answer: false,
        parseText: 'false',
      }
    }
  },
  static: 'right',
  comparisonType: 'inequal',
  scalePrecision: 10,
  minMaxValues: { lhs: 5, rhs: 14 },
}

/*-----------------Question List-----------------*/

export const QuestionsList: Record<string, IQuestion> = {
  one: questionOne,
}

let currentIndex = 1

function getExpression(Parameters: IParameters): ISliderExpressions | undefined {
  return {
    lhs:
      Parameters.leftCoefficient !== 0
        ? `${
            Parameters.leftCoefficient == 1
              ? `x`
              : Parameters.leftCoefficient == -1
              ? `-x`
              : `${Parameters.leftCoefficient}x`
          } ${
            Parameters.leftConstant > 0
              ? `+ ${Parameters.leftConstant.toFixed()}`
              : Parameters.leftConstant < 0
              ? `- ${Math.abs(Parameters.leftConstant)}`
              : ''
          }`
        : Parameters.leftConstant.toFixed(),
    rhs: Parameters.rightConstant.toFixed(),
  }
}

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

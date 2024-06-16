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

const QuestionContainer = styled.div`
  width: 100%;
  height: 80%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 50px;
`

const QuestionHolder = styled.div`
  width: 271px;
  height: 67px;
  background: #faf2ff;
  border: 1px solid #aa5ee0;
  display: flex;
  justify-content: center;
  align-items: center;

  font-family: 'Nunito';
  font-style: normal;
  font-weight: 400;
  font-size: 28px;
  line-height: 40px;

  cursor: pointer;
`

interface DividedTemplate {
  children: any
  callOutText: ReactNode
  introScreen: boolean
  onQnClick: (i: number) => void
}

export function DividedTemplate({
  children,
  callOutText,
  introScreen,
  onQnClick,
}: DividedTemplate) {
  const arrayChildren = Children.toArray(children)
  return (
    <ComponentsHolder className="components-holder">
      <Header backgroundColor="#f6f6f6" buttonColor="#1a1a1a">
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
      {introScreen ? (
        <QuestionContainer>
          <QuestionHolder onClick={() => onQnClick(0)}>2x + 4 = 10</QuestionHolder>
          <QuestionHolder onClick={() => onQnClick(1)}>3x + 5 = 20 </QuestionHolder>
          <QuestionHolder onClick={() => onQnClick(2)}>2x + (-4) = 6 </QuestionHolder>
        </QuestionContainer>
      ) : (
        Children.map(arrayChildren, (child) => {
          return <VisualArea>{child}</VisualArea>
        })
      )}
    </ComponentsHolder>
  )
}

/*--------------------Questions------------------*/

// x + 3 = 7 ------- x = 3
const questionZero: IQuestion = {
  question: 'x + 3 = 7',
  targetParameters: {
    leftCoefficient: 1,
    leftConstant: 3,
    rightCoefficient: 0,
    rightConstant: 7,
  },
  evalFn: (Parameters: IParameters) => {
    const lhsVal = 4 * Parameters.leftCoefficient + Parameters.leftConstant
    const rhsVal = Parameters.rightConstant + 4 * Parameters.rightCoefficient
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

// 3x + 5 = 20 ------- x = 3
const questionTwo: IQuestion = {
  question: '3x + 5 = 20',
  targetParameters: {
    leftCoefficient: 3,
    leftConstant: 5,
    rightCoefficient: 0,
    rightConstant: 20,
  },
  evalFn: (Parameters: IParameters) => {
    const lhsVal = 5 * Parameters.leftCoefficient + Parameters.leftConstant
    const rhsVal = Parameters.rightConstant + 5 * Parameters.rightCoefficient
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

// 2x + (-4) = 6 ------- x = 3
const questionThree: IQuestion = {
  question: '2x + (-4) = 6',
  targetParameters: {
    leftCoefficient: 2,
    leftConstant: -4,
    rightCoefficient: 0,
    rightConstant: 6,
  },
  evalFn: (Parameters: IParameters) => {
    const lhsVal = 5 * Parameters.leftCoefficient + Parameters.leftConstant
    const rhsVal = Parameters.rightConstant + 5 * Parameters.rightCoefficient
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
  scalePrecision: 3,
  minMaxValues: { lhs: 5, rhs: 14 },
}

/*-----------------Question List-----------------*/

export const QuestionsList: Record<string, IQuestion> = {
  one: questionZero,
  // one: questionOne,
  // two: questionTwo,
  // three: questionThree,
}

let currentIndex = 1

function getExpression(Parameters: IParameters): ISliderExpressions | undefined {
  return {
    lhs:
      Parameters.leftCoefficient !== 0
        ? `${Parameters.leftCoefficient === 1 ? '' : Parameters.leftCoefficient}x ${
            Parameters.leftConstant > 0
              ? `+ ${Parameters.leftConstant.toFixed()}`
              : Parameters.leftConstant < 0
              ? `+ (${Parameters.leftConstant.toFixed()})`
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

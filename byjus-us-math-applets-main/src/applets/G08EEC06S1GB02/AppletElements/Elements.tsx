import { Player } from '@lottiefiles/react-lottie-player'
import { Children, ReactNode, useState } from 'react'
import styled from 'styled-components'

import mouseClick from '../../../common/handAnimations/click.json'
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
  width: 604px;
  /* height: 67px; */
  /* background: #faf2ff; */
  border: 1px solid #aa5ee0;
  display: flex;
  justify-content: center;
  align-items: center;

  font-family: 'Nunito';
  font-style: normal;
  font-weight: 400;
  font-size: 20px;
  line-height: 28px;
  text-align: center;
  padding: 10px;
  color: #646464;

  border: 1px solid #c882fa;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1);
  border-radius: 10px;

  cursor: pointer;

  :hover {
    background: #f1edff;
  }
`

interface DividedTemplate {
  children: any
  callOutText: ReactNode
  introScreen: boolean
  onQnClick: (i: number) => void
}

const PlacedPlayer = styled(Player)<{ top: number; left: number }>`
  position: absolute;
  top: ${(props) => props.top}px;
  left: ${(props) => props.left}px;
  pointer-events: none;
`

export function DividedTemplate({
  children,
  callOutText,
  introScreen,
  onQnClick,
}: DividedTemplate) {
  const [hidePointer, setHidePointer] = useState(false)
  const arrayChildren = Children.toArray(children)
  return (
    <ComponentsHolder className="components-holder">
      <Header backgroundColor="#E7FBFF" buttonColor="#D1F7FF">
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
      {!hidePointer ? <PlacedPlayer src={mouseClick} top={360} left={280} autoplay loop /> : null}
      {introScreen ? (
        <QuestionContainer>
          <QuestionHolder
            onClick={() => {
              setHidePointer(true)
              onQnClick(0)
            }}
          >
            3x + 6 = 18
          </QuestionHolder>
          <QuestionHolder
            onClick={() => {
              setHidePointer(true)
              onQnClick(1)
            }}
          >
            2x - 4 = x + 5
          </QuestionHolder>
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
  question: '3x + 6 = 18',
  targetParameters: {
    leftCoefficient: 3,
    leftConstant: 6,
    rightCoefficient: 0,
    rightConstant: 18,
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
  scalePrecision: 20,
  minMaxValues: { lhs: 6, rhs: 33 },
}

// 2x + 4 = 10 ------- x = 3
const questionOne: IQuestion = {
  question: '4x + 4 = 20',
  targetParameters: {
    leftCoefficient: 4,
    leftConstant: 4,
    rightCoefficient: 0,
    rightConstant: 20,
  },
  evalFn: (Parameters: IParameters) => {
    const lhsVal = 4 * Parameters.leftCoefficient + Parameters.leftConstant
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
  minMaxValues: { lhs: 2, rhs: 20 },
}

// 3x + 5 = 20 ------- x = 3
const questionTwo: IQuestion = {
  question: '2x - 4 = x + 5',
  targetParameters: {
    leftCoefficient: 2,
    leftConstant: -4,
    rightCoefficient: 1,
    rightConstant: 5,
  },
  evalFn: (Parameters: IParameters) => {
    const lhsVal = 9 * Parameters.leftCoefficient - Parameters.leftConstant
    const rhsVal = Parameters.rightConstant + 9 * Parameters.rightCoefficient
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
  static: 'neither',
  comparisonType: 'inequal',
  scalePrecision: 10,
  minMaxValues: { lhs: -4, rhs: 14 },
}

// 2x + (-4) = 6 ------- x = 3
const questionThree: IQuestion = {
  question: '2x + 8 = 18',
  targetParameters: {
    leftCoefficient: 2,
    leftConstant: 8,
    rightCoefficient: 0,
    rightConstant: 18,
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
  minMaxValues: { lhs: 2, rhs: 20 },
}

/*-----------------Question List-----------------*/

export const QuestionsList: Record<string, IQuestion> = {
  zero: questionZero,
  one: questionTwo,
  // two: questionTwo,
  // three: questionThree,
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
    rhs:
      Parameters.rightCoefficient !== 0
        ? `${
            Parameters.rightCoefficient == 1
              ? `x`
              : Parameters.rightCoefficient == -1
              ? `-x`
              : `${Parameters.rightCoefficient}x`
          } ${
            Parameters.rightConstant > 0
              ? `+ ${Parameters.rightConstant.toFixed()}`
              : Parameters.rightConstant < 0
              ? `- ${Math.abs(Parameters.rightConstant)}`
              : ''
          }`
        : Parameters.rightConstant.toFixed(),
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

import { Player } from '@lottiefiles/react-lottie-player'
import { Children, ReactNode, useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'

import handClick from '../../../common/handAnimations/click.json'
import { Header } from '../TemplateElements/Header'
import {
  IParameters,
  IQuestionModular as IQuestion,
  ISliderExpressions,
} from '../TemplateElements/WeighingScale/WeighingScale.context'
import { FormingEquations } from './FormingEquations'

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

const QuestionContainer = styled.div<{ top: number }>`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: ${(props) => props.top}px;
`

const QuestionHolder = styled.div`
  width: 604px;
  min-height: 67px;
  border: 1px solid #c882fa;
  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px 30px;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 400;
  font-size: 20px;
  line-height: 28px;
  text-align: center;
  cursor: pointer;
  margin-bottom: 60px;
  :hover {
    background: #f1edff;
  }
`
const ClickPlayer = styled(Player)`
  position: absolute;
  top: 130px;
  right: 200px;
  pointer-events: none;
`

interface DividedTemplate {
  children: any
  callOutText: ReactNode
  introScreen: boolean
  onQnClick: (i: number) => void
  onNextEnable: (value: boolean) => void
  introOptions: boolean
}

export function DividedTemplate({
  children,
  callOutText,
  introScreen,
  onQnClick,
  onNextEnable,
  introOptions,
}: DividedTemplate) {
  const arrayChildren = Children.toArray(children)
  const [showOptions, setShowOptions] = useState(true)
  const [questionNum, setQuestionNum] = useState(0)
  const onNextEnableHandle = useCallback((value: boolean) => {
    onNextEnable(value)
  }, [])
  useEffect(() => {
    if (introOptions) {
      setShowOptions(true)
    }
  }, [introOptions])
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
      {introScreen ? (
        showOptions ? (
          <>
            <QuestionContainer top={60}>
              <QuestionHolder
                onClick={() => {
                  onQnClick(0)
                  setShowOptions(false)
                  setQuestionNum(0)
                }}
              >
                Two times the sum of two consecutive numbers is 18. Find the smaller number.
              </QuestionHolder>
              <QuestionHolder
                onClick={() => {
                  onQnClick(1)
                  setShowOptions(false)
                  setQuestionNum(1)
                }}
              >
                Two times the sum of two consecutive even numbers is 20. Find the greater even
                number.
              </QuestionHolder>
              <QuestionHolder
                onClick={() => {
                  onQnClick(2)
                  setShowOptions(false)
                  setQuestionNum(2)
                }}
              >
                Two times the perimeter of a triangle measures 10 cm. If the length of two of its
                sides is 1 cm and 2 cm, find the length of third side.
              </QuestionHolder>
              <QuestionHolder
                onClick={() => {
                  onQnClick(3)
                  setShowOptions(false)
                  setQuestionNum(3)
                }}
              >
                The perimeter of a rectangle measures 18 in. If the length of the rectangle is 4 in,
                find its width.
              </QuestionHolder>
            </QuestionContainer>
            <ClickPlayer src={handClick} autoplay loop />
          </>
        ) : (
          <>
            <QuestionContainer top={20}>
              <FormingEquations questionNumber={questionNum} onNextEnable={onNextEnableHandle} />
            </QuestionContainer>
          </>
        )
      ) : (
        Children.map(arrayChildren, (child, i) => {
          return i < arrayChildren.length - 2 && <VisualArea>{child}</VisualArea>
        })
      )}
      <VisualArea>{arrayChildren[arrayChildren.length - 2]}</VisualArea>
      <VisualArea>{arrayChildren[arrayChildren.length - 1]}</VisualArea>
    </ComponentsHolder>
  )
}

/*--------------------Questions------------------*/

// 4x + 2 = 18 ------- x = 4
const questionOne: IQuestion = {
  question: '4x + 2 = 18',
  targetParameters: {
    leftCoefficient: 4,
    leftConstant: 2,
    rightCoefficient: 0,
    rightConstant: 18,
  },
  evalFn: (Parameters: IParameters) => {
    const lhsVal = 4 * Parameters.leftCoefficient + Parameters.leftConstant
    const rhsVal = Parameters.rightConstant
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

// 4x + 4 = 20 ------- x = 4
const questionTwo: IQuestion = {
  question: '4x + 4 = 20',
  targetParameters: {
    leftCoefficient: 4,
    leftConstant: 4,
    rightCoefficient: 0,
    rightConstant: 20,
  },
  evalFn: (Parameters: IParameters) => {
    const lhsVal = 4 * Parameters.leftCoefficient + Parameters.leftConstant
    const rhsVal = Parameters.rightConstant
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

// 2x + 6 = 10 ------- x = 2
const questionThree: IQuestion = {
  question: '2x + 6 = 10',
  targetParameters: {
    leftCoefficient: 2,
    leftConstant: 6,
    rightCoefficient: 0,
    rightConstant: 10,
  },
  evalFn: (Parameters: IParameters) => {
    const lhsVal = 2 * Parameters.leftCoefficient + Parameters.leftConstant
    const rhsVal = Parameters.rightConstant
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

// 2x + 8 = 18 ------- x = 5
const questionFour: IQuestion = {
  question: '2x + 8 = 18',
  targetParameters: {
    leftCoefficient: 2,
    leftConstant: 8,
    rightCoefficient: 0,
    rightConstant: 18,
  },
  evalFn: (Parameters: IParameters) => {
    const lhsVal = 5 * Parameters.leftCoefficient + Parameters.leftConstant
    const rhsVal = Parameters.rightConstant
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
  // one: questionZero,
  one: questionOne,
  two: questionTwo,
  three: questionThree,
  four: questionFour,
}

let currentIndex = 1

function getExpression(Parameters: IParameters): ISliderExpressions | undefined {
  return {
    lhs:
      Parameters.leftCoefficient !== 0
        ? Parameters.leftCoefficient == 1
          ? `x`
          : Parameters.leftCoefficient == -1
          ? `-x`
          : `${Parameters.leftCoefficient}x` +
            `${
              Parameters.leftConstant > 0
                ? ` + ${Parameters.leftConstant.toFixed()}`
                : Parameters.leftConstant < 0
                ? ` - ${Math.abs(Parameters.leftConstant)}`
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

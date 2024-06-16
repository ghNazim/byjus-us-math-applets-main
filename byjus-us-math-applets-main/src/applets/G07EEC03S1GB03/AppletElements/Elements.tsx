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
                The sum of two times a number and 4 is 12. Find the number.
              </QuestionHolder>
              <QuestionHolder
                onClick={() => {
                  onQnClick(1)
                  setShowOptions(false)
                  setQuestionNum(1)
                }}
              >
                2 when subtracted from three times a number gives 16. Find the number.
              </QuestionHolder>
              <QuestionHolder
                onClick={() => {
                  onQnClick(2)
                  setShowOptions(false)
                  setQuestionNum(2)
                }}
              >
                If $10 more than twice the cost of a pizza is $20, then find the cost of a pizza.
              </QuestionHolder>
              <QuestionHolder
                onClick={() => {
                  onQnClick(3)
                  setShowOptions(false)
                  setQuestionNum(3)
                }}
              >
                The cost of a pencil is $3. Four times the cost of a pencil and twice the cost of an
                eraser is $18. Find the cost of an eraser.
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

// 2x + 4 = 12 ------- x = 4
const questionOne: IQuestion = {
  question: '2x + 4 = 12',
  targetParameters: {
    leftCoefficient: 2,
    leftConstant: 4,
    rightCoefficient: 0,
    rightConstant: 12,
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

// 3x - 2 = 16 ------- x = 6
const questionTwo: IQuestion = {
  question: '3x - 8 = 16',
  targetParameters: {
    leftCoefficient: 3,
    leftConstant: -2,
    rightCoefficient: 0,
    rightConstant: 16,
  },
  evalFn: (Parameters: IParameters) => {
    const lhsVal = 6 * Parameters.leftCoefficient + Parameters.leftConstant
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

// 10 + 2x = 20 ------- x = 5
const questionThree: IQuestion = {
  question: '2x + 6 = 10',
  targetParameters: {
    leftCoefficient: 2,
    leftConstant: 10,
    rightCoefficient: 0,
    rightConstant: 20,
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

// 12 + 2x = 18 ------- x = 3
const questionFour: IQuestion = {
  question: '12 + 2x = 18',
  targetParameters: {
    leftCoefficient: 2,
    leftConstant: 12,
    rightCoefficient: 0,
    rightConstant: 18,
  },
  evalFn: (Parameters: IParameters) => {
    const lhsVal = 3 * Parameters.leftCoefficient + Parameters.leftConstant
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

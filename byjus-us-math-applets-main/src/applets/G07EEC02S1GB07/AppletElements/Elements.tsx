import React, { Children, FC, ReactNode, useRef } from 'react'
import styled from 'styled-components'

import { Math as Latex } from '@/common/Math'
import {
  blueColorBlock,
  IQuestion,
  ISliderValues,
  orangeColorBlock,
  useQuestion,
} from '@/common/WeighingScale/WeighingScale.context'

import { Button } from '../TemplateElements/Button'
import { Header } from '../TemplateElements/Header'

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

const ButtonHolder = styled.div`
  width: 100%;
  height: 60px;
  display: flex;
  justify-content: center;
  align-content: center;
`

interface DividedTemplate {
  children: any
  callOutText: ReactNode
  onClick: () => void
  tryNew: boolean
}

export function DividedTemplate({ children, callOutText, tryNew, onClick }: DividedTemplate) {
  const arrayChildren = Children.toArray(children)
  const { currentCalculation } = useQuestion()

  return (
    <ComponentsHolder className="components-holder">
      <Header backgroundColor="#F1EDFF" buttonColor="#D9CDFF">
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
      <ButtonHolder className="button-holder">
        {currentCalculation.answer ? (
          <Button onClick={onClick} type={tryNew ? 'tryNew' : 'check'} />
        ) : null}
      </ButtonHolder>
    </ComponentsHolder>
  )
}

/*-------------------Top Comp-----------------*/

const ComponentHolder = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  color: black;
  font-size: 24px;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  line-height: 28px;
`

const TextHolder = styled.div<{ width: number; backgroundColor: string; fontColor: string }>`
  border: 0px solid red;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => props.backgroundColor};
  color: ${(props) => props.fontColor};
  padding: 10px 10px;

  text-align: center;
`

export const Question = () => {
  const leftHolderRef = useRef<HTMLDivElement>(null)
  const rightHolderRef = useRef<HTMLDivElement>(null)
  const { question } = useQuestion()

  return (
    <ComponentHolder>
      Equation:
      <TextHolder
        width={
          leftHolderRef.current ? leftHolderRef.current.getBoundingClientRect().width + 40 : 80
        }
        backgroundColor="#d1f7ff"
        fontColor="#1CB9D9"
      >
        <div ref={leftHolderRef}>{question.lhs}</div>
      </TextHolder>
      <span>{question.sign}</span>
      <TextHolder
        width={
          rightHolderRef.current ? rightHolderRef.current.getBoundingClientRect().width + 40 : 80
        }
        backgroundColor="#FFE9D4"
        fontColor="#D97A1A"
      >
        <div ref={rightHolderRef}>{question.rhs}</div>
      </TextHolder>
    </ComponentHolder>
  )
}

/*End---------------Top Comp--------------End*/

/*--------------------Questions------------------*/

const falseText = (
  <>
    The scale is&nbsp; <span style={{ color: '#CC6666' }}> not balanced.</span>
  </>
)

const trueText = (variable: string, answer: number) => {
  return (
    <div>
      The scale is &nbsp;
      <span style={{ color: '#32A66C' }}>balanced</span>. <br />
      Value of {variable} is {answer}.
    </div>
  )
}

const questionOne: IQuestion = {
  variable: 'x',
  evalFn: (SliderValues: ISliderValues) => {
    const lhsVal = SliderValues.lhs + 5
    const rhsVal = 9
    if (lhsVal === rhsVal) {
      {
        return {
          calcVals: { lhs: lhsVal, rhs: rhsVal },
          answer: true,
          parseText: trueText('x', 4),
        }
      }
    } else {
      return {
        calcVals: { lhs: lhsVal, rhs: rhsVal },
        answer: false,
        parseText: falseText,
      }
    }
  },
  lhs: 'x + 5',
  leftColorBlock: blueColorBlock,
  sign: '=',
  rhs: '9',
  rightColorBlock: orangeColorBlock,
  static: 'right',
  comparisonType: 'inequal',
  scalePrecision: 100,
  sliderValues: { lhs: 0, rhs: 9 },
  minMaxValues: { lhs: 5, rhs: 14 },
  sliderDefaultPosition: 0,
  signColorFalse: { bgColor: '#FFF2F2', borderColor: '#CC6666' },
  signColorTrue: { bgColor: '#E5FFEC', borderColor: '#32A66C' },
}

const questionTwo: IQuestion = {
  variable: 'a',
  evalFn: (SliderValues: ISliderValues) => {
    const lhsVal = SliderValues.lhs + 3
    const rhsVal = 10
    if (lhsVal === rhsVal) {
      {
        return {
          calcVals: { lhs: lhsVal, rhs: rhsVal },
          answer: true,
          parseText: trueText('a', 7),
        }
      }
    } else {
      return {
        calcVals: { lhs: lhsVal, rhs: rhsVal },
        answer: false,
        parseText: falseText,
      }
    }
  },
  lhs: 'a + 3',
  leftColorBlock: blueColorBlock,
  sign: '=',
  rhs: '10',
  rightColorBlock: orangeColorBlock,
  static: 'right',
  comparisonType: 'inequal',
  scalePrecision: 10,
  sliderValues: { lhs: 0, rhs: 9 },
  minMaxValues: { lhs: 3, rhs: 12 },
  sliderDefaultPosition: 0,
  signColorFalse: { bgColor: '#FFF2F2', borderColor: '#CC6666' },
  signColorTrue: { bgColor: '#E5FFEC', borderColor: '#32A66C' },
}

const questionThree: IQuestion = {
  variable: 'b',
  evalFn: (SliderValues: ISliderValues) => {
    const lhsVal = 2
    const rhsVal = 8 - SliderValues.lhs
    if (lhsVal === rhsVal) {
      {
        return {
          calcVals: { lhs: lhsVal, rhs: rhsVal },
          answer: true,
          parseText: trueText('b', 6),
        }
      }
    } else {
      return {
        calcVals: { lhs: lhsVal, rhs: rhsVal },
        answer: false,
        parseText: falseText,
      }
    }
  },
  lhs: '2',
  leftColorBlock: blueColorBlock,
  sign: '=',
  rhs: '8 - b',
  rightColorBlock: orangeColorBlock,
  static: 'left',
  comparisonType: 'inequal',
  scalePrecision: 10,
  sliderValues: { lhs: 0, rhs: 9 },
  minMaxValues: { lhs: -1, rhs: 8 },
  sliderDefaultPosition: 0,
  signColorFalse: { bgColor: '#FFF2F2', borderColor: '#CC6666' },
  signColorTrue: { bgColor: '#E5FFEC', borderColor: '#32A66C' },
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

export const questionFour: IQuestion = {
  variable: 'a',
  evalFn: (SliderValues: ISliderValues) => {
    const lhsVal = SliderValues.lhs / 2
    const rhsVal = 3
    if (lhsVal === rhsVal) {
      {
        return {
          calcVals: { lhs: lhsVal, rhs: rhsVal },
          answer: true,
          parseText: trueText('a', 6),
        }
      }
    } else {
      return {
        calcVals: { lhs: lhsVal, rhs: rhsVal },
        answer: false,
        parseText: falseText,
      }
    }
  },
  lhs: divisionDiv('a', '2'),
  leftColorBlock: blueColorBlock,
  sign: '=',
  rhs: '3',
  rightColorBlock: orangeColorBlock,
  static: 'right',
  comparisonType: 'inequal',
  scalePrecision: 100,
  sliderValues: { lhs: 0, rhs: 9 },
  minMaxValues: { lhs: 0, rhs: 4.5 },
  sliderDefaultPosition: 0,
  signColorFalse: { bgColor: '#FFF2F2', borderColor: '#CC6666' },
  signColorTrue: { bgColor: '#E5FFEC', borderColor: '#32A66C' },
}

const questionFive: IQuestion = {
  variable: 'x',
  evalFn: (SliderValues: ISliderValues) => {
    const lhsVal = SliderValues.lhs * 4
    const rhsVal = 24
    if (lhsVal === rhsVal) {
      {
        return {
          calcVals: { lhs: lhsVal, rhs: rhsVal },
          answer: true,
          parseText: trueText('x', 6),
        }
      }
    } else {
      return {
        calcVals: { lhs: lhsVal, rhs: rhsVal },
        answer: false,
        parseText: falseText,
      }
    }
  },
  lhs: '4x',
  leftColorBlock: blueColorBlock,
  sign: '=',
  rhs: '24',
  rightColorBlock: orangeColorBlock,
  static: 'left',
  comparisonType: 'inequal',
  scalePrecision: 10,
  sliderValues: { lhs: 0, rhs: 9 },
  minMaxValues: { lhs: 0, rhs: 36 },
  sliderDefaultPosition: 0,
  signColorFalse: { bgColor: '#FFF2F2', borderColor: '#CC6666' },
  signColorTrue: { bgColor: '#E5FFEC', borderColor: '#32A66C' },
}

const questionSix: IQuestion = {
  variable: 'b',
  evalFn: (SliderValues: ISliderValues) => {
    const lhsVal = 2
    const rhsVal = 8 - SliderValues.lhs
    if (lhsVal === rhsVal) {
      {
        return {
          calcVals: { lhs: lhsVal, rhs: rhsVal },
          answer: true,
          parseText: trueText('b', 6),
        }
      }
    } else {
      return {
        calcVals: { lhs: lhsVal, rhs: rhsVal },
        answer: false,
        parseText: falseText,
      }
    }
  },
  lhs: '2',
  leftColorBlock: blueColorBlock,
  sign: '=',
  rhs: '8 - b',
  rightColorBlock: orangeColorBlock,
  static: 'left',
  comparisonType: 'inequal',
  scalePrecision: 10,
  sliderValues: { lhs: 0, rhs: 9 },
  minMaxValues: { lhs: -1, rhs: 8 },
  sliderDefaultPosition: 0,
  signColorFalse: { bgColor: '#FFF2F2', borderColor: '#CC6666' },
  signColorTrue: { bgColor: '#E5FFEC', borderColor: '#32A66C' },
}

/* -------------- lt-gt -------------*/

const falseTextIneq = <>The inequality is not satisfied.</>

const trueTextIneq = (variable: string, answer: number, sign: JSX.Element) => {
  return (
    <div>
      For &nbsp;
      <span style={{ color: '#1CB9D9' }}>{variable}</span>&nbsp;{sign}&nbsp;{answer},&nbsp;the
      inequality is satisfied.
    </div>
  )
}

// const questionSeven: IQuestion = {
//   variable: 'x',
//   evalFn: (SliderValues: ISliderValues) => {
//     const lhsVal = SliderValues.lhs + 5
//     const rhsVal = 9
//     if (lhsVal > rhsVal) {
//       {
//         return {
//           calcVals: { lhs: lhsVal, rhs: rhsVal },
//           answer: true,
//           parseText: trueTextIneq('x', 5, <Latex>{String.raw`\geq`}</Latex>),
//         }
//       }
//     } else {
//       return {
//         calcVals: { lhs: lhsVal, rhs: rhsVal },
//         answer: false,
//         parseText: falseTextIneq,
//       }
//     }
//   },
//   lhs: 'x + 5',
//   leftColorBlock: blueColorBlock,
//   sign: '>',
//   rhs: '9',
//   rightColorBlock: orangeColorBlock,
//   static: 'right',
//   comparisonType: 'lt-gt',
//   scalePrecision: 100,
//   sliderValues: { lhs: 0, rhs: 9 },
//   minMaxValues: { lhs: 5, rhs: 14 },
//   sliderDefaultPosition: 0,
//   signColorFalse: { bgColor: '#FFF2F2', borderColor: '#CC6666' },
//   signColorTrue: { bgColor: '#E5FFEC', borderColor: '#32A66C' },
// }

// const questionEight: IQuestion = {
//   variable: 'a',
//   evalFn: (SliderValues: ISliderValues) => {
//     const lhsVal = SliderValues.lhs + 3
//     const rhsVal = 10
//     if (lhsVal > rhsVal) {
//       {
//         return {
//           calcVals: { lhs: lhsVal, rhs: rhsVal },
//           answer: true,
//           parseText: trueTextIneq('a', 8, <Latex>{String.raw`\geq`}</Latex>),
//         }
//       }
//     } else {
//       return {
//         calcVals: { lhs: lhsVal, rhs: rhsVal },
//         answer: false,
//         parseText: falseTextIneq,
//       }
//     }
//   },
//   lhs: 'a + 3',
//   leftColorBlock: blueColorBlock,
//   sign: '>',
//   rhs: '10',
//   rightColorBlock: orangeColorBlock,
//   static: 'right',
//   comparisonType: 'lt-gt',
//   scalePrecision: 100,
//   sliderValues: { lhs: 0, rhs: 9 },
//   minMaxValues: { lhs: 3, rhs: 12 },
//   sliderDefaultPosition: 0,
//   signColorFalse: { bgColor: '#FFF2F2', borderColor: '#CC6666' },
//   signColorTrue: { bgColor: '#E5FFEC', borderColor: '#32A66C' },
// }

// const questionNine: IQuestion = {
//   variable: 'a',
//   evalFn: (SliderValues: ISliderValues) => {
//     const lhsVal = SliderValues.lhs + 4
//     const rhsVal = 7
//     if (lhsVal < rhsVal) {
//       {
//         return {
//           calcVals: { lhs: lhsVal, rhs: rhsVal },
//           answer: true,
//           parseText: trueTextIneq('a', 2, <Latex>{String.raw`\leq`}</Latex>),
//         }
//       }
//     } else {
//       return {
//         calcVals: { lhs: lhsVal, rhs: rhsVal },
//         answer: false,
//         parseText: falseTextIneq,
//       }
//     }
//   },
//   lhs: 'a + 4',
//   leftColorBlock: blueColorBlock,
//   sign: '<',
//   rhs: '7',
//   rightColorBlock: orangeColorBlock,
//   static: 'right',
//   comparisonType: 'lt-gt',
//   scalePrecision: 100,
//   sliderValues: { lhs: 0, rhs: 9 },
//   minMaxValues: { lhs: 4, rhs: 13 },
//   sliderDefaultPosition: 5,
//   signColorFalse: { bgColor: '#FFF2F2', borderColor: '#CC6666' },
//   signColorTrue: { bgColor: '#E5FFEC', borderColor: '#32A66C' },
// }

// const questionTen: IQuestion = {
//   variable: 'x',
//   evalFn: (SliderValues: ISliderValues) => {
//     const lhsVal = SliderValues.lhs + 3
//     const rhsVal = 10
//     if (lhsVal > rhsVal) {
//       {
//         return {
//           calcVals: { lhs: lhsVal, rhs: rhsVal },
//           answer: true,
//           parseText: trueTextIneq('x', 8, <Latex>{String.raw`\geq`}</Latex>),
//         }
//       }
//     } else {
//       return {
//         calcVals: { lhs: lhsVal, rhs: rhsVal },
//         answer: false,
//         parseText: falseTextIneq,
//       }
//     }
//   },
//   lhs: 'x + 3',
//   leftColorBlock: blueColorBlock,
//   sign: '>',
//   rhs: '10',
//   rightColorBlock: orangeColorBlock,
//   static: 'right',
//   comparisonType: 'lt-gt',
//   scalePrecision: 100,
//   sliderValues: { lhs: 0, rhs: 9 },
//   minMaxValues: { lhs: 3, rhs: 12 },
//   sliderDefaultPosition: 0,
//   signColorFalse: { bgColor: '#FFF2F2', borderColor: '#CC6666' },
//   signColorTrue: { bgColor: '#E5FFEC', borderColor: '#32A66C' },
// }

// const questionEleven: IQuestion = {
//   variable: 'y',
//   evalFn: (SliderValues: ISliderValues) => {
//     const lhsVal = SliderValues.lhs - 2
//     const rhsVal = 5
//     if (lhsVal < rhsVal) {
//       {
//         return {
//           calcVals: { lhs: lhsVal, rhs: rhsVal },
//           answer: true,
//           parseText: trueTextIneq('x', 6, <Latex>{String.raw`\leq`}</Latex>),
//         }
//       }
//     } else {
//       return {
//         calcVals: { lhs: lhsVal, rhs: rhsVal },
//         answer: false,
//         parseText: falseTextIneq,
//       }
//     }
//   },
//   lhs: 'y - 2',
//   leftColorBlock: blueColorBlock,
//   sign: '<',
//   rhs: '5',
//   rightColorBlock: orangeColorBlock,
//   static: 'right',
//   comparisonType: 'lt-gt',
//   scalePrecision: 100,
//   sliderValues: { lhs: 0, rhs: 9 },
//   minMaxValues: { lhs: -2, rhs: 7 },
//   sliderDefaultPosition: 8,
//   signColorFalse: { bgColor: '#FFF2F2', borderColor: '#CC6666' },
//   signColorTrue: { bgColor: '#E5FFEC', borderColor: '#32A66C' },
// }

/*-----------------Question List-----------------*/

export const QuestionsList: Record<string, IQuestion> = {
  // one: questionOne,
  one: questionTwo,
  // two: questionThree,
  two: questionFour,
  three: questionFive,
  // four: questionSix,
  // one: questionSeven,
  // two: questionEight,
  // three: questionNine,
  // four: questionTen,
  // five: questionEleven,
}

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

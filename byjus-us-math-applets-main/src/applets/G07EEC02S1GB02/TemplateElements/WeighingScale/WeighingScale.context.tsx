import React, { createContext, FC, ReactNode, useContext, useState } from 'react'

type QuestionContextType = {
  question: IQuestionModular
  setQuestion: React.Dispatch<React.SetStateAction<IQuestionModular>>
  currentCalculation: IReturnObject
  setCurrentCalculation: React.Dispatch<React.SetStateAction<IReturnObject>>
}

interface IReturnObject {
  calcVals: ISliderValues
  calcExpression?: ISliderExpressions
  answer: boolean
  parseText: ReactNode
}

interface IColorBlock {
  primaryColor: string
  secondaryColor: string
}

export interface ISliderValues {
  lhs: number
  rhs: number
}

export interface ISliderExpressions {
  lhs: string
  rhs: string
}

export interface IParameters {
  leftCoefficient: number
  leftConstant: number
  rightCoefficient: number
  rightConstant: number
}

export interface IQuestionModular {
  question: string
  targetParameters: IParameters
  evalFn: (Parameters: IParameters) => IReturnObject
  static: 'left' | 'right' | 'neither'
  comparisonType: 'inequal' | 'lt-gt'
  scalePrecision: number
  minMaxValues: ISliderValues
}

const QuestionContext = createContext<QuestionContextType | undefined>(undefined)

export function useQuestion() {
  const context = useContext(QuestionContext)
  if (!context) {
    throw new Error('useQuestion must be used within a CounterProvider')
  }
  return context
}

export function ScaleContextProvider({ children }: { children: React.ReactNode }) {
  const [question, setQuestion] = useState<IQuestionModular>(defaultQuestion)
  const [currentCalculation, setCurrentCalculation] = useState<IReturnObject>(defaultReturnObject)
  const value = { question, setQuestion, currentCalculation, setCurrentCalculation }
  return <QuestionContext.Provider value={value}>{children}</QuestionContext.Provider>
}

/////.............//////

export const defaultReturnObject: IReturnObject = {
  calcVals: { lhs: 0, rhs: 9 },
  answer: false,
  parseText: '',
}

export const blueColorBlock: IColorBlock = {
  primaryColor: '#1CB9D9',
  secondaryColor: '#E7FBFF',
}

export const orangeColorBlock: IColorBlock = {
  primaryColor: '#D97A1A',
  secondaryColor: '#FFE9D4',
}

export const defaultQuestion: IQuestionModular = {
  question: 'x',
  targetParameters: {
    leftCoefficient: 2,
    leftConstant: 4,
    rightCoefficient: 0,
    rightConstant: 10,
  },
  evalFn: () => {
    return {
      calcVals: { lhs: 0, rhs: 0 },
      answer: false,
      parseText: 'loading',
    }
  },
  static: 'neither',
  comparisonType: 'inequal',
  scalePrecision: 200,
  minMaxValues: { lhs: 0, rhs: 120 },
}

import React, { createContext, FC, ReactNode, useContext, useState } from 'react'

type QuestionContextType = {
  question: IQuestion
  setQuestion: React.Dispatch<React.SetStateAction<IQuestion>>
  currentCalculation: IReturnObject
  setCurrentCalculation: React.Dispatch<React.SetStateAction<IReturnObject>>
}

interface IReturnObject {
  calcVals: ISliderValues
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

export interface IQuestion {
  variable: ReactNode
  evalFn: (SliderValues: ISliderValues) => IReturnObject
  lhs: ReactNode
  // lhsSliderValue: number
  leftColorBlock: IColorBlock
  rhs: ReactNode
  sign: ReactNode
  // rhsSliderValue: number
  rightColorBlock: IColorBlock
  static: 'left' | 'right' | 'neither'
  comparisonType: 'inequal' | 'lt-gt'
  scalePrecision: number
  sliderValues: ISliderValues
  minMaxValues: ISliderValues
  sliderDefaultPosition: number
  // scaleAnimation: boolean
  signColorTrue: { bgColor: string; borderColor: string }
  signColorFalse: { bgColor: string; borderColor: string }
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
  const [question, setQuestion] = useState<IQuestion>(defaultQuestion)
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

export const defaultQuestion: IQuestion = {
  variable: 'x',
  evalFn: (SliderValues: ISliderValues) => {
    const lhsVal = SliderValues.lhs * 0
    const rhsVal = 0
    if (lhsVal === rhsVal) {
      {
        return {
          calcVals: { lhs: lhsVal, rhs: rhsVal },
          answer: true,
          parseText: 'loading',
        }
      }
    } else {
      return {
        calcVals: { lhs: lhsVal, rhs: rhsVal },
        answer: false,
        parseText: 'loading',
      }
    }
  },
  lhs: 'LOAD',
  // lhsSliderValue: 4,
  leftColorBlock: blueColorBlock,
  sign: '!',
  rhs: 'LOAD',
  // rhsSliderValue: 3,
  rightColorBlock: orangeColorBlock,
  static: 'neither',
  comparisonType: 'inequal',
  scalePrecision: 200,
  sliderValues: { lhs: 0, rhs: 9 },
  minMaxValues: { lhs: 0, rhs: 120 },
  // scaleAnimation: true,
  sliderDefaultPosition: 0,
  signColorFalse: { bgColor: '#FFF2F2', borderColor: '#CC6666' },
  signColorTrue: { bgColor: '#F1EDFF', borderColor: '#7F5CF4' },
}

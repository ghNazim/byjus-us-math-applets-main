interface IQuestion {
  id: number
  ggbUrl: string
  min: number
  minNum?: number
  minDen?: number
  max: number
  maxNum?: number
  maxDen?: number
  step: number
}

const integerQn: IQuestion = {
  id: 0,
  ggbUrl: 'r5mczetd',
  min: -2,
  max: 2,
  step: 1,
}

const decimalQn: IQuestion = {
  id: 1,
  ggbUrl: 'pjje3edh',
  min: -0.5,
  max: 0.5,
  step: 0.1,
}

const fractionQn: IQuestion = {
  id: 2,
  ggbUrl: 'whvpx2wb',
  min: -2,
  minNum: -1,
  minDen: 1,
  max: 2,
  maxNum: 1,
  maxDen: 3,
  step: 1,
}

export const QuestionsList: Record<string, IQuestion> = {
  one: integerQn,
  two: decimalQn,
  three: fractionQn,
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

export function fetchQuestion(active: number) {
  const keys = Object.keys(QuestionsList)

  const currentKey = keys[active]
  const currentQuestion = QuestionsList[currentKey]

  return currentQuestion
}

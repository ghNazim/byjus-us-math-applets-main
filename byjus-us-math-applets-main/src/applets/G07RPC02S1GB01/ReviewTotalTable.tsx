import { FC } from 'react'

import { interleave } from '@/utils/array'

import {
  animalImages,
  HighlightedExpression,
  ReviewTotalGrid,
  WhiteTotalCell,
} from './Applet.styles'
import { Animal } from './Applet.types'
import { animalWeights } from './data'

function createExpression(animalCounts: { cat: number; dog: number; rabbit: number }) {
  const expressions = []
  for (const key in animalCounts) {
    const animal = key as Animal
    if (animalCounts[animal] > 0) {
      expressions.push(
        <HighlightedExpression key={`${animal}`} animal={animal}>
          {animalCounts[animal]} × {animalWeights[animal]}
        </HighlightedExpression>,
      )
    }
  }
  if (expressions.length > 1) {
    return [
      ...interleave(
        expressions,
        Array.from({ length: expressions.length - 1 }, (_, i) => (
          <span style={{ margin: '0px 6px' }} key={expressions.length + i}>
            +
          </span>
        )),
      ),
    ]
  }

  return expressions
}

export const ReviewTotalTable: FC<{
  animalCounts: { cat: number; dog: number; rabbit: number }
}> = ({ animalCounts }) => {
  return (
    <ReviewTotalGrid>
      <WhiteTotalCell>Animal</WhiteTotalCell>
      <WhiteTotalCell>No. of sandbags</WhiteTotalCell>
      <WhiteTotalCell style={{ flexShrink: 1 }}>
        {(Object.keys(animalImages) as Animal[]).flatMap((animal) =>
          Array.from({ length: animalCounts[animal] }).map((_, i) => (
            <img src={animalImages[animal]} key={`${animal}-${i}`} />
          )),
        )}
      </WhiteTotalCell>
      <WhiteTotalCell>{createExpression(animalCounts)}</WhiteTotalCell>
    </ReviewTotalGrid>
  )
}

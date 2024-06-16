import { FC } from 'react'

import {
  animalImages,
  CatCell,
  DisabledCell,
  DogCell,
  RabbitCell,
  ReviewGrid,
  WhiteCell,
} from './Applet.styles'
import { ReviewTableProps } from './Applet.types'
import questionMark from './assets/questionMark.svg'
import { Sandbags } from './Sandbags'

export const ReviewTable: FC<ReviewTableProps> = ({
  activeAnimals = ['cat', 'dog', 'rabbit'],
  isCatWeightShown = true,
  isDogWeightShown = true,
  isRabbitWeightShown = true,
  ...props
}) => {
  const CatCellComp = activeAnimals.includes('cat') ? CatCell : DisabledCell
  const DogCellComp = activeAnimals.includes('dog') ? DogCell : DisabledCell
  const RabbitCellComp = activeAnimals.includes('rabbit') ? RabbitCell : DisabledCell
  return (
    <ReviewGrid {...props}>
      <WhiteCell>Animal</WhiteCell>
      <CatCellComp>
        <img src={animalImages.cat} />
      </CatCellComp>
      <DogCellComp>
        <img src={animalImages.dog} />
      </DogCellComp>
      <RabbitCellComp>
        <img src={animalImages.rabbit} />
      </RabbitCellComp>
      <WhiteCell>Weight</WhiteCell>
      {isCatWeightShown ? (
        <CatCellComp>
          <Sandbags totalCount={3} />
        </CatCellComp>
      ) : (
        <DisabledCell>
          <img src={questionMark} />
        </DisabledCell>
      )}
      {isDogWeightShown ? (
        <DogCellComp>
          <Sandbags totalCount={5} />
        </DogCellComp>
      ) : (
        <DisabledCell>
          <img src={questionMark} />
        </DisabledCell>
      )}
      {isRabbitWeightShown ? (
        <RabbitCellComp>
          <Sandbags totalCount={2} />
        </RabbitCellComp>
      ) : (
        <DisabledCell>
          <img src={questionMark} />
        </DisabledCell>
      )}
    </ReviewGrid>
  )
}

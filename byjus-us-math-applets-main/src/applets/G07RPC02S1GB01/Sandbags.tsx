import { FC } from 'react'

import { SandbagContainer, SandbagImage } from './Applet.styles'

export const Sandbags: FC<{
  totalCount: number
  incorrectCount?: number
  extraCount?: number
  highlightUptoIndex?: number
}> = ({ totalCount, incorrectCount = 0, extraCount = 0, highlightUptoIndex = -1 }) => {
  const bags = Array.from({ length: totalCount }).map((_, i) => (
    <SandbagImage
      key={`default-${i}`}
      mode={totalCount - i <= incorrectCount + extraCount ? 'incorrect' : 'default'}
      isHighlighted={i <= highlightUptoIndex}
    />
  ))
  return <SandbagContainer>{bags}</SandbagContainer>
}

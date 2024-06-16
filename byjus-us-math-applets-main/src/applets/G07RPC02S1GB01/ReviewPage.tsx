import { FC } from 'react'

import { useSFX } from '@/hooks/useSFX'

import {
  Container,
  CtaButton,
  CtaContainer,
  FeedbackContainer,
  InteractionContainer,
  VisualArea,
} from './Applet.styles'
import { ReviewTable } from './ReviewTable'

export const ReviewPage: FC<{ onComplete?: () => void }> = ({ onComplete }) => {
  const playClick = useSFX('mouseClick')
  return (
    <Container>
      <VisualArea>
        <ReviewTable />
      </VisualArea>
      <FeedbackContainer>Let&apos;s solve some questions based on this.</FeedbackContainer>
      <InteractionContainer></InteractionContainer>
      <CtaContainer>
        <CtaButton
          onClick={() => {
            playClick()
            onComplete?.()
          }}
        >
          Next
        </CtaButton>
      </CtaContainer>
    </Container>
  )
}

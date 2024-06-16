import { FC, useState } from 'react'

import { OnboardingController } from '@/atoms/OnboardingController'
import { AppletContainer } from '@/common/AppletContainer'
import { TextHeader } from '@/common/Header'
import { AppletInteractionCallback } from '@/contexts/analytics'

import { DiscoverPage } from './DiscoverPage'
import { ReviewPage } from './ReviewPage'
import { ScaleQuestionPage } from './ScaleQuestionPage'
import { TableDnDQuestionPage } from './TableDnDQuestionPage'
import { TableDropdownQuestionPage } from './TableDropdownQuestionPage'

export const AppletG07RPC02S1GB01: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const [stage, setStage] = useState(0)

  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#f6f6f6',
        id: 'g07-rpc02-s1-gb01',
        onEvent,
        className,
      }}
    >
      <TextHeader
        text="Find total weight using unit rate."
        backgroundColor="#f6f6f6"
        buttonColor="#1a1a1a"
      />
      <OnboardingController>
        {stage === 0 && <DiscoverPage onComplete={() => setStage(1)} />}
        {stage === 1 && <ReviewPage onComplete={() => setStage(2)} />}
        {stage === 2 && (
          <ScaleQuestionPage possibleAnimalTypes={1} onComplete={() => setStage(3)} />
        )}
        {stage === 3 && (
          <ScaleQuestionPage possibleAnimalTypes={2} onComplete={() => setStage(4)} />
        )}
        {stage === 4 && (
          <ScaleQuestionPage possibleAnimalTypes={3} onComplete={() => setStage(5)} />
        )}
        {stage === 5 && <TableDropdownQuestionPage onComplete={() => setStage(6)} />}
        {stage === 6 && <TableDnDQuestionPage onComplete={() => setStage(2)} />}
      </OnboardingController>
    </AppletContainer>
  )
}

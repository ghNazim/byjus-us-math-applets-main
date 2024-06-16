import { useRive } from '@rive-app/react-canvas'
import { FC, useState } from 'react'
import styled from 'styled-components'

import { OnboardingAnimation } from '@/atoms/OnboardingAnimation'
import { OnboardingController } from '@/atoms/OnboardingController'
import { OnboardingStep } from '@/atoms/OnboardingStep'
import { AppletContainer } from '@/common/AppletContainer'
import { AppletInteractionCallback } from '@/contexts/analytics'
import { useSFX } from '@/hooks/useSFX'

import RiveAnimation from './assets/G06NSC04S1GB01.riv'

const Click1 = styled(OnboardingAnimation).attrs({ type: 'click' })`
  position: absolute;
  top: 700px;
  left: 320px;
  pointer-events: none;
`
const Click2 = styled(OnboardingAnimation).attrs({ type: 'click' })`
  position: absolute;
  top: 77px;
  left: 120px;
  pointer-events: none;
  scale: -1 1 1;
`

export const AppletG06NSC04S1GB01: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const [showOnboarding1, setShowOnBoardin1] = useState(false)
  const [showOnboarding2, setShowOnBoardin2] = useState(false)

  const playClick = useSFX('mouseClick')
  const { RiveComponent } = useRive({
    src: RiveAnimation,
    stateMachines: 'State Machine 1',
    artboard: 'G06NSC04S1GB01',
    autoplay: true,
    onStateChange: (e: any) => {
      if (e.data.length < 2) playClick()
      if (e.data) {
        if (e.data[0] == 'Screen2.0') {
          // playClick()
          setShowOnBoardin1(true)
        } else if (e.data[0] == 'Screen2.5') setShowOnBoardin2(true)
      }
    },
  })
  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#f6f6f6',
        id: 'g06-nsc04-s1-gb01',
        onEvent,
        className,
      }}
    >
      {/* <TextHeader text="Hello World!" backgroundColor="#E7FBFF" buttonColor="#D1F7FF" /> */}
      <RiveComponent style={{ width: '100%', height: '100%' }} />
      <OnboardingController>
        <OnboardingStep index={0}>
          <Click1 complete={showOnboarding1} />
        </OnboardingStep>
        <OnboardingStep index={1}>
          <Click2 complete={showOnboarding2} />
        </OnboardingStep>
      </OnboardingController>
    </AppletContainer>
  )
}

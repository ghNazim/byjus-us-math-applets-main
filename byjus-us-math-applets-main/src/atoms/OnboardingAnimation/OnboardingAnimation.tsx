import { Player } from '@lottiefiles/react-lottie-player'
import { FC, useEffect } from 'react'
import styled, { css } from 'styled-components'

import * as animations from '@/assets/onboarding'
import { useOnboardingStepContext } from '@/atoms/OnboardingStep/OnboardingStepContext'

import { OnboardingAnimationProps } from './OnboardingAnimation.types'

const clickCss = css`
  width: 150px;
  height: 150px;
`

const sliderCss = css`
  width: 400px;
  height: 150px;
`

const StylizedPlayer = styled(Player)<{ type: OnboardingAnimationProps['type'] }>`
  pointer-events: none;
  ${(props) => props.type === 'click' && clickCss}
  ${(props) => props.type === 'slider' && sliderCss}
`

export const OnboardingAnimation: FC<OnboardingAnimationProps> = ({
  type,
  complete,
  className,
}) => {
  const { show, setComplete } = useOnboardingStepContext()
  useEffect(() => {
    if (show && complete) setComplete()
  }, [complete, setComplete, show])

  return (
    <>
      {show && (
        <StylizedPlayer
          type={type}
          className={className}
          autoplay
          loop
          src={animations[type]}
          data-testid="onboarding-animation"
        />
      )}
    </>
  )
}

import React, { useContext, useEffect } from 'react'
import styled from 'styled-components'

import { useSFX } from '@/hooks/useSFX'

import { AnalyticsContext } from '../../contexts/analytics'
import { useStep } from '../../hooks/useStep'
import { PageIndicator } from '../PageIndicator'
import click from '../sfx/mouseClick.mp3'
import { NextButton, PrevButton, RestartButton } from './Buttons'
import { PageControlProps } from './PageControl.types'

const Container = styled.div`
  position: absolute;
  left: 50%;
  translate: -50%;
  bottom: 32px;
  display: flex;
  flex-direction: column;
  gap: 18px;
`

const ButtonsContainer = styled.div`
  gap: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
`

export const PageControl: React.FC<PageControlProps> = ({
  current: initial,
  total,
  nextDisabled = false,
  backDisabled = false,
  onChange,
  onNext,
  onBack,
  onReset,
}) => {
  const [current, { canGoToNextStep, canGoToPrevStep, goToNextStep, goToPrevStep, reset }] =
    useStep(0, total - 1, 1, initial)

  useEffect(() => {
    onChange?.(current)
  }, [current, onChange])

  const playClick = useSFX('mouseClick')
  const onInteraction = useContext(AnalyticsContext)

  return (
    <Container data-testid="PageControl">
      <PageIndicator active={current} total={total} />
      <ButtonsContainer>
        <PrevButton
          disabled={!canGoToPrevStep || backDisabled}
          onClick={() => {
            onBack?.()
            goToPrevStep()
            onInteraction('previous')
            playClick()
          }}
        />
        {!canGoToNextStep && (
          <RestartButton
            onClick={() => {
              onReset?.()
              reset()
              onInteraction('reset')
              playClick()
            }}
          />
        )}
        <NextButton
          disabled={!canGoToNextStep || nextDisabled}
          onClick={() => {
            onNext?.()
            goToNextStep()
            onInteraction('next')
            playClick()
          }}
        />
      </ButtonsContainer>
    </Container>
  )
}

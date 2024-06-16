import React, { useContext } from 'react'
import { ThemeContext } from 'styled-components'

import { AnalyticsContext } from '@/contexts/analytics'
import { useHasChanged } from '@/hooks/useHasChanged'
import { useSFX } from '@/hooks/useSFX'
import { useStep } from '@/hooks/useStep'

import { IconMinus, IconPlus } from './icons'
import { StepperButtonContextProvider } from './StepperButton.Context'
import { ClickOnboarding, Container, LeftButton, Number, RightButton } from './StepperButton.styles'
import { StepperButtonProps } from './StepperButton.types'

export const StepperButton: React.FC<StepperButtonProps> = ({
  value: propsValue,
  defaultValue,
  defaultValueDisplay,
  min = 0,
  max = 10,
  step = 1,
  textColor = '#444444',
  iconLeft: IconLeft = IconMinus,
  iconRight: IconRight = IconPlus,
  onChange,
  disabled = false,
  className,
}) => {
  const [value, { goToNextStep, goToPrevStep, canGoToNextStep, canGoToPrevStep }] = useStep(
    min,
    max,
    step,
    defaultValue,
    propsValue,
    onChange,
  )

  const { color } = useContext(ThemeContext)

  const hasValueChanged = useHasChanged(value)

  const onInteraction = useContext(AnalyticsContext)

  const playClick = useSFX('mouseClick')

  const onIncrease = () => {
    goToNextStep()
    playClick()
    onInteraction('increase')
  }

  const onDecrease = () => {
    goToPrevStep()
    playClick()
    onInteraction('decrease')
  }
  return (
    <StepperButtonContextProvider value={{ min, max, step, value, textColor }}>
      <Container data-testid="StepperButton" className={className} borderColor={color}>
        <LeftButton
          draggable={false}
          disabled={!canGoToPrevStep || disabled}
          onMouseDown={(e) => e.stopPropagation()}
          onClick={onDecrease}
        >
          <IconLeft />
        </LeftButton>
        <Number textColor={textColor} draggable={false}>
          {!hasValueChanged && defaultValueDisplay != null ? defaultValueDisplay : value}
        </Number>
        <RightButton
          draggable={false}
          disabled={!canGoToNextStep || disabled}
          onMouseDown={(e) => e.stopPropagation()}
          onClick={onIncrease}
        >
          <IconRight />
          <ClickOnboarding complete={hasValueChanged} />
        </RightButton>
      </Container>
    </StepperButtonContextProvider>
  )
}

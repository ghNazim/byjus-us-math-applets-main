import { FC } from 'react'
import styled from 'styled-components'

import { StepperButton } from '@/atoms/StepperButton'
import { isString } from '@/utils/types'

import { StepInputProps } from './StepInput.types'

const Container = styled.div<{ disabled: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: center;
  width: 200px;
  height: 108px;
  padding: 5px 0px;
  gap: 10px;

  ${(props) => props.disabled && 'filter: grayscale() opacity(0.2);'}
`

const DefaultLabel = styled.label`
  font-family: Nunito;
  font-size: 20px;
  font-weight: 700;
  line-height: 28px;
  text-align: center;
  color: #444;
`

export const StepInput: FC<StepInputProps> = ({
  label,
  showLabel = true,
  disabled = false,
  ...props
}) => {
  const Label = isString(label) ? () => <DefaultLabel>{label}</DefaultLabel> : label
  return (
    <Container disabled={disabled} data-testid="step-input">
      {showLabel && Label && <Label />}
      <StepperButton disabled={disabled} {...props} />
    </Container>
  )
}

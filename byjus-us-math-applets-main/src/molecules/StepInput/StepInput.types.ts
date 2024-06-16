import { ComponentType } from 'react'

import { StepperBehaviorProps } from '@/atoms/StepperButton/StepperButton.types'

export type StepInputProps = StepperBehaviorProps & {
  label?: string | ComponentType
  showLabel?: boolean
}

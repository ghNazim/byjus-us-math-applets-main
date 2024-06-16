import { ComponentType, ReactNode } from 'react'

export interface StepperBehaviorProps {
  value?: number
  defaultValue?: number
  defaultValueDisplay?: ReactNode
  min?: number
  max?: number
  step?: number
  onChange?: (value: number) => void
  disabled?: boolean
}

export interface StepperCustomizationProps {
  iconLeft?: ComponentType
  iconRight?: ComponentType
  borderColor?: string
  textColor?: string
  className?: string
}

export type StepperButtonProps = StepperBehaviorProps & StepperCustomizationProps

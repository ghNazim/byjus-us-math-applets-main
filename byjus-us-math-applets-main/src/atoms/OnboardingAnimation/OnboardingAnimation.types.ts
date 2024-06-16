import * as animations from '@/assets/onboarding'

export type AnimationType = keyof typeof animations

export interface Position {
  top: number
  left: number
}

export interface DnDOnboardingAnimationProps {
  initialPosition: Position
  finalPosition: Position
  speed?: number
  complete: boolean
  className?: string
}

export interface OnboardingAnimationProps {
  type: AnimationType
  complete: boolean
  className?: string
}

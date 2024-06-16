import type { Meta, StoryObj } from '@storybook/react'

import { OnboardingStep } from './OnboardingStep'

const meta: Meta<typeof OnboardingStep> = {
  component: OnboardingStep,
}
export default meta
type Story = StoryObj<typeof OnboardingStep>

export const WithBar = {} satisfies Story

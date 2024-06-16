import type { Meta, StoryObj } from '@storybook/react'

import { OnboardingController } from './OnboardingController'

const meta: Meta<typeof OnboardingController> = {
  component: OnboardingController,
}
export default meta
type Story = StoryObj<typeof OnboardingController>

export const WithBar = {} satisfies Story

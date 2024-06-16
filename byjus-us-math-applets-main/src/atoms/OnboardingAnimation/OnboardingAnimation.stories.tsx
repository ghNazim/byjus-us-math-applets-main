import type { Meta, StoryObj } from '@storybook/react'

import * as animations from '@/assets/onboarding'

import { OnboardingStepContextProvider } from '../OnboardingStep/OnboardingStepContext'
import { OnboardingAnimation } from './OnboardingAnimation'

const meta: Meta<typeof OnboardingAnimation> = {
  component: OnboardingAnimation,
  argTypes: {
    type: {
      control: 'select',
      options: Object.keys(animations),
    },
  },
  decorators: [
    (Story) => (
      <OnboardingStepContextProvider value={{ show: true, setComplete() {} }}>
        <Story />
      </OnboardingStepContextProvider>
    ),
  ],
}
export default meta
type Story = StoryObj<typeof OnboardingAnimation>

export const Default = {
  args: {
    type: 'click',
  },
} satisfies Story

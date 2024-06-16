import type { Meta, StoryObj } from '@storybook/react'

import { OnboardingController } from '@/atoms/OnboardingController'
import { OnboardingStep } from '@/atoms/OnboardingStep'
import { DefaultStepper } from '@/atoms/StepperButton/StepperButton.stories'

import { StepInput } from './StepInput'

const meta: Meta<typeof StepInput> = {
  component: StepInput,
  decorators: [
    (Story) => (
      <OnboardingController>
        <OnboardingStep index={0}>
          <Story />
        </OnboardingStep>
      </OnboardingController>
    ),
  ],
}
export default meta
type Story = StoryObj<typeof StepInput>

export const Default = {
  args: {
    ...DefaultStepper.args,
    label: 'Value of a',
  },
} satisfies Story

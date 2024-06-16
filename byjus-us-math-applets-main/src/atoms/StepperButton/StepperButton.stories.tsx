import type { Meta, StoryObj } from '@storybook/react'

import { StepperButton } from './StepperButton'

const meta: Meta<typeof StepperButton> = {
  component: StepperButton,
}
export default meta
type Story = StoryObj<typeof StepperButton>

export const DefaultStepper = {
  args: {
    defaultValue: 5,
    min: 0,
    max: 16,
  },
} satisfies Story

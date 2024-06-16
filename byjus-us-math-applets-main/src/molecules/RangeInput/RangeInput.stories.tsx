import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'

import { OnboardingController } from '@/atoms/OnboardingController'
import { OnboardingStep } from '@/atoms/OnboardingStep'

import { RangeInput } from './RangeInput'

const meta: Meta<typeof RangeInput> = {
  component: RangeInput,
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
type Story = StoryObj<typeof RangeInput>

export const Default = {
  args: {
    label: 'Value of a',
  },
} satisfies Story

export const Controlled = {
  render: function ControlledInput(args) {
    const [value, setValue] = useState(3)
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <input
          type="number"
          name="value"
          id="val"
          value={value}
          onChange={(e) => setValue(+e.currentTarget.value)}
        />
        <RangeInput {...{ ...args, value, onChange: setValue }} />
      </div>
    )
  },
} satisfies Story

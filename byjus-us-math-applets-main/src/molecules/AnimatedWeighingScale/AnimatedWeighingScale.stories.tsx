import type { Meta, StoryObj } from '@storybook/react'

import { AnimatedWeighingScale } from './AnimatedWeighingScale'

const meta: Meta<typeof AnimatedWeighingScale> = {
  component: AnimatedWeighingScale,
}
export default meta
type Story = StoryObj<typeof AnimatedWeighingScale>

export const Demo = {
  args: {
    leftValue: 10,
    rightValue: 10,
    maxValueDifference: 20,
  },
} satisfies Story

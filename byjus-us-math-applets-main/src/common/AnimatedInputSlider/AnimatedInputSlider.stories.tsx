import type { Meta, StoryObj } from '@storybook/react'

import { AnimatedInputSlider } from './AnimatedInputSlider'

const meta: Meta<typeof AnimatedInputSlider> = {
  component: AnimatedInputSlider,
}
export default meta
type Story = StoryObj<typeof AnimatedInputSlider>

export const Horizontal: Story = {
  args: {
    value: 0,
    min: 0,
    max: 1,
    animDuration: 1600,
    disabled: false,
  },
}

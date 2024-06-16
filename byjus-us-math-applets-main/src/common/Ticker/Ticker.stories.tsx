import type { Meta, StoryObj } from '@storybook/react'

import { Ticker } from './Ticker'

const meta: Meta<typeof Ticker> = {
  component: Ticker,
  argTypes: {
    backgroundColor: {
      control: 'color',
    },
  },
}
export default meta
type Story = StoryObj<typeof Ticker>

export const Default: Story = {
  args: {
    value: 0,
    min: 8,
    max: 16,
  },
}

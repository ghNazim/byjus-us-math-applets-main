import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'

import { IncorrectFeedback } from './IncorrectFeedback'

const meta: Meta<typeof IncorrectFeedback> = {
  component: IncorrectFeedback,
}
export default meta
type Story = StoryObj<typeof IncorrectFeedback>

export const WithBar: Story = {
  args: {},
}

export const WithBaz: Story = {
  args: {},
}

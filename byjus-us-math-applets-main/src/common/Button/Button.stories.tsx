import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'

import { Button } from './Button'

const meta: Meta<typeof Button> = {
  component: Button,
}
export default meta
type Story = StoryObj<typeof Button>

export const WithBar: Story = {
  args: {},
}

export const WithBaz: Story = {
  args: {},
}

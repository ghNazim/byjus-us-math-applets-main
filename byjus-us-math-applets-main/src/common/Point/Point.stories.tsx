import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'

import { Point } from './Point'

const meta: Meta<typeof Point> = {
  component: Point,
}
export default meta
type Story = StoryObj<typeof Point>

export const WithBar: Story = {
  args: {},
}

export const WithBaz: Story = {
  args: {},
}

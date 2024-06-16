import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'

import { Math } from './Math'

const meta: Meta<typeof Math> = {
  component: Math,
}
export default meta
type Story = StoryObj<typeof Math>

export const BlockMath: Story = {
  args: {
    children: `A =
    \\begin{pmatrix}
    1 & 0 & 0 \\\\
    0 & 1 & 0 \\\\
    0 & 0 & 1 \\\\
    \\end{pmatrix}`,
  },
}

export const InlineMath: Story = {
  args: {
    children: `
    \\int_0^\\infty x^2 dx
    `,
  },
  render: (args) => (
    <h2>
      This is an in-line <Math>{args.children}</Math> expression{' '}
    </h2>
  ),
}

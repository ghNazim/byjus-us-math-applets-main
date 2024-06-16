import type { Meta, StoryObj } from '@storybook/react'

import { PageIndicator } from './PageIndicator'

const meta: Meta<typeof PageIndicator> = {
  component: PageIndicator,
}
export default meta
type Story = StoryObj<typeof PageIndicator>

export const Default: Story = {
  args: {
    total: 6,
    active: 2,
  },
}

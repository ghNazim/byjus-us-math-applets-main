import type { Meta, StoryObj } from '@storybook/react'

import { PageControl } from './PageControl'

const meta: Meta<typeof PageControl> = {
  component: PageControl,
}
export default meta
type Story = StoryObj<typeof PageControl>

export const Default: Story = {
  args: {
    total: 5,
  },
}

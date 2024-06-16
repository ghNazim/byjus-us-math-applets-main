import type { Meta, StoryObj } from '@storybook/react'

import { TogglesGroup } from './TogglesGroup'

const meta: Meta<typeof TogglesGroup> = {
  component: TogglesGroup,
}
export default meta
type Story = StoryObj<typeof TogglesGroup>

export const WithBar: Story = {
  args: {},
}

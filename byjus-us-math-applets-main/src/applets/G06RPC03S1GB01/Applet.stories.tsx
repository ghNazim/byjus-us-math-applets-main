import type { Meta, StoryObj } from '@storybook/react'

import { AppletWrapper } from '@/applets/AppletWrapper'

import { AppletG06RPC03S1GB01 } from './Applet'

const meta: Meta<typeof AppletG06RPC03S1GB01> = {
  component: AppletG06RPC03S1GB01,
  decorators: [AppletWrapper],
}
export default meta
type Story = StoryObj<typeof AppletG06RPC03S1GB01>

export const Default = {} satisfies Story

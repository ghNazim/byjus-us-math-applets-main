import type { Meta, StoryObj } from '@storybook/react'

import { AppletWrapper } from '@/applets/AppletWrapper'

import { AppletG08GMC03S1GB02 } from './AppletG08GMC03S1GB02'

const meta: Meta<typeof AppletG08GMC03S1GB02> = {
  component: AppletG08GMC03S1GB02,
  decorators: [AppletWrapper],
}
export default meta
type Story = StoryObj<typeof AppletG08GMC03S1GB02>

export const Default = {} satisfies Story

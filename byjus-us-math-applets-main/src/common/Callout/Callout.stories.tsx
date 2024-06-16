import type { Meta, StoryObj } from '@storybook/react'

import { Callout } from './Callout'
import { CalloutProps } from './Callout.types'
import { TextCallout } from './TextCallout'

const meta: Meta<typeof Callout> = {
  component: Callout,
  argTypes: {
    backgroundColor: {
      control: 'color',
    },
  },
}
export default meta
type Story = StoryObj<typeof Callout>

export const Empty: Story = {
  args: {
    backgroundColor: 'teal',
    animationDuration: 1600,
  },
}

export const CalloutWithText = {
  args: {
    text: 'This is a text callout!!',
    backgroundColor: 'teal',
    animationDuration: 1600,
  },
  render: ({ ...args }: { text: string } & CalloutProps) => <TextCallout {...args} />,
}

import type { Meta, StoryObj } from '@storybook/react'

import { Header } from './Header'
import { HeaderProps } from './Header.types'
import { TextHeader } from './TextHeader'

const meta: Meta<typeof Header> = {
  component: Header,
  argTypes: {
    backgroundColor: {
      control: 'color',
    },
  },
}
export default meta
type Story = StoryObj<typeof Header>

export const Empty: Story = {
  args: {
    backgroundColor: 'teal',
    animationDuration: 1600,
  },
}

export const HeaderWithText = {
  args: {
    text: 'This is a text callout!!',
    backgroundColor: 'teal',
    animationDuration: 1600,
  },
  render: ({ ...args }: { text: string } & HeaderProps) => <TextHeader {...args} />,
}

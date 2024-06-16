import type { Meta, StoryObj } from '@storybook/react'
import styled from 'styled-components'

import { ContentScaler } from './ContentScaler'

const Outer = styled.div`
  margin: auto;
  width: 95dvw;
  height: 95dvh;
  background: #ff006fd0;
`

const Inner = styled.div`
  width: 100%;
  height: 100%;
  background: #00803ace;
`

const meta = {
  component: ContentScaler,
  args: {
    designWidth: 100,
    designHeight: 100,
    children: <Inner />,
  },
  decorators: [
    (Story) => (
      <Outer>
        <Story />
      </Outer>
    ),
  ],
} satisfies Meta<typeof ContentScaler>
export default meta
type Story = StoryObj<typeof ContentScaler>

export const Default = {} satisfies Story

import type { Meta, StoryObj } from '@storybook/react'

import { InputFactorTree as InputFactorTree } from './InputFactorTree'

const meta: Meta<typeof InputFactorTree> = {
  component: InputFactorTree,
}
export default meta
type Story = StoryObj<typeof InputFactorTree>

export const Default = {
  args: {
    value: 256,
    inputFactors: [4, 2],
  },
} satisfies Story

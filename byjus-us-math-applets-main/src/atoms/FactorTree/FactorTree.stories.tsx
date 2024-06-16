import type { Meta, StoryObj } from '@storybook/react'

import { FactorTree } from './FactorTree'

const meta: Meta<typeof FactorTree> = {
  component: FactorTree,
}
export default meta
type Story = StoryObj<typeof FactorTree>

export const Default = {
  args: {
    value: 256,
    inputFactors: [4, 2],
  },
} satisfies Story

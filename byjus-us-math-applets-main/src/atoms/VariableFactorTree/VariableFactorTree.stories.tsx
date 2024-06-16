import type { Meta, StoryObj } from '@storybook/react'

import { VariableFactorTree } from './VariableFactorTree'

const meta: Meta<typeof VariableFactorTree> = {
  component: VariableFactorTree,
}
export default meta
type Story = StoryObj<typeof VariableFactorTree>

export const Default = {
  args: {
    expression: '6x',
    inputFactors: ['x', 4, 2],
  },
} satisfies Story

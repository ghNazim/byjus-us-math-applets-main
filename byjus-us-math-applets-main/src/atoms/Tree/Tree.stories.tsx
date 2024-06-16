import type { Meta, StoryObj } from '@storybook/react'

import { Tree } from './Tree'

const meta: Meta<typeof Tree> = {
  component: Tree,
}
export default meta
type Story = StoryObj<typeof Tree>

export const Default = {
  args: {
    vertices: new Map([
      [0, [1, 2, 3]],
      [1, [4, 5]],
      [2, []],
      [3, [6]],
      [4, []],
      [5, []],
      [6, []],
    ]),
  },
} satisfies Story

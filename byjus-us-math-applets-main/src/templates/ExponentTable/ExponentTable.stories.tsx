import type { Meta, StoryObj } from '@storybook/react'

import { ExponentTable } from './ExponentTable'

const meta: Meta<typeof ExponentTable> = {
  component: ExponentTable,
}
export default meta
type Story = StoryObj<typeof ExponentTable>

export const WithBar = {} satisfies Story

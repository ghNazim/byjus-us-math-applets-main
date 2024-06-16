import type { Meta, StoryObj } from '@storybook/react'

import { WeighingScale } from './WeighingScale'
import { blueColorBlock, ISliderValues, orangeColorBlock } from './WeighingScale.context'

const meta: Meta<typeof WeighingScale> = {
  component: WeighingScale,
}
export default meta
type Story = StoryObj<typeof WeighingScale>

export const Default: Story = {}

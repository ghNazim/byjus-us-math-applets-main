import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'

import { range } from '@/utils/math'

import { primaryRangeSliderArgs } from './PrimaryRangeSlider'
import { RangeSlider } from './RangeSlider'
import { useRangeSliderContext } from './RangeSliderContext'

/**
 * A component to make section from a range of values reflected on a bar.
 */
const meta: Meta<typeof RangeSlider> = {
  component: RangeSlider,
  argTypes: {
    onChange: {
      table: {
        disable: true,
      },
    },
    onChangeBegin: {
      table: {
        disable: true,
      },
    },
    onChangeComplete: {
      table: {
        disable: true,
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ margin: '3em' }}>
        <Story />
      </div>
    ),
  ],
}
export default meta
type Story = StoryObj<typeof RangeSlider>

export const Primary = {
  args: primaryRangeSliderArgs,
} satisfies Story

export const Basic = {
  args: {
    defaultValue: 30,
  },
} satisfies Story

export const Progress = {
  args: {
    disableTrack: false,
    defaultValue: 45,
  },
} satisfies Story

export const Graduated = {
  args: {
    disableTicks: false,
    ticks: range(100, 0, 10),
  },
} satisfies Story

export const Vertical = {
  args: {
    vertical: true,
    defaultValue: 20,
    disableTrack: false,
  },
  decorators: [
    (Story) => (
      <div style={{ height: 140 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Story

export const Reverse = {
  args: {
    reverse: true,
    defaultValue: 30,
    disableTrack: false,
  },
} satisfies Story

export const Tooltip = {
  args: {
    defaultValue: 30,
    label: 'event',
  },
} satisfies Story

export const Controlled = {
  args: {
    defaultValue: 30,
    label: 'persistent',
  },
  render: function ControlledInput(args) {
    const [value, setValue] = useState(30)
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <input
          type="number"
          name="value"
          id="val"
          value={value}
          onChange={(e) => setValue(+e.currentTarget.value)}
        />
        <RangeSlider {...{ ...args, value, onChange: setValue }} />
      </div>
    )
  },
} satisfies Story

export const CustomColors = {
  args: {
    defaultValue: 40,
    min: 15,
    step: 3,
    max: 90,
    disableTrack: false,
    label: 'persistent',
    thumbColor: 'purple',
    trackColor: 'aqua',
    sliderColor: '#eeffee',
  },
} satisfies Story

export const CustomAppearance = {
  args: {
    defaultValue: 20,
    label: 'event',
    ticks: range(100, 0, 20),
    disableTicks: false,
    customThumb: function CustomThumb() {
      return (
        <img
          style={{ width: 50, height: 50 }}
          src="https://img.icons8.com/plasticine/100/null/scary-hand.png"
        />
      )
    },
    customLabel: function CustomLabel() {
      const { value, labelTransitionStage } = useRangeSliderContext()
      return (
        <div
          style={{
            position: 'absolute',
            left: '50%',
            translate: '-50%',
            bottom: 12,
            width: 60,
            height: 60,
            backgroundImage: 'url(https://img.icons8.com/plasticine/100/null/thriller.png)',
            backgroundSize: 'contain',
            zIndex: -1,
            opacity: labelTransitionStage === 'enter' ? 1 : 0,
            transition: 'opacity 500ms',
          }}
        >
          {value}
        </div>
      )
    },
    customTick: function CustomTick({ position }) {
      const { progress } = useRangeSliderContext()
      return (
        <img
          style={{ width: 30, height: 30 }}
          src={`https://img.icons8.com/plasticine/100/null/${
            progress >= position ? 'zombie-hand-thumbs-up' : 'crossbones'
          }.png`}
        />
      )
    },
    thumbSize: 50,
    tickSize: 30,
  },
} satisfies Story

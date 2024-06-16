import { ComponentType } from 'react'

import {
  RangeSliderCallbacks,
  RangeSliderDefaultProps,
} from '@/atoms/RangeSlider/RangeSlider.types'

export type RangeInputProps = RangeSliderDefaultProps &
  RangeSliderCallbacks & {
    label?: string | ComponentType
    showLabel?: boolean
    disableTicks?: boolean
  }

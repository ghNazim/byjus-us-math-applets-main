import { ComponentType } from 'react'

import {
  RangeSliderCallbacks,
  RangeSliderDefaultProps,
} from '@/atoms/RangeSlider/RangeSlider.types'

export type RangeInputVerticalProps = RangeSliderDefaultProps &
  RangeSliderCallbacks & {
    label?: string | ComponentType
    showLabel?: boolean
  }

import { ComponentType } from 'react'

type OnChangeCallback = (value: number, ratio: number) => void

export type RangeSliderProps = RangeSliderDefaultProps &
  RangeSliderFunctionalProps &
  RangeSliderCallbacks &
  RangeSliderCustomizationProps

export interface RangeSliderDefaultProps {
  /**
   * Property to control the current value of the slider.
   */
  value?: number
  /**
   * The initial value of the slider.
   */
  defaultValue?: number
  /**
   * The minimum value of the slider range.
   * @default 0
   */
  min?: number
  /**
   * The maximum value of the slider range.
   * @default 100
   */
  max?: number
  /**
   * The step size for slider.
   * @default 1
   */
  step?: number
  /**
   * Class name for the slider.
   */
  className?: string
}

interface RangeSliderFunctionalProps {
  /**
   * Array of values to show ticks at.
   * @default []
   */
  ticks?: number[]
  /**
   * Whether to snap to values given by {@link ticks}.
   * @default false
   */
  snapToTicks?: boolean
  /**
   * Use vertical orientation.
   * @default false
   */
  vertical?: boolean
  /**
   * Reverse the slider range progression.
   * @default false
   */
  reverse?: boolean
  /**
   * Additional padding around the slider bar for event detection.
   * @default 8
   */
  eventWrapperPadding?: number
  /**
   * Behavior of the thumb label.
   */
  label?: 'event' | 'persistent' | 'disabled'
}

export interface RangeSliderCallbacks {
  /**
   * Callback function triggered on value change.
   */
  onChange?: OnChangeCallback
  /**
   * Callback function triggered on value change is started (when mouse down or touch start etc.)
   */
  onChangeBegin?: OnChangeCallback
  /**
   * Callback function triggered on value change is completed (when mouse up or touch end etc.)
   */
  onChangeComplete?: OnChangeCallback
}

interface RangeSliderCustomizationProps {
  /**
   * Custom component for the thumb.
   */
  customThumb?: ComponentType
  /**
   * Custom component for the thumb label.
   */
  customLabel?: ComponentType
  /**
   * Custom component for the graduation ticks.
   */
  customTick?: ComponentType<{ position: number }>
  /**
   * Show progress track on the slider bar.
   * @default false
   */
  disableTrack?: boolean
  /**
   * Show the thumb.
   * @default true
   */
  disableThumb?: boolean
  /**
   * Show graduation ticks.
   * @default false
   */
  disableTicks?: boolean
  /**
   * Color of the slider bar.
   */
  sliderColor?: string
  /**
   * Color of the progress track.
   */
  trackColor?: string
  /**
   * Color of the thumb.
   */
  thumbColor?: string
  /**
   * Size of the slider bar.
   */
  sliderSize?: number
  /**
   * Size of the thumb.
   */
  thumbSize?: number
  /**
   * Size of the graduation tick.
   */
  tickSize?: number
}

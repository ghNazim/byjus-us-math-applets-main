import { FC } from 'react'
import styled from 'styled-components'

import { RangeSlider } from './RangeSlider'
import { RangeSliderProps } from './RangeSlider.types'
import { useRangeSliderContext } from './RangeSliderContext'

const DefaultThumb = styled.div<{ size: number }>`
  background: white;
  border: ${(props) => props.size * 0.1825}px solid ${(props) => props.theme.default};
  border-radius: 100%;
  height: ${(props) => props.size}px;
  width: ${(props) => props.size}px;

  &:disabled {
    border-color: ${(props) => props.theme.disabled};
  }

  &:hover {
    border-color: ${(props) => props.theme.hover};
    scale: 1.1;
  }

  &:active {
    border-color: ${(props) => props.theme.default};
  }
`

export const primaryRangeSliderArgs: Partial<RangeSliderProps> = {
  sliderSize: 8,
  thumbSize: 32,
  sliderColor: '#d9cdff',
  trackColor: '#7f5cf4',
  thumbColor: '#7f5cf4',
  disableTrack: false,
  customThumb: function PrimaryThumb() {
    const { thumbSize } = useRangeSliderContext()
    return <DefaultThumb size={thumbSize} />
  },
}

export const PrimaryRangeSlider: FC<RangeSliderProps> = (props) => (
  <RangeSlider {...{ ...primaryRangeSliderArgs, ...props }} />
)

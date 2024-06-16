import styled, { css } from 'styled-components'
import type { Stage } from 'transition-hook'

import { OnboardingAnimation } from '@/atoms/OnboardingAnimation'

const verticalEventWrapperMixin = css<{ eventWrapperPadding: number }>`
  padding: 0 ${(props) => props.eventWrapperPadding}px;
`
const horizontalEventWrapperMixin = css<{ eventWrapperPadding: number }>`
  padding: ${(props) => props.eventWrapperPadding}px 0;
`
export const EventWrapper = styled.div<{ vertical: boolean; eventWrapperPadding: number }>`
  height: 100%;
  width: 100%;
  position: relative;
  cursor: pointer;
  margin: 0 auto;
  overflow: visible;
  ${(props) => (props.vertical ? verticalEventWrapperMixin : horizontalEventWrapperMixin)}
`
export const SliderWrapper = styled.div<{
  vertical: boolean
  size: number
  color: string
}>`
  background: ${(props) => props.color};
  border-radius: ${(props) => props.size * 0.5}px;
  position: relative;
  overflow: visible;
  width: ${(props) => (props.vertical ? props.size + 'px' : '100%')};
  height: ${(props) => (props.vertical ? '100%' : props.size + 'px')};
  ${(props) => props.vertical && 'margin: 0 auto;'}
`
const verticalThumbMixin = css<{ percent: number; offset: number; centering: number }>`
  bottom: ${(props) => props.percent}%;
  margin-left: ${(props) => props.centering}px;
  margin-bottom: ${(props) => props.offset}px;
`
const verticalThumbReverseMixin = css<{
  percent: number
  offset: number
  centering: number
}>`
  top: ${(props) => props.percent}%;
  margin-left: ${(props) => props.centering}px;
  margin-top: ${(props) => props.offset}px;
`
const horizontalThumbMixin = css<{ percent: number; offset: number; centering: number }>`
  left: ${(props) => props.percent}%;
  top: 0px;
  margin-top: ${(props) => props.centering}px;
  margin-left: ${(props) => props.offset}px;
`
const horizontalThumbReverseMixin = css<{
  percent: number
  offset: number
  centering: number
}>`
  right: ${(props) => props.percent}%;
  top: 0px;
  margin-top: ${(props) => props.centering}px;
  margin-right: ${(props) => props.offset}px;
`
export const ThumbWrapper = styled.div<{
  vertical: boolean
  reverse: boolean
  percent: number
  size: number
  offset: number
  centering: number
}>`
  position: absolute;
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
  ${({ vertical, reverse }) =>
    vertical
      ? reverse
        ? verticalThumbReverseMixin
        : verticalThumbMixin
      : reverse
      ? horizontalThumbReverseMixin
      : horizontalThumbMixin}
`
const verticalTrackMixin = css<{ percent: number }>`
  width: 100%;
  height: ${(props) => props.percent}%;
  bottom: 0px;
`
const verticalTrackReverseMixin = css<{ percent: number }>`
  width: 100%;
  height: ${(props) => props.percent}%;
  top: 0px;
`
const horizontalTrackMixin = css<{ percent: number }>`
  height: 100%;
  width: ${(props) => props.percent}%;
  left: 0px;
`
const horizontalTrackReverseMixin = css<{ percent: number }>`
  height: 100%;
  width: ${(props) => props.percent}%;
  right: 0px;
`
export const Track = styled.div<{
  vertical: boolean
  reverse: boolean
  color: string
  percent: number
  size: number
}>`
  background: ${(props) => props.color};
  border-radius: ${(props) => props.size * 0.5}px;
  position: absolute;
  ${({ vertical, reverse }) =>
    vertical
      ? reverse
        ? verticalTrackReverseMixin
        : verticalTrackMixin
      : reverse
      ? horizontalTrackReverseMixin
      : horizontalTrackMixin}
`
export const DefaultLabel = styled.div<{
  color: string
  size: number
  transitionStage: Stage
}>`
  position: absolute;
  left: 50%;
  translate: -50%;
  bottom: ${(props) => props.size + 4}px;
  background: ${(props) => props.color};
  color: white;
  font-size: 12px;
  font-family: 'Nunito';
  text-align: center;
  margin: 0;
  width: max-content;
  height: 20px;
  padding: 2px 4px 0px;
  border-radius: 2px;
  opacity: ${(props) => (props.transitionStage === 'enter' ? 1 : 0)};
  transition: opacity 500ms;

  &::after {
    content: ' ';
    position: absolute;
    top: 100%; /* At the bottom of the tooltip */
    left: 50%;
    margin-left: -4px;
    border-width: 4px;
    border-style: solid;
    border-color: ${(props) => props.color} transparent transparent transparent;
  }
`
export const DefaultThumb = styled.div<{ color: string; size: number }>`
  background: ${(props) => props.color};
  border-radius: 100%;
  height: ${(props) => props.size}px;
  width: ${(props) => props.size}px;
`
const horizontalOnboardingMixin = css`
  left: -50px;
  top: -20px;
`
export const SliderOnboarding = styled(OnboardingAnimation).attrs({ type: 'slider' })<{
  vertical: boolean
}>`
  position: absolute;
  ${horizontalOnboardingMixin}
`

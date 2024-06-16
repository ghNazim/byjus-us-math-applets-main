import React, {
  KeyboardEventHandler,
  MouseEventHandler,
  TouchEventHandler,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react'
import { ThemeContext } from 'styled-components'
import { useTransition } from 'transition-hook'

import { useControllableValue } from '@/hooks/useControllableValue'
import { useHasChanged } from '@/hooks/useHasChanged'
import { useMemoizedCallback } from '@/hooks/useMemoizedCallback'
import { useSFX } from '@/hooks/useSFX'
import {
  clampValue,
  findClosestNumber,
  getProgress,
  getValueFromProgress,
  range,
} from '@/utils/math'

import {
  DefaultLabel,
  DefaultThumb,
  EventWrapper,
  SliderOnboarding,
  SliderWrapper,
  ThumbWrapper,
  Track,
} from './RangeSlider.styles'
import { RangeSliderProps } from './RangeSlider.types'
import { RangeSliderContextProvider } from './RangeSliderContext'

export const RangeSlider: React.FC<RangeSliderProps> = ({
  min = 0,
  max = 100,
  step = 1,
  value: propsValue,
  defaultValue,
  ticks = [],
  snapToTicks = false,
  onChange,
  onChangeBegin,
  onChangeComplete,
  vertical = false,
  reverse = false,
  eventWrapperPadding = 8,
  label = 'disabled',
  customThumb: CustomThumb,
  customLabel: CustomLabel,
  customTick: CustomTick,
  disableTrack = true,
  disableThumb = false,
  disableTicks = true,
  sliderSize = 5,
  thumbSize: propThumbSize,
  tickSize: propsTickSize,
  className,
}) => {
  const { sliderColor, trackColor, thumbColor } = useContext(ThemeContext)
  const sliderRef = useRef<HTMLDivElement>(null)
  const steps = useMemo(() => range(max, min, step), [max, min, step])
  const [value, setValue] = useControllableValue({
    value: propsValue,
    defaultValue: defaultValue ?? min,
    onChange: onChange ? (value) => onChange(value, getProgress(value, min, max)) : undefined,
  })
  const progress = getProgress(value, min, max)
  const thumbSize = propThumbSize ?? sliderSize * 2
  const tickSize = propsTickSize ?? thumbSize * 0.8
  const [displayLabel, setDisplayLabel] = useState(false)
  const playDragStart = useSFX('mouseIn')
  const playDragEnd = useSFX('mouseOut')
  const hasValueChanged = useHasChanged(value)

  const { stage: labelTransitionStage, shouldMount: shouldMountLabel } = useTransition(
    label === 'persistent' || (label === 'event' && displayLabel),
    500,
  )

  const handleChangeBegin = useMemoizedCallback(() => {
    playDragStart()
    onChangeBegin?.(value, progress)
  })
  const handleChangeComplete = useMemoizedCallback(() => {
    playDragEnd()
    onChangeComplete?.(value, progress)
  })

  const handleMouseInteractionStart: MouseEventHandler = (event) => {
    const leftMouseButton = 0
    if (event.button !== leftMouseButton) return
    updateSliderValue(event.clientX, event.clientY)
    handleChangeBegin()
    addMouseEvents()
    setDisplayLabel(true)
    event.preventDefault()
    event.stopPropagation()
  }

  const handleTouchInteractionStart: TouchEventHandler = (event) => {
    updateSliderValue(event.touches[0].clientX, event.touches[0].clientY)
    handleChangeBegin()
    addTouchEvents()
    setDisplayLabel(true)
    event.cancelable && event.preventDefault()
    event.stopPropagation()
  }

  const handleInteractionEnd = (event: MouseEvent | TouchEvent) => {
    setDisplayLabel(false)
    removeEvents()
    event.cancelable && event.preventDefault()
    event.stopPropagation()
    handleChangeComplete()
  }

  const onMouseMove = (event: MouseEvent) => {
    updateSliderValue(event.clientX, event.clientY)
    event.preventDefault()
    event.stopPropagation()
  }

  const onTouchMove = (event: TouchEvent) => {
    updateSliderValue(event.touches[0].clientX, event.touches[0].clientY)
    event.cancelable && event.preventDefault()
    event.stopPropagation()
  }

  const getSliderBounds = () => {
    const sl = sliderRef.current
    if (sl == null) return null
    return sl.getBoundingClientRect()
  }

  const addMouseEvents = () => {
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', handleInteractionEnd)
  }

  const addTouchEvents = () => {
    document.addEventListener('touchmove', onTouchMove, { passive: false })
    document.addEventListener('touchend', handleInteractionEnd)
  }

  const removeEvents = () => {
    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', handleInteractionEnd)
    document.removeEventListener('touchmove', onTouchMove)
    document.removeEventListener('touchend', handleInteractionEnd)
  }

  const updateSliderValue = (xCoords: number, yCoords: number) => {
    let position
    let lengthOrHeight
    const sliderInfo = getSliderBounds()
    if (sliderInfo == null) return
    if (!vertical) {
      position = xCoords - sliderInfo.left
      lengthOrHeight = sliderInfo.width
    } else {
      lengthOrHeight = sliderInfo.height
      position = lengthOrHeight - (yCoords - sliderInfo.top)
    }
    let percent = clampValue(+(position / lengthOrHeight).toFixed(2), 0, 1)
    if (reverse) percent = 1 - percent

    // convert percentage -> value then match value to notch as per props/state.step
    const rawValue = getValueFromProgress(percent, min, max)
    const value =
      findClosestNumber(ticks.length > 0 && snapToTicks ? ticks : steps, rawValue) ?? min
    setValue(value)
  }

  const handleKeyDownEvent: KeyboardEventHandler = (event) => {
    const isPositiveKey = event.key === 'ArrowUp' || event.key === 'ArrowRight'
    const isNegativeKey = event.key === 'ArrowLeft' || event.key === 'ArrowDown'
    if (!isNegativeKey && !isPositiveKey) return
    if (!event.repeat) handleChangeBegin()
    setDisplayLabel(true)
    event.preventDefault()
    if (isPositiveKey) {
      incrementValueByStep()
    } else if (isNegativeKey) {
      decrementValueByStep()
    }
  }

  const incrementValueByStep = () => {
    setValue((v) => clampValue(v + step, min, max))
  }

  const decrementValueByStep = () => {
    setValue((v) => clampValue(v - step, min, max))
  }

  const handleKeyUpEvent: KeyboardEventHandler = (event) => {
    const isPositiveKey = event.key === 'ArrowUp' || event.key === 'ArrowRight'
    const isNegativeKey = event.key === 'ArrowLeft' || event.key === 'ArrowDown'
    if (!isNegativeKey && !isPositiveKey) return
    setDisplayLabel(false)
    handleChangeComplete()
  }

  const thumbCentering = (sliderSize - thumbSize) * 0.5
  const thumbOffset = -thumbSize * 0.5
  const tickCentering = (sliderSize - tickSize) * 0.5
  const tickOffset = -tickSize * 0.5

  return (
    <EventWrapper
      vertical={vertical}
      eventWrapperPadding={eventWrapperPadding}
      onMouseDown={handleMouseInteractionStart}
      onTouchStart={handleTouchInteractionStart}
      onKeyDown={handleKeyDownEvent}
      onKeyUp={handleKeyUpEvent}
      tabIndex={0}
      data-testid="wrapper-events"
      className={className}
    >
      <SliderWrapper
        color={sliderColor}
        vertical={vertical}
        size={sliderSize}
        data-testid="wrapper-slider"
        ref={sliderRef}
      >
        <RangeSliderContextProvider
          value={{
            value,
            progress,
            min,
            max,
            step,
            vertical,
            reverse,
            sliderColor,
            trackColor,
            thumbColor,
            sliderSize,
            thumbSize,
            tickSize,
            labelTransitionStage,
          }}
        >
          {disableTrack === false && (
            <Track
              color={trackColor}
              vertical={vertical}
              reverse={reverse}
              percent={progress * 100}
              size={sliderSize}
            />
          )}
          {disableTicks === false &&
            ticks.map((t, i) => {
              const position = getProgress(t, min, max)
              return (
                <ThumbWrapper
                  key={i}
                  vertical={vertical}
                  percent={position * 100}
                  size={tickSize}
                  centering={tickCentering}
                  offset={tickOffset}
                  reverse={reverse}
                >
                  {CustomTick != null ? (
                    <CustomTick position={position} />
                  ) : (
                    <DefaultThumb color={sliderColor} size={tickSize} />
                  )}
                </ThumbWrapper>
              )
            })}
          {disableThumb === false && (
            <ThumbWrapper
              vertical={vertical}
              percent={progress * 100}
              size={thumbSize}
              centering={thumbCentering}
              offset={thumbOffset}
              reverse={reverse}
            >
              {shouldMountLabel &&
                (CustomLabel != null ? (
                  <CustomLabel />
                ) : (
                  <DefaultLabel
                    color={thumbColor}
                    size={thumbSize}
                    transitionStage={labelTransitionStage}
                  >
                    <span>{value}</span>
                  </DefaultLabel>
                ))}
              {CustomThumb != null ? (
                <CustomThumb />
              ) : (
                <DefaultThumb color={thumbColor} size={thumbSize} />
              )}
              <SliderOnboarding complete={hasValueChanged} vertical={vertical} />
            </ThumbWrapper>
          )}
        </RangeSliderContextProvider>
      </SliderWrapper>
    </EventWrapper>
  )
}

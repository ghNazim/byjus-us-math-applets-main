import { FC } from 'react'
import styled from 'styled-components'

import { PrimaryRangeSlider } from '@/atoms/RangeSlider'
import { useRangeSliderContext } from '@/atoms/RangeSlider/RangeSliderContext'
import { range } from '@/utils/math'
import { isString } from '@/utils/types'

import { RangeInputVerticalProps } from './RangeInputVertical.types'

const Container = styled.div`
  display: flex;
  width: 108px;
  height: 528px;
  align-items: stretch;
  justify-content: center;
  flex-direction: row;
  padding: 24px 14px 0px;
`

const SliderContainer = styled.div`
  height: 268px;
  flex-shrink: 0;
`

const DefaultLabel = styled.label`
  font-family: Nunito;
  font-size: 16px;
  font-weight: 700;
  line-height: 20px;
  text-align: center;
  color: #282828;
`

const TickContainer = styled.div`
  width: 12px;
  height: 12px;
`

const TickBar = styled.div<{ small: boolean }>`
  width: 2px;
  height: ${(props) => (props.small ? 6 : 16)}px;
  margin: ${(props) => (props.small ? 3 : 0)}px auto;
  border-radius: 1px;
  background-color: #646464;
  transform: rotate(90deg);
`

const TickLabel = styled.span`
  position: absolute;
  top: -48px;
  left: 50%;
  translate: -50%;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 400;
  font-size: 20px;
  line-height: 24px;
  width: 24px;
  text-align: center;
  color: #444444;
  opacity: 0;
`

const BoldTickLabel = styled(TickLabel)`
  font-weight: 700;
  top: -34px;
`

const Tick: FC<{ position: number }> = ({ position }) => {
  const { min, max, progress } = useRangeSliderContext()
  const isMinOrMax = position === 0 || position === 1
  return (
    <>
      <TickContainer>
        <TickBar small={isMinOrMax} />
      </TickContainer>
      {progress !== position && isMinOrMax && <TickLabel>{position === 0 ? min : max}</TickLabel>}
    </>
  )
}

const ActiveTickLabel: FC = () => {
  const { value } = useRangeSliderContext()
  return <BoldTickLabel>{value}</BoldTickLabel>
}

export const RangeInputVertical: FC<RangeInputVerticalProps> = ({
  label,
  showLabel = false,
  min = 0,
  max = 9,
  step = 1,
  value,
  defaultValue,
  className,
  ...callbacks
}) => {
  const Label = isString(label) ? () => <DefaultLabel>{label}</DefaultLabel> : label
  const ticks = range(max, min, step)
  return (
    <Container className={className} data-testid="range-input">
      <SliderContainer>
        <PrimaryRangeSlider
          min={min}
          max={max}
          step={step}
          value={value}
          sliderColor=" #C7C7C7"
          trackColor=" #C7C7C7"
          thumbColor="#2C2C2C"
          defaultValue={defaultValue}
          ticks={ticks}
          sliderSize={16}
          thumbSize={40}
          eventWrapperPadding={22}
          disableTrack={true}
          disableTicks={false}
          label="persistent"
          customTick={Tick}
          tickSize={12}
          customLabel={ActiveTickLabel}
          vertical={true}
          {...callbacks}
        />
      </SliderContainer>
      {showLabel && Label && <Label />}
    </Container>
  )
}

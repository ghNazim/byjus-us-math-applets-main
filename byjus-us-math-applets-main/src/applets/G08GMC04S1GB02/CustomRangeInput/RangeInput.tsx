import { FC } from 'react'
import styled from 'styled-components'

import { PrimaryRangeSlider } from '@/atoms/RangeSlider'
import { useRangeSliderContext } from '@/atoms/RangeSlider/RangeSliderContext'
import { range } from '@/utils/math'
import { isString } from '@/utils/types'

import { RangeInputProps } from './RangeInput.types'

const Container = styled.div`
  display: flex;
  width: 528px;
  height: 108px;
  align-items: stretch;
  justify-content: center;
  flex-direction: column;
  padding: 24px 14px 0px;
`

const SliderContainer = styled.div`
  height: 60px;
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
  height: ${(props) => (props.small ? 6 : 12)}px;
  margin: ${(props) => (props.small ? 3 : 0)}px auto;
  border-radius: 1px;
  background-color: ${(props) => props.theme.default};
`

const TickLabel = styled.span`
  position: absolute;
  display: inline-block;
  width: max-content;
  top: -28px;
  left: 50%;
  translate: -50%;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 400;
  font-size: 20px;
  line-height: 24px;
  height: 28px;
  text-align: center;
  color: #444444;
`

const BoldTickLabel = styled(TickLabel)`
  font-weight: 700;
`

const Tick: FC<{ position: number }> = ({ position }) => {
  const { progress } = useRangeSliderContext()
  const isMinOrMax = position === 0 || position === 1
  return (
    <>
      <TickContainer>
        <TickBar small={isMinOrMax} />
      </TickContainer>
      {progress !== position && isMinOrMax && (
        <TickLabel>{position === 0 ? 'Compress' : 'Enlarge'}</TickLabel>
      )}
    </>
  )
}

const ActiveTickLabel: FC = () => {
  const { progress } = useRangeSliderContext()
  const isMinOrMax = progress === 0 || progress === 1
  return (
    <>{isMinOrMax && <BoldTickLabel>{progress === 0 ? 'Compress' : 'Enlarge'}</BoldTickLabel>}</>
  )
}

export const RangeInput: FC<RangeInputProps> = ({
  label,
  showLabel = true,
  min = 0,
  max = 9,
  step = 1,
  value,
  defaultValue,
  className,
  disableTicks = false,
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
          defaultValue={defaultValue}
          ticks={ticks}
          sliderSize={16}
          thumbSize={40}
          eventWrapperPadding={22}
          disableTrack={true}
          disableTicks={disableTicks}
          label="persistent"
          customTick={Tick}
          tickSize={12}
          customLabel={ActiveTickLabel}
          {...callbacks}
        />
      </SliderContainer>
      {showLabel && Label && <Label />}
    </Container>
  )
}

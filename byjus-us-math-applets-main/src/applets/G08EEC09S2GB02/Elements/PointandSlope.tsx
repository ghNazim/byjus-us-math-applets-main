import { FC } from 'react'
import styled from 'styled-components'

import { FractionFormer } from './SlopeFormer'

const LineFlex = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`

const TextBox = styled.div<{ padding: boolean }>`
  text-align: center;
  color: #666;
  font-size: 24px;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  line-height: 28px;
  width: 100%;
  padding: ${(props) => (props.padding ? 10 : 0)}px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const CT = styled.div<{ color: string }>`
  color: ${(props) => props.color};

  display: flex;
  align-items: center;
  justify-content: center;
`

const PointandSlope: FC<{
  pointVal: { a: number; b: number }
  slopeVal: { numerator: number; denominator: number }
}> = ({ pointVal, slopeVal }) => {
  const fractionRetrieve = (numerator: string, denominator: string) => {
    return (
      <FractionFormer
        colorNum="#FF8F1F"
        colorDen="#FF8F1F"
        colorLine="#FF8F1F"
        numerator={numerator}
        denominator={denominator}
        size={20}
      />
    )
  }

  return (
    <LineFlex>
      <TextBox padding={false}>
        <CT color="#AA5EE0">
          Point:&nbsp;({pointVal.a},&nbsp;{pointVal.b})
        </CT>
        &nbsp;and&nbsp;
        <CT color="#FF8F1F">
          Slope:&nbsp;
          {slopeVal.denominator != 1
            ? fractionRetrieve(slopeVal.numerator.toString(), slopeVal.denominator.toString())
            : slopeVal.numerator.toString()}
        </CT>
      </TextBox>
    </LineFlex>
  )
}

export default PointandSlope

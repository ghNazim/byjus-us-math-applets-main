import { FC, ReactElement } from 'react'
import styled from 'styled-components'

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
`

const PointandSlope: FC<{ pointVal: { a: number; b: number }; slopeVal: ReactElement }> = ({
  pointVal,
  slopeVal,
}) => {
  return (
    <LineFlex>
      <TextBox padding={false}>
        <CT color="#AA5EE0">
          Point:&nbsp;({pointVal.a},&nbsp;{pointVal.b})
        </CT>
        &nbsp;and&nbsp;
        <CT color="#FF8F1F">Slope:&nbsp;{slopeVal}</CT>
      </TextBox>
    </LineFlex>
  )
}

export default PointandSlope

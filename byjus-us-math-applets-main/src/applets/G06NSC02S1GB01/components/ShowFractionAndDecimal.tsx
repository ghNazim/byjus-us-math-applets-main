import React from 'react'
import styled from 'styled-components'

import { ButtonTypes } from '../Applet'

interface props {
  val: number
  valType: ButtonTypes
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  align-items: center;
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
`

const HeadingBox = styled.div`
  background: #888888;
  border-radius: 10px;
  font-family: 'Nunito';

  line-height: 28px;
  text-align: center;
  padding: 25px 30px;
  color: white;
`

const ValueBox = styled.div<{ left: number }>`
  border: 1px solid #646464;
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;
  text-align: center;
  padding: 20px 30px;
  position: relative;
  left: ${(a) => a.left}px;
  z-index: -1;
  height: 70px;
  width: 120px;
  display: flex;
  justify-content: center;
  align-items: center;
`

const IndividualContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`

const ColoredSpan = styled.span<{ color: string }>`
  color: ${(a) => a.color};
`

const ShowFractionAndDecimal = ({ val, valType }: props) => {
  return (
    <Container>
      <IndividualContainer>
        <HeadingBox>Fraction</HeadingBox>
        <ValueBox left={-10}>
          <Fraction val={val} valType={valType} />
        </ValueBox>
      </IndividualContainer>
      =
      <IndividualContainer>
        <ValueBox left={10}>
          <Decimal val={val} valType={valType} />
        </ValueBox>
        <HeadingBox>Decimal</HeadingBox>
      </IndividualContainer>
    </Container>
  )
}

const Fraction = ({ val, valType }: props) => {
  const wholeNum = Math.floor(val / 100)

  const numerator = valType === '10 Divisions' ? (val / 10) % 100 : val % 1000
  const denominator = valType == '10 Divisions' ? 10 : 100
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ borderBottom: '2px solid #888888' }}>
          {/* <ColoredSpan color="#C882FA">{wholeNum > 0 ? wholeNum : undefined}</ColoredSpan> */}
          <ColoredSpan color="#FF8F1F">{numerator}</ColoredSpan>
        </div>
        <ColoredSpan style={{ paddingTop: '3px' }} color="#FF8F1F">
          {denominator}
        </ColoredSpan>
      </div>
    </div>
  )
}

const Decimal = ({ val, valType }: props) => {
  const wholeNum = Math.floor(val / 100)
  const decimal =
    (valType == '10 Divisions' ? val / 10 : val) % (valType === '10 Divisions' ? 10 : 100)
  const shouldRenderZero = val > 100 && val < 110
  const shouldRenderZeroII = val < 10
  const shouldRenderZeroIII = val > 200 && val < 210

  return (
    <div>
      {<ColoredSpan color="#C882FA">{wholeNum}</ColoredSpan>}.
      {shouldRenderZero && valType === '100 Divisions' && (
        <ColoredSpan color="#FF8F1F">0</ColoredSpan>
      )}
      {shouldRenderZeroII && valType === '100 Divisions' && (
        <ColoredSpan color="#FF8F1F">0</ColoredSpan>
      )}
      {shouldRenderZeroIII && valType === '100 Divisions' && (
        <ColoredSpan color="#FF8F1F">0</ColoredSpan>
      )}
      <ColoredSpan color="#FF8F1F">{decimal}</ColoredSpan>
    </div>
  )
}

export default ShowFractionAndDecimal

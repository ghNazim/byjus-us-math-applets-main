import { FC } from 'react'
import styled from 'styled-components'

import { SlopeDisplay } from './SlopeFormer'

export interface IColorBlock {
  primary: string
  secondary: string
}

const HighLight = styled.span<{ box: boolean; colorBlock: IColorBlock }>`
  color: ${(props) => props.colorBlock.primary};
  background-color: ${(props) => (props.box ? props.colorBlock.secondary : '#fff')};
  border-radius: ${(props) => (props.box ? 5 : 0)}px;
  padding-left: 5px;
  padding-right: 5px;
  margin-left: 5px;
  margin-right: 5px;
`

export const purpleBlock: IColorBlock = {
  primary: '#AA5EE0',
  secondary: '#F4E5FF',
}

export const orangeBlock: IColorBlock = {
  primary: '#FF8F1F',
  secondary: '#FFE9D4',
}

export const bnwBlock: IColorBlock = {
  primary: '#646464',
  secondary: '#fff',
}

export const redBlock: IColorBlock = {
  primary: '#CC6666',
  secondary: '#FFF2F2',
}

export const greenBlock: IColorBlock = {
  primary: '#6CA621',
  secondary: '#ECFFD9',
}

export const defaultBlock: IColorBlock = {
  primary: '#646464',
  secondary: '#FFFFFF',
}

const pointText = (
  <HighLight box={true} colorBlock={purpleBlock}>
    point
  </HighLight>
)

const slopeText = (
  <HighLight box={true} colorBlock={orangeBlock}>
    slope
  </HighLight>
)

const riseText = (
  <HighLight box={true} colorBlock={orangeBlock}>
    rise
  </HighLight>
)

const runText = (
  <HighLight box={true} colorBlock={orangeBlock}>
    run
  </HighLight>
)

export const textHolder = [
  <>
    To plot the line, find the the two points using {pointText} and {slopeText}
  </>,
  <>Enter the {pointText} value</>, //1
  <>Let’s give it another shot!</>, //2
  <>Great job! Now, let’s find the {slopeText}</>, //3
  <>
    Enter the {riseText} and {runText} value
  </>, //4
  <>Let’s give it another shot!</>,
  <>Bravo! Now, let’s plot the line.</>,
  <>Find the {pointText} on the graph and move your pointer.</>, //5
  <>Oops! The pointer isn’t at the {pointText}. Let&apos;s correct that</>,
  <>Perfect! Let’s now move to the second point. </>, //6
  <>
    Now, use {riseText} and {runText} to find second point and move your pointer.
  </>, //7
  <>
    Oops! That’s incorrect. Use {riseText} and {runText} to find second point.
  </>,
  <>Perfect! The second point is set correctly.</>,
  <>Now, generate line between these two points.</>,
  <>Brilliant work! You’ve successfully plotted the line.</>,
  <>Brilliant work! You’ve successfully plotted the line.</>,
]

const BoxHolder = styled.div`
  width: 100%;
  height: 98px;

  display: flex;
  flex-direction: row;
  align-content: center;
  justify-content: center;
  gap: 20px;
`

const Box = styled.div<{ colorBlock: IColorBlock }>`
  width: 330px;
  height: 88px;
  background-color: ${(props) => props.colorBlock.secondary};
  color: ${(props) => props.colorBlock.primary};

  font-family: 'Nunito';
  font-style: normal;
  font-weight: 400;
  font-size: 24px;
  line-height: 32px;

  border-radius: 8px;

  display: flex;
  align-items: center;
  justify-content: center;
`

export const InfoHolder: FC<{
  pointVal: { a: number; b: number }
  slopeVals: { numerator: number; denominator: number }
  colorBoxii: { interceptBox: IColorBlock; slopeBox: IColorBlock }
}> = ({ slopeVals, colorBoxii, pointVal }) => {
  return (
    <BoxHolder>
      <Box colorBlock={colorBoxii.interceptBox}>
        Point : ({pointVal.a},{pointVal.b})
      </Box>
      <Box colorBlock={colorBoxii.slopeBox}>
        <SlopeDisplay
          mini={true}
          denominator={slopeVals.denominator}
          numerator={slopeVals.numerator}
        />{' '}
      </Box>
    </BoxHolder>
  )
}

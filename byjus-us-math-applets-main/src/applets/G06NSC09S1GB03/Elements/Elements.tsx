import { FC } from 'react'
import styled from 'styled-components'

import { orangeBlock, purpleBlock } from '@/applets/G08EEC07S1GB01/assets/Elements'

const ColoredSpan = styled.span<{ color: string }>`
  color: ${(props) => props.color};
`

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

const OutlineSpan: FC<{ text: string; colorBlock: IColorBlock }> = ({ text, colorBlock }) => (
  <HighLight box={true} colorBlock={colorBlock}>
    {text}
  </HighLight>
)

const DefaultSpan = styled.div`
  color: #444444;
  line-height: 44px;
`

export const Texts = [
  <DefaultSpan key={0}>
    On reflecting the point (<ColoredSpan color="#FF8F1F">4</ColoredSpan>,{' '}
    <ColoredSpan color="#AA5EE0">3</ColoredSpan>) across x-axis:
    <br />
    <OutlineSpan text="x coordinate remains same" colorBlock={orangeBlock} />
    ,
    <OutlineSpan text="y coordinate becomes opposite" colorBlock={purpleBlock} />
  </DefaultSpan>,
  <DefaultSpan key={1}>
    On reflecting the point (<ColoredSpan color="#FF8F1F">4</ColoredSpan>,{' '}
    <ColoredSpan color="#AA5EE0">3</ColoredSpan>) across y-axis:
    <br />
    <OutlineSpan text="x coordinate becomes opposite" colorBlock={orangeBlock} />
    ,
    <OutlineSpan text="y coordinate remains same" colorBlock={purpleBlock} />
  </DefaultSpan>,
  <DefaultSpan key={2}>
    On reflecting the point (<ColoredSpan color="#FF8F1F">4</ColoredSpan>,{' '}
    <ColoredSpan color="#AA5EE0">3</ColoredSpan>) across both x-axis and y-axis:
    <br />
    <OutlineSpan text="x coordinate becomes opposite" colorBlock={orangeBlock} />
    ,
    <OutlineSpan text="y coordinate becomes opposite" colorBlock={purpleBlock} />
  </DefaultSpan>,
  <DefaultSpan key={3}>
    Select an axis to reflect the point (<ColoredSpan color="#FF8F1F">4</ColoredSpan>,{' '}
    <ColoredSpan color="#AA5EE0">3</ColoredSpan>).
  </DefaultSpan>,
]

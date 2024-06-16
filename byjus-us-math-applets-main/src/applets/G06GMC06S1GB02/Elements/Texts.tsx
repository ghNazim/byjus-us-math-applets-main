import styled from 'styled-components'

import { IColorBlock } from '@/applets/G08EEC07S1GB01/assets/Elements'

const greyBlock: IColorBlock = {
  primary: '#fff',
  secondary: '#646464',
}

const tealBlock: IColorBlock = {
  primary: '#2D6066',
  secondary: '#F1FDFF',
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

export const Texts = [
  <>Tap to unfold the square pyramid.</>,
  <>
    A square pyramid has&nbsp;
    <HighLight box={true} colorBlock={greyBlock}>
      4 congruent lateral faces
    </HighLight>
    <br />
    and&nbsp;
    <HighLight box={true} colorBlock={tealBlock}>
      1 square base.
    </HighLight>
  </>,
]

import styled from 'styled-components'

export interface IColorBlock {
  primary: string
  secondary: string
}

export const purpleBlock: IColorBlock = {
  primary: '#AA5EE0',
  secondary: '#F4E5FF',
}

export const orangeBlock: IColorBlock = {
  primary: '#D97A1A',
  secondary: '#FFEDB8',
}

export const blueBlock: IColorBlock = {
  primary: '#fff',
  secondary: '#6595DE',
}

export const cyanBlock: IColorBlock = {
  primary: '#1CB9D9',
  secondary: '#E7FBFF',
}

// export const greenBlock: IColorBlock = {
//   primary: '#6CA621',
//   secondary: '#ECFFD9',
// }

// export const defaultBlock: IColorBlock = {
//   primary: '#646464',
//   secondary: '#FFFFFF',
// }

export const HighLight = styled.span<{ box: boolean; colorBlock: IColorBlock }>`
  color: ${(props) => props.colorBlock.primary};
  background-color: ${(props) => (props.box ? props.colorBlock.secondary : '#fff')};
  border-radius: ${(props) => (props.box ? 5 : 0)}px;
  padding-left: 5px;
  padding-right: 5px;
  margin-left: 5px;
  margin-right: 5px;
`

const td = (
  <HighLight box={true} colorBlock={purpleBlock}>
    (t,d)
  </HighLight>
)

const sBlock = (
  <HighLight box={true} colorBlock={blueBlock}>
    s
  </HighLight>
)

const straightLine = (
  <HighLight box={true} colorBlock={orangeBlock}>
    straight line
  </HighLight>
)

const passing = (
  <HighLight box={true} colorBlock={cyanBlock}>
    passes through the origin (0,0)
  </HighLight>
)

export const textHolder = [
  <>
    To generate the coordinate points {td}, select a value for speed {sBlock}
  </>,
  <>Let’s plot the graph using the coordinate obtained in the table.</>, //1
  <>
    Observe that the line formed is a {straightLine}
    <br /> and {passing}
  </>, //2
  <>
    To generate the coordinate points {td}, select a value for speed {sBlock}
  </>, //3
  <>Tap the generate button to fill the table with the selected value of ‘s’.</>, //4
]

import { animated, useTransition } from '@react-spring/web'
import { FC, ReactElement, ReactPortal } from 'react'
import styled from 'styled-components'

import { Math } from '@/common/Math'
import { interleave } from '@/utils/array'

import { Expanded, Exponent } from './Exponent'
import { cellTextMixin, COLOR_1, COLOR_2 } from './ExponentTable.styles'
import { ExpandedCellProps, FinalCellProps, ValueCellProps } from './ExponentTable.types'

const PRODUCT_SYMBOL = '×'

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0px;
  gap: 8px;
  ${cellTextMixin}
`

interface ProductProps {
  operands: (ReactPortal | ReactElement)[]
}

export const Product: FC<ProductProps> = ({ operands }) => {
  const interleavedArray = [
    ...interleave(
      operands,
      Array.from({ length: operands.length - 1 }, (_, i) => (
        <span key={operands.length + i}>{PRODUCT_SYMBOL}</span>
      )),
    ),
  ]

  return <Container>{interleavedArray}</Container>
}

export const ValueProduct: FC<ValueCellProps> = ({ a, m, n }) => (
  <Product
    operands={[
      <Exponent
        key={0}
        base={a !== 0 ? a.toString() : 'a'}
        power={m !== 0 ? m.toString() : 'm'}
        powerColor={COLOR_1}
      />,
      <Exponent
        key={1}
        base={a !== 0 ? a.toString() : 'a'}
        power={n !== 0 ? n.toString() : 'n'}
        powerColor={COLOR_2}
      />,
    ]}
  />
)

export const ExpandedProduct: FC<ExpandedCellProps> = ({ a, m, n }) => (
  <Product
    operands={[
      <Expanded key={0} base={a} power={m} powerColor={COLOR_1} />,
      <Expanded key={1} base={a} power={n} powerColor={COLOR_2} />,
    ]}
  />
)

export const FinalProduct: FC<FinalCellProps> = ({ a, m, n, showFull }) => {
  const transition = useTransition(showFull, {
    from: { opacity: 0, size: 0 },
    enter: { opacity: 1, size: 1 },
    leave: { opacity: 1, size: 0 },
    exitBeforeEnter: true,
  })

  const mBox = String.raw`{\colorbox{${COLOR_1}}{\color{white} ${m}}}`
  const nBox = String.raw`{\colorbox{${COLOR_2}}{\color{white} ${n}}}`

  return transition((style, show) => (
    <animated.div style={style}>
      <Math>{show ? `${a}^{ ${mBox}~ + ${nBox}} = ${a}^{${m + n}}` : `${a}^{${m + n}}`}</Math>
    </animated.div>
  ))
}

export const ProductFeedBackFromValues: FC<{ valueA: number; valueM: number; valueN: number }> = ({
  valueA,
  valueM,
  valueN,
}) => {
  return (
    <>
      The product of <Math>{String.raw`\mathbf{ ${valueA}^{\color{${COLOR_1}} ${valueM}} }`}</Math>{' '}
      and <Math>{String.raw`\mathbf{ ${valueA}^{\color{${COLOR_2}} ${valueN}} }`}</Math> is{' '}
      <Math>{String.raw`\mathbf{ ${valueA}^{${valueM + valueN}} }`}</Math>.
    </>
  )
}

export const ProductConclusionText: FC = () => {
  return (
    <>
      <Math>{String.raw`\mathbf{ a^{\color{${COLOR_1}} m} \times a^{\color{${COLOR_2}} n} = a^{{\color{${COLOR_1}} m} + {\color{${COLOR_2}} n}} }`}</Math>{' '}
      <br />
      The base remains same, and the powers are added together.
    </>
  )
}

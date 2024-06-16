import { animated, useTransition } from '@react-spring/web'
import { FC, ReactNode, useState } from 'react'
import styled from 'styled-components'

import { Math } from '@/common/Math'
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect'
import { interleave } from '@/utils/array'

import { Expanded, Exponent } from './Exponent'
import { cellTextMixin, COLOR_1, COLOR_2 } from './ExponentTable.styles'
import { ExpandedCellProps, FinalCellProps, ValueCellProps } from './ExponentTable.types'

const DIVISION_SYMBOL = '÷'

export const HLine = styled.div`
  background: #646464;
  width: 100%;
  height: 1px;
`

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0px;
  gap: 8px;
  ${cellTextMixin}
`

const FractionContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0px;
  ${cellTextMixin}
`

interface DivisionProps {
  operands: ReactNode[]
}

export const Division: FC<DivisionProps> = ({ operands }) => {
  const [interleavedArray, setInterleavedArray] = useState<ReactNode[]>([])

  useIsomorphicLayoutEffect(() => {
    setInterleavedArray([
      ...interleave(
        operands,
        Array.from({ length: operands.length - 1 }, (_, i) => (
          <span key={operands.length + i}>{DIVISION_SYMBOL}</span>
        )),
      ),
    ])
  }, [operands])

  return <Container>{interleavedArray}</Container>
}

export const Fraction: FC<{ numerator: ReactNode; denominator: ReactNode }> = ({
  numerator,
  denominator,
}) => {
  return (
    <FractionContainer>
      {numerator}
      <HLine />
      {denominator}
    </FractionContainer>
  )
}

export const ValueDivision: FC<ValueCellProps> = ({ a, m, n }) => {
  return (
    <Division
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
}

export const ExpandedDivision: FC<ExpandedCellProps> = ({ a, m, n }) => (
  <Fraction
    numerator={<Expanded base={a} power={m} powerColor={COLOR_1} />}
    denominator={<Expanded base={a} power={n} powerColor={COLOR_2} below={true} />}
  />
)

export const FinalDivision: FC<FinalCellProps> = ({ a, m, n, showFull }) => {
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
      <Math>{show ? `${a}^{ ${mBox}~ - ${nBox}} = ${a}^{${m - n}}` : `${a}^{${m - n}}`}</Math>
    </animated.div>
  ))
}

export const DivisionFeedBackFromValues: FC<{ valueA: number; valueM: number; valueN: number }> = ({
  valueA,
  valueM,
  valueN,
}) => {
  return (
    <>
      The quotient of <Math>{String.raw`\mathbf{ ${valueA}^{\color{${COLOR_1}} ${valueM}} }`}</Math>{' '}
      and <Math>{String.raw`\mathbf{ ${valueA}^{\color{${COLOR_2}} ${valueN}} }`}</Math> is{' '}
      <Math>{String.raw`\mathbf{ ${valueA}^{${valueM - valueN}} }`}</Math>.
    </>
  )
}

export const DivisionConclusionText: FC = () => {
  return (
    <>
      <Math>{String.raw`\mathbf{ a^{\color{${COLOR_1}} m} \div a^{\color{${COLOR_2}} n} = a^{{\color{${COLOR_1}} m} - {\color{${COLOR_2}} n}} }`}</Math>{' '}
      <br />
      The base remains same, and the powers are subtracted from each other.
    </>
  )
}

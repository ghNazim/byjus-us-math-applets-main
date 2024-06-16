import { animated, useTransition } from '@react-spring/web'
import { FC, ReactNode } from 'react'
import styled from 'styled-components'

import { Math } from '@/common/Math'

import { ExpandDisplay, Expanded, Exponent } from './Exponent'
import { cellTextMixin, COLOR_1, COLOR_2 } from './ExponentTable.styles'
import { ExpandedCellProps, FinalCellProps, ValueCellProps } from './ExponentTable.types'
import leftBrace from './leftBrace.svg'
import { Product } from './Product'
import rightBrace from './rightBrace.svg'

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0px;
  gap: 8px;

  ${cellTextMixin}
`
const Empty = styled.div`
  width: 4px;
`

const PowerContainer = styled.div<{ backgroundColor: string }>`
  position: absolute;
  right: -24px;
  bottom: 49px;
  padding: 0px 6px;
  background: ${(props) => props.backgroundColor};
  border-radius: 4px;
  color: white;
`

interface PowerProps {
  base: ReactNode
  power: number | string
  powerColor: string
}

const ExpandedContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: stretch;
  ${cellTextMixin}
`

export const Power: FC<PowerProps> = ({ base, power, powerColor }) => {
  return (
    <Container>
      <img src={leftBrace} />
      {base}
      <Empty />
      <img src={rightBrace} />
      <PowerContainer backgroundColor={powerColor}>{power}</PowerContainer>
    </Container>
  )
}

export const ValuePower: FC<ValueCellProps> = ({ a, m, n }) => (
  <Power
    base={
      <Exponent
        base={a !== 0 ? a.toString() : 'a'}
        power={m !== 0 ? m.toString() : 'm'}
        powerColor={COLOR_1}
      />
    }
    power={n !== 0 ? n.toString() : 'n'}
    powerColor={COLOR_2}
  />
)

export const ExpandedPower: FC<ExpandedCellProps> = ({ a, m, n }) => (
  <ExpandedContainer>
    <Product
      operands={Array.from({ length: n }, (_, i) => (
        <Container key={i}>
          &#40;
          <Expanded
            key={0}
            base={a}
            power={m}
            powerColor={COLOR_1}
            below={true}
            showRange={i === 0}
          />
          &#41;
        </Container>
      ))}
    />
    <ExpandDisplay value={n} color={COLOR_2} below={false} />
  </ExpandedContainer>
)

export const FinalPower: FC<FinalCellProps> = ({ a, m, n, showFull }) => {
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
      <Math>
        {show ? String.raw`${a}^{ ${mBox}~\times ${nBox}} = ${a}^{${m * n}}` : `${a}^{${m * n}}`}
      </Math>
    </animated.div>
  ))
}

export const PowerFeedBackFromValues: FC<{ valueA: number; valueM: number; valueN: number }> = ({
  valueA,
  valueM,
  valueN,
}) => {
  return (
    <>
      The simplification of{' '}
      <Math>{String.raw`\mathbf{\left(${valueA}^{\color{${COLOR_1}} ${valueM}}\right)^{\color{${COLOR_2}} ${valueN}} }`}</Math>
      &nbsp;is <Math>{String.raw`\mathbf{ ${valueA}^${valueM * valueN}}`}</Math>.
    </>
  )
}

export const PowerConclusionText: FC = () => {
  return (
    <>
      <Math>{String.raw`\mathbf{ \left(a^{\color{${COLOR_1}} m}\right)^{\color{${COLOR_2}} n} = a^{{\color{${COLOR_1}} m} \times {\color{${COLOR_2}} n}} }`}</Math>{' '}
      <br />
      The base remains same, and the powers are multiplied together.
    </>
  )
}

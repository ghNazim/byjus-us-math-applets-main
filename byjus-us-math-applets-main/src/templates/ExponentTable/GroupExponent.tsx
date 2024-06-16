import { animated, useIsomorphicLayoutEffect, useSprings } from '@react-spring/web'
import { FC, ReactElement, useRef, useState } from 'react'
import styled from 'styled-components'

import { Math } from '@/common/Math'

import { Division, Fraction } from './Division'
import { cellTextMixin, COLOR_1, COLOR_2 } from './ExponentTable.styles'
import {
  ExpandedCellProps,
  FinalCellProps,
  GroupExponentProps,
  ValueCellProps,
} from './ExponentTable.types'
import { Product } from './Product'

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0px;
  gap: 2px;
  ${cellTextMixin}
`

const PowerContainer = styled.div`
  position: absolute;
  right: -24px;
  bottom: 24px;
  padding: 0px 6px;
  border: 1px dashed #b3b1b1;
  border-radius: 4px;
  font-size: 16px;
`
const BaseContainer = styled.div<{ backgroundColor: string }>`
  position: relative;
  height: 32px;
  padding: 2px 8px;
  background: ${(props) => props.backgroundColor};
  border-radius: 4px;
  color: white;
`
const ExpandedContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: stretch;
  ${cellTextMixin}
`
const ExpandedRangeIndicator = styled.div<{ below: boolean }>`
  position: absolute;
  ${(props) => (props.below ? 'top: 28px' : 'bottom: 28px')};
  width: 100%;
  border: 1px dashed #c7c7c7;
  ${(props) => (props.below ? 'border-top: none' : 'border-bottom: none')};
  height: 12px;
`
const ExpandedPowerContainer = styled.div<{ below: boolean }>`
  position: absolute;
  left: 50%;
  translate: -50%;
  ${(props) => (props.below ? 'top: 28px' : 'bottom: 28px')};
  padding: 0px 6px;
  border: 1px dashed #b3b1b1;
  border-radius: 4px;
  font-size: 16px;
`

export const GroupExponent: FC<GroupExponentProps<string>> = ({
  base1,
  base2,
  baseColor1,
  baseColor2,
  power,
  operator,
}) => {
  return (
    <Container>
      &#40;
      {operator === 'product' ? (
        <Product
          operands={[
            <BaseContainer key={0} backgroundColor={baseColor1}>
              {base1}
            </BaseContainer>,
            <BaseContainer key={1} backgroundColor={baseColor2}>
              {base2}
            </BaseContainer>,
          ]}
        />
      ) : (
        <Division
          operands={[
            <BaseContainer key={0} backgroundColor={baseColor1}>
              {base1}
            </BaseContainer>,
            <BaseContainer key={1} backgroundColor={baseColor2}>
              {base2}
            </BaseContainer>,
          ]}
        />
      )}
      &#41;
      <PowerContainer>{power}</PowerContainer>
    </Container>
  )
}

export const ValueProductGroup: FC<ValueCellProps> = ({ a, m, n }) => (
  <GroupExponent
    base1={a !== 0 ? a.toString() : 'a'}
    base2={m !== 0 ? m.toString() : 'm'}
    baseColor1={COLOR_1}
    baseColor2={COLOR_2}
    power={n !== 0 ? n.toString() : 'n'}
    operator="product"
  />
)

export const ValueDivisionGroup: FC<ValueCellProps> = ({ a, m, n }) => (
  <GroupExponent
    base1={a !== 0 ? a.toString() : 'a'}
    base2={m !== 0 ? m.toString() : 'm'}
    baseColor1={COLOR_1}
    baseColor2={COLOR_2}
    power={n !== 0 ? n.toString() : 'n'}
    operator="division"
  />
)

const Colored = styled(animated.span)<{ color: string }>`
  color: ${(props) => props.color};
`

interface ExpandDisplayProps {
  value: number
  below: boolean
}

export const ExpandDisplay: FC<ExpandDisplayProps> = ({ value, below }) => {
  return (
    <>
      <ExpandedRangeIndicator below={below} />
      <ExpandedPowerContainer below={below}>{value}</ExpandedPowerContainer>
    </>
  )
}

export const ExpandedProductGroup: FC<ExpandedCellProps> = ({ a, m, n, springRef }) => {
  const elementRefs = useRef<(HTMLSpanElement | null)[]>([])
  const [moveStarted, setMoveStarted] = useState(false)
  const [offsets, setOffsets] = useState<number[]>([])
  const [startPositions, setStartPositions] = useState<number[]>([])

  const getXPositions = () => {
    return elementRefs.current.map((el) => el?.getBoundingClientRect().left ?? 0)
  }

  useIsomorphicLayoutEffect(() => {
    setStartPositions(getXPositions())
    setMoveStarted(true)
  }, [])

  useIsomorphicLayoutEffect(() => {
    if (moveStarted && offsets.length === 0) {
      const endPositions = getXPositions()
      setOffsets(endPositions.map((end, i) => startPositions[i] - end))
      setMoveStarted(false)
    }
  }, [moveStarted])

  const [styles] = useSprings(
    2 * n + 1,
    (i, ctrl) => ({
      ref: springRef,
      from: { opacity: 1, offset: 0, powerOpacity: 0 },
      to: async (next) => {
        await next({ opacity: 0 })
        setMoveStarted(true)
        ctrl.set({ offset: offsets[i] })
        await next({ offset: 0 })
        await next({ powerOpacity: 1 })
      },
    }),
    [offsets],
  )

  const aElements: ReactElement[] = Array.from({ length: n }, (_, i) => (
    <Colored
      style={{ translate: styles[i].offset }}
      color={COLOR_1}
      key={`a_${i}`}
      ref={(ref) => (elementRefs.current[i] = ref)}
    >
      {a}
    </Colored>
  ))
  const mElements: ReactElement[] = Array.from({ length: n }, (_, i) => (
    <Colored
      style={{ translate: styles[n + i].offset }}
      color={COLOR_2}
      key={`m_${i}`}
      ref={(ref) => (elementRefs.current[n + i] = ref)}
    >
      {m}
    </Colored>
  ))

  return (
    <Product
      operands={
        moveStarted
          ? [
              <ExpandedContainer key={0}>
                <Product operands={aElements} />
                <animated.div style={{ opacity: styles[2 * n].powerOpacity }}>
                  <ExpandDisplay value={n} below={false} />
                </animated.div>
              </ExpandedContainer>,
              <ExpandedContainer key={1}>
                <Product operands={mElements} />
                <animated.div style={{ opacity: styles[2 * n].powerOpacity }}>
                  <ExpandDisplay value={n} below={false} />
                </animated.div>
              </ExpandedContainer>,
            ]
          : Array.from({ length: n }, (_, i) => (
              <Container key={i}>
                <animated.span style={{ opacity: styles[2 * n].opacity }}>&#40;</animated.span>
                <Product operands={[aElements[i], mElements[i]]} />
                <animated.span style={{ opacity: styles[2 * n].opacity }}>&#41;</animated.span>
              </Container>
            ))
      }
    />
  )
}

export const ExpandedDivisionGroup: FC<ExpandedCellProps> = ({ a, m, n, springRef }) => {
  const elementRefs = useRef<(HTMLSpanElement | null)[]>([])
  const [moveStarted, setMoveStarted] = useState(false)
  const [offsets, setOffsets] = useState<number[]>([])
  const [startPositions, setStartPositions] = useState<number[]>([])

  const getXPositions = () => {
    return elementRefs.current.map((el) => el?.getBoundingClientRect().left ?? 0)
  }

  useIsomorphicLayoutEffect(() => {
    setStartPositions(getXPositions())
    setMoveStarted(true)
  }, [])

  useIsomorphicLayoutEffect(() => {
    if (moveStarted && offsets.length === 0) {
      const endPositions = getXPositions()
      setOffsets(endPositions.map((end, i) => startPositions[i] - end))
      setMoveStarted(false)
    }
  }, [moveStarted])

  const [styles] = useSprings(
    2 * n + 1,
    (i, ctrl) => ({
      ref: springRef,
      from: { opacity: 1, offset: 0, powerOpacity: 0 },
      to: async (next) => {
        await next({ opacity: 0 })
        setMoveStarted(true)
        ctrl.set({ offset: offsets[i] })
        await next({ offset: 0 })
        await next({ powerOpacity: 1 })
      },
    }),
    [offsets],
  )

  const aElements: ReactElement[] = Array.from({ length: n }, (_, i) => (
    <Colored
      style={{ translate: styles[i].offset }}
      color={COLOR_1}
      key={`a_${i}`}
      ref={(ref) => (elementRefs.current[i] = ref)}
    >
      {a}
    </Colored>
  ))
  const mElements: ReactElement[] = Array.from({ length: n }, (_, i) => (
    <Colored
      style={{ translate: styles[n + i].offset }}
      color={COLOR_2}
      key={`m_${i}`}
      ref={(ref) => (elementRefs.current[n + i] = ref)}
    >
      {m}
    </Colored>
  ))

  return moveStarted ? (
    <Fraction
      numerator={
        <ExpandedContainer>
          <Product operands={aElements} />
          <animated.div style={{ opacity: styles[2 * n].powerOpacity }}>
            <ExpandDisplay value={n} below={false} />
          </animated.div>
        </ExpandedContainer>
      }
      denominator={
        <ExpandedContainer>
          <Product operands={mElements} />
          <animated.div style={{ opacity: styles[2 * n].powerOpacity }}>
            <ExpandDisplay value={n} below={true} />
          </animated.div>
        </ExpandedContainer>
      }
    />
  ) : (
    <Product
      operands={Array.from({ length: n }, (_, i) => (
        <Container key={i}>
          <animated.span style={{ opacity: styles[2 * n].opacity }}>&#40;</animated.span>
          <Fraction numerator={aElements[i]} denominator={mElements[i]} />
          <animated.span style={{ opacity: styles[2 * n].opacity }}>&#41;</animated.span>
        </Container>
      ))}
    />
  )
}

export const FinalProductGroup: FC<FinalCellProps> = ({ a, m, n }) => {
  return (
    <Product
      operands={[
        <Container key={0}>
          <BaseContainer backgroundColor={COLOR_1}> {a}</BaseContainer>
          <PowerContainer>{n}</PowerContainer>
        </Container>,
        <Container key={1}>
          <BaseContainer backgroundColor={COLOR_2}> {m}</BaseContainer>
          <PowerContainer>{n}</PowerContainer>
        </Container>,
      ]}
    />
  )
}

export const FinalDivisionGroup: FC<FinalCellProps> = ({ a, m, n }) => {
  return (
    <Division
      operands={[
        <Container key={0}>
          <BaseContainer backgroundColor={COLOR_1}> {a}</BaseContainer>
          <PowerContainer>{n}</PowerContainer>
        </Container>,
        <Container key={1}>
          <BaseContainer backgroundColor={COLOR_2}> {m}</BaseContainer>
          <PowerContainer>{n}</PowerContainer>
        </Container>,
      ]}
    />
  )
}

export const ProductGroupFeedBackFromValues: FC<{
  valueA: number
  valueM: number
  valueN: number
}> = ({ valueA, valueM, valueN }) => {
  const a = String.raw`{\color{${COLOR_1}} ${valueA}}`
  const b = String.raw`{\color{${COLOR_2}} ${valueM}}`
  return (
    <>
      The expansion of{' '}
      <Math>{String.raw`\mathbf{ \left(${a} \times ${b} \right)^{ ${valueN}} }`}</Math> is{' '}
      <Math>{String.raw`\mathbf{ ${a}^{${valueN}}\times ${b}^{${valueN}} }`}</Math>.
    </>
  )
}

export const ProductGroupConclusionText: FC = () => {
  const a = String.raw`{\color{${COLOR_1}} a}`
  const b = String.raw`{\color{${COLOR_2}} b}`
  return (
    <>
      <Math>{String.raw`\mathbf{ \left(${a} \times ${b}\right)^m = ${a}^m \times ${b}^m }`}</Math>{' '}
      <br />
      Powers are distributed across individual bases.
    </>
  )
}

export const DivisionGroupFeedBackFromValues: FC<{
  valueA: number
  valueM: number
  valueN: number
}> = ({ valueA, valueM, valueN }) => {
  const a = String.raw`{\color{${COLOR_1}} ${valueA}}`
  const b = String.raw`{\color{${COLOR_2}} ${valueM}}`
  return (
    <>
      The expansion of{' '}
      <Math>{String.raw`\mathbf{ \left(${a} \div ${b}\right)^{ ${valueN}} }`}</Math> is{' '}
      <Math>{String.raw`\mathbf{ ${a}^{${valueN}}\div ${b}^{${valueN}} }`}</Math>.
    </>
  )
}

export const DivisionGroupConclusionText: FC = () => {
  const a = String.raw`{\color{${COLOR_1}} a}`
  const b = String.raw`{\color{${COLOR_2}} b}`
  return (
    <>
      <Math>{String.raw`\mathbf{ \left(${a} \div ${b}\right)^m = ${a}^m\div ${b}^m }`}</Math> <br />
      Powers are distributed across individual bases.
    </>
  )
}

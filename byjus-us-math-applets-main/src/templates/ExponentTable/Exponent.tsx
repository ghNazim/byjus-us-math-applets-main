import { animated, useTransition } from '@react-spring/web'
import { FC } from 'react'
import styled from 'styled-components'

import { cellTextMixin } from './ExponentTable.styles'
import { ExpandedProps, ExponentProps } from './ExponentTable.types'
import { Product } from './Product'

const Container = styled.div`
  width: 35px;
  ${cellTextMixin}
`

const BaseContainer = styled.div`
  position: relative;
  height: 32px;
  padding: 2px 8px;
  border: 1px dashed #b3b1b1;
  border-radius: 4px;
`
const PowerContainer = styled.div<{ backgroundColor: string }>`
  position: absolute;
  left: 20px;
  bottom: 22px;
  padding: 0px 6px;
  background: ${(props) => props.backgroundColor};
  border-radius: 4px;
  font-size: 16px;
  color: white;
`

const ExpandedContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  height: 28px;
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

const ExpandedBaseContainer = styled.div<{ color: string }>`
  .exp-base {
    color: ${(props) => props.color};
  }
`

const ExpandedPowerContainer = styled.div<{
  backgroundColor: string
  below: boolean
}>`
  position: absolute;
  left: 50%;
  translate: -50%;
  ${(props) => (props.below ? 'top: 28px' : 'bottom: 28px')};
  padding: 0px 6px;
  background: ${(props) => props.backgroundColor};
  border-radius: 4px;
  color: white;
  font-size: 16px;
`

export const Exponent: FC<ExponentProps<string>> = ({ base, power, powerColor }) => {
  return (
    <Container>
      <BaseContainer>
        {base}
        <PowerContainer backgroundColor={powerColor}>{power}</PowerContainer>
      </BaseContainer>
    </Container>
  )
}

interface ExpandDisplayProps {
  value: number
  color: string
  below: boolean
}

export const ExpandDisplay: FC<ExpandDisplayProps> = ({ value, color, below }) => {
  return (
    <>
      <ExpandedRangeIndicator below={below} />
      <ExpandedPowerContainer below={below} backgroundColor={color}>
        {value}
      </ExpandedPowerContainer>
    </>
  )
}

export const Expanded: FC<ExpandedProps> = ({
  base,
  power,
  powerColor,
  below = false,
  showRange = true,
}) => {
  const transition = useTransition(showRange, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 1 },
    delay: 300,
  })
  return (
    <ExpandedContainer>
      <ExpandedBaseContainer color={powerColor}>
        <Product
          operands={Array.from({ length: power }, (_, i) => (
            <span className="exp-base" key={i}>
              {base}
            </span>
          ))}
        />
      </ExpandedBaseContainer>
      {transition((style, show) => (
        <animated.div style={style}>
          {show && <ExpandDisplay below={below} value={power} color={powerColor} />}
        </animated.div>
      ))}
    </ExpandedContainer>
  )
}

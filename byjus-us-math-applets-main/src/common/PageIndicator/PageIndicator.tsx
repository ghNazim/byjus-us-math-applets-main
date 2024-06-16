import React from 'react'
import styled from 'styled-components'

import { PageIndicatorProps } from './PageIndicator.types'

const Indicator = styled.div`
  background-color: ${(props) => props.theme.default};
  height: 8px;
  width: 8px;
  border-radius: 50%;
  transition: 0.3s;

  &.previous {
    background-color: #64646490;
  }

  &.next {
    background-color: #ececec;
  }

  &.active {
    height: 12px;
    width: 12px;
    background-color: ${(props) => props.theme.default};
    transition: 0.5s;
  }
`
const Container = styled.div`
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  margin: 4px;
`

export const PageIndicator: React.FC<PageIndicatorProps> = ({ total, active = 0, className }) => {
  const indicators = []
  for (let i = 0; i < total; i++) {
    indicators.push(
      <Indicator key={i} className={i < active ? 'previous' : i > active ? 'next' : 'active'} />,
    )
  }
  return (
    <Container data-testid="PageIndicator" className={className}>
      {indicators}
    </Container>
  )
}

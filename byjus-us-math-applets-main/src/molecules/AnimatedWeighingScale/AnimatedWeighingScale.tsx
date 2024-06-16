import { animated, to, useSpring } from '@react-spring/web'
import { FC } from 'react'
import styled from 'styled-components'

import { clampValue } from '@/utils/math'

import { AnimatedWeighingScaleProps } from './AnimatedWeighingScale.types'
import { Bar } from './parts/Bar'
import { BarPivot } from './parts/BarPivot'
import { Base } from './parts/Base'
import { Pan } from './parts/Pan'
import { SignDisplay } from './parts/SignDisplay'

const MAX_ROTATION = 19

const BACKGROUND = {
  default: '#F3F7FE',
  correct: '#ECFFD9',
  incorrect: '#FFF2F2',
} as const

const Container = styled.div<{ background: string }>`
  position: relative;
  width: 680px;
  height: 400px;
  border-radius: 20px;
  background: ${(props) => props.background};
`

const StyledBase = styled(Base)`
  position: absolute;
  bottom: 0px;
  left: 50%;
  translate: -50%;
`

const BarContainer = styled(animated.div)`
  height: 22.5px;
  position: absolute;
  bottom: 100px;
  left: 50%;
  translate: -50%;
`

const StyledBar = styled(Bar)`
  /* translate: -50%; */
`

const StyledPivot = styled(BarPivot)`
  position: absolute;
  bottom: 91px;
  left: 50%;
  translate: -50%;
`

const PanContainerLeft = styled(animated.div)`
  position: absolute;
  bottom: 0px;
  width: 199px;
  transform-origin: center 93%;
  translate: -50%;
  left: calc(50% - 150px);
`

const PanContainerRight = styled(PanContainerLeft)`
  left: calc(50% + 140px);
`

const StyledPan = styled(Pan)`
  position: absolute;
  bottom: 0px;
`

const PanContentContainer = styled.div`
  position: absolute;
  bottom: 87px;
  width: 199px;
  // Since the pan is not centered!!
  padding-left: 6px;
`

const PanLabelContainer = styled.div`
  position: absolute;
  bottom: 55px;
  left: 53%;
  width: 150px;
  translate: -50%;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;
  color: white;
  text-align: center;
`

const ContainerCenter = styled.div`
  position: absolute;
  bottom: 116px;
  left: 50%;
  translate: -50%;
`

export const AnimatedWeighingScale: FC<AnimatedWeighingScaleProps> = ({
  leftValue,
  rightValue,
  maxValueDifference,
  comparisonType = 'comparison',
  checkStatus = 'default',
  leftPanLabel,
  leftPanContent,
  rightPanLabel,
  rightPanContent,
  ...props
}) => {
  const targetAngle =
    MAX_ROTATION * clampValue((rightValue - leftValue) / maxValueDifference, -1, 1)

  const sign =
    comparisonType === 'inequality'
      ? leftValue !== rightValue
        ? 'inequal'
        : 'equal'
      : leftValue > rightValue
      ? 'greater-than'
      : leftValue < rightValue
      ? 'less-than'
      : 'equal'

  const rotation = useSpring({
    from: { rotate: 0 },
    to: { rotate: targetAngle },
  })

  return (
    <Container
      data-testid="animated-weighing-scale"
      background={BACKGROUND[checkStatus]}
      {...props}
    >
      <StyledBase />
      <BarContainer style={rotation}>
        <PanContainerLeft style={{ rotate: to(rotation.rotate, (val) => -val) }}>
          <StyledPan />
          <PanContentContainer>{leftPanContent}</PanContentContainer>
          <PanLabelContainer>{leftPanLabel}</PanLabelContainer>
        </PanContainerLeft>
        <PanContainerRight style={{ rotate: to(rotation.rotate, (val) => -val) }}>
          <StyledPan />
          <PanContentContainer>{rightPanContent}</PanContentContainer>
          <PanLabelContainer>{rightPanLabel}</PanLabelContainer>
        </PanContainerRight>
        <StyledBar />
      </BarContainer>
      <ContainerCenter>
        <SignDisplay isCorrect={checkStatus === 'correct'} sign={sign} />
      </ContainerCenter>
      <StyledPivot />
    </Container>
  )
}

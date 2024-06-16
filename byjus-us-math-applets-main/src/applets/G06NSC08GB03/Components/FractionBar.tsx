import { animated, useTrail } from '@react-spring/web'
import React from 'react'
import styled from 'styled-components'

interface ProgressBarProps {
  numerator: number
  denominator: number
  highlightColor: string
  dehighlightColor: string
}

const ProgressBox = styled(animated.div)<{ backgroundColor: string }>`
  background-color: ${(props) => props.backgroundColor};
  border: 1px solid var(--monotone-100, #444);
  height: 100%;
`
const ProgressBarOverflow = styled.div`
  width: 475px;
  height: 85px;
  border: 1px solid var(--monotone-100, #444);
  border-radius: 10px;
  overflow: hidden;
  display: flex;
  flex-direction: row;
  align-items: center;
`
const ProgressBarBox = styled.div<{ gridTemplateColumns: string }>`
  display: grid;
  width: 482px;
  height: 90px;
  grid-template-columns: ${(props) => props.gridTemplateColumns};
`

export const ProgressBar: React.FC<ProgressBarProps> = ({
  numerator,
  denominator,
  highlightColor,
  dehighlightColor,
}) => {
  const trails = useTrail(denominator, {
    from: { opacity: 0 },
    to: { opacity: 1 },
    delay: 200,
    duration: 100,
  })

  return (
    <ProgressBarOverflow>
      <ProgressBarBox gridTemplateColumns={`repeat(${denominator}, ${480 / denominator}px)`}>
        {trails.map((style, i) => (
          <ProgressBox
            backgroundColor={i < numerator ? highlightColor : dehighlightColor}
            key={i}
            style={style}
          ></ProgressBox>
        ))}
      </ProgressBarBox>
    </ProgressBarOverflow>
  )
}

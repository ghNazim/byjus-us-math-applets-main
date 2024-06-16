import React, { useCallback, useMemo, useRef, useState } from 'react'
import styled from 'styled-components'

import { AppletContainer } from '../../common/AppletContainer'
import { TextCallout } from '../../common/Callout'
import { Geogebra } from '../../common/Geogebra'
import { GeogebraAppApi } from '../../common/Geogebra/Geogebra.types'
import { Math } from '../../common/Math'
import { Ticker } from '../../common/Ticker'
import { AppletInteractionCallback } from '../../contexts/analytics'

const MathContent = styled.div`
  position: absolute;
  left: 137px;
  top: 487px;
  color: #444444;
  font-family: 'Nunito', sans-serif;
  font-size: 20px;
  line-height: 30px;
`

const CenteredGGB = styled(Geogebra)`
  position: absolute;
  left: 50px;
  top: 0px;
  width: 574px;
  height: 306px;
`

const Border = styled.div`
  position: absolute;
  left: 42px;
  top: 126px;
  width: 634px;
  height: 310px;
  border: 1.5px solid #d1f7ff;
  border-radius: 9px;
`

const TickerLabel = styled.span`
  font-family: 'Nunito', sans-serif;
  font-size: 18px;
  line-height: 28px;
  text-align: center;
  color: #2ad3f5;
`

const TickerBox = styled.div`
  position: absolute;
  left: 60px;
  top: 375px;
  width: 230px;
  display: flex;
  justify-content: space-between;
`

const initialEdgeLength = 10

const AppInternal: React.FC = () => {
  const ggbApi = useRef<GeogebraAppApi | null>(null)
  const [edgeLength, setEdgeLength] = useState(initialEdgeLength)
  const edgeLengthSquared = useMemo(() => edgeLength * edgeLength, [edgeLength])
  const area = useMemo(() => 4 * edgeLength * edgeLength, [edgeLength])

  const onGGBLoaded = useCallback((api: GeogebraAppApi | null) => {
    ggbApi.current = api
    api?.setValue('a', initialEdgeLength)
  }, [])

  const onChange = (value: number) => {
    if (ggbApi.current) ggbApi.current.setValue('l', value)
    setEdgeLength(value)
  }
  return (
    <>
      <Border>
        <CenteredGGB materialId={'rvcwptyt'} onApiReady={onGGBLoaded} />
      </Border>
      <TickerBox>
        <TickerLabel>Side length =</TickerLabel>
        <Ticker value={initialEdgeLength} min={8} max={16} onChange={onChange} />
        <TickerLabel> units</TickerLabel>
      </TickerBox>
      <MathContent>
        <Math displayMode={true}>
          {String.raw`
          \begin{align*}
          \text{Lateral surface area} &= \text{4 x (Area of one square face)} \\
          &= \text{4 x \colorbox{#F1EDFF}{\textcolor{#7F5CF4}{$(${edgeLength})^2$}} sq. units } \\
          &= \text{4 x \colorbox{#F1EDFF}{\textcolor{#7F5CF4}{$${edgeLengthSquared}$}} sq. units } \\
          &= \text{\colorbox{#F1EDFF}{\textcolor{#7F5CF4}{${area}}} sq. units } \\
          \end{align*}
        `}
        </Math>
      </MathContent>
    </>
  )
}

export const Applet01002Ge: React.FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  return (
    <AppletContainer
      {...{
        aspectRatio: 1,
        borderColor: '#444',
        id: '010_02_GE',
        onEvent,
        className,
      }}
    >
      <TextCallout
        backgroundColor="#E7FBFF"
        text={
          'Change the side length of the cube to understand the calculation of lateral surface area'
        }
      />
      <AppInternal />
    </AppletContainer>
  )
}

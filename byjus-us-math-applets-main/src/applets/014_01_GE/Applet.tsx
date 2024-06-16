import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { AppletContainer } from '../../common/AppletContainer'
import { TextCallout } from '../../common/Callout'
import { Geogebra } from '../../common/Geogebra'
import { GeogebraAppApi } from '../../common/Geogebra/Geogebra.types'
import { Math as Latex } from '../../common/Math'
import { AnalyticsContext, AppletInteractionCallback } from '../../contexts/analytics'
import { useInterval } from '../../hooks/useInterval'
import rect from './images/rect.svg'

const ANIM_STEP_DURATION = 100

const CenteredGGB = styled(Geogebra)`
  position: absolute;
  left: 130px;
  top: 110px;
  width: 460px;
  height: 460px;
`
const MathsStyle = styled.div`
  position: absolute;
  top: 550px;
  left: 178px;
  color: #444444;
  font-family: 'Nunito', sans-serif;
  font-size: 20px;
  line-height: 30px;
`

const Rect = styled.img`
  position: absolute;
  left: 155px;
  bottom: 20px;
  width: 75px;
  height: 40px;
`

const Internal: React.FC = () => {
  const ggbApi = useRef<GeogebraAppApi | null>()
  const [area, setArea] = useState(1)
  const [isDragging, setDragging] = useState(false)
  const [areaCount, setAreaCount] = useState(0)

  const onInteraction = useContext(AnalyticsContext)

  const onGGBLoaded = useCallback((api: GeogebraAppApi | null) => {
    ggbApi.current = api
    if (api == null) return
    setArea(api.getValue('Length(InnerGridPoints)'))

    api.registerObjectUpdateListener('C', () => {
      setArea(api.getValue('Length(InnerGridPoints)'))
    })

    api.registerClientListener((e) => {
      if (e.type === 'mouseDown') {
        setDragging(true)

        const onMouseUp = () => {
          setDragging(false)
          setArea(api.getValue('Length(InnerGridPoints)'))
          document.removeEventListener('mouseup', onMouseUp)
        }

        document.addEventListener('mouseup', onMouseUp)
      }

      if (e.type === 'dragEnd' && e.target === 'C') {
        setDragging(false)
      }
    })
  }, [])

  useEffect(() => {
    setAreaCount(0)
  }, [area])

  useEffect(() => {
    onInteraction('move-point')
  }, [area, onInteraction])

  useEffect(() => {
    if (ggbApi.current == null) return
    ggbApi.current.setValue('n', areaCount)
  }, [areaCount])

  useInterval(
    () => {
      setAreaCount(areaCount + 1)
    },
    areaCount !== area && !isDragging ? ANIM_STEP_DURATION : null,
  )

  const areaText = String.raw`
  \mathrlap{\quad\enspace${
    areaCount > 9 ? '\\negmedspace' : ''
  }${areaCount}}{\hphantom{\quad\enspace 88 \quad\enspace}}
  `

  return (
    <>
      <CenteredGGB materialId={'ttq8m4zh'} onApiReady={onGGBLoaded} />
      <MathsStyle>
        <Rect src={rect} />
        <Latex displayMode={true}>
          {String.raw`
            \begin{align*}
              \text{Area of square} &= \text{Number of unit squares} \\[6pt]
              &= ${areaText} \text{square units}
            \end{align*}
          `}
        </Latex>
      </MathsStyle>
    </>
  )
}

export const Applet01401Ge: React.FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  return (
    <AppletContainer
      {...{
        aspectRatio: 1,
        borderColor: '#444',
        id: '014_01_GE',
        onEvent,
        className,
      }}
    >
      <TextCallout
        backgroundColor={'#FAF2FF'}
        text={
          'Adjust the size of the square and observe how many unit squares fit inside to learn about its area.'
        }
      />
      <Internal />
    </AppletContainer>
  )
}

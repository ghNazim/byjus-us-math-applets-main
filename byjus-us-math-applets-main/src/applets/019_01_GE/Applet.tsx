import 'katex/dist/katex.min.css'

import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { AppletContainer } from '../../common/AppletContainer'
import { TextCallout } from '../../common/Callout'
import { Geogebra } from '../../common/Geogebra'
import { GeogebraAppApi } from '../../common/Geogebra/Geogebra.types'
import { Math } from '../../common/Math'
import { AnalyticsContext, AppletInteractionCallback } from '../../contexts/analytics'
import arcLengthRect from './images/arcLengthRect.svg'
import areaRect from './images/areaRect.svg'
import radiusRect from './images/radiusRect.svg'

const CenteredGGB = styled(Geogebra)`
  position: absolute;
  left: 60px;
  top: 100px;
  width: 600px;
  height: 450px;
`

const MathText = styled.div`
  position: absolute;
  top: 550px;
  left: 166px;
  color: #444;
  width: 388px;
  height: 156px;
  color: #444444;
  font-family: 'Nunito', sans-serif !important;
  font-size: 20px;
  line-height: 28px;

  .katex .mathdefault,
  .katex .mathnormal,
  .katex .mord {
    font-family: 'Nunito', sans-serif !important;
  }
`

const AppletInternal: React.FC = () => {
  const ggbApi = useRef<GeogebraAppApi | null>(null)
  const [arcLength, setArcLength] = useState(0)
  const [radius, setRadius] = useState(0)

  const onInteraction = useContext(AnalyticsContext)

  const onGGBLoaded = useCallback((api: GeogebraAppApi | null) => {
    ggbApi.current = api
    if (api == null) return

    api.registerObjectUpdateListener('L', () => {
      api.setVisible('pic4', false)
      setArcLength(api.getValue('L'))
    })
    api.registerObjectUpdateListener('r2', () => setRadius(api.getValue('r2')))

    api.setVisible('pic4', true)

    api.registerClientListener((e) => {
      if (e.type === 'dragEnd' && e.target === 'pic1') {
        const r = api.getValue('r2')
        api.setValue(`l'`, api.getValue('L'))
        api.setValue(`r2'`, r)
      }
    })

    setArcLength(api.getValue('L'))
    setRadius(api.getValue('r2'))
  }, [])

  useEffect(() => {
    onInteraction('move-point')
  }, [radius, arcLength, onInteraction])

  const area = 0.5 * +radius.toFixed(0) * +arcLength.toFixed(1)

  const styledRadius = String.raw`
  \textcolor{#ffffff}{${radius.toFixed(0)}}
  `
  const styledArcLength = String.raw`
  \textcolor{#ffffff}{\mathrlap{${arcLength < 10 ? '\\hphantom{.}' : ''}${arcLength.toFixed(
    1,
  )}}{\hphantom{888}}}
  `
  const styledArea = String.raw`
  \textcolor{#444}{\mathrlap{${
    area < 100 ? '\\hphantom{.}' : area < 10 ? '\\hphantom{8.}' : ''
  }${area.toFixed(1)}}{\hphantom{888}}}
  `

  return (
    <>
      <CenteredGGB width={600} height={450} materialId={'skwzkzvn'} onApiReady={onGGBLoaded} />
      <img
        style={{ position: 'absolute', top: '627px', left: '451px' }}
        src={radiusRect}
        alt="radiusRect"
      />
      <img
        style={{ position: 'absolute', top: '627px', left: '542px', width: '55px', height: '32px' }}
        src={arcLengthRect}
        alt="arcLengthRect"
      />
      <img
        style={{ position: 'absolute', top: '677px', left: '348px', width: '70px' }}
        src={areaRect}
        alt="areaRect"
      />
      <MathText>
        <Math displayMode={true}>
          {String.raw`
          \begin{array}{cc}
          \text{Area of sector} & = &	{\Large \frac{1}{2}}   & \times & \textcolor{#C882FA}{r}   & \times & \textcolor{#7F5CF4}{l} \\[12pt]
                                & = &	{\Large \frac{1}{2}}    & \times & ${styledRadius}            & \times & ${styledArcLength} \\[12pt]
                                & = & ${styledArea} & & \kern-1em\text{sq units}
          \end{array}
          `}
        </Math>
      </MathText>
    </>
  )
}

export const Applet01901Ge: React.FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#444',
        id: '019_01_GE',
        onEvent,
        className,
      }}
    >
      <TextCallout
        backgroundColor={'#F1EDFF'}
        text={
          'Change the radius or the arc length of the given circle and observe the change in the area of sector.'
        }
      />
      <AppletInternal />
    </AppletContainer>
  )
}

import { Player } from '@lottiefiles/react-lottie-player'
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { AppletContainer } from '../../common/AppletContainer'
import { Geogebra } from '../../common/Geogebra'
import { GeogebraAppApi } from '../../common/Geogebra/Geogebra.types'
import moveHorizontal from '../../common/handAnimations/moveHorizontally.json'
import { TextHeader } from '../../common/Header'
import { Math as Latex } from '../../common/Math'
import { AnalyticsContext, AppletInteractionCallback } from '../../contexts/analytics'

const StyledGeogebra = styled(Geogebra)`
  scale: 0.75;
  position: absolute;
  top: 30px;
  left: 120px;
`
const AnimOnBoarding = styled(Player)`
  position: absolute;
  top: 320px;
  left: 240px;
  rotate: -20deg;
  pointer-events: none;
`

const PlacedText = styled.div`
  position: absolute;
  bottom: 32px;
  /* left: 50%;
  translate: -50%; */
  left: 120px;
  z-index: 1;
  width: 605px;

  color: #444 !important;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;
  text-align: center;

  .katex-display > .katex {
    text-align: left;
  }
`

const PurpleDiv = styled.div<{
  bottom: number
  left: number
  bgColor: string
  width?: number
  height?: number
}>`
  background-color: ${(props) => props.bgColor};
  width: ${(props) => (props.width ? props.width : 30)}px;
  height: ${(props) => (props.height ? props.height : 37)}px;
  border-radius: 5px;
  position: absolute;
  bottom: ${(props) => props.bottom}px;
  left: ${(props) => props.left}px;
  z-index: -1;
`

const POINT_SELECTED_TEXT_COLOR = '#6595DE'
const POINT_SELECTED_BG_COLOR = '#81B3FF'
const RESULT_BG_COLOR = '#E8F0FE'

export const Applet02601Ge: React.FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const [showClickOnboarding, setShowClickOnboarding] = useState(true)
  const ggbApi = useRef<GeogebraAppApi | null>(null)
  const [ggbLoaded, setGgbloaded] = useState(false)
  const [pointSelected, setPointSelected] = useState<'' | 'Q' | 'D' | 'C'>('')
  const [dimensions, setDimensions] = useState({ b: 7.0, H: 7.0, h: 10.0 })
  const onInteraction = useContext(AnalyticsContext)

  const GGBLoaded = useCallback((api: GeogebraAppApi | null) => {
    ggbApi.current = api
    setGgbloaded(api != null)
  }, [])

  useEffect(() => {
    const api = ggbApi.current
    if (!ggbLoaded || api == null) return

    api.setColor('D', 160, 160, 160)
    api.setColor('Q', 160, 160, 160)
    api.setColor('C', 160, 160, 160)

    api.registerClientListener(select)

    ggbApi.current?.registerObjectUpdateListener('j', () => {
      setDimensions((d) => ({ ...d, h: +api.getValue('j').toFixed(2) }))
      onInteraction('move-point')
      setShowClickOnboarding(false)
    })

    ggbApi.current?.registerObjectUpdateListener('i', () => {
      setDimensions((d) => ({ ...d, H: +api.getValue('i').toFixed(2) }))
      onInteraction('move-point')
      setShowClickOnboarding(false)
    })

    ggbApi.current?.registerObjectUpdateListener('c', () => {
      setDimensions((d) => ({ ...d, b: +api.getValue('c').toFixed(2) }))
      onInteraction('move-point')
      setShowClickOnboarding(false)
    })
  }, [ggbLoaded])

  const select = (e: any) => {
    const api = ggbApi.current
    if (e.type == 'select') {
      if (e.target == 'D') {
        setPointSelected('D')
        api?.setLineThickness('j', 6)
        api?.setColor('j', 127, 92, 244)
      } else if (e.target == 'Q') {
        setPointSelected('Q')
        api?.setColor('d', 127, 92, 244)
        api?.setLineThickness('d', 6)
      } else if (e.target == 'C') {
        setPointSelected('C')
        api?.setLineThickness('i', 6)
        api?.setColor('i', 127, 92, 244)
      }
    }

    if (e[0] == 'deselect') {
      setPointSelected('')
      ggbApi.current?.setColor('j', 160, 160, 160)
      ggbApi.current?.setColor('d', 160, 160, 160)
      ggbApi.current?.setColor('i', 160, 160, 160)
    }
  }

  useEffect(() => {
    const api = ggbApi.current
    if (api == null) return
    if (pointSelected) {
      api.setColor(pointSelected, 127, 92, 244)

      return () => {
        api.setColor('D', 160, 160, 160)
        api.setColor('Q', 160, 160, 160)
        api.setColor('C', 160, 160, 160)
        api.setLineThickness('d', 2)
        api.setLineThickness('i', 2)
        api.setLineThickness('j', 2)
      }
    }
  }, [pointSelected])

  const area = () => {
    return (0.5 * 0.5 * dimensions.b * dimensions.H * dimensions.h).toFixed(2)
  }

  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#F1EDFF',
        id: '026_01_GE',
        onEvent,
        className,
      }}
    >
      <TextHeader
        text="Adjust the dimensions of the pyramid and observe the change in  the volume of the pyramid."
        backgroundColor="#E8F0FE"
        buttonColor="#BCD3FF"
      />

      <StyledGeogebra materialId={'dx2gwjb2'} width={498} height={498} onApiReady={GGBLoaded} />

      {ggbLoaded && (
        <PlacedText>
          <Latex displayMode>
            {String.raw`
    \begin{align*}

    \text{Volume of pyramid} &= \frac{1}{2} \hspace{0.1cm} \times \hspace{0.1cm} \text{Base area} \hspace{0.1cm} \times \hspace{0.1cm}
    \text{Height}\\[10pt]


    \ &= \frac{1}{2} \hspace{0.1cm} \times  \left( \frac{1}{2} \hspace{0.1cm} \times \hspace{0.1cm}
      ${
        pointSelected === 'Q' ? `\\textcolor{${POINT_SELECTED_TEXT_COLOR}}{\\text{b}}` : `b`
      } \hspace{0.1cm} \times \hspace{0.1cm}  ${
              pointSelected === 'C' ? `\\textcolor{${POINT_SELECTED_TEXT_COLOR}}{\\text{H}}` : `H`
            } \right) \times \hspace{0.1cm} ${
              pointSelected === 'D' ? `\\textcolor{${POINT_SELECTED_TEXT_COLOR}}{\\text{h}}` : `h`
            }\\[12pt]


    \ &=
    \frac{1}{2} \hspace{0.1cm} \times  \left( \frac{1}{2} \hspace{0.1cm} \times \hspace{0.1cm}
      \textcolor{${pointSelected === 'Q' ? '#ffffff' : '#444'}}{\text{${Number(
              dimensions.b,
            ).toFixed(2)}}} \hspace{0.1cm} \times \hspace{0.1cm}  \textcolor{${
              pointSelected === 'C' ? '#ffffff' : '#444'
            }}{\text{${Number(dimensions.H).toFixed(
              2,
            )}}} \right) \times \hspace{0.1cm} \textcolor{${
              pointSelected === 'D' ? '#ffffff' : '#444'
            }}{\text{${Number(dimensions.h).toFixed(2)}}}\\[25pt]


       \text{Volume of pyramid} &=  \hspace{0.1cm} \text{${area()}} \hspace{0.3cm} \text{cubic units}

    \end{align*}
    `}
          </Latex>

          {pointSelected === 'Q' && (
            <PurpleDiv
              bottom={100}
              left={299}
              width={dimensions.b <= 9.99 ? 45 : 60}
              bgColor={POINT_SELECTED_BG_COLOR}
            />
          )}
          {pointSelected === 'C' && (
            <PurpleDiv
              bottom={100}
              left={dimensions.b <= 9.99 ? 372 : 382}
              width={dimensions.H <= 9.99 ? 45 : 60}
              bgColor={POINT_SELECTED_BG_COLOR}
            />
          )}
          {pointSelected === 'D' && (
            <PurpleDiv
              bottom={100}
              left={
                dimensions.b <= 9.99 && dimensions.H <= 9.99
                  ? 452
                  : dimensions.b <= 9.99 || dimensions.H <= 9.99
                  ? 464
                  : 477
              }
              width={dimensions.h <= 9.99 ? 45 : 60}
              bgColor={POINT_SELECTED_BG_COLOR}
            />
          )}
          <PurpleDiv
            bottom={22}
            left={195}
            width={Number(area()) > 99.99 ? 74 : 60}
            height={36}
            bgColor={RESULT_BG_COLOR}
          />
        </PlacedText>
      )}
      {ggbLoaded && showClickOnboarding && <AnimOnBoarding src={moveHorizontal} loop autoplay />}
    </AppletContainer>
  )
}

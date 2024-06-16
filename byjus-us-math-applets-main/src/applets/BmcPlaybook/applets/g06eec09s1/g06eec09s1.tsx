import { FC, useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { AnimatedInputSlider } from '@/common/AnimatedInputSlider'
import { AppletContainer } from '@/common/AppletContainer'
import { Geogebra } from '@/common/Geogebra'
import { GeogebraAppApi } from '@/common/Geogebra/Geogebra.types'
import { TextHeader } from '@/common/Header'
import { TogglesGroup } from '@/common/TogglesGroup'
import { AppletInteractionCallback } from '@/contexts/analytics'

import op1 from './Assets/op1.png'
import op2 from './Assets/op2.png'
import op3 from './Assets/op3.png'

const GeogebraContainer = styled(Geogebra)<{ top: number; left: number }>`
  position: absolute;
  left: ${(props) => props.left}px;
  top: ${(props) => props.top}px;
`

const CenterContainer = styled.div`
  box-sizing: border-box;

  position: absolute;
  width: 506px;
  height: 361px;
  left: 102px;
  top: 122px;

  background: #faf2ff;
  border: 2px dashed #b3b1b1;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
`
const TextContainer = styled.div`
  position: absolute;
  width: 720px;
  height: 28px;
  left: 0px;
  top: 511px;

  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;
  text-align: center;
  color: #444444;
`

const InputSliderContainer = styled(AnimatedInputSlider)`
  position: absolute;
  left: 160px;
  top: 560px;
`
export const AppletG06EEC09S1: FC<{
  onEvent: AppletInteractionCallback
  className?: string
  onComplete: () => void
}> = ({ onEvent, className, onComplete }) => {
  const [index, setIndex] = useState(-1)
  const [resetSlider, setResetSlider] = useState(false)
  const [showText, setShowText] = useState([false, false, false])
  const [hideShapesOnComplete, setHideShapesOnComplete] = useState(false)
  const [ggbLoaded, setGgbLoaded] = useState(false)
  const ggb1Ref = useRef<GeogebraAppApi | null>(null)
  const ggb2Ref = useRef<GeogebraAppApi | null>(null)
  const ggb3Ref = useRef<GeogebraAppApi | null>(null)
  const handleToggleChange = useCallback((activeId: number) => {
    if (activeId < 0) return
    setIndex(activeId)
    setResetSlider(true)
  }, [])

  const ggb1Api = useCallback(
    (api: GeogebraAppApi | null) => {
      setGgbLoaded(true)
      ggb1Ref.current = api
      if (!api) return
    },
    [ggb1Ref],
  )
  const sliderHandle = (value: number) => {
    if (!ggb1Ref.current) return
    ggb1Ref.current.setValue('a', value / 50)
    if (value > 95) {
      setShowText((s) => {
        const d = [...s]
        d[0] = true
        return d
      })
      onComplete()
      setHideShapesOnComplete(true)
    }
  }

  const ggb2Api = useCallback(
    (api: GeogebraAppApi | null) => {
      ggb2Ref.current = api
      setGgbLoaded(true)
      if (!api) return
    },
    [ggb2Ref],
  )
  const slider2Handle = (value: number) => {
    if (!ggb2Ref.current) return
    ggb2Ref.current.setValue('i', (value * 3) / 100)
    if (value > 95) {
      setShowText((s) => {
        const d = [...s]
        d[1] = true
        return d
      })
      onComplete()
      setHideShapesOnComplete(true)
    }
  }

  const ggb3Api = useCallback(
    (api: GeogebraAppApi | null) => {
      setGgbLoaded(true)
      ggb3Ref.current = api
      if (!api) return
    },
    [ggb3Ref],
  )
  const slider3Handle = (value: number) => {
    if (!ggb3Ref.current) return
    ggb3Ref.current.setValue('i', (value * 4) / 100)
    if (value > 95) {
      setShowText((s) => {
        const d = [...s]
        d[2] = true
        return d
      })
      onComplete()
      setHideShapesOnComplete(true)
    }
  }
  useEffect(() => {
    if (resetSlider) setResetSlider(false)
  }, [resetSlider])

  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#FAF2FF',
        id: 'g06-eec09-s1',
        onEvent,
        className,
      }}
    >
      <TextHeader
        text="Choose a polygon, rearrange its interior angles, and observe the sum of angle measures."
        backgroundColor="#FAF2FF"
        buttonColor="#EACCFF"
      />
      {index === -1 && (
        <CenterContainer>
          <div
            style={{
              textAlign: 'center',
              fontSize: '20px',
            }}
          >
            Select a polygon
          </div>
        </CenterContainer>
      )}
      <div style={{ visibility: index === 0 ? 'visible' : 'hidden' }}>
        <GeogebraContainer materialId="vqt9gazs" top={130} left={45} onApiReady={ggb1Api} />
        {ggbLoaded ? (
          <>
            <InputSliderContainer onChangePercent={sliderHandle} />
            {showText[0] && (
              <TextContainer>
                The sum of measures of interior angles of a triangle is 180°.
              </TextContainer>
            )}
          </>
        ) : (
          <div>Loading</div>
        )}
      </div>

      <div style={{ visibility: index === 1 ? 'visible' : 'hidden' }}>
        <GeogebraContainer materialId="bnq7yaqg" top={130} left={45} onApiReady={ggb2Api} />
        <InputSliderContainer onChangePercent={slider2Handle} />
        {showText[1] && (
          <TextContainer>
            Sum of measures of the internal angles of a quadrilateral = 2 x (180°)
          </TextContainer>
        )}
      </div>
      <div style={{ visibility: index === 2 ? 'visible' : 'hidden' }}>
        <GeogebraContainer materialId="ndeutca8" top={130} left={45} onApiReady={ggb3Api} />
        <InputSliderContainer onChangePercent={slider3Handle} />
        {showText[2] && (
          <TextContainer>Sum of measures of internal angles of a pentagon = 3 x 180°</TextContainer>
        )}
      </div>
      {!hideShapesOnComplete && (
        <TogglesGroup
          optionArray={[op1, op2, op3]}
          childDimensions={{
            width: 143,
            height: 93,
          }}
          dimensions={{ width: 530, height: 170 }}
          position={{ left: 95, top: 645 }}
          highlightColor={'#F2FFE2'}
          onChange={handleToggleChange}
          disabled={resetSlider}
          showOnBoarding={index === -1}
        />
      )}
    </AppletContainer>
  )
}

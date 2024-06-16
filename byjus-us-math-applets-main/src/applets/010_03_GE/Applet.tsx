import React, { useCallback, useRef, useState } from 'react'
import styled from 'styled-components'

import { AnimatedInputSlider } from '../../common/AnimatedInputSlider'
import { AppletContainer } from '../../common/AppletContainer'
import { TextCallout } from '../../common/Callout'
import { Geogebra } from '../../common/Geogebra'
import { GeogebraAppApi } from '../../common/Geogebra/Geogebra.types'
import { HandPointer } from '../../common/HandPointer/HandPointer'
import { AppletInteractionCallback } from '../../contexts/analytics'
import ToggleGroup from './ToggleGroup/ToggleGroup'

const PlaceDiv = styled.div`
  width: 700;
  margin: 0%;
  display: flex;
  flex-direction: row;
  gap: 0;
  position: 'absolute';
  margin-top: 110px;
  left: 0px;
  height: 350;
`

const PlacedGGBLeft = styled(Geogebra)`
  width: 350px;
  .appletStyle {
    border-style: hidden !important;
  }
  .EuclidianPanel {
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
  }
  .EuclidianPanel {
    margin-left: 5px !important;
    border: 15px solid rgba(209, 247, 255, 1) !important;
    /* box-shadow: 0px 0px 0px 15px rgba(209, 247, 255, 1) !important; */
    border-radius: 3px !important;
    height: 82% !important;
    width: 82% !important;
  }
  .splitPaneDragger {
    visibility: hidden !important;
  }
  .splitterFixed {
    margin-left: 8px !important;
  }
  .ggbdockpanelhack > div > div {
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
  }
`
const PlacedGGBRight = styled(Geogebra)`
  width: 350px;
  .appletStyle {
    border-style: hidden !important;
  }
  .EuclidianPanel {
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
  }
  .EuclidianPanel {
    border: 1.5px solid rgba(42, 211, 245, 1) !important;
    border-radius: 3px !important;
    height: 90% !important;
    width: 90% !important;
  }
  .EuclidianPanel.cursor_hit > canvas {
    box-sizing: border-box !important;
    border: 1.5px solid rgba(42, 211, 245, 1) !important;
    box-shadow: 0px 0px 0px 15px rgba(209, 247, 255, 1) !important;
    width: 92% !important;
    height: 92% !important;
  }
  .splitPaneDragger {
    visibility: hidden !important;
  }
  .splitterFixed {
    margin-left: 8px !important;
  }
  .ggbdockpanelhack > div > div {
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
  }
`
const PlacedSlider = styled(AnimatedInputSlider)`
  position: absolute;
  margin: 20px auto;
  left: 0;
  right: 0;
  bottom: 155px;
`

const Inner: React.FC = () => {
  const ggbApi = useRef<GeogebraAppApi | null>(null)
  const ggbApi1 = useRef<GeogebraAppApi | null>(null)
  const [resetSlider, setResetSlider] = useState(false)

  const onSliderChange = useCallback((value: number) => {
    setResetSlider(false)
    if (ggbApi.current) {
      ggbApi.current.setValue('t', 1 - value / 100)
    }

    if (value === 100) {
      setShowHands((v) => {
        return v == 0 || v == 1 ? 1 : 2
      })
    }
  }, [])

  const [showHand, setShowHands] = useState(0)

  const onGGBLoaded = useCallback((api: GeogebraAppApi | null) => {
    ggbApi.current = api
  }, [])

  const onGGBLoaded1 = useCallback((api: GeogebraAppApi | null) => {
    ggbApi1.current = api
  }, [])

  const options = ['op1', 'op2', 'op3', 'op4', 'op5', 'op6']
  const handleToggleChange = (activeId: number) => {
    setShowHands((v) => (v !== 0 ? 2 : 0))
    setResetSlider(true)
    ggbApi1.current?.setValue(options[activeId], 1)
    ggbApi.current?.setValue(options[activeId], 1)
  }

  return (
    <>
      <PlaceDiv>
        <PlacedGGBLeft materialId={'djyxdcmm'} width={360} height={350} onApiReady={onGGBLoaded1} />
        <PlacedGGBRight materialId={'zujt8zsa'} width={360} height={350} onApiReady={onGGBLoaded} />
      </PlaceDiv>
      <PlacedSlider reset={resetSlider} onChangePercent={onSliderChange} />
      <ToggleGroup noOfChildren={6} onChange={handleToggleChange} />
      <div style={{ position: 'absolute', bottom: '80px', left: '180px' }}>
        {showHand === 1 && <HandPointer />}
      </div>
    </>
  )
}

export const Applet01003Ge: React.FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  return (
    <AppletContainer
      {...{
        aspectRatio: 1,
        borderColor: '#444',
        id: '010_03_GE',
        onEvent,
        className,
      }}
    >
      <TextCallout
        backgroundColor={'#E7FBFF'}
        text={'Look at different nets of a cube and fold them to discover how a cube is formed.'}
      />
      <Inner />
    </AppletContainer>
  )
}

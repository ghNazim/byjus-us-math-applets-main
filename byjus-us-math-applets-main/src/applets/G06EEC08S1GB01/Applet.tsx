import React, { useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { OnboardingAnimation } from '@/atoms/OnboardingAnimation'
import { OnboardingController } from '@/atoms/OnboardingController'
import { OnboardingStep } from '@/atoms/OnboardingStep'
import { PrimaryRangeSlider } from '@/atoms/RangeSlider'
import { AppletInteractionCallback } from '@/contexts/analytics'
import { useHasChanged } from '@/hooks/useHasChanged'
import { useSFX } from '@/hooks/useSFX'

import { AppletContainer } from '../../common/AppletContainer'
import { Geogebra } from '../../common/Geogebra'
import { GeogebraAppApi } from '../../common/Geogebra/Geogebra.types'
import { TextHeader } from '../../common/Header'

const StyledGeogebra = styled(Geogebra)`
  position: absolute;
  width: 75%;
  height: 75%;
  top: 100px;
  left: 50%;
  translate: -50%;
`
const Label = styled.p`
  position: absolute;
  top: 685px;
  left: 205px;
  font-family: 'Nunito';
  color: #444;
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;
`
const PointLabel = styled.p<{ xIncrement: number; yIncrement: number }>`
  position: absolute;
  top: ${(props) => 530 - props.yIncrement * 40}px;
  left: ${(props) => 160 + props.xIncrement * 40}px;
  font-family: 'Nunito';
  color: #444;
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;
`
const SliderHorizContainer = styled.div`
  position: absolute;
  top: 630px;
  left: 153px;
  width: 400px;
  height: 50px;
`
const SliderVertContainer = styled.div`
  position: absolute;
  top: 187px;
  left: 68px;
  width: 50px;
  height: 400px;
`
const XOnboarding = styled(OnboardingAnimation).attrs({ type: 'moveRight' })`
  position: absolute;
  top: 590px;
  left: -46px;
  pointer-events: none;
`
const YOnboarding = styled(OnboardingAnimation).attrs({ type: 'moveUp' })`
  position: absolute;
  top: 383px;
  left: -9px;
  pointer-events: none;
  scale: -1 1 1;
`
export const AppletG06EEC08S1GB01: React.FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const ggbApi = useRef<GeogebraAppApi | null>(null)
  const [ggbLoaded, setGGbLoaded] = useState(false)
  const [xCoord, setXCoord] = useState<number>(0)
  const [yCoord, setYCoord] = useState<number>(0)
  const playMouseIn = useSFX('mouseIn')
  const playMouseOut = useSFX('mouseOut')

  const hasXCoordChanged = useHasChanged(xCoord)
  const hasYCoordChanged = useHasChanged(yCoord)

  const onApiReady = useCallback((api: GeogebraAppApi | null) => {
    ggbApi.current = api
    setGGbLoaded(api != null)
  }, [])

  useEffect(() => {
    if (ggbLoaded) {
      ggbApi.current?.setValue('Side', xCoord)
    }
  }, [ggbLoaded, xCoord])

  useEffect(() => {
    if (ggbLoaded) {
      ggbApi.current?.setValue('Up', yCoord)
    }
  }, [ggbLoaded, yCoord])

  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#FAF2FF',
        id: 'G06EEC08S1GB01',
        onEvent,
        className,
      }}
    >
      <TextHeader
        text="Adjust x and y values to see P's position shift on the coordinate plane."
        backgroundColor="#FAF2FF"
        buttonColor="#EACCFF"
      />
      <StyledGeogebra materialId={'rxyy2dw6'} width={800} height={800} onApiReady={onApiReady} />
      {ggbLoaded && (
        <>
          <Label>
            Coordinates of point <span style={{ color: '#7F5CF4' }}>P</span> are{' '}
            <span style={{ color: '#7F5CF4' }}>(</span>
            <span style={{ color: '#D97A1A' }}>{xCoord}</span>,{' '}
            <span style={{ color: '#AA5EE0' }}>{yCoord}</span>
            <span style={{ color: '#7F5CF4' }}>)</span>.
          </Label>
          <PointLabel xIncrement={xCoord} yIncrement={yCoord}>
            <span style={{ color: '#7F5CF4' }}>P (</span>
            <span style={{ color: '#D97A1A' }}>{xCoord}</span>,{' '}
            <span style={{ color: '#AA5EE0' }}>{yCoord}</span>
            <span style={{ color: '#7F5CF4' }}>)</span>
          </PointLabel>

          <SliderHorizContainer>
            <PrimaryRangeSlider
              min={0}
              max={10}
              vertical={false}
              onChangeBegin={() => playMouseIn()}
              onChange={setXCoord}
              onChangeComplete={() => playMouseOut()}
            />
          </SliderHorizContainer>
          <SliderVertContainer>
            <PrimaryRangeSlider
              min={0}
              max={10}
              vertical={true}
              onChangeBegin={() => playMouseIn()}
              onChange={setYCoord}
              onChangeComplete={() => playMouseOut()}
            />
          </SliderVertContainer>
          <OnboardingController>
            <OnboardingStep index={0}>
              <XOnboarding complete={hasXCoordChanged} />
            </OnboardingStep>
            <OnboardingStep index={1}>
              <YOnboarding complete={hasYCoordChanged} />
            </OnboardingStep>
          </OnboardingController>
        </>
      )}
    </AppletContainer>
  )
}

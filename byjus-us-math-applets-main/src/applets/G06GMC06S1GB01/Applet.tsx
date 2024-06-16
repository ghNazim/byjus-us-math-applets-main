import { FC, useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { OnboardingAnimation } from '@/atoms/OnboardingAnimation'
import { OnboardingController } from '@/atoms/OnboardingController'
import { OnboardingStep } from '@/atoms/OnboardingStep'
import { AppletContainer } from '@/common/AppletContainer'
import { Geogebra } from '@/common/Geogebra'
import { GeogebraAppApi } from '@/common/Geogebra/Geogebra.types'
import { TextHeader } from '@/common/Header'
import { AppletInteractionCallback } from '@/contexts/analytics'
import { useSFX } from '@/hooks/useSFX'
import { RangeInput } from '@/molecules/RangeInput'

import RectangleImg from './Assets/rectangle.svg'
import TryNewIcon from './Assets/reset.svg'
import SquareImg from './Assets/square.svg'
import TriangleImg from './Assets/triangle.svg'

const GeogebraContainer = styled(Geogebra)<{ isActive: boolean }>`
  display: ${(a) => (a.isActive ? 'flex' : 'none')};
  align-items: flex-end;
  width: 100%;
  height: 70%;
  justify-content: center;
`

const GGBBg = styled.div`
  width: 90%;
  height: 400px;
  border: 3px solid #f3f7fe;
  position: absolute;
  top: 100px;
  left: 5%;
`

const ShapesContainer = styled.div`
  position: absolute;
  width: 100%;
  display: flex;
  padding: 0 50px;
  bottom: 50px;
  justify-content: center;
  gap: 1rem;
`

const BottomText = styled.div<{ bottom: number }>`
  position: absolute;
  bottom: ${(a) => a.bottom}px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px 20px;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  color: #646464;
`

const Shape = styled.img`
  transition: all 0.3s ease;
  cursor: pointer;
  :hover {
    scale: 1.03;
    transition: all 0.3s ease;
  }
`

const ButtonContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  position: absolute;
  bottom: 50px;
`

const Button = styled.div`
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px 24px;
  gap: 12px;
  background: #1a1a1a;
  border-radius: 10px;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 24px;
  color: white;
`

const RangeInputSliderContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
`

const OnboardingAnim = styled(OnboardingAnimation)<{ left: number; top: number }>`
  position: absolute;
  left: ${(a) => a.left}px;
  top: ${(a) => a.top}px;
`

type CurrentShape = 'triangle' | 'square' | 'rectangle' | 'null'

export const AppletG06GMC06S1GB01: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const ggbAPi = useRef<GeogebraAppApi | null>(null)
  const [ggbLoaded, setGgbLoaded] = useState(false)
  const [currentShape, setCurrentShape] = useState<CurrentShape>('null')

  const [nextBtnIndex, setNextBtnIndex] = useState(0)

  //sound
  const playMouseClick = useSFX('mouseClick')

  const onGgbReady = useCallback((api: GeogebraAppApi | null) => {
    if (api === null) return
    setGgbLoaded(true)
    ggbAPi.current = api
  }, [])

  useEffect(() => {
    if (ggbAPi.current === null) return
    switch (nextBtnIndex) {
      case 1:
        ggbAPi.current.setValue('directionbutton', 1)

        break
      case 2:
        ggbAPi.current.setValue('hfinal', 1)
        ggbAPi.current.setValue('squareanimation', 1)
        break
    }
  }, [nextBtnIndex])

  const handleSliderChange = (val: number) => {
    if (ggbAPi.current === null) return

    ggbAPi.current.setValue('sliderh', val)
  }

  const handleReset = () => {
    if (ggbAPi.current === null) return

    ggbAPi.current.setValue('reset', 1)
    setNextBtnIndex(0)
    setCurrentShape('null')
    playMouseClick()
    setGgbLoaded(false)
  }

  const baseText = (currentShape: CurrentShape) => {
    switch (currentShape) {
      case 'rectangle':
        return 'rectangular'
      case 'square':
        return 'square'
      case 'triangle':
        return 'triangular'
    }
  }

  const handleNextBtn = () => {
    setNextBtnIndex((prev) => prev + 1)
    playMouseClick()
  }
  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#f6f6f6',
        id: 'g06-gmc06-s1-gb01',
        onEvent,
        className,
        themeName: 'dark',
      }}
    >
      <TextHeader
        text="Constructing a pyramid using 2D shapes"
        backgroundColor="#f6f6f6"
        buttonColor="#1a1a1a"
      />
      <OnboardingController>
        {currentShape === 'triangle' && (
          <GeogebraContainer
            isActive={currentShape === 'triangle'}
            materialId="bfwvedaw"
            onApiReady={onGgbReady}
          />
        )}
        {currentShape === 'square' && (
          <GeogebraContainer
            isActive={currentShape === 'square'}
            materialId="kaxcdfhm"
            onApiReady={onGgbReady}
          />
        )}
        {currentShape === 'rectangle' && (
          <GeogebraContainer
            isActive={currentShape === 'rectangle'}
            materialId="awbzb6jv"
            onApiReady={onGgbReady}
          />
        )}
        <GGBBg />
        {currentShape === 'null' ? (
          <>
            <BottomText bottom={220}>Select a shape to form the pyramid base.</BottomText>
            <BottomText bottom={480}>No shape selected</BottomText>

            <ShapesContainer>
              <Shape src={TriangleImg} onClick={() => setCurrentShape('triangle')} />
              <Shape src={SquareImg} onClick={() => setCurrentShape('square')} />
              <Shape src={RectangleImg} onClick={() => setCurrentShape('rectangle')} />
            </ShapesContainer>
            <OnboardingStep index={0}>
              <OnboardingAnim type="click" complete={currentShape === null} top={642} left={117} />
            </OnboardingStep>
          </>
        ) : (
          <>
            <ButtonContainer>
              {nextBtnIndex < 2 ? (
                ggbLoaded && <Button onClick={handleNextBtn}>Next</Button>
              ) : (
                <>
                  <Button onClick={handleReset}>
                    <img src={TryNewIcon} />
                    Try new
                  </Button>
                </>
              )}
            </ButtonContainer>

            {nextBtnIndex === 0 && ggbLoaded && (
              <>
                <BottomText bottom={200}>
                  Great! Your pyramid will have a {baseText(currentShape)} base.
                </BottomText>
              </>
            )}

            {nextBtnIndex === 1 && (
              <>
                <RangeInputSliderContainer>
                  <RangeInput min={1} max={5} onChange={handleSliderChange} />
                </RangeInputSliderContainer>
                <BottomText bottom={220}>Set the height of the pyramid</BottomText>
              </>
            )}

            {nextBtnIndex === 2 && (
              <BottomText bottom={200}>
                Great! You have built a {baseText(currentShape)} pyramid.
              </BottomText>
            )}
          </>
        )}
      </OnboardingController>
    </AppletContainer>
  )
}

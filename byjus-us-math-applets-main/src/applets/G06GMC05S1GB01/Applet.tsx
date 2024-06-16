import { FC, useCallback, useContext, useEffect, useRef, useState } from 'react'
import styled, { keyframes } from 'styled-components'

import { OnboardingAnimation } from '@/atoms/OnboardingAnimation'
import { OnboardingController } from '@/atoms/OnboardingController'
import { OnboardingStep } from '@/atoms/OnboardingStep'
import { AppletContainer } from '@/common/AppletContainer'
import { Geogebra } from '@/common/Geogebra'
import { GeogebraAppApi } from '@/common/Geogebra/Geogebra.types'
import { TextHeader } from '@/common/Header'
import { AnalyticsContext, AppletInteractionCallback } from '@/contexts/analytics'
import { useSFX } from '@/hooks/useSFX'

import rectangleSVG from './Assets/rectangle.svg'
import squareSVG from './Assets/square.svg'
import triangleSVG from './Assets/triangle.svg'
import tryNew from './Assets/tryNew.svg'
import { OutlineButton, TextButton } from './Buttons/AnimatedButtons'
import { ToggleSquareButton } from './Buttons/ToggleImgBtn'

const FirstPageText = styled.div<{ fade: boolean }>`
  position: absolute;
  top: 306px;
  left: 50%;
  translate: -50%;
  color: var(--monotone-110, #646464);
  text-align: center;
  font-size: 20px;
  font-family: Nunito;
  font-weight: 700;
  line-height: 28px;
  opacity: ${(props) => (props.fade ? 0 : 1)};
  transition: 0.1s ease-out;
`
const MainContainer = styled.div`
  position: absolute;
  top: 100px;
  left: 21px;
  height: 435px;
  width: 675px;
  border-radius: 12px;
  background: #f3f7fe;
  overflow: hidden;
`
const StyledGeogebra = styled(Geogebra)<{ fade: boolean }>`
  position: absolute;
  width: 680px;
  height: 440px;
  opacity: ${({ fade }) => (fade ? 1 : 0)};
  transition: 0.1s ease-out;
`
const ButtonContainer = styled.div`
  position: absolute;
  top: 640px;
  left: 50%;
  translate: -50%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  gap: 20px;
`
const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`

const fadeOut = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`
const PageFeedbacks = styled.label<{ move?: boolean; fading?: boolean }>`
  position: absolute;
  top: ${({ move }) => (move ? '615px' : '575px')};
  left: 50%;
  transform: translateX(-50%);
  width: 500px;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;
  display: flex;
  align-items: center;
  text-align: center;
  justify-content: center;
  color: #444444;
  transition: 0.3s ease-out;
  animation: ${({ fading }) => (fading ? fadeOut : fadeIn)} 0.3s ease-out;
  opacity: ${({ fading }) => (fading ? 0 : 1)};
`
const DottedLine = styled.div<{ opacityVal: number; left: number }>`
  position: absolute;
  width: 230px;
  height: 0px;
  left: ${(a) => a.left}px;
  /* left: 249px; */
  top: 268px;
  border: 2.5px dashed #1a1a1a;
  border-radius: 50px;
  transform: rotate(-90deg);
  opacity: ${(props) => (1 / props.opacityVal) * 50}%;
  transition: opacity 0.3s;
  pointer-events: none;
`
const StackOnboarding = styled(OnboardingAnimation).attrs({ type: 'moveUp' })`
  position: absolute;
  top: 185px;
  left: 315px;
  pointer-events: none;
`

const textArray1 = ['triangular', 'square', 'rectangular']
const textArray2 = ['triangles', 'squares', 'rectangles']

export const AppletG06GMC05S1GB01: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const ggbApi = useRef<GeogebraAppApi | null>(null)
  const [ggbLoaded, setGGbLoaded] = useState<boolean>(false)
  const [clickStage, setClickStage] = useState<number>(0)
  const [zCoord, setZCoord] = useState<number | undefined>(0)
  const resolvedZCoord = zCoord ? zCoord : 1
  const [showLine, setShowLine] = useState<number | undefined>(0)
  const [index, setIndex] = useState<number>(0)

  const playMouseClick = useSFX('mouseClick')
  const playMouseIn = useSFX('mouseIn')
  const playMouseOut = useSFX('mouseOut')
  const onInteraction = useContext(AnalyticsContext)

  const onApiReady = useCallback(
    (api: GeogebraAppApi | null) => {
      ggbApi.current = api
      setGGbLoaded(api != null)

      if (api == null) return
      api.registerClientListener((e: any) => {
        if (e.type === 'mouseDown' && e.hits[0] === 'A') {
          onInteraction('drag')
          playMouseIn()
        } else if (e.type === 'dragEnd' && e.target === 'A') {
          onInteraction('drop')
          playMouseOut()
        }
      })
    },
    [onInteraction, playMouseIn, playMouseOut],
  )

  const onTriangleClick = () => {
    playMouseClick()
    if (ggbLoaded) {
      ggbApi.current?.setValue('p', 1)
    }
    setClickStage(1)
    setIndex(1)
  }
  const onSquareClick = () => {
    playMouseClick()
    if (ggbLoaded) {
      ggbApi.current?.setValue('p', 2)
    }
    setClickStage(2)
    setIndex(2)
  }
  const onRectangleClick = () => {
    playMouseClick()
    if (ggbLoaded) {
      ggbApi.current?.setValue('p', 3)
    }
    setClickStage(3)
    setIndex(3)
  }
  const onNextClick = () => {
    setClickStage(4)
    if (ggbLoaded) ggbApi.current?.setValue('next', 2)
  }
  const onTryNewClick = () => {
    setClickStage(0)
    if (ggbLoaded) {
      ggbApi.current?.setValue('p', 0)
      // ggbApi.current?.setValue('next', 1)
      // ggbApi.current?.setValue('an', 0)
    }
  }

  useEffect(() => {
    if (ggbLoaded) setZCoord(ggbApi.current?.getZcoord('A'))
  }, [ggbLoaded, zCoord])

  useEffect(() => {
    const api = ggbApi.current
    if (api && ggbLoaded) {
      api.registerObjectUpdateListener('A', () => setZCoord(ggbApi.current?.getZcoord('A')))
      return () => {
        ggbApi.current?.unregisterObjectUpdateListener('A')
      }
    }
  }, [ggbLoaded, zCoord])

  useEffect(() => {
    if (ggbLoaded) setShowLine(ggbApi.current?.getValue('an'))
  }, [ggbLoaded, zCoord])

  useEffect(() => {
    const api = ggbApi.current
    if (api && ggbLoaded) {
      api.registerObjectUpdateListener('an', () => setShowLine(ggbApi.current?.getValue('an')))
      return () => {
        ggbApi.current?.unregisterObjectUpdateListener('an')
      }
    }
  }, [ggbLoaded, zCoord])

  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#F6F6F6',
        id: 'g06-gmc05-s1-gb01',
        onEvent,
        className,
      }}
    >
      <TextHeader
        text="Create 3D shapes by stacking 2D shape."
        backgroundColor="#F6F6F6"
        buttonColor="#1A1A1A"
      />
      <MainContainer>
        {/* the ggb is different from the ggb team given because another dev
        worked on this before and he did some modifications on the applet for the
        applet, so i made a copy of the applet and added a script that was
        given by the ggb team*/}
        <StyledGeogebra
          fade={ggbLoaded}
          materialId={'kfjr2dq3'}
          onApiReady={onApiReady}
        ></StyledGeogebra>
      </MainContainer>
      <FirstPageText fade={clickStage > 0}>No shape selected</FirstPageText>
      {ggbLoaded && (
        <>
          {!(clickStage > 0) && (
            <ButtonContainer>
              <ToggleSquareButton
                isClicked={clickStage == 1}
                ImgSrc={triangleSVG}
                onClick={onTriangleClick}
              />
              <ToggleSquareButton
                isClicked={clickStage == 2}
                ImgSrc={squareSVG}
                onClick={onSquareClick}
              />
              <ToggleSquareButton
                isClicked={clickStage == 3}
                ImgSrc={rectangleSVG}
                onClick={onRectangleClick}
              />
            </ButtonContainer>
          )}
          {clickStage > 0 && clickStage < 4 && <TextButton onClick={onNextClick}>Next</TextButton>}
          {clickStage == 4 && (
            <OutlineButton imgSource={tryNew} onClick={onTryNewClick} disabled={zCoord !== 5}>
              Try New
            </OutlineButton>
          )}

          <PageFeedbacks fading={clickStage !== 0}>Select a 2D base shape.</PageFeedbacks>
          <PageFeedbacks
            fading={clickStage !== 1 && clickStage !== 2 && clickStage !== 3}
            move={clickStage < 4}
          >
            Great! Your prism will have a {textArray1[index - 1]} base.
          </PageFeedbacks>
          <PageFeedbacks
            fading={clickStage < 4 || zCoord === 5}
            move={clickStage > 4 || zCoord !== 5}
          >
            Slide up to stack the {textArray2[index - 1]}.
          </PageFeedbacks>
          <PageFeedbacks fading={zCoord !== 5} move={zCoord === 5}>
            A {textArray1[index - 1]} prism is formed by stacking {textArray2[index - 1]}.
          </PageFeedbacks>

          {zCoord !== 5 && showLine == 1 && (
            <DottedLine left={index == 1 ? 249 : 220} opacityVal={resolvedZCoord}></DottedLine>
          )}
          {showLine == 1 && (
            <OnboardingController>
              <OnboardingStep index={0}>
                <StackOnboarding complete={zCoord === 5} />
              </OnboardingStep>
            </OnboardingController>
          )}
        </>
      )}
    </AppletContainer>
  )
}

import { FC, useCallback, useContext, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { OnboardingAnimation } from '@/atoms/OnboardingAnimation'
import { OnboardingController } from '@/atoms/OnboardingController'
import { OnboardingStep } from '@/atoms/OnboardingStep'
import { AppletContainer } from '@/common/AppletContainer'
import { Geogebra } from '@/common/Geogebra'
import { GeogebraAppApi } from '@/common/Geogebra/Geogebra.types'
import { TextHeader } from '@/common/Header'
import { AnalyticsContext, AppletInteractionCallback } from '@/contexts/analytics'
import { useSFX } from '@/hooks/useSFX'

import loadScreen from './Assets/loadingPage.png'
import { ToggleButtton } from './Buttons/ToggleButtons'

const FONT_SIZE_FOR_MOBILE = 26

const MainContainer = styled.div`
  position: absolute;
  top: 100px;
  left: 21px;
  width: 675px;
  height: 515px;
  border-radius: 12px;
  overflow: hidden;
`
const LoadScreenBox = styled.img`
  position: absolute;
  width: 680px;
  height: 520px;
  left: 18px;
  top: 98px;
`
const StyledGeogebra = styled(Geogebra)<{ fadeGGB: boolean }>`
  width: 680px;
  height: 520px;
  opacity: ${({ fadeGGB }) => (fadeGGB ? 1 : 0)};
  transition: 300ms ease-out;
`
const ButtonContainer = styled.button`
  position: absolute;
  width: 146px;
  height: 60px;
  left: 50%;
  translate: -50%;
  top: 710px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background-color: transparent;
  gap: 25px;
  &:disabled {
    pointer-events: none;
    cursor: not-allowed;
    opacity: 20%;
  }
`
const FeedbackContainer = styled.div<{ move?: boolean; fade?: boolean }>`
  position: absolute;
  top: 650px;
  left: ${(props) => (props.move ? '-50%' : '50%')};
  translate: -50%;
  opacity: ${(props) => (props.fade ? 0 : 1)};
  transition: 0.2s ease-out;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
`
const PageFeedbacks = styled.label`
  width: 720px;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #444444;
  @media (max-width: 768px) {
    font-size: ${FONT_SIZE_FOR_MOBILE}px;
  }
`
const AppletOnboarding = styled(OnboardingAnimation)<{ left: number; top: number; type: string }>`
  position: absolute;
  top: ${(a) => a.top}px;
  left: ${(a) => a.left}px;
  width: 400px;
`

const StyledTextHeader = styled(TextHeader)`
  /* font-size: 28px !important; */
  p {
    font-size: 20px;
    @media (max-width: 768px) {
      font-size: ${FONT_SIZE_FOR_MOBILE}px;
    }
  }
`
const buttonFeedbacks = [
  'Opposite sides are equal in length and parallel to each other.',
  'Opposite angles are equal to each other.',
  'Diagonal bisect each other.',
]

export const AppletLandingPageApplet3: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const ggbApi = useRef<GeogebraAppApi | null>(null)
  const [ggbLoaded, setGgbLoaded] = useState<boolean>(false)

  const [clickStage, setClickStage] = useState<0 | 1 | 2 | 3>(0)

  const [hasInteracted, setInteracted] = useState<number>()

  const playMouseClick = useSFX('mouseClick')
  const playMouseIn = useSFX('mouseIn')
  const playMouseOut = useSFX('mouseOut')
  const onInteraction = useContext(AnalyticsContext)

  const onApiReady = useCallback(
    (api: GeogebraAppApi | null) => {
      ggbApi.current = api
      setGgbLoaded(api != null)

      if (api == null) return
      api.registerClientListener((e: any) => {
        if (
          e.type === 'mouseDown' &&
          (e.hits[0] === 'A' || e.hits[0] === 'B' || e.hits[0] === 'C' || e.hits[0] === 'D')
        ) {
          onInteraction('drag')
          playMouseIn()
        } else if (
          e.type === 'dragEnd' &&
          (e.target === 'A' || e.target === 'B' || e.target === 'C' || e.target === 'D')
        ) {
          onInteraction('drop')
          playMouseOut()
        }
        if (e.type === 'dragEnd' && e.target !== 'C') {
          ggbApi.current?.setFixed(e.target, false, false)

          const timer = setTimeout(() => {
            ggbApi.current?.setFixed(e.target, false, true)
          }, 100)

          return () => {
            clearTimeout(timer)
          }
        }
      })
    },
    [onInteraction, playMouseIn, playMouseOut],
  )

  const onSidesClick = () => {
    playMouseClick()
    setClickStage(1)
    if (ggbLoaded) ggbApi.current?.evalCommand('RunClickScript(pic3)')
  }

  const onAnglesClick = () => {
    playMouseClick()
    setClickStage(2)
    if (ggbLoaded) ggbApi.current?.evalCommand('RunClickScript(pic1)')
  }

  const onDiagonalsClick = () => {
    playMouseClick()
    setClickStage(3)
    if (ggbLoaded) ggbApi.current?.evalCommand('RunClickScript(pic5)')
  }

  useEffect(() => {
    if (ggbLoaded) ggbApi.current?.getValue('show')
  }, [ggbLoaded])

  useEffect(() => {
    const api = ggbApi.current
    if (api && ggbLoaded) {
      api.registerObjectUpdateListener('show', () =>
        setInteracted(ggbApi.current?.getValue('show')),
      )
      return () => {
        ggbApi.current?.unregisterObjectUpdateListener('show')
      }
    }
  }, [ggbLoaded])

  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#f6f6f6',
        id: 'landing-page-applet3',
        onEvent,
        className,
      }}
    >
      <StyledTextHeader
        text="Explore properties of a parallelogram."
        backgroundColor="#f6f6f6"
        buttonColor="#1a1a1a"
      />
      <LoadScreenBox src={loadScreen} />
      <MainContainer>
        <StyledGeogebra
          materialId="kbgwsra6"
          onApiReady={onApiReady}
          fadeGGB={ggbLoaded ? true : false}
        />
      </MainContainer>
      <ButtonContainer disabled={hasInteracted !== 0}>
        <ToggleButtton isClicked={clickStage === 1} onClick={onSidesClick}>
          Sides
        </ToggleButtton>
        <ToggleButtton isClicked={clickStage === 2} onClick={onAnglesClick}>
          Angles
        </ToggleButtton>
        <ToggleButtton isClicked={clickStage === 3} onClick={onDiagonalsClick}>
          Diagonals
        </ToggleButtton>
      </ButtonContainer>
      <FeedbackContainer fade={hasInteracted === 0}>
        <PageFeedbacks>
          Drag the vertex on the quadrilateral to create a parallelogram.
        </PageFeedbacks>
      </FeedbackContainer>
      {hasInteracted == 0 && (
        <FeedbackContainer fade={clickStage === 1 || clickStage === 2 || clickStage === 3}>
          <PageFeedbacks>Select the theorem and check the property.</PageFeedbacks>
        </FeedbackContainer>
      )}
      <FeedbackContainer>
        <PageFeedbacks>{buttonFeedbacks[clickStage - 1]}</PageFeedbacks>
      </FeedbackContainer>
      <OnboardingController>
        <OnboardingStep index={0}>
          <AppletOnboarding
            type="moveAllDirections"
            top={433}
            left={307}
            complete={hasInteracted === 0}
          />
        </OnboardingStep>
        <OnboardingStep index={1}>
          <AppletOnboarding
            type="click"
            top={690}
            left={-5}
            complete={clickStage === 1 || clickStage === 2 || clickStage === 3}
          />
        </OnboardingStep>
      </OnboardingController>
    </AppletContainer>
  )
}

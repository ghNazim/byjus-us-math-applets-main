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

import { TextButton } from './Buttons/AnimatedButtons'
import retryIcon from './Buttons/Assets/retryIcon.svg'
import { OutlineButton, ToggleButton } from './Buttons/ToggleButtons'

const StyledGeogebra = styled(Geogebra)`
  position: absolute;
  top: 90px;
  left: 50%;
  translate: -50%;
  width: 680px;
  height: 460px;
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
const ToggleButtonContainer = styled.button`
  position: absolute;
  width: 500px;
  left: 50%;
  translate: -50%;
  top: 615px;
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
const PageFeedbacks = styled.label<{ move?: boolean }>`
  position: absolute;
  top: ${({ move }) => (move ? '560px' : '605px')};
  left: 50%;
  transform: translateX(-50%);
  width: 600px;
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
`
const AppletOnboarding = styled(OnboardingAnimation)<{ left: number; top: number; type: string }>`
  position: absolute;
  top: ${(a) => a.top}px;
  left: ${(a) => a.left}px;
  width: 400px;
`
const Patch = styled.div`
  position: absolute;
  top: 515px;
  left: 0px;
  width: 720px;
  background-color: #fff;
  height: 50px;
`

export const AppletG07GMC02S1GB03: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const [clickStage, setClickStage] = useState(0)
  const [textControl, setTextControl] = useState(0)
  const [buttonDisable, setDisabled] = useState<number | undefined>(0)
  const [toggleNum, setToggleNum] = useState(0)
  const ggbApi = useRef<GeogebraAppApi | null>(null)
  const [ggbLoaded, setGgbLoaded] = useState<boolean>(false)

  const playMouseClick = useSFX('mouseClick')
  const playMouseIn = useSFX('mouseIn')
  const playMouseOut = useSFX('mouseOut')
  const onInteraction = useContext(AnalyticsContext)

  const texts = [
    'Follow the steps given for construction of the triangle.',
    'Let’s take the side of length 8 cm as the base.',
    'Join the points to draw the base.',
    'Now, let’s proceed to the next step.',
    'Choose the length of the side originating from point A.',
    `Extend the compass arm to measure a length of ${toggleNum} cm.`,
    'Good job, let’s draw the circle.',
    'Now, let’s proceed to the next step.',
    `Extend the compass arm to measure a length of ${toggleNum === 4 ? 3 : 4} cm.`,
    `Extend the compass arm to measure a length of ${toggleNum === 4 ? 3 : 4} cm.`,
    'Well done, let’s draw the circle.',
    'Now, let’s proceed to the next step.',
    'As you can observe, we cannot create a triangle with these measurements because there is no point of intersection between the circles.',
  ]

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
    [ggbApi, onInteraction],
  )

  const onStartClick = () => {
    playMouseClick()
    setTextControl(1)
    setClickStage(1)
    if (ggbLoaded) ggbApi.current?.evalCommand('RunClickScript(start)')
  }
  const onNextClick = () => {
    playMouseClick()
    setClickStage(2)
    setTextControl((a) => a + 1)
    if (ggbLoaded) ggbApi.current?.evalCommand('RunClickScript(next)')
  }
  const onRetryClick = () => {
    playMouseClick()
    setTextControl(0)
    setClickStage(0)
    if (ggbLoaded) ggbApi.current?.evalCommand('RunClickScript(button1)')
  }
  const onFirstToggleClick = () => {
    playMouseClick()
    setToggleNum(3)
    setClickStage(3)
    if (ggbLoaded) ggbApi.current?.evalCommand('RunClickScript(len3)')
  }
  const onSecondToggleClick = () => {
    playMouseClick()
    setToggleNum(4)
    setClickStage(4)
    if (ggbLoaded) ggbApi.current?.evalCommand('RunClickScript(len4)')
  }
  useEffect(() => {
    const api = ggbApi.current
    if (api && ggbLoaded) {
      api.registerObjectUpdateListener('nb', () => setDisabled(ggbApi.current?.getValue('nb')))
      return () => {
        ggbApi.current?.unregisterObjectUpdateListener('nb')
      }
    }
  }, [ggbLoaded])
  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#f6f6f6',
        id: 'g07-gmc02-s1-gb03',
        onEvent,
        className,
      }}
    >
      <TextHeader
        text="Construct a triangle with sides of lengths 3 cm, 4 cm, and 8 cm."
        backgroundColor="#f6f6f6"
        buttonColor="#1a1a1a"
      />
      <StyledGeogebra materialId="fjh8qmrj" onApiReady={onApiReady} />
      {ggbLoaded && (
        <>
          <Patch />
          {textControl === 4 && (
            <ToggleButtonContainer>
              <ToggleButton isClicked={clickStage === 3} onClick={onFirstToggleClick}>
                3 cm
              </ToggleButton>
              <ToggleButton isClicked={clickStage === 4} onClick={onSecondToggleClick}>
                4 cm
              </ToggleButton>
            </ToggleButtonContainer>
          )}
          <PageFeedbacks move={textControl === 4 || textControl === 12}>
            <div>{texts[textControl]}</div>
          </PageFeedbacks>
          {clickStage === 0 && (
            <ButtonContainer>
              <TextButton onClick={onStartClick}>Start</TextButton>
            </ButtonContainer>
          )}
          {clickStage > 0 && textControl < 12 && (
            <ButtonContainer>
              <TextButton onClick={onNextClick} disabled={buttonDisable == 0}>
                Next
              </TextButton>
            </ButtonContainer>
          )}
          {textControl === 12 && (
            <ButtonContainer>
              <OutlineButton imgSource={retryIcon} onClick={onRetryClick}>
                Reset
              </OutlineButton>
            </ButtonContainer>
          )}
          <OnboardingController>
            <OnboardingStep index={0}>
              <AppletOnboarding
                type="click"
                top={690}
                left={160}
                complete={clickStage === 1 || clickStage === 2 || clickStage === 3}
              />
            </OnboardingStep>
          </OnboardingController>
        </>
      )}
    </AppletContainer>
  )
}

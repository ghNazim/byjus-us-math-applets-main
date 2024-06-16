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
import { InfoTabCommon } from './Components/InfoTab'

const StyledGeogebra = styled(Geogebra)`
  position: absolute;
  top: 90px;
  left: 50%;
  translate: -50%;
  width: 680px;
  height: 440px;
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
  top: ${({ move }) => (move ? '560px' : '610px')};
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
export const AppletG07GMC03S1GB05: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const [clickStage, setClickStage] = useState(0)
  const [textControl, setTextControl] = useState(0)
  const [isOpen, setOpen] = useState(true)
  const [buttonDisable, setDisabled] = useState<number | undefined>(0)
  const [toggleNum, setToggleNum] = useState(0)
  const [textIndex, setTextIndex] = useState(0)

  const ggbApi = useRef<GeogebraAppApi | null>(null)
  const [ggbLoaded, setGgbLoaded] = useState<boolean>(false)

  const playMouseClick = useSFX('mouseClick')
  const playMouseIn = useSFX('mouseIn')
  const playMouseOut = useSFX('mouseOut')
  const onInteraction = useContext(AnalyticsContext)

  const texts = [
    'Follow the steps given for construction of the triangle.',
    'Connect the dots to draw the included side of length 7 cm.',
    'Now, let’s proceed to the next step.',
    'Choose the angle to be drawn at one end of the base.',
    `Measure the angle ${toggleNum}° from vertex A to mark it as one side.`,
    `Join the two points.`,
    'Now, let’s proceed to the next step.',
    `Measure the angle ${toggleNum === 75 ? '45' : '75'}° from vertex B to mark it as other side.`,
    `Join the two points.`,
    `Great! You constructed a triangle with
    75°, 45° and an included side of 7 cm.`,
  ]

  const onApiReady = useCallback(
    (api: GeogebraAppApi | null) => {
      ggbApi.current = api
      setGgbLoaded(api != null)
      if (api == null) return
      api.registerClientListener((e: any) => {
        if (
          e.type === 'mouseDown' &&
          (e.hits[0] === 'E' ||
            e.hits[0] === 'L' ||
            e.hits[0] === 'Lt' ||
            e.hits[0] === 'R' ||
            e.hits[0] === 'Rt')
        ) {
          onInteraction('drag')
          playMouseIn()
        } else if (
          e.type === 'dragEnd' &&
          (e.target === 'E' ||
            e.target === 'L' ||
            e.target === 'Lt' ||
            e.target === 'R' ||
            e.target === 'Rt')
        ) {
          onInteraction('drop')
          playMouseOut()
        }
        if (e.type === 'dragEnd') {
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

  const onStartClick = () => {
    playMouseClick()
    setOpen(false)
    setTextControl(1)
    setClickStage(1)
    if (ggbLoaded) ggbApi.current?.evalCommand('RunClickScript(start)')
  }
  const onNextClick = () => {
    playMouseClick()
    setOpen(false)
    setClickStage(2)
    setTextControl((a) => a + 1)
    if (ggbLoaded) ggbApi.current?.evalCommand('RunClickScript(next)')
  }
  const onRetryClick = () => {
    playMouseClick()
    setOpen(true)
    setTextControl(0)
    setClickStage(0)
    if (ggbLoaded) ggbApi.current?.evalCommand('RunClickScript(button1)')
  }
  const onFirstToggleClick = () => {
    playMouseClick()
    setToggleNum(75)
    setClickStage(3)
    if (ggbLoaded) ggbApi.current?.evalCommand('RunClickScript(ang60)')
  }
  const onSecondToggleClick = () => {
    playMouseClick()
    setToggleNum(45)
    setClickStage(4)
    if (ggbLoaded) ggbApi.current?.evalCommand('RunClickScript(ang30)')
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

  useEffect(() => {
    if (ggbLoaded) setTextIndex(0)
    switch (textControl) {
      case 1:
        setOpen(false)
        break
      case 2:
        setTextIndex(1)
        setOpen(true)
        break
      case 3:
        setOpen(false)
        break
      case 5:
        setOpen(false)
        break
      case 6:
        setTextIndex(2)
        setOpen(true)
        break
      case 7:
        setOpen(false)
        break
    }
  }, [ggbLoaded, textControl])

  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#f6f6f6',
        id: 'g07-gmc03-s1-gb05',
        onEvent,
        className,
      }}
    >
      <TextHeader
        text="Construct a triangle with
        75°, 45° and an included side of 7 cm."
        backgroundColor="#f6f6f6"
        buttonColor="#1a1a1a"
      />
      <StyledGeogebra materialId="t8psqyam" onApiReady={onApiReady} />
      {ggbLoaded && (
        <>
          <InfoTabCommon setMenuOpen={isOpen} textIndex={textIndex} />
          {textControl === 3 && (
            <ToggleButtonContainer>
              <ToggleButton isClicked={clickStage === 3} onClick={onFirstToggleClick}>
                75°
              </ToggleButton>
              <ToggleButton isClicked={clickStage === 4} onClick={onSecondToggleClick}>
                45°
              </ToggleButton>
            </ToggleButtonContainer>
          )}
          <PageFeedbacks move={textControl === 3 || textControl === 12}>
            <div>{texts[textControl]}</div>
          </PageFeedbacks>
          {clickStage === 0 && (
            <ButtonContainer>
              <TextButton onClick={onStartClick}>Start</TextButton>
            </ButtonContainer>
          )}
          {clickStage > 0 && textControl < 9 && (
            <ButtonContainer>
              <TextButton onClick={onNextClick} disabled={buttonDisable == 0}>
                Next
              </TextButton>
            </ButtonContainer>
          )}
          {textControl === 9 && (
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

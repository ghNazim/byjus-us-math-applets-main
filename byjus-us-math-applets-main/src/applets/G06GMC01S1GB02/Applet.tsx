import { FC, useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { OnboardingAnimation } from '@/atoms/OnboardingAnimation'
import { OnboardingController } from '@/atoms/OnboardingController'
import { OnboardingStep } from '@/atoms/OnboardingStep'
import { AppletContainer } from '@/common/AppletContainer'
import { Geogebra } from '@/common/Geogebra'
import { ClientListener, GeogebraAppApi } from '@/common/Geogebra/Geogebra.types'
import { TextHeader } from '@/common/Header'
import { AppletInteractionCallback } from '@/contexts/analytics'
import { useSFX } from '@/hooks/useSFX'

import RetryIcon from './assets/retry.svg'

const GeogebraContainer = styled(Geogebra)`
  position: absolute;
  margin-left: 2.5%;
  width: 95%;
  height: 100%;
  top: 65px;
  left: -10px;
  /* border: 5px solid red; */
  overflow: hidden;
`

const ColoredSpan = styled.span<{ backgroundColor: string; color: string }>`
  color: ${(a) => a.color};
  background-color: ${(a) => a.backgroundColor};
  padding: 0 5px;
  margin: 0 5px;
  border-radius: 3px;
`

const BottomText = styled.div<{ bottom: number }>`
  display: flex;
  position: absolute;
  width: 100%;
  justify-content: center;
  bottom: ${(a) => a.bottom}px;
  align-items: center;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  color: #444444;
`

const ButtonContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  position: absolute;
  bottom: 40px;
`

const Btn = styled.div`
  display: flex;
  padding: 16px 24px;
  justify-content: center;
  align-items: center;
  gap: 12px;
  border-radius: 10px;
  background: #1a1a1a;
  color: white;
  text-align: center;
  font-size: 24px;
  font-family: Nunito;
  font-weight: 700;
  line-height: 32px;
  cursor: pointer;
`

const PatchForHidingAnimationButtons = styled.div`
  position: absolute;
  width: 50px;
  height: 50px;
  left: 10px;
  bottom: 10px;
  background: white;
`

const Onboarding = styled(OnboardingAnimation)<{ left: number; top: number }>`
  position: absolute;
  left: ${(a) => a.left}px;
  top: ${(a) => a.top}px;
`
const points = ['A', 'B', 'C', 'D']
export const AppletG06GMC01S1GB02: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const ggbApi = useRef<GeogebraAppApi | null>(null)
  const [ggbLoaded, setGgbLoaded] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showRetryBtn, setShowRetryBtn] = useState(false)
  const [disableFirstOnboarding, setDisableFirstOnboarding] = useState(false)

  //sound
  const playMouseClick = useSFX('mouseClick')
  const playWrongAnswer = useSFX('incorrect')
  const playCorrectAnswer = useSFX('correct')
  const playMouseIn = useSFX('mouseIn')
  const playMouseOut = useSFX('mouseOut')

  const onGgbLoad = useCallback((api: GeogebraAppApi | null) => {
    if (api == null) return
    api.registerClientListener(ggbClientListener)
    ggbApi.current = api
    api.setVisible('red', false)
    setGgbLoaded(true)

    return () => api.unregisterClientListener(ggbClientListener)
  }, [])

  const ggbClientListener: ClientListener = useCallback((e) => {
    if (e.type === 'mouseDown' && (e.hits[0] === 'M' || e.hits[0] == 'PP')) {
      playMouseIn()
    } else if (e.type === 'dragEnd') {
      playMouseOut()
    }

    if (e.type === `select` && e.target === 'M') {
      setDisableFirstOnboarding(true)
    }
  }, [])

  useEffect(() => {
    if (ggbLoaded && ggbApi.current) {
      ggbApi.current.registerObjectUpdateListener('stage', () => {
        if (currentIndex === 3) {
          ggbApi.current?.unregisterObjectUpdateListener('stage')
        } else {
          setCurrentIndex((prev) => {
            if (prev !== 4) {
              playCorrectAnswer()
            }
            return prev + 1
          })
        }
      })

      ggbApi.current.registerObjectUpdateListener('red', () => {
        const wrongAnswer = ggbApi.current ? ggbApi.current.getVisible('red') : false
        if (wrongAnswer) {
          ggbApi.current?.setVisible('red', true)
          playWrongAnswer()
        }

        const timer = setTimeout(() => {
          ggbApi.current?.setVisible('red', false) //disabling red overlay
          ggbApi.current?.setValue('check', 1) //enabling check button
        }, 2000)

        return () => clearTimeout(timer)
      })

      ggbApi.current.registerObjectUpdateListener('ss2', () => {
        if (ggbApi.current?.getValue('ss2') === 4) {
          setShowRetryBtn(true)
        }
      })

      return () => {
        ggbApi.current?.unregisterObjectUpdateListener('stage')
        ggbApi.current?.unregisterObjectUpdateListener('red')
        ggbApi.current?.unregisterObjectUpdateListener('ss2')
      }
    }
  }, [ggbLoaded, ggbApi])

  const handleRetryBtn = () => {
    playMouseClick()
    if (ggbApi.current) {
      ggbApi.current.evalCommand('SetValue(stage,1)')
      ggbApi.current.evalCommand('SetValue(PP, C)')
      ggbApi.current.evalCommand('SetValue(ss, 0)')
      ggbApi.current.evalCommand('SetValue(ss2, 0)')
      ggbApi.current.evalCommand('SetValue(PP, A)')
      ggbApi.current.evalCommand('SetVisibleInView(M, 1, true)')
      ggbApi.current.evalCommand('SetValue(check, false)')
      setCurrentIndex(0)
      setShowRetryBtn(false)
    }
  }

  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#f0f0f0',
        id: 'g06-gmc01-s1-gb02',
        onEvent,
        className,
      }}
    >
      <GeogebraContainer materialId="eu43am7j" width={700} height={750} onApiReady={onGgbLoad} />
      <TextHeader
        text="Plot and connect the given points to draw a polygon."
        backgroundColor="#f0f0f0"
        buttonColor="#1a1a1a"
      />

      {ggbLoaded && (
        <OnboardingController>
          <OnboardingStep index={0}>
            <Onboarding
              left={97}
              top={245}
              type="moveAllDirections"
              complete={disableFirstOnboarding}
            />
          </OnboardingStep>
          <BottomText bottom={120}>
            {showRetryBtn ? (
              <>You did it! You’ve have created the quadrilateral ABCD.</>
            ) : (
              <>
                {currentIndex < 4 ? (
                  <>
                    Move the pointer to plot point{' '}
                    <ColoredSpan color="white" backgroundColor="#1CB9D9">
                      {points[currentIndex]}
                    </ColoredSpan>
                  </>
                ) : (
                  <>Connect the points to create the quadrilateral.</>
                )}
              </>
            )}
          </BottomText>
          {showRetryBtn && (
            <ButtonContainer>
              <Btn onClick={handleRetryBtn}>
                <img src={RetryIcon} alt="Retry" /> Retry
              </Btn>
            </ButtonContainer>
          )}
          <PatchForHidingAnimationButtons />
        </OnboardingController>
      )}
    </AppletContainer>
  )
}

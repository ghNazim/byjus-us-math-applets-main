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
import { interleave } from '@/utils/array'

import aud2 from './Audio/2.mp3'
import aud3 from './Audio/3.mp3'
import aud4 from './Audio/4.mp3'
import aud5 from './Audio/5.mp3'
import aud6 from './Audio/6.mp3'
import aud7 from './Audio/7.mp3'
import introAudio from './Audio/introAudio.mp3'
import { VoiceOverCommon, VOProvider } from './Components/VoiceOverCommon'

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
const StyledGeogebra = styled(Geogebra)`
  margin: 0 auto;
  width: 680px;
  height: 520px;
  position: absolute;
  top: 100px;
  left: 50px;
`
const PageFeedbacks = styled.label<{
  fading?: boolean
  top?: number
}>`
  position: absolute;
  top: ${({ top }) => (top ? `${top}px` : 0)};
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
const AppletOnboarding = styled(OnboardingAnimation)<{ left: number; top: number; type: string }>`
  position: absolute;
  top: ${(a) => a.top}px;
  left: ${(a) => a.left}px;
  width: 400px;
`

const labelColors = ['#FBF8CC', '#FDE4CF', '#FFCFD2', '#F1C0E8', '#90DBF4', '#98F5E1', '#B9FBC0']
const labelVals = ['1', '3', '5', '7', '9', '11', '13']
const audioFiles = ['', aud2, aud3, aud4, aud5, aud6, aud7]

export const AppletG08EEC02WP01GB02: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const ggbApi = useRef<GeogebraAppApi | null>(null)
  const [ggbLoaded, setGgbLoaded] = useState<boolean>(false)

  const playMouseIn = useSFX('mouseIn')
  const playMouseOut = useSFX('mouseOut')
  const onInteraction = useContext(AnalyticsContext)

  const [squareValue, setSquareValue] = useState<number | undefined>(1)

  const valueArray = labelVals.slice(0, squareValue).map((value, index) => (
    <span key={index} style={{ background: labelColors[index], borderRadius: '5px' }}>
      &nbsp; {value} &nbsp;
    </span>
  ))

  const interleavedArray = [
    ...interleave(
      valueArray,
      Array.from({ length: valueArray.length - 1 }, (_, i) => (
        <span key={valueArray.length + i}>&nbsp;+&nbsp;</span>
      )),
    ),
  ]

  const onApiReady = useCallback(
    (api: GeogebraAppApi | null) => {
      ggbApi.current = api
      setGgbLoaded(api != null)

      if (api == null) return
      api.registerClientListener((e: any) => {
        if (e.type === 'mouseDown' && e.hits[0] === 'Dragger') {
          onInteraction('drag')
          playMouseIn()
        } else if (e.type === 'dragEnd' && e.target === 'Dragger') {
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

  useEffect(() => {
    const api = ggbApi.current
    if (api && ggbLoaded) {
      api.registerObjectUpdateListener('HorizontalMarker', () =>
        setSquareValue(ggbApi.current?.getValue('HorizontalMarker')),
      )
      return () => {
        ggbApi.current?.unregisterObjectUpdateListener('HorizontalMarker')
      }
    }
  }, [ggbLoaded])

  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#F6F6F6',
        id: 'g08-eec02-wp01-gb02',
        onEvent,
        className,
      }}
    >
      <TextHeader
        text="Examine the relationship between perfect squares and sum of consecutive odd numbers."
        backgroundColor="#F6F6F6"
        buttonColor="#1A1A1A"
      />
      <StyledGeogebra materialId="grwehrba" onApiReady={onApiReady} />
      {ggbLoaded && (
        <>
          <PageFeedbacks top={650} fading={squareValue === 1}>
            {squareValue}&#178; = {(squareValue ?? 0) * (squareValue ?? 0)} = &nbsp;
            {interleavedArray}
          </PageFeedbacks>
          <VOProvider>
            <PageFeedbacks top={660} fading={squareValue !== 1}>
              <VoiceOverCommon enabled={ggbLoaded && squareValue === 1} audioSrc={introAudio} />
              <div>Adjust the size of the square and observe how many unit squares fit inside.</div>
            </PageFeedbacks>
            <PageFeedbacks top={680} fading={squareValue === 1} style={{ width: '700px' }}>
              <VoiceOverCommon
                enabled={squareValue !== 1}
                key={squareValue}
                audioSrc={audioFiles[(squareValue ?? 1) - 1]}
              />
              <div>
                Square of {squareValue} is equal to the sum of first {squareValue} consecutive odd
                numbers.
              </div>
            </PageFeedbacks>
          </VOProvider>
          <OnboardingController>
            <OnboardingStep index={0}>
              <AppletOnboarding
                type="moveAllDirections"
                top={375}
                left={14}
                complete={squareValue !== 1}
              />
            </OnboardingStep>
          </OnboardingController>
        </>
      )}
    </AppletContainer>
  )
}

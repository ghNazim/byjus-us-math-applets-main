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

const StyledGeogebra = styled(Geogebra)<{ fadeGGB: boolean }>`
  width: 680px;
  height: 560px;
  opacity: ${({ fadeGGB }) => (fadeGGB ? 1 : 0)};
  transition: 300ms ease-out;
`
const MainContainer = styled.div`
  position: absolute;
  top: 85px;
  left: 21px;
  width: 680px;
  height: 555px;
  border-radius: 12px;
  overflow: hidden;
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
  top: ${({ move }) => (move ? '740px' : '710px')};
  left: 50%;
  transform: translateX(-50%);
  width: 720px;
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
const AppletOnboarding = styled(OnboardingAnimation).attrs({ type: 'rotateBothSides' })`
  position: absolute;
  top: 250px;
  left: 320px;
  pointer-events: none;
  transform: rotate(40deg);
`

const DEGREE_CONSTANT = 57.2958

export const AppletG07GMC04S1GB02: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const ggbApi = useRef<GeogebraAppApi | null>(null)
  const [ggbLoaded, setGgbLoaded] = useState<boolean>(false)
  const [hasMoved, setMoved] = useState(false)
  const [angleAlpha, setAngleAlpha] = useState<number | undefined>()

  const protractorAngle = Math.max((angleAlpha ?? 0) * DEGREE_CONSTANT)

  const playMouseIn = useSFX('mouseIn')
  const playMouseOut = useSFX('mouseOut')
  const onInteraction = useContext(AnalyticsContext)

  const onApiReady = useCallback(
    (api: GeogebraAppApi | null) => {
      ggbApi.current = api
      setGgbLoaded(api != null)

      if (api == null) return
      api.registerClientListener((e: any) => {
        if (e.type === 'mouseDown' && e.hits[0] === "B''") {
          onInteraction('drag')
          playMouseIn()
        } else if (e.type === 'dragEnd' && e.target === "B''") {
          onInteraction('drop')
          playMouseOut()
          setMoved(true)
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
      api.registerObjectUpdateListener('α', () => setAngleAlpha(ggbApi.current?.getValue('α')))
      return () => {
        ggbApi.current?.unregisterObjectUpdateListener('α')
      }
    }
  }, [ggbLoaded])

  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#f6f6f6',
        id: 'g07-gmc04-s1-gb02',
        onEvent,
        className,
      }}
    >
      <TextHeader
        text="Explore complementary angles."
        backgroundColor="#f6f6f6"
        buttonColor="#1a1a1a"
      />
      <MainContainer>
        <StyledGeogebra
          materialId="xmgz4d8z"
          onApiReady={onApiReady}
          fadeGGB={ggbLoaded ? true : false}
        />
      </MainContainer>
      {ggbLoaded && (
        <>
          <PageFeedbacks move={hasMoved} fading={hasMoved}>
            Observe the relation between ∠AOB and ∠BOC.
          </PageFeedbacks>
          <PageFeedbacks fading={!hasMoved} style={{ top: '660px' }}>
            <span style={{ color: '#1CB9D9' }}>m ∠AOB&nbsp;</span> +
            <span style={{ color: '#CF8B04' }}>&nbsp;m ∠BOC&nbsp;</span> =&nbsp;
            <span style={{ borderRadius: '5px', backgroundColor: '#D9CDFF', color: '#6549C2' }}>
              &nbsp;90°&nbsp;
            </span>
          </PageFeedbacks>
          <PageFeedbacks fading={!hasMoved} style={{ top: '700px' }}>
            <span style={{ color: '#1CB9D9' }}>
              {90 - protractorAngle < 0 ? 0 : (90 - protractorAngle).toFixed(0)}°&nbsp;
            </span>{' '}
            +<span style={{ color: '#CF8B04' }}>&nbsp;{protractorAngle.toFixed(0)}°&nbsp;</span>{' '}
            =&nbsp;
            <span style={{ borderRadius: '5px', backgroundColor: '#D9CDFF', color: '#6549C2' }}>
              &nbsp;90°&nbsp;
            </span>
          </PageFeedbacks>
          <PageFeedbacks move={hasMoved} fading={!hasMoved}>
            Two angles are&nbsp;
            <span style={{ borderRadius: '5px', backgroundColor: '#D9CDFF', color: '#6549C2' }}>
              &nbsp;complementary&nbsp;
            </span>
            &nbsp;if their measures add up to 90°.
          </PageFeedbacks>
          <OnboardingController>
            <OnboardingStep index={0}>
              <AppletOnboarding complete={hasMoved == true} />
            </OnboardingStep>
          </OnboardingController>
        </>
      )}
    </AppletContainer>
  )
}

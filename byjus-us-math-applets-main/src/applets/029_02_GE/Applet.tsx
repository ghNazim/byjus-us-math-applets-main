import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import styled, { keyframes } from 'styled-components'

import { useSFX } from '@/hooks/useSFX'

import { AppletContainer } from '../../common/AppletContainer'
import { Geogebra } from '../../common/Geogebra'
import { GeogebraAppApi } from '../../common/Geogebra/Geogebra.types'
import Animation from '../../common/handAnimations/moveRight.json'
import { TextHeader } from '../../common/Header'
import { PageControl } from '../../common/PageControl'
import { AnalyticsContext, AppletInteractionCallback } from '../../contexts/analytics'

const GGB = styled(Geogebra)`
  position: absolute;
  top: 100px;
`
const fadeInRight = keyframes`
  from {
    opacity: 0;
    transform: translate3d(100%, 0, 0);
  }

  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
`
const PlaceText = styled.div<{ delay: number }>`
  position: absolute;
  top: 526px;
  left: 50%;
  translate: -50%;
  width: 500px;
  color: #444;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 400;
  font-size: 20px;
  line-height: 28px;
  text-align: center;

  animation-duration: ${(props) => props.delay * 1000}ms;
  animation-timing-function: ease;
  animation-delay: ${(props) => props.delay}s;
  animation-iteration-count: 1;
  animation-direction: normal;
  animation-fill-mode: both;
  animation-play-state: running;
  animation-name: ${fadeInRight};
`
const FinalText = styled.p`
  font-size: 24px;
  line-height: 32px;
`

const Texts = [
  undefined,
  undefined,
  undefined,
  <p key={3}>
    Did you notice that the circumference of the circles are multiples of <b>3.14..</b>?
  </p>,
  <p key={4}>
    The constant 3.14.. is known as <b>&pi;</b>
  </p>,
  <p key={5}>
    Interestingly, the numbers multiplied with &pi; are actually the <b>diameter</b> of the
    corresponding circles
  </p>,
  <FinalText key={6}>
    <b>Hence, Circumference = &pi; x Diameter</b>
  </FinalText>,
]

export const Applet02902Ge: React.FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const ggbApi = useRef<GeogebraAppApi | null>(null)
  const [showPageControl, setShowPageControl] = useState(false)
  const [pageIndex, setPageIndex] = useState(0)
  const [nextDisable, setNextDisable] = useState(false)
  const [isReset, setIsReset] = useState(0)
  const onInteraction = useContext(AnalyticsContext)
  const [showHandPointer, setShowHandPointer] = useState(false)
  const [trackPoint, setTrackPoint] = useState('A')
  const [showHandPoint1, setShowHandPoint1] = useState(false)
  const [showHandPoint2, setShowHandPoint2] = useState(true)
  const [showHandPoint3, setShowHandPoint3] = useState(true)
  const playMouseIn = useSFX('mouseIn')
  const playMouseOut = useSFX('mouseOut')

  const onHandleGGB = useCallback(
    (api: GeogebraAppApi | null) => {
      ggbApi.current = api
      if (api == null) return
      setShowPageControl(true)
      setNextDisable(true)
      setShowHandPointer(true)
      setTrackPoint('A')
      setShowHandPoint1(true)
      setShowHandPoint2(true)
      setShowHandPoint3(true)

      api.registerObjectUpdateListener('n', () => {
        if (api.getValue('n') > 0) {
          setShowHandPointer(false)
          setShowHandPoint1(false)
        }
        if (api.getValue('n') == 1) {
          setNextDisable(false)
          api.setVisible('pic2', true)
          api.setVisible('dash1', true)
        } else setNextDisable(true)
      })

      api.registerObjectUpdateListener("n'", () => {
        if (api.getValue("n'") > 0) {
          setShowHandPointer(false)
          setShowHandPoint2(false)
        }
        if (api.getValue("n'") == 1) {
          setNextDisable(false)
          api.evalCommand('SetConditionToShowObject(pic3,circle2==1)')
          api.setVisible('dash2', true)
        } else setNextDisable(true)
      })
      api.registerObjectUpdateListener("n''", () => {
        if (api.getValue("n''") > 0) {
          setShowHandPointer(false)
          setShowHandPoint3(false)
        }
        if (api.getValue("n''") == 1) {
          setNextDisable(false)
          api.evalCommand('SetConditionToShowObject(pic5,circle3==1)')
          api.setVisible('dash3', true)
        } else setNextDisable(true)
      })

      api.registerClientListener((e: any) => {
        if (
          e.type === 'mouseDown' &&
          (e.hits[0] === 'A' || e.hits[0] === "A'" || e.hits[0] === "A''")
        ) {
          onInteraction('drag')
          playMouseIn()
        } else if (
          e.type === 'dragEnd' &&
          (e.target === 'A' || e.target === "A'" || e.target === "A''")
        ) {
          onInteraction('drop')
          playMouseOut()
        }
      })
    },
    [onInteraction, playMouseIn, playMouseOut],
  )

  const onPageChange = useCallback((current: number) => {
    setPageIndex(current)
  }, [])

  const onResetHandle = () => {
    ggbApi.current = null
    setIsReset((r) => r + 1)
  }

  useEffect(() => {
    const api = ggbApi.current
    if (api == null) return
    switch (pageIndex) {
      case 0:
        if (ggbApi.current?.getValue('n')) {
          setNextDisable(false)
        } else setNextDisable(true)
        if (showHandPoint1) {
          setTrackPoint('A')
          setShowHandPointer(true)
        } else setShowHandPointer(false)
        api.setValue('circle2', 0)
        api.setVisible('dash2', false)
        api.setFixed('A', false, true)
        break
      case 1:
        if (ggbApi.current?.getValue("n'") == 1) {
          setNextDisable(false)
        } else setNextDisable(true)
        if (showHandPoint2) {
          setTrackPoint("A'")
          setShowHandPointer(true)
        } else setShowHandPointer(false)
        api.setValue('circle2', 1)
        api.setFixed('A', true, false)
        api.setValue('circle3', 0)
        api.setVisible('dash3', false)
        api.setFixed("A'", false, true)
        break
      case 2:
        if (ggbApi.current?.getValue("n''") == 1) {
          setNextDisable(false)
        } else setNextDisable(true)
        if (showHandPoint3) {
          setTrackPoint("A''")
          setShowHandPointer(true)
        }
        api.setValue('circle3', 1)
        api.setFixed("A'", true, false)
        api.setValue('a', 0)
        api.setValue('b', 0)
        api.setFixed("A''", false, true)
        break
      case 3:
        api.setValue('circle2', 1)
        api.setValue('circle3', 1)
        api.setValue('a', 1)
        api.setValue('b', 1)
        api.setFixed("A''", true, false)
        api.setValue('i', 0)
        break
      case 4:
        api.setValue('circle2', 1)
        api.setValue('circle3', 1)
        api.setValue('a', 0)
        api.setValue('i', 1)
        api.setVisible('Dia1', false)
        api.setVisible('Dia2', false)
        api.setVisible('Dia3', false)
        api.setVisible('pic9', true)
        api.evalCommand('SetConditionToShowObject(pic17,n == 1 && circle2 == 1)')
        api.evalCommand('SetConditionToShowObject(pic18,n == 1 && circle3 == 1)')
        api.setVisible('pic17', true)
        api.setVisible('pic18', true)
        api.setVisible('pi1', false)
        api.setVisible('pi2', false)
        api.setVisible('pi3', false)
        break
      case 5:
        api.setValue('circle2', 1)
        api.setValue('circle3', 1)
        api.setValue('i', 0)
        api.setVisible('Dia1', true)
        api.setVisible('Dia2', true)
        api.setVisible('Dia3', true)
        api.setVisible('pic9', false)
        api.evalCommand('SetConditionToShowObject(pic17,false)')
        api.evalCommand('SetConditionToShowObject(pic18,false)')
        api.setVisible('pic17', false)
        api.setVisible('pic18', false)
        api.setVisible('pi1', true)
        api.setVisible('pi2', true)
        api.setVisible('pi3', true)
        api.setVisible("pi1'", false)
        api.setVisible("pi2'", false)
        api.setVisible("pi3'", false)
        break
      case 6:
        api.setValue('circle2', 1)
        api.setValue('circle3', 1)
        api.setVisible('pi1', false)
        api.setVisible('pi2', false)
        api.setVisible('pi3', false)
        api.setVisible("pi1'", true)
        api.setVisible("pi2'", true)
        api.setVisible("pi3'", true)
        break
    }
  }, [pageIndex])

  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#E7FBFF',
        id: '029_02_GE',
        onEvent,
        className,
      }}
    >
      <TextHeader
        text={
          'Unfold the wire wrapped around the circle to observe the relationship between the circumference and the diameter.'
        }
        backgroundColor="#E7FBFF"
        buttonColor="#A6F0FF"
      />
      <GGB
        key={isReset}
        width={660}
        height={400}
        materialId="rzmgy3pv"
        onApiReady={onHandleGGB}
        pointToTrack={trackPoint}
        showOnBoarding={showHandPointer}
        onboardingAnimationSrc={Animation}
        isApplet2D={true}
      />
      <PlaceText delay={pageIndex >= 3 ? 0.5 : 0} key={pageIndex}>
        {Texts[pageIndex]}
      </PlaceText>
      {showPageControl && (
        <PageControl
          total={7}
          onChange={onPageChange}
          nextDisabled={nextDisable}
          onReset={onResetHandle}
        />
      )}
    </AppletContainer>
  )
}

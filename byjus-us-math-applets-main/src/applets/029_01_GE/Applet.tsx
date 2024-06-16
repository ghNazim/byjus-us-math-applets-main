import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { useSFX } from '@/hooks/useSFX'

import { AnimatedInputSlider } from '../../common/AnimatedInputSlider'
import { AppletContainer } from '../../common/AppletContainer'
import { Geogebra } from '../../common/Geogebra'
import { GeogebraAppApi } from '../../common/Geogebra/Geogebra.types'
import handAnimation from '../../common/handAnimations/moveHorizontally.json'
import { TextHeader } from '../../common/Header'
import { PageControl } from '../../common/PageControl'
import { AnalyticsContext, AppletInteractionCallback } from '../../contexts/analytics'
import Page3 from './images/Page3.svg'
import Page4 from './images/Page4.svg'
import Page5 from './images/Page5.svg'
import Page6 from './images/Page6.svg'

const StyledGeogebra = styled(Geogebra)`
  position: absolute;
  top: 100px;
  left: 165px;
`

const StyledAnimatedInputSlider = styled(AnimatedInputSlider)`
  position: absolute;
  top: 543px;
  left: 152px;
`
const PlacedText = styled.div`
  position: absolute;
  top: 540px;
  width: 620px;
  left: 50%;
  translate: -50%;
  color: #444444;
  font-family: Nunito;
  font-size: 20px;
  font-weight: 400;
  line-height: 28px;
  letter-spacing: 0px;
  text-align: center;
`

export const Applet02901Ge: React.FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const [ggbLoaded, setGGbLoaded] = useState(false)
  const ggbApi = useRef<GeogebraAppApi | null>(null)
  const [pageControllerDisabled, setPageControllerDisabled] = useState(true)
  const [diameter, setDiameter] = useState(0)
  const [pageIndex, setPageIndex] = useState(0)
  const [movedToSecondScreen, setMovedToSecondScreen] = useState(false)
  const [showHandPointer, setShowHandPointer] = useState(false)
  const onInteraction = useContext(AnalyticsContext)

  const playMouseIn = useSFX('mouseIn')
  const playMouseOut = useSFX('mouseOut')

  const onApiReady = useCallback(
    (api: GeogebraAppApi | null) => {
      ggbApi.current = api
      if (api == null) return
      api.setValue('Drag', 0)
      setGGbLoaded(true)

      api.registerClientListener((e: any) => {
        if (e.type === 'mouseDown' && e.hits[0] === 'pic1') {
          onInteraction('drag')
          playMouseIn()
        } else if (e.type === 'dragEnd' && e.target === 'pic1') {
          onInteraction('drop')
          playMouseOut()
        }
      })
    },
    [onInteraction, playMouseIn, playMouseOut],
  )

  const pageTexts = [
    undefined,
    <p key={2}>
      Note that the length of the unwrapped portion is approx{' '}
      <b> {(3.1415 * diameter - 3 * diameter).toFixed(2)}</b>.
    </p>,
    <p key={3}>
      <img style={{ position: 'absolute', left: '50%', translate: '-50%' }} src={Page3} />
      <span
        style={{
          position: 'absolute',
          left: '375px',
          top: '25px',
          width: '50px',
          color: '#ffff',
        }}
      >
        {(3.1415 * diameter - 3 * diameter).toFixed(2)}
      </span>
      <span
        style={{
          position: 'absolute',
          left: '375px',
          top: '60px',
          width: '50px',
          color: '#ffff',
        }}
      >
        {Math.round(diameter)}
      </span>
    </p>,
    <p key={4}>
      <img style={{ position: 'absolute', left: '50%', translate: '-50%' }} src={Page4} />
    </p>,
    <p key={5}>
      <img
        style={{ position: 'absolute', left: '70%', translate: '-50%', top: '-40px' }}
        src={Page5}
      />
    </p>,
    <p key={6}>
      <img
        style={{ position: 'absolute', left: '55%', translate: '-50%', top: '-45px' }}
        src={Page6}
      />
    </p>,
  ]

  const onSliderChange = (value: number) => {
    value >= 99 ? setPageControllerDisabled(false) : setPageControllerDisabled(true)
    ggbApi.current?.setValue('d', (value / 100) * 3.5)
  }

  useEffect(() => {
    switch (pageIndex) {
      case 1:
        setMovedToSecondScreen(true)
        ggbApi.current?.setValue('o', 1)
        ggbApi.current?.setValue('Drag', 0)
        setShowHandPointer(false)
        break
      case 2:
        ggbApi.current?.setValue('o', 1)
        ggbApi.current?.setValue('Drag', 1)
        setShowHandPointer(true)
        break
      case 3:
        ggbApi.current?.setValue('o', 1)
        ggbApi.current?.setValue('Drag', 0)
        setShowHandPointer(false)
        break
      case 4:
        ggbApi.current?.setValue('o', 1)

        break
      case 5:
        ggbApi.current?.setValue('o', 1)
        break
      default:
        ggbApi.current?.setValue('o', 0)
        break
    }
  }, [pageIndex])

  const onPageChange = useCallback((current: number) => setPageIndex(current), [])

  ggbApi.current?.registerObjectUpdateListener('D', () => {
    setShowHandPointer(false)
    setDiameter(ggbApi.current?.getValue('D') ?? 0)
  })

  return (
    <AppletContainer
      {...{
        id: '029_01_GE',
        aspectRatio: 0.9,
        borderColor: '#FAF2FF',
        onEvent,
        className,
      }}
    >
      <TextHeader
        backgroundColor={'#FAF2FF'}
        buttonColor={'#EACCFF'}
        text={
          'Wrap the diameter (D) around the circumference and determine its relationship with the circumference.'
        }
      />

      <StyledGeogebra
        materialId={'sruzrtbs'}
        width={500}
        height={400}
        onApiReady={onApiReady}
        pointToTrack={'J'}
        showOnBoarding={showHandPointer}
        onboardingAnimationSrc={handAnimation}
      />

      {pageIndex == 0 && ggbLoaded && (
        <StyledAnimatedInputSlider
          onChangePercent={onSliderChange}
          value={movedToSecondScreen ? 1 : 0}
          forceHideHandAnimation={movedToSecondScreen}
        />
      )}
      <PlacedText>{pageTexts[pageIndex]}</PlacedText>
      <PageControl
        total={6}
        onChange={onPageChange}
        onReset={() => {
          setMovedToSecondScreen(false)
        }}
        nextDisabled={pageControllerDisabled}
      />
    </AppletContainer>
  )
}

import { Player } from '@lottiefiles/react-lottie-player'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { useSFX } from '@/hooks/useSFX'

import { AnimatedInputSlider } from '../../common/AnimatedInputSlider'
import { AppletContainer } from '../../common/AppletContainer'
import clickGesture from '../../common/handAnimations/clickGesture.json'
import { TextHeader } from '../../common/Header'
import { PageControl } from '../../common/PageControl'
import { AppletInteractionCallback } from '../../contexts/analytics'
import { useInterval } from '../../hooks/useInterval'
import { approxeq } from '../../utils/math'
import Animation from './Assets/AnimationPythagoras.mp4'

const AnimationPythagorean = styled.video<{ moveContainer: boolean }>`
  position: absolute;
  width: 580px;
  height: 580px;
  left: 67px;
  top: ${(props) => (props.moveContainer ? '85' : '10')}px;
  transition: 0.2s;
  cursor: default;
  &:disabled {
    cursor: default;
  }
`
const SelectionContainerOne = styled.button`
  position: absolute;
  width: 143px;
  height: 143px;
  left: 287px;
  top: 352px;
  cursor: pointer;
  border: #6ca621;
  background-color: transparent;
  transition: 0.3s;
  &:disabled {
    cursor: default;
  }
`
const SelectionContainerTwo = styled.button`
  position: absolute;
  width: 106px;
  height: 106px;
  left: 180px;
  top: 246px;
  cursor: pointer;
  border: #cc6666;
  background-color: transparent;
  transition: 0.3s;
  &:disabled {
    cursor: default;
  }
`
const SelectionContainerThree = styled.button`
  position: absolute;
  width: 179px;
  height: 179px;
  left: 323px;
  top: 135px;
  transform: rotate(-53.25deg);
  cursor: pointer;
  border: #aa5ee0;
  background-color: transparent;
  transition: 0.3s;
  &:disabled {
    cursor: default;
  }
`
const AnimatedInputSliderContainer = styled(AnimatedInputSlider)`
  position: absolute;
  top: 592px;
  left: 50%;
  translate: -50%;
`
const PageOneText = styled.div<{ textFade: boolean }>`
  position: absolute;
  width: 623px;
  height: 28px;
  left: 215px;
  top: 570px;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;
  display: flex;
  align-items: center;
  text-align: center;
  color: #646464;
  opacity: ${(props) => (props.textFade ? 1 : 0)};
  transition: 0.2s;
`
const PageTwoText = styled.div<{ textFade: boolean }>`
  position: absolute;
  width: 535px;
  height: 62px;
  left: 97px;
  top: 518px;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 18px;
  line-height: 28px;
  text-align: center;
  color: #646464;
  opacity: ${(props) => (props.textFade ? 1 : 0)};
  transition: 0.2s;
`

const PageThreeText = styled.div<{ textZoom: boolean; textFade: boolean }>`
  position: absolute;
  width: 411px;
  height: 40px;
  left: 155px;
  top: ${(props) => (props.textZoom ? 510 : 600)}px;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: ${(props) => (props.textZoom ? 31 : 24)}px;
  line-height: 40px;
  text-align: center;
  color: #646464;
  transition: top 1s;
  opacity: ${(props) => (props.textFade ? 1 : 0)};
  transition: 0.5s;
`
const AnimOnBoarding = styled(Player)`
  position: absolute;
  top: 690px;
  left: 320px;
  pointer-events: none;
`
const AnimOnBoarding2 = styled(Player)`
  position: absolute;
  left: 153px;
  top: 260px;
  pointer-events: none;
`
const AnimOnBoarding1 = styled(Player)`
  position: absolute;
  left: 287px;
  top: 394px;
  pointer-events: none;
`
const pageTimeStamps = [-0.1, 0.16, 0.42, 0.92, 1.1]
const pageSTimeStamps = [0, 0, 0.42, 0.93, 0]
const page1TimeStamps = [0.16, 0.29, 0.42]

export const Applet4701Ge: React.FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const playClick = useSFX('mouseClick')
  const [nextDisable, setNextDisable] = useState(false)
  const [progress, setProgress] = useState(0)
  const [progressTarget, setProgressTarget] = useState(0)
  const [pageIndex, setPageIndex] = useState(0)
  const [prevPageIndex, setPrevPageIndex] = useState(0)
  const playerRef = useRef<HTMLVideoElement>(null)
  const [sliderValue, setSliderValue] = useState(0)
  const [page1Stage, setPage1Stage] = useState<0 | 1 | 2 | 3>(0)
  const [showClickOnboarding, setShowClickOnboarding] = useState(true)
  const [showClickOnboarding1, setShowClickOnboarding1] = useState(true)
  const [resetSlider, setResetSlider] = useState(false)
  const [showPageTwoText, setShowPageTwoText] = useState(false)
  const [showPageOneText, setShowPageOneText] = useState(false)

  const onPageChange = useCallback(
    (current: number) =>
      setPageIndex((c) => {
        setPrevPageIndex(c)
        return current
      }),
    [],
  )

  useInterval(
    () => {
      setProgress((p) => {
        if (pageIndex == 2 && sliderValue < 1) if (p > progressTarget) return p - 0.005
        if (p < progressTarget) return p + 0.005
        return p
      })
    },
    approxeq(progress, progressTarget, 0.01) ? null : 60,
  )

  useEffect(() => {
    if (playerRef.current == null) return
    const duration = playerRef.current.duration
    playerRef.current.currentTime = progress * (!isNaN(duration) ? duration : 0)
  }, [progress])

  useEffect(() => {
    if (pageIndex == 1) {
      setNextDisable(page1Stage !== 2)
    }
  }, [page1Stage, pageIndex])

  const onOptionClickCallback = (stage: 0 | 1 | 2) => {
    return () => setPage1Stage(stage)
  }
  useEffect(() => {
    if (pageIndex == 1) playClick()
  }, [playClick, page1Stage])

  const onChangeHandle = useCallback(
    (value: number) => {
      setSliderValue(value / 100)
      if (sliderValue != 1) setNextDisable(true)
      else setNextDisable(false)
    },
    [sliderValue],
  )
  useEffect(() => {
    if (pageIndex == 2 && sliderValue == 0) setProgress(pageSTimeStamps[2])
  }, [pageIndex, prevPageIndex, sliderValue])

  useEffect(() => {
    if (pageIndex == 2) {
      if (playerRef.current == null) return
      const durationMin = pageSTimeStamps[2]
      const durationMax = pageSTimeStamps[3]
      setProgressTarget(durationMin + sliderValue * (durationMax - durationMin))
    }
  }, [pageIndex, sliderValue])

  useEffect(() => {
    setProgressTarget(pageTimeStamps[pageIndex])
  }, [pageIndex])

  useEffect(() => {
    if (pageIndex == 0) setNextDisable(false)
    else if (pageIndex == 1) {
      setProgressTarget(page1TimeStamps[page1Stage])
    }
  }, [pageIndex, page1Stage])

  useEffect(() => {
    if (pageIndex > 0) {
      setShowClickOnboarding(false)
    }
  }, [nextDisable, pageIndex])

  useEffect(() => {
    if (pageIndex == 2 && prevPageIndex < pageIndex) setResetSlider(true)
    else if (pageIndex == 2 && prevPageIndex > pageIndex) setResetSlider(false)
  }, [pageIndex, prevPageIndex])

  useEffect(() => {
    if (sliderValue > 0.8 && sliderValue < 0.99) {
      setShowPageTwoText(true)
    }
  }, [sliderValue])

  useEffect(() => {
    if (
      progress < page1TimeStamps[2] &&
      progress > page1TimeStamps[0] &&
      pageIndex == 1 &&
      prevPageIndex < pageIndex
    ) {
      setShowPageOneText(true)
    } else setShowPageOneText(false)
  }, [pageIndex, prevPageIndex, progress])

  useEffect(() => {
    if (pageIndex == 0 && prevPageIndex > pageIndex) {
      setProgress(pageTimeStamps[0])
    }
    if (pageIndex == 1 && prevPageIndex > pageIndex) {
      setProgress(pageTimeStamps[2])
      setNextDisable(false)
      setShowPageOneText(true)
    }
    if (pageIndex == 2 && sliderValue == 1 && prevPageIndex > pageIndex) {
      setProgress(pageTimeStamps[3])
    }
    if (pageIndex == 3 && prevPageIndex > pageIndex) {
      setProgress(pageTimeStamps[3])
    }
  }, [pageIndex, prevPageIndex, sliderValue])

  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#E7FBFF',
        id: '47_01_GE',
        onEvent,
        className,
      }}
    >
      <TextHeader
        text="Form squares on the sides of the right triangle and derive the relation between its sides."
        backgroundColor="#E7FBFF"
        buttonColor="#A6F0FF"
      />
      <AnimationPythagorean moveContainer={pageIndex == 0} src={Animation} ref={playerRef} />
      {(pageIndex == 1 || pageIndex == 2 || pageIndex == 3) && (
        <>
          <SelectionContainerOne
            onClick={onOptionClickCallback(1)}
            disabled={pageIndex != 1 || page1Stage == 2}
          ></SelectionContainerOne>
          <SelectionContainerTwo
            onClick={onOptionClickCallback(2)}
            disabled={page1Stage != 1}
          ></SelectionContainerTwo>
          <SelectionContainerThree disabled={true}></SelectionContainerThree>
        </>
      )}
      <PageOneText textFade={showPageOneText}>The area of the square is (side)² </PageOneText>
      <PageTwoText textFade={showPageTwoText && (pageIndex == 2 || pageIndex == 3)}>
        The area of the bigger square is equal to the sum of area of the two smaller squares.
      </PageTwoText>
      <PageThreeText textZoom={false} textFade={sliderValue == 1 && pageIndex == 3}>
        <span style={{ color: '#6CA621' }}>i.e., a² </span> +{' '}
        <span style={{ color: '#CC6666' }}>b²</span> = <span style={{ color: '#AA5EE0' }}>c²</span>{' '}
      </PageThreeText>
      <PageThreeText textZoom={progress > 1} textFade={pageIndex == 4}>
        <span style={{ color: '#6CA621' }}>a²</span> + <span style={{ color: '#CC6666' }}>b²</span>{' '}
        = <span style={{ color: '#AA5EE0' }}>c²</span>{' '}
      </PageThreeText>
      {pageIndex == 2 && (
        <AnimatedInputSliderContainer
          min={0}
          max={100}
          onChangePercent={onChangeHandle}
          value={resetSlider ? 0 : 100}
          animDuration={7000}
        />
      )}
      <PageControl
        total={5}
        onChange={onPageChange}
        nextDisabled={nextDisable}
        onReset={() => {
          setShowPageTwoText(false)
          setProgress(0)
          setPage1Stage(0)
        }}
        onBack={() => {
          if (pageIndex == 0 || pageIndex == 1 || pageIndex == 4) setPage1Stage(0)
        }}
      />
      {(pageIndex == 0 || pageIndex == 1) && showClickOnboarding && (
        <AnimOnBoarding src={clickGesture} loop autoplay />
      )}
      {pageIndex == 1 && approxeq(progress, pageTimeStamps[1], 0.01) && showClickOnboarding1 && (
        <AnimOnBoarding1 src={clickGesture} loop autoplay />
      )}
      {page1Stage >= 1 && page1Stage < 2 && pageIndex == 1 && showClickOnboarding1 && (
        <AnimOnBoarding2 src={clickGesture} loop autoplay />
      )}
    </AppletContainer>
  )
}

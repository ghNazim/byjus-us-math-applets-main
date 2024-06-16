import { Player } from '@lottiefiles/react-lottie-player'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { useSFX } from '@/hooks/useSFX'
import { useTimeout } from '@/hooks/useTimeout'

import { AppletContainer } from '../../common/AppletContainer'
import clickGesture from '../../common/handAnimations/clickGesture.json'
import { TextHeader } from '../../common/Header'
import { Math } from '../../common/Math'
import { PageControl } from '../../common/PageControl'
import { Ticker } from '../../common/Ticker'
import { AppletInteractionCallback } from '../../contexts/analytics'
import { useInterval } from '../../hooks/useInterval'
import { approxeq } from '../../utils/math'
import Animation1 from './Assets/Anim_1.mp4'
import Animation2 from './Assets/Anim_2.mp4'
import Animation3 from './Assets/Anim_3.mp4'
import Animation4 from './Assets/Anim_4.mp4'
import op1 from './Assets/op1.svg'
import op2 from './Assets/op2.svg'
import op3 from './Assets/op3.svg'
import op4 from './Assets/op4.svg'
import selectFrame from './Assets/selectFrame.svg'

const SelectFrame = styled.div<{ frameFade: boolean }>`
  box-sizing: border-box;
  position: absolute;
  width: 293px;
  height: 362px;
  left: 214px;
  top: 112px;
  background: #f9f9f9;
  border: 1px dashed #c7c7c7;
  border-radius: 5px;
  transition: 0.2s;
  opacity: ${(props) => (props.frameFade ? 1 : 0)};
`
const OptionOne = styled.button`
  box-sizing: border-box;
  position: absolute;
  width: 140px;
  height: 140px;
  left: 49px;
  top: 510px;
  background: #f9f9f9;
  border: 1px solid #ed6b90;
  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
  border-radius: 5px;
  cursor: pointer;
  &:disabled {
    cursor: default;
    img {
      filter: grayscale(1);
    }
  }
`
const OptionTwo = styled.button`
  box-sizing: border-box;
  position: absolute;
  width: 140px;
  height: 140px;
  left: 211px;
  top: 510px;
  background: #f9f9f9;
  border: 1px solid #ed6b90;
  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
  border-radius: 5px;
  cursor: pointer;
  &:disabled {
    cursor: default;
    img {
      filter: grayscale(1);
    }
  }
`
const OptionThree = styled.button`
  box-sizing: border-box;
  position: absolute;
  width: 140px;
  height: 140px;
  left: 370px;
  top: 510px;
  background: #f9f9f9;
  border: 1px solid #ed6b90;
  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
  border-radius: 5px;
  cursor: pointer;
  &:disabled {
    cursor: default;
    img {
      filter: grayscale(1);
    }
  }
`
const OptionFour = styled.button`
  box-sizing: border-box;
  position: absolute;
  width: 140px;
  height: 140px;
  left: 528px;
  top: 510px;
  background: #f9f9f9;
  border: 1px solid #ed6b90;
  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
  border-radius: 5px;
  cursor: pointer;
  &:disabled {
    cursor: default;
    img {
      filter: grayscale(1);
    }
  }
`
const AnimationContainer = styled.video<{ frameFade: boolean }>`
  position: absolute;
  width: 550px;
  height: 550px;
  left: 80px;
  top: 60px;
  transition: 0.2s;
  opacity: ${(props) => (props.frameFade ? 1 : 0)};
`
const TickerContainer1 = styled.div`
  position: absolute;
  width: 200px;
  height: 200px;
  left: 120px;
  top: 567px;
`
const TickerContainer2 = styled.div`
  position: absolute;
  width: 200px;
  height: 200px;
  left: 414px;
  top: 567px;
`
const TextContainer = styled.div<{ textFade: boolean }>`
  position: absolute;
  width: 614px;
  height: 84px;
  left: 57px;
  top: 530px;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 400;
  font-size: 19px;
  line-height: 28px;
  text-align: center;
  color: #646464;
  transition: 0.2s;
  opacity: ${(props) => (props.textFade ? 1 : 0)};
`
const TickerText1 = styled.div<{ textFade: boolean }>`
  position: absolute;
  width: 196px;
  height: 55px;
  left: 157px;
  top: 553px;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;
  display: flex;
  align-items: center;
  text-align: center;
  color: #646464;
  transition: 0.2s;
  opacity: ${(props) => (props.textFade ? 1 : 0)};
`
const TickerText2 = styled.div<{ textFade: boolean }>`
  position: absolute;
  width: 196px;
  height: 55px;
  left: 450px;
  top: 553px;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;
  display: flex;
  align-items: center;
  text-align: center;
  color: #646464;
  transition: 0.2s;
  opacity: ${(props) => (props.textFade ? 1 : 0)};
`
const LastPageText = styled.div<{ textFade: boolean }>`
  position: absolute;
  width: 50px;
  height: 50px;
  left: 100px;
  top: 570px;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 400;
  font-size: 20px;
  line-height: 28px;
  display: flex;
  align-items: center;
  color: #646464;
  text-align: left;
  transition: 0.2s;
  opacity: ${(props) => (props.textFade ? 1 : 0)};
  .katex {
    .mathdefault,
    .mathnormal,
    .mord {
      font-family: 'Nunito', sans-serif !important;
    }

    .mathbf {
      font-family: 'Nunito', sans-serif !important;
    }
  }
`
const AnimOnBoarding1 = styled(Player)`
  position: absolute;
  top: 690px;
  left: 320px;
  pointer-events: none;
`
const AnimOnBoarding2 = styled(Player)`
  position: absolute;
  top: 530px;
  left: 40px;
  pointer-events: none;
`
const animation = [Animation1, Animation2, Animation3, Animation4]
const pageTimeStamps = [
  [0, 0.015, 0.14, 0.87, 1],
  [0, 0.015, 0.1085, 0.83, 1],
  [0, 0.02, 0.18, 0.81, 1],
  [0, 0.015, 0.16, 0.84, 1],
]

const page2TimeStamps = [
  [0.14, 0.63, 0.87],
  [0.1085, 0.66, 0.83],
  [0.18, 0.43, 0.81],
  [0.16, 0.57, 0.84],
]

const tickerMax1 = [40, 40, 16, 30]
const tickerMax2 = [20, 12, 24, 20]

export const Applet4203Ge: React.FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const playClick = useSFX('mouseClick')
  const [nextDisable, setNextDisable] = useState(true)
  const [backDisable, setBackDisable] = useState(true)
  const [pageIndex, setPageIndex] = useState(0)
  const [prevPageIndex, setPrevPageIndex] = useState(0)
  const [clickOneDisable, setClickOneDisable] = useState(false)
  const [clickTwoDisable, setClickTwoDisable] = useState(false)
  const [clickThreeDisable, setClickThreeDisable] = useState(false)
  const [clickFourDisable, setClickFourDisable] = useState(false)
  const [animIndex, setAnimIndex] = useState(0)
  const playerRef = useRef<HTMLVideoElement>(null)
  const [progress, setProgress] = useState(0)
  const [progressTarget, setProgressTarget] = useState(0)
  const [tickerLength1, setTickerLength1] = useState(0)
  const [tickerLength2, setTickerLength2] = useState(0)
  const [firstSelection, setFirstSelection] = useState(false)
  const [showTicker1, setShowTicker1] = useState(false)
  const [showTicker2, setShowTicker2] = useState(false)
  const [showPage1Text, setShowPage1Text] = useState(false)
  const [showText1, setShowText1] = useState(false)
  const [showText2, setShowText2] = useState(false)
  const [showLastText, setShowLastText] = useState(false)
  const [showClickOnboarding, setShowClickOnboarding] = useState(true)
  const [showClickOnboarding1, setShowClickOnboarding1] = useState(true)

  const onPageChange = useCallback(
    (current: number) =>
      setPageIndex((c) => {
        setPrevPageIndex(c)
        return current
      }),
    [],
  )

  const onChange1 = (value: number) => {
    setTickerLength1(value)
  }
  const onChange2 = (value: number) => {
    setTickerLength2(value)
  }
  useEffect(() => {
    if (pageIndex == 2) {
      if (tickerLength1 != tickerMax1[animIndex] || tickerLength2 != tickerMax2[animIndex]) {
        setNextDisable(true)
      }
    }
  }, [animIndex, pageIndex, tickerLength1, tickerLength2])

  useEffect(() => {
    setProgressTarget(pageTimeStamps[animIndex][pageIndex])
  }, [animIndex, pageIndex])
  useTimeout(
    () => {
      setProgressTarget(pageTimeStamps[animIndex][pageIndex + 1])
    },
    (pageIndex === 1 || pageIndex === 3) && prevPageIndex < pageIndex
      ? pageIndex === 3
        ? 1000
        : 700
      : null,
  )

  useEffect(() => {
    if (pageIndex === 1 && prevPageIndex > pageIndex && firstSelection) {
      setNextDisable(false)
    }
    if (pageIndex === 2 && prevPageIndex > pageIndex) {
      setShowText1(true)
      setShowTicker1(true)
    }
    if (pageIndex == 2 && prevPageIndex > pageIndex && tickerLength1 != tickerMax1[animIndex]) {
      setShowTicker2(false)
      setShowText2(false)
    }
    if (pageIndex == 2 && prevPageIndex < pageIndex && tickerLength1 != tickerMax1[animIndex]) {
      setShowTicker2(false)
      setShowText2(false)
    }
  }, [animIndex, firstSelection, pageIndex, prevPageIndex, progressTarget, tickerLength1])

  useTimeout(
    () => {
      setShowLastText(true)
    },
    pageIndex == 3 && approxeq(progress, pageTimeStamps[animIndex][pageIndex + 1], 0.001)
      ? 500
      : null,
  )

  useEffect(() => {
    if (pageIndex == 2 && approxeq(progress, pageTimeStamps[animIndex][pageIndex + 1], 0.001)) {
      setBackDisable(false)
      setNextDisable(false)
      setShowLastText(false)
      setShowText1(true)
      setShowText2(true)
      setShowTicker1(false)
      setShowTicker2(false)
    } else if (
      pageIndex == 3 &&
      approxeq(progress, pageTimeStamps[animIndex][pageIndex + 1], 0.001)
    ) {
      setBackDisable(false)
      setShowText1(false)
      setShowText2(false)
      setShowTicker1(false)
      setShowTicker2(false)
    } else if (
      pageIndex == 3 &&
      !approxeq(progress, pageTimeStamps[animIndex][pageIndex + 1], 0.001)
    ) {
      setBackDisable(true)
      setShowLastText(false)
    } else setBackDisable(false)
  }, [animIndex, pageIndex, progress, progressTarget])

  useEffect(() => {
    if (pageIndex == 1 && approxeq(progress, pageTimeStamps[animIndex][pageIndex + 1], 0.01))
      setNextDisable(false)
    else if (pageIndex == 1 && !approxeq(progress, pageTimeStamps[animIndex][pageIndex + 1], 0.01))
      setNextDisable(true)
    else setBackDisable(false)
  }, [animIndex, pageIndex, progress, progressTarget])

  useEffect(() => {
    if (pageIndex == 1)
      if (prevPageIndex > pageIndex) setProgressTarget(pageTimeStamps[animIndex][pageIndex + 1])
  }, [animIndex, pageIndex, prevPageIndex, progress, progressTarget, showText1])
  useInterval(
    () => {
      setProgress((p) => {
        {
          if (pageIndex == 3 || (pageIndex == 2 && prevPageIndex < pageIndex) || pageIndex == 0)
            if (p > progressTarget) {
              return p - 0.005
            }
        }
        if (p < progressTarget) {
          return p + 0.005
        }
        return p
      })
    },
    approxeq(progress, progressTarget, 0.001) ? null : 10,
  )

  useEffect(() => {
    if (pageIndex == 2 && prevPageIndex > pageIndex) setProgress(pageTimeStamps[animIndex][3])
  }, [animIndex, pageIndex, prevPageIndex])

  useEffect(() => {
    if (pageIndex == 1 && prevPageIndex > pageIndex) setProgress(pageTimeStamps[animIndex][2])
  }, [animIndex, pageIndex, prevPageIndex])

  useEffect(() => {
    if (pageIndex == 2) {
      if (playerRef.current == null) return
      const progress1 = tickerLength1 != 0 ? tickerLength1 / tickerMax1[animIndex] : 0
      const durationMin = page2TimeStamps[animIndex][0]
      const durationMax = page2TimeStamps[animIndex][1]
      setProgressTarget(durationMin + progress1 * (durationMax - durationMin))
    }
    if (tickerLength1 == tickerMax1[animIndex]) {
      setShowTicker2(true)
      setShowText2(true)
    }
  }, [animIndex, pageIndex, prevPageIndex, tickerLength1])

  useEffect(() => {
    if (pageIndex == 2 && tickerLength1 == tickerMax1[animIndex]) {
      if (playerRef.current == null) return
      const progress2 = tickerLength2 != 0 ? tickerLength2 / tickerMax2[animIndex] : 0
      const durationMin = page2TimeStamps[animIndex][1]
      const durationMax = page2TimeStamps[animIndex][2]
      setProgressTarget(durationMin + progress2 * (durationMax - durationMin))
    }
    if (tickerLength2 == tickerMax2[animIndex]) setNextDisable(false)
  }, [animIndex, pageIndex, tickerLength1, tickerLength2])

  useEffect(() => {
    if (playerRef.current == null) return
    const duration = playerRef.current.duration
    playerRef.current.currentTime = progress * (!isNaN(duration) ? duration : 0)
  }, [animIndex, pageIndex, progress])

  useEffect(() => {
    if ((!nextDisable && pageIndex == 0) || pageIndex == 1) setShowPage1Text(true)
    else setShowPage1Text(false)
  }, [nextDisable, pageIndex])

  useEffect(() => {
    switch (pageIndex) {
      case 0:
        setShowLastText(false)
        setShowTicker1(false)
        setShowText1(false)
        setShowTicker2(false)
        setShowText2(false)
        if (!firstSelection && pageIndex == 0) setNextDisable(true)
        break
      case 1:
        setShowTicker1(false)
        setShowText1(false)
        setShowTicker2(false)
        setShowText2(false)

        break
      case 2:
        setShowTicker1(true)
        setShowText1(true)
        setShowLastText(false)
        break
      case 3:
        setShowTicker1(false)
        setShowTicker2(false)
        setBackDisable(true)
        break
    }
  }, [firstSelection, pageIndex])

  useEffect(() => {
    if (pageIndex > 0) setShowClickOnboarding(false)
  }, [pageIndex])

  const count1 = tickerMax1[animIndex]
  const count2 = tickerMax2[animIndex]
  const sum = count1 + count2

  const lastPageText = String.raw`
  \begin{align*}
  \text{Volume of composite solid}  &= \mathbf{${count1}}\space \textbf{unit cubes} + \mathbf{${count2}}\space \textbf{unit cubes}\\
  &= \mathbf{${sum}}\space \textbf{unit cubes}\\
  \end{align*}
  `
  const onClickOne = () => {
    playClick()
    setAnimIndex(0)
    setNextDisable(false)
    setFirstSelection(true)
    setClickTwoDisable(true)
    setClickThreeDisable(true)
    setClickFourDisable(true)
    setShowClickOnboarding1(false)
  }
  const onClickTwo = () => {
    playClick()
    setAnimIndex(1)
    setNextDisable(false)
    setFirstSelection(true)
    setClickOneDisable(true)
    setClickThreeDisable(true)
    setClickFourDisable(true)
    setShowClickOnboarding1(false)
  }
  const onClickThree = () => {
    playClick()
    setAnimIndex(2)
    setNextDisable(false)
    setFirstSelection(true)
    setClickOneDisable(true)
    setClickTwoDisable(true)
    setClickFourDisable(true)
    setShowClickOnboarding1(false)
  }
  const onClickFour = () => {
    playClick()
    setAnimIndex(3)
    setNextDisable(false)
    setFirstSelection(true)
    setClickOneDisable(true)
    setClickTwoDisable(true)
    setClickThreeDisable(true)
    setShowClickOnboarding1(false)
  }
  const onResetClick = () => {
    setNextDisable(true)
    setProgress(0)
    setAnimIndex(0)
    setFirstSelection(false)
    setClickOneDisable(false)
    setClickTwoDisable(false)
    setClickThreeDisable(false)
    setClickFourDisable(false)
    setShowClickOnboarding1(false)
  }
  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#FFECF2',
        id: '42_03_GD',
        onEvent,
        className,
      }}
    >
      <TextHeader
        text="Select a composite solid of your choice and fill it  completely with unit cubes to find its volume. "
        backgroundColor="#FFECF2"
        buttonColor="#FFCCDB"
      />
      <AnimationContainer
        frameFade={firstSelection}
        src={animation[animIndex]}
        muted
        preload="auto"
        width={'50%'}
        height={'50%'}
        ref={playerRef}
      />

      <TextContainer textFade={firstSelection && showPage1Text}>
        <p>
          The volume of a composite solid is the sum of the volumes of the individual rectangular
          prisms.
        </p>
      </TextContainer>

      <LastPageText textFade={firstSelection && showLastText}>
        <Math displayMode>{lastPageText}</Math>
      </LastPageText>

      <SelectFrame frameFade={!firstSelection}>
        <img src={selectFrame} />
      </SelectFrame>

      <TickerText1 textFade={firstSelection && showText1}>
        <p>
          <span style={{ color: '#ED6B90' }}>{tickerMax1[animIndex]} </span>unit cubes
        </p>
      </TickerText1>
      <TickerText2 textFade={firstSelection && showText2}>
        <p>
          <span style={{ color: '#ED6B90' }}>{tickerMax2[animIndex]} </span>unit cubes
        </p>
      </TickerText2>
      {!firstSelection && (
        <>
          <OptionOne onClick={onClickOne} disabled={clickOneDisable}>
            <img src={op1} />
          </OptionOne>

          <OptionTwo onClick={onClickTwo} disabled={clickTwoDisable}>
            <img src={op2} />
          </OptionTwo>

          <OptionThree onClick={onClickThree} disabled={clickThreeDisable}>
            <img src={op3} />
          </OptionThree>

          <OptionFour onClick={onClickFour} disabled={clickFourDisable}>
            <img src={op4} />
          </OptionFour>
        </>
      )}
      {firstSelection && showTicker1 && (
        <TickerContainer1>
          <Ticker
            disabled={showTicker2}
            value={0}
            min={0}
            max={tickerMax1[animIndex]}
            onChange={onChange1}
            reset={showTicker1}
            showHandDefault={!showTicker2}
          />
        </TickerContainer1>
      )}
      {firstSelection && showTicker2 && (
        <TickerContainer2>
          <Ticker
            value={0}
            min={0}
            max={tickerMax2[animIndex]}
            onChange={onChange2}
            reset={showTicker2}
          />
        </TickerContainer2>
      )}
      <PageControl
        total={4}
        onChange={onPageChange}
        nextDisabled={nextDisable}
        backDisabled={backDisable}
        onReset={onResetClick}
      />
      {!firstSelection && showClickOnboarding1 && (
        <AnimOnBoarding2 src={clickGesture} loop autoplay />
      )}
      {firstSelection && showClickOnboarding && (
        <AnimOnBoarding1 src={clickGesture} loop autoplay />
      )}
    </AppletContainer>
  )
}

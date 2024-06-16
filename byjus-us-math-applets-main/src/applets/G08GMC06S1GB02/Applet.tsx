import { Player } from '@lottiefiles/react-lottie-player'
import { FC, useCallback, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { AnimatedInputSlider } from '@/common/AnimatedInputSlider'
import { AppletContainer } from '@/common/AppletContainer'
import { TextHeader } from '@/common/Header'
import { AnalyticsContext, AppletInteractionCallback } from '@/contexts/analytics'
import { useInterval } from '@/hooks/useInterval'
import { useSFX } from '@/hooks/useSFX'

import handClick from '../../common/handAnimations/click.json'
import animation from './assets/animation.json'
import anim1 from './assets/animtext1.svg'
import anim2 from './assets/animtext2.svg'
import ResetImg from './assets/ResetBut.svg'
import text0 from './assets/text0.svg'
import text1 from './assets/text1.svg'
import text2a from './assets/text2a.svg'
import text2b from './assets/text2b.svg'
import text3a from './assets/text3a.svg'
import text3b from './assets/text3b.svg'
import text4a from './assets/text4a.svg'
import text5a from './assets/text5a.svg'
import text6a from './assets/text6a.svg'
import text6b from './assets/text6b.svg'
import textF from './assets/textF.svg'
import textFinal from './assets/textFinal.svg'

const PlacedSlider = styled(AnimatedInputSlider)`
  position: absolute;
  rotate: -90deg;
  left: -100px;
  bottom: 360px;
  width: 340px;
  height: 50px;
  button {
    rotate: 90deg;
  }
`
const MainFrame = styled(Player)`
  width: 680px;
  height: 520px;
  position: absolute;
  left: 50%;
  translate: -50%;
  top: 100px;
  pointer-events: none;
  border: none;
`
const NextBtn = styled.button<{ nextDisabled: boolean }>`
  position: absolute;
  left: 50%;
  translate: -50%;
  bottom: 20px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 16px 24px;
  gap: 8px;
  width: 102px;
  height: 60px;
  background: ${({ nextDisabled }) => (nextDisabled ? '#D1D1D1' : '#1a1a1a')};
  border: none;
  border-radius: 10px;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 24px;
  line-height: 32px;
  text-align: center;
  color: #ffffff;
  :hover {
    scale: 1.05;
    cursor: pointer;
  }
`
const HandAnimationPlayer = styled(Player)`
  position: absolute;
  left: 50%;
  translate: -50%;
  top: 700px;
  pointer-events: none;
  z-index: 1;
`
const PageTexts = styled.img<{ page: number }>`
  position: absolute;
  left: ${(props) => {
    switch (props.page) {
      case 0:
        return '100px'
      case 1:
        return '150px'
      case 2:
        return '210px'
      case 3:
        return '210px'
      case 4:
        return '10px'
      case 5:
        return '210px'
      case 6:
        return '150px'
      case 7:
        return '100px'
      default:
        return '100px'
    }
  }};
  bottom: ${(props) => {
    switch (props.page) {
      case 0:
        return '120px'
      case 1:
        return '120px'
      case 2:
        return '120px'
      case 3:
        return '120px'
      case 4:
        return '100px'
      case 5:
        return '120px'
      case 6:
        return '120px'
      case 7:
        return '100px'
      default:
        return '120px'
    }
  }};
  z-index: 1;
`

const PageTextAbove = styled.img<{ page: number }>`
  position: absolute;
  left: ${(props) => {
    switch (props.page) {
      case 2:
        return '120px'
      case 3:
        return '200px'
      case 4:
        return '200px'
      case 5:
        return '200px'
      case 6:
        return '180px'
      default:
        return '180px'
    }
  }};
  bottom: ${(props) => {
    switch (props.page) {
      case 2:
        return '620px'
      case 3:
        return '650px'
      default:
        return '650px'
    }
  }};
  z-index: 1;
`
const PageTextAboveFinal = styled.img<{ page: number }>`
  position: absolute;
  left: ${(props) => {
    switch (props.page) {
      case 7:
        return '280px'
      default:
        return '180px'
    }
  }};
  bottom: ${(props) => {
    switch (props.page) {
      case 7:
        return '600px'

      default:
        return '650px'
    }
  }};
  z-index: 1;
`

const ResetButton = styled.img`
  position: absolute;
  left: 50%;
  translate: -50%;
  bottom: 20px;
  transition: all.3s;
  :hover {
    scale: 1.05;
    cursor: pointer;
  }
  z-index: 2;
`

const AnimationText1 = styled.img`
  position: absolute;
  left: 230px;
  bottom: 290px;
  z-index: 2;
`
const AnimationText2 = styled.img`
  position: absolute;
  left: 440px;
  bottom: 310px;
  z-index: 2;
`

const pageFrames = [0, 60, 75, 156, 202, 202, 275, 315]

export const AppletG08GMC06S1GB02: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const [showPage0Text, setShowPage0Text] = useState(true)
  const [showPage1Text, setShowPage1Text] = useState(false)
  const [showPage2aText, setShowPage2aText] = useState(false)
  const [showPage2bText, setShowPage2bText] = useState(false)
  const [showPage3aText, setShowPage3aText] = useState(false)
  const [showPage4aText, setShowPage4aText] = useState(false)
  const [showPage5aText, setShowPage5aText] = useState(false)
  const [showPage6aText, setShowPage6aText] = useState(false)
  const [showPage6bText, setShowPage6bText] = useState(false)
  const [showPageF, setShowPageF] = useState(false)
  const [showPage3bText, setShowPage3bText] = useState(false)
  const [showpage7Text, setShowPage7Text] = useState(false)
  const [showAnimText1, setShowAnimText1] = useState(false)
  const [showAnimText2, setShowAnimText2] = useState(false)
  const [showResetButton, setShowResetButton] = useState(false)
  const [page, setPage] = useState(0)
  const [animationFrame, setAnimationFrame] = useState(0)
  const playerRef = useRef<Player>(null)
  const playClick = useSFX('mouseClick')
  const [showOnboarding, setShowOnboarding] = useState(true)
  const onInteraction = useContext(AnalyticsContext)

  const [nextDisable, setNextDisable] = useState(false)

  useInterval(
    () => {
      setAnimationFrame((f) => f + 1)
    },
    animationFrame !== pageFrames[page] && page !== 5 ? 60 : null,
  )

  useLayoutEffect(() => {
    playerRef.current?.setSeeker(animationFrame)
  }, [animationFrame])

  useEffect(() => {
    if (animationFrame === pageFrames[page]) {
      if (page === 1) {
        setShowPage2aText(false)
        setShowPage2bText(false)
        setShowAnimText1(true)
        setShowAnimText2(true)
        setNextDisable(false)
      } else if (page === 2) {
        setShowPage2aText(true)
        setShowPage2bText(true)
        setShowAnimText1(false)
        setShowAnimText2(false)
        setNextDisable(false)
      } else if (page === 3) {
        setShowPage3aText(true)
        setShowPage3bText(true)
        setNextDisable(false)
      } else if (page === 4) {
        setShowPage3bText(true)
        setShowPage4aText(true)
        setNextDisable(false)
      } else if (page === 5) {
        setShowPage3bText(true)
        setShowPage5aText(true)
      } else if (page === 6) {
        setShowPage6aText(true)
        setShowPage6bText(true)
        setNextDisable(false)
      } else if (page === 7) {
        setShowPage7Text(true)
        setShowPageF(true)
        setShowPage6bText(false)
        setShowPage3bText(false)
        setNextDisable(false)
        setShowResetButton(true)
      }
    }
  }, [animationFrame, page])

  const onNextClick = useCallback(() => {
    setNextDisable(true)

    onInteraction('tap')
    setShowOnboarding(false)
    setShowPage0Text(false)
    setShowPage1Text(false)
    setShowPage2aText(false)
    setShowPage2bText(false)
    setShowPage3aText(false)

    setShowPage5aText(false)
    setShowPage6aText(false)

    if (page === 4) {
      setShowPage4aText(false)
    }
    if (page === 0) {
      setShowPage1Text(true)
    }

    setPage(page + 1)
    playClick()
  }, [onInteraction, playClick, page])

  const onChangeHandle = useCallback(
    (value: number) => {
      if (page === 5) {
        const newAnimationFrame = Math.floor((value / 100) * (246 - 202)) + 202
        setAnimationFrame(newAnimationFrame)
        if (newAnimationFrame === 246) {
          setNextDisable(false)
          setShowPage5aText(false)
        } else {
          setNextDisable(true)
        }
      }
    },
    [page],
  )
  const onCLickResetButton = useCallback(() => {
    setPage(0)
    onInteraction('tap')
    playClick()
    setShowPage0Text(true)
    setShowPage7Text(false)
    setAnimationFrame(0)
    setShowOnboarding(true)
    setShowResetButton(false)
    setShowPageF(false)
    setShowPage3bText(false)
  }, [onInteraction, playClick])
  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#F6F6F6',
        id: 'g08-gmc06-s1-gb02',
        onEvent,
        className,
        themeName: 'dark',
      }}
    >
      <TextHeader
        text="Proof of the Pythagorean theorem using areas of squares."
        backgroundColor="#F6F6F6"
        buttonColor="#1A1A1A"
      />
      <MainFrame src={animation} ref={playerRef} />
      {page != 7 && (
        <NextBtn onClick={onNextClick} nextDisabled={nextDisable} disabled={nextDisable}>
          Next
        </NextBtn>
      )}
      {showOnboarding && <HandAnimationPlayer src={handClick} autoplay loop />}
      {showPage0Text && <PageTexts src={text0} page={page} />}
      {showPage1Text && <PageTexts src={text1} page={page} />}
      {showPage2aText && <PageTexts src={text2a} page={page} />}
      {showPage3aText && <PageTexts src={text3a} page={page} />}
      {showPage4aText && <PageTexts src={text4a} page={page} />}
      {showPage5aText && <PageTexts src={text5a} page={page} />}
      {showPage6aText && <PageTexts src={text6a} page={page} />}
      {showpage7Text && <PageTexts src={textFinal} page={page} />}
      {showPage2bText && <PageTextAbove src={text2b} page={page} />}
      {showPage3bText && <PageTextAbove src={text3b} page={page} />}
      {showPage6bText && <PageTextAbove src={text6b} page={page} />}
      {showPageF && <PageTextAboveFinal src={textF} page={page} />}
      {page == 5 && <PlacedSlider onChangePercent={onChangeHandle} />}
      {showAnimText1 && <AnimationText1 src={anim1} />}
      {showAnimText2 && <AnimationText2 src={anim2} />}

      {showResetButton && <ResetButton src={ResetImg} onClick={onCLickResetButton}></ResetButton>}
    </AppletContainer>
  )
}

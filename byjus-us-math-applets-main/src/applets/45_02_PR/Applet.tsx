import { Player } from '@lottiefiles/react-lottie-player'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { useSFX } from '@/hooks/useSFX'

import { AnimatedInputSlider } from '../../common/AnimatedInputSlider'
import { AppletContainer } from '../../common/AppletContainer'
import { Geogebra } from '../../common/Geogebra'
import { GeogebraAppApi } from '../../common/Geogebra/Geogebra.types'
import tickAnimation from '../../common/handAnimations/tickAnimation.json'
import { TextHeader } from '../../common/Header'
import { IncorrectFeedback } from '../../common/IncorrectFeedback'
import { AppletInteractionCallback } from '../../contexts/analytics'
import correct from './Assets/correct.mp3'
import Disclaimer from './Assets/Disclaimer.svg'
import op1 from './Assets/op1.svg'
import op3 from './Assets/op3.svg'
import op5 from './Assets/op5.svg'
import op8 from './Assets/op8.svg'
import op10 from './Assets/op10.svg'
import op11 from './Assets/op11.svg'
import option1 from './Assets/option-1.svg'
import option2 from './Assets/option-2.svg'
import option3 from './Assets/option-3.svg'
import option4 from './Assets/option-4.svg'
import option5 from './Assets/option-5.svg'
import option6 from './Assets/option-6.svg'
import option7 from './Assets/option-7.svg'
import option8 from './Assets/option-8.svg'
import tryNewButton from './Assets/tryNewButton.svg'

const TickAnimation = styled(Player)`
  position: absolute;
  top: 130px;
  left: 100px;
`

const CheckButton = styled.button`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 9px 36px;

  position: absolute;
  width: 160px;
  height: 60px;
  left: 280px;
  top: 707.69px;
  background-color: #8c69ff;
  border-radius: 10px;
  border: none;
  cursor: pointer;

  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 24px;
  line-height: 42px;
  text-align: center;
  color: #ffffff;

  &:disabled {
    cursor: none;
    background-color: #e8e1ff;
  }

  &:hover:not([disabled]) {
    background-color: #7f5cf4;
  }

  &:active:not([disabled]) {
    background-color: #6549c2;
    color: #b4a6e1;
  }
`

const Container = styled.div`
  box-sizing: border-box;
  position: absolute;
  width: 641px;
  height: 380px;
  left: 40px;
  top: 100px;
  border: 2px solid #f4e5ff;
  border-radius: 20px;
`
const AnimatedInputSliderContainer = styled(AnimatedInputSlider)`
  position: absolute;
  width: 315px;
  height: 51.61px;
  left: 160px;
  top: 300px;
`

const answerStateColorsOne = {
  default: '#8C69FF',
  right: '#85CC29',
  wrong: '#F57A7A',
  click: '#8C69FF',
}
const answerFillColorsOne = {
  default: ' rgba(255, 255, 255, 1)',
  right: 'rgba(133, 204, 41, 0.3)',
  wrong: 'rgba(245, 122, 122, 0.3)',
  click: 'rgba(255, 242, 242, 1)',
}
const OptionOneButton = styled.button<{ state: keyof typeof answerStateColorsOne }>`
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 13px 36px;
  gap: 8px;
  position: absolute;
  width: 197px;
  height: 157px;
  left: 50px;
  top: 510px;
  border: 3px solid ${(props) => answerStateColorsOne[props.state]};
  background-color: ${(props) => answerFillColorsOne[props.state]};
  border-radius: 10px;
  transition: 0.2s;
  cursor: pointer;
  &:disabled {
    cursor: default;
  }
  &:img {
    height: 100px;
    width: 100px;
  }
`
const answerStateColorsTwo = {
  default: '#8C69FF',
  right: '#85CC29',
  wrong: '#F57A7A',
  click: '#8C69FF',
}
const answerFillColorsTwo = {
  default: 'rgba(255, 255, 255, 1)',
  right: 'rgba(133, 204, 41, 0.3)',
  wrong: 'rgba(245, 122, 122, 0.3)',
  click: 'rgba(255, 242, 242, 1)',
}

const OptionTwoButton = styled.button<{ state: keyof typeof answerStateColorsTwo }>`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 13px 36px;
  gap: 8px;
  position: absolute;
  width: 195px;
  height: 157px;
  left: 266px;
  top: 510px;
  border: 3px solid ${(props) => answerStateColorsTwo[props.state]};
  background-color: ${(props) => answerFillColorsTwo[props.state]};
  border-radius: 10px;
  transition: 0.2s;
  cursor: pointer;
  &:disabled {
    cursor: default;
  }
`
const answerStateColorsThree = {
  default: '#8C69FF',
  right: '#85CC29',
  wrong: '#F57A7A',
  click: '#8C69FF',
}
const answerFillColorsThree = {
  default: ' rgba(255, 255, 255, 1)',
  right: 'rgba(133, 204, 41, 0.3)',
  wrong: 'rgba(245, 122, 122, 0.3)',
  click: 'rgba(255, 242, 242, 1)',
}

const OptionThreeButton = styled.button<{
  state: keyof typeof answerStateColorsThree
}>`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 13px 36px;
  gap: 8px;
  position: absolute;
  width: 197px;
  height: 157px;
  left: 478px;
  top: 510px;
  border: 3px solid ${(props) => answerStateColorsThree[props.state]};
  background-color: ${(props) => answerFillColorsThree[props.state]};
  border-radius: 10px;
  transition: 0.2s;
  cursor: pointer;
  &:disabled {
    cursor: default;
  }
  &:img {
    height: 100px;
    width: 100px;
  }
`

const TryNewButton = styled.button`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: flex-end;
  padding: 9px 18px;

  position: absolute;
  width: 160px;
  height: 60px;
  left: 280px;
  top: 708px;
  border: none;
  cursor: pointer;
  transition: 0.2s;

  background: #8c69ff;
  border-radius: 10px;

  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 22px;
  line-height: 42px;
  text-align: center;
  color: #ffffff;
  flex: none;
  order: 1;
  flex-grow: 0;

  &:disabled {
    cursor: none;
    background-color: #e8e1ff;
  }

  &:hover:not([disabled]) {
    background-color: #7f5cf4;
  }

  &:active:not([disabled]) {
    background-color: #6549c2;
    color: #b4a6e1;
  }
`

const PopText = styled.div`
  width: 85%;
  margin: 80px 0;
  p {
    margin: 0;
    font-family: 'Nunito';
    font-style: normal;
    font-weight: 400;
    font-size: 20px;
    line-height: 28px;
    text-align: left;
    color: #444444;
  }
`

const StyledGeogebra = styled(Geogebra)`
  position: absolute;
  top: 50px;
  left: 357px;
  translate: -50%;
  transition: 0.5s;
`

const options = ['op1', 'op3', 'op5', 'op8', 'op10', 'op11']
const rightOptions = [op1, op3, op5, op8, op10, op11]
const wrongOptions1 = [option1, option2, option3, option4, option5, option6]
const wrongOptions2 = [option5, option6, option7, option8, option1, option2]
export const Applet4502Pr: React.FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const [ggbLoaded, setGGBLoaded] = useState(false)
  const ggbApi = useRef<GeogebraAppApi | null>(null)
  const [checkButtonDisable, setCheckButtonDisable] = useState(true)
  const [clickCheck1, setClickCheck1] = useState(false)
  const [clickCheck2, setClickCheck2] = useState(false)
  const [clickCheck3, setClickCheck3] = useState(false)
  const [showTickAnimation, setShowTickAnimation] = useState(false)
  const [showTryNewButton, setShowTryNewButton] = useState(false)
  const [tryNewClick, setTryNewClick] = useState(false)
  const [showPop, setShowPop] = useState({ component: false, animation: false })
  const [answerStateOne, setAnswerStateOne] = useState<keyof typeof answerStateColorsOne>('default')
  const [answerStateTwo, setAnswerStateTwo] = useState<keyof typeof answerStateColorsTwo>('default')
  const [answerStateThree, setAnswerStateThree] =
    useState<keyof typeof answerStateColorsThree>('default')
  const [activeId, setActiveId] = useState(0)
  const [sliderReset, setSliderReset] = useState(false)
  const [optionOrder, setOptionOrder] = useState<Array<string>>([])
  const playCorrect = useSFX('correct')
  const playMouseClick = useSFX('mouseClick')
  const [disableOptions, setDisableOptions] = useState(false)

  const onChangeHandle = (value: number) => {
    setSliderReset(false)
    ggbApi.current?.setValue('t', value / 80)
  }

  const onCheckClick = () => {
    setDisableOptions(true)
    playMouseClick()
    setClickCheck1(false)
    setClickCheck2(false)
    setClickCheck3(false)
    if (activeId == 0 || activeId == 4) {
      if (clickCheck3) {
        playCorrect()
        setAnswerStateThree('right')
        setShowTickAnimation(true)
        setCheckButtonDisable(true)
      } else if (clickCheck1) {
        setAnswerStateOne('wrong')
        setShowPop({ component: true, animation: true })
      } else if (clickCheck2) {
        setAnswerStateTwo('wrong')
        setShowPop({ component: true, animation: true })
      }
    } else if (activeId == 1 || activeId == 3) {
      if (clickCheck3) {
        setAnswerStateThree('wrong')
        setShowPop({ component: true, animation: true })
      } else if (clickCheck1) {
        playCorrect()
        setAnswerStateOne('right')
        setShowTickAnimation(true)
        setCheckButtonDisable(true)
      } else if (clickCheck2) {
        setAnswerStateTwo('wrong')
        setShowPop({ component: true, animation: true })
      }
    } else if (activeId == 2 || activeId == 5) {
      if (clickCheck3) {
        setAnswerStateThree('wrong')
        setShowPop({ component: true, animation: true })
      } else if (clickCheck1) {
        setAnswerStateOne('wrong')
        setShowPop({ component: true, animation: true })
      } else if (clickCheck2) {
        playCorrect()
        setAnswerStateTwo('right')
        setShowTickAnimation(true)
        setCheckButtonDisable(true)
      }
    }
  }

  useEffect(() => {
    if (tryNewButton && !clickCheck1 && !clickCheck2 && !clickCheck3) {
      setCheckButtonDisable(true)
    }
  }, [clickCheck1, clickCheck2, clickCheck3])

  const playerHandle = (event: any) => {
    if (event == 'complete') {
      setShowTickAnimation(false)
      setShowTryNewButton(true)
      setCheckButtonDisable(true)
    }
  }

  useEffect(() => {
    if (tryNewClick) {
      setSliderReset(true)
      ggbApi.current?.setValue('t', 0)
      ggbApi.current?.setValue(options[activeId], 1)
      setTryNewClick(false)
    }
  }, [tryNewClick, activeId])

  useEffect(() => {
    const options: string[] = []
    switch (activeId) {
      case 0:
        options[0] = wrongOptions2[activeId]
        options[1] = wrongOptions1[activeId]
        options[2] = rightOptions[activeId]
        break
      case 1:
        options[0] = rightOptions[activeId]
        options[1] = wrongOptions1[activeId]
        options[2] = wrongOptions2[activeId]
        break
      case 2:
        options[0] = wrongOptions1[activeId]
        options[1] = rightOptions[activeId]
        options[2] = wrongOptions2[activeId]
        break
      case 3:
        options[0] = rightOptions[activeId]
        options[1] = wrongOptions2[activeId]
        options[2] = wrongOptions1[activeId]
        break
      case 4:
        options[0] = wrongOptions2[activeId]
        options[1] = wrongOptions1[activeId]
        options[2] = rightOptions[activeId]
        break
      case 5:
        options[0] = wrongOptions2[activeId]
        options[1] = rightOptions[activeId]
        options[2] = wrongOptions1[activeId]
        break
    }

    setOptionOrder(options)
  }, [activeId])

  const onTryNewClick = () => {
    setDisableOptions(false)
    playMouseClick()
    setCheckButtonDisable(true)
    setActiveId((v) => (v < 5 ? v + 1 : 0))
    setSliderReset(true)
    setTryNewClick(true)
    setAnswerStateOne('default')
    setAnswerStateTwo('default')
    setAnswerStateThree('default')
    setShowTryNewButton(false)
  }

  const onOptionOneClick = () => {
    playMouseClick()
    setClickCheck1(true)
    setClickCheck2(false)
    setClickCheck3(false)
    setAnswerStateOne('click')
    setAnswerStateTwo('default')
    setAnswerStateThree('default')
    setCheckButtonDisable(false)
  }

  const onOptionTwoClick = () => {
    playMouseClick()
    setClickCheck1(false)
    setClickCheck2(true)
    setClickCheck3(false)
    setAnswerStateOne('default')
    setAnswerStateTwo('click')
    setAnswerStateThree('default')
    setCheckButtonDisable(false)
  }

  const onOptionThreeClick = () => {
    playMouseClick()
    setClickCheck1(false)
    setClickCheck2(false)
    setClickCheck3(true)
    setAnswerStateOne('default')
    setAnswerStateTwo('default')
    setAnswerStateThree('click')
    setCheckButtonDisable(false)
  }
  const popCloseHandle = () => {
    setDisableOptions(false)
    setAnswerStateOne('default')
    setAnswerStateTwo('default')
    setAnswerStateThree('default')
    setShowPop((p) => ({ ...p, animation: false }))
  }

  const onApiReady = useCallback((api: GeogebraAppApi | null) => {
    ggbApi.current = api
    if (api == null) return
    setGGBLoaded(true)
  }, [])

  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#FAF2FF',
        id: '45_02_PR',
        onEvent,
        className,
      }}
    >
      <TextHeader
        text="Select the net which could make an identical cubical box."
        backgroundColor="#FAF2FF"
        buttonColor="#EACCFF"
        hideButton={true}
      />
      <StyledGeogebra materialId={'rndctx7h'} width={500} height={500} onApiReady={onApiReady} />
      {ggbLoaded && (
        <Container>
          <AnimatedInputSliderContainer
            min={0}
            max={81}
            onChangePercent={onChangeHandle}
            reset={sliderReset}
          />
        </Container>
      )}
      {ggbLoaded && (
        <OptionOneButton
          onClick={onOptionOneClick}
          state={answerStateOne}
          disabled={disableOptions}
        >
          <img src={optionOrder[0]} height={'190px'} width={'190px'} />
        </OptionOneButton>
      )}
      {ggbLoaded && (
        <OptionTwoButton
          onClick={onOptionTwoClick}
          state={answerStateTwo}
          disabled={disableOptions}
        >
          <img src={optionOrder[1]} height={'190px'} width={'190px'} />
        </OptionTwoButton>
      )}
      {ggbLoaded && (
        <OptionThreeButton
          onClick={onOptionThreeClick}
          state={answerStateThree}
          disabled={disableOptions}
        >
          <img src={optionOrder[2]} height={'190px'} width={'190px'} />
        </OptionThreeButton>
      )}
      <CheckButton onClick={onCheckClick} disabled={checkButtonDisable}>
        Check
      </CheckButton>
      {showTickAnimation && (
        <TickAnimation src={tickAnimation} autoplay onEvent={playerHandle}></TickAnimation>
      )}
      {showTryNewButton && (
        <TryNewButton onClick={onTryNewClick}>
          <img src={tryNewButton} />{' '}
        </TryNewButton>
      )}
      {showPop.component && (
        <IncorrectFeedback
          showPopAnimation={showPop.animation}
          disclaimer={Disclaimer}
          onClose={popCloseHandle}
        >
          <PopText>
            <p>
              Net of a cube should always have 6 faces that do not overlap with other faces on
              folding.
            </p>
          </PopText>
        </IncorrectFeedback>
      )}
    </AppletContainer>
  )
}

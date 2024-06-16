import { Player } from '@lottiefiles/react-lottie-player'
import { FC, useCallback, useRef, useState } from 'react'
import styled from 'styled-components'

import { AppletContainer } from '@/common/AppletContainer'
import { Geogebra } from '@/common/Geogebra'
import { GeogebraAppApi } from '@/common/Geogebra/Geogebra.types'
import { TextHeader } from '@/common/Header'
import { AppletInteractionCallback } from '@/contexts/analytics'

import handClick from '../../common/handAnimations/click.json'
import resetBtn from './assets/reset.svg'
import tryagainBtn from './assets/tryAgain.svg'
import xText from './assets/xText.svg'
import yText from './assets/yText.svg'
const WhitePatch = styled.div`
  position: absolute;
  left: 36px;
  top: 495px;
  background: #ffffff;
  width: 50px;
  height: 50px;
`
const CheckButton = styled.button`
  position: absolute;
  left: 50%;
  translate: -50%;
  bottom: 20px;
  background: #1a1a1a;
  border-radius: 10px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 16px 24px;
  gap: 8px;
  width: 116px;
  height: 60px;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 24px;
  line-height: 32px;
  text-align: center;
  color: #ffffff;
  cursor: pointer;
`
const NextButton = styled.button`
  position: absolute;
  left: 50%;
  translate: -50%;
  bottom: 20px;
  background: #1a1a1a;
  border-radius: 10px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 16px 24px;
  gap: 8px;
  width: 102px;
  height: 60px;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 24px;
  line-height: 32px;
  text-align: center;
  color: #ffffff;
  cursor: pointer;
`
const TryAgainButton = styled.button`
  position: absolute;
  left: 50%;
  translate: -50%;
  bottom: 20px;
  background: #1a1a1a;
  border-radius: 10px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 16px 24px;
  gap: 8px;
  width: 188px;
  height: 60px;
  cursor: pointer;
`
const ResetBtn = styled.button`
  position: absolute;
  left: 50%;
  translate: -50%;
  bottom: 20px;
  background: #ffffff;
  border: 2px solid #1a1a1a;
  border-radius: 10px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 16px 24px;
  gap: 8px;
  width: 148px;
  height: 60px;
  cursor: pointer;
`
const HelperText = styled.div`
  position: absolute;
  left: 50%;
  translate: -50%;
  top: 535px;
  width: 684px;
  height: 28px;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #444444;
`
const ColouredSpan = styled.span<{ color: string }>`
  color: ${(props) => props.color};
  padding: 0 5px;
`
const Equation = styled.div`
  position: absolute;
  left: 50%;
  translate: -50%;
  top: 600px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  width: 240px;
  height: 60px;
`
const TextBox = styled.input`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 4px;
  gap: 20px;
  width: 76px;
  justify-content: center;
  height: 60px;
  background: #f6f6f6;
  border: 1px solid #1a1a1a;
  border-radius: 12px;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;
  color: #1a1a1a;
  text-align: center;
`
const GGB = styled(Geogebra)`
  position: absolute;
  left: 50%;
  translate: -50%;
  top: 100px;
`
const ClickPlayer = styled(Player)`
  position: absolute;
  left: 250px;
  top: 575px;
  pointer-events: none;
`

const correctTexts = [
  'Great! Keep going and land more planes safely.',
  'Awesome! You have successfully landed the plane on the runway.',
  'Great job landing all the planes safely on the island.',
]
const wrongTexts = [
  'Don’t worry, landing can be challenging.',
  'Landing can be tricky, but you’ve got this!',
  'Landing in this round can be challenging, but you’re up for it!',
]
export const AppletG08EEC09S1GB05: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const [showButton, setShowButton] = useState(0)
  const [question, setQuestion] = useState(1)
  const [showEquation, setShowEquation] = useState(true)
  const [showHandPointer, setShowHandPointer] = useState(true)
  const [ggbLoaded, setGgbLoaded] = useState(false)
  const [value1, setValue1] = useState('')
  const [value2, setValue2] = useState('')
  const ggbAPi = useRef<GeogebraAppApi | null>(null)
  const onText1Change = (e: any) => {
    if ((e.target.value < 20 && e.target.value > -20) || e.target.value == '-') {
      setValue1(e.target.value)
      setShowButton(1)
      if (ggbAPi.current) ggbAPi.current.setValue('m', e.target.value)
    }
  }
  const onText2Change = (e: any) => {
    if ((e.target.value < 20 && e.target.value > -20) || e.target.value == '-') {
      setValue2(e.target.value)
      setShowButton(1)
      if (ggbAPi.current) ggbAPi.current.setValue('b', e.target.value)
    }
  }
  const OnClickCheck = () => {
    if (!ggbAPi.current) return
    ggbAPi.current.evalCommand('RunClickScript(CheckButton)')
    setShowButton(0)
    setShowEquation(false)
    setTimeout(() => {
      if (!ggbAPi.current) return
      if (
        ggbAPi.current.getValue('mFix') == ggbAPi.current.getValue('m') &&
        ggbAPi.current.getValue('bFix') == ggbAPi.current.getValue('b')
      ) {
        question == 3 ? setShowButton(4) : setShowButton(2)
      } else setShowButton(3)
    }, 4500)
  }
  const OnClickNext = () => {
    if (!ggbAPi.current) return
    ggbAPi.current.evalCommand('RunClickScript(NextButton)')
    setShowButton(0)
    setShowEquation(true)
    setValue1('')
    setValue2('')
  }
  const OnClickTryAgain = () => {
    if (!ggbAPi.current) return
    ggbAPi.current.evalCommand('RunClickScript(TryAgainButton)')
    setShowButton(1)
    setShowEquation(true)
    setValue1('')
    setValue2('')
  }
  const OnClickReset = () => {
    if (!ggbAPi.current) return
    ggbAPi.current.evalCommand('RunClickScript(ResetButton)')
    setShowButton(0)
    setShowEquation(true)
    setValue1('')
    setValue2('')
  }
  const onGGBReady = useCallback((api: GeogebraAppApi | null) => {
    ggbAPi.current = api
    if (api == null) return
    setGgbLoaded(true)
    api.registerObjectUpdateListener('NextQuestion', () => {
      if (ggbAPi.current) {
        setQuestion(ggbAPi.current.getValue('NextQuestion'))
        setShowEquation(true)
      }
    })
  }, [])
  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#F6F6F6',
        id: 'g08-eec09-s1-gb05',
        onEvent,
        className,
      }}
    >
      <TextHeader
        text="Guide your plane to the island."
        backgroundColor="#F6F6F6"
        buttonColor="#1A1A1A"
      />
      <GGB materialId="cejedmwq" onApiReady={onGGBReady} />
      <WhitePatch />
      {ggbLoaded && showEquation && (
        <>
          <HelperText>
            {'Enter the values of '}
            <ColouredSpan color={'#D97A1A'}> slope </ColouredSpan>
            {' and '}
            <ColouredSpan color={'#AA5EE0'}> y-intercept </ColouredSpan>
            {'.'}
          </HelperText>
          <Equation>
            <img src={yText} />
            <TextBox
              placeholder="0"
              onChange={onText1Change}
              value={value1}
              onClick={() => {
                setShowHandPointer(false)
              }}
            />
            <img src={xText} />
            <TextBox placeholder="0" onChange={onText2Change} value={value2} />
          </Equation>
          {showHandPointer && <ClickPlayer src={handClick} autoplay loop />}
        </>
      )}
      {(showButton == 2 || showButton == 4) && (
        <HelperText>{correctTexts[question - 1]}</HelperText>
      )}
      {showButton == 3 && <HelperText>{wrongTexts[question - 1]}</HelperText>}
      {showButton == 1 && <CheckButton onClick={OnClickCheck}>Check</CheckButton>}
      {showButton == 2 && <NextButton onClick={OnClickNext}>Next</NextButton>}
      {showButton == 3 && (
        <TryAgainButton onClick={OnClickTryAgain}>
          <img src={tryagainBtn} />
        </TryAgainButton>
      )}
      {showButton == 4 && (
        <ResetBtn onClick={OnClickReset}>
          <img src={resetBtn} />
        </ResetBtn>
      )}
    </AppletContainer>
  )
}

import { Player } from '@lottiefiles/react-lottie-player'
import { FC, useContext, useEffect, useState } from 'react'
import styled, { css, keyframes } from 'styled-components'

import { click, moveRight } from '@/assets/onboarding'
import { AppletContainer } from '@/common/AppletContainer'
import { TextHeader } from '@/common/Header'
import { Math } from '@/common/Math'
import { AnalyticsContext, AppletInteractionCallback } from '@/contexts/analytics'
import { useInterval } from '@/hooks/useInterval'
import { useSFX } from '@/hooks/useSFX'
import { RangeInput } from '@/molecules/RangeInput'

import numberline from './assets/numberline.svg'
import page0 from './assets/page0.png'
import page1 from './assets/page1.png'
import retry from './assets/retry.svg'
import visualize from './assets/visualize.svg'

const ButtonElement = styled.button<{ colorTheme: string }>`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 16px 24px;
  height: 60px;
  position: absolute;
  left: 50%;
  translate: -50%;
  bottom: 20px;
  background: ${(p) => (p.colorTheme == 'white' ? '#fff' : '#1a1a1a')};
  border: 2px solid #1a1a1a;
  border-radius: 10px;
  cursor: pointer;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 24px;
  line-height: 32px;
  color: #ffffff;
  :disabled {
    cursor: not-allowed;
    opacity: 0.3;
  }
`
const HelperText = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  position: absolute;
  left: 50%;
  translate: -50%;
  top: 535px;
  width: 700px;
  height: 28px;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;
  text-align: center;
  color: #444444;
`
const HelperText1 = styled.div`
  position: absolute;
  left: -7%;
  translate: (7%);
  top: 600px;
  width: 700px;
  height: 28px;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;
  text-align: center;
  color: #444444;
`

const HelperText2 = styled.div`
  position: absolute;
  left: -8%;
  translate: (8%);
  top: 570px;
  width: 700px;
  height: 28px;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;
  text-align: center;
  color: #444444;
`
const HelperText3 = styled.div`
  position: absolute;
  left: -5%;
  translate: (5%);
  top: 600px;
  width: 700px;
  height: 28px;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;
  text-align: center;
  color: #444444;
`
const Text = styled.div`
  margin-left: 10px;
  max-width: 623px;
  span {
    color: #cf8b04;
    background-color: #fff6db;
    border-radius: 5px;
    padding: 0 3px;
    margin: 0 3px;
  }
`
const BGImg = styled.img`
  position: absolute;
  top: 100px;
  left: 50%;
  translate: -50%;
  width: 680px;
  height: 400px;
`
const FractStatement = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 630px;
  height: 56px;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;
  text-align: center;
  color: #1a1a1a;
`
const Fract = styled.div`
  font-weight: 400;
  font-size: 28px;
  line-height: 28px;
  padding: 0 5px;
`
const animNL = keyframes`
 from {top:110px;
  }
  to{top:210px;
  }
`
const FractNumberLine = styled.div<{ top: number; dim: boolean; anim: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: absolute;
  gap: 30px;
  left: 50%;
  translate: -50%;
  top: ${(p) => p.top}px;
  width: 700px;
  height: 180px;
  opacity: ${(p) => (p.dim ? 0.3 : 1)};
  animation: ${(p) =>
    p.anim
      ? css`
          ${animNL} 2s forwards
        `
      : ''};
`
const NumberLine = styled.div`
  width: 660px;
  height: 122px;
`
const Slider = styled(RangeInput)<{ left: number; disable: boolean; width: number }>`
  position: absolute;
  left: ${(p) => p.left}px;
  top: 590px;
  width: ${(p) => p.width}px;
  opacity: ${(p) => (p.disable ? 0.3 : 1)};
  ${(p) =>
    p.disable &&
    css`
      pointer-events: none;
    `}
`
const LineContainer = styled.div`
  position: absolute;
  top: 132px;
  left: 50%;
  translate: -50%;
  height: 10px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  text-align: center;
  font-size: 12px;
  margin-top: -10px;
  width: 610px;
  border-left: 1px solid #888;
  border-right: 1px solid #888;
`
const slideLeft = keyframes`
  from {
    flex-grow: 1.5;
  }
  to {
    flex-grow: 1;
  }
  `
const slideRight = keyframes`
  from {
    flex-grow: 0.5;
  }
  to {
    flex-grow: 1;
  }
  `
const LinePartition = styled.div<{ color: string; anim: string }>`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: end;
  justify-content: center;
  text-align: center;
  border-left: 1px solid #888;
  border-right: 1px solid #888;
  border-top: 3px solid ${(p) => p.color};
  flex-grow: 1;
  font-size: 28px;
  animation: ${(p) =>
    p.anim == 'left'
      ? css`
          ${slideLeft} 1s forwards
        `
      : p.anim == 'right'
      ? css`
          ${slideRight} 1s forwards
        `
      : ''};
`
const anim1 = keyframes`
 from {top:402px;
  left:54px; }
  to{top:232px;
  left:130px; }
`

const anim2 = keyframes`
 from {top:402px;
  left:54px; }
  to{top:232px;
  left:190px; }
`
const OrangeLine = styled.div<{ anim: number }>`
  border: 1.5px solid #ff8f1f;
  width: ${(p) => (p.anim == 1 ? 381 : 338)}px;
  position: absolute;
  top: 402px;
  left: 54px;
  animation: ${(p) => (p.anim == 1 ? anim1 : anim2)};
  animation-duration: 3s;
  animation-fill-mode: forwards;
`
const FractValues = styled.div`
  color: #888;
  position: absolute;
  right: -10px;
  bottom: 30px;
`
const FractInputDiv = styled.div<{ wrongAnsActive: boolean }>`
  position: absolute;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  text-align: center;
  left: ${(p) => (p.wrongAnsActive ? '90%' : '85%')};
  translate: -80%;
  top: 545px;
  color: #1a1a1a;
  font-family: Nunito;
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: 28px;
  height: 140px;
  gap: 20px;
`
const Fraction = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 4px;
  width: 73px;
  line-height: 44px;
  span {
    height: 2px;
    width: 100%;
    border: 1px solid #646464;
  }
`
const InputBox = styled.input<{ colorTheme: string }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 4px;
  gap: 20px;
  justify-content: center;
  width: 60px;
  height: 44px;
  border-radius: 12px;
  border: 1px solid
    ${(p) => (p.colorTheme == 'green' ? '#6CA621' : p.colorTheme == 'red' ? '#CC6666' : ' #1a1a1a')};
  background: ${(p) =>
    p.colorTheme == 'green' ? '#ECFFD9' : p.colorTheme == 'red' ? '#FFF2F2' : '#f6f6f6'};
  color: ${(p) =>
    p.colorTheme == 'green' ? '#6CA621' : p.colorTheme == 'red' ? '#CC6666' : ' #1a1a1a'};
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;
  text-align: center;
  :focus {
    outline: none;
  }
`
const HandPointer = styled(Player)<{ top: number; left: number }>`
  pointer-events: none;
  position: absolute;
  left: ${(p) => p.left}px;
  top: ${(p) => p.top}px;
`

const createNumberLine = (
  denominatorValue: number,
  numeratorValue: number,
  prevDenomValue: number,
  colorFill: boolean,
  animation: boolean,
) => {
  const boxes = []
  const fractions = []
  for (let numerator = 1; numerator <= denominatorValue; numerator++) {
    fractions.push([numerator, denominatorValue] as const)
  }
  for (let i = 1; i <= denominatorValue; i++) {
    const [numerator, denominator] = fractions[i - 1]
    boxes.push(
      <LinePartition
        key={`${i}-${denominatorValue}`}
        color={colorFill ? (i <= numeratorValue ? '#FF8F1F' : 'transparent') : 'transparent'}
        anim={
          animation
            ? i == denominatorValue
              ? ''
              : prevDenomValue <= denominatorValue
              ? 'left'
              : 'right'
            : ''
        }
      >
        {i != denominatorValue && (
          <FractValues>
            <Math>{String.raw`
        \frac{${numerator}}{${denominator}}
      `}</Math>
          </FractValues>
        )}
      </LinePartition>,
    )
  }
  return boxes
}
export const AppletG03AA02GB01: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const [pageNum, setPageNum] = useState(0)
  const [nextDisabled, setNextDisabled] = useState(false)
  const [wrongAns, setWrongAns] = useState(false)
  const [showHandPointer, setShowHandPointer] = useState(false)
  const [slider1Val, setSlider1Val] = useState(1)
  const [slider2Val, setSlider2Val] = useState(0)
  const [slider3Val, setSlider3Val] = useState(0)
  const [text1, setText1] = useState('')
  const [text2, setText2] = useState('')
  const [prevVal, setPrevVal] = useState(1)
  const playClick = useSFX('mouseClick')
  const onInteraction = useContext(AnalyticsContext)
  const [grids1, setGrids1] = useState([<></>])
  const [grids2, setGrids2] = useState([<></>])
  const playCorrect = useSFX('correct')
  const playInCorrect = useSFX('incorrect')
  const onNextHandle = () => {
    playClick()
    pageNum == 14 ? onInteraction('reset') : onInteraction('next')
    switch (pageNum) {
      case 0:
        setPageNum(1)
        break
      case 1:
        setPageNum(2)
        setNextDisabled(true)
        setShowHandPointer(true)
        break
      case 2:
        setNextDisabled(true)
        if (slider1Val === 8) {
          setPageNum(3)
          setWrongAns(false)
          playCorrect()
        } else {
          setWrongAns(true)
          playInCorrect()
        }
        break
      case 3:
        setNextDisabled(true)
        if (slider2Val === 1) {
          setPageNum(4)
          setWrongAns(false)
          playCorrect()
        } else {
          setWrongAns(true)
          playInCorrect()
        }
        break
      case 4:
        if (slider3Val === 5) {
          setPageNum(5)
          setWrongAns(false)
          playCorrect()
        } else {
          setWrongAns(true)
          playInCorrect()
          setNextDisabled(true)
        }
        break
      case 5:
        setPageNum(5.5)
        setNextDisabled(true)
        setGrids2(createNumberLine(slider1Val, 0, prevVal, true, false))
        break
      case 6:
        if (parseFloat(text1) === slider2Val + slider3Val && parseFloat(text2) === slider1Val) {
          setPageNum(7)
          playCorrect()
        } else {
          setWrongAns(true)
          setNextDisabled(true)
          playInCorrect()
        }
        break
      case 7:
        setPageNum(8)
        setSlider1Val(1)
        setSlider2Val(0)
        setSlider3Val(0)
        setPrevVal(1)
        setGrids1([<></>])
        setGrids2([<></>])
        setText1('')
        setText2('')
        break
      case 8:
        setPageNum(9)
        setNextDisabled(true)
        setShowHandPointer(true)
        break
      case 9:
        setNextDisabled(true)
        if (slider1Val === 9) {
          setPageNum(10)
          setWrongAns(false)
          playCorrect()
        } else {
          setWrongAns(true)
          playInCorrect()
        }
        break
      case 10:
        setNextDisabled(true)
        if (slider2Val === 2) {
          setPageNum(11)
          setWrongAns(false)
          playCorrect()
        } else {
          setWrongAns(true)
          playInCorrect()
        }
        break
      case 11:
        if (slider3Val === 5) {
          setPageNum(12)
          setWrongAns(false)
          playCorrect()
        } else {
          setWrongAns(true)
          playInCorrect()
          setNextDisabled(true)
        }
        break
      case 12:
        setPageNum(12.5)
        setNextDisabled(true)
        setGrids2(createNumberLine(slider1Val, 0, prevVal, true, false))
        break
      case 13:
        if (parseFloat(text1) === slider2Val + slider3Val && parseFloat(text2) === slider1Val) {
          setPageNum(14)
          playCorrect()
        } else {
          setWrongAns(true)
          setNextDisabled(true)
          playInCorrect()
        }
        break
      case 14:
        setPageNum(0)
        setSlider1Val(1)
        setSlider2Val(0)
        setSlider3Val(0)
        setPrevVal(1)
        setGrids1([<></>])
        setGrids2([<></>])
        setText1('')
        setText2('')
        break
    }
  }
  const handleSlider1Change = (value: number) => {
    setSlider1Val(value)
    setNextDisabled(false)
    setShowHandPointer(false)
  }
  const handleSlider2Change = (value: number) => {
    if (value <= slider1Val) {
      setSlider2Val(value)
      setNextDisabled(false)
    }
  }
  const handleSlider3Change = (value: number) => {
    if (value <= slider1Val) {
      setSlider3Val(value)
      setNextDisabled(false)
    }
  }
  useEffect(() => {
    if (pageNum === 2 || pageNum === 9) {
      const boxes = createNumberLine(slider1Val, slider1Val, prevVal, false, true)
      setGrids1(boxes)
      setGrids2(boxes)
      setPrevVal(slider1Val)
    } else if (pageNum === 3 || pageNum === 10) {
      const boxes = createNumberLine(slider1Val, slider2Val, prevVal, true, false)
      setGrids1(boxes)
    } else if (pageNum === 4 || pageNum === 11) {
      const boxes = createNumberLine(slider1Val, slider3Val, prevVal, true, false)
      setGrids2(boxes)
    } else if (pageNum === 6 || pageNum === 13) {
      const boxes = createNumberLine(slider1Val, slider2Val + slider3Val, prevVal, true, false)
      setGrids1(boxes)
    }
  }, [slider1Val, pageNum, slider2Val, slider3Val])
  const onText1Change = (e: any) => {
    if (pageNum === 7 || pageNum === 14) return
    if (e.target.value < 100 && e.target.value >= 0) {
      setWrongAns(false)
      setText1(e.target.value)
      // if (parseFloat(e.target.value) === slider2Val + slider3Val) e.target.blur()
      if (e.target.value != '' && text2 != '') setNextDisabled(false)
    }
  }
  const onText2Change = (e: any) => {
    if (pageNum === 7 || pageNum === 14) return
    if (e.target.value < 100 && e.target.value >= 0) {
      setWrongAns(false)
      setText2(e.target.value)
      // if (parseFloat(e.target.value) === slider1Val) e.target.blur()
      if (e.target.value != '' && text1 != '') setNextDisabled(false)
    }
  }
  useInterval(
    () => {
      setPageNum((p) => p + 0.5)
      setShowHandPointer(true)
    },
    pageNum == 5.5 || pageNum == 12.5 ? 3100 : null,
  )
  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#F6F6F6',
        id: 'g03-aa02-gb01',
        onEvent,
        className,
        themeName: 'dark',
      }}
    >
      <TextHeader
        text="Adding fractions using number line"
        backgroundColor="#F6F6F6"
        buttonColor="#1A1A1A"
      />
      <BGImg src={pageNum == 0 || pageNum == 8 ? page0 : page1} />
      {((pageNum > 0 && pageNum < 6) || (pageNum > 8 && pageNum < 13)) && (
        <FractNumberLine top={110} dim={pageNum == 4} anim={false}>
          <FractStatement>
            {pageNum != 5.5 && pageNum != 12.5
              ? pageNum < 8
                ? 'Fraction of ants who eat pudding = '
                : 'Fraction of ants who eat fries for starters = '
              : ''}
            <Fract>
              <Math>
                {pageNum != 5.5 && pageNum != 12.5
                  ? pageNum < 8
                    ? String.raw`\frac{${1}}{${8}}`
                    : String.raw`\frac{${2}}{${9}}`
                  : ''}
              </Math>
            </Fract>
          </FractStatement>
          {pageNum > 1 && (
            <>
              <NumberLine>
                <img src={numberline} />
              </NumberLine>
              <LineContainer>{grids1}</LineContainer>
            </>
          )}
        </FractNumberLine>
      )}
      {((pageNum > 0 && pageNum < 6) || (pageNum > 8 && pageNum < 13)) && (
        <FractNumberLine top={280} dim={pageNum == 3} anim={false}>
          <FractStatement>
            {pageNum != 5.5 && pageNum != 12.5
              ? pageNum < 8
                ? 'Fraction of ants who eat ice cream = '
                : 'Fraction of ants who eat pizza puffs for starters = '
              : ''}
            <Fract>
              <Math>
                {pageNum != 5.5 && pageNum != 12.5
                  ? pageNum < 8
                    ? String.raw`\frac{${5}}{${8}}`
                    : String.raw`\frac{${5}}{${9}}`
                  : ''}
              </Math>
            </Fract>
          </FractStatement>
          {pageNum > 1 && (
            <>
              <NumberLine>
                <img src={numberline} />
              </NumberLine>
              <LineContainer>{grids2}</LineContainer>
            </>
          )}
        </FractNumberLine>
      )}
      {(pageNum == 6 || pageNum == 7 || pageNum == 14 || pageNum == 13) && (
        <FractNumberLine top={210} dim={false} anim={true}>
          <FractStatement>
            {pageNum < 8
              ? 'Fraction of ants who eat pudding and ice cream = '
              : 'Fraction of ants who eat fries and pizza puffs for starters ='}
            <Fract>
              <Math>
                {pageNum < 8 ? String.raw`\frac{${1}}{${8}}` : String.raw`\frac{${2}}{${9}}`}
              </Math>
            </Fract>
            {' + '}
            <Fract>
              <Math>
                {pageNum < 8 ? String.raw`\frac{${5}}{${8}}` : String.raw`\frac{${5}}{${9}}`}
              </Math>
            </Fract>
          </FractStatement>
          {pageNum > 1 && (
            <>
              <NumberLine>
                <img src={numberline} />
              </NumberLine>
              <LineContainer>{grids1}</LineContainer>
            </>
          )}
        </FractNumberLine>
      )}
      {(pageNum == 2 || pageNum == 9) && (
        <Slider
          label={'Denominator'}
          min={1}
          max={10}
          left={60}
          defaultValue={1}
          value={slider1Val}
          onChange={handleSlider1Change}
          step={1}
          disable={false}
          width={600}
        />
      )}
      {((pageNum > 2 && pageNum < 6) || (pageNum > 9 && pageNum < 13)) && (
        <Slider
          label={'Numerator 1'}
          min={0}
          max={10}
          left={25}
          defaultValue={0}
          value={slider2Val}
          onChange={handleSlider2Change}
          step={1}
          disable={pageNum != 3 && pageNum != 10}
          width={320}
        />
      )}
      {((pageNum > 2 && pageNum < 6) || (pageNum > 9 && pageNum < 13)) && (
        <Slider
          label={'Numerator 2'}
          min={0}
          max={10}
          left={380}
          defaultValue={0}
          value={slider3Val}
          onChange={handleSlider3Change}
          step={1}
          disable={pageNum != 4 && pageNum != 11}
          width={320}
        />
      )}
      <HelperText>
        <Text>
          {pageNum == 0 && (
            <>
              {'Time for a victory feast! For starters, we have fries and pizza puffs.'}
              <br />
              And for dessert we have pudding and ice cream.
            </>
          )}
          {pageNum == 1 &&
            'Use the number line to add the fraction of ants who eat pudding and ice cream for dessert.'}
          {(pageNum == 2 || pageNum == 9) &&
            (wrongAns
              ? 'That is incorrect. Observe the denominator of the fractions.'
              : 'Mark the denominator for both number lines.')}
          {(pageNum == 3 || pageNum == 10) &&
            (wrongAns
              ? 'That is incorrect. Observe the numerator of fraction.'
              : 'That is correct! Now mark the numerator of the first fraction.')}
          {(pageNum == 4 || pageNum == 11) &&
            (wrongAns
              ? 'That is incorrect. Observe the numerator of fraction.'
              : 'That is correct! Now mark the numerator of the second fraction.')}
          {(pageNum == 5 || pageNum == 12 || pageNum == 5.5 || pageNum == 12.5) &&
            'That’s correct! Lets now add both the fractions.'}

          {pageNum == 8 &&
            'Use the number line to add the fraction of ants who eat fries and pizza puffs for starters.'}
        </Text>
      </HelperText>

      <HelperText1>
        {pageNum == 6 &&
          (wrongAns
            ? 'Incorrect! Fraction of ants who eat pudding and ice cream = '
            : 'Fraction of ants who eat pudding and ice cream   = ')}
        {pageNum == 13 &&
          (wrongAns
            ? 'Incorrect! Fraction of ants who eat fries and pizza puffs ='
            : 'Fraction of ants who eat fries and pizza puffs =')}
      </HelperText1>
      <HelperText2>{(pageNum == 7 || pageNum == 14) && 'Correct!'}</HelperText2>
      <HelperText3>
        {pageNum == 7 && 'Fraction of ants who eat pudding and ice cream = '}
        {pageNum == 14 && 'Fraction of ants who eat fries and pizza puffs = '}
      </HelperText3>
      {(pageNum == 6 || pageNum === 7 || pageNum == 13 || pageNum === 14) && (
        <FractInputDiv wrongAnsActive={wrongAns}>
          {/* <Fraction>
            <div>
              {slider2Val} + {slider3Val}
            </div>
            <span />
            <div>{slider1Val}</div>
          </Fraction> */}
          {/* <div> = </div> */}
          <Fraction>
            <InputBox
              onChange={onText1Change}
              value={text1}
              onFocus={(e: any) => {
                setShowHandPointer(false)
                if (pageNum == 7 || pageNum == 14) e.target.blur()
              }}
              colorTheme={pageNum == 7 || pageNum == 14 ? 'green' : wrongAns ? 'red' : 'default'}
            />
            <span />
            <InputBox
              onChange={onText2Change}
              value={text2}
              onFocus={(e: any) => {
                setShowHandPointer(false)
                if (pageNum == 7 || pageNum == 14) e.target.blur()
              }}
              colorTheme={pageNum == 7 || pageNum == 14 ? 'green' : wrongAns ? 'red' : 'default'}
            />
          </Fraction>
        </FractInputDiv>
      )}
      {(pageNum == 5.5 || pageNum == 12.5) && <OrangeLine anim={pageNum < 12 ? 1 : 2} />}
      {showHandPointer && (pageNum === 2 || pageNum === 9) && (
        <HandPointer autoplay loop src={moveRight} top={600} left={-125} />
      )}
      {showHandPointer && (pageNum === 6 || pageNum === 13) && (
        <HandPointer autoplay loop src={click} top={535} left={520} />
      )}
      <ButtonElement
        disabled={nextDisabled}
        onClick={onNextHandle}
        colorTheme={pageNum == 14 ? 'white' : 'black'}
      >
        {(pageNum == 0 || pageNum == 8) && 'Start'}
        {(pageNum == 1 || pageNum == 7) && 'Next'}
        {(pageNum == 2 ||
          pageNum == 3 ||
          pageNum == 4 ||
          pageNum == 6 ||
          pageNum == 9 ||
          pageNum == 10 ||
          pageNum == 11 ||
          pageNum == 13) &&
          'Check'}
        {(pageNum == 5 || pageNum == 12 || pageNum == 5.5 || pageNum == 12.5) && (
          <img src={visualize} />
        )}
        {pageNum == 14 && <img src={retry} />}
      </ButtonElement>
    </AppletContainer>
  )
}

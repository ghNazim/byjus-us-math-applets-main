import { Player } from '@lottiefiles/react-lottie-player'
import { FC, useCallback, useContext, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { Stage, useTransition } from 'transition-hook'

import { click } from '@/assets/onboarding'
import { AppletContainer } from '@/common/AppletContainer'
import { Geogebra } from '@/common/Geogebra'
import { GeogebraAppApi } from '@/common/Geogebra/Geogebra.types'
import { TextHeader } from '@/common/Header'
import { AnalyticsContext, AppletInteractionCallback } from '@/contexts/analytics'
import { useSFX } from '@/hooks/useSFX'

import arrowBlack from './assets/arrowBlack.svg'
import arrowRed from './assets/arrowRed.svg'
import questionMark from './assets/questionMark.svg'
import retry from './assets/retry.svg'
const GGBContainer = styled.div<{ visibility: boolean }>`
  position: absolute;
  scale: 0.81;
  top: 110px;
  left: 110px;
  ${(p) => !p.visibility && ' visibility: hidden;'}
`
const Ggb = styled(Geogebra)`
  position: absolute;
  width: 620px;
  height: 545px;
`
const BlueBG = styled.div`
  position: absolute;
  left: 50%;
  translate: -50%;
  top: 100px;
  width: 680px;
  height: 440px;
  border-radius: 12px;
  background: #e7fbff;
`
const GridContainer = styled.div`
  position: absolute;
  left: 50%;
  translate: -50%;
  top: 60px;
  display: grid;
  grid-template-columns: auto auto auto;
  grid-template-rows: auto auto auto auto;
`
const GridHead = styled.div<{ width: number; bdrRadius: string }>`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;
  width: ${(p) => p.width}px;
  height: 80px;
  background: #faf2ff;
  border: 1px solid #f4e5ff;
  border-radius: ${(p) => p.bdrRadius};
  color: #444;
`
const GridItem = styled.div<{ color: string; width: number; bdrRadius: string; bgColor: string }>`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;
  width: ${(p) => p.width}px;
  height: 60px;
  background: ${(p) => p.bgColor};
  color: ${(p) => p.color};
  border: 1px solid #f4e5ff;
  border-radius: ${(p) => p.bdrRadius};
`
const ButtonElement = styled.button`
  position: absolute;
  left: 50%;
  translate: -50%;
  bottom: 20px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 16px 24px;
  gap: 12px;
  background: #1a1a1a;
  border-radius: 10px;
  height: 60px;
  color: #fff;
  text-align: center;
  font-family: Nunito;
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: 32px;
  cursor: pointer;
  :disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`
const Box = styled.div<{ colorTheme: string }>`
  width: 229px;
  display: flex;
  height: 60px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  color: #1a1a1a;
  text-align: center;
  font-family: Nunito;
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: 28px;
  border-radius: 12px;
  border: 1px solid
    ${(p) => (p.colorTheme == 'green' ? '#6CA621' : p.colorTheme == 'red' ? '#CC6666' : '#444')};
  background: ${(p) =>
    p.colorTheme == 'green' ? '#ECFFD9' : p.colorTheme == 'red' ? '#FFF2F2' : '#fff'};
  cursor: pointer;
  position: relative;
`
const SelectedText = styled.div<{ colorTheme: string }>`
  width: 185px;
  height: 52px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${(p) =>
    p.colorTheme == 'green' ? '#6CA621' : p.colorTheme == 'red' ? '#CC6666' : '#444'};
  text-align: center;
  text-align: center;
  font-family: Nunito;
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: 52px;
`
const OptionsContainer = styled.button<{ stage: Stage }>`
  position: absolute;
  top: -230%;
  left: 50%;
  translate: -50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  display: flex;
  padding: 12px;
  align-items: center;
  gap: 12px;
  border-radius: 12px;
  border: none;
  background: #c7c7c7;
  opacity: ${(props) => (props.stage !== 'enter' ? 0 : 1)};
  transition: opacity 350ms;
  z-index: 1;
  ::after {
    content: ' ';
    position: absolute;
    left: 50%;
    translate: -50%;
    top: 99%;
    border-bottom: none;
    border-right: 8px solid transparent;
    border-left: 8px solid transparent;
    border-top: 8px solid #c7c7c7;
  }
`
const Option = styled.button`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 8px;
  gap: 10px;
  border-radius: 8px;
  border: none;
  width: 183px;
  height: 44px;
  font-family: 'Nunito';
  background: #ffffff;
  color: #646464;
  text-align: center;
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: 28px;
  cursor: pointer;
  :hover {
    background: #1a1a1a;
    color: #fff;
  }
`
const SelectionContainer = styled.div<{ top: number }>`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 8px;
  gap: 12px;
  position: absolute;
  top: ${(p) => p.top}px;
  left: 50%;
  translate: -50%;
  width: 680px;
`
const FeedBack = styled.div<{ width: number }>`
  pointer-events: none;
  position: absolute;
  top: -102%;
  left: 0%;
  translate: -50%;
  border-radius: 8px;
  border: none;
  border-radius: 8px;
  border: 0.5px solid #1a1a1a;
  background: #fff;
  z-index: 1;
  width: ${(p) => p.width}px;
  height: 48px;
  color: #444;
  text-align: center;
  font-family: Nunito;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 48px;
  span {
    font-weight: 700;
  }
  ::after {
    content: ' ';
    position: absolute;
    left: 80%;
    top: 87%;
    width: 12px;
    height: 12px;
    transform: rotate(45deg);
    background-color: #fff;
    border-bottom: 0.5px solid #1a1a1a;
    border-right: 0.5px solid #1a1a1a;
    border-left: 0.5px solid transparent;
    border-top: 0.5px solid transparent;
  }
  ::before {
    content: '!';
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    position: absolute;
    left: -12px;
    top: -12px;
    border: 1px solid #1a1a1a;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    background-color: #fff;
  }
`
const SelectionHelper = styled.div`
  color: #212121;
  text-align: right;
  font-family: Nunito;
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: 28px;
`
const HelperText = styled.div`
  display: flex;
  width: 650px;
  height: 60px;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  gap: 20px;
  position: absolute;
  top: 570px;
  left: 50%;
  translate: -50%;
  color: #444;
  text-align: center;
  font-family: Nunito;
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: 28px;
`
const Text = styled.div`
  margin-top: 10px;
  max-width: 500px;
`
const CheckBoxes = styled.div`
  display: flex;
  width: 700px;
  height: 60px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 20px;
  position: absolute;
  top: 625px;
  left: 50%;
  translate: -50%;
`
const CheckBoxContainer = styled.button<{ selected: boolean }>`
  cursor: pointer;
  display: flex;
  width: 158px;
  height: 60px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 15px;
  background-color: ${(p) => (p.selected ? '#c7c7c7' : '#fff')};
  border-radius: 12px;
  border: 1px solid ${(p) => (p.selected ? '#212121' : '#c7c7c7')};
  box-shadow: ${(p) => (p.selected ? 'inset 0 0 0 4px #fff' : '0px -4px 0px 0px #C7C7C7 inset')};
  span {
    color: #212121;
    text-align: center;
    font-family: Nunito;
    font-size: 20px;
    font-style: normal;
    font-weight: ${(p) => (p.selected ? 700 : 400)};
    line-height: 28px;
  }
  :disabled {
    opacity: 0.3;
    cursor: default;
  }
`
const CheckBox = styled.div<{ selected: boolean }>`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid #212121;
  box-shadow: ${(p) => (p.selected ? 'inset 0 0 0 4px #C7C7C7' : '')};
  background-color: ${(p) => (p.selected ? '#212121' : '#fff')};
`
const ColoredSpan = styled.span<{ color: string }>`
  color: ${(p) => p.color};
`
const HandPointer = styled(Player)`
  position: absolute;
  left: 110px;
  top: 620px;
  pointer-events: none;
`
const dd1Ans = [2, 1, 1]
const dd2Ans = [1, 2]
const ddValues = [
  ['becomes negative', 'stays constant'],
  ['becomes negative', 'stays constant'],
  ['gets interchanged', 'stays constant'],
]
const firstText = [
  'Along x-axis: x-coordinate',
  'Along y-axis: x-coordinate',
  'Along x = y line, both x and y coordinates',
]
const secondText = ['Along x-axis: y-coordinate', 'Along y-axis: y-coordinate']
const feedBackTexts1 = [
  <FeedBack key="1" width={267}>
    x-coordinate changed from <span>4</span> to <span>4</span>.
  </FeedBack>,
  <FeedBack key="1" width={267}>
    x-coordinate changed from <span>4</span> to <span>-4</span>.
  </FeedBack>,
  <FeedBack key="1" width={521}>
    {'x-coordinate changed from '}
    <span>4</span>
    {' to '}
    <span>3</span>
    {'. y-coordinate changed from '}
    <span>3</span> to <span>4</span>.
  </FeedBack>,
]
const feedBackTexts2 = [
  <FeedBack key="2" width={267}>
    y-coordinate changed from <span>3</span> to <span>-3</span>.
  </FeedBack>,
  <FeedBack key="2" width={267}>
    y-coordinate changed from <span>3</span> to <span>3</span>.
  </FeedBack>,
]
export const AppletG08GMC03S1GB02: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const ggbApi = useRef<GeogebraAppApi | null>(null)
  const [currentSelection, setCurrentSelection] = useState(-1)
  const [pageNum, setPageNum] = useState(0)
  const [nextDisabled, setNextDisabled] = useState(false)
  const [dd1SelValue, setdd1SelValue] = useState(0)
  const [dd2SelValue, setdd2SelValue] = useState(0)
  const [displayDropDown1, setDisplayDropDown1] = useState(false)
  const [displayDropDown2, setDisplayDropDown2] = useState(false)
  const { stage: stage1 } = useTransition(displayDropDown1, 350)
  const { stage: stage2 } = useTransition(displayDropDown2, 350)
  const [checkedVal, setCheckedVal] = useState({ a: false, b: false, c: false })
  const [prevChecked, setPrevChecked] = useState({ a: false, b: false, c: false })
  const playClick = useSFX('mouseClick')
  const onInteraction = useContext(AnalyticsContext)
  const onNextHandle = () => {
    playClick()
    switch (pageNum) {
      case 0:
        if (ggbApi.current) ggbApi.current.evalCommand('RunClickScript(button1)')
        if (prevChecked.a && prevChecked.b && prevChecked.c) {
          setPrevChecked({ a: false, b: false, c: false })
          onInteraction('reset')
        } else {
          setPageNum(1)
          onInteraction('next')
          setNextDisabled(true)
        }
        setCurrentSelection(-1)
        break
      case 1:
        currentSelection == 0
          ? setPrevChecked({ ...prevChecked, a: true })
          : currentSelection == 1
          ? setPrevChecked({ ...prevChecked, b: true })
          : setPrevChecked({ ...prevChecked, c: true })
        setPageNum(2)
        setNextDisabled(true)
        onInteraction('next')
        break
      case 2:
        if (!ggbApi.current) return
        setPageNum(0)
        setdd1SelValue(0)
        setdd2SelValue(0)
        setCheckedVal({ a: false, b: false, c: false })
        onInteraction('next')
        if (ggbApi.current.getVisible('note1')) ggbApi.current.evalCommand('RunClickScript(note1)')
        else if (ggbApi.current.getVisible('note2'))
          ggbApi.current.evalCommand('RunClickScript(note2)')
        else if (ggbApi.current.getVisible('note3'))
          ggbApi.current.evalCommand('RunClickScript(note3)')
        else if (ggbApi.current.getVisible('note4'))
          ggbApi.current.evalCommand('RunClickScript(note4)')
        break
    }
  }
  const onCheck1 = () => {
    playClick()
    onInteraction('tap')
    if (checkedVal.a) setCheckedVal({ a: false, b: false, c: false })
    else setCheckedVal({ a: true, b: false, c: false })
  }
  const onCheck2 = () => {
    playClick()
    onInteraction('tap')
    if (checkedVal.b) setCheckedVal({ a: false, b: false, c: false })
    else setCheckedVal({ a: false, b: true, c: false })
  }
  const onCheck3 = () => {
    playClick()
    onInteraction('tap')
    if (checkedVal.c) setCheckedVal({ a: false, b: false, c: false })
    else setCheckedVal({ a: false, b: false, c: true })
  }
  useEffect(() => {
    if (pageNum == 1) {
      if (!ggbApi.current) return
      let c = 0
      if (checkedVal.a) {
        c++
        ggbApi.current.evalCommand('RunClickScript(button2)')
        setCurrentSelection(0)
      } else if (checkedVal.b) {
        c++
        ggbApi.current.evalCommand('RunClickScript(button3)')
        setCurrentSelection(1)
      } else if (checkedVal.c) {
        c++
        ggbApi.current.evalCommand('RunClickScript(button4)')
        setCurrentSelection(2)
      } else {
        ggbApi.current.evalCommand('RunClickScript(button1)')
        setCurrentSelection(-1)
      }
      c == 1 ? setNextDisabled(false) : setNextDisabled(true)
    }
  }, [checkedVal])
  const onGGBHandle = useCallback(
    (api: GeogebraAppApi | null) => {
      ggbApi.current = api
      if (api == null) return
    },
    [ggbApi],
  )
  useEffect(() => {
    if (pageNum == 2) {
      if (
        (currentSelection < 2 &&
          dd1Ans[currentSelection] == dd1SelValue &&
          dd2Ans[currentSelection] == dd2SelValue) ||
        (currentSelection == 2 && dd1Ans[currentSelection] == dd1SelValue)
      )
        setNextDisabled(false)
      else setNextDisabled(true)
    }
  }, [dd1SelValue, dd2SelValue])
  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#f6f6f6',
        id: 'g08-gmc03-s1-gb02',
        onEvent,
        className,
      }}
    >
      <TextHeader
        text="Explore change in coordinate due to reflection along a line."
        backgroundColor="#f6f6f6"
        buttonColor="#1a1a1a"
      />
      {pageNum == 0 && (
        <BlueBG>
          <GridContainer>
            <GridHead width={160} bdrRadius="8px 0px 0px 0px">
              Reflection along
            </GridHead>
            <GridHead width={220} bdrRadius="0px">
              x-coordinate
            </GridHead>
            <GridHead width={220} bdrRadius="0px 8px 0px 0px">
              y-coordinate
            </GridHead>
            <GridItem
              width={160}
              bdrRadius="0px"
              color={'#444'}
              bgColor={currentSelection == 0 ? '#FFF2E5' : '#fff'}
            >
              X-axis
            </GridItem>
            <GridItem
              width={220}
              bdrRadius="0px"
              color={currentSelection == 0 ? '#FF8F1F' : '#646464'}
              bgColor={currentSelection == 0 ? '#FFF2E5' : '#fff'}
            >
              {prevChecked.a ? 'Stays constant' : <img src={questionMark} />}
            </GridItem>
            <GridItem
              width={220}
              bdrRadius="0px"
              color={currentSelection == 0 ? '#FF8F1F' : '#646464'}
              bgColor={currentSelection == 0 ? '#FFF2E5' : '#fff'}
            >
              {prevChecked.a ? 'Negative' : <img src={questionMark} />}
            </GridItem>
            <GridItem
              width={160}
              bdrRadius="0px"
              color={'#444'}
              bgColor={currentSelection == 1 ? '#FFF2E5' : '#fff'}
            >
              Y-axis
            </GridItem>
            <GridItem
              width={220}
              bdrRadius="0px"
              color={currentSelection == 1 ? '#FF8F1F' : '#646464'}
              bgColor={currentSelection == 1 ? '#FFF2E5' : '#fff'}
            >
              {prevChecked.b ? 'Negative' : <img src={questionMark} />}
            </GridItem>
            <GridItem
              width={220}
              bdrRadius="0px"
              color={currentSelection == 1 ? '#FF8F1F' : '#646464'}
              bgColor={currentSelection == 1 ? '#FFF2E5' : '#fff'}
            >
              {prevChecked.b ? 'Stays constant' : <img src={questionMark} />}
            </GridItem>

            <GridItem
              width={160}
              bdrRadius="0px 0px 0px 8px"
              color={'#444'}
              bgColor={currentSelection == 2 ? '#FFF2E5' : '#fff'}
            >
              y = x line
            </GridItem>
            <GridItem
              width={220}
              bdrRadius="0px"
              color={currentSelection == 2 ? '#FF8F1F' : '#646464'}
              bgColor={currentSelection == 2 ? '#FFF2E5' : '#fff'}
            >
              {prevChecked.c ? 'Interchange' : <img src={questionMark} />}
            </GridItem>
            <GridItem
              width={220}
              bdrRadius="0px 0px 8px 0px"
              color={currentSelection == 2 ? '#FF8F1F' : '#646464'}
              bgColor={currentSelection == 2 ? '#FFF2E5' : '#fff'}
            >
              {prevChecked.c ? 'Interchange' : <img src={questionMark} />}
            </GridItem>
          </GridContainer>
        </BlueBG>
      )}
      <GGBContainer visibility={pageNum > 0}>
        <Ggb materialId="rey6wsdx" onApiReady={onGGBHandle} />
      </GGBContainer>
      {pageNum == 1 && (
        <CheckBoxes>
          <CheckBoxContainer selected={checkedVal.a} onClick={onCheck1} disabled={prevChecked.a}>
            <CheckBox selected={checkedVal.a} />
            <span>x-axis</span>
          </CheckBoxContainer>
          <CheckBoxContainer selected={checkedVal.b} onClick={onCheck2} disabled={prevChecked.b}>
            <CheckBox selected={checkedVal.b} />
            <span>y-axis</span>
          </CheckBoxContainer>
          <CheckBoxContainer selected={checkedVal.c} onClick={onCheck3} disabled={prevChecked.c}>
            <CheckBox selected={checkedVal.c} />
            <span>x = y line</span>
          </CheckBoxContainer>
        </CheckBoxes>
      )}
      {pageNum == 2 && (
        <>
          <SelectionContainer top={555}>
            <SelectionHelper>
              {(currentSelection != 2 ? '\u2022 ' : '') + firstText[currentSelection]}
            </SelectionHelper>
            <Box
              onClick={() => {
                if (dd1Ans[currentSelection] !== dd1SelValue) {
                  onInteraction('tap')
                  playClick()
                  if (!displayDropDown1) {
                    setDisplayDropDown1(true)
                    setDisplayDropDown2(false)
                  } else setDisplayDropDown1(false)
                }
              }}
              colorTheme={
                dd1SelValue > 0
                  ? dd1Ans[currentSelection] == dd1SelValue
                    ? 'green'
                    : 'red'
                  : 'default'
              }
            >
              <SelectedText
                colorTheme={
                  dd1SelValue > 0
                    ? dd1Ans[currentSelection] == dd1SelValue
                      ? 'green'
                      : 'red'
                    : 'default'
                }
              >
                {dd1SelValue > 0 && ddValues[currentSelection][dd1SelValue - 1]}
              </SelectedText>
              {dd1SelValue == 0 && <img src={arrowBlack} />}
              {dd1SelValue > 0 && dd1Ans[currentSelection] != dd1SelValue && <img src={arrowRed} />}
              {displayDropDown1 && (
                <OptionsContainer stage={stage1}>
                  <Option
                    onClick={() => {
                      if (ggbApi.current) {
                        setdd1SelValue(1)
                      }
                    }}
                  >
                    {ddValues[currentSelection][0]}
                  </Option>
                  <Option
                    onClick={() => {
                      if (ggbApi.current) {
                        setdd1SelValue(2)
                      }
                    }}
                  >
                    {ddValues[currentSelection][1]}
                  </Option>
                </OptionsContainer>
              )}
              {dd1SelValue > 0 &&
                dd1Ans[currentSelection] != dd1SelValue &&
                !displayDropDown1 &&
                feedBackTexts1[currentSelection]}
            </Box>
          </SelectionContainer>
          {currentSelection != 2 && (
            <SelectionContainer top={635}>
              <SelectionHelper>{'\u2022 ' + secondText[currentSelection]}</SelectionHelper>
              <Box
                onClick={() => {
                  if (dd2Ans[currentSelection] !== dd2SelValue) {
                    onInteraction('tap')
                    playClick()
                    if (!displayDropDown2) {
                      setDisplayDropDown2(true)
                      setDisplayDropDown1(false)
                    } else setDisplayDropDown2(false)
                  }
                }}
                colorTheme={
                  dd2SelValue > 0
                    ? dd2Ans[currentSelection] == dd2SelValue
                      ? 'green'
                      : 'red'
                    : 'default'
                }
              >
                <SelectedText
                  colorTheme={
                    dd2SelValue > 0
                      ? dd2Ans[currentSelection] == dd2SelValue
                        ? 'green'
                        : 'red'
                      : 'default'
                  }
                >
                  {dd2SelValue > 0 && ddValues[currentSelection][dd2SelValue - 1]}
                </SelectedText>
                {dd2SelValue == 0 && <img src={arrowBlack} />}
                {dd2SelValue > 0 && dd2Ans[currentSelection] != dd2SelValue && (
                  <img src={arrowRed} />
                )}
                {displayDropDown2 && (
                  <OptionsContainer stage={stage2}>
                    <Option
                      onClick={() => {
                        if (ggbApi.current) {
                          setdd2SelValue(1)
                        }
                      }}
                    >
                      {ddValues[currentSelection][0]}
                    </Option>
                    <Option
                      onClick={() => {
                        if (ggbApi.current) {
                          setdd2SelValue(2)
                        }
                      }}
                    >
                      {ddValues[currentSelection][1]}
                    </Option>
                  </OptionsContainer>
                )}
                {dd2SelValue > 0 &&
                  dd2Ans[currentSelection] != dd2SelValue &&
                  !displayDropDown2 &&
                  feedBackTexts2[currentSelection]}
              </Box>
            </SelectionContainer>
          )}
        </>
      )}
      {(pageNum == 0 || pageNum == 1) && (
        <HelperText>
          <Text>
            {pageNum == 0 &&
              !prevChecked.a &&
              !prevChecked.b &&
              !prevChecked.c &&
              'Notice the change in coordinate when a point is reflected along a line.'}
            {pageNum == 0 &&
              prevChecked.a &&
              prevChecked.b &&
              prevChecked.c &&
              'Awesome! You’ve explored the effect of reflection in coordinate plane.'}
            {pageNum == 1 && (
              <>
                {'Select an axis to reflect ('}
                <ColoredSpan color="#FF8F1F">4</ColoredSpan>,
                <ColoredSpan color="#AA5EE0">3</ColoredSpan>
                {') coordinate.'}
              </>
            )}
          </Text>
        </HelperText>
      )}
      {pageNum == 1 &&
        !prevChecked.a &&
        !prevChecked.b &&
        !prevChecked.c &&
        currentSelection == -1 && <HandPointer src={click} autoplay loop />}
      <ButtonElement disabled={nextDisabled} onClick={onNextHandle}>
        {pageNum == 0 &&
          (currentSelection == -1 ? (
            'Start'
          ) : prevChecked.a && prevChecked.b && prevChecked.c ? (
            <img src={retry} />
          ) : (
            'Next'
          ))}
        {pageNum > 0 && 'Next'}
      </ButtonElement>
    </AppletContainer>
  )
}

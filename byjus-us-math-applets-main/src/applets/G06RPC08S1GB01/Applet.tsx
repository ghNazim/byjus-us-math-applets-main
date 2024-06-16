import { FC, useContext, useEffect, useState } from 'react'
import styled from 'styled-components'

import { AppletContainer } from '@/common/AppletContainer'
import { TextHeader } from '@/common/Header'
import { AnalyticsContext, AppletInteractionCallback } from '@/contexts/analytics'
import { useSFX } from '@/hooks/useSFX'

import avocados1 from './assets/avocados1.png'
import avocados2 from './assets/avocados2.png'
import mangoes from './assets/mangoes.png'
import retry from './assets/retry.svg'
import structureRep from './assets/structureRep.svg'
import tryNew from './assets/tryNew.svg'
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

const HelperText = styled.div<{ top: number }>`
  display: flex;
  width: 650px;
  height: 60px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 20px;
  position: absolute;
  top: ${(p) => p.top}px;
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
const QuesText = styled.div<{ top: number }>`
  display: flex;
  width: 650px;
  height: 160px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
  position: absolute;
  top: ${(p) => p.top}px;
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
const ColoredSpan = styled.span<{ type: string }>`
  padding: 0 3px;
  background: ${(p) => (p.type == 'x' ? '#F4E5FF' : '#E7FBFF')};
  color: ${(p) => (p.type == 'x' ? '#C882FA' : '#1CB9D9')};
  border-radius: 5px;
  margin: 0 7px;
  font-family: ${(p) => (p.type == 'x' ? 'Brioso Pro' : 'Nunito')};
  font-style: ${(p) => (p.type == 'x' ? 'italic' : 'normal')};
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
  top: 610px;
  left: 50%;
  translate: -50%;
`
const CheckBoxContainer = styled.div<{ colorTheme: string; pageNum: number }>`
  cursor: ${(p) => (p.pageNum > 0 ? 'default' : 'pointer')};
  display: flex;
  width: 208px;
  height: 100px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 8px;
  background-color: ${(p) =>
    p.colorTheme == 'selected'
      ? '#c7c7c7'
      : p.colorTheme == 'green'
      ? '#ECFFD9'
      : p.colorTheme == 'red'
      ? '#FFF2F2'
      : '#fff'};
  border-radius: 12px;
  border: 1px solid
    ${(p) =>
      p.colorTheme == 'selected'
        ? '#212121'
        : p.colorTheme == 'green'
        ? '#85CC29'
        : p.colorTheme == 'red'
        ? '#F57A7A'
        : '#c7c7c7'};
  box-shadow: ${(p) =>
    p.colorTheme == 'default' ? '0px -4px 0px 0px #C7C7C7 inset' : 'inset 0 0 0 4px #fff'};
  color: ${(p) =>
    p.colorTheme == 'green' ? '#6CA621' : p.colorTheme == 'red' ? '#CC6666' : '#212121'};
  text-align: center;
  font-family: Nunito;
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: 28px;
`
const FractOption = styled.div`
  display: flex;
  height: 100px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5px;
  width: 75px;
`
const FractLine = styled.div<{ color: string }>`
  width: 100%;
  height: 2px;
  background-color: ${(p) => p.color};
  border-radius: 1px;
`
const BlueBG = styled.div`
  width: 680px;
  height: 300px;
  border-radius: 10px;
  background: #f3f7fe;
  position: absolute;
  bottom: 180px;
  left: 50%;
  translate: -50%;
  color: '#212121';
  text-align: center;
  font-family: Nunito;
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: 28px;
  img {
    position: absolute;
    top: 50%;
    left: 50%;
    translate: -50% -50%;
  }
`
const FractionsContainer = styled.div<{ top: number }>`
  display: flex;
  height: 140px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 25px;
  position: absolute;
  top: ${(p) => p.top}px;
  left: 50%;
  translate: -50%;
`
const Fraction = styled.div<{ page: number }>`
  display: flex;
  height: ${(p) => (p.page < 4 ? 140 : 90)}px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: ${(p) => (p.page < 4 ? 10 : 5)}px;
  width: ${(p) => (p.page < 4 ? 80 : 55)}px;
`
const FractText = styled.div<{ color: string; page: number }>`
  height: ${(p) => (p.page < 4 ? 60 : 30)}px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #646464;
  span {
    padding: ${(p) => (p.page < 4 ? 10 : 0)}px 5px;
    background: ${(p) => (p.color == 'purple' ? '#F4E5FF' : 'none')};
    color: ${(p) => (p.color == 'purple' ? '#C882FA' : '#646464')};
    border-radius: 5px;
    margin: 0 7px;
    font-family: 'Brioso Pro';
    font-style: italic;
  }
`
const InputBox = styled.input<{ colorTheme: string }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 4px;
  gap: 20px;
  justify-content: center;
  width: 80px;
  height: 60px;
  background: ${(p) =>
    p.colorTheme == 'green' ? '#ECFFD9' : p.colorTheme == 'red' ? '#FFECF1' : '#fff'};
  border: 1px solid
    ${(p) => (p.colorTheme == 'green' ? '#85CC29' : p.colorTheme == 'red' ? '#ED6B90' : '#1a1a1a')};
  color: ${(p) =>
    p.colorTheme == 'green' ? '#85CC29' : p.colorTheme == 'red' ? '#ED6B90' : '#1a1a1a'};
  border-radius: 12px;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;
  text-align: center;
  :focus {
    outline: none;
    border: 2px solid
      ${(p) =>
        p.colorTheme == 'green' ? '#85CC29' : p.colorTheme == 'red' ? '#ED6B90' : '#1a1a1a'};
  }
  ::placeholder {
    opacity: 0.4;
  }
`
const Tooltip1 = styled.div`
  width: 430px;
  height: 48px;
  position: absolute;
  top: 20px;
  left: 20px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  padding: 12px;
  align-items: center;
  gap: 10px;
  border-radius: 8px;
  border: 0.5px solid #1a1a1a;
  background: #fff;
  z-index: 1;
  color: #444;
  text-align: center;
  font-family: Nunito;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px;
  ::after {
    content: ' ';
    position: absolute;
    left: 90%;
    top: 94%;

    border-bottom: 0.5px solid #1a1a1a;
    border-right: 0.5px solid #1a1a1a;
    border-top: none;
    border-left: none;
    transform: rotate(45deg);
    background: #ffffff;
    width: 8px;
    height: 8px;
  }
  ::before {
    content: '!';
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    left: -12px;
    top: -12px;
    width: 24px;
    height: 24px;
    border-radius: 25px;
    background-color: white;
    border: #1a1a1a solid 1px;
    font-weight: 700;
  }
`
const Tooltip2 = styled.div`
  width: 440px;
  height: 48px;
  position: absolute;
  bottom: 20px;
  right: 20px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  padding: 12px;
  align-items: center;
  gap: 10px;
  border-radius: 8px;
  border: 0.5px solid #1a1a1a;
  background: #fff;
  z-index: 1;
  color: #444;
  text-align: center;
  font-family: Nunito;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px;
  ::before {
    content: ' ';
    position: absolute;
    left: 10%;
    top: -10%;
    border-left: 0.5px solid #1a1a1a;
    border-top: 0.5px solid #1a1a1a;
    border-bottom: none;
    border-right: none;
    transform: rotate(45deg);
    background: #ffffff;
    width: 8px;
    height: 8px;
  }
  ::after {
    content: '!';
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    right: -12px;
    bottom: -12px;
    width: 24px;
    height: 24px;
    border-radius: 25px;
    background-color: white;
    border: #1a1a1a solid 1px;
    font-weight: 700;
  }
`

const percent = [
  [20, 30, 40, 50, 60, 70, 80],
  [12.5, 18.75, 25, 31.25, 37.5, 43.75, 50, 56.25, 62.5, 68.75, 75, 81.25, 87.5, 93.75],
  [25, 37.5, 50, 62.5, 75, 87.5],
]
const totalWhole = [10, 16, 8]
export const AppletG06RPC08S1GB01: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const [pageNum, setPageNum] = useState(0)
  const [optionSel, setOptionSel] = useState(0)
  const [quesNum, setQuesNum] = useState(0)
  const [currPercent, setCurrPercent] = useState(percent[0][randomNumberInRange(0, 6)])
  const [ans, setAns] = useState(0)
  const [nextDisabled, setNextDisabled] = useState(false)
  const playClick = useSFX('mouseClick')
  const onInteraction = useContext(AnalyticsContext)
  const [value1, setValue1] = useState('')
  const [value2, setValue2] = useState('')
  const [value3, setValue3] = useState('')
  function randomNumberInRange(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }
  useEffect(() => {
    setAns((totalWhole[quesNum] * currPercent) / 100)
  }, [currPercent])

  useEffect(() => {
    switch (quesNum) {
      case 0:
        setCurrPercent(percent[0][randomNumberInRange(0, 6)])
        break
      case 1:
        setCurrPercent(percent[1][randomNumberInRange(0, 13)])
        break
      case 2:
        setCurrPercent(percent[2][randomNumberInRange(0, 5)])
        break
    }
  }, [quesNum])
  // useEffect(() => {
  //   if (pageNum == 0) {
  //     if (optionSel > 0) setNextDisabled(false)
  //     else setNextDisabled(true)
  //   }
  // }, [optionSel])
  const onOptionCLicked = (val: number) => {
    if (pageNum > 0) return
    playClick()
    onInteraction('tap')
    if (val == optionSel) setOptionSel(0)
    else setOptionSel(val)
  }
  const onNextHandle = () => {
    playClick()
    onInteraction('next')
    switch (pageNum) {
      case 0:
        setPageNum(3)
        setNextDisabled(true)
        break
      case 3:
        setPageNum(4)
        setNextDisabled(true)
        break
      case 4:
        if (parseFloat(value3) == ans) setPageNum(6)
        else setPageNum(5)
        break
      case 5:
        setPageNum(4)
        setValue3('')
        break
      case 6:
        setQuesNum((q) => (q == 2 ? 0 : q + 1))
        setValue1('')
        setValue2('')
        setValue3('')
        setOptionSel(0)
        setPageNum(3)
        setNextDisabled(true)
        break
    }
  }
  const onText1Change = (e: any) => {
    if (parseFloat(value1) == totalWhole[quesNum]) return
    if (e.target.value < 20 && e.target.value >= 0) {
      setValue1(e.target.value)
      if (parseFloat(e.target.value) == totalWhole[quesNum]) {
        e.target.blur()
        if (parseFloat(value2) == currPercent) setNextDisabled(false)
        else setNextDisabled(true)
      }
    }
  }
  const onText2Change = (e: any) => {
    if (parseFloat(value2) == currPercent) return
    if (e.target.value < 101 && e.target.value >= 0) {
      setValue2(e.target.value)
      if (parseFloat(e.target.value) == currPercent) {
        e.target.blur()
        if (parseFloat(value1) == totalWhole[quesNum]) setNextDisabled(false)
        else setNextDisabled(true)
      }
    }
  }
  const onText3Change = (e: any) => {
    if (e.target.value < 101 && e.target.value >= 0) {
      setValue3(e.target.value)
      if (e.target.value !== '') setNextDisabled(false)
      else setNextDisabled(true)
    }
  }

  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#f6f6f6',
        id: 'g06-rpc08-s1-gb01',
        onEvent,
        className,
      }}
    >
      <TextHeader
        text="Exploring part of a percent."
        backgroundColor="#f6f6f6"
        buttonColor="#1a1a1a"
      />
      <QuesText top={pageNum < 3 ? 250 : 120}>
        <Text>
          Find
          <ColoredSpan type={'num'}>{currPercent + '%'}</ColoredSpan>
          {quesNum == 0 && 'of the mangoes given below.'}
          {quesNum == 1 && 'of the total number of fruits.'}
          {quesNum == 2 && 'of the avocados given below.'}
        </Text>
        {quesNum == 1 && <img src={avocados1} />}
        {quesNum == 2 && <img src={avocados2} />}
        <img src={mangoes} />
      </QuesText>
      {pageNum > 2 && (
        <BlueBG>
          {pageNum == 3 && (
            <>
              {<img src={structureRep} />}
              {value2 !== '' && parseFloat(value2) !== currPercent && (
                <Tooltip1>
                  <div>
                    {'Look out for the percentage of ' +
                      (quesNum == 0 ? 'mangoes' : quesNum == 1 ? 'fruits' : 'avocados') +
                      ' to be selected.'}
                  </div>
                </Tooltip1>
              )}
              {value1 !== '' && parseFloat(value1) !== totalWhole[quesNum] && (
                <Tooltip2>
                  <div>
                    {'The total number of ' +
                      (quesNum == 0 ? 'mangoes' : quesNum == 1 ? 'fruits' : 'avocados') +
                      " represent the 'whole' here."}
                  </div>
                </Tooltip2>
              )}
              <FractionsContainer top={80}>
                <Fraction page={pageNum}>
                  <FractText page={pageNum} color="purple">
                    <span>x</span>
                  </FractText>
                  <FractLine color={'#444'} />
                  <InputBox
                    colorTheme={
                      parseFloat(value1) == totalWhole[quesNum]
                        ? 'green'
                        : value1 == ''
                        ? 'default'
                        : 'red'
                    }
                    placeholder="00"
                    onChange={onText1Change}
                    value={value1}
                    onFocus={(e: any) => {
                      if (parseFloat(value1) == totalWhole[quesNum]) e.target.blur()
                    }}
                  />
                </Fraction>
                <div>=</div>
                <Fraction page={pageNum}>
                  <InputBox
                    colorTheme={
                      parseFloat(value2) == currPercent ? 'green' : value2 == '' ? 'default' : 'red'
                    }
                    placeholder="00"
                    onChange={onText2Change}
                    value={value2}
                    onFocus={(e: any) => {
                      if (parseFloat(value2) == currPercent) e.target.blur()
                    }}
                  />
                  <FractLine color={'#444'} />
                  <FractText page={pageNum} color="">
                    100
                  </FractText>
                </Fraction>
              </FractionsContainer>
            </>
          )}
          {pageNum > 3 && (
            <>
              <FractionsContainer top={20}>
                <Fraction page={pageNum}>
                  <FractText page={pageNum} color="">
                    <span>x</span>
                  </FractText>
                  <FractLine color={'#444'} />
                  <FractText page={pageNum} color="">
                    {totalWhole[quesNum]}
                  </FractText>
                </Fraction>
                <div>=</div>
                <Fraction page={pageNum}>
                  <FractText page={pageNum} color="">
                    {currPercent}
                  </FractText>
                  <FractLine color={'#444'} />
                  <FractText page={pageNum} color="">
                    100
                  </FractText>
                </Fraction>
              </FractionsContainer>
              <FractionsContainer top={120}>
                <FractText page={pageNum} color="">
                  <span>x</span>
                </FractText>
                <div>=</div>
                <InputBox
                  colorTheme={pageNum == 6 ? 'green' : pageNum == 4 ? 'default' : 'red'}
                  placeholder="00"
                  onChange={onText3Change}
                  value={value3}
                  onFocus={(e: any) => {
                    if (pageNum > 4) e.target.blur()
                  }}
                />
              </FractionsContainer>
            </>
          )}
        </BlueBG>
      )}
      <HelperText top={pageNum < 3 ? 510 : 630}>
        <Text>
          {/* {pageNum < 3 && 'Select the formula you’ll use to solve the question.'} */}

          {pageNum == 3 && (
            <>
              Let’s assume the part to be
              <ColoredSpan type={'x'}>x</ColoredSpan>, input the values of whole and percent.
            </>
          )}
          {pageNum == 4 && (
            <>
              Solve this equation and input the value of
              <ColoredSpan type={'x'}>x</ColoredSpan>.
            </>
          )}
          {pageNum == 5 && 'Uh-oh! That’s not right.'}
          {pageNum == 6 && (
            <>
              Great! You found
              <ColoredSpan type={'x'}>x</ColoredSpan>
              {', i.e. the number of ' +
                (quesNum == 0 ? 'mangoes' : quesNum == 1 ? 'fruits' : 'avocados') +
                ' to be picked.'}
            </>
          )}
        </Text>
      </HelperText>
      {/* {pageNum < 3 && (

        <CheckBoxes>
          <CheckBoxContainer
            colorTheme={
              optionSel == 1
                ? pageNum == 2
                  ? 'green'
                  : pageNum == 1
                  ? 'red'
                  : 'selected'
                : 'default'
            }
            pageNum={pageNum}
            onClick={() => {
              onOptionCLicked(1)
            }}
          >
            <FractOption>
              <div>?</div>
              <FractLine
                color={
                  optionSel == 1
                    ? pageNum == 2
                      ? '#6CA621'
                      : pageNum == 1
                      ? '#CC6666'
                      : '#444'
                    : '#444'
                }
              />
              <div>Whole</div>
            </FractOption>
            <div>=</div>
            <FractOption>
              <div>Percent</div>
              <FractLine
                color={
                  optionSel == 1
                    ? pageNum == 2
                      ? '#6CA621'
                      : pageNum == 1
                      ? '#CC6666'
                      : '#444'
                    : '#444'
                }
              />
              <div>100</div>
            </FractOption>
          </CheckBoxContainer>
          <CheckBoxContainer
            colorTheme={
              optionSel == 2
                ? pageNum == 2
                  ? 'green'
                  : pageNum == 1
                  ? 'red'
                  : 'selected'
                : 'default'
            }
            pageNum={pageNum}
            onClick={() => {
              onOptionCLicked(2)
            }}
          >
            <FractOption>
              <div>Part</div>
              <FractLine
                color={
                  optionSel == 2
                    ? pageNum == 2
                      ? '#6CA621'
                      : pageNum == 1
                      ? '#CC6666'
                      : '#444'
                    : '#444'
                }
              />
              <div>Whole</div>
            </FractOption>
            <div>=</div>
            <FractOption>
              <div>?</div>
              <FractLine
                color={
                  optionSel == 2
                    ? pageNum == 2
                      ? '#6CA621'
                      : pageNum == 1
                      ? '#CC6666'
                      : '#444'
                    : '#444'
                }
              />
              <div>100</div>
            </FractOption>
          </CheckBoxContainer>
          <CheckBoxContainer
            colorTheme={
              optionSel == 3
                ? pageNum == 2
                  ? 'green'
                  : pageNum == 1
                  ? 'red'
                  : 'selected'
                : 'default'
            }
            pageNum={pageNum}
            onClick={() => {
              onOptionCLicked(3)
            }}
          >
            <FractOption>
              <div>Part</div>
              <FractLine
                color={
                  optionSel == 3
                    ? pageNum == 2
                      ? '#6CA621'
                      : pageNum == 1
                      ? '#CC6666'
                      : '#444'
                    : '#444'
                }
              />
              <div>?</div>
            </FractOption>
            <div>=</div>
            <FractOption>
              <div>Percent</div>
              <FractLine
                color={
                  optionSel == 3
                    ? pageNum == 2
                      ? '#6CA621'
                      : pageNum == 1
                      ? '#CC6666'
                      : '#444'
                    : '#444'
                }
              />
              <div>100</div>
            </FractOption>
          </CheckBoxContainer>
        </CheckBoxes>
      )} */}

      <ButtonElement disabled={nextDisabled} onClick={onNextHandle}>
        {pageNum == 0 && quesNum == 0 && 'Start'}
        {pageNum == 4 && 'Check'}
        {(pageNum == 1 || pageNum == 5) && <img src={retry} />}
        {pageNum == 0 && quesNum == 1 && 'Next'}
        {pageNum == 0 && quesNum == 2 && 'Next'}
        {pageNum == 3 && 'Next'}
        {pageNum == 6 && <img src={tryNew} />}
      </ButtonElement>
    </AppletContainer>
  )
}

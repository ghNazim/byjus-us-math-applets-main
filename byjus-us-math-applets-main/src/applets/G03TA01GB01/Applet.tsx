import { FC, useContext, useEffect, useState } from 'react'
import styled, { keyframes } from 'styled-components'

import { AppletContainer } from '@/common/AppletContainer'
import { TextHeader } from '@/common/Header'
import { AnalyticsContext, AppletInteractionCallback } from '@/contexts/analytics'
import { useInterval } from '@/hooks/useInterval'
import { useSFX } from '@/hooks/useSFX'
import { RangeInput } from '@/molecules/RangeInput'

import comp1 from './assets/comp1.svg'
import comp2 from './assets/comp2.svg'
import comp4 from './assets/comp4.svg'
import page0 from './assets/page0.png'
import page1 from './assets/page1.png'
import page2 from './assets/page2.png'
import page3 from './assets/page3.png'
import page5 from './assets/page5.png'
import page6 from './assets/page6.png'
import page8 from './assets/page8.png'
import page9 from './assets/page9.png'
import page10 from './assets/page10.png'
import page12 from './assets/page12.png'
import page13 from './assets/page13.png'
import page15 from './assets/page15.png'
import reset from './assets/reset.svg'
import { DDPageBox } from './components/DDPageBox'
import { DropdownBox } from './components/DropdownBox'
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
  top: 650px;
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
  max-width: 550px;
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
  height: 520px;
`
const GridContainer = styled.div`
  position: absolute;
  top: 400px;
  left: 50%;
  translate: -50%;
  width: 480px;
  height: 60px;
  background: #fff;
  display: flex;
  flex-direction: row;
`
const GridBox = styled.div<{ color: string }>`
  border: 1px solid #1a1a1a;
  background: ${(p) => p.color};
  flex-grow: 1;
`
const Slider = styled(RangeInput)<{ top: number }>`
  position: absolute;
  top: ${(p) => p.top}px;
  left: 50%;
  translate: -50%;
`
const anim1 = keyframes`
 from {top:399px;
  left:81px; }
  to{top:369px;
  left:238px; }
`
const CompareImg1 = styled.img`
  position: absolute;
  top: 399px;
  left: 81px;
  animation: ${anim1};
  animation-duration: 3s;
  animation-fill-mode: forwards;
`
const anim2 = keyframes`
 from {top:399px;
  left:391px; }
  to{top:429px;
  left:238px; }
`
const CompareImg2 = styled.img`
  position: absolute;
  top: 399px;
  left: 391px;
  animation: ${anim2};
  animation-duration: 3s;
  animation-fill-mode: forwards;
`
const imgSrc = [
  page0,
  page1,
  page2,
  page3,
  page3,
  page5,
  page6,
  page6,
  page8,
  page9,
  page10,
  page10,
  page12,
  page13,
  page13,
  page15,
]

export const AppletG03TA01GB01: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const [pageNum, setPageNum] = useState(0)
  const [nextDisabled, setNextDisabled] = useState(false)
  const [ansChecked, setAnsChecked] = useState(false)
  const [ansChecked1, setAnsChecked1] = useState(false)
  const [optionSel, setOptionSel] = useState(0)
  const [optionSel1, setOptionSel1] = useState(0)
  const playClick = useSFX('mouseClick')
  const onInteraction = useContext(AnalyticsContext)
  const [grids, setGrids] = useState([<></>])
  const [dd1open, setDd1Open] = useState(false)
  const [dd2open, setDd2Open] = useState(false)
  const [showDropDown, setShowDropDown] = useState(false)

  const onNextHandle = () => {
    playClick()
    pageNum == 15 ? onInteraction('reset') : onInteraction('next')
    switch (pageNum) {
      case 0:
        setPageNum(1)
        break
      case 1:
        setPageNum(2)
        break
      case 2:
        setPageNum(3)
        setNextDisabled(true)
        break
      case 3:
        setAnsChecked(true)
        setAnsChecked1(true)
        if (optionSel == 2 && optionSel1 == 6) setPageNum(4)
        else setNextDisabled(true)
        break
      case 4:
        setPageNum(5)
        setOptionSel(0)
        setAnsChecked(false)
        setOptionSel1(1)
        setAnsChecked1(false)
        break
      case 5:
        setPageNum(6)
        setNextDisabled(true)
        break
      case 6:
        setAnsChecked(true)
        if (optionSel == 2 && optionSel1 == 5) setPageNum(7)
        break
      case 7:
        setPageNum(8)
        setOptionSel(0)
        setAnsChecked(false)
        setOptionSel1(0)
        setAnsChecked1(false)
        break
      case 8:
        setPageNum(9)
        break
      case 9:
        setPageNum(10)
        setNextDisabled(true)
        break
      case 10:
        setAnsChecked(true)
        if (optionSel == 3) setPageNum(11)
        break
      case 11:
        setPageNum(12)
        setOptionSel(0)
        setAnsChecked(false)
        setShowDropDown(false)
        break
      case 12:
        setNextDisabled(true)
        setPageNum(13)
        break
      case 13:
        setAnsChecked(true)
        if (optionSel == 2) setPageNum(14)
        break
      case 14:
        setPageNum(15)
        setOptionSel(0)
        setAnsChecked(false)
        setShowDropDown(false)
        break
      case 15:
        setPageNum(0)
        break
    }
  }
  useInterval(
    () => {
      setShowDropDown(true)
    },
    (pageNum == 10 || pageNum == 13) && !showDropDown ? 3100 : null,
  )
  useEffect(() => {
    if (pageNum === 6) {
      const boxes = []
      for (let i = 1; i <= optionSel1; i++) {
        boxes.push(
          <GridBox
            key={i}
            color={i <= optionSel ? (ansChecked ? '#FF9A9A' : '#A6F0FF') : '#fff'}
          />,
        )
      }
      setGrids(boxes)
      optionSel > 0 && !ansChecked ? setNextDisabled(false) : setNextDisabled(true)
    }
  }, [optionSel1, pageNum, optionSel, ansChecked])
  useEffect(() => {
    if (pageNum == 6) setOptionSel1(8)
  }, [pageNum])
  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#f6f6f6',
        id: 'g03-ta01-gb01',
        onEvent,
        className,
        themeName: 'dark',
      }}
    >
      <TextHeader
        text="Forming and comparing fractions on tape diagram"
        backgroundColor="#f6f6f6"
        buttonColor="#1a1a1a"
      />
      <BGImg src={imgSrc[pageNum]} />
      {pageNum > 9 && pageNum < 12 && <CompareImg1 src={comp1} />}
      {pageNum > 9 && pageNum < 12 && <CompareImg2 src={comp2} />}
      {pageNum > 12 && pageNum < 15 && <CompareImg1 src={comp1} />}
      {pageNum > 12 && pageNum < 15 && <CompareImg2 src={comp4} />}
      {(pageNum == 3 || pageNum == 4) && (
        <>
          <DDPageBox
            rightAns={2}
            onDisabling={(isOpen, sel, checked) => {
              setDd1Open(isOpen)
              !isOpen && !dd2open && sel > 0 && optionSel1 > 0
                ? setNextDisabled(false)
                : setNextDisabled(true)
              setAnsChecked(checked)
              setOptionSel(sel)
            }}
            checked={ansChecked}
            top={435}
          />
          <DDPageBox
            rightAns={6}
            onDisabling={(isOpen, sel, checked) => {
              setDd2Open(isOpen)
              !isOpen && !dd1open && sel > 0 && optionSel > 0
                ? setNextDisabled(false)
                : setNextDisabled(true)
              setAnsChecked1(checked)
              setOptionSel1(sel)
            }}
            checked={ansChecked1}
            top={511}
          />
        </>
      )}
      {(pageNum == 6 || pageNum == 7) && (
        <>
          <Slider
            min={0}
            max={8}
            value={optionSel}
            onChange={(_, ratio) => {
              if (ratio * 8 <= optionSel1 && pageNum == 6) {
                setOptionSel(ratio * 8)
                setAnsChecked(false)
              }
            }}
            top={241}
          />
          {pageNum == 6 && <GridContainer>{grids}</GridContainer>}
          {pageNum === 7 && (
            <GridContainer>
              <GridBox color={'#85CC29'} />
              <GridBox color={'#85CC29'} />
              <GridBox color={'#fff'} />
              <GridBox color={'#fff'} />
              <GridBox color={'#fff'} />
            </GridContainer>
          )}
          <Slider
            top={460}
            min={1}
            max={8}
            value={optionSel1}
            defaultValue={1}
            onChange={(_, ratio) => {
              if (ratio * 7 + 1 >= optionSel && pageNum == 6) {
                setOptionSel1(ratio * 7 + 1)
                setAnsChecked(false)
              }
            }}
          />
        </>
      )}
      {showDropDown && (pageNum == 10 || pageNum == 11) && (
        <DropdownBox
          rightAns={3}
          onDisabling={(disable, sel, checked) => {
            setNextDisabled(disable)
            setAnsChecked(checked)
            setOptionSel(sel)
          }}
          checked={ansChecked}
        />
      )}
      {showDropDown && (pageNum == 13 || pageNum == 14) && (
        <DropdownBox
          rightAns={2}
          onDisabling={(disable, sel, checked) => {
            setNextDisabled(disable)
            setAnsChecked(checked)
            setOptionSel(sel)
          }}
          checked={ansChecked}
        />
      )}
      <HelperText>
        <Text>
          {pageNum == 0 && 'Let’s begin the fun.'}
          {pageNum == 2 && 'Team up with the ants and practice math for victory!'}
          {pageNum == 3 &&
            (!ansChecked && !ansChecked1 ? (
              <>
                What is the fraction of the <span>shaded part</span>?
              </>
            ) : (
              'Oops! Try again.'
            ))}
          {(pageNum == 4 || pageNum == 7) && 'Yes, that’s correct.'}
          {pageNum == 5 && 'The training ground has been divided into different zones.'}
          {pageNum == 6 &&
            (!ansChecked
              ? 'Represent the fraction of the exercise zone.'
              : 'Oops! Look at the fraction again.')}
          {pageNum == 8 &&
            'Practice makes perfect!  The ants are working hard, while the spiders rely on overconfidence.'}
          {pageNum == 9 && 'Compare the fractions.'}
          {(pageNum == 10 || pageNum == 13) &&
            (!ansChecked
              ? 'Based on the comparison of both the fractions, select the correct symbol.'
              : 'Oops! Look carefully at the tape diagram and try again.')}
          {(pageNum == 11 || pageNum == 14) && 'Awesome! You got it right.'}
          {pageNum == 12 && 'Let’s practice one more time. Compare the fractions.'}
          {pageNum == 15 && 'The ants have wrapped up practice. Now, it’s race time!'}
        </Text>
      </HelperText>
      <ButtonElement
        disabled={nextDisabled}
        onClick={onNextHandle}
        colorTheme={pageNum == 15 ? 'white' : 'black'}
      >
        {pageNum == 0 && 'Begin'}
        {(pageNum == 1 ||
          pageNum == 4 ||
          pageNum == 5 ||
          pageNum == 7 ||
          pageNum == 8 ||
          pageNum == 11 ||
          pageNum == 14) &&
          'Next'}
        {pageNum == 2 && 'Start'}
        {(pageNum == 3 || pageNum == 6 || pageNum == 10 || pageNum == 13) && 'Check'}
        {(pageNum == 9 || pageNum == 12) && 'Compare'}
        {pageNum == 15 && <img src={reset} />}
      </ButtonElement>
    </AppletContainer>
  )
}

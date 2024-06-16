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
import comp3 from './assets/comp3.svg'
import comp4 from './assets/comp4.svg'
import page0 from './assets/page0.png'
import page1 from './assets/page1.png'
import page3 from './assets/page3.png'
import page4 from './assets/page4.png'
import page7 from './assets/page7.png'
import page8 from './assets/page8.png'
import page9 from './assets/page9.png'
import page11 from './assets/page11.png'
import page12 from './assets/page12.png'
import page14 from './assets/page14.png'
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
  max-width: 623px;
  span {
    color: #6595de;
    background-color: #f3f7fe;
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
  width: 320px;
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
const bgImgSrc = [
  page0,
  page1,
  page1,
  page3,
  page4,
  page4,
  page7,
  page7,
  page8,
  page9,
  page9,
  page11,
  page12,
  page12,
  page14,
]

export const AppletG03SA01GB01: FC<{
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
  const [showDropDown, setShowDropDown] = useState(false)
  const [dd1open, setDd1Open] = useState(false)
  const [dd2open, setDd2Open] = useState(false)
  const onNextHandle = () => {
    playClick()
    pageNum == 14 ? onInteraction('reset') : onInteraction('next')
    switch (pageNum) {
      case 0:
        setPageNum(1)
        setNextDisabled(true)
        break
      case 1:
        setAnsChecked(true)
        setAnsChecked1(true)
        if (optionSel == 1 && optionSel1 == 3) setPageNum(2)
        else setNextDisabled(true)
        break
      case 2:
        setPageNum(3)
        setOptionSel(0)
        setAnsChecked(false)
        setOptionSel1(1)
        setAnsChecked1(false)
        break
      case 3:
        setPageNum(4)
        setNextDisabled(true)
        break
      case 4:
        setAnsChecked(true)
        if (optionSel == 1 && optionSel1 == 4) setPageNum(5)
        break
      case 5:
        setPageNum(7)
        setOptionSel(0)
        setAnsChecked(false)
        setOptionSel1(0)
        setAnsChecked1(false)
        break
      case 7:
        setPageNum(8)
        break
      case 8:
        setPageNum(9)
        setNextDisabled(true)
        break
      case 9:
        setAnsChecked(true)
        if (optionSel == 2) setPageNum(10)
        break
      case 10:
        setPageNum(11)
        setOptionSel(0)
        setAnsChecked(false)
        setShowDropDown(false)
        break
      case 11:
        setPageNum(12)
        setNextDisabled(true)
        break
      case 12:
        setAnsChecked(true)
        if (optionSel == 1) setPageNum(13)
        break
      case 13:
        setPageNum(14)
        setOptionSel(0)
        setAnsChecked(false)
        setShowDropDown(false)
        break
      case 14:
        setPageNum(0)
        break
    }
  }
  useEffect(() => {
    if (pageNum === 4) {
      const boxes = []
      for (let i = 1; i <= optionSel1; i++) {
        boxes.push(
          <GridBox
            key={i}
            color={i <= optionSel ? (ansChecked ? '#FF9A9A' : '#FFDC73') : '#fff'}
          />,
        )
      }
      setGrids(boxes)
      optionSel > 0 && !ansChecked ? setNextDisabled(false) : setNextDisabled(true)
    }
  }, [optionSel1, pageNum, optionSel, ansChecked])
  useEffect(() => {
    if (pageNum == 4) setOptionSel1(8)
  }, [pageNum])

  useInterval(
    () => {
      setShowDropDown(true)
    },
    (pageNum == 9 || pageNum == 12) && !showDropDown ? 3100 : null,
  )
  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#f6f6f6',
        id: 'g03-sa01-gb01',
        onEvent,
        className,
        themeName: 'dark',
      }}
    >
      <TextHeader
        text="Practice: Forming and comparing fractions on a tape diagram."
        backgroundColor="#f6f6f6"
        buttonColor="#1a1a1a"
      />
      <BGImg src={bgImgSrc[pageNum]} />
      {pageNum > 8 && pageNum < 11 && <CompareImg1 src={comp1} />}
      {pageNum > 8 && pageNum < 11 && <CompareImg2 src={comp2} />}
      {pageNum > 11 && pageNum < 14 && <CompareImg1 src={comp3} />}
      {pageNum > 11 && pageNum < 14 && <CompareImg2 src={comp4} />}
      {(pageNum == 1 || pageNum == 2) && (
        <>
          <DDPageBox
            rightAns={1}
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
            rightAns={3}
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
      {(pageNum == 4 || pageNum == 5) && (
        <>
          <Slider
            min={0}
            max={8}
            value={optionSel}
            onChange={(_, ratio) => {
              if (ratio * 8 <= optionSel1 && pageNum == 4) {
                setOptionSel(ratio * 8)
                setAnsChecked(false)
              }
            }}
            top={241}
          />
          {pageNum == 4 && <GridContainer>{grids}</GridContainer>}
          {pageNum === 5 && (
            <GridContainer>
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
              if (ratio * 7 + 1 >= optionSel && pageNum == 4) {
                setOptionSel1(ratio * 7 + 1)
                setAnsChecked(false)
              }
            }}
          />
        </>
      )}
      {showDropDown && (pageNum == 9 || pageNum == 10) && (
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
      {showDropDown && (pageNum == 12 || pageNum == 13) && (
        <DropdownBox
          rightAns={1}
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
          {pageNum == 0 && (
            <>
              {"It's time to race! Get set, go!"}
              <br />
              Practice now to make the ants champions!
            </>
          )}
          {pageNum == 1 &&
            (!ansChecked && !ansChecked1 ? (
              <>
                What is the fraction of the <span>shaded part</span>?
              </>
            ) : (
              'Oops! Try Again.'
            ))}
          {pageNum == 2 && 'Yes, that’s correct.'}
          {pageNum == 5 && 'Yes, that’s correct. Let’s continue with the race.'}
          {pageNum == 3 &&
            'Looks like some sections of the race track are covered in sand. Let’s see how many sections we need to clear in order to continue.'}
          {pageNum == 4 &&
            (!ansChecked
              ? 'Represent the fraction of the race track covered in sand.'
              : 'Oops! Look at the fraction again.')}
          {pageNum == 7 &&
            "Let's do more math problems to help the ants race faster to the finish line!"}
          {pageNum == 8 && 'Compare the fractions.'}
          {(pageNum == 9 || pageNum == 12) &&
            (!ansChecked
              ? 'Based on the comparison of both the fractions, select the correct symbol.'
              : 'Oops! Look carefully at the tape diagram and try again.')}
          {(pageNum == 10 || pageNum == 13) && 'Awesome! You got it right.'}
          {pageNum == 11 && 'Let’s practice one more time, compare the fractions.'}
          {pageNum == 14 && 'Great! The ant won the race!'}
        </Text>
      </HelperText>
      <ButtonElement
        disabled={nextDisabled}
        onClick={onNextHandle}
        colorTheme={pageNum == 14 ? 'white' : 'black'}
      >
        {pageNum == 0 && 'Start'}
        {(pageNum == 2 ||
          pageNum == 3 ||
          pageNum == 5 ||
          pageNum == 7 ||
          pageNum == 10 ||
          pageNum == 13) &&
          'Next'}
        {(pageNum == 1 || pageNum == 4 || pageNum == 9 || pageNum == 12) && 'Check'}
        {(pageNum == 8 || pageNum == 11) && 'Compare'}
        {pageNum == 14 && <img src={reset} />}
      </ButtonElement>
    </AppletContainer>
  )
}

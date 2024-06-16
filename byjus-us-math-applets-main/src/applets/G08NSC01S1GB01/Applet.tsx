import { Player } from '@lottiefiles/react-lottie-player'
import { FC, useContext, useState } from 'react'
import styled, { keyframes } from 'styled-components'

import { click } from '@/assets/onboarding'
import { AppletContainer } from '@/common/AppletContainer'
import { TextHeader } from '@/common/Header'
import { AnalyticsContext, AppletInteractionCallback } from '@/contexts/analytics'
import { useSFX } from '@/hooks/useSFX'

import confettiL from './assets/confettiL.png'
import confettiR from './assets/confettiR.png'
import { pi } from './assets/pi'
import piImg from './assets/piValue.svg'
import reset from './assets/reset.svg'
import iconCal from './assets/uil_calender.svg'
import Calendar from './Calendar/Calendar'
const ButtonElement = styled.button<{ themeName: string }>`
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
  background: ${(p) => (p.themeName == 'black' ? '#1a1a1a' : 'none')};
  ${(p) => (p.themeName !== 'black' ? 'border: 2px solid #1a1a1a' : '')};
  border-radius: 10px;
  height: 60px;
  cursor: pointer;
  color: #fff;
  text-align: center;
  font-family: Nunito;
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: 32px;
  :disabled {
    opacity: 0.3;
    cursor: default;
  }
`
const BGContainer = styled.div`
  position: absolute;
  left: 50%;
  translate: -50%;
  top: 100px;
  width: 680px;
  height: 520px;
  background: #ffedb8;
`
const Pi = styled.div`
  position: absolute;
  left: 50%;
  translate: -50%;
  top: 260px;
  width: 600px;
  height: 140px;
  overflow: hidden;
  background-color: #ffffff;
  border-radius: 20px;
  padding: 20px 0px;
  color: #1a1a1a;
  font-family: Nunito;
  font-size: 48px;
  font-style: normal;
  font-weight: 400;
  line-height: 100px;
  letter-spacing: 10px;
  padding-left: 30px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  gap: 5px;
`
const anim = keyframes`
  1%   {  justify-content: flex-start;}
  40%   {  justify-content: center;}
  100% {    justify-content: flex-end;}
`
const Pi1 = styled.div`
  position: absolute;
  left: 50%;
  translate: -50%;
  top: 260px;
  width: 600px;
  height: 140px;
  overflow: hidden;
  background-color: #ffffff;
  border-radius: 20px;
  padding: 20px 0px;
  color: #1a1a1a;
  font-family: Nunito;
  font-size: 48px;
  font-style: normal;
  font-weight: 400;
  line-height: 100px;
  letter-spacing: 10px;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  gap: 5px;
  animation-name: ${anim};
  animation-duration: 0.3s;
`
const PiVals = styled.div`
  display: flex;
  justify-content: flex-end;
`
const Hil = styled.div`
  border-radius: 10px;
  background: #fff6db;
  padding-left: 10px;
  margin: 0 5px;
  color: #f57a7a;
  width: 160px;
`
const LeftConfetti = styled.img`
  top: 0;
  position: absolute;
  left: 0;
`

const RightConfetti = styled.img`
  top: 0;
  position: absolute;
  right: 0;
`

const PiImg = styled.img`
  top: 106px;
  position: absolute;
  left: 50%;
  translate: -50%;
`
const HelperText = styled.div`
  display: flex;
  width: 680px;
  height: 60px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  position: absolute;
  left: 50%;
  translate: -50%;
  top: 640px;
  color: #444;
  text-align: center;
  font-family: Nunito;
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: 28px;
  span {
    border-radius: 5px;
    background: #fff2e5;
    padding: 0 5px;
    margin: 0 5px;
    color: #ff8f1f;
  }
`
const SelectContainer = styled.div`
  display: flex;
  width: 680px;
  height: 60px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  position: absolute;
  left: 50%;
  translate: -50%;
  top: 640px;
  gap: 14px;
  label {
    color: #212121;
    text-align: right;
    font-family: Nunito;
    font-size: 20px;
    font-style: normal;
    font-weight: 700;
    line-height: 28px;
  }
`
const DatePicker = styled.div`
  display: flex;
  width: 158px;
  height: 60px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border-radius: 12px;
  border: 1px solid #1a1a1a;
  background: #fff;
  cursor: pointer;
  img {
    margin: 0 5px;
  }
`
const DateDisplay = styled.div`
  width: 66px;
  height: 28px;
  color: #1a1a1a;
  text-align: center;
  font-family: Nunito;
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: 28px;
  margin: 0 24px;
`
const HandPlayer = styled(Player)`
  position: absolute;
  left: 400px;
  top: 620px;
  pointer-events: none;
`
export const AppletG08NSC01S1GB01: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const [pageNum, setPageNum] = useState(0)
  const [bday, setBday] = useState('')
  const [fPi, setFPi] = useState('')
  const [sPi, setSPi] = useState('')
  const [position, setPosition] = useState(-1)
  const [showCalendar, setShowCalendar] = useState(false)
  const [showHandPointer, setShowHandPointer] = useState(true)
  const playClick = useSFX('mouseClick')
  const onInteraction = useContext(AnalyticsContext)
  const date = new Date()
  const onNextHandle = () => {
    playClick()
    if (pageNum == 0) {
      if (bday == '314') {
        setFPi('')
        setBday('3.14')
        setSPi('1592653589...')
        setPosition(1)
      } else if (bday == '926') {
        setFPi('3.1415')
        setBday('926')
        setSPi('5358...')
        setPosition(6)
      } else {
        const splitPi = pi.match(bday)
        if (splitPi !== null && splitPi.index !== undefined) {
          setFPi(pi.slice(0, splitPi.index))
          setSPi(pi.slice(splitPi.index + 4, splitPi.index + 5) + '...')
          setPosition(splitPi.index)
        }
      }
      setPageNum(1)
      onInteraction('next')
    } else {
      setPageNum(0)
      setBday('')
      setFPi('')
      setSPi('')
      setPosition(-1)
      onInteraction('reset')
      setShowHandPointer(true)
    }
  }

  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#F6F6F6',
        id: 'g08-nsc01-s1-gb01',
        onEvent,
        className,
      }}
    >
      <TextHeader
        text="Discover the position of your birthday
        within the digits of Pi."
        backgroundColor="#F6F6F6"
        buttonColor="#1A1A1A"
      />
      <BGContainer>
        <LeftConfetti src={confettiL} />
        <RightConfetti src={confettiR} />
        <PiImg src={piImg} />
        {pageNum == 0 ? (
          <Pi>{pi}</Pi>
        ) : (
          <Pi1>
            <PiVals>{fPi}</PiVals>
            <Hil>{bday}</Hil>
            <div>{sPi}</div>
          </Pi1>
        )}
      </BGContainer>
      {pageNum == 0 && (
        <SelectContainer>
          <label>When is your birthday?</label>
          <DatePicker
            onClick={() => {
              onInteraction('tap')
              playClick()
              setShowCalendar((s) => !s)
              setShowHandPointer(false)
            }}
          >
            <DateDisplay>
              {showHandPointer
                ? ''
                : bday !== '' && (
                    <>
                      {(bday.length == 3 ? bday.slice(0, 1) : bday.slice(0, 2)) +
                        ' / ' +
                        bday.slice(-2)}
                    </>
                  )}
            </DateDisplay>
            <img src={iconCal} />
          </DatePicker>
        </SelectContainer>
      )}
      {showHandPointer && <HandPlayer src={click} autoplay loop />}
      {pageNum == 0 && (
        <Calendar
          left={345}
          top={338}
          date={date}
          onChange={(sel: string) => {
            if (sel[0] == '0') setBday(sel.slice(1))
            else setBday(sel)
          }}
          visible={showCalendar}
        />
      )}
      {pageNum == 1 && (
        <HelperText>
          Your birthday{' '}
          {(bday.length == 3 ? bday.slice(0, 1) : bday == '3.14' ? '3' : bday.slice(0, 2)) +
            ' / ' +
            bday.slice(-2)}{' '}
          is at position <span>{position}</span> in Pi.
        </HelperText>
      )}
      <ButtonElement
        themeName={pageNum == 0 ? 'black' : 'white'}
        onClick={onNextHandle}
        disabled={showHandPointer ? true : showCalendar ? true : false}
      >
        {pageNum == 0 && 'Submit'}
        {pageNum == 1 && <img src={reset} />}
      </ButtonElement>
    </AppletContainer>
  )
}

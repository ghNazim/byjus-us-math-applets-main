import { Player } from '@lottiefiles/react-lottie-player'
import { FC, useEffect, useState } from 'react'
import styled, { keyframes } from 'styled-components'

import { click } from '@/assets/onboarding'
import { AppletContainer } from '@/common/AppletContainer'
import { TextHeader } from '@/common/Header'
import { AppletInteractionCallback } from '@/contexts/analytics'
import { useSFX } from '@/hooks/useSFX'

import activeClicker from './assets/clickerActive.svg'
import inactiveClicker from './assets/clickerInactive.svg'
import graphaxis from './assets/graphaxis.svg'
import nextButtonActive from './assets/nextButton.svg'
import nextButtonInactive from './assets/nextButtonInactive.svg'
import resetButtonActive from './assets/resetButton.svg'
import table from './assets/table.svg'
import timetip from './assets/timetip.svg'
const HandPlayer = styled(Player)<{ frame: number }>`
  position: absolute;
  left: ${(p) => (p.frame == 1 ? 360 : 480)}px;
  bottom: 10px;
  pointer-events: none;
  z-index: 1;
`
const Text = styled.div`
  position: absolute;
  left: 50%;
  translate: -50%;
  width: 97%;
  color: #444;
  font-size: 20px;
  font-weight: 700;
  text-align: center;
  top: 20px;
  padding: 0px;
  font-family: Nunito;
`
const BottomText = styled(Text)`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 640px;
`
const HolderDiv = styled.div`
  position: absolute;
  top: 100px;
  left: 20px;
  background-color: #f3f7fe;
  width: 680px;
  height: 520px;
  border-radius: 5px;
`
const CenterdImage = styled.img<{ top: number }>`
  position: absolute;
  left: 50%;
  translate: -50%;
  top: ${(p) => p.top}px;
  z-index: 1;
`
const ClickMeButton = styled(CenterdImage)`
  cursor: pointer;
  &:active {
    transform: translateY(2px);
  }
`

const CTAButton = styled.img<{active?:boolean}>`
  position: absolute;
  left: 50%;
  translate: -50%;
  bottom: 10px;
  cursor: ${p=>p.active?'pointer':'default'};
`
const TimeBar = styled.div`
  position: absolute;
  top: 165px;
  left: 190px;
  width: 300px;
  height: 27px;
  border-radius: 63px;
  background-color: #ffecf1;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25) inset;
  z-index: 1;
`
const progress = keyframes`
  0%{width:300px}
  100%{width:0px}
`
const timeSlide = keyframes`
  0%{left:460px}
  100%{left:170px}
`
const Bar = styled.div<{ left: number; height: number; color: string; bg: string }>`
  position: absolute;
  bottom: 132px;
  left: ${(p) => p.left}px;
  width: 68px;
  height: ${(p) => p.height}px;
  background-color: ${(p) => p.bg};
  border: 2px solid ${(p) => p.color};
  color: ${(p) => p.color};
`
const Bartext = styled.div`
  font-size: 20px;
  height: 28px;
  font-family: 'nunito';
  position: absolute;
  top: -28px;
  padding: 0px 5px;
  border: inherit;
  color: inherit;
  font-weight: 700;
  background-color: inherit;
  border-radius: 5px;
  translate: -15%;
`
const CurrentTime = styled.div<{ state: boolean; frame: number }>`
  position: absolute;
  top: 165px;
  left: 190px;
  width: 300px;
  height: 27px;
  border-radius: 63px;
  background-color: #ed6b90;
  opacity: ${(p) => (p.frame == 3 || p.frame == 6 ? 100 : 40)}%;
  z-index: 2;
  animation: ${progress} ${(p) => p.frame}s linear 1 forwards;
  animation-play-state: ${(p) => (p.state ? 'play' : 'paused')};
`
const InputBox = styled.input<{ wrong: boolean }>`
  width: 100px;
  height: 60px;
  border-radius: 12px;
  padding: 4px;
  border: 1px solid ${(p) => (p.wrong ? '#CC6666' : '#c7c7c7')};
  font-size: 24px;
  text-align: center;
  color: #212121;
  background-color: ${(p) => (p.wrong ? '#FFF2F2' : 'white')};
  box-shadow: ${(p) => (p.wrong ? 'none' : '0px -4px 0px 0px #c7c7c7 inset')};
  &:focus {
    box-shadow: none;
    outline-color: #444;
  }
`
const TableData = styled.div<{ top: number; left: number }>`
  position: absolute;
  color: #1a1a1a;
  width: 62px;
  font-size: 20px;
  font-weight: 500;
  text-align: center;
  top: ${(p) => p.top}px;
  left: ${(p) => p.left}px;
  padding: 0px;
  font-family: Nunito;
  z-index: 2;
`

const Timedata = styled.div<{ state: boolean; frame: number }>`
  position: absolute;
  top: 110px;
  left: 465px;
  font-size: 16px;
  line-height: 44px;
  text-align: center;
  width: 97px;
  height: 44px;
  animation: ${timeSlide} ${(p) => (p.frame < 4 ? 3 : 6)}s linear 1 forwards;
  animation-play-state: ${(p) => (p.state ? 'play' : 'paused')};
`
const TimeTip = styled.img<{ state: boolean; frame: number }>`
  position: absolute;
  left: 460px;
  top: 110px;
  animation: ${timeSlide} ${(p) => (p.frame < 4 ? 3 : 6)}s linear 1 forwards;
  animation-play-state: ${(p) => (p.state ? 'play' : 'paused')};
`
const Tooltip = (props: {
  message: string
  width: number
  location: number
  top: number
  right: number
}) => {
  const Box = styled.div`
    position: absolute;
    top: ${props.top}px;
    right: ${props.right}px;
    width: ${props.width}px;
    background-color: white;
    border: 1px solid #777;
    border-radius: 10px;
    font-family: Nunito;
    font-size: 16px;
    padding: 10px;
    .triangle {
      position: absolute;
      left: ${props.location}%;
      top: -7px;
    }
    .circle {
      position: absolute;
      right: 0px;
      bottom: 0px;
      translate: 30% 30%;
    }
  `
  return (
    <>
      <Box>
        {props.message}
        <svg
          className="triangle"
          width="28"
          height="8"
          viewBox="0 0 28 8"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="20" y="7" width="1" height="12" transform="rotate(90 20 7)" fill="white" />
          <path
            d="M8.25285 6.66515C7.96279 6.9868 8.19105 7.5 8.62417 7.5L19.4287 7.5C19.8533 7.5 20.0846 7.00428 19.8119 6.67887L14.6667 0.538462L14.6078 0.467183C14.4078 0.224893 14.0366 0.224893 13.8366 0.467183L13.7778 0.538462L8.25285 6.66515Z"
            fill="white"
          />
          <path
            d="M8 7L13.5368 0.867016C13.9481 0.411469 14.6688 0.430445 15.0556 0.907L20 7"
            stroke="#1A1A1A"
            stroke-width="0.5"
            stroke-linecap="square"
          />
        </svg>
        <svg
          className="circle"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="12" cy="12" r="11.5" fill="white" stroke="#1A1A1A" />
          <path
            d="M12.0156 13.752C11.813 13.752 11.653 13.688 11.5356 13.56C11.429 13.432 11.365 13.2507 11.3436 13.016L10.8636 6.904C10.8316 6.50933 10.917 6.19467 11.1196 5.96C11.3223 5.71467 11.621 5.592 12.0156 5.592C12.3996 5.592 12.6876 5.71467 12.8796 5.96C13.0823 6.19467 13.1676 6.50933 13.1356 6.904L12.6556 13.016C12.645 13.2507 12.581 13.432 12.4636 13.56C12.357 13.688 12.2076 13.752 12.0156 13.752ZM12.0156 17.08C11.653 17.08 11.3596 16.968 11.1356 16.744C10.9223 16.52 10.8156 16.232 10.8156 15.88C10.8156 15.5387 10.9223 15.2613 11.1356 15.048C11.3596 14.824 11.653 14.712 12.0156 14.712C12.389 14.712 12.677 14.824 12.8796 15.048C13.093 15.2613 13.1996 15.5387 13.1996 15.88C13.1996 16.232 13.093 16.52 12.8796 16.744C12.677 16.968 12.389 17.08 12.0156 17.08Z"
            fill="#1A1A1A"
          />
        </svg>
      </Box>
    </>
  )
}
export const AppletG06RPC03S1GB02: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const [frame, setFrame] = useState(1)
  const [button, setButton] = useState(0)
  const [clickState, setClickState] = useState(true)
  const [isRunning, setIsRunning] = useState(false)
  const [guess1value, setGuess1Value] = useState('')
  const [guess2value, setGuess2Value] = useState('')
  const [numberOfClicks3, setNumberOfClicks3] = useState(0)
  const [numberOfClicks6, setNumberOfClicks6] = useState(0)
  const [isWrong, setIsWrong] = useState(false)
  const [time, setTime] = useState(3)
  const [nudgeOn, setNudgeOn] = useState(true)
  const guess2 = Number(guess2value)

  const playMouseCLick = useSFX('mouseClick')

  useEffect(() => {
    if ((frame < 2 && guess1value != '') || (frame > 2 && guess2value != '')) setButton(1)
    else setButton(0)
  }, [guess1value, guess2value])

  const runResetClick = () => {
    playMouseCLick()
    setFrame(1)
    setButton(0)
    setClickState(true)
    setIsRunning(false)
    setGuess1Value('')
    setGuess2Value('')
    setNumberOfClicks3(0)
    setNumberOfClicks6(0)
    setIsWrong(false)
    setTime(3)
    setNudgeOn(true)
  }
  const runNextClick = () => {
    playMouseCLick()
    switch (frame) {
      case 1:
        setFrame((c) => c + 1)
        setNudgeOn(true)
        break
      case 2:
        setButton(0)
        setFrame((c) => c + 1)
        break
      case 3:
        setButton(0)
        setFrame((c) => c + 1)
        break
      case 4:
        setClickState(true)
        setIsRunning(false)
        setTime(6)
        if (2 * numberOfClicks3 - 10 <= guess2 && guess2 <= 2 * numberOfClicks3 + 10) {
          setFrame((c) => c + 1)
        } else {
          setIsWrong(true)
          setButton(0)
        }

        break
      case 5:
        setFrame((c) => c + 1)
        setButton(0)
        break
      case 6:
        setFrame((c) => c + 1)
        setButton(2)
        break
    }
  }
  const clickHandle = () => {
    switch (frame) {
      case 3:
        if (numberOfClicks3 == 0) {
          setIsRunning(true)
          const countdown = setInterval(() => {
            setTime((t) => t - 0.1)
          }, 100)
          setTimeout(() => {
            clearInterval(countdown)
            setClickState(false)
            setButton(1)
          }, 3000)
        }

        setNumberOfClicks3((c) => c + 1)
        break
      case 6:
        if (numberOfClicks6 == 0) {
          setIsRunning(true)
          const countdown = setInterval(() => {
            setTime((t) => t - 0.1)
          }, 100)
          setTimeout(() => {
            clearInterval(countdown)
            setClickState(false)

            setButton(1)
          }, 6000)
        }
        setNumberOfClicks6((c) => c + 1)
        break
    }
  }
  const dataArr=[+guess1value,+guess2value,+numberOfClicks6]
  const maxData=Math.max(...dataArr,100)
  const clockTime=Math.round(time * 10) / 10
  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#444',
        id: 'test-clicker',
        onEvent,
        className,
      }}
    >
      <TextHeader
        text="Building intuition for unit rates"
        backgroundColor="#F6F6F6"
        buttonColor="#1A1A1A"
      />
      <HolderDiv>
        {frame == 1 && (
          <Text>
            Given below is a button.
            <br />
            <br /> How many times do you think you will be able to <br/>click the button in 6 seconds?
          </Text>
        )}
        {(frame == 2 || frame == 5) && (
          <Text>
            {frame == 2 ? 'First' : ''} {frame == 2 ? 'l' : 'L'}et&apos;s see how many times<br/> you can
            click the button in {frame + 1} seconds.
          </Text>
        )}
        {(frame == 3 || frame == 6) && (
          <Text>
            Click the button as many times as possible in {frame} seconds. <br />
            Timer will start once you start clicking the button.
          </Text>
        )}
        {frame == 4 && (
          <Text>
            You clicked the button {numberOfClicks3} times in 3 seconds. <br />
            <br />
            Based on this information,<br/> enter your revised estimate for 6 seconds.
          </Text>
        )}
        {(frame == 1 ||
          frame == 2 ||
          frame == 5 ||
          (frame == 3 && !clickState) ||
          (frame == 6 && !clickState)) && <CenterdImage top={251} src={inactiveClicker} />}
        {(frame == 3 || frame == 6) && clickState && (
          <ClickMeButton top={251} src={activeClicker} onClick={clickHandle} />
        )}
        {frame == 4 && <CenterdImage top={209} src={table} />}

        {(frame == 3 || frame == 6) && <TimeBar></TimeBar>}
        {(frame == 2 || frame == 3 || frame == 5 || frame == 6) && (
          <CurrentTime state={isRunning} frame={frame} />
        )}
        {(frame == 2 || frame == 3 || frame == 5 || frame == 6) && (
          <>
            <TimeTip frame={frame} state={isRunning} src={timetip} />
            <Timedata frame={frame} state={isRunning}>
              {clockTime} second{clockTime==0||clockTime==1?"":"s"}
            </Timedata>
          </>
        )}
        {frame == 4 && (
          <TableData top={268} left={412}>
            {numberOfClicks3}
          </TableData>
        )}
        {frame==7 && <>
          <CenterdImage top={0} src={graphaxis} />
          <Bar left={169} height={300*dataArr[0]/maxData} color="#AA5EE0" bg="#F4E5FF">
            <Bartext>{guess1value}&nbsp;clicks</Bartext>
          </Bar>
          <Bar left={341} height={300*dataArr[1]/maxData} color="#6595DE" bg="#E8F0FE">
            <Bartext>{guess2value}&nbsp;clicks</Bartext>
          </Bar>
          <Bar left={507} height={300*dataArr[2]/maxData} color="#6595DE" bg="#E8F0FE">
            <Bartext>{numberOfClicks6}&nbsp;clicks</Bartext>
          </Bar>
        </>}
      </HolderDiv>
      {frame == 7 && (
        <BottomText>Well done! We can use ratios to make better estimates.</BottomText>
      )}
      {button == 1 && <CTAButton active src={nextButtonActive} onClick={runNextClick} />}
      {button == 0 && <CTAButton src={nextButtonInactive} />}
      {button == 2 && <CTAButton active src={resetButtonActive} onClick={runResetClick} />}
      {frame == 1 && (
        <BottomText>
          <p>Your estimate:&nbsp;&nbsp;</p>
          <InputBox
            type="text"
            maxLength={3}
            wrong={isWrong}
            value={guess1value}
            onClick={() => setNudgeOn(false)}
            onChange={(e) => {
              setGuess1Value(() => e.target.value.replace(/[^0-9]/g, ''))
            }}
          />
        </BottomText>
      )}
      {frame == 4 && (
        <BottomText>
          <p>Old estimate:&nbsp;&nbsp;</p>
          <InputBox type="text" wrong={false} disabled value={guess1value} />
          &nbsp;&nbsp;
          <p>New estimate:&nbsp;&nbsp;</p>
          <InputBox
            type="text"
            maxLength={3}
            wrong={isWrong}
            value={guess2value}
            onClick={() => setNudgeOn(false)}
            onChange={(e) => {
              setGuess2Value(() => e.target.value.replace(/[^0-9]/g, ''))
              setIsWrong(false)
            }}
          />
        </BottomText>
      )}
      {isWrong && (
        <Tooltip
          width={250}
          location={50}
          top={710}
          right={40}
          message="In double the time, the number of clicks will also double."
        ></Tooltip>
      )}
      {(frame == 1 || frame == 4) && nudgeOn && (
        <HandPlayer src={click} frame={frame} autoplay loop />
      )}
    </AppletContainer>
  )
}

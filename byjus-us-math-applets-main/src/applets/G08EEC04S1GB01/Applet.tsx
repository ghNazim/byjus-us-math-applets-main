import { Player } from '@lottiefiles/react-lottie-player'
import { FC, useContext, useEffect, useState } from 'react'
import styled from 'styled-components'

import { AppletContainer } from '@/common/AppletContainer'
import tap from '@/common/handAnimations/click.json'
import { TextHeader } from '@/common/Header'
import { AnalyticsContext, AppletInteractionCallback } from '@/contexts/analytics'
import { useSFX } from '@/hooks/useSFX'

import calc from './Assets/calc.svg'
import generate1 from './Assets/generate.svg'
import reset from './Assets/reset.svg'
import trynew from './Assets/trynew.svg'
import Feedback from './Feedback'

const Display = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0px;
  gap: 20px;
  position: absolute;
  left: 20px;
  top: 100px;
  width: 680px;
  height: 360px;

  /* Secondary/French sky blue/400 */

  background: #f3f7fe;
`
const NumberBox = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 10px 20px;
  gap: 10px;

  position: absolute;
  right: 370px;
  top: 220px;
  width: auto;
  min-width: 140px;
  height: 80px;

  background: #e8f0fe;
  border: 1px solid #6595de;
  border-radius: 10px;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 400;
  font-size: 48px;
  line-height: 60px;

  display: flex;
  align-items: center;
  text-align: right;
  color: #6595de;

  font-family: 'Nunito';
  font-style: normal;
  font-weight: 400;
  font-size: 48px;
  line-height: 60px;

  display: flex;
  align-items: center;
  text-align: right;
  color: #6595de;
`
const Text = styled.div<{ left: number; top: number }>`
  position: absolute;
  left: ${(props) => props.left}px;
  top: ${(props) => props.top}px;
`
const ButtonContainer = styled.button`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
  width: 328px;
  height: 90px;
  position: absolute;
  left: 50%;
  translate: -50%;
  bottom: 90px;
  border: 1px solid #1a1a1a;
  border-radius: 12px;
  background: none;
  div {
    position: absolute;
    left: 50%;
    translate: -50%;
    top: -12px;
    width: 168px;
    height: 24px;
    font-family: 'Nunito';
    font-style: normal;
    font-weight: 700;
    font-size: 16px;
    line-height: 24px;
    display: flex;
    align-items: center;
    text-align: center;
    justify-content: center;
    color: #1a1a1a;
    background: #ffffff;
  }
  :disabled {
    opacity: 0.3;
  }
`
const Button = styled.button`
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 140px;
  height: 60px;
  background: #ffffff;
  border: 1px solid #d9cdff;
  box-shadow: inset 0px -4px 0px #c7c7c7;
  border-radius: 12px;
  transition: all 0.3s;
  :hover {
    scale: 1.05;
  }
`
const Playercontainer = styled(Player)`
  position: absolute;
  left: 212px;
  bottom: 26px;
  pointer-events: none;
`
const numbers = ['240.8', '0.00006', '390 x 10', '6000000', '0.000807']
const sup = ['', '', '-3', '', '']
const page1Text = [
  'Generate exponential form.',
  'Convert the given number in an exponential form.',
  'Convert the given number in an exponential form.',
  'Convert the given number in an exponential form.',
  'Convert the given number in an exponential form.',
]
const propmtText = [
  'Convert to scientific notation, following the provided conditions.',
  'Aim to fulfill both conditions.',
  'Well done! Now let’s try a new number.',
]
// const boxnumbers = [240.8, 0.00006, 390, 6000000, 0.000807]
const powers = [0, 0, -3, 0, 0]
const correctMultipliersa = [2, -5, -1, 6, -4]
const leftHighest = [-2, -5, -3, -1, -4]
const rightHighest = [3, 1, 3, 7, 0]
export const AppletG08EEC04S1GB01: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const [index, setIndex] = useState(0)
  const [generate, setGenerate] = useState(0)
  const [multiplier, setMultiplier] = useState(0)
  const [boxnumbers, setBoxnumbers] = useState([240.8, 0.00006, 390, 6000000, 0.000807])
  const [show, setShow] = useState(true)
  const [showOnBoarding, setShowOnBoarding] = useState(false)
  const onInteraction = useContext(AnalyticsContext)
  const click = useSFX('mouseClick')

  useEffect(() => {
    setMultiplier(powers[index])
  }, [index])

  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#F6F6F6',
        id: 'g08-eec04-s1-gb01',
        onEvent,
        className,
      }}
    >
      <TextHeader
        text="Convert the given number into scientific notation."
        backgroundColor="#F6F6F6"
        buttonColor="#1A1A1A"
      />
      <Display>
        {generate === 0 && (
          <>
            <div
              style={{
                fontFamily: 'Nunito',
                fontWeight: '700',
                fontSize: '24px',
                lineHeight: '32px',
                color: '#444444',
              }}
            >
              Given:
            </div>
            <div
              style={{
                fontFamily: 'Nunito',
                fontWeight: '400',
                fontSize: '40px',
                lineHeight: '48px',
                color: '#6595DE',
              }}
            >
              {numbers[index]}
              <sup>{sup[index]}</sup>
            </div>
          </>
        )}
        {generate === 1 && (
          <>
            <img src={calc} />
            <NumberBox>
              {index == 1 || index == 2 || index === 4
                ? boxnumbers[index].toPrecision(8).toString().split('').splice(0, 8).join('')
                : boxnumbers[index].toPrecision(8)}
            </NumberBox>
            <div
              style={{
                position: 'absolute',
                left: '425px',
                top: '195px',
                fontFamily: 'Nunito',
                fontWeight: '400',
                fontSize: '28px',
                color: '#ffffff',
                height: '40px',
                width: '40px',
                textAlign: 'center',
              }}
            >
              {multiplier
                .toString()
                .split('')
                .reduce((prv, a, i) => (i < 9 ? a + prv : prv))
                .split('')
                .reverse()
                .join('')}
            </div>

            <div
              style={{
                position: 'absolute',
                top: '50px',
                left: '280px',
                fontFamily: 'Nunito',
                fontWeight: '400',
                fontSize: '30px',
                lineHeight: '48px',
                color: '#6595DE',
              }}
            >
              {numbers[index]}
              <sup>{sup[index]}</sup>
            </div>
          </>
        )}
      </Display>
      {generate === 0 && (
        <>
          <img
            src={generate1}
            style={{ position: 'absolute', left: '250px', bottom: '20px' }}
            onClick={() => {
              setGenerate(1)
              onInteraction('tap')
              click()
              setShowOnBoarding(true)
            }}
          />
          <div
            style={{
              fontFamily: 'Nunito',
              fontWeight: '700',
              fontSize: '20px',
              position: 'absolute',
              textAlign: 'center',
              bottom: '250px',
              width: '100%',
            }}
          >
            {page1Text[index]}
          </div>
        </>
      )}
      {generate === 1 && (
        <>
          <Feedback
            text={
              show == true
                ? propmtText[0]
                : multiplier === correctMultipliersa[index]
                ? propmtText[2]
                : propmtText[1]
            }
            status={show === true ? 0 : multiplier == correctMultipliersa[index] ? 3 : 2}
          />
          <ButtonContainer disabled={false}>
            <div>Move Decimal Point</div>
            <Button
              disabled={multiplier === rightHighest[index]}
              onClick={() => {
                if (multiplier < rightHighest[index]) {
                  setBoxnumbers((b) => {
                    const d = [...b]
                    d[index] = d[index] / 10
                    return d
                  })
                  setMultiplier((v) => v + 1)
                  setShow(false)
                  onInteraction('tap')
                  click()
                  setShowOnBoarding(false)
                }
              }}
            >
              Left
            </Button>
            <Button
              disabled={multiplier === leftHighest[index]}
              onClick={() => {
                if (multiplier > leftHighest[index]) {
                  setBoxnumbers((b) => {
                    const d = [...b]
                    d[index] = d[index] * 10
                    return d
                  })
                  setMultiplier((v) => v - 1)
                  setShow(false)
                  onInteraction('tap')
                  click()
                  setShowOnBoarding(false)
                }
              }}
            >
              Right
            </Button>
          </ButtonContainer>
          {show === false && multiplier == correctMultipliersa[index] && index !== 4 && (
            <img
              src={trynew}
              style={{ position: 'absolute', left: '270px', bottom: '20px' }}
              onClick={() => {
                setIndex((i) => (i === 4 ? 0 : i + 1))
                setMultiplier(0)
                setShow(true)
                onInteraction('tap')
                click()
              }}
            />
          )}
          {show === false && multiplier == correctMultipliersa[index] && index === 4 && (
            <img
              src={reset}
              style={{ position: 'absolute', left: '270px', bottom: '20px' }}
              onClick={() => {
                setIndex(0)
                setMultiplier(0)
                setShow(true)
                setGenerate(0)
                setShow(true)
                onInteraction('tap')
                click()
                setBoxnumbers([240.8, 0.00006, 390, 6000000, 0.000807])
              }}
            />
          )}
        </>
      )}
      {showOnBoarding && <Playercontainer src={tap} autoplay loop />}
    </AppletContainer>
  )
}

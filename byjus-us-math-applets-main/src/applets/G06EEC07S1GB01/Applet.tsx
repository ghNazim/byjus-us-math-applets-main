import { Player } from '@lottiefiles/react-lottie-player'
import { FC, useContext, useState } from 'react'
import styled from 'styled-components'

import { AppletContainer } from '@/common/AppletContainer'
import { Button } from '@/common/Button'
import { TextHeader } from '@/common/Header'
import { AnalyticsContext, AppletInteractionCallback } from '@/contexts/analytics'
import { useSFX } from '@/hooks/useSFX'

import ClickAnimation from '../../common/handAnimations/click.json'

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 16px 24px;
  gap: 12px;

  width: 279px;
  height: 60px;

  background: #1a1a1a;
  color: #ffffff;
  border-radius: 10px;

  flex: none;
  order: 0;
  flex-grow: 0;

  position: absolute;
  bottom: 20px;
  left: 225px;

  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 24px;
  line-height: 32px;

  cursor: pointer;

  transition: all.3s;
  :hover {
    scale: 1.05;
  }
`

const BoxContainer = styled.div<{ correct?: boolean }>`
  position: absolute;
  width: 680px;
  height: 200px;
  left: 20px;
  top: 142px;

  background: ${(props) => (props.correct ? '#DDFAC8' : 'rgba(250, 242, 255, 0.4)')};
  border-radius: 12px;
`
const DashedBox = styled.div<{ correct?: boolean }>`
  width: 60px;
  height: 40px;

  display: flex;
  justify-content: center;
  align-items: center;
  background: ${(props) => (props.correct ? '#ECFFD9' : '#ffe9d4')};
  color: ${(props) => (props.correct ? '#6CA621' : '#ff8f1f')};

  font-size: 20px;

  border: 1.5px dashed ${(props) => (props.correct ? '#6CA621' : '#ff8f1f')};
  border-radius: 4px;
`
const TextContainer = styled.div<{ left: number; top: number; fontsize?: number }>`
  position: absolute;
  left: 50%;
  top: ${(props) => props.top}px;
  translate: -50%;

  width: 700px;
  height: 32px;

  font-family: 'Nunito';
  font-style: normal;
  font-weight: 400;
  font-size: ${(props) => props.fontsize ?? 24}px;
  line-height: 32px;

  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #444444;
`
const SignContainer = styled.div`
  display: flex;
  gap: 20px;

  flex-direction: row;
  align-items: flex-start;
  position: absolute;
  bottom: 120px;
  left: 160px;
`
const Sign = styled.div<{ status: -1 | 0 | 1 }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 4px;

  width: 89px;
  height: 60px;

  background: #ffffff;

  border: 1px solid #c7c7c7;
  box-shadow: inset 0px -4px 0px #c7c7c7;
  border-radius: 12px;

  font-family: 'Nunito';
  font-style: normal;
  font-weight: 500;
  font-size: 24px;
  line-height: 28px;

  cursor: pointer;

  transition: all.3s;
  :hover {
    scale: 1.05;
  }

  ${(props) =>
    props.status === 1 &&
    `
    padding: 12px 20px;
    box-shadow: inset 0px 0px 0px #c7c7c7;
    background: #ecffd9;
  `}

  ${(props) =>
    props.status === -1 &&
    `
    padding: 12px 20px;
    box-shadow: inset 0px 0px 0px #c7c7c7;
    background: #fff2f2;
  `}
`
const InlineSpan = styled.span<{ color: string; p?: number }>`
  color: ${(props) => props.color};
  padding: ${(props) => props.p ?? 3}px;
`
const HandAnimation = styled(Player)`
  position: absolute;
  left: 290px;
  bottom: -30px;
`
const toggleOptions = ['≤', '<', '>', '≥']

const statement1 = [
  ['Steve has', 'no more than', '5', 'story books.'],
  ['The money that', 'Will can spend', 'is not below ', '$14.'],
  ['Mike will take', ' at least', ' 2 hours', ' to complete the assignment.'],
  ['Dustin can complete', ' upto', ' 4 rounds', ' of the jogging track.'],
]
const statement1Color = [
  ['#1CB9D9', '#FF8F1F', '#ED6B90'],
  ['#444444', '#1CB9D9', '#FF8F1F', '#ED6B90'],
  ['#1CB9D9', '#FF8F1F', '#ED6B90', '#444444'],
  ['#1CB9D9', '#FF8F1F', '#ED6B90', '#444444'],
]
const statement2 = [
  'represent the number of books Steve has.',
  'represent the amount of money Will has.',
  'represent the time taken to complete the assignment.',
  'represent the number of rounds in jogging track.',
]
const money = ['5', '14', '2', '4']
const startindex = [1, 0, 1, 1]

const Answer = [0, 3, 3, 0]
export const AppletG06EEC07S1GB01: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const [step, setStep] = useState(0)
  const [tog, setTog] = useState(-1)
  const [index, setIndex] = useState(0)
  const [showOnboarding, setShowonboarding] = useState(true)
  const onInteraction = useContext(AnalyticsContext)
  const click = useSFX('mouseClick')

  const onClickGenerateExpression = () => {
    if (step === 0) setStep(1)
    setShowonboarding(false)
    onInteraction('tap')
    click()
    setTimeout(() => {
      setStep(2)
    }, 1000)
    setTimeout(() => {
      setStep(3)
    }, 2000)
  }
  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#f1edff',
        id: 'g06-eec07-s1-gb01',
        onEvent,
        className,
        themeName: 'dark',
      }}
    >
      {/* {showTryNew && <TryNewBtn type="tryNew" onClick={handleTryNew} />} */}
      <TextHeader
        text="Express the statement as an inequality."
        backgroundColor="#f1edff"
        buttonColor="#a285ff"
      />
      <TextContainer left={160} top={100}>
        {statement1.map((s, i) =>
          s.map(
            (a, j) =>
              i === index && (
                <InlineSpan
                  key={j}
                  color={step >= startindex[index] + j ? `${statement1Color[i][j]}` : '#444444'}
                >
                  {a}{' '}
                </InlineSpan>
              ),
          ),
        )}
      </TextContainer>
      {step >= 1 && (
        <BoxContainer correct={tog === Answer[index]}>
          <TextContainer left={82} top={32}>
            Let ‘
            <InlineSpan color={step >= 1 ? '#1CB9D9' : '#444444'} p={2}>
              x
            </InlineSpan>
            ’ {statement2[index]}
          </TextContainer>
          <div
            style={{
              display: 'flex',
              gap: '10px',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
              fontSize: '24px',
            }}
          >
            <div>
              <InlineSpan color="#1CB9D9">X</InlineSpan>
            </div>
            {step >= 2 && (
              <DashedBox correct={tog === Answer[index]}>
                <div>{toggleOptions[tog]}</div>
              </DashedBox>
            )}
            {step >= 3 && (
              <div>
                <InlineSpan color="#ED6B90">{money[index]}</InlineSpan>
              </div>
            )}
          </div>
        </BoxContainer>
      )}
      {step === 0 && (
        <ButtonContainer onClick={onClickGenerateExpression}>Generate Inequality</ButtonContainer>
      )}
      {tog !== Answer[index] && tog !== -1 && step === 3 && (
        <TextContainer top={370} left={150} fontsize={20}>
          Oops! Incorrect operator. Let’s give it another go!
        </TextContainer>
      )}
      {tog === Answer[index] && step === 3 && (
        <TextContainer top={370} left={120} fontsize={20}>
          Great job! Let’s try it with a different word problem now.
        </TextContainer>
      )}
      {step >= 2 && (
        <>
          {tog === -1 && (
            <TextContainer top={570} left={240} fontsize={20}>
              Select an inequality symbol{' '}
            </TextContainer>
          )}
          <SignContainer>
            {toggleOptions.map((t, i) => (
              <Sign
                key={i}
                status={tog === i ? (Answer[index] == i ? 1 : -1) : 0}
                onClick={() => {
                  setTog(i)
                  onInteraction('tap')
                  click()
                }}
              >
                {t}
              </Sign>
            ))}
          </SignContainer>
        </>
      )}
      {tog == Answer[index] && (
        <Button
          type={'tryNew'}
          onClick={() => {
            setIndex((i) => (i == 3 ? 0 : i + 1))
            setTog(-1)
            setStep(1)
            onClickGenerateExpression()
            onInteraction('tap')
            click()
          }}
          color="#1A1A1A"
        />
      )}
      {/* {showOnboarding && <HandAnimation src={ClickAnimation} autoplay loop />} */}
    </AppletContainer>
  )
}

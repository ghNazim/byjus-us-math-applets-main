import { Player } from '@lottiefiles/react-lottie-player'
import { FC, useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { click } from '@/assets/onboarding'
import { AppletContainer } from '@/common/AppletContainer'
import { Geogebra } from '@/common/Geogebra'
import { GeogebraAppApi } from '@/common/Geogebra/Geogebra.types'
import { TextHeader } from '@/common/Header'
import { AppletInteractionCallback } from '@/contexts/analytics'
import { useSFX } from '@/hooks/useSFX'

import reset from './assets/reset.svg'
import submit from './assets/submit.svg'
import submitInactive from './assets/submitInactive.svg'
import tryagain from './assets/tryagain.svg'

const GGBcontainer = styled(Geogebra)`
  top: 30px;
  position: absolute;
  left: 50%;
  translate: -50%;
  scale: 0.82;
`
const CTAButton = styled.img<{ active?: boolean }>`
  position: absolute;
  left: 50%;
  translate: -50%;
  bottom: 20px;
  cursor: ${(p) => (p.active ? 'pointer' : 'default')};
`
const NudgePlayer = styled(Player)`
  position: absolute;
  left: 335px;
  top: 580px;
  pointer-events: none;
`
const FeedbackTop = styled.div`
  position: absolute;
  top: 540px;
  text-align: center;
  width: 100%;
  font-size: 20px;
  font-weight: 700;
  font-family: 'Nunito';
  color: #444;
  translate: 0 -50%;
`
const FeedbackCenter = styled(FeedbackTop)`
  top: 600px;

`
const Span = styled.span<{ col: number }>`
  font-size: 20px;
  font-weight: 700px;
  font-family: 'Nunito';
  color: ${(p) => (p.col == 1 ? '#FF8F1F' : p.col == 2 ? '#2AD3F5' : '#428C94')};
`
const DivisionLine = styled.div`
  position: absolute;
  width: 60px;
  height: 1px;
  background-color: black;
  right: 0px;
  top: 50%;
  translate: 0 -50%;
`
const InputBox = styled.input`
  position: absolute;
  font-size: 20px;
  border: 1px solid black;
  width: 60px;
  height: 46px;
  border-radius: 12px;
  right: 0px;
  text-align: center;
  &.top {
    top: 0px;
  }
  &.bottom {
    bottom: 0px;
  }
  &:focus {
    outline: none;
  }
`
const Anstext = styled.div`
  position: absolute;
  padding: 5px;
  top: 50%;
  left: 5px;
  translate: 0 -50%;
  font-family: 'Nunito';
  font-size: 20px;
  font-weight: 700;
`
const AnsHolder = styled.div`
  position: absolute;
  top: 600px;
  left: 50%;
  translate: -50%;
  width: 160px;
  height: 100px;
`
export const AppletG07SPC05S1GB02: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const [ggbLoaded, setGGBLoaded] = useState(false)
  const ggbApi = useRef<GeogebraAppApi | null>(null)
  const onGGBLoaded = useCallback((api: GeogebraAppApi | null) => {
    ggbApi.current = api
    setGGBLoaded(api !== null)
  }, [])
  const ggb = ggbApi.current
  const playMouseClick = useSFX('mouseClick')
  const playCorrect = useSFX('correct')
  const playIncorrect = useSFX('incorrect')
  const [numerator, setNumerator] = useState('')
  const [denominator, setDenominator] = useState('')
  const [answerState, setAnswerState] = useState(0)
  const [nudgeOn, setNudgeOn] = useState(true)
  const [orange, setOrange] = useState(0)
  const [blue, setBlue] = useState(0)
  const [green, setGreen] = useState(0)
  const [qsncolor, setQsnColor] = useState(2)
  const total = orange + blue + green
  const ans = qsncolor == 1 ? orange / total : qsncolor == 2 ? blue / total : green / total
  useEffect(() => {
    if (numerator != '' && denominator != '') setAnswerState(1)
    else setAnswerState(0)
  }, [numerator, denominator])
  useEffect(() => {
    setOrange(ggb?.getValue('oc') || 0)
    setBlue(ggb?.getValue('bc') || 0)
    setGreen(ggb?.getValue('gc') || 0)
    setQsnColor(ggb?.getValue('color') || 0)
    ggbApi.current?.registerObjectUpdateListener('oc', () => {
      setOrange(ggb?.getValue('oc') || 0)
    })
    ggbApi.current?.registerObjectUpdateListener('bc', () => {
      setBlue(ggb?.getValue('bc') || 0)
    })
    ggbApi.current?.registerObjectUpdateListener('gc', () => {
      setGreen(ggb?.getValue('gc') || 0)
    })
    ggbApi.current?.registerObjectUpdateListener('color', () => {
      setQsnColor(ggb?.getValue('color') || 0)
    })
  }, [ggbLoaded])
  function runSubmit() {
    playMouseClick()
    ggb?.setTextValue('topans', numerator)
    ggb?.setTextValue('botans', denominator)
    ggb?.evalCommand('RunClickScript(submit)')
    if (Number(numerator) / Number(denominator) === ans) {
      setAnswerState(3)
      playCorrect()
    } else {
      setAnswerState(2)
      playIncorrect()
    }
  }
  function runTryNew() {
    playMouseClick()
    ggb?.evalCommand('RunClickScript(tryagain)')
    setNumerator('')
    setDenominator('')
  }
  function runReset() {
    playMouseClick()
    ggb?.evalCommand('RunClickScript(reset)')
    setNumerator('')
    setDenominator('')
  }
  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#444',
        id: 'g07-spc05-s1-gb02',
        onEvent,
        className,
        themeName: 'dark',
      }}
    >
      <TextHeader
        text="Learn how to apply the probability formula."
        backgroundColor="#F6F6F6"
        buttonColor="#1A1A1A"
      />
      <GGBcontainer materialId="eknm3ama" onApiReady={onGGBLoaded} width={867} height={517} />

      {ggbLoaded && answerState < 2 && (
        <FeedbackTop>
          What is the probability of drawing a{' '}
          <Span col={qsncolor}>
            {' '}
            {qsncolor == 1 ? 'orange' : qsncolor == 2 ? 'blue' : 'green'}{' '}
          </Span>{' '}
          marble?{' '}
        </FeedbackTop>
      )}
      {answerState == 2 && (
        <FeedbackTop>
          Oh! Seems like you have counted the marbles incorrectly,
          <br />
          Please try again!
        </FeedbackTop>
      )}
      {answerState == 3 && (
        <FeedbackCenter>
          Well done! You used the probability formula to determine
          <br />
          the number of {qsncolor == 1 ? 'orange' : qsncolor == 2 ? 'blue' : 'green'} marbles correctly!
        </FeedbackCenter>
      )}

      {ggbLoaded && answerState<3 &&
        <AnsHolder>
          <InputBox
            className="top"
            disabled={answerState >= 2}
            value={numerator}
            onClick={()=>setNudgeOn(false)}
            onChange={(e) => {
              setNumerator(() => e.target.value.replace(/[^0-9]/g, ''))
            }}
          />
          <InputBox
            className="bottom"
            disabled={answerState >= 2}
            value={denominator}
            onClick={()=>setNudgeOn(false)}
            onChange={(e) => {
              setDenominator(() => e.target.value.replace(/[^0-9]/g, ''))
            }}
          />
          <DivisionLine></DivisionLine>
          <Anstext>Answer: </Anstext>
        </AnsHolder>
      }
      {ggbLoaded && answerState == 0 && <CTAButton draggable={false} src={submitInactive} />}
      {answerState == 1 && <CTAButton active draggable={false} src={submit} onClick={runSubmit} />}
      {answerState == 2 && <CTAButton active draggable={false} src={reset} onClick={runReset} />}
      {answerState == 3 && (
        <CTAButton active draggable={false} src={tryagain} onClick={runTryNew} />
      )}
      {ggbLoaded && nudgeOn && <NudgePlayer src={click} autoplay loop/>}
    </AppletContainer>
  )
}

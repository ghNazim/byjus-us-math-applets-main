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
  left: 331px;
  top: 600px;
  pointer-events: none;
`
const FeedbackTop = styled.div<{top?:number}>`
  position: absolute;
  top: ${p=>p.top||520}px;
  text-align: center;
  width: 100%;
  font-size: 20px;
  font-weight: 700;
  font-family: 'Nunito';
  color: #444;
`
const Span = styled.span<{ col: number }>`
  font-size: 20px;
  font-weight: 700px;
  font-family: 'Nunito';
  color: ${(p) => (p.col == 1 ? '#FF8F1F' : p.col == 2 ? '#2AD3F5' : '#428C94')};
`
const InputBox = styled.input`
  position: relative;
  font-size: 20px;
  border: 1px solid black;
  width: 60px;
  height: 46px;
  border-radius: 12px;
  text-align: center;
  &:focus {
    outline: none;
  }
`
export const AppletG07SPC05S1GB03: FC<{
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
  const [answer,setAnswer]=useState('')
  const [answerState, setAnswerState] = useState(0)
  const [nudgeOn, setNudgeOn] = useState(true)
  const [orange, setOrange] = useState(0)
  const [blue, setBlue] = useState(0)
  const [green, setGreen] = useState(0)
  const [qsncolor, setQsnColor] = useState(1)
  const total = orange + blue + green
  const actualAns = qsncolor == 1 ? orange : qsncolor == 2 ? blue :green
  useEffect(() => {
    if (answer !='') setAnswerState(1)
    else setAnswerState(0)
  }, [answer])
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
    ggb?.setTextValue('txtans', answer)
    ggb?.evalCommand('RunClickScript(submit)')
    if (Number(answer) === actualAns) {
      setAnswerState(3)
      playCorrect()
    } else {
      setAnswerState(2)
      playIncorrect()
    }
  }
  function runTryNew() {
    playMouseClick()
    ggb?.evalCommand('RunClickScript(pic4)')
    setAnswer('')
  }
  function runReset() {
    playMouseClick()
    ggb?.evalCommand('RunClickScript(reset)')
    setAnswer('')
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
      <GGBcontainer materialId="nhunxdrx" onApiReady={onGGBLoaded} width={860} height={513} />

      {ggbLoaded && answerState < 2 && (
        <FeedbackTop>
          Based on the probabilities given,
          <br />
          what is the number of
          <Span col={qsncolor}>
            {' '}
            {qsncolor == 1 ? 'orange' : qsncolor == 2 ? 'blue' : 'green'}{' '}
          </Span>{' '}
          marbles?{' '}<br/>
        </FeedbackTop>
      )}
      {answerState == 2 && (
        <FeedbackTop>
          Oops! Total number of marbles = {qsncolor==1?answer:orange} + {qsncolor==2?answer:blue} + {qsncolor==3?answer:green} = {total-actualAns+Number(answer)} ≠ {total}
          <br />
          Try again!
        </FeedbackTop>
      )}
      {ggbLoaded && answerState<3 &&<FeedbackTop top={600}><br/>
          Answer: &nbsp;<InputBox
            disabled={answerState >= 2}
            value={answer}
            onClick={() => setNudgeOn(false)}
            onChange={(e) => {
              setAnswer(() => e.target.value.replace(/[^0-9]/g, ''))
            }}
          /></FeedbackTop>}
      {answerState == 3 && (
        <FeedbackTop top={570}>
          Well done! You used the probability formula to determine
          <br />
          the number of {qsncolor == 1 ? 'orange' : qsncolor == 2 ? 'blue' : 'green'} marbles
          correctly!
        </FeedbackTop>
      )}
      {ggbLoaded && answerState == 0 && <CTAButton draggable={false} src={submitInactive} />}
      {answerState == 1 && <CTAButton active draggable={false} src={submit} onClick={runSubmit} />}
      {answerState == 2 && <CTAButton active draggable={false} src={reset} onClick={runReset} />}
      {answerState == 3 && (
        <CTAButton active draggable={false} src={tryagain} onClick={runTryNew} />
      )}
      {ggbLoaded && nudgeOn && <NudgePlayer src={click} autoplay loop />}
    </AppletContainer>
  )
}

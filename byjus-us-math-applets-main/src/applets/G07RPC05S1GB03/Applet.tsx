import { Player } from '@lottiefiles/react-lottie-player'
import { FC, useCallback, useRef, useState } from 'react'
import styled from 'styled-components'

import { click } from '@/assets/onboarding'
import { AppletContainer } from '@/common/AppletContainer'
import { Geogebra } from '@/common/Geogebra'
import { GeogebraAppApi } from '@/common/Geogebra/Geogebra.types'
import { TextHeader } from '@/common/Header'
import { AppletInteractionCallback } from '@/contexts/analytics'

import reset from './assets/reset.svg'

const GGBcontainer = styled(Geogebra)`
  position: absolute;
  left: 50.5%;
  translate: -50%;
  top: 65px;
  scale: 0.93;
`
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
const Reset = styled.img`
  position: absolute;
  left: 50%;
  translate: -50%;
  bottom: 20px;
  cursor: pointer;
`

const InputBox1 = styled.input<{ correctness?: string }>`
  position: relative;
  font-size: 20px;
  color: ${(p) =>
    p.correctness == 'red' ? '#CC6666' : p.correctness == 'green' ? '#6CA621' : '#212121'};
  border: 1px solid
    ${(p) =>
      p.correctness == 'red' ? '#CC6666' : p.correctness == 'green' ? '#6CA621' : '#212121'};
  background: ${(p) =>
    p.correctness == 'red' ? '#FFF2F2' : p.correctness == 'green' ? '#ECFFD9' : '#F6F6F6'};
  width: 60px;
  height: 46px;
  border-radius: 12px;
  text-align: center;
  &:focus {
    outline: none;
  }
`
const FeedbackTop = styled.div`
  position: absolute;
  top: 530px;
  text-align: center;
  width: 100%;
  font-size: 20px;
  font-weight: 700;
  font-family: 'Nunito';
  color: #444;
`
const FeedbackCenter = styled(FeedbackTop)`
  top: 650px;
  translate: 0 -50%;
`
const NudgePlayer = styled(Player)`
  position: absolute;
  left: 268px;
  top: 382px;
  pointer-events: none;
`
export const AppletG07RPC05S1GB03: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const [ggbLoaded, setGGBLoaded] = useState(false)
  const ggbApi = useRef<GeogebraAppApi | null>(null)
  const [pageNum, setPageNum] = useState(0)
  const [stateOfCorrectness1, setStateOfCorrectness1] = useState('')
  const [inputEnabled, setInputEnabled] = useState(0)
  const [nextDisabled, setNextDisabled] = useState(false)
  const [answer, setAnswer] = useState('')
  const [nudge, setNudgeOn] = useState(true)
  const onGGBLoaded = useCallback(
    (api: GeogebraAppApi | null) => {
      ggbApi.current = api
      if (api == null) return
      setGGBLoaded(api !== null)

      ggbApi.current?.registerObjectUpdateListener('t', () => {
        setNudgeOn((ggbApi.current?.getValue('t') || 0) == 0)
        setInputEnabled(ggbApi.current?.getValue('t') || 0)
      })
      ggbApi.current?.registerObjectUpdateListener('boolB1', () => {
        setInputEnabled(ggbApi.current?.getValue('boolB1') || 0)
      })
      ggbApi.current?.registerObjectUpdateListener('boolC1', () => {
        setInputEnabled(ggbApi.current?.getValue('boolC1') || 0)
      })
    },
    [ggbApi],
  )

  const onNextHandle = () => {
    switch (pageNum) {
      case 0:
        if (stateOfCorrectness1 == 'green') {
          setAnswer('')
          setStateOfCorrectness1('')
          setPageNum(1)
          ggbApi.current?.evalCommand('RunClickScript(nxt1)')
          setNextDisabled(false)
          setInputEnabled(0)
          return
        }
        setNextDisabled(false)
        if (+answer == 0.25) {
          setStateOfCorrectness1('green')
          setNextDisabled(true)
        } else setStateOfCorrectness1('red')
        break

      case 1:
        if (stateOfCorrectness1 == 'green') {
          setAnswer('')
          setStateOfCorrectness1('')
          setPageNum(2)
          ggbApi.current?.evalCommand('RunClickScript(nxt22)')
          setNextDisabled(false)
          ggbApi.current?.setVisible('B1', false)
          setInputEnabled(0)
          return
        }
        setNextDisabled(false)
        if (+answer == 1.25) {
          setStateOfCorrectness1('green')
          setNextDisabled(true)
        } else setStateOfCorrectness1('red')
        break

      case 2:
        if (stateOfCorrectness1 == 'green') {
          setAnswer('')
          setStateOfCorrectness1('')
          ggbApi.current?.evalCommand('RunClickScript(retry1)')
          setPageNum(0)
          setNextDisabled(false)
          setInputEnabled(0)
          return
        }
        setNextDisabled(false)
        if (+answer == 5) {
          setStateOfCorrectness1('green')
          setNextDisabled(true)
        } else setStateOfCorrectness1('red')
        break
    }
  }

  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#444',
        id: 'g07-rpc05-s1-gb03',
        onEvent,
        className,
      }}
    >
      <TextHeader text="Find the equation." backgroundColor="#F6F6F6" buttonColor="#1A1A1A" />

      <ButtonElement disabled={nextDisabled == false} onClick={onNextHandle} colorTheme="black">
        {stateOfCorrectness1 === 'green' ? 'Next' : 'Check'}
      </ButtonElement>

      <GGBcontainer materialId="hudqtwrw" onApiReady={onGGBLoaded} width={687} height={545} />

      {pageNum == 0 && (
        <FeedbackCenter>
          Equation of proportional relationship: y ={' '}
          <InputBox1
            value={answer}
            onClick={() => setNudgeOn(false)}
            onChange={(e) => {
              setAnswer(() => e.target.value.replace(/[^0-9. ]/g, ''))
              setStateOfCorrectness1('')
              if (+e.target.value >= 0.01) {
                setNextDisabled(true)
              }
            }}
            disabled={inputEnabled == 0}
            correctness={stateOfCorrectness1}
          />
          &nbsp;x
        </FeedbackCenter>
      )}

      {pageNum == 1 && (
        <FeedbackCenter>
          Equation of proportional relationship: y ={' '}
          <InputBox1
            value={answer}
            onClick={() => setNudgeOn(false)}
            onChange={(e) => {
              setAnswer(() => e.target.value.replace(/[^0-9. ]/g, ''))
              setStateOfCorrectness1('')
              if (+e.target.value >= 0.01) {
                setNextDisabled(true)
              }
            }}
            disabled={inputEnabled == 0}
            correctness={stateOfCorrectness1}
          />
          &nbsp;x
        </FeedbackCenter>
      )}

      {pageNum == 2 && (
        <FeedbackCenter>
          Equation of proportional relationship: y ={' '}
          <InputBox1
            value={answer}
            onClick={() => setNudgeOn(false)}
            onChange={(e) => {
              setAnswer(() => e.target.value.replace(/[^0-9. ]/g, ''))
              setStateOfCorrectness1('')
              if (+e.target.value >= 0.01) {
                setNextDisabled(true)
              }
            }}
            disabled={inputEnabled == 0}
            correctness={stateOfCorrectness1}
          />
          &nbsp;x
        </FeedbackCenter>
      )}

      {pageNum == 2 && stateOfCorrectness1 == 'green' && (
        <Reset
          src={reset}
          onClick={() => {
            setAnswer('')
            setStateOfCorrectness1('')
            ggbApi.current?.evalCommand('RunClickScript(retry1)')
            setPageNum(0)
            setNextDisabled(false)
            setInputEnabled(0)
            ggbApi.current?.setVisible('B1', true)
          }}
        />
      )}

      {ggbLoaded && nudge && <NudgePlayer src={click} autoplay loop />}
    </AppletContainer>
  )
}

import { FC, useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { AppletContainer } from '@/common/AppletContainer'
import { Geogebra } from '@/common/Geogebra'
import { GeogebraAppApi } from '@/common/Geogebra/Geogebra.types'
import { TextHeader } from '@/common/Header'
import { AppletInteractionCallback } from '@/contexts/analytics'

import { Button } from './Elements/Button'
import Oppositer, { OppositeDisplay } from './Elements/Oppositer'

const Overlay = styled.div`
  height: 475px;
  width: 95.5%;
  background-color: #f3f7fe;

  z-index: 2;
  position: absolute;
  top: 142px;
  left: 15px;

  display: flex;
  align-items: center;
  justify-content: center;

  /* pointer-events: none; */
`

const OppositeHolder = styled.div`
  position: absolute;
  top: 160px;
  left: 175px;
`

const StyledGgb = styled(Geogebra)`
  height: 497px;
  width: 97%;
  overflow: hidden;
  position: absolute;
  left: 9.5px;
  top: 130px;
  z-index: -1;
`

const TextBox = styled.div<{ padding: boolean; size: number; color: string }>`
  text-align: center;
  color: ${(props) => props.color};
  font-size: ${(props) => props.size}px;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  line-height: 28px;
  width: 100%;

  padding: ${(props) => (props.padding ? 10 : 0)}px;
  display: flex;
  align-items: center;
  justify-content: center;

  position: absolute;
  bottom: 120px;
  z-index: 5;
`

export const AppletG06NSC07S1GB02: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const [ggbLoaded, setGgbLoaded] = useState(false)
  const ggbApi = useRef<GeogebraAppApi | null>(null)
  const [buttonType, setButtonType] = useState('Disable')
  const [answer, setAnswer] = useState({ answered: false, correct: false })
  const [qnValue, setQnValue] = useState(0)
  const [firstPart, setFirstPart] = useState(true)
  const [entryDisabled, setEntryDisabled] = useState(false)

  const handleGGBready = useCallback(
    (api: GeogebraAppApi | null) => {
      if (api === null) return
      ggbApi.current = api
      setGgbLoaded(true)
      setQnValue(ggbApi.current?.getValue('n'))

      ggbApi.current?.registerObjectUpdateListener('n', () => {
        if (ggbApi.current) {
          const ans = ggbApi.current?.getValue('n')
          setQnValue(ans)
        }
      })
    },
    [ggbApi],
  )

  useEffect(() => {
    if (answer.answered && answer.correct) {
      setButtonType('TryNew')
    } else if (answer.answered && !answer.correct) {
      setButtonType('Retry')
    }
  }, [answer])

  const handleClick = () => {
    if (!ggbApi) return
    switch (buttonType) {
      case 'Check':
        if (firstPart) {
          ggbApi.current?.setValue('correctopp', 1)
          setButtonType('Plot')
        } else {
          ggbApi.current?.evalCommand('If(opp == ctrl, SetValue(correct, 1), SetValue(correct, 0))')
          ggbApi.current?.evalCommand('SetValue(answered, 1)')
          ggbApi.current?.evalCommand('SetFixed(ctrl, true, false)')
          ggbApi.current?.evalCommand(
            'If(opp == ctrl, SetColor(G, "#FFF4E5FF"), SetColor(G, "#FF808080")) ',
          )
          ggbApi.current?.evalCommand(
            'If(opp == ctrl, SetColor(greyLowerLeft, "#FFF4E5FF"), SetColor(greyLowerLeft, "#FFF57A7A"))',
          )
          ggbApi.current?.evalCommand(
            'If(opp == ctrl, SetColor(greyLowerRight, "#FFAA5EE0"), SetColor(greyLowerRight, "#FFF57A7A")) ',
          )
          ggbApi.current?.evalCommand(
            'If(opp == ctrl, SetColor(greyLeft, "#FFAA5EE0"), SetColor(greyLeft, "#FFF57A7A")) ',
          )
          ggbApi.current?.evalCommand(
            'If(opp == ctrl, SetColor(greyRight, "#FFAA5EE0"), SetColor(greyRight, "#FFF57A7A")) ',
          )

          const tempAns = ggbApi.current?.getValue('answered') === 1 ? true : false
          const tempCorrect = ggbApi.current?.getValue('correct') === 1 ? true : false

          setAnswer({ answered: tempAns, correct: tempCorrect })
        }
        break
      case 'Plot':
        setFirstPart(false)
        setButtonType('Check')
        break

      case 'TryNew':
        ggbApi.current?.evalCommand('UpdateConstruction[]')
        ggbApi.current?.evalCommand('SetColor(q1, "#FFF3F7FE")')
        ggbApi.current?.evalCommand('SetValue(ctrl, 0)')
        ggbApi.current?.evalCommand('SetValue(answered, 0)')
        ggbApi.current?.evalCommand('SetValue(correct, 0)')
        ggbApi.current?.evalCommand('SetFixed(ctrl, true, true)')
        ggbApi.current?.evalCommand('SetValue(correctopp, 0)')
        ggbApi.current?.evalCommand('SetBackgroundColor(iBox, "#FFFFFFFF")')
        ggbApi.current?.evalCommand('SetColor(G, "#FF808080")')
        ggbApi.current?.evalCommand('SetColor(greyLeft, "#FF808080")')
        ggbApi.current?.evalCommand('SetColor(greyRight, "#FF808080")')
        ggbApi.current?.evalCommand('SetColor(greyLowerLeft, "#FF808080")')
        ggbApi.current?.evalCommand('SetColor(greyLowerRight, "#FF808080")')
        ggbApi.current?.evalCommand('SetValue(seconds, 0)')
        ggbApi.current?.evalCommand('StartAnimation(seconds, false)')
        setFirstPart(true)
        break
      case 'Retry':
        ggbApi.current?.evalCommand('SetValue(ctrl, 0)')
        ggbApi.current?.evalCommand('SetColor(q1, "#FFF3F7FE")')
        ggbApi.current?.evalCommand('SetValue(answered, 0)')
        ggbApi.current?.evalCommand('SetFixed(ctrl, true, true)')
        ggbApi.current?.evalCommand('SetColor(G, "#FF808080")')
        ggbApi.current?.evalCommand('SetColor(greyLeft, "#FF808080")')
        ggbApi.current?.evalCommand('SetColor(greyRight, "#FF808080")')
        ggbApi.current?.evalCommand('SetColor(greyLowerLeft, "#FF808080")')
        ggbApi.current?.evalCommand('SetColor(greyLowerRight, "#FF808080")')
        setButtonType('Check')
        break
    }
  }

  type TextHolder = {
    Check: string
    Plot: string
    TryNew: string
    Retry: string
    [key: string]: string
  }

  const textHolder: TextHolder = {
    Check: '',
    Plot: 'Well done! Now, let’s plot this number on the number line.',
    TryNew: 'Awesome! Challenge yourself with a new number.',
    Retry: 'Just a little adjustment and you’ll have it.',
  }

  const handleChange = (event: boolean) => {
    if (event) {
      setButtonType('Check')
    } else setButtonType('Disable')
  }

  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#F6F6F6',
        id: 'g06-nsc07-s1-gb01',
        onEvent,
        className,
      }}
    >
      <TextHeader
        text="Identify and represent the number on number line."
        backgroundColor="#F6F6F6"
        buttonColor="#1A1A1A"
      />
      <StyledGgb materialId="jfsqwrkr" onApiReady={handleGGBready} />
      {firstPart ? (
        <Overlay>
          {' '}
          {ggbLoaded ? (
            <Oppositer disabled={entryDisabled} onChange={handleChange} question={qnValue} />
          ) : null}
        </Overlay>
      ) : null}
      {!firstPart ? (
        <OppositeHolder>
          <OppositeDisplay question={qnValue} />
        </OppositeHolder>
      ) : null}
      <TextBox padding={false} size={20} color="#444">
        {buttonType != 'TryNew'
          ? textHolder[buttonType]
          : qnValue * -1 + ' is the opposite number of ' + qnValue}
      </TextBox>
      <Button buttonType={buttonType} onClick={handleClick} />
    </AppletContainer>
  )
}

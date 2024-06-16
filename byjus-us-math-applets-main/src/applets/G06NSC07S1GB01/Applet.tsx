import { FC, useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { AppletContainer } from '@/common/AppletContainer'
import { Geogebra } from '@/common/Geogebra'
import { GeogebraAppApi } from '@/common/Geogebra/Geogebra.types'
import { TextHeader } from '@/common/Header'
import { AppletInteractionCallback } from '@/contexts/analytics'

import { Button } from './Button'

const StyledGgb = styled(Geogebra)`
  height: 600px;
  width: 100%;
  overflow: hidden;
  position: absolute;
  left: 22.5px;
  top: 140px;
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

export const AppletG06NSC07S1GB01: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const ggbApi = useRef<GeogebraAppApi | null>(null)
  const [buttonType, setButtonType] = useState('Check')
  const [answer, setAnswer] = useState({ answered: false, correct: false })

  const handleGGBready = useCallback(
    (api: GeogebraAppApi | null) => {
      if (api === null) return
      ggbApi.current = api
    },
    [ggbApi],
  )

  useEffect(() => {
    if (answer.answered && answer.correct) {
      setButtonType('TryNew')
    } else if (answer.answered && !answer.correct) {
      setButtonType('Retry')
    }
    // } else setButtonType('Check')
  }, [answer])

  const handleClick = () => {
    if (!ggbApi) return
    if (buttonType === 'Check') {
      ggbApi.current?.evalCommand(
        'If(n == ctrl, SetColor(q1, "#FFE5FFEC"), SetColor(q1, "#FFFFECF1"))',
      )
      ggbApi.current?.evalCommand('If(n == ctrl, SetValue(correct, 1), SetValue(correct, 0))')
      ggbApi.current?.evalCommand('SetValue(answered, 1)')
      ggbApi.current?.evalCommand('SetFixed(ctrl, true, false)')
      const answered = ggbApi.current?.getValue('answered')
      const correct = ggbApi.current?.getValue('correct')
      const tempObject = { answered: answered === 1, correct: correct === 1 }
      setAnswer(tempObject)
    } else if (buttonType === 'TryNew') {
      ggbApi.current?.evalCommand('UpdateConstruction[]')
      ggbApi.current?.evalCommand('SetColor(q1, "#FFF3F7FE")')
      ggbApi.current?.evalCommand('SetValue(ctrl, 0)')
      ggbApi.current?.evalCommand('SetValue(answered, 0)')
      ggbApi.current?.evalCommand('SetValue(correct, 0)')
      ggbApi.current?.evalCommand('SetFixed(ctrl, true, true)')
      setButtonType('Check')
    } else if (buttonType === 'Retry') {
      ggbApi.current?.evalCommand('SetValue(ctrl, 0)')
      ggbApi.current?.evalCommand('SetColor(q1, "#FFF3F7FE")')
      ggbApi.current?.evalCommand('SetValue(answered, 0)')
      ggbApi.current?.evalCommand('SetFixed(ctrl, true, true)')
      setButtonType('Check')
    }
  }

  type TextHolder = {
    Check: string
    TryNew: string
    Retry: string
    [key: string]: string
  }

  const textHolder: TextHolder = {
    Check: '',
    TryNew: 'Awesome! Challenge yourself with a new number.',
    Retry: 'Just a little adjustment and you’ll have it.',
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
        text="Represent the number on number line."
        backgroundColor="#F6F6F6"
        buttonColor="#1A1A1A"
      />
      <StyledGgb materialId="nsdyyfsq" onApiReady={handleGGBready} />
      <TextBox padding={false} size={20} color="#444">
        {textHolder[buttonType]}
      </TextBox>
      <Button buttonType={buttonType} onClick={handleClick} />
    </AppletContainer>
  )
}

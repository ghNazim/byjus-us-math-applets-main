import { StateMachineInput, useRive, useStateMachineInput } from '@rive-app/react-canvas'
import { useEffect, useState } from 'react'
import styled from 'styled-components'

import { useSFX } from '@/hooks/useSFX'

import riveFile from './G08EEC07S1GB01.riv'

const ARTBOARD_NAME = 'Main'

interface RiveComponentProps {
  NAME: string
  isMoved: boolean
  numberControl: number
  plot?: boolean
  next?: boolean
  onLoad: () => void
}

const RiveHolder = styled.div`
  width: 680px;
  height: 400px;

  position: absolute;
  left: 18px;
  top: 0px;
`

export const RiveComponent = (STATE_MACHINE_NAME: RiveComponentProps) => {
  const playMouseClick = useSFX('mouseClick')

  const { rive, RiveComponent } = useRive({
    src: riveFile,
    stateMachines: STATE_MACHINE_NAME.NAME,
    autoplay: true,
    artboard: ARTBOARD_NAME,
    onLoad: STATE_MACHINE_NAME.onLoad,
  })

  const toggleMoved = useStateMachineInput(rive, STATE_MACHINE_NAME.NAME, 'isMoved')
  const currentNumber = useStateMachineInput(rive, STATE_MACHINE_NAME.NAME, 'numberControl')

  const plotter = useStateMachineInput(rive, STATE_MACHINE_NAME.NAME, 'plot')
  const nexter = useStateMachineInput(rive, STATE_MACHINE_NAME.NAME, 'next')

  if (STATE_MACHINE_NAME.NAME === 'startState') {
    if (toggleMoved) toggleMoved.value = STATE_MACHINE_NAME.isMoved
    if (currentNumber) currentNumber.value = STATE_MACHINE_NAME.numberControl
  }
  useEffect(() => {
    if (STATE_MACHINE_NAME.NAME != 'startState' && STATE_MACHINE_NAME.plot != false) plotter?.fire()
  }, [STATE_MACHINE_NAME.plot])

  useEffect(() => {
    if (STATE_MACHINE_NAME.NAME != 'startState' && STATE_MACHINE_NAME.next != false) nexter?.fire()
  }, [STATE_MACHINE_NAME.next])

  return (
    <div>
      <RiveHolder>
        <RiveComponent
          style={{
            height: '600px',
          }}
        />
      </RiveHolder>
    </div>
  )
}

import { FC, useEffect, useState } from 'react'
import styled from 'styled-components'

import { AppletContainer } from '@/common/AppletContainer'
import { TextHeader } from '@/common/Header'
import { AppletInteractionCallback } from '@/contexts/analytics'
import { RangeInput } from '@/molecules/RangeInput'

import { Button } from './assets/Button'
import { textHolder } from './assets/Elements'
import { RiveComponent } from './assets/RiveComponent'

const Container = styled.div`
  position: absolute;
  top: 520px;

  /* background-color: aliceblue; */
  width: 100%;
  height: 200px;

  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: center;

  gap: 10px;
`

const SliderHolder = styled.div`
  position: relative;
  left: 100px;
`

const TextBox = styled.div`
  text-align: center;
  color: #666;
  font-size: 20px;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  line-height: 38px;
  width: 100%;
`
interface StateMachineType {
  [key: string]: string
}

const stateMachine: StateMachineType = {
  start: 'startState',
  '-3': 'minusThreeState',
  '-2': 'minusTwoState',
  '-1': 'minusOneState',
  '0': 'zeroState',
  '1': 'oneState',
  '2': 'twoState',
  '3': 'threeState',
}

export const AppletG08EEC07S1GB01: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const [sliderVal, setSliderVal] = useState(0)
  const [currentState, setCurrentState] = useState(stateMachine['start'])
  const [buttonState, setButtonState] = useState('Generate')
  const [enabled, setEnabled] = useState(false)
  const [nextTrigger, setNextTrigger] = useState(false)
  const [plotTrigger, setPlotTrigger] = useState(false)
  const [textIndex, setTextIndex] = useState(0)

  const handleClick = () => {
    switch (buttonState) {
      case 'Generate':
        setCurrentState(stateMachine[sliderVal.toString()])
        setButtonState('Next')
        setEnabled(false)
        break
      case 'Next':
        setNextTrigger(true)
        setButtonState('Plot')
        setTextIndex(1)
        break
      case 'Plot':
        setPlotTrigger(true)
        setButtonState('Disable')
        break
      case 'TryNew':
        setSliderVal(0)
        setCurrentState(stateMachine['start'])
        setButtonState('Generate')
        setEnabled(false)
        setNextTrigger(false)
        setPlotTrigger(false)
        setTextIndex(0)
    }
  }

  useEffect(() => {
    if (sliderVal != 0) setEnabled(true)
  }, [sliderVal])

  useEffect(() => {
    if (nextTrigger) setNextTrigger(false)
  }, [nextTrigger])

  useEffect(() => {
    if (!plotTrigger) return
    const timer = setTimeout(() => {
      setTextIndex(2)
      setButtonState('TryNew')
    }, 8000)

    return () => {
      clearTimeout(timer)
    }
  }, [plotTrigger])

  const handleLoad = () => {
    if (currentState === 'startState') return
    setEnabled(true)
  }

  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '##F6F6F6',
        id: 'g08-eec07-s1-gb01',
        onEvent,
        className,
      }}
    >
      <TextHeader
        text="Explore the characteristics of a graph with a proportional relationship."
        backgroundColor="#F6F6F6"
        buttonColor="#1A1A1A"
      />
      {currentState === 'startState' ? (
        <RiveComponent
          onLoad={handleLoad}
          NAME={currentState}
          numberControl={sliderVal}
          isMoved={enabled}
        />
      ) : null}
      {currentState != 'startState' ? (
        <RiveComponent
          onLoad={handleLoad}
          next={nextTrigger}
          plot={plotTrigger}
          NAME={currentState}
          numberControl={sliderVal}
          isMoved={enabled}
        />
      ) : null}

      <Container>
        <TextBox>{textHolder[textIndex]}</TextBox>
        {buttonState === 'Generate' ? (
          <SliderHolder>
            <RangeInput value={sliderVal} min={-3} max={3} onChange={setSliderVal} />
          </SliderHolder>
        ) : null}
      </Container>
      <Button inactive={!enabled} buttonType={buttonState} onClick={handleClick} />
    </AppletContainer>
  )
}

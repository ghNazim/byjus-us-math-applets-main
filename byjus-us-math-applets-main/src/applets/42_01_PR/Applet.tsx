import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

import { useSFX } from '@/hooks/useSFX'

import { AppletContainer } from '../../common/AppletContainer'
import { TextHeader } from '../../common/Header'
import { AppletInteractionCallback } from '../../contexts/analytics'
import TryNewSvg from './Assets/TryNew.svg'
import PopUp from './Components/PopUp'
import RiveComponent from './Components/RiveComponent'
import { Select } from './Components/Select'

const BottomBtn = styled.div`
  padding: 9px 46px;
  background-color: ${(props) => props.color};
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 9px 36px;
  position: absolute;
  gap: 1rem;
  height: 60px;
  top: 708px;
  border-radius: 10px;
  font-size: 24px;
`

const AnswerInput = styled.input.attrs(() => ({
  type: 'number',
  placeholder: '?',
}))`
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 500;
  font-size: 24px;
  line-height: 34px;
  color: #444444;
  -webkit-appearance: none;
  background-color: transparent;
  border: 0;
  max-width: 80px;

  &:focus {
    outline: 0;
    -webkit-appearance: 'none';
  }
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`

const AnswerInputContainer = styled.div`
  position: absolute;
  top: 585px;
  width: 100%;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  flex-direction: row;
  gap: 20px;
`

const AnswerInputLabel = styled.p`
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 400;
  font-size: 24px;
  line-height: 32px;
  color: #646464;
`

const disclaimerText =
  'To find the composite solid volume, add individual rectangular prism volumes and remember the unit for volume is cubed.'

const answerStateColors = {
  default: '#81B3FF',
  right: '#85CC29',
  wrong: '#F57A7A',
  disable: '#c7c7c7',
}

const answerFillColors = {
  default: ' rgba(232, 240, 254, 0.1)',
  right: 'rgba(133, 204, 41, 0.1)',
  wrong: 'rgba(245, 122, 122, 0.1)',
  disable: 'rgba(246, 246, 246, 0.1)',
}

const AnswerInputBorder = styled.div<{ state: keyof typeof answerStateColors }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 13px 8px 13px 36px;
  gap: 8px;
  border: 3px solid ${(props) => answerStateColors[props.state]};
  background-color: ${(props) => answerFillColors[props.state]};
  transition: 0.1s;
  border-radius: 15px;
`
const units = ['cm', 'in', 'mm', 'm']
type units = ['cm', 'in', 'mm', 'm']
interface ShapeProps {
  name: string
  id: number
  unit: units[number]
  volume: number
}

const shapes: { [key: string]: ShapeProps } = {
  shape1: {
    name: 'shape_01',
    id: 1,
    unit: 'cm',
    volume: 12,
  },
  shape2: {
    name: 'shape_02',
    id: 2,
    unit: 'in',
    volume: 39,
  },
  shape3: {
    id: 3,
    unit: 'cm',
    volume: 15,
    name: 'shape_03',
  },
  shape4: {
    id: 4,
    unit: 'mm',
    volume: 12,
    name: 'shape_04',
  },
  shape5: {
    id: 5,
    unit: 'm',
    volume: 7,
    name: 'shape_05',
  },
}

const shuffleArray = (arr: any[]) => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

const shuffledShapeArr = shuffleArray([
  shapes.shape1,
  shapes.shape2,
  shapes.shape3,
  shapes.shape4,
  shapes.shape5,
])

export const Applet4201Pr: React.FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const [currentShape, setCurrentShape] = useState(shuffledShapeArr[0])
  const [answerState, setAnswerState] = useState<keyof typeof answerStateColors>('default')
  const [inputValue, setInputValue] = useState<number | string>()
  const [currentUnit, setCurrentUnit] = useState('')
  const [showTryNewButton, setShowTryNewButton] = useState(false)
  const [isInputValGiven, setIsInputValGiven] = useState(false)
  const [unitSelected, setUnitSelected] = useState(false)
  const [activateCheckBtn, setActivateCheckBtn] = useState(false)
  const [showDisclaimer, setShowDisclaimer] = useState(false)

  const playMouseIn = useSFX('mouseClick')
  const playCorrectAnswer = useSFX('correct')
  const playWrongAnswer = useSFX('incorrect')
  const options = [currentShape.unit, `${currentShape.unit}²`, `${currentShape.unit}³`] as const

  useEffect(() => {
    if (isInputValGiven && unitSelected) {
      setActivateCheckBtn(true)
    }
  }, [isInputValGiven, unitSelected])

  const handleInputVal = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setInputValue(parseInt(val))
    val === null ? setIsInputValGiven(false) : setIsInputValGiven(true)
  }

  const checkIfCorrectUnit = (unit: string) => {
    const length = unit.length
    //unit should be always the power '³' since it's volume
    return unit[length - 1] === '³' ? true : false
  }

  const handleUnitChange = (val: string) => {
    playMouseIn()
    setCurrentUnit(val)
    if (currentUnit !== val) setUnitSelected(true)
  }

  const checkAnswer = () => {
    if (isInputValGiven && unitSelected) {
      const answer = currentShape.volume

      if (inputValue === answer && checkIfCorrectUnit(currentUnit)) {
        setAnswerState('right')
        setShowTryNewButton(true)
        playCorrectAnswer()
      } else {
        setAnswerState('wrong')
        setShowDisclaimer(true)
        playWrongAnswer()
      }
    }
  }

  const handleTryNewBtn = () => {
    const currentIndex = shuffledShapeArr.indexOf(currentShape)
    const nextIndex = currentIndex === 4 ? 1 : currentIndex + 1
    setCurrentShape(shuffledShapeArr[nextIndex])

    setAnswerState('default')
    setInputValue('')
    setIsInputValGiven(false)
    setShowTryNewButton(false)
    setActivateCheckBtn(false)
    setUnitSelected(false)
  }

  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#F1EDFF',
        id: '42_01_PR',
        onEvent,
        className,
      }}
    >
      <TextHeader
        text="What is the volume of the given composite solid?"
        backgroundColor="#E7FBFF"
        buttonColor="rgba(255, 255, 255,0)"
      />
      <AnswerInputContainer>
        <AnswerInputLabel>Volume of composite solid = </AnswerInputLabel>
        <AnswerInputBorder state={answerState}>
          <AnswerInput
            value={inputValue}
            onChange={handleInputVal}
            onKeyDown={(e) => {
              //preventing user giving decimal values
              if (e.key === '.') e.preventDefault()
            }}
            disabled={false}
          />
          <Select
            options={options}
            onValueChange={handleUnitChange}
            state={answerState}
            onBoardAnimCheck={false}
          />
        </AnswerInputBorder>
      </AnswerInputContainer>
      {showDisclaimer && (
        <PopUp onclick={() => setShowDisclaimer(false)} message={disclaimerText} />
      )}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <BottomBtn
          color={activateCheckBtn ? 'rgba(140, 105, 255, 1)' : 'rgba(140, 105, 255, .2)'}
          style={{ cursor: `${activateCheckBtn ? 'pointer' : 'default'}` }}
          onClick={checkAnswer}
        >
          Check
        </BottomBtn>
        {showTryNewButton && (
          <BottomBtn
            color="rgba(140, 105, 255, 1)"
            onClick={handleTryNewBtn}
            style={{ cursor: 'pointer' }}
          >
            <img src={TryNewSvg} />
            Try new
          </BottomBtn>
        )}
      </div>

      {currentShape.id === 1 ? <RiveComponent NAME={'shape_01'} /> : undefined}
      {currentShape.id === 2 ? <RiveComponent NAME={'shape_02'} /> : undefined}
      {currentShape.id === 3 ? <RiveComponent NAME={'shape_03'} /> : undefined}
      {currentShape.id === 4 ? <RiveComponent NAME={'shape_04'} /> : undefined}
      {currentShape.id === 5 ? <RiveComponent NAME={'shape_05'} /> : undefined}
    </AppletContainer>
  )
}

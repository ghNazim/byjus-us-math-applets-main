import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

import { StepperButton } from '@/atoms/StepperButton'
import { WeighingScale } from '@/common/WeighingScale'
import {
  defaultQuestion,
  ScaleContextProvider,
  useQuestion,
} from '@/common/WeighingScale/WeighingScale.context'
import { RangeInput } from '@/molecules/RangeInput'

import { AppletContainer } from '../../common/AppletContainer'
import { AppletInteractionCallback } from '../../contexts/analytics'
import {
  DividedTemplate,
  fetchNextQuestion,
  Question,
  QuestionsList,
} from './AppletElements/Elements'

const TextBox = styled.div<{ currentState: boolean }>`
  text-align: center;
  color: #666;
  font-size: 20px;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  line-height: 28px;
  height: ${(props) => (props.currentState ? '80px' : '50px')};
  width: 600px;
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) =>
    props.currentState ? '	hsl(95, 83%, 88%, 50%)' : '	hsl(0, 100%, 91%, 50%)'};
  border: 1px solid
    ${(props) => (props.currentState ? '	hsl(150, 54%, 42%, 50%)' : '	hsla(0, 50%, 60%, 50%)')};
`

const LabelText = styled.div`
  font-size: 20px;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  line-height: 28px;
  color: #444444;
`

const TextDisplay = () => {
  const { currentCalculation } = useQuestion()
  return <TextBox currentState={currentCalculation.answer}>{currentCalculation.parseText}</TextBox>
}

export const AppletG07EEC02S1GB03: React.FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const [questionLet, setQuestionLet] = useState(defaultQuestion)
  const [sliderVal, setSliderVal] = useState(0)
  const [ggbLoaded, setGGbLoaded] = useState(false)
  const [defaultSliderPos, setDefaultSliderPos] = useState(0)
  const [textOn, setTextOn] = useState(false)

  useEffect(() => {
    setQuestionLet(QuestionsList.one)
  }, [ggbLoaded])

  useEffect(() => {
    setDefaultSliderPos(questionLet.sliderDefaultPosition)
  }, [questionLet])

  useEffect(() => {
    setSliderVal(defaultSliderPos)
  }, [defaultSliderPos])

  const resetQuestion = () => {
    const newQn = fetchNextQuestion()
    setQuestionLet(newQn ? newQn : QuestionsList.one)
  }

  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#F6F6F6',
        id: 'G07EEC02S1GB03',
        onEvent,
        className,
        themeName: 'dark',
      }}
    >
      <ScaleContextProvider>
        <DividedTemplate
          tryNew={true}
          callOutText={
            <>
              Balance the weighing scale to determine the value
              <br /> of the unknown <q>{questionLet.variable}</q>.
            </>
          }
          onClick={resetQuestion}
        >
          <Question />
          <div style={{ height: 300 }}>
            <WeighingScale
              questionParse={questionLet}
              sliderValues={{ lhs: sliderVal, rhs: 3 }}
              ggbLoadComplete={() => setGGbLoaded(true)}
            />
          </div>
          <div style={{ height: 80 }}>{textOn ? <TextDisplay /> : null}</div>
          <LabelText>Value of x</LabelText>
          {ggbLoaded ? (
            <StepperButton
              value={sliderVal}
              max={9}
              onChange={(v) => {
                setSliderVal(v)
                if (!textOn) setTextOn(true)
              }}
              defaultValue={defaultSliderPos}
            />
          ) : null}
        </DividedTemplate>
      </ScaleContextProvider>
    </AppletContainer>
  )
}

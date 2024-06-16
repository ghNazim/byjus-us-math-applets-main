import React, { FC, useEffect, useState } from 'react'
import styled from 'styled-components'

import { TextHeader } from '@/common/Header'
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
import { WeighingScale } from './WeighingScale/WeighingScale'

const DefaultLabel = styled.label`
  font-family: Nunito;
  font-size: 20px;
  font-weight: 400;
  line-height: 24px;
  text-align: center;
  color: #282828;

  span {
    color: #1cb9d9;
  }
`

const TextBox = styled.div`
  text-align: center;
  font-size: 20px;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  line-height: 28px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #444444;
`

const Bg = styled.div`
  height: 100%;
  width: 100%;
  background-color: #ddd6fb;
  position: absolute;
  top: 0;
  left: 0;
  z-index: -99;
`

const TextDisplay = () => {
  const { currentCalculation } = useQuestion()
  return <TextBox>{currentCalculation.parseText}</TextBox>
}

const Slider = styled(RangeInput)`
  display: flex;
`

export const AppletG06EEC04GB01V2: FC<{
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
        id: 'G06EEC04GB01',
        onEvent,
        className,
        themeName: 'dark',
      }}
    >
      <Bg />
      <ScaleContextProvider>
        <DividedTemplate
          tryNew={true}
          callOutText={
            <>
              Slide to balance the scale and determine
              <br /> the value of <q>{questionLet.variable}</q>
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
          <div style={{ height: 50 }}>{textOn ? <TextDisplay /> : null}</div>

          {ggbLoaded ? (
            <Slider
              label={() => (
                <DefaultLabel>
                  Value of <span style={{ color: '#1CB9D9' }}>{questionLet.variable}</span>
                </DefaultLabel>
              )}
              step={1}
              value={sliderVal}
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

import { FC, ReactElement, useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { AppletContainer } from '@/common/AppletContainer'
import { Geogebra } from '@/common/Geogebra'
import { GeogebraAppApi } from '@/common/Geogebra/Geogebra.types'
import { TextHeader } from '@/common/Header'
import { AppletInteractionCallback } from '@/contexts/analytics'

import { Button } from './Elements/Button'
import { InfoHolder, orangeBlock, purpleBlock, textHolder } from './Elements/Elements'
import Intercept from './Elements/Intercept'
import PointandSlope from './Elements/PointandSlope'
import { QuestionsList } from './Elements/Questions'
import SlopeFormer from './Elements/SlopeFormer'

const NonGGBLayout = styled.div`
  position: relative;
  top: 85px;
  height: 78%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
`

const GGBLayout = styled.div`
  position: relative;
  top: 85px;
  height: 18%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
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

const Container = styled.div`
  position: absolute;
  top: 20px;

  width: 680px;
  height: 450px;
  background-color: #e7fbff;
  border-radius: 12px;
  z-index: 2;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 50px;
`

const StyledGgb = styled(Geogebra)`
  height: 600px;
  width: 100%;
  overflow: hidden;
  position: absolute;
  left: 50px;
  top: 100px;
  z-index: -1;
`

export interface IQuestionPointSlope {
  id: number
  slope: { numerator: number; denominator: number }
  pointVal: { a: number; b: number }
  ggbID: string
  wrongIntercept: ReactElement
  wrongNumerator: ReactElement
  wrongDenominator: ReactElement
}

export const AppletG08EEC09S2GB02: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const ggbApi = useRef<GeogebraAppApi | null>(null)
  // const [ggbLoaded, setGGBLoaded] = useState(true)
  const [showEquation, setShowEquation] = useState(true)
  const [showSlope, setShowSlope] = useState(false)
  const [showText, setShowText] = useState(true)
  const [buttonState, setButtonType] = useState('Start')
  // const [showGGB, setShowGGb] = useState(true)
  const [showIntercept, setShowIntercept] = useState(false)

  const [question, setQuestion] = useState(QuestionsList.zero)

  const [pageNum, setPageNum] = useState(0)

  const [answerState, setAnswerState] = useState(2)

  const [aGGb, setaGGb] = useState(false)
  const [aDragEnd, setADragEnd] = useState(false)
  const [iGGb, setiGGb] = useState(false)
  const [iDragEnd, setIDragEnd] = useState(false)

  useEffect(() => {
    switch (pageNum) {
      case 0:
        setShowEquation(true)
        setShowText(true)
        setButtonType('Start')
        break
      case 1:
        setButtonType('Disable')
        setShowIntercept(true)
        break
      case 2:
        setButtonType('Disable')
        break
      case 3:
        setButtonType('Next')
        break
      case 4:
        setButtonType('Disable')
        setShowIntercept(false)
        setShowSlope(true)
        break
      case 5:
        setButtonType('Disable')
        break
      case 6:
        setButtonType('Plot')
        break
      case 7:
        setButtonType('Disable')
        break
      case 8:
        setButtonType('Disable')
        break
      case 9:
        setButtonType('Next')
        break
      case 10:
        ggbApi.current?.evalCommand('SetValue(next1,1)')
        setButtonType('Disable')
        break
      case 11:
        break
      case 12:
        setButtonType('Next')
        break
      case 13:
        ggbApi.current?.evalCommand('SetValue(next2,1)')
        setButtonType('Generate')
        break
      case 14:
        ggbApi.current?.evalCommand('SetValue(generate,1)')
        setButtonType('TryNew')
        setPageNum(15)
        break
    }
  }, [pageNum])

  useEffect(() => {
    if (!aDragEnd) return
    switch (pageNum) {
      case 7:
        if (aGGb) setPageNum(9)
        break
      case 8:
        if (aGGb) setPageNum(9)
        break
    }
  }, [aGGb, aDragEnd])

  useEffect(() => {
    if (!iDragEnd) return
    switch (pageNum) {
      case 10:
        if (iGGb) setPageNum(12)
        break
      case 8:
        if (iGGb) setPageNum(12)
        break
    }
  }, [iGGb, iDragEnd])

  useEffect(() => {
    setPageNum(0)
    setShowEquation(true)
    setShowSlope(false)
    setShowText(true)
    setShowIntercept(false)
  }, [question])

  const handleGGBready = useCallback(
    (api: GeogebraAppApi | null) => {
      if (api === null) return
      ggbApi.current = api

      ggbApi.current?.registerObjectUpdateListener('a', () => {
        if (ggbApi.current) {
          const ans = ggbApi.current?.getValue('a')
          setaGGb(ans === 1 ? true : false)
        }
      })

      ggbApi.current?.registerObjectUpdateListener('bool1', () => {
        if (ggbApi.current) {
          const ans = ggbApi.current?.getValue('a')
          setADragEnd(ans === 1 ? true : false)
        }
      })

      ggbApi.current?.registerObjectUpdateListener('b', () => {
        if (ggbApi.current) {
          const ans = ggbApi.current?.getValue('b')
          setiGGb(ans === 1 ? true : false)
        }
      })

      ggbApi.current?.registerObjectUpdateListener('bool2', () => {
        if (ggbApi.current) {
          const ans = ggbApi.current?.getValue('bool2')
          setIDragEnd(ans === 1 ? true : false)
        }
      })
    },
    [ggbApi],
  )

  const resetQuestion = (i: number) => {
    setaGGb(false)
    setiGGb(false)
    setADragEnd(false)
    setIDragEnd(false)
    switch (i) {
      case 0:
        setQuestion(QuestionsList.zero)
        break
      case 1:
        setQuestion(QuestionsList.one)
        break
      case 2:
        setQuestion(QuestionsList.two)
        break
      case 3:
        setQuestion(QuestionsList.three)
        break
      case 4:
        setQuestion(QuestionsList.zero)
        break
    }
  }

  const handleClick = () => {
    switch (pageNum) {
      case 0:
        setPageNum(4)
        break
      case 6:
        setPageNum(7)
        break
      case 9:
        setPageNum(10)
        break
      case 12:
        setPageNum(13)
        break
      case 13:
        setPageNum(14)
        break
      case 15:
        resetQuestion(question.id + 1)
        break
    }
  }

  function handleInput(type: string, ans?: boolean): void {
    switch (type) {
      case 'intercept':
        if (ans) setPageNum(3)
        else setPageNum(2)
    }
  }

  function handleSlopeInput(ans: boolean): void {
    if (answerState === 0 && !ans) setPageNum(4)
    else if (ans) setPageNum(6)
    else setPageNum(5)
  }

  const handleAnswerState = (state: number) => {
    setAnswerState(state)
  }

  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#1a1a1a',
        id: 'g08-eec09-s2-gb02',
        onEvent,
        className,
      }}
    >
      <TextHeader
        text="Plot the line for the given equation."
        backgroundColor="#f6f6f6"
        buttonColor="#1a1a1a"
      />
      {pageNum < 7 ? (
        <NonGGBLayout>
          {showEquation || showSlope ? (
            <Container>
              {showEquation ? (
                <PointandSlope pointVal={question.pointVal} slopeVal={question.slope} />
              ) : null}
              {showSlope ? (
                <>
                  <SlopeFormer
                    answerState={handleAnswerState}
                    completed={handleSlopeInput}
                    question={question}
                    numerator={10}
                    denominator={15}
                  />
                </>
              ) : null}
              {showIntercept ? (
                <Intercept
                  answerState={handleAnswerState}
                  answered={(ans) => handleInput('intercept', ans)}
                  interceptVal={question.slope.numerator}
                />
              ) : null}
            </Container>
          ) : null}
        </NonGGBLayout>
      ) : (
        <GGBLayout>
          {/* <EquationHolder>{question.questionExp}</EquationHolder> */}
          <InfoHolder
            colorBoxii={{ interceptBox: purpleBlock, slopeBox: orangeBlock }}
            slopeVals={question.slope}
            pointVal={question.pointVal}
          />
          {/* {showGGB ? <StyledGgb materialId={question.ggbID} onApiReady={handleGGBready} /> : null} */}
          <StyledGgb materialId={question.ggbID} onApiReady={handleGGBready} />
        </GGBLayout>
      )}
      {showText ? (
        <TextBox padding={false} size={20} color="#444">
          {textHolder[pageNum]}
        </TextBox>
      ) : null}
      {buttonState != 'Disable' ? <Button onClick={handleClick} buttonType={buttonState} /> : null}
    </AppletContainer>
  )
}

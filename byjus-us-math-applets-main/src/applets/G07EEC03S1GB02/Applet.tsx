import { Player } from '@lottiefiles/react-lottie-player'
import React, { FC, useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'

import AlgebraicButtonTray from '@/common/AlgebraicButtonTray/AlgebraicButtonTray'
import AlgebraicGridZone from '@/common/AlgebraicGridZone/AlgebraicGridZone'
import { PageControl } from '@/common/PageControl'

import { AppletContainer } from '../../common/AppletContainer'
import mouseClick from '../../common/handAnimations/click.json'
import { AppletInteractionCallback } from '../../contexts/analytics'
import { DividedTemplate, QuestionsList } from './AppletElements/Elements'
import { QuestionElement } from './TemplateElements/QuestionElement'
import { Position, WeighingScale } from './TemplateElements/WeighingScale/WeighingScale'
import {
  defaultQuestion,
  ScaleContextProvider,
} from './TemplateElements/WeighingScale/WeighingScale.context'

export interface GridProps {
  TextPos: Position
}

const TextBox = styled.div<{ page: number }>`
  text-align: center;
  color: #646464;
  font-size: 20px;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  line-height: 28px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: ${(props) => (props.page == 4 ? '125' : '50')}px;
`

const GridDisplay = styled(AlgebraicGridZone)<{ left: number; top: number }>`
  position: absolute;
  top: ${(props) => props.top - 25}px;
  left: ${(props) => props.left - 181}px;
  width: 158px;
  height: 10px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: end;
  scale: 0.8;
`
const finalStatements = [
  'The smaller number is 4.',
  'The value of the greater even number (x + 2) is 6.',
  'Hence, the length of the third side is 2cm.',
  'The width of the rectangle is 5 in.',
]
const PlacedPlayer = styled(Player)<{ top: number; left: number }>`
  position: absolute;
  top: ${(props) => props.top}px;
  left: ${(props) => props.left}px;
  pointer-events: none;
`
const topValues = [570, 570, 570, 570]
const leftValues = [120, 440, 440, 330]
export const AppletG07EEC03S1GB02: React.FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const [questionLet, setQuestionLet] = useState(defaultQuestion)
  const [ggbLoaded, setGGbLoaded] = useState(false)
  const [buttonStatusLeftPan, setButtonStatusLeftPan] = useState([true, true, true, true])
  const [buttonStatusRightPan, setButtonStatusRightPan] = useState([true, true, true, true])
  const [pageIndex, setPageIndex] = useState(0)
  const [leftXCoefficient, setLeftXCoefficient] = useState(0)
  const [rightXCoefficient, setRightXCoefficient] = useState(0)
  const [leftConstant, setLeftConstant] = useState(0)
  const [rightConstant, setRightConstant] = useState(0)
  const [selectedPan, setSelectedPan] = useState<0 | 1 | 2 | 3>(1)
  const [buttonDisableStatus, setButtonDisableStatus] = useState([true, true, true, true])
  const [pageKiller, setPageKiller] = useState(true)
  const [intro, setIntro] = useState(true)
  const [showOptions, setShowOptions] = useState(true)
  const [questionSelected, setQuestionSelected] = useState(-1)
  const [handPosition, setHandPosition] = useState(0)
  const [showHandPointer, setShowHandPointer] = useState(false)

  const pickQuestion = (i: number) => {
    setShowOptions(false)
    setQuestionSelected(i)
    switch (i) {
      case 0:
        setQuestionLet(QuestionsList.one)
        break
      case 1:
        setQuestionLet(QuestionsList.two)
        break
      case 2:
        setQuestionLet(QuestionsList.three)
        break
      case 3:
        setQuestionLet(QuestionsList.four)
        break
    }
  }
  useEffect(() => {
    if (
      leftXCoefficient == questionLet.targetParameters.leftCoefficient &&
      pageIndex == 1 &&
      leftConstant == 0
    )
      setShowHandPointer(true)
  }, [leftXCoefficient])

  const buttonStatusHandleLeftPan = (buttonStatus: Array<boolean>) => {
    setButtonStatusLeftPan(buttonStatus)
  }
  const buttonStatusHandleRightPan = (buttonStatus: Array<boolean>) => {
    setButtonStatusRightPan(buttonStatus)
  }

  const onXClick = useCallback(
    (value: number) => {
      switch (selectedPan) {
        case 1:
          setShowHandPointer(false)
          setHandPosition(1)
          setLeftXCoefficient((v) => v + value)
          break
        case 2:
          setRightXCoefficient((v) => v + value)
          break
        case 3:
          setLeftXCoefficient((v) => v + value)
          setRightXCoefficient((v) => v + value)
          break
      }
    },
    [selectedPan],
  )
  const onOneClick = useCallback(
    (value: number) => {
      switch (selectedPan) {
        case 1:
          if (leftConstant == 0) {
            setShowHandPointer(false)
          }
          setLeftConstant((v) => v + value)
          break
        case 2:
          if (rightConstant == 0) {
            setShowHandPointer(false)
          }
          setRightConstant((v) => v + value)
          break
        case 3:
          setShowHandPointer(false)
          setLeftConstant((v) => v + value)
          setRightConstant((v) => v + value)
          break
      }
    },
    [selectedPan],
  )

  const LeftGridComponent: FC<GridProps> = useCallback(
    ({ TextPos }) => {
      return (
        <GridDisplay
          left={TextPos.left}
          top={TextPos.top}
          xMax={4}
          constantMax={8}
          selected={selectedPan == 1 || selectedPan == 3 ? true : false}
          zoneStatus={buttonStatusHandleLeftPan}
          xCoeffValue={leftXCoefficient}
          constantValue={leftConstant}
        />
      )
    },
    [leftConstant, leftXCoefficient, selectedPan],
  )

  const RightGridComponent: FC<GridProps> = useCallback(
    ({ TextPos }) => {
      return (
        <GridDisplay
          left={TextPos.left}
          top={TextPos.top}
          xMax={2}
          constantMax={20}
          selected={selectedPan == 2 || selectedPan == 3 ? true : false}
          zoneStatus={buttonStatusHandleRightPan}
          xCoeffValue={rightXCoefficient}
          constantValue={rightConstant}
        />
      )
    },
    [rightConstant, rightXCoefficient, selectedPan],
  )

  const onPageChange = useCallback((current: number) => {
    setPageIndex(current)
  }, [])

  useEffect(() => {
    switch (selectedPan) {
      case 1:
        setButtonDisableStatus(buttonStatusLeftPan)
        break
      case 2:
        setButtonDisableStatus(buttonStatusRightPan)
        break
      case 3:
        setButtonDisableStatus([
          buttonStatusLeftPan[0] || buttonStatusRightPan[0],
          buttonStatusLeftPan[1] || buttonStatusRightPan[1],
          buttonStatusLeftPan[2] || buttonStatusRightPan[2],
          buttonStatusLeftPan[3] || buttonStatusRightPan[3],
        ])
        break
    }
  }, [selectedPan, buttonStatusLeftPan, buttonStatusRightPan])

  useEffect(() => {
    switch (pageIndex) {
      case 0:
        setIntro(true)
        break
      case 1:
        setIntro(false)
        setShowHandPointer(true)
        setHandPosition(0)
        setSelectedPan(1)
        setRightConstant(0)
        setRightXCoefficient(0)
        setLeftConstant(0)
        setLeftXCoefficient(0)
        break
      case 2:
        setSelectedPan(2)
        setShowHandPointer(true)
        setHandPosition(2)
        setLeftConstant(questionLet.targetParameters.leftConstant)
        setLeftXCoefficient(questionLet.targetParameters.leftCoefficient)
        setRightConstant(0)
        break
      case 3:
        setSelectedPan(3)
        setLeftConstant(questionLet.targetParameters.leftConstant)
        setLeftXCoefficient(questionLet.targetParameters.leftCoefficient)
        setRightConstant(questionLet.targetParameters.rightConstant)
        setRightXCoefficient(0)
        setShowHandPointer(true)
        setHandPosition(3)
        break
      case 4:
        setSelectedPan(0)
        setLeftConstant(0)
        setLeftXCoefficient(
          questionLet.targetParameters.leftCoefficient /
            questionLet.targetParameters.leftCoefficient,
        )
        setRightConstant(
          (questionLet.targetParameters.rightConstant - questionLet.targetParameters.leftConstant) /
            questionLet.targetParameters.leftCoefficient,
        )
        break
    }
  }, [pageIndex])

  const FragmentRetrieve = () => {
    if (pageIndex === 0 && handPosition === 0)
      return <>Tap on the algebraic tiles to form equation.</>
    if (pageIndex === 3 && leftConstant !== 0) {
      return (
        <>
          Remove tiles from both sides by maintaining the
          <br /> equilibrium of the equation to isolate x.
        </>
      )
    } else if (pageIndex === 3 && leftConstant === 0) {
      return <>You have isolated x.</>
    } else if (pageIndex === 4) {
      return (
        <>
          The value of x is{' '}
          {(questionLet.targetParameters.rightConstant -
            questionLet.targetParameters.leftConstant) /
            questionLet.targetParameters.leftCoefficient}
          .<br />
          {finalStatements[questionSelected]}
        </>
      )
    }
  }

  useEffect(() => {
    if (
      pageIndex == 1 &&
      leftConstant === questionLet.targetParameters.leftConstant &&
      leftXCoefficient === questionLet.targetParameters.leftCoefficient
    )
      setPageKiller(false)
    else if (
      pageIndex === 2 &&
      rightConstant === questionLet.targetParameters.rightConstant &&
      rightXCoefficient === questionLet.targetParameters.rightCoefficient
    )
      setPageKiller(false)
    else if (
      pageIndex === 3 &&
      leftConstant === 0 &&
      leftXCoefficient === questionLet.targetParameters.leftCoefficient &&
      rightConstant ===
        questionLet.targetParameters.rightConstant - questionLet.targetParameters.leftConstant
    )
      setPageKiller(false)
    else setPageKiller(true)
  }, [leftConstant, leftXCoefficient, pageIndex, rightConstant, rightXCoefficient])
  const onNextEnableHandle = useCallback((value: boolean) => {
    if (value) setPageKiller(false)
  }, [])
  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#FAF2FF',
        id: 'g07-eec03-s1-gb02',
        onEvent,
        className,
      }}
    >
      <ScaleContextProvider>
        <DividedTemplate
          callOutText={<>Solve the word problems to find the value of “x”.</>}
          introScreen={intro}
          onQnClick={pickQuestion}
          onNextEnable={onNextEnableHandle}
          introOptions={showOptions}
        >
          {!intro && (
            <QuestionElement
              leftCoefficient={questionLet.targetParameters.leftCoefficient}
              leftConstant={questionLet.targetParameters.leftConstant}
              rightConstant={questionLet.targetParameters.rightConstant}
              criteria1={
                pageIndex !== 3 &&
                pageIndex !== 4 &&
                leftXCoefficient === questionLet.targetParameters.leftCoefficient
              }
              criteria2={
                pageIndex !== 3 &&
                pageIndex !== 4 &&
                leftConstant === questionLet.targetParameters.leftConstant
              }
              criteria3={
                pageIndex !== 3 &&
                pageIndex !== 4 &&
                rightConstant === questionLet.targetParameters.rightConstant &&
                rightXCoefficient === questionLet.targetParameters.rightCoefficient
              }
            />
          )}
          {!intro && (
            <div style={{ height: 300 }}>
              <WeighingScale
                questionParse={questionLet}
                sliderValues={{ lhs: 0, rhs: 3 }}
                ggbLoadComplete={() => setGGbLoaded(true)}
                parameters={{
                  leftCoefficient: leftXCoefficient,
                  leftConstant: leftConstant,
                  rightConstant: rightConstant,
                  rightCoefficient: rightXCoefficient,
                }}
                LeftProp={LeftGridComponent}
                RightProp={RightGridComponent}
              />
            </div>
          )}
          {ggbLoaded ? <TextBox page={pageIndex}>{FragmentRetrieve()}</TextBox> : null}
          {ggbLoaded && pageIndex < 4 && (
            <AlgebraicButtonTray
              onXClick={onXClick}
              onOneClick={onOneClick}
              buttonDisableStatus={buttonDisableStatus}
              buttonDisplayStatus={
                pageIndex == 3 ? [false, false, true, true] : [true, true, true, true]
              }
            />
          )}
          {ggbLoaded && showHandPointer && (
            <PlacedPlayer
              src={mouseClick}
              top={topValues[handPosition]}
              left={leftValues[handPosition]}
              autoplay
              loop
            />
          )}
          <PageControl
            onReset={() => {
              setGGbLoaded(false)
              setIntro(true)
              setShowOptions(true)
            }}
            total={5}
            onChange={onPageChange}
            nextDisabled={pageKiller}
          />
          <div style={{ height: 180 }} />
        </DividedTemplate>
      </ScaleContextProvider>
    </AppletContainer>
  )
}

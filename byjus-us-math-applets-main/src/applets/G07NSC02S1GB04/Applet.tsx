import Fraction from 'fraction.js'
import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import styled from 'styled-components'

import { AppletContainer } from '@/common/AppletContainer'
import { Geogebra } from '@/common/Geogebra'
import { GeogebraAppApi } from '@/common/Geogebra/Geogebra.types'
import { TextHeader } from '@/common/Header'
import { Math as Latex } from '@/common/Math'
import { AppletInteractionCallback } from '@/contexts/analytics'
import { StepInput } from '@/molecules/StepInput'

import changeTooltip from './Elements/assets/changeTooltip.svg'
import oppositeTooltip from './Elements/assets/oppositeTooltip.svg'
import { Button } from './Elements/Button'
import { DivisionHolder, TextHolder, ToolTip } from './Elements/Elements'
import { fetchQuestion, QuestionsList } from './Elements/Questions'
import RadioButton from './Elements/RadioButton'
import ValueBox, { ShowBox } from './Elements/ValueBlocks'

const ButtonContainer = styled.div`
  position: absolute;
  top: 600px;

  height: 100px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
`

const Overlay = styled.div`
  height: 400px;
  width: 79%;
  overflow: hidden;
  position: absolute;
  left: 75px;
  top: 120px;
  border-radius: 15px;
  background-color: #f6f6f6;

  display: flex;
  align-items: center;
  justify-content: center;

  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;

  color: #444;
  z-index: 3;
`

const StyledGgb = styled(Geogebra)<{ opacity: number }>`
  height: 400px;
  width: 567px;
  overflow: hidden;
  position: absolute;
  left: 75px;
  top: 120px;
  opacity: ${(props) => props.opacity};
`
const ChangeTooltip = styled.img`
  position: absolute;
  left: 255px;
  top: 360px;
`
const TextBox = styled.div<{ padding: boolean; size: number; color: string }>`
  text-align: center;
  color: ${(props) => props.color};
  font-size: ${(props) => props.size}px;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  line-height: 32px;
  width: 100%;
  padding: ${(props) => (props.padding ? 10 : 0)}px;
  display: flex;
  align-items: center;
  justify-content: center;

  position: absolute;
  bottom: 180px;
  z-index: 5;
`

const ValueBoxHolder = styled.div<{ top: number }>`
  position: absolute;
  top: ${(p) => p.top}px;
  z-index: 10;
`
const OppositeTooltip = styled.div`
  position: absolute;
  left: 330px;
  top: 236px;
  div {
    position: absolute;
    width: 180px;
    top: 35%;
    left: 46%;
    translate: -50%;
    color: #444;
    text-align: center;
    font-family: Nunito;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 24px;
  }
`

const ButtonRetrieve: FC<{ handleClick: (index: number) => void; active: number }> = ({
  handleClick,
  active,
}) => {
  const texts: string[] = ['Integers', 'Decimals', 'Fractions']
  const buttons: JSX.Element[] = []

  for (let index = 0; index < 3; index++) {
    buttons.push(
      <RadioButton
        onClick={() => handleClick(index)}
        active={active === index}
        text={texts[index]}
        value={index}
      />,
    )
  }

  return <>{buttons}</>
}

const LatexText = styled.span`
  font-size: 20px;
`

export const AppletG07NSC02S1GB04: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const ggbApi = useRef<GeogebraAppApi | null>(null)
  const [active, setActive] = useState(3)
  // const [currentGgb, setCurrentGgb] = useState('')
  const [questionLet, setQuestionLet] = useState(QuestionsList.one)
  const [ggbLoaded, setGGBLoaded] = useState(false)
  const [loadGgb, setLoadGgb] = useState(false)
  const [buttonState, setButtonState] = useState('Next')
  const [fractionEntry, setFractionEntry] = useState(false)
  const [showAnswer, setShowAnswer] = useState(false)

  const [layer, setLayer] = useState(0)

  const [stepperVal, setStepperVal] = useState({ a: 'A', b: 'B', c: 'C', d: 'D' })

  const handleClick = (index: number) => {
    setActive(index)
    setButtonState('Next')
  }

  // useEffect(() => {
  //   console.log(layer)
  // }, [layer])

  useEffect(() => {
    if (active === 3) return
    setGGBLoaded(false)
    setQuestionLet(fetchQuestion(active))
  }, [active])

  const handleButtonClick = () => {
    switch (layer) {
      case 0:
        setLayer(2)
        setButtonState('Disable')
        setLoadGgb(true)
        break
      case 1:
        setButtonState('Next')
        setLayer(3)
        break
      case 1.5:
        setButtonState('Disable')
        if (questionLet.id === 2) {
          if (questionLet.id == 2) {
            ggbApi.current?.evalCommand('SetCoords(A,0,-2)')
          }
          setButtonState('Visualize')
          if (
            stepperVal.b != stepperVal.d &&
            parseFloat(stepperVal.a) !== 0 &&
            parseFloat(stepperVal.c) !== 0
          )
            setLayer(1)
          else setLayer(3)
        } else setLayer(3)
        break
      case 2:
        if (questionLet.id === 2) {
          if (!fractionEntry) {
            setButtonState('Disable')
            setFractionEntry(true)
          } else setLayer(1.5)
        } else setLayer(1.5)
        break
      case 3:
        setLayer(layer + 1)
        break
      case 4:
        if (questionLet.id === 2) {
          if (questionLet.id == 2) {
            ggbApi.current?.evalCommand('SetCoords(B,x(A),-2)')
          }
        }
        break
      case 5:
        setButtonState('Disable')
        setLayer(6)
        ggbApi.current?.evalCommand('SetCoords(B,x(A),-2)')
        break
      case 8:
        setShowAnswer(true)
        setButtonState('Try new')
        setLayer(9)
        break
      case 9:
        setShowAnswer(false)
        setLayer(0)
        setButtonState('Disable')
        setFractionEntry(false)
        setActive(3)
        setStepperVal({ a: 'A', b: 'B', c: 'C', d: 'D' })
        setLoadGgb(false)
    }
  }

  const handleGGBready = useCallback(
    (api: GeogebraAppApi | null) => {
      ggbApi.current = api
      setGGBLoaded(api != null)
    },
    [ggbApi],
  )

  useEffect(() => {
    if (ggbLoaded) {
      ggbApi.current?.registerObjectUpdateListener('layer', () => {
        if (ggbApi.current) {
          const ans = ggbApi.current?.getValue('layer')
          setLayer(ans)
        }
      })
    }

    return () => {
      ggbApi.current?.unregisterObjectUpdateListener('layer')
    }
  }, [ggbLoaded])

  useEffect(() => {
    if (!ggbLoaded) return
    ggbApi.current?.setValue('ansA', parseFloat(stepperVal.a))
    if (questionLet.id == 2 && parseFloat(stepperVal.a) === 0) ggbApi.current?.setValue('ansB', 1)
  }, [stepperVal.a, stepperVal])

  useEffect(() => {
    if (!ggbLoaded) return
    if (questionLet.id == 0)
      ggbApi.current?.setValue('ansB', parseFloat((Number(stepperVal.b) * -1).toString()))
    else ggbApi.current?.setValue('ansB', parseFloat(stepperVal.b))
    if (questionLet.id == 2 && parseFloat(stepperVal.a) === 0) ggbApi.current?.setValue('ansB', 1)
  }, [stepperVal.b, stepperVal])

  useEffect(() => {
    if (!ggbLoaded) return
    ggbApi.current?.setValue('c', parseFloat(stepperVal.c))
    if (parseFloat(stepperVal.c) === 0) ggbApi.current?.setValue('d', 1)
  }, [stepperVal.c, stepperVal])

  useEffect(() => {
    if (!ggbLoaded) return
    ggbApi.current?.setValue('d', parseFloat(stepperVal.d))
    if (parseFloat(stepperVal.c) === 0) ggbApi.current?.setValue('d', 1)
  }, [stepperVal.d, stepperVal])

  useEffect(() => {
    if (stepperVal.a != 'A' && stepperVal.b != 'B' && !fractionEntry) {
      setButtonState('Next')
    }
    if (stepperVal.c != 'C' && stepperVal.d != 'D') {
      setButtonState('Next')
    }
  }, [stepperVal])

  useEffect(() => {
    if (layer == 5) setButtonState('Next')
    if (layer == 8) setButtonState('Add')

    if (layer === 0) {
      setGGBLoaded(false)
      return
    }
    ggbApi.current?.setValue('layer', layer)
  }, [layer])

  const handleStep = (stepper: string, val: number) => {
    switch (stepper) {
      case 'A':
        setStepperVal({ a: val.toString(), b: stepperVal.b, c: stepperVal.c, d: stepperVal.d })
        break
      case 'B':
        setStepperVal({ a: stepperVal.a, b: val.toString(), c: stepperVal.c, d: stepperVal.d })
        break
      case 'C':
        setStepperVal({ a: stepperVal.a, b: stepperVal.b, c: val.toString(), d: stepperVal.d })
        break
      case 'D':
        setStepperVal({ a: stepperVal.a, b: stepperVal.b, c: stepperVal.c, d: val.toString() })
    }
  }

  const valueRetrieve = (type: string) => {
    switch (type) {
      case 'a':
        if (questionLet.id != 2) return stepperVal.a
        else
          return (
            <DivisionHolder
              numerator={
                layer === 2 ||
                stepperVal.b === stepperVal.d ||
                layer === 1.5 ||
                Number(stepperVal.c) === 0
                  ? stepperVal.a
                  : (parseFloat(stepperVal.a) * parseFloat(stepperVal.d)).toString()
              }
              denominator={
                layer == 2 ||
                stepperVal.b === stepperVal.d ||
                layer === 1.5 ||
                Number(stepperVal.c) === 0
                  ? stepperVal.b
                  : (parseFloat(stepperVal.b) * parseFloat(stepperVal.d)).toString()
              }
            />
          )
      case 'b':
        if (questionLet.id != 2)
          return layer === 2 ? stepperVal.b : (Number(stepperVal.b) * -1).toString()
        else
          return (
            <DivisionHolder
              numerator={
                layer === 2
                  ? stepperVal.c
                  : stepperVal.b === stepperVal.d || layer === 1.5 || Number(stepperVal.a) === 0
                  ? (Number(stepperVal.c) * -1).toString()
                  : (
                      parseFloat((Number(stepperVal.c) * -1).toString()) * parseFloat(stepperVal.b)
                    ).toString()
              }
              denominator={
                layer === 2 ||
                stepperVal.b === stepperVal.d ||
                layer === 1.5 ||
                Number(stepperVal.a) === 0
                  ? stepperVal.d
                  : (parseFloat(stepperVal.d) * parseFloat(stepperVal.b)).toString()
              }
            />
          )
      default:
        return <></>
    }
  }
  const answerRetrieve = () => {
    if (questionLet.id === 1)
      return (parseFloat(stepperVal.a) - parseFloat(stepperVal.b)).toFixed(1).toString()
    else if (questionLet.id === 0) {
      return (parseFloat(stepperVal.a) - parseFloat(stepperVal.b)).toString()
    } else {
      const frac1 = new Fraction(Number(stepperVal.a), Number(stepperVal.b))
      const frac2 = new Fraction(Number(stepperVal.c) * -1, Number(stepperVal.d))
      const result = frac1.add(frac2)

      if (stepperVal.b != stepperVal.d) {
        return (
          <DivisionHolder
            numerator={result.s === -1 ? (result.n * -1).toString() : result.n.toString()}
            denominator={result.d.toString()}
          />
        )
      } else {
        return (
          <DivisionHolder
            numerator={(
              parseFloat(stepperVal.a) + parseFloat((Number(stepperVal.c) * -1).toString())
            ).toString()}
            denominator={stepperVal.b}
          />
        )
      }
    }
  }
  const activeGgb = useMemo(
    () => (
      <StyledGgb
        key={questionLet.id}
        materialId={questionLet.ggbUrl}
        onApiReady={handleGGBready}
        opacity={ggbLoaded ? 1 : 0}
      />
    ),
    [ggbLoaded, questionLet],
  )
  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#f6f6f6',
        id: 'g07-nsc02-s1-gb04',
        onEvent,
        className,
        themeName: 'dark',
      }}
    >
      <TextHeader
        text={`Explore subtraction of rational numbers.`}
        backgroundColor="#f6f6f6"
        buttonColor="#1A1A1A"
      />
      {loadGgb ? (
        <>
          {layer != 2 ? (
            <ValueBoxHolder top={layer === 1.5 ? -21 : -140}>
              <ShowBox
                a={valueRetrieve('a')}
                b={valueRetrieve('b')}
                ans={showAnswer ? answerRetrieve() : ''}
                active={showAnswer}
                symbol={layer < 1 ? '-' : '+'}
              />
            </ValueBoxHolder>
          ) : null}
          {activeGgb}
        </>
      ) : null}
      {layer === 0 || layer === 2 ? (
        <>
          <Overlay>{layer === 0 ? <>Select the type of rational numbers.</> : null}</Overlay>
        </>
      ) : null}
      {layer === 1 ? (
        <ToolTip
          originalVals={stepperVal}
          formedNumerator={valueRetrieve('a')}
          formedDenominator={valueRetrieve('b')}
        />
      ) : null}
      {layer === 1.5 && <ChangeTooltip src={changeTooltip} alt="" />}
      {layer === 1.5 && (
        <OppositeTooltip>
          <img src={oppositeTooltip} />
          <div>
            {'Opposite of '}
            {questionLet.id === 2 ? (
              parseFloat(stepperVal.c) === 0 ? (
                stepperVal.c
              ) : (
                <LatexText>
                  <Latex>{String.raw`\frac{${stepperVal.c}}{${stepperVal.d}}`}</Latex>
                </LatexText>
              )
            ) : (
              stepperVal.b
            )}
            {' is '}
            {questionLet.id === 2 ? (
              parseFloat(stepperVal.c) === 0 ? (
                (Number(stepperVal.c) * -1).toString()
              ) : (
                <LatexText>
                  <Latex>{String.raw`\frac{${(Number(stepperVal.c) * -1).toString()}}{${
                    stepperVal.d
                  }}`}</Latex>
                </LatexText>
              )
            ) : (
              (Number(stepperVal.b) * -1).toString()
            )}{' '}
            {'.'}
          </div>
        </OppositeTooltip>
      )}
      {layer === 2 ? (
        <>
          <ValueBox a={valueRetrieve('a')} b={valueRetrieve('b')} symbol={layer <= 2 ? '-' : '+'} />
          {ggbLoaded && !fractionEntry ? (
            <ButtonContainer>
              <>
                <StepInput
                  showLabel
                  value={Number.isNaN(parseFloat(stepperVal.a)) ? 0 : parseFloat(stepperVal.a)}
                  label={'Value of ‘A’'}
                  onChange={(val) => {
                    handleStep('A', Number(val.toFixed(1)))
                  }}
                  min={questionLet.id === 2 ? questionLet.minNum : questionLet.min}
                  max={questionLet.id === 2 ? questionLet.maxNum : questionLet.max}
                  step={questionLet.step}
                  defaultValue={0}
                />
                <StepInput
                  showLabel
                  value={Number.isNaN(parseFloat(stepperVal.b)) ? 0 : parseFloat(stepperVal.b)}
                  label={'Value of ‘B’'}
                  onChange={(val) => handleStep('B', Number(val.toFixed(1)))}
                  min={questionLet.id === 2 ? questionLet.minDen : questionLet.min}
                  max={questionLet.id === 2 ? questionLet.maxDen : questionLet.max}
                  step={questionLet.step}
                  defaultValue={0}
                />
              </>
            </ButtonContainer>
          ) : null}
          {ggbLoaded && fractionEntry ? (
            <ButtonContainer>
              <>
                <StepInput
                  showLabel
                  label={'Value of ‘C’'}
                  value={Number.isNaN(parseFloat(stepperVal.c)) ? 0 : parseFloat(stepperVal.c)}
                  onChange={(val) => handleStep('C', Number(val.toFixed(1)))}
                  min={questionLet.id === 2 ? questionLet.minNum : questionLet.min}
                  max={questionLet.id === 2 ? questionLet.maxNum : questionLet.max}
                  step={questionLet.step}
                  defaultValue={0}
                />
                <StepInput
                  showLabel
                  label={'Value of ‘D’'}
                  value={Number.isNaN(parseFloat(stepperVal.d)) ? 0 : parseFloat(stepperVal.d)}
                  onChange={(val) => handleStep('D', Number(val.toFixed(1)))}
                  min={questionLet.id === 2 ? questionLet.minDen : questionLet.min}
                  max={questionLet.id === 2 ? questionLet.maxDen : questionLet.max}
                  step={questionLet.step}
                  defaultValue={0}
                />
              </>
            </ButtonContainer>
          ) : null}
        </>
      ) : null}
      {layer === 0 ? (
        <ButtonContainer>{ButtonRetrieve({ handleClick, active })}</ButtonContainer>
      ) : null}
      <TextBox padding={false} size={20} color="#444">
        <TextHolder
          id={questionLet.id}
          stepperVals={stepperVal}
          a={valueRetrieve('a')}
          b={valueRetrieve('b')}
          layer={layer}
        />
      </TextBox>
      {active != 3 ? (
        questionLet.id != 2 ? (
          <Button buttonType={buttonState} onClick={handleButtonClick} />
        ) : layer != 3 ? (
          <Button buttonType={buttonState} onClick={handleButtonClick} />
        ) : null
      ) : null}
    </AppletContainer>
  )
}

import { FC, useEffect, useState } from 'react'
import styled from 'styled-components'

import { OnboardingAnimation } from '@/atoms/OnboardingAnimation'
import { OnboardingController } from '@/atoms/OnboardingController'
import { OnboardingStep } from '@/atoms/OnboardingStep'
import { useStep } from '@/hooks/useStep'
import { StepInput } from '@/molecules/StepInput'

import {
  DivisionConclusionText,
  DivisionFeedBackFromValues,
  ExpandedDivision,
  FinalDivision,
  ValueDivision,
} from './Division'
import {
  Cell,
  COLOR_1,
  COLOR_2,
  Container,
  CTAButton,
  CTAContainer,
  FeedBackText,
  HLine,
  StepperContainer,
  StepperLabel,
  Table,
  Text,
  TitleRow,
  VLine,
} from './ExponentTable.styles'
import { ExponentTableProps } from './ExponentTable.types'
import iconFindPatterns from './find-patterns.svg'
import {
  DivisionGroupConclusionText,
  DivisionGroupFeedBackFromValues,
  ExpandedDivisionGroup,
  ExpandedProductGroup,
  FinalDivisionGroup,
  FinalProductGroup,
  ProductGroupConclusionText,
  ProductGroupFeedBackFromValues,
  ValueDivisionGroup,
  ValueProductGroup,
} from './GroupExponent'
import { InteractiveRow } from './InteractiveRow'
import {
  ExpandedPower,
  FinalPower,
  PowerConclusionText,
  PowerFeedBackFromValues,
  ValuePower,
} from './Power'
import {
  ExpandedProduct,
  FinalProduct,
  ProductConclusionText,
  ProductFeedBackFromValues,
  ValueProduct,
} from './Product'
import iconReset from './reset.svg'
import iconSimplify from './simplify.svg'

const ClickAnimation = styled(OnboardingAnimation).attrs(() => ({ type: 'click' }))`
  position: absolute;
  left: 320px;
  top: 700px;
`

export const ExponentTable: FC<ExponentTableProps> = ({ type }) => {
  const [valueA, setValueA] = useState(0)
  const [valueN, setValueN] = useState(0)
  const [valueM, setValueM] = useState(0)
  const [values, setValues] = useState([
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ])
  const [step, { goToNextStep, reset }] = useStep(0, 7)

  const [stepperState, setStepperState] = useState<0 | 1 | 2 | 3>(0)

  const [ctaState, setCtaState] = useState<
    'simplify' | 'simplify-disabled' | 'next' | 'find-pattern' | 'reset'
  >('simplify-disabled')

  useEffect(() => {
    if (valueA > 0) setStepperState((s) => (s === 0 ? 1 : s))
  }, [valueA])

  useEffect(() => {
    if (valueM > 0) setStepperState((s) => (s === 1 ? 2 : s))
  }, [valueM])

  useEffect(() => {
    if (valueN > 0) setStepperState(3)
  }, [valueN])

  useEffect(() => {
    setValues((vals) =>
      vals.map((arr, i) => arr.map((n, j) => (j === 0 && i === step / 2 ? valueA : n))),
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valueA])

  useEffect(() => {
    setValues((vals) =>
      vals.map((arr, i) => arr.map((n, j) => (j === 1 && i === step / 2 ? valueM : n))),
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valueM])

  useEffect(() => {
    setValues((vals) =>
      vals.map((arr, i) => arr.map((n, j) => (j === 2 && i === step / 2 ? valueN : n))),
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valueN])

  useEffect(() => {
    if (stepperState === 3) setCtaState('simplify')
  }, [stepperState])

  useEffect(() => {
    switch (step) {
      case 0:
      case 2:
      case 4:
        setStepperState(0)
        setCtaState('simplify-disabled')
        break

      case 1:
      case 3:
      case 5:
        setCtaState('next')
        break
      case 6:
        setCtaState('find-pattern')
        break
      case 7:
        setCtaState('reset')
        break

      default:
        break
    }
  }, [step])

  let valueCell = ValueProduct
  let expandedCell = ExpandedProduct
  let finalCell = FinalProduct
  let FeedBackFromValues = ProductFeedBackFromValues
  let ConclusionText = ProductConclusionText
  let name1 = 'a'
  let name2 = 'm'
  let name3 = 'n'
  let color1 = '#646464'
  let color2 = COLOR_1
  let color3 = COLOR_2

  switch (type) {
    case 'product':
      valueCell = ValueProduct
      expandedCell = ExpandedProduct
      finalCell = FinalProduct
      FeedBackFromValues = ProductFeedBackFromValues
      ConclusionText = ProductConclusionText
      name1 = 'a'
      name2 = 'm'
      name3 = 'n'
      color1 = '#646464'
      color2 = COLOR_1
      color3 = COLOR_2
      break

    case 'division':
      valueCell = ValueDivision
      expandedCell = ExpandedDivision
      finalCell = FinalDivision
      FeedBackFromValues = DivisionFeedBackFromValues
      ConclusionText = DivisionConclusionText
      name1 = 'a'
      name2 = 'm'
      name3 = 'n'
      color1 = '#646464'
      color2 = COLOR_1
      color3 = COLOR_2
      break

    case 'power':
      valueCell = ValuePower
      expandedCell = ExpandedPower
      finalCell = FinalPower
      FeedBackFromValues = PowerFeedBackFromValues
      ConclusionText = PowerConclusionText
      name1 = 'a'
      name2 = 'm'
      name3 = 'n'
      color1 = '#646464'
      color2 = COLOR_1
      color3 = COLOR_2
      break

    case 'product-group':
      valueCell = ValueProductGroup
      expandedCell = ExpandedProductGroup
      finalCell = FinalProductGroup
      FeedBackFromValues = ProductGroupFeedBackFromValues
      ConclusionText = ProductGroupConclusionText
      name1 = 'a'
      name2 = 'b'
      name3 = 'm'
      color1 = COLOR_1
      color2 = COLOR_2
      color3 = '#646464'
      break

    case 'division-group':
      valueCell = ValueDivisionGroup
      expandedCell = ExpandedDivisionGroup
      finalCell = FinalDivisionGroup
      FeedBackFromValues = DivisionGroupFeedBackFromValues
      ConclusionText = DivisionGroupConclusionText
      name1 = 'a'
      name2 = 'b'
      name3 = 'm'
      color1 = COLOR_1
      color2 = COLOR_2
      color3 = '#646464'
      break

    default:
      break
  }

  return (
    <OnboardingController>
      <Container>
        <Table>
          <TitleRow>
            <Cell>
              <Text>Expression</Text>
            </Cell>
            <VLine />
            <Cell>
              <Text>Expanded form</Text>
            </Cell>
            <VLine />
            <Cell isActive={step === 7}>
              <Text>Exponential form</Text>
            </Cell>
          </TitleRow>
          <HLine />
          <InteractiveRow
            valueCell={valueCell}
            expandedCell={expandedCell}
            finalCell={finalCell}
            a={values[0][0]}
            m={values[0][1]}
            n={values[0][2]}
            simplify={step > 0}
            isActive={step === 0 || step === 1}
            isLastColumnActive={step === 7}
          />
          <HLine />
          {step > 1 && (
            <>
              <InteractiveRow
                valueCell={valueCell}
                expandedCell={expandedCell}
                finalCell={finalCell}
                a={values[1][0]}
                m={values[1][1]}
                n={values[1][2]}
                simplify={step > 2}
                isActive={step === 2 || step === 3}
                isLastColumnActive={step === 7}
              />
              <HLine />
            </>
          )}
          {step > 3 && (
            <InteractiveRow
              valueCell={valueCell}
              expandedCell={expandedCell}
              finalCell={finalCell}
              a={values[2][0]}
              m={values[2][1]}
              n={values[2][2]}
              simplify={step > 4}
              isActive={step === 4 || step === 5}
              isLastColumnActive={step === 7}
            />
          )}
        </Table>
        <FeedBackText>
          <Text>
            {step === 1 || step === 3 || step === 5 ? (
              <FeedBackFromValues {...{ valueA, valueM, valueN }} />
            ) : step === 6 ? (
              <>Do you recognize a pattern here?</>
            ) : step === 7 ? (
              <ConclusionText />
            ) : null}
          </Text>
        </FeedBackText>
        <StepperContainer>
          {(ctaState === 'simplify' || ctaState === 'simplify-disabled') && (
            <>
              <OnboardingStep index={0}>
                <StepInput
                  min={1}
                  max={4}
                  defaultValue={0}
                  defaultValueDisplay="?"
                  onChange={setValueA}
                  label={() => (
                    <StepperLabel color={color1}>
                      Value of &ldquo;<span>{name1}</span>&rdquo;
                    </StepperLabel>
                  )}
                />
              </OnboardingStep>
              <OnboardingStep index={1}>
                <StepInput
                  min={1}
                  max={type === 'power' ? 2 : 4}
                  defaultValue={0}
                  defaultValueDisplay="?"
                  onChange={setValueM}
                  label={() => (
                    <StepperLabel color={color2}>
                      Value of &ldquo;<span>{name2}</span>&rdquo;
                    </StepperLabel>
                  )}
                  disabled={stepperState < 1}
                />
              </OnboardingStep>
              <OnboardingStep index={2}>
                <StepInput
                  min={1}
                  max={
                    type === 'power' || type === 'division-group' || type === 'product-group'
                      ? 3
                      : 4
                  }
                  defaultValue={0}
                  defaultValueDisplay="?"
                  onChange={setValueN}
                  label={() => (
                    <StepperLabel color={color3}>
                      Value of &ldquo;<span>{name3}</span>&rdquo;
                    </StepperLabel>
                  )}
                  disabled={stepperState < 2}
                />
              </OnboardingStep>
            </>
          )}
        </StepperContainer>
        <CTAContainer>
          <CTAButton
            onClick={() => (ctaState === 'reset' ? reset() : goToNextStep())}
            disabled={ctaState === 'simplify-disabled'}
          >
            {ctaState === 'simplify' || ctaState === 'simplify-disabled' ? (
              <>
                <img src={iconSimplify} />
                Simplify
              </>
            ) : ctaState === 'next' ? (
              <>Next</>
            ) : ctaState === 'find-pattern' ? (
              <>
                <img src={iconFindPatterns} />
                Find Pattern
              </>
            ) : ctaState === 'reset' ? (
              <>
                <img src={iconReset} />
                Reset
              </>
            ) : null}
          </CTAButton>
        </CTAContainer>
      </Container>
      <OnboardingStep index={3}>
        <ClickAnimation complete={ctaState === 'next'} />
      </OnboardingStep>
    </OnboardingController>
  )
}

import React, { FC, useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'

import { OnboardingController } from '@/atoms/OnboardingController'
import { OnboardingStep } from '@/atoms/OnboardingStep'
import {
  AbsolutePosition,
  DisplayFlexJutifyAlignCenter,
  SpecifyBackground,
  SpecifyWidthHeight,
} from '@/common/StyledComponents/StyledTemplates'
import { useSFX } from '@/hooks/useSFX'
import { mix } from '@/utils/math'

import { BottomText, Button, ButtonHolder, OnboardingAnim } from '../appletStyles'
// import tableImg from '../assets/table/Table.svg'
import tryNewIcon from '../assets/tryNew.svg'
import InputField, { InputState } from './InputField'
interface props {
  onComplete: () => void
}

const AbsolutePos = styled.div`
  ${AbsolutePosition}
`

const Cell = styled.div`
  ${DisplayFlexJutifyAlignCenter}
  ${SpecifyBackground}
  font-family: Nunito;
  font-size: 20px;
  font-weight: 700;
  line-height: 28px;
  letter-spacing: 0px;
  text-align: center;
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: repeat(5, 1fr);
  height: 269px;
  width: 379px;
  border-radius: 10px;
  border: 1px solid #bcd3ff;
  overflow: hidden;
  grid-gap: 1px;
  background-color: #bcd3ff;
`

const ColorPreview = styled.div<{ color: string }>`
  background-color: ${(a) => a.color};
  width: 90%;
  border-radius: 10px;
  height: 70%;
  border: 1px solid #1a1a1a;
`

const Bridge = styled.div<{ color: string }>`
  width: 10px;
  height: 40px;
  background-color: ${(a) => a.color};
`

const WHITE = 255
const findBLueRgbAccordingToRatio = (
  numOfWhite: number,
  numOfBlue: number,
  targetRgbArr: number[],
) => {
  const BLUE_R = (targetRgbArr[0] * (numOfBlue + numOfWhite) - numOfWhite * WHITE) / numOfBlue

  const BLUE_G = (targetRgbArr[1] * (numOfBlue + numOfWhite) - numOfWhite * WHITE) / numOfBlue

  const BLUE_B = (targetRgbArr[2] * (numOfBlue + numOfWhite) - numOfWhite * WHITE) / numOfBlue

  return { BLUE_B, BLUE_G, BLUE_R }
}

const checkIfCorrectAnswer = (criteria: number, userEnteredVal: number) => {
  if (criteria == userEnteredVal) return true
  else return false
}

const findStateOfInput = (
  currentIndex: number,
  inputIndex: number,
  criteria: number,
  userEnteredValue: number,
  isCheckBtnPressed: boolean,
): InputState => {
  if (currentIndex > inputIndex) {
    //already entered
    return 'correct'
  } else if (currentIndex == inputIndex) {
    if (isCheckBtnPressed) {
      if (userEnteredValue === criteria) {
        //one ratio multiplied by
        return 'default'
      } else if (userEnteredValue == 0) {
        return 'default'
      } else {
        return 'wrong'
      }
    }
    return 'default'
  }
  return 'locked'
}

const ColorTable: FC<props> = ({ onComplete }) => {
  const [userInputCell21, setUserInputCell21] = useState(0)
  const [userInputCell32, setUserInputCell32] = useState(0)
  const [userInputCell41, setUserInputCell41] = useState(0)

  const playCorrectAnswerSfx = useSFX('correct')
  const playWrongAnswerSfx = useSFX('incorrect')

  const [currentInputIndesx, setCurrentInputIndex] = useState(0)
  const [isCheckBtnPressed, setIsCheckBtnPressed] = useState(false)
  const [ratio1] = useState(Math.round(Math.random() * 3) + 1)
  const ratio2 = useMemo(() => {
    const tmp = Math.round(Math.random() * 3) + 1
    if (tmp == ratio1) {
      if (tmp === 4) {
        return 3
      } else return tmp + 1
    }

    return tmp
  }, [ratio1])

  const { BLUE_B, BLUE_G, BLUE_R } = findBLueRgbAccordingToRatio(ratio1, ratio2, [103, 211, 244])
  const colorMixing = useCallback(
    (numOfWhite: number, numOfBlue: number) => {
      const r = Math.min(Math.max(mix(WHITE, numOfWhite, BLUE_R, numOfBlue), 0), 255)
      const g = Math.min(Math.max(mix(WHITE, numOfWhite, BLUE_G, numOfBlue), 0), 255)
      const b = Math.min(Math.max(mix(WHITE, numOfWhite, BLUE_B, numOfBlue), 0), 255)

      return `rgb(${r},${g},${b})`
    },
    [BLUE_B, BLUE_G, BLUE_R],
  )

  const row1Color = colorMixing(ratio2, ratio1)
  const row2Color = colorMixing(ratio2 * 4, userInputCell21)
  const row3Color = colorMixing(userInputCell32, ratio1 * 2)
  const row4Color = colorMixing(ratio2 * 3, userInputCell41)

  const handleCheckBtn = () => {
    setIsCheckBtnPressed(true)

    const flipTheBool = setTimeout(() => {
      setIsCheckBtnPressed(false)
    }, 1000)

    if (isAnswerCorrect()) {
      setCurrentInputIndex((prev) => prev + 1)
      playCorrectAnswerSfx()
    } else {
      playWrongAnswerSfx()
    }

    return () => {
      clearTimeout(flipTheBool)
    }
  }

  const isAnswerCorrect = () => {
    switch (currentInputIndesx) {
      case 0:
        return userInputCell21 === ratio1 * 4
      case 1:
        return userInputCell32 === ratio2 * 2
      case 2:
        return userInputCell41 === ratio1 * 3
      default:
        return false
    }
  }

  const isCheckBtnDisabled = () => {
    switch (currentInputIndesx) {
      case 0:
        return userInputCell21 > 0
      case 1:
        return userInputCell32 > 0
      case 2:
        return userInputCell41 > 0
      default:
        return false
    }
  }

  return (
    <div>
      <OnboardingController>
        {/* <Container>
          <Bg>
            <img src={tableImg} />
          </Bg>
        </Container> */}
        <AbsolutePos top={135} left={170}>
          <Grid>
            <Cell background="#F3F7FE">Blue cans</Cell>
            <Cell background="#F3F7FE">White cans</Cell>
            <Cell background="#F3F7FE">Colors</Cell>
            <Cell background="#fff">
              {/* cell-1-1 */}
              {ratio1}
            </Cell>
            <Cell background="#fff">
              {/* cell-1-2 */}
              {ratio2}
            </Cell>
            <Cell background="#fff">
              {/* cell-1-3 */}
              <ColorPreview color={row1Color} />
            </Cell>
            {currentInputIndesx > 0 && (
              <AbsolutePos left={310} top={93}>
                <Bridge color={row1Color} />
              </AbsolutePos>
            )}

            <Cell
              background={
                currentInputIndesx === 0 ? '#FAF2FF' : currentInputIndesx < 0 ? '#F6F6F6' : '#fff'
              }
            >
              {/* cell-2-1 */}
              <InputField
                onChange={setUserInputCell21}
                state={findStateOfInput(
                  currentInputIndesx,
                  0,
                  ratio1 * 4,
                  userInputCell21,
                  isCheckBtnPressed,
                )}
              />
            </Cell>
            <Cell
              background={
                currentInputIndesx === 0 ? '#FAF2FF' : currentInputIndesx < 0 ? '#F6F6F6' : '#fff'
              }
            >
              {/* cell-2-2 */}
              {ratio2 * 4}
            </Cell>
            <Cell
              background={
                currentInputIndesx === 0 ? '#FAF2FF' : currentInputIndesx < 0 ? '#F6F6F6' : '#fff'
              }
            >
              {/* cell-2-3 */} <ColorPreview color={row2Color} />
            </Cell>
            {currentInputIndesx > 1 && (
              <AbsolutePos left={310} top={143}>
                <Bridge color={row1Color} />
              </AbsolutePos>
            )}

            <Cell
              background={
                currentInputIndesx === 1 ? '#FAF2FF' : currentInputIndesx < 1 ? '#F6F6F6' : '#fff'
              }
            >
              {/* cell-3-1 */}
              {ratio1 * 2}
            </Cell>
            <Cell
              background={
                currentInputIndesx === 1 ? '#FAF2FF' : currentInputIndesx < 1 ? '#F6F6F6' : '#fff'
              }
            >
              {/* cell-3-2 */}
              <InputField
                onChange={setUserInputCell32}
                state={findStateOfInput(
                  currentInputIndesx,
                  1,
                  ratio2 * 2,
                  userInputCell32,
                  isCheckBtnPressed,
                )}
              />
            </Cell>
            <Cell
              background={
                currentInputIndesx === 1 ? '#FAF2FF' : currentInputIndesx < 1 ? '#F6F6F6' : '#fff'
              }
            >
              {/* cell-3-3 */}
              <ColorPreview color={row3Color} />
            </Cell>
            <Cell
              background={
                currentInputIndesx === 2 ? '#FAF2FF' : currentInputIndesx < 2 ? '#F6F6F6' : '#fff'
              }
            >
              {/* cell-4-1 */}
              <InputField
                onChange={setUserInputCell41}
                state={findStateOfInput(
                  currentInputIndesx,
                  2,
                  ratio1 * 3,
                  userInputCell41,
                  isCheckBtnPressed,
                )}
              />
            </Cell>
            <Cell
              background={
                currentInputIndesx === 2 ? '#FAF2FF' : currentInputIndesx < 2 ? '#F6F6F6' : '#fff'
              }
            >
              {/* cell-4-2 */}
              {ratio2 * 3}
            </Cell>
            <Cell
              background={
                currentInputIndesx === 2 ? '#FAF2FF' : currentInputIndesx < 2 ? '#F6F6F6' : '#fff'
              }
            >
              {/* cell-4-3 */}
              <ColorPreview color={row4Color} />
            </Cell>
            {currentInputIndesx > 2 && (
              <AbsolutePos left={310} top={197}>
                <Bridge color={row1Color} />
              </AbsolutePos>
            )}
          </Grid>
        </AbsolutePos>
        <BottomText>
          {currentInputIndesx < 3 ? (
            <>Fill the correct value in missing box to form the given color.</>
          ) : (
            <>
              Great! You have formed same colors because ratios of white cans to blue cans are in
              proportion.
            </>
          )}
        </BottomText>
        <ButtonHolder>
          {currentInputIndesx < 3 ? (
            <Button isActive={isCheckBtnDisabled()} onClick={() => handleCheckBtn()}>
              Check
            </Button>
          ) : (
            <Button isActive onClick={() => onComplete()}>
              <img src={tryNewIcon} />
              Try new
            </Button>
          )}
        </ButtonHolder>
        <OnboardingStep index={0}>
          <OnboardingAnim complete={userInputCell21 > 0} left={154} top={225} type="click" />
        </OnboardingStep>
        {currentInputIndesx === 1 && (
          <OnboardingStep index={1}>
            <OnboardingAnim complete={userInputCell32 > 0} left={284} top={285} type="click" />
          </OnboardingStep>
        )}
      </OnboardingController>
    </div>
  )
}

export default ColorTable

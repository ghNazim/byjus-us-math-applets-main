import { Player } from '@lottiefiles/react-lottie-player'
import { FC, useEffect, useState } from 'react'
import styled from 'styled-components'
import { Stage, useTransition } from 'transition-hook'

import { useInterval } from '@/hooks/useInterval'

import handClick from '../../../common/handAnimations/click.json'

const QuestionText = styled.div<{ highlight: boolean }>`
  width: 604px;
  border: 1px solid #c882fa;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  align-items: center;
  padding: 15px 30px;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 400;
  font-size: 20px;
  line-height: 28px;
  text-align: center;
  margin-bottom: 20px;
  span {
    font-weight: 700;
    ${(props) => (props.highlight ? 'background: #FFDC73;' : '')}
  }
`
const EquationText = styled.div`
  width: 710px;
  p {
    font-family: 'Nunito';
    font-style: normal;
    font-weight: 400;
    font-size: 20px;
    line-height: 28px;
    color: #646464;
    text-align: center;
    margin: 10px;
    align-items: center;
    display: flex;
    justify-content: center;
    span {
      background: #ffe3ad;
      border-radius: 5px;
      padding: 0 5px;
      height: 22px;
      align-items: center;
      display: flex;
      margin: 0 5px;
    }
  }
`
const ClickBox = styled.div<{ width: number }>`
  display: inline-block;
  background: #e8f0fe;
  width: ${(props) => props.width}px;
  border: 1px solid #428c94;
  border-radius: 5px;
  height: 26px;
  margin: 0 5px;
  position: relative;
  cursor: pointer;
`
const OptionsContainer = styled.button<{ stage: Stage; width: number }>`
  position: absolute;
  top: 130%;
  left: 50%;
  translate: -50%;
  display: flex;
  width: ${(props) => props.width}px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 6px;
  gap: 6px;
  background: #e8f0fe;
  border: #81b3ff !important;
  border-radius: 15px;
  opacity: ${(props) => (props.stage !== 'enter' ? 0 : 1)};
  transition: opacity 350ms;
  ::after {
    content: ' ';
    position: absolute;
    left: 50%;
    translate: -50%;
    top: -6px;
    border-top: none;
    border-right: 10px solid transparent;
    border-left: 10px solid transparent;
    border-bottom: 10px solid #e8f0fe;
  }
`
const Option = styled.button<{ highlight: string }>`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 11px 24px;
  border-radius: 10px;
  border: none;
  width: 98%;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 500;
  font-size: 24px;
  line-height: 141.4%;
  background: ${(props) =>
    props.highlight == 'green' ? '#9EFFB6' : props.highlight == 'red' ? '#FFD1D1' : '#ffffff'};
  border: 1px solid
    ${(props) =>
      props.highlight == 'green' ? '#32A66C' : props.highlight == 'red' ? '#BA5471' : '#ffffff'};
  color: ${(props) =>
    props.highlight == 'green' ? '#32A66C' : props.highlight == 'red' ? '#CF6D6D' : '#81b3ff'};
  cursor: pointer;
  :hover {
    background: ${(props) =>
      props.highlight == 'green'
        ? '#9EFFB6'
        : props.highlight == 'red'
        ? '#FFD1D1'
        : 'rgba(129, 179, 255, 0.1)'};
    border: 1px solid
      ${(props) =>
        props.highlight == 'green' ? '#32A66C' : props.highlight == 'red' ? '#BA5471' : '#8c69ff'};
    color: ${(props) =>
      props.highlight == 'green' ? '#32A66C' : props.highlight == 'red' ? '#CF6D6D' : '#81b3ff'};
  }
`
const ClickPlayer = styled(Player)<{ top: number; right: number }>`
  position: absolute;
  top: ${(props) => props.top}px;
  right: ${(props) => props.right}px;
  pointer-events: none;
`
const questionPartOne = [
  ['The sum of ', 'The ', '', 'The sum of two times a number and 4 is 12.'],
  ['2 when subtracted from ', '', '', '2 when subtracted from three times a number gives 16.'],
  ['$10 more than ', '', '', '$10 more than twice the cost of a pizza is $20.'],
  [
    'The ',
    'The cost of a pencil is $3. Four times the cost of a pencil and ',
    'The cost of a pencil is $3. ',
    '',
    'The cost of a pencil is $3. Four times the cost of a pencil and twice the cost of an eraser is $18.',
  ],
]
const questionPartBold = [
  [
    'two times a number',
    'sum of two times a number and 4',
    'The sum of two times a number and 4 is 12.',
    '',
  ],
  [
    'three times a number',
    '2 when subtracted from three times a number',
    '2 when subtracted from three times a number gives 16.',
    '',
  ],
  [
    'twice the cost of a pizza',
    '$10 more than twice the cost of a pizza',
    '$10 more than twice the cost of a pizza is $20.',
    '',
  ],
  [
    'cost of a pencil is $3. Four times the cost of a pencil',
    'twice the cost of an eraser',
    'Four times the cost of a pencil and twice the cost of an eraser',
    'The cost of a pencil is $3. Four times the cost of a pencil and twice the cost of an eraser is $18.',
    '',
  ],
]
const questionPartThree = [
  [' and 4 is 12.', ' is 12.', '', ''],
  [' gives 16.', ' gives 16.', '', ''],
  [' is $20.', ' is $20.', '', ''],
  [' and twice the cost of an eraser is $18.', ' is $18.', ' is $18.', '', ''],
]
interface FormingEquationsProps {
  questionNumber: number
  onNextEnable: (value: boolean) => void
}
export const FormingEquations: FC<FormingEquationsProps> = ({
  questionNumber = 0,
  onNextEnable,
}) => {
  const [displaySection, setDisplaySection] = useState(0)
  const [wrongHighlight, setWrongHighlight] = useState(false)
  const [displayDropDown, setDisplayDropDown] = useState(false)
  const [displayHand, setDisplayHand] = useState(true)
  const { shouldMount, stage } = useTransition(displayDropDown, 350)
  const [optionHighlight, setOptionHighlight] = useState<Array<'none' | 'green' | 'red'>>([
    'none',
    'none',
    'none',
    'none',
  ])
  const [closeDD, setCloseDD] = useState(false)
  useInterval(
    () => {
      setDisplayDropDown(false)
      setCloseDD(false)
      setDisplaySection((d) => d + 1)
      setOptionHighlight((v) => {
        let d = [...v]
        d = ['none', 'none', 'none', 'none']
        return d
      })
    },
    closeDD ? 800 : null,
  )
  const optionClicked = (value: boolean, option: number) => {
    if (value) {
      setCloseDD(true)
      setOptionHighlight((v) => {
        let d = [...v]
        d = ['none', 'none', 'none', 'none']
        d[option] = 'green'
        return d
      })
      setWrongHighlight(false)
    } else {
      setOptionHighlight((v) => {
        let d = [...v]
        d = ['none', 'none', 'none', 'none']
        d[option] = 'red'
        return d
      })
      setWrongHighlight(true)
    }
  }
  useEffect(() => {
    switch (questionNumber) {
      case 0:
        if (displaySection == 3) onNextEnable(true)
        break
      case 1:
        if (displaySection == 3) onNextEnable(true)
        break
      case 2:
        if (displaySection == 3) onNextEnable(true)
        break
      case 3:
        if (displaySection == 4) onNextEnable(true)
        break
    }
  }, [displaySection])
  return (
    <>
      {questionNumber == 0 && (
        <>
          <QuestionText highlight={wrongHighlight}>
            {questionPartOne[questionNumber][displaySection]}
            <span>{questionPartBold[questionNumber][displaySection]}</span>
            {questionPartThree[questionNumber][displaySection]}
          </QuestionText>
          <EquationText>
            <p>
              Let the number be <span>x</span>
            </p>
            {displaySection > 0 && (
              <p>
                Two times the number will be <span>2x</span>
              </p>
            )}
            {displaySection > 1 && (
              <p>
                Sum of two times the number and 4 will be <span>2x</span> + <span>4</span>
              </p>
            )}

            {displaySection > 2 && (
              <>
                <p>
                  The equation becomes: <span>2x</span> + <span>4</span> = <span>12</span>
                </p>
                <p style={{ margin: '120px 10px 20px 10px', fontWeight: '700' }}>
                  The final equation can be written as
                </p>
                <p>2x + 4 = 12</p>
              </>
            )}
            {displaySection == 0 && (
              <p>
                Two times the number will be
                <ClickBox
                  width={36}
                  onClick={() => {
                    if (!displayDropDown) setDisplayDropDown(true)
                  }}
                >
                  {displayDropDown && (
                    <OptionsContainer {...{ stage }} width={75}>
                      <Option
                        onClick={() => {
                          optionClicked(false, 0)
                          setDisplayHand(false)
                        }}
                        highlight={optionHighlight[0]}
                      >
                        {'1'}
                      </Option>
                      <Option
                        onClick={() => {
                          optionClicked(true, 1)
                          setDisplayHand(false)
                        }}
                        highlight={optionHighlight[1]}
                      >
                        {'2'}
                      </Option>
                      <Option
                        onClick={() => {
                          optionClicked(false, 2)
                          setDisplayHand(false)
                        }}
                        highlight={optionHighlight[2]}
                      >
                        {'3'}
                      </Option>
                      <Option
                        onClick={() => {
                          optionClicked(false, 3)
                          setDisplayHand(false)
                        }}
                        highlight={optionHighlight[3]}
                      >
                        {'4'}
                      </Option>
                    </OptionsContainer>
                  )}
                </ClickBox>
                <span>x</span>
                {displayDropDown && displayHand && (
                  <ClickPlayer src={handClick} autoplay loop top={255} right={165} />
                )}
              </p>
            )}
            {displaySection == 1 && (
              <p>
                Sum of two times the number and 4 will be <span>2x</span>
                <ClickBox
                  width={32}
                  onClick={() => {
                    if (!displayDropDown) setDisplayDropDown(true)
                  }}
                >
                  {displayDropDown && (
                    <OptionsContainer {...{ stage }} width={75}>
                      <Option
                        onClick={() => {
                          optionClicked(true, 0)
                        }}
                        highlight={optionHighlight[0]}
                      >
                        {'+'}
                      </Option>
                      <Option
                        onClick={() => {
                          optionClicked(false, 1)
                        }}
                        highlight={optionHighlight[1]}
                      >
                        {'-'}
                      </Option>
                      <Option
                        onClick={() => {
                          optionClicked(false, 2)
                        }}
                        highlight={optionHighlight[2]}
                      >
                        &times;
                      </Option>
                      <Option
                        onClick={() => {
                          optionClicked(false, 3)
                        }}
                        highlight={optionHighlight[3]}
                      >
                        &divide;
                      </Option>
                    </OptionsContainer>
                  )}
                </ClickBox>
                <span>4</span>
              </p>
            )}
            {displaySection == 2 && (
              <p>
                The equation becomes: <span>2x</span> + <span>4</span> =
                <ClickBox
                  width={40}
                  onClick={() => {
                    if (!displayDropDown) setDisplayDropDown(true)
                  }}
                >
                  {displayDropDown && (
                    <OptionsContainer {...{ stage }} width={75}>
                      <Option
                        onClick={() => {
                          optionClicked(false, 0)
                        }}
                        highlight={optionHighlight[0]}
                      >
                        {'12x'}
                      </Option>
                      <Option
                        onClick={() => {
                          optionClicked(false, 1)
                        }}
                        highlight={optionHighlight[1]}
                      >
                        {'2'}
                      </Option>
                      <Option
                        onClick={() => {
                          optionClicked(true, 2)
                        }}
                        highlight={optionHighlight[2]}
                      >
                        {'12'}
                      </Option>
                      <Option
                        onClick={() => {
                          optionClicked(false, 3)
                        }}
                        highlight={optionHighlight[3]}
                      >
                        {'6'}
                      </Option>
                    </OptionsContainer>
                  )}
                </ClickBox>
              </p>
            )}
          </EquationText>
        </>
      )}
      {questionNumber == 1 && (
        <>
          <QuestionText highlight={wrongHighlight}>
            {questionPartOne[questionNumber][displaySection]}
            <span>{questionPartBold[questionNumber][displaySection]}</span>
            {questionPartThree[questionNumber][displaySection]}
          </QuestionText>
          <EquationText>
            <p>
              Let the number be <span>x</span>
            </p>
            {displaySection > 0 && (
              <p>
                Three times the number will be <span>3x</span>
              </p>
            )}
            {displaySection > 1 && (
              <p>
                2 when subtracted from three times the number: <span>3x</span> - <span>2</span>
              </p>
            )}
            {displaySection > 2 && (
              <>
                <p>
                  The equation becomes: <span>3x</span> - <span>2</span> = <span>16</span>
                </p>
                <p style={{ margin: '120px 10px 20px 10px', fontWeight: '700' }}>
                  The final equation can be written as
                </p>
                <p>3x - 2 = 16</p>
              </>
            )}
            {displaySection == 0 && (
              <p>
                Three times the number will be
                <ClickBox
                  width={36}
                  onClick={() => {
                    if (!displayDropDown) setDisplayDropDown(true)
                  }}
                >
                  {displayDropDown && (
                    <OptionsContainer {...{ stage }} width={75}>
                      <Option
                        onClick={() => {
                          optionClicked(false, 0)
                          setDisplayHand(false)
                        }}
                        highlight={optionHighlight[0]}
                      >
                        {'1'}
                      </Option>
                      <Option
                        onClick={() => {
                          optionClicked(false, 1)
                          setDisplayHand(false)
                        }}
                        highlight={optionHighlight[1]}
                      >
                        {'2'}
                      </Option>
                      <Option
                        onClick={() => {
                          optionClicked(true, 2)
                          setDisplayHand(false)
                        }}
                        highlight={optionHighlight[2]}
                      >
                        {'3'}
                      </Option>{' '}
                      <Option
                        onClick={() => {
                          optionClicked(false, 3)
                          setDisplayHand(false)
                        }}
                        highlight={optionHighlight[3]}
                      >
                        {'4'}
                      </Option>
                    </OptionsContainer>
                  )}
                </ClickBox>
                <span>x</span>
                {displayDropDown && displayHand && (
                  <ClickPlayer src={handClick} autoplay loop top={255} right={160} />
                )}
              </p>
            )}
            {displaySection == 1 && (
              <p>
                2 when subtracted from three times the number: <span>3x</span>
                <ClickBox
                  width={32}
                  onClick={() => {
                    if (!displayDropDown) setDisplayDropDown(true)
                  }}
                >
                  {displayDropDown && (
                    <OptionsContainer {...{ stage }} width={75}>
                      <Option
                        onClick={() => {
                          optionClicked(false, 0)
                        }}
                        highlight={optionHighlight[0]}
                      >
                        {'+'}
                      </Option>
                      <Option
                        onClick={() => {
                          optionClicked(true, 1)
                        }}
                        highlight={optionHighlight[1]}
                      >
                        {'-'}
                      </Option>
                      <Option
                        onClick={() => {
                          optionClicked(false, 2)
                        }}
                        highlight={optionHighlight[2]}
                      >
                        &times;
                      </Option>
                      <Option
                        onClick={() => {
                          optionClicked(false, 3)
                        }}
                        highlight={optionHighlight[3]}
                      >
                        &divide;
                      </Option>
                    </OptionsContainer>
                  )}
                </ClickBox>
                <span>2</span>
              </p>
            )}
            {displaySection == 2 && (
              <p>
                The equation becomes: <span>3x</span> - <span>2</span> =
                <ClickBox
                  width={40}
                  onClick={() => {
                    if (!displayDropDown) setDisplayDropDown(true)
                  }}
                >
                  {displayDropDown && (
                    <OptionsContainer {...{ stage }} width={75}>
                      <Option
                        onClick={() => {
                          optionClicked(false, 0)
                        }}
                        highlight={optionHighlight[0]}
                      >
                        8
                      </Option>
                      <Option
                        onClick={() => {
                          optionClicked(false, 1)
                        }}
                        highlight={optionHighlight[1]}
                      >
                        4x
                      </Option>
                      <Option
                        onClick={() => {
                          optionClicked(false, 2)
                        }}
                        highlight={optionHighlight[2]}
                      >
                        8x
                      </Option>
                      <Option
                        onClick={() => {
                          optionClicked(true, 3)
                        }}
                        highlight={optionHighlight[3]}
                      >
                        16
                      </Option>
                    </OptionsContainer>
                  )}
                </ClickBox>
              </p>
            )}
          </EquationText>
        </>
      )}
      {questionNumber == 2 && (
        <>
          <QuestionText highlight={wrongHighlight}>
            {questionPartOne[questionNumber][displaySection]}
            <span>{questionPartBold[questionNumber][displaySection]}</span>
            {questionPartThree[questionNumber][displaySection]}
          </QuestionText>
          <EquationText>
            <p>
              Let the cost of pizza be <span>x</span>
            </p>
            {displaySection > 0 && (
              <p>
                Twice the cost of a pizza will be <span>2x</span>
              </p>
            )}
            {displaySection > 1 && (
              <p>
                $10 more than twice the cost of a pizza: <span>2x</span> + <span>10</span>
              </p>
            )}
            {displaySection > 2 && (
              <>
                <p>
                  The equation becomes: <span>2x</span> + <span>10</span> = <span>20</span>
                </p>
                <p style={{ margin: '120px 10px 20px 10px', fontWeight: '700' }}>
                  The final equation can be written as
                </p>
                <p>2x + 10 = 20</p>
              </>
            )}
            {displaySection == 0 && (
              <p>
                Twice the cost of a pizza will be
                <ClickBox
                  width={36}
                  onClick={() => {
                    if (!displayDropDown) setDisplayDropDown(true)
                  }}
                >
                  {displayDropDown && (
                    <OptionsContainer {...{ stage }} width={75}>
                      <Option
                        onClick={() => {
                          setDisplayHand(false)
                          optionClicked(false, 0)
                        }}
                        highlight={optionHighlight[0]}
                      >
                        {'1'}
                      </Option>
                      <Option
                        onClick={() => {
                          setDisplayHand(false)
                          optionClicked(true, 1)
                        }}
                        highlight={optionHighlight[1]}
                      >
                        {'2'}
                      </Option>
                      <Option
                        onClick={() => {
                          setDisplayHand(false)
                          optionClicked(false, 2)
                        }}
                        highlight={optionHighlight[2]}
                      >
                        {'3'}
                      </Option>
                      <Option
                        onClick={() => {
                          setDisplayHand(false)
                          optionClicked(false, 3)
                        }}
                        highlight={optionHighlight[3]}
                      >
                        {'4'}
                      </Option>
                    </OptionsContainer>
                  )}
                </ClickBox>
                <span>x</span>
                {displayDropDown && displayHand && (
                  <ClickPlayer src={handClick} autoplay loop top={250} right={165} />
                )}
              </p>
            )}
            {displaySection == 1 && (
              <p>
                $10 more than twice the cost of a pizza: <span>2x</span>
                <ClickBox
                  width={32}
                  onClick={() => {
                    if (!displayDropDown) setDisplayDropDown(true)
                  }}
                >
                  {displayDropDown && (
                    <OptionsContainer {...{ stage }} width={75}>
                      <Option
                        onClick={() => {
                          optionClicked(true, 0)
                        }}
                        highlight={optionHighlight[0]}
                      >
                        +
                      </Option>
                      <Option
                        onClick={() => {
                          optionClicked(false, 1)
                        }}
                        highlight={optionHighlight[1]}
                      >
                        -
                      </Option>
                      <Option
                        onClick={() => {
                          optionClicked(false, 2)
                        }}
                        highlight={optionHighlight[2]}
                      >
                        &times;
                      </Option>
                      <Option
                        onClick={() => {
                          optionClicked(false, 3)
                        }}
                        highlight={optionHighlight[3]}
                      >
                        &divide;
                      </Option>
                    </OptionsContainer>
                  )}
                </ClickBox>
                <span>10</span>
              </p>
            )}
            {displaySection == 2 && (
              <p>
                The equation becomes: <span>2x</span> + <span>10</span> =
                <ClickBox
                  width={40}
                  onClick={() => {
                    if (!displayDropDown) setDisplayDropDown(true)
                  }}
                >
                  {displayDropDown && (
                    <OptionsContainer {...{ stage }} width={75}>
                      <Option
                        onClick={() => {
                          optionClicked(false, 0)
                        }}
                        highlight={optionHighlight[0]}
                      >
                        {'20x'}
                      </Option>
                      <Option
                        onClick={() => {
                          optionClicked(false, 1)
                        }}
                        highlight={optionHighlight[1]}
                      >
                        {'1'}
                      </Option>
                      <Option
                        onClick={() => {
                          optionClicked(true, 2)
                        }}
                        highlight={optionHighlight[2]}
                      >
                        {'20'}
                      </Option>
                      <Option
                        onClick={() => {
                          optionClicked(false, 3)
                        }}
                        highlight={optionHighlight[3]}
                      >
                        {'2'}
                      </Option>
                    </OptionsContainer>
                  )}
                </ClickBox>
              </p>
            )}
          </EquationText>
        </>
      )}
      {questionNumber == 3 && (
        <>
          <QuestionText highlight={wrongHighlight}>
            {questionPartOne[questionNumber][displaySection]}
            <span>{questionPartBold[questionNumber][displaySection]}</span>
            {questionPartThree[questionNumber][displaySection]}
          </QuestionText>
          <EquationText>
            <p>
              The cost of pencil is <span>$3</span>
            </p>
            {displaySection > 0 && (
              <>
                <p>
                  Four times cost of the pencil = <span>$12</span>
                </p>
                <p>
                  Let the cost of an eraser be <span>x</span>
                </p>
              </>
            )}
            {displaySection > 1 && (
              <p>
                Twice the cost of an eraser = <span>2x</span>
              </p>
            )}
            {displaySection > 2 && (
              <p>
                Four times the cost of a pencil and twice the cost of an eraser: <span>12</span> +{' '}
                <span>2x</span>
              </p>
            )}
            {displaySection > 3 && (
              <>
                <p>
                  The equation becomes: <span>12</span> + <span>2x</span> = <span>18</span>
                </p>
                <p style={{ margin: '120px 10px 20px 10px', fontWeight: '700' }}>
                  The final equation can be written as
                </p>
                <p>12 + 2x = 18</p>
              </>
            )}
            {displaySection == 0 && (
              <p>
                Four times cost of the pencil =
                <ClickBox
                  width={40}
                  onClick={() => {
                    if (!displayDropDown) setDisplayDropDown(true)
                  }}
                >
                  {displayDropDown && (
                    <OptionsContainer {...{ stage }} width={75}>
                      <Option
                        onClick={() => {
                          optionClicked(false, 0)
                          setDisplayHand(false)
                        }}
                        highlight={optionHighlight[0]}
                      >
                        $9
                      </Option>
                      <Option
                        onClick={() => {
                          optionClicked(false, 1)
                          setDisplayHand(false)
                        }}
                        highlight={optionHighlight[1]}
                      >
                        $10
                      </Option>
                      <Option
                        onClick={() => {
                          optionClicked(false, 2)
                          setDisplayHand(false)
                        }}
                        highlight={optionHighlight[2]}
                      >
                        $11
                      </Option>
                      <Option
                        onClick={() => {
                          optionClicked(true, 3)
                          setDisplayHand(false)
                        }}
                        highlight={optionHighlight[3]}
                      >
                        $12
                      </Option>
                    </OptionsContainer>
                  )}
                </ClickBox>
                {displayDropDown && displayHand && (
                  <ClickPlayer src={handClick} autoplay loop top={285} right={145} />
                )}
              </p>
            )}
            {displaySection == 1 && (
              <>
                <p>
                  Twice the cost of an eraser =
                  <ClickBox
                    width={36}
                    onClick={() => {
                      if (!displayDropDown) setDisplayDropDown(true)
                    }}
                  >
                    {displayDropDown && (
                      <OptionsContainer {...{ stage }} width={75}>
                        <Option
                          onClick={() => {
                            optionClicked(false, 0)
                          }}
                          highlight={optionHighlight[0]}
                        >
                          1
                        </Option>
                        <Option
                          onClick={() => {
                            optionClicked(true, 1)
                          }}
                          highlight={optionHighlight[1]}
                        >
                          2
                        </Option>
                        <Option
                          onClick={() => {
                            optionClicked(false, 2)
                          }}
                          highlight={optionHighlight[2]}
                        >
                          3
                        </Option>
                        <Option
                          onClick={() => {
                            optionClicked(false, 3)
                          }}
                          highlight={optionHighlight[3]}
                        >
                          4
                        </Option>
                      </OptionsContainer>
                    )}
                  </ClickBox>
                  <span>x</span>
                </p>
              </>
            )}
            {displaySection == 2 && (
              <>
                <p>
                  Four times the cost of a pencil and twice the cost of an eraser: <span>12</span>
                  <ClickBox
                    width={32}
                    onClick={() => {
                      if (!displayDropDown) setDisplayDropDown(true)
                    }}
                  >
                    {displayDropDown && (
                      <OptionsContainer {...{ stage }} width={75}>
                        <Option
                          onClick={() => {
                            optionClicked(true, 0)
                          }}
                          highlight={optionHighlight[0]}
                        >
                          +
                        </Option>
                        <Option
                          onClick={() => {
                            optionClicked(false, 1)
                          }}
                          highlight={optionHighlight[1]}
                        >
                          -
                        </Option>
                        <Option
                          onClick={() => {
                            optionClicked(false, 2)
                          }}
                          highlight={optionHighlight[2]}
                        >
                          &times;
                        </Option>
                        <Option
                          onClick={() => {
                            optionClicked(false, 3)
                          }}
                          highlight={optionHighlight[3]}
                        >
                          &divide;
                        </Option>
                      </OptionsContainer>
                    )}
                  </ClickBox>
                  <span>2x</span>
                </p>
              </>
            )}
            {displaySection == 3 && (
              <>
                <p>
                  The equation becomes: <span>12</span> + <span>2x</span> =
                  <ClickBox
                    width={40}
                    onClick={() => {
                      if (!displayDropDown) setDisplayDropDown(true)
                    }}
                  >
                    {displayDropDown && (
                      <OptionsContainer {...{ stage }} width={75}>
                        <Option
                          onClick={() => {
                            optionClicked(false, 0)
                          }}
                          highlight={optionHighlight[0]}
                        >
                          12
                        </Option>
                        <Option
                          onClick={() => {
                            optionClicked(false, 1)
                          }}
                          highlight={optionHighlight[1]}
                        >
                          20
                        </Option>
                        <Option
                          onClick={() => {
                            optionClicked(true, 2)
                          }}
                          highlight={optionHighlight[2]}
                        >
                          18
                        </Option>
                        <Option
                          onClick={() => {
                            optionClicked(false, 3)
                          }}
                          highlight={optionHighlight[3]}
                        >
                          30
                        </Option>
                      </OptionsContainer>
                    )}
                  </ClickBox>
                </p>
              </>
            )}
          </EquationText>
        </>
      )}
    </>
  )
}

import { Player } from '@lottiefiles/react-lottie-player'
import { FC, ReactNode, useEffect, useState } from 'react'
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
  width: 700px;
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
const ClickPlayer = styled(Player)<{ top: number }>`
  position: absolute;
  top: ${(props) => props.top}px;
  right: 130px;
  pointer-events: none;
`
const questionPartOne = [
  [
    'Two times the sum of ',
    'Two times the ',
    '',
    '',
    'Two times the sum of two consecutive numbers is 18.',
  ],
  [
    'Two times the sum of ',
    'Two times the ',
    '',
    '',
    'Two times the sum of two consecutive even numbers is 20.',
  ],
  ['Two times ', '', '', 'Two times the perimeter of a triangle measures 10 cm.'],
  ['The ', '', 'The perimeter of a rectangle measures 18 in.'],
]
const questionPartBold = [
  [
    'two consecutive numbers',
    'sum of two consecutive numbers',
    'Two times the sum of two consecutive numbers',
    'Two times the sum of two consecutive numbers is 18.',
    '',
  ],
  [
    'two consecutive even numbers',
    'sum of two consecutive even numbers',
    'Two times the sum of two consecutive even numbers',
    'Two times the sum of two consecutive even numbers is 20.',
    '',
  ],
  [
    'the perimeter of a triangle',
    'Two times the perimeter of a triangle',
    'Two times the perimeter of a triangle measures 10 cm.',
    '',
  ],
  ['perimeter of a rectangle', 'The perimeter of a rectangle measures 18 in.', ''],
]
const questionPartThree = [
  [' is 18.', ' is 18.', ' is 18.', '', ''],
  [' is 20.', ' is 20.', ' is 20.', '', ''],
  [' measures 10 cm.', ' measures 10 cm.', '', ''],
  [' measures 18 in.', '', ''],
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
        if (displaySection == 4) onNextEnable(true)
        break
      case 1:
        if (displaySection == 4) onNextEnable(true)
        break
      case 2:
        if (displaySection == 3) onNextEnable(true)
        break
      case 3:
        if (displaySection == 2) onNextEnable(true)
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
              Let the first number be <span>x</span>.
            </p>
            {displaySection > 0 && (
              <p>
                The consecutive number will be <span>(x+1)</span>.
              </p>
            )}
            {displaySection > 1 && (
              <p>
                Sum of two consecutive numbers = <span>x</span> + <span> (x+1)</span>
              </p>
            )}
            {displaySection > 2 && (
              <>
                <p>
                  {'Two times the sum of two consecutive numbers = 2('}
                  <span>x</span> + <span>(x+1)</span>
                  {')'}
                </p>
                <p>Two times the sum of two consecutive numbers is 18.</p>
              </>
            )}
            {displaySection > 3 && (
              <>
                <p>
                  {'So, the final equation will be: 2('}
                  <span>x</span> + <span>(x+1)</span>
                  {') = 18'}
                </p>
                <p style={{ margin: '60px 10px 20px 10px', fontWeight: '700' }}>
                  The final equation can be simplified as
                </p>
                <p>2 ( x + x + 1 ) = 18</p>
                <p>2 ( 2x + 1 ) = 18</p>
                <p>4x + 2 = 18</p>
              </>
            )}
            {displaySection == 0 && (
              <p>
                The consecutive number will be
                <ClickBox
                  width={77}
                  onClick={() => {
                    if (!displayDropDown) setDisplayDropDown(true)
                  }}
                >
                  {displayDropDown && (
                    <OptionsContainer {...{ stage }} width={120}>
                      <Option
                        onClick={() => {
                          optionClicked(true, 0)
                          setDisplayHand(false)
                        }}
                        highlight={optionHighlight[0]}
                      >
                        {'x + 1'}
                      </Option>
                      <Option
                        onClick={() => {
                          optionClicked(false, 1)
                          setDisplayHand(false)
                        }}
                        highlight={optionHighlight[1]}
                      >
                        {'x - 1'}
                      </Option>
                      <Option
                        onClick={() => {
                          optionClicked(false, 2)
                          setDisplayHand(false)
                        }}
                        highlight={optionHighlight[2]}
                      >
                        {'x'}
                      </Option>
                    </OptionsContainer>
                  )}
                </ClickBox>
                .
                {displayDropDown && displayHand && (
                  <ClickPlayer src={handClick} autoplay loop top={250} />
                )}
              </p>
            )}
            {displaySection == 1 && (
              <p>
                Sum of two consecutive numbers = <span>x</span>
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
                        {'-'}
                      </Option>
                      <Option
                        onClick={() => {
                          optionClicked(true, 1)
                        }}
                        highlight={optionHighlight[1]}
                      >
                        {'+'}
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
                <span> (x+1)</span>
              </p>
            )}
            {displaySection == 2 && (
              <p>
                Two times the sum of two consecutive numbers =
                <ClickBox
                  width={47}
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
                        {'2'}
                      </Option>
                      <Option
                        onClick={() => {
                          optionClicked(false, 1)
                        }}
                        highlight={optionHighlight[1]}
                      >
                        {'4'}
                      </Option>
                      <Option
                        onClick={() => {
                          optionClicked(false, 2)
                        }}
                        highlight={optionHighlight[2]}
                      >
                        {'3'}
                      </Option>
                    </OptionsContainer>
                  )}
                </ClickBox>
                {'('}
                <span>x</span> + <span>(x+1)</span>
                {')'}
              </p>
            )}
            {displaySection == 3 && (
              <p>
                {'So, the final equation will be: 2('}
                <span>x</span> + <span>(x+1)</span>
                {') = '}
                <ClickBox
                  width={47}
                  onClick={() => {
                    if (!displayDropDown) setDisplayDropDown(true)
                  }}
                >
                  {displayDropDown && (
                    <OptionsContainer {...{ stage }} width={102}>
                      <Option
                        onClick={() => {
                          optionClicked(false, 0)
                        }}
                        highlight={optionHighlight[0]}
                      >
                        {'18x'}
                      </Option>
                      <Option
                        onClick={() => {
                          optionClicked(true, 1)
                        }}
                        highlight={optionHighlight[1]}
                      >
                        {'18'}
                      </Option>
                      <Option
                        onClick={() => {
                          optionClicked(false, 2)
                        }}
                        highlight={optionHighlight[2]}
                      >
                        {'3'}
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
              Let the first number be <span>x</span>.
            </p>
            {displaySection > 0 && (
              <p>
                The consecutive even number will be <span>(x+2)</span>.
              </p>
            )}
            {displaySection > 1 && (
              <p>
                Sum of two consecutive even numbers = <span>x</span> + <span> (x+2)</span>
              </p>
            )}
            {displaySection > 2 && (
              <>
                <p>
                  {'Two times the sum of two consecutive even numbers = 2('}
                  <span>x</span> + <span>(x+2)</span>
                  {')'}
                </p>
                <p>Two times the sum of two consecutive even numbers is 20.</p>
              </>
            )}
            {displaySection > 3 && (
              <>
                <p>
                  {'So, the final equation will be: 2('}
                  <span>x</span> + <span>(x+2)</span>
                  {') = 20'}
                </p>
                <p style={{ margin: '60px 10px 20px 10px', fontWeight: '700' }}>
                  The final equation can be simplified as
                </p>
                <p>2 ( x + (x + 2) ) = 20</p>
                <p>2 ( 2x + 2 ) = 20</p>
                <p>4x + 4 = 20</p>
              </>
            )}
            {displaySection == 0 && (
              <p>
                The consecutive even number will be
                <ClickBox
                  width={77}
                  onClick={() => {
                    if (!displayDropDown) setDisplayDropDown(true)
                  }}
                >
                  {displayDropDown && (
                    <OptionsContainer {...{ stage }} width={120}>
                      <Option
                        onClick={() => {
                          setDisplayHand(false)
                          optionClicked(false, 0)
                        }}
                        highlight={optionHighlight[0]}
                      >
                        {'x + 1'}
                      </Option>
                      <Option
                        onClick={() => {
                          setDisplayHand(false)
                          optionClicked(false, 1)
                        }}
                        highlight={optionHighlight[1]}
                      >
                        {'x - 1'}
                      </Option>
                      <Option
                        onClick={() => {
                          setDisplayHand(false)
                          optionClicked(true, 2)
                        }}
                        highlight={optionHighlight[2]}
                      >
                        {'x + 2'}
                      </Option>
                    </OptionsContainer>
                  )}
                </ClickBox>
                .
                {displayDropDown && displayHand && (
                  <ClickPlayer src={handClick} autoplay loop top={250} />
                )}
              </p>
            )}
            {displaySection == 1 && (
              <p>
                Sum of two consecutive even numbers = <span>x </span>
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
                        {'-'}
                      </Option>
                      <Option
                        onClick={() => {
                          optionClicked(true, 1)
                        }}
                        highlight={optionHighlight[1]}
                      >
                        {'+'}
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
                <span> (x+2)</span>
              </p>
            )}
            {displaySection == 2 && (
              <p>
                Two times the sum of two consecutive even numbers =
                <ClickBox
                  width={47}
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
                        {'2'}
                      </Option>
                      <Option
                        onClick={() => {
                          optionClicked(false, 1)
                        }}
                        highlight={optionHighlight[1]}
                      >
                        {'5'}
                      </Option>
                      <Option
                        onClick={() => {
                          optionClicked(false, 2)
                        }}
                        highlight={optionHighlight[2]}
                      >
                        {'3'}
                      </Option>
                    </OptionsContainer>
                  )}
                </ClickBox>
                {'('}
                <span>x</span> + <span>(x+2)</span>
                {')'}
              </p>
            )}
            {displaySection == 3 && (
              <p>
                {'So, the final equation will be: 2('}
                <span>x</span> + <span>(x+2)</span>
                {') = '}
                <ClickBox
                  width={47}
                  onClick={() => {
                    if (!displayDropDown) setDisplayDropDown(true)
                  }}
                >
                  {displayDropDown && (
                    <OptionsContainer {...{ stage }} width={102}>
                      <Option
                        onClick={() => {
                          optionClicked(false, 0)
                        }}
                        highlight={optionHighlight[0]}
                      >
                        {'2x'}
                      </Option>
                      <Option
                        onClick={() => {
                          optionClicked(true, 1)
                        }}
                        highlight={optionHighlight[1]}
                      >
                        {'20'}
                      </Option>
                      <Option
                        onClick={() => {
                          optionClicked(false, 2)
                        }}
                        highlight={optionHighlight[2]}
                      >
                        {'3'}
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
              Length of first side = <span>1</span> cm
            </p>
            <p>
              Length of second side = <span>2</span> cm
            </p>
            <p>
              Let the length of the third side be <span>x</span> cm.
            </p>
            {displaySection > 0 && (
              <p>
                The perimeter of the triangle will be <span>(3 + x)</span> cm.
              </p>
            )}
            {displaySection > 1 && (
              <>
                <p>
                  Two times the perimeter of the triangle = <span>2 (3 + x)</span> cm
                </p>
                <p>Two times the perimeter of a triangle measures 10 cm.</p>
              </>
            )}
            {displaySection > 2 && (
              <>
                <p>
                  So, the final equation will be: <span>2 (3 + x)</span> = <span>10</span>
                </p>
                <p style={{ margin: '60px 10px 20px 10px', fontWeight: '700' }}>
                  The final equation can be simplified as
                </p>
                <p>2 ( 3 + x ) = 10</p>
                <p>6 + 2x = 10</p>
                <p>2x + 6 = 10</p>
              </>
            )}
            {displaySection == 0 && (
              <p>
                The perimeter of the triangle will be
                <ClickBox
                  width={77}
                  onClick={() => {
                    if (!displayDropDown) setDisplayDropDown(true)
                  }}
                >
                  {displayDropDown && (
                    <OptionsContainer {...{ stage }} width={135}>
                      <Option
                        onClick={() => {
                          setDisplayHand(false)
                          optionClicked(false, 0)
                        }}
                        highlight={optionHighlight[0]}
                      >
                        {'8x'}
                      </Option>
                      <Option
                        onClick={() => {
                          setDisplayHand(false)
                          optionClicked(true, 1)
                        }}
                        highlight={optionHighlight[1]}
                      >
                        {'3 + x'}
                      </Option>
                      <Option
                        onClick={() => {
                          setDisplayHand(false)
                          optionClicked(false, 2)
                        }}
                        highlight={optionHighlight[2]}
                      >
                        {'5x + 3'}
                      </Option>
                    </OptionsContainer>
                  )}
                </ClickBox>
                cm.
                {displayDropDown && displayHand && (
                  <ClickPlayer src={handClick} autoplay loop top={325} />
                )}
              </p>
            )}
            {displaySection == 1 && (
              <p>
                Two times the perimeter of the triangle =
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
                          optionClicked(true, 0)
                        }}
                        highlight={optionHighlight[0]}
                      >
                        2
                      </Option>
                      <Option
                        onClick={() => {
                          optionClicked(false, 1)
                        }}
                        highlight={optionHighlight[1]}
                      >
                        3
                      </Option>
                      <Option
                        onClick={() => {
                          optionClicked(false, 2)
                        }}
                        highlight={optionHighlight[2]}
                      >
                        8
                      </Option>
                    </OptionsContainer>
                  )}
                </ClickBox>
                <span> (3 + x)</span> cm
              </p>
            )}
            {displaySection == 2 && (
              <p>
                So, the final equation will be: <span>2 (3 + x)</span> =
                <ClickBox
                  width={36}
                  onClick={() => {
                    if (!displayDropDown) setDisplayDropDown(true)
                  }}
                >
                  {displayDropDown && (
                    <OptionsContainer {...{ stage }} width={89}>
                      <Option
                        onClick={() => {
                          optionClicked(true, 0)
                        }}
                        highlight={optionHighlight[0]}
                      >
                        {'10'}
                      </Option>
                      <Option
                        onClick={() => {
                          optionClicked(false, 1)
                        }}
                        highlight={optionHighlight[1]}
                      >
                        {'15'}
                      </Option>
                      <Option
                        onClick={() => {
                          optionClicked(false, 2)
                        }}
                        highlight={optionHighlight[2]}
                      >
                        {'24'}
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
              Length of the rectangle = <span>4</span> in
            </p>
            <p>
              Let the width of the rectangle be <span>x</span> in.
            </p>
            {displaySection > 0 && (
              <>
                <p>
                  The perimeter of the rectangle will be <span>2 (x + 4)</span>.
                </p>
                <p>The perimeter of the rectangle measures 18 in.</p>
              </>
            )}
            {displaySection > 1 && (
              <>
                <p>
                  So, the final equation will be: <span>2 (x + 4)</span> = <span>18</span>
                </p>
                <p style={{ margin: '60px 10px 20px 10px', fontWeight: '700' }}>
                  The final equation can be simplified as
                </p>
                <p>2 ( x + 4 ) = 18</p>
                <p>2x + 8 = 18</p>
              </>
            )}
            {displaySection == 0 && (
              <p>
                The perimeter of the rectangle will be
                <ClickBox
                  width={77}
                  onClick={() => {
                    if (!displayDropDown) setDisplayDropDown(true)
                  }}
                >
                  {displayDropDown && (
                    <OptionsContainer {...{ stage }} width={165}>
                      <Option
                        onClick={() => {
                          optionClicked(true, 0)
                          setDisplayHand(false)
                        }}
                        highlight={optionHighlight[0]}
                      >
                        {'2 (x + 4)'}
                      </Option>
                      <Option
                        onClick={() => {
                          setDisplayHand(false)
                          optionClicked(false, 1)
                        }}
                        highlight={optionHighlight[1]}
                      >
                        {'8 + x'}
                      </Option>
                      <Option
                        onClick={() => {
                          setDisplayHand(false)
                          optionClicked(false, 2)
                        }}
                        highlight={optionHighlight[2]}
                      >
                        {'4 + x'}
                      </Option>
                    </OptionsContainer>
                  )}
                </ClickBox>
                in.
                {displayDropDown && displayHand && (
                  <ClickPlayer src={handClick} autoplay loop top={295} />
                )}
              </p>
            )}
            {displaySection == 1 && (
              <>
                <p>
                  So, the final equation will be: <span>2 (x + 4)</span> =
                  <ClickBox
                    width={36}
                    onClick={() => {
                      if (!displayDropDown) setDisplayDropDown(true)
                    }}
                  >
                    {displayDropDown && (
                      <OptionsContainer {...{ stage }} width={89}>
                        <Option
                          onClick={() => {
                            optionClicked(false, 0)
                          }}
                          highlight={optionHighlight[0]}
                        >
                          4x
                        </Option>
                        <Option
                          onClick={() => {
                            optionClicked(false, 1)
                          }}
                          highlight={optionHighlight[1]}
                        >
                          24
                        </Option>
                        <Option
                          onClick={() => {
                            optionClicked(true, 2)
                          }}
                          highlight={optionHighlight[2]}
                        >
                          18
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

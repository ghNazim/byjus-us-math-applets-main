import Fraction from 'fraction.js'
import { FC, useEffect, useState } from 'react'
import styled from 'styled-components'

import { IQuestion } from '../Applet'
import InputField, { InputFieldNonStrict } from './InputField'

const ContainerDiv = styled.div`
  margin: 50px;
  margin-right: 50px;
  width: 86%;
  height: 30%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-content: center;
`

const FractionHolder = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  margin-left: 15px;
  margin-right: 15px;
`

const HorizontalLine = styled.div`
  border-color: ${(props) => props.color};
  background: ${(props) => props.color};
  width: 140%;
  height: 2px;
  align-self: center;
  border-radius: 1px;
`

const TextBox = styled.div<{ padding: boolean; size: number; color: string; weight: number }>`
  text-align: center;
  color: ${(props) => props.color};
  font-size: ${(props) => props.size}px;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: ${(props) => props.weight};
  line-height: 28px;
  width: 100%;
  padding: ${(props) => (props.padding ? 10 : 0)}px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const FractionFormer: FC<{
  colorNum?: string
  colorDen?: string
  colorLine?: string
  numerator: FC | string
  denominator: FC | string
  weight?: number
  size: number
}> = ({
  colorNum = '#1A1A1A',
  colorDen = '#1A1A1A',
  colorLine = '#1A1A1A',
  numerator,
  denominator,
  size,
  weight = 700,
}) => {
  return (
    <FractionHolder>
      <TextBox color={colorNum} padding={false} size={size} weight={weight}>
        <>{numerator}</>
      </TextBox>
      <HorizontalLine color={colorLine} />
      <TextBox color={colorDen} padding={false} size={size} weight={weight}>
        <>{denominator}</>
      </TextBox>
    </FractionHolder>
  )
}

// const FractionEntry: FC<{
//   colorNum?: string
//   colorDen?: string
//   colorLine?: string
//   numerator: FC | string
//   denominator: FC | string
//   weight?: number
//   size: number

//   question: IQuestion

//   answerState: (state: number) => void

//   completed: (ans: boolean) => void
// }> = ({ colorLine = '#1A1A1A', question, completed, answerState }) => {
//   const [completion, setCompletion] = useState({ num: false, den: false })
//   const [flipper, setFlipper] = useState(false)

//   function handleEntry(type: string, ans: boolean): void {
//     switch (type) {
//       case 'numerator':
//         if (ans)
//           setCompletion((prev) => {
//             prev.num = true
//             return prev
//           })
//         else
//           setCompletion((prev) => {
//             prev.num = false
//             return prev
//           })
//         break
//       case 'denominator':
//         if (ans)
//           setCompletion((prev) => {
//             prev.den = true
//             return prev
//           })
//         else
//           setCompletion((prev) => {
//             prev.den = false
//             return prev
//           })
//     }
//     setFlipper(true)
//   }

//   useEffect(() => {
//     if (completion.den && completion.num) completed(true)
//     else completed(false)
//     setFlipper(false)
//   }, [completion.den, completion.num, flipper])

//   return (
//     <FractionHolder>
//       <InputField
//         answerState={(state) => {
//           answerState(state)
//         }}
//         answered={(ans) => handleEntry('numerator', ans)}
//         text={question.wrongNumerator}
//         answerVal={question.numerator}
//       />
//       <HorizontalLine
//         style={{ color: '#1A1A1A', marginTop: 10, marginBottom: 10 }}
//         color={colorLine}
//       />
//       <InputField
//         answerState={answerState}
//         answered={(ans) => handleEntry('denominator', ans)}
//         text={question.wrongDenominator}
//         answerVal={question.denominator}
//       />
//     </FractionHolder>
//   )
// }

const FractionEntry: FC<{
  colorNum?: string
  colorDen?: string
  colorLine?: string
  numerator: FC | string
  denominator: FC | string
  weight?: number
  size: number

  answerState: (state: number) => void

  question: IQuestion

  completed: (ans: boolean) => void
}> = ({ colorLine = '#1A1A1A', question, completed, answerState }) => {
  const [flipper, setFlipper] = useState(false)
  const [currentVals, setCurrentVals] = useState({ numerator: 0, denominator: 0 })
  const [stateInt, setStateInt] = useState(2)

  function handleEntry(type: string, val: number): void {
    switch (type) {
      case 'numerator':
        setCurrentVals((prev) => {
          prev.numerator = val
          return prev
        })
        break
      case 'denominator':
        setCurrentVals((prev) => {
          prev.denominator = val
          return prev
        })
        break
    }
    setFlipper(true)
  }

  useEffect(() => {
    if (
      currentVals.numerator / currentVals.denominator ===
      question.numerator / question.denominator
    ) {
      setStateInt(1)
      completed(true)
    } else {
      setStateInt(0)
      completed(false)
    }
    if (Number.isNaN(currentVals.numerator) && Number.isNaN(currentVals.denominator)) setStateInt(2)
    setFlipper(false)
  }, [flipper])

  return (
    <FractionHolder>
      <InputFieldNonStrict
        showBanner={false}
        stateInt={stateInt}
        text={question.wrongNumerator}
        answerState={answerState}
        answered={(val) => handleEntry('numerator', val)}
        answerVal={question.numerator}
      />
      <HorizontalLine style={{ marginTop: 10, marginBottom: 10 }} color={colorLine} />
      <InputFieldNonStrict
        showBanner={stateInt === 0}
        stateInt={stateInt}
        answerState={answerState}
        answered={(val) => handleEntry('denominator', val)}
        text={question.wrongDenominator}
        answerVal={question.denominator}
      />
    </FractionHolder>
  )
}

const SlopeFormer: FC<{
  question: IQuestion
  numerator: number
  denominator: number
  answerState: (state: number) => void
  completed: (ans: boolean) => void
}> = ({ question, completed, answerState }) => {
  // const simplifyFrac = new Fraction(numerator, denominator)

  return (
    <ContainerDiv>
      <TextBox color="#1A1A1A" size={20} padding weight={700}>
        Slope&nbsp;&nbsp;=&nbsp;&nbsp;
        <FractionFormer
          colorNum="#C882FA"
          colorDen="#FF8F1F"
          numerator="Rise"
          denominator="Run"
          size={20}
        />
        &nbsp;&nbsp;=&nbsp;&nbsp;
        <FractionEntry
          answerState={answerState}
          colorNum="#C882FA"
          colorDen="#FF8F1F"
          numerator="15"
          denominator="10"
          size={20}
          question={question}
          completed={completed}
        />
        {/* &nbsp;=&nbsp; */}
        {/* {den ? (
          <span style={{ padding: '10px' }}>∞</span>
        ) : (
          <>
            <FractionFormer
              numerator={simplifyFrac.n.toString()}
              denominator={simplifyFrac.d.toString()}
              size={20}
            />
          </>
        )} */}
      </TextBox>
    </ContainerDiv>
  )
}

export const SlopeDisplay: FC<{ numerator: number; denominator: number; mini: boolean }> = ({
  numerator,
  denominator,
}) => {
  const simplifyFrac = new Fraction(numerator, denominator)

  return (
    <ContainerDiv>
      <TextBox color="#FF8F1F" size={20} padding weight={400}>
        Slope&nbsp;&nbsp;=&nbsp;&nbsp;
        <FractionFormer
          colorNum="#FF8F1F"
          colorDen="#FF8F1F"
          colorLine="#FF8F1F"
          numerator="Rise"
          denominator="Run"
          size={24}
          weight={400}
        />
        &nbsp;&nbsp;=&nbsp;&nbsp;
        <>
          <FractionFormer
            colorNum="#FF8F1F"
            colorDen="#FF8F1F"
            colorLine="#FF8F1F"
            numerator={(Math.sign(numerator) === -1 ? '-' : '') + simplifyFrac.n.toString()}
            denominator={simplifyFrac.d.toString()}
            size={24}
            weight={400}
          />
        </>
      </TextBox>
    </ContainerDiv>
  )
}

export default SlopeFormer

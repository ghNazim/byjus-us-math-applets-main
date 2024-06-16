import { FC, ReactElement } from 'react'
import styled from 'styled-components'

import { Math as Latex } from '@/common/Math'

const FontStyler = styled.span`
  font-family: 'Nunito';
  font-weight: 700;
  line-height: 28px;
  font-size: 36px;
  /* scale: 1.5; */
  padding: 10px 5px;
`

export const DivisionHolder: FC<{
  numerator: string
  denominator: string
  showNegative?: boolean
}> = ({ numerator, denominator, showNegative = true }) => {
  if (numerator === '0') {
    return <FontStyler style={{ fontSize: '24px' }}>0</FontStyler>
  }
  return (
    <FontStyler>
      <Latex>{String.raw`\frac{${showNegative ? numerator : Math.abs(Number(numerator))}}{${
        showNegative ? denominator : Math.abs(Number(denominator))
      }}`}</Latex>
    </FontStyler>
  )
}

interface IColorBlock {
  primary: string
  secondary: string
}

export interface IParseVals {
  a: string
  b: string
  c?: string
  d?: string
}

const HighLight = styled.span<{ box: boolean; colorBlock: IColorBlock; qnId: number }>`
  color: ${(props) => props.colorBlock.primary};
  background-color: ${(props) => (props.box ? props.colorBlock.secondary : '#fff')};
  border-radius: ${(props) => (props.box ? 5 : 0)}px;
  padding-left: 5px;
  padding-right: 5px;
  margin-left: 5px;
  margin-right: 5px;
  padding: ${(props) => (props.qnId != 2 ? '10' : '15')}px
    ${(props) => (props.qnId != 2 ? '10' : '0')}px;
  font-size: ${(props) => (props.qnId != 2 ? '24' : '36')}px;
`

const purpleBlock: IColorBlock = {
  primary: '#AA5EE0',
  secondary: '#F4E5FF',
}

const blueBlock: IColorBlock = {
  primary: '#1CB9D9',
  secondary: '#E7FBFF',
}

const ColorText: FC<{ val: ReactElement; colorBlock: IColorBlock; qnId: number }> = ({
  val,
  colorBlock,
  qnId,
}) => {
  return (
    <HighLight qnId={qnId} box={true} colorBlock={colorBlock}>
      {val}
    </HighLight>
  )
}

export const TextHolder: React.FC<{
  a: string | ReactElement
  b: string | ReactElement
  stepperVals: { a: string; b: string; c: string; d: string }
  id: number
  layer: number
}> = ({ a, b, stepperVals, id, layer }) => {
  const sideFinder = (side: 'first' | 'second') => {
    if (id != 2) {
      switch (side) {
        case 'first':
          return parseFloat(stepperVals.a) < 0 ? 'left' : 'right'
        case 'second':
          return parseFloat((Number(stepperVals.b) * -1).toString()) < 0 ? 'left' : 'right'
      }
    } else {
      switch (side) {
        case 'first':
          return parseFloat(stepperVals.a) / parseFloat(stepperVals.b) < 0 ? 'left' : 'right'
        case 'second':
          return parseFloat((Number(stepperVals.c) * -1).toString()) / parseFloat(stepperVals.d) < 0
            ? 'left'
            : 'right'
      }
    }
  }

  const texts: Record<string, ReactElement> = {
    1: <>Converting the chosen fractions into equivalent fractions.</>,
    1.5: <>Subtracting a number is the same as adding its opposite.</>,
    3: (
      <>
        First, plot the number <ColorText qnId={id} val={<>{a}</>} colorBlock={blueBlock} /> on the
        number line.
      </>
    ), //3
    4: (
      <>
        Try moving the pointer{' '}
        {parseFloat(stepperVals.a) === 0 ? (
          'to zero.'
        ) : typeof a === 'string' ? (
          <ColorText qnId={id} colorBlock={blueBlock} val={<>{a}</>} />
        ) : (
          <ColorText
            qnId={id}
            colorBlock={blueBlock}
            val={
              <>
                {
                  <DivisionHolder
                    showNegative={true}
                    numerator={a.props.numerator}
                    denominator={a.props.denominator}
                  />
                }
              </>
            }
          />
        )}
        {parseFloat(stepperVals.a) !== 0 &&
          'units towards the ' + sideFinder('first') + ' side of zero. '}
      </>
    ), //4
    5: <>Awesome! You got it right.</>, //5
    6: (
      <>
        To add, plot the number <ColorText qnId={id} val={<> {b}</>} colorBlock={purpleBlock} />{' '}
        relative to
        <ColorText qnId={id} val={<>{a}</>} colorBlock={blueBlock} />
      </>
    ), //6
    7: (
      <>
        {(id === 2 && parseFloat(stepperVals.c) === 0) ||
        (id < 2 && parseFloat(stepperVals.b) === 0) ? (
          <>Try moving the pointer to get zero units.</>
        ) : (
          <>
            Try moving the pointer{' '}
            {typeof b === 'string' ? (
              <ColorText qnId={id} colorBlock={purpleBlock} val={<>{Math.abs(Number(b))}</>} />
            ) : (
              <ColorText
                qnId={id}
                colorBlock={purpleBlock}
                val={
                  <>
                    {
                      <DivisionHolder
                        showNegative={false}
                        numerator={b.props.numerator}
                        denominator={b.props.denominator}
                      />
                    }
                  </>
                }
              />
            )}
            units towards the {sideFinder('second')} side of{' '}
            {typeof a === 'string' ? (
              <ColorText qnId={id} colorBlock={blueBlock} val={<>{a}</>} />
            ) : (
              <ColorText
                qnId={id}
                colorBlock={blueBlock}
                val={
                  <>
                    {
                      <DivisionHolder
                        showNegative={true}
                        numerator={a.props.numerator}
                        denominator={a.props.denominator}
                      />
                    }
                  </>
                }
              />
            )}
            .
          </>
        )}
      </>
    ), //7
    8: <>Awesome! You got it right.</>, //8
    9: <>Great job! We found the sum.</>, //9
  }

  const keys = Object.keys(texts)

  let elementNotFound = true
  let currentKey = ''
  let currentElement: ReactElement = <></>

  for (let index = 0; index < keys.length; index++) {
    const element = keys[index]
    if (+element === layer) {
      currentKey = keys[index]
      currentElement = texts[currentKey]
      elementNotFound = false
      break
    }
  }

  if (elementNotFound) return null

  return (
    <>
      {currentElement}
      {/* <>{layer}</> */}
    </>
  )
}

const ToolTipLeft = styled.div<{ left: number; scale: number }>`
  position: absolute;
  top: 255px;
  left: ${(props) => props.left}px;
`

const TextSpan = styled.div<{ left: number }>`
  position: absolute;
  top: 270px;
  width: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  left: ${(props) => props.left}px;

  font-family: 'Nunito';
  font-style: normal;
  font-weight: 400;
  font-size: 20px;
  line-height: 28px;

  text-align: center;

  color: #444444;
`

const ToolTipRight = styled.div<{ left: number; scale: number }>`
  position: absolute;
  top: 255px;
  left: ${(props) => props.left}px;
  transform: scaleX(-1);
`

import { questionFour } from '@/applets/G06EEC04GB01/AppletElements/Elements'

import tooltipHolder from './assets/ToolTip.svg'

export const ToolTip: React.FC<{
  originalVals: { a: string; b: string; c: string; d: string }
  formedNumerator: ReactElement | string
  formedDenominator: ReactElement | string
}> = ({ originalVals, formedNumerator, formedDenominator }) => {
  return (
    <>
      <ToolTipLeft left={90} scale={1}>
        <img src={tooltipHolder} alt="" />
      </ToolTipLeft>
      <TextSpan left={73}>
        <DivisionHolder numerator={originalVals.a} denominator={originalVals.b} />={formedNumerator}
      </TextSpan>

      <ToolTipRight left={339} scale={-1}>
        <img src={tooltipHolder} alt="" />
      </ToolTipRight>
      <TextSpan left={314}>
        <DivisionHolder
          numerator={(Number(originalVals.c) * -1).toString()}
          denominator={originalVals.d}
        />
        ={formedDenominator}
      </TextSpan>
    </>
  )
}

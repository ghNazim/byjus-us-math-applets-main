import { Player } from '@lottiefiles/react-lottie-player'
import { FC, useCallback, useContext, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { click } from '@/assets/onboarding'
import { AppletContainer } from '@/common/AppletContainer'
import { Geogebra } from '@/common/Geogebra'
import { GeogebraAppApi } from '@/common/Geogebra/Geogebra.types'
import { TextHeader } from '@/common/Header'
import { AnalyticsContext, AppletInteractionCallback } from '@/contexts/analytics'
import { useSFX } from '@/hooks/useSFX'

import { Math as Latex } from '../../common/Math'
import tryNew from './assets/tryNew.svg'
const GGB = styled(Geogebra)`
  position: absolute;
  left: 50%;
  translate: -50%;
  top: 90px;
  width: 748.5px;
  height: 499px;
`
const ButtonElement = styled.button`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 16px 24px;
  height: 60px;
  position: absolute;
  left: 50%;
  translate: -50%;
  bottom: 20px;
  background: #1a1a1a;
  border: 2px solid #1a1a1a;
  border-radius: 10px;
  cursor: pointer;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 24px;
  line-height: 32px;
  color: #ffffff;
  :disabled {
    cursor: not-allowed;
    opacity: 0.3;
  }
`
const HelperText = styled.div`
  display: flex;
  width: 650px;
  height: 60px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 20px;
  position: absolute;
  top: 610px;
  left: 50%;
  translate: -50%;
  color: #444;
  text-align: center;
  font-family: Nunito;
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: 28px;
`
const Text = styled.div`
  margin-top: 10px;
  max-width: 570px;
`
const InputBox = styled.input<{ top: number; left: number; colorTheme: string }>`
  position: absolute;
  top: ${(p) => p.top}px;
  left: ${(p) => p.left}px;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 4px;
  gap: 20px;
  justify-content: center;
  width: 88px;
  height: 54px;
  border-radius: 12px;
  border: 1px solid
    ${(p) => (p.colorTheme == 'green' ? '#6CA621' : p.colorTheme == 'red' ? '#CC6666' : ' #1a1a1a')};
  background: ${(p) =>
    p.colorTheme == 'green' ? '#ECFFD9' : p.colorTheme == 'red' ? '#FFF2F2' : '#f6f6f6'};
  color: ${(p) =>
    p.colorTheme == 'green' ? '#6CA621' : p.colorTheme == 'red' ? '#CC6666' : ' #1a1a1a'};
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;
  text-align: center;
  :focus {
    outline: none;
  }
`
const NumberText = styled.div<{ top: number; left: number }>`
  position: absolute;
  top: ${(p) => p.top}px;
  left: ${(p) => p.left}px;
  color: #444;
  font-family: Nunito;
  font-size: 24px;
  font-style: normal;
  font-weight: 400;
  line-height: 32px;
  width: 60px;
  height: 32px;
  text-align: center;
`
const HandPointer = styled(Player)<{ top: number; left: number }>`
  position: absolute;
  top: ${(p) => p.top}px;
  left: ${(p) => p.left}px;
  pointer-events: none;
`

const Tooltip = styled.div<{ box: number }>`
  position: absolute;
  top: ${(p) => (p.box == 1 ? 320 : p.box == 2 ? 510 : p.box == 3 ? 325 : 482)}px;
  left: ${(p) => (p.box == 1 ? 40 : p.box == 2 ? 65 : p.box == 3 ? 314 : 448)}px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  padding: 12px;
  align-items: center;
  gap: 10px;
  border-radius: 8px;
  border: 0.5px solid #1a1a1a;
  background: #fff;
  z-index: 1;
  color: #444;
  text-align: center;
  font-family: Nunito;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px;
  max-width: 320px;
  ::after {
    content: ' ';
    position: absolute;
    left: ${(p) => (p.box == 1 ? '90%' : p.box == 2 ? '85%' : p.box == 3 ? '13%' : '20%')};
    top: ${(p) => (p.box == 1 ? '94%' : p.box == 2 ? '-8%' : p.box == 3 ? '96%' : '-5%')};
    border-bottom: 0.5px solid #1a1a1a;
    border-right: 0.5px solid #1a1a1a;
    border-top: none;
    border-left: none;
    transform: rotate(
      ${(p) => (p.box == 1 ? 45 : p.box == 2 ? '-135' : p.box == 3 ? 45 : '-135')}deg
    );
    background: #ffffff;
    width: 8px;
    height: 8px;
  }
  .div {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 2px;
  }
`
export const AppletG06RPC07S1GB03: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const [pageNum, setPageNum] = useState(0)
  const [question, setQuestion] = useState(0)
  const [nextDisabled, setNextDisabled] = useState(false)
  const [checked1, setChecked1] = useState(false)
  const [checked2, setChecked2] = useState(false)
  const [checked3, setChecked3] = useState(false)
  const [checked4, setChecked4] = useState(false)
  const [wrong, setWrong] = useState(false)
  const [value1, setValue1] = useState('')
  const [value2, setValue2] = useState('')
  const [value3, setValue3] = useState('')
  const [value4, setValue4] = useState('')
  const [percent, setPercent] = useState(0)
  const [decimal, setDecimal] = useState(0)
  const [showHandPointer, setShowHandPointer] = useState(false)
  const ggbApi = useRef<GeogebraAppApi | null>(null)
  const playClick = useSFX('mouseClick')
  const onInteraction = useContext(AnalyticsContext)
  const onGGBHandle = useCallback(
    (api: GeogebraAppApi | null) => {
      ggbApi.current = api
      if (api == null) return
    },
    [ggbApi],
  )
  useEffect(() => {
    if (!ggbApi.current) return
    if (question == 0) {
      setPercent(Math.round(ggbApi.current.getValue('b') * 100) / 100)
    } else if (question == 1) {
      setDecimal(ggbApi.current.getValue('c'))
    }
  }, [question])
  const onNextHandle = () => {
    if (!ggbApi.current) return
    playClick()
    switch (pageNum) {
      case 0:
        onInteraction('next')
        setPageNum(1)
        setShowHandPointer(true)
        setNextDisabled(true)
        ggbApi.current.evalCommand('RunClickScript(srt)')
        if (question == 0) {
          setPercent(Math.round(ggbApi.current.getValue('b') * 100) / 100)
        } else if (question == 1) {
          setDecimal(ggbApi.current.getValue('c'))
        }
        break
      case 1:
        onInteraction('next')
        if (
          parseFloat(value1) == ggbApi.current.getValue('a') &&
          parseFloat(value2) == 20 &&
          ((question == 0 && parseFloat(value3) == ggbApi.current.getValue('c')) ||
            (question == 1 && parseFloat(value4) == ggbApi.current.getValue('b')) ||
            (question == 2 &&
              parseFloat(value3) == ggbApi.current.getValue('c') &&
              parseFloat(value4) == ggbApi.current.getValue('b')))
        ) {
          setWrong(false)
          setPageNum(2)
          setChecked1(true)
          setChecked2(true)
          setChecked3(true)
          setChecked4(true)
          if ((question == 0 || question == 2) && parseFloat(value3) == 1) setValue3('1.00')
        } else {
          if (parseFloat(value1) == ggbApi.current.getValue('a')) setChecked1(true)
          if (parseFloat(value2) == 20) setChecked2(true)
          if (parseFloat(value3) == ggbApi.current.getValue('c')) {
            setChecked3(true)
            if ((question == 0 || question == 2) && parseFloat(value3) == 1) setValue3('1.00')
          }
          if (parseFloat(value4) == ggbApi.current.getValue('b')) setChecked4(true)
          setNextDisabled(true)
          setWrong(true)
        }
        ggbApi.current.evalCommand('RunClickScript(chk)')
        break
      case 2:
        onInteraction('reset')
        setValue1('')
        setValue2('')
        setValue3('')
        setValue4('')
        setPercent(0)
        setDecimal(0)
        setWrong(false)
        setPageNum(1)
        setShowHandPointer(true)
        setNextDisabled(true)
        setChecked1(false)
        setChecked2(false)
        setChecked3(false)
        setChecked4(false)
        if (question == 2) ggbApi.current.evalCommand('RunClickScript(button1)')
        else if (question == 1) {
          ggbApi.current.evalCommand('RunClickScript(tnxt1)')
        } else ggbApi.current.evalCommand('RunClickScript(tnxt0)')
        setQuestion((q) => (q == 2 ? 0 : q + 1))
        ggbApi.current.evalCommand('RunClickScript(srt)')
        break
    }
  }
  const onText1Change = (e: any) => {
    if (!ggbApi.current) return
    if ((pageNum > 1 || checked1) && parseFloat(value1) == ggbApi.current.getValue('a')) return
    if (e.target.value < 1000 && e.target.value >= 0) {
      ggbApi.current.setValue('check', 0)
      setWrong(false)
      setValue1(e.target.value)
      ggbApi.current.setValue('valuenn', parseFloat(e.target.value))
      if (parseFloat(e.target.value) == ggbApi.current.getValue('a')) e.target.blur()
      if (
        e.target.value != '' &&
        value2 != '' &&
        ((question == 0 && value3 != '') ||
          (question == 1 && value4 != '') ||
          (question == 2 && value3 != '' && value4 != ''))
      )
        setNextDisabled(false)
    }
  }
  const onText2Change = (e: any) => {
    if (!ggbApi.current) return
    if ((pageNum > 1 || checked2) && parseFloat(value2) == 20) return
    if (e.target.value < 1000 && e.target.value >= 0) {
      ggbApi.current.setValue('check', 0)
      setWrong(false)
      setValue2(e.target.value)
      ggbApi.current.setValue('valuedd', parseFloat(e.target.value))
      if (parseFloat(e.target.value) == 20) e.target.blur()
      if (
        value1 != '' &&
        e.target.value != '' &&
        ((question == 0 && value3 != '') ||
          (question == 1 && value4 != '') ||
          (question == 2 && value3 != '' && value4 != ''))
      )
        setNextDisabled(false)
    }
  }
  const onText3Change = (e: any) => {
    if (!ggbApi.current) return
    if ((pageNum > 1 || checked3) && parseFloat(value3) == ggbApi.current.getValue('c')) return
    if ((e.target.value < 100 && e.target.value >= 0) || e.target.value == '.') {
      ggbApi.current.setValue('check', 0)
      setWrong(false)
      setValue3(e.target.value)
      ggbApi.current.setValue('deci', parseFloat(e.target.value))
      if (parseFloat(e.target.value) == ggbApi.current.getValue('c')) e.target.blur()
      if (
        value1 != '' &&
        value2 != '' &&
        ((question == 0 && e.target.value != '') ||
          (question == 1 && value4 != '') ||
          (question == 2 && e.target.value != '' && value4 != ''))
      )
        setNextDisabled(false)
    }
  }
  const onText4Change = (e: any) => {
    if (!ggbApi.current) return
    if ((pageNum > 1 || checked4) && parseFloat(value4) == ggbApi.current.getValue('b')) return
    if (e.target.value <= 100 && e.target.value >= 0) {
      ggbApi.current.setValue('check', 0)
      setWrong(false)
      setValue4(e.target.value)
      ggbApi.current.setValue('pt', parseFloat(e.target.value))
      if (parseFloat(e.target.value) == ggbApi.current.getValue('b')) e.target.blur()
      if (
        value1 != '' &&
        value2 != '' &&
        ((question == 0 && value3 != '') ||
          (question == 1 && e.target.value != '') ||
          (question == 2 && value3 != '' && e.target.value != ''))
      )
        setNextDisabled(false)
    }
  }
  useEffect(() => {
    if (!ggbApi.current) return
    if (
      wrong &&
      parseFloat(value1) == ggbApi.current.getValue('a') &&
      parseFloat(value2) == 20 &&
      ((question == 0 && parseFloat(value3) == ggbApi.current.getValue('c')) ||
        (question == 1 && parseFloat(value4) == ggbApi.current.getValue('b')) ||
        (question == 2 &&
          parseFloat(value3) == ggbApi.current.getValue('c') &&
          parseFloat(value4) == ggbApi.current.getValue('b')))
    ) {
      setNextDisabled(false)
    }
  }, [value1, value2, value3, value4])
  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#f6f6f6',
        id: 'g06-rpc07-s1-gb03',
        onEvent,
        className,
      }}
    >
      <TextHeader
        text="Relation between fraction, decimal, and percentage"
        backgroundColor="#f6f6f6"
        buttonColor="#1a1a1a"
      />
      <GGB materialId="hedv82jk" onApiReady={onGGBHandle} />
      {pageNum > 0 && (
        <>
          <NumberText top={424} left={331}>
            {decimal == 1 ? '1.00' : decimal}
          </NumberText>
          <NumberText top={424} left={question > 0 ? 516 : 472}>
            {(question == 0 ? percent : '') + '%'}
          </NumberText>
          <InputBox
            top={380}
            left={178}
            onChange={onText1Change}
            value={value1}
            onFocus={(e: any) => {
              setShowHandPointer(false)
              if (pageNum > 1 || checked1) e.target.blur()
            }}
            colorTheme={checked1 ? 'green' : wrong ? 'red' : 'default'}
          />
          <InputBox
            top={447}
            left={178}
            onChange={onText2Change}
            value={value2}
            onFocus={(e: any) => {
              setShowHandPointer(false)
              if (pageNum > 1 || checked2) e.target.blur()
            }}
            colorTheme={checked2 ? 'green' : wrong ? 'red' : 'default'}
          />
          {question != 1 && (
            <InputBox
              top={412}
              left={317}
              onChange={onText3Change}
              value={value3}
              onFocus={(e: any) => {
                setShowHandPointer(false)
                if (pageNum > 1 || checked3) e.target.blur()
              }}
              colorTheme={checked3 ? 'green' : wrong ? 'red' : 'default'}
            />
          )}
          {question > 0 && (
            <InputBox
              top={412}
              left={445}
              onChange={onText4Change}
              value={value4}
              onFocus={(e: any) => {
                setShowHandPointer(false)
                if (pageNum > 1 || checked4) e.target.blur()
              }}
              colorTheme={checked4 ? 'green' : wrong ? 'red' : 'default'}
            />
          )}
        </>
      )}
      {wrong && (
        <>
          {parseFloat(value1) != ggbApi.current?.getValue('a') && (
            <Tooltip box={1}>Number of shaded parts</Tooltip>
          )}
          {parseFloat(value2) != 20 && <Tooltip box={2}>Total number of parts</Tooltip>}
          {(question == 0 || question == 2) &&
            parseFloat(value3) != ggbApi.current?.getValue('c') && (
              <Tooltip box={3}>
                Divide the number of shaded parts by the total number of parts
              </Tooltip>
            )}
          {(question == 1 || question == 2) &&
            parseFloat(value4) != ggbApi.current?.getValue('b') && (
              <Tooltip box={4}>
                <div>
                  <div>Number of shaded parts</div>
                  <div>
                    <hr />
                  </div>
                  <div>Total number of parts</div>
                </div>
                <div>
                  <Latex>{String.raw`\times`}</Latex>
                  {' 100'}
                </div>
              </Tooltip>
            )}
        </>
      )}
      <HelperText>
        <Text>
          {pageNum == 0 && 'Analyze the given grid to answer the following questions.'}
          {pageNum == 1 &&
            (!wrong
              ? 'Analyze the given grid to fill the unknown values.'
              : 'Oops! Looks like you didn’t get all the answers correct.')}
          {pageNum == 2 && 'Well done! Keep the momentum going with some more questions'}
        </Text>
      </HelperText>
      {showHandPointer && <HandPointer src={click} top={355} left={150} autoplay loop />}
      <ButtonElement disabled={nextDisabled} onClick={onNextHandle}>
        {pageNum == 0 && 'Start'}
        {pageNum == 1 && 'Check'}
        {pageNum == 2 && <img src={tryNew} />}
      </ButtonElement>
    </AppletContainer>
  )
}

import { Player } from '@lottiefiles/react-lottie-player'
import { FC, useCallback, useContext, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { click, moveAllDirections } from '@/assets/onboarding'
import { AppletContainer } from '@/common/AppletContainer'
import { Geogebra } from '@/common/Geogebra'
import { GeogebraAppApi } from '@/common/Geogebra/Geogebra.types'
import { TextHeader } from '@/common/Header'
import { AnalyticsContext, AppletInteractionCallback } from '@/contexts/analytics'
import { useSFX } from '@/hooks/useSFX'

import tryNew from './assets/tryNew.svg'
const GGB = styled(Geogebra)`
  position: absolute;
  left: 50%;
  translate: -50%;
  top: 90px;
  width: 750px;
  height: 500px;
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
  max-width: 500px;
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
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;
  text-align: center;
  background: ${(p) =>
    p.colorTheme == 'green' ? '#ECFFD9' : p.colorTheme == 'red' ? '#FFF2F2' : '#f6f6f6'};
  border: 1px solid
    ${(p) => (p.colorTheme == 'green' ? '#6CA621' : p.colorTheme == 'red' ? '#C66' : '#1a1a1a')};
  color: ${(p) =>
    p.colorTheme == 'green' ? '#6CA621' : p.colorTheme == 'red' ? '#C66' : '#1a1a1a'};
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
export const AppletG06RPC06S1GB01: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const [pageNum, setPageNum] = useState(0)
  const [question, setQuestion] = useState(0)
  const [nextDisabled, setNextDisabled] = useState(true)
  const [ggbLoaded, setGgbLoaded] = useState(false)
  const [wrong, setWrong] = useState(false)
  const [value1, setValue1] = useState('')
  const [value2, setValue2] = useState('')
  const [value3, setValue3] = useState('')
  const [percent, setPercent] = useState('')
  const [showHandPointer, setShowHandPointer] = useState(true)
  const [showMovePointer, setShowMovePointer] = useState(false)
  const ggbApi = useRef<GeogebraAppApi | null>(null)
  const playClick = useSFX('mouseClick')
  const playMouseIn = useSFX('mouseIn')
  const playMouseOut = useSFX('mouseOut')
  const onInteraction = useContext(AnalyticsContext)
  const onGGBHandle = useCallback(
    (api: GeogebraAppApi | null) => {
      ggbApi.current = api
      if (api == null) return
      setGgbLoaded(true)
      setPercent(api.getValue('b') + '')
      api.registerClientListener((e: any) => {
        if (e.type === 'mouseDown' && (e.hits[0] === 'A0' || e.hits[0] === 'A1')) {
          onInteraction('drag')
          playMouseIn()
          setShowMovePointer(false)
          api.setValue('red01', 0)
          api.setValue('red02', 0)
        } else if (e.type === 'dragEnd' && (e.target === 'A0' || e.target === 'A1')) {
          onInteraction('drop')
          playMouseOut()
          setNextDisabled(false)
        }
      })
      api.registerObjectUpdateListener('b', () => {
        setPercent(api.getValue('b') + '')
      })
    },
    [ggbApi, question],
  )

  const onNextHandle = () => {
    if (!ggbApi.current) return
    playClick()
    switch (pageNum) {
      case 0:
        onInteraction('next')
        setWrong(false)
        setNextDisabled(true)
        setPageNum(1)
        question == 0
          ? ggbApi.current.evalCommand('RunClickScript(next0)')
          : ggbApi.current.evalCommand('RunClickScript(next1)')
        setShowMovePointer(true)
        break
      case 1:
        switch (question) {
          case 0:
            if (ggbApi.current.getValue('a') == ggbApi.current.getValue('b')) {
              setNextDisabled(false)
              setWrong(false)
              onInteraction('next')
              setPageNum(2)
              ggbApi.current.evalCommand('RunClickScript(chk0)')
            } else {
              setNextDisabled(true)
              setWrong(true)
              ggbApi.current.setValue('red01', 1)
            }
            break
          case 1:
            if (ggbApi.current.getValue('e') == ggbApi.current.getValue('b')) {
              setNextDisabled(false)
              setWrong(false)
              onInteraction('next')
              setPageNum(2)
              ggbApi.current.evalCommand('RunClickScript(chk1)')
            } else {
              setNextDisabled(true)
              setWrong(true)
              ggbApi.current.setValue('red02', 1)
            }
            break
          case 2:
            if (
              parseFloat(value1) == ggbApi.current.getValue('f') &&
              ((parseFloat(value2) == ggbApi.current.getValue('f') && parseFloat(value3) == 100) ||
                ggbApi.current.getValue('f') / 100 == parseFloat(value2) / parseFloat(value3))
            ) {
              setNextDisabled(false)
              setWrong(false)
              onInteraction('next')
              setPageNum(2)
              ggbApi.current.evalCommand('RunClickScript(chk2)')
            } else {
              setNextDisabled(true)
              setWrong(true)
              ggbApi.current.setValue('red03', 1)
            }
            break
        }
        break
      case 2:
        onInteraction('reset')
        question == 1 ? setPageNum(1) : setPageNum(0)
        setNextDisabled(true)
        setValue1('')
        setValue2('')
        setValue3('')
        setPercent('')
        if (question == 0) ggbApi.current.evalCommand('RunClickScript(trynew0)')
        else if (question == 1) {
          ggbApi.current.evalCommand('RunClickScript(trynew1)')
        } else ggbApi.current.evalCommand('RunClickScript(button1)')
        setQuestion((q) => (q == 2 ? 0 : q + 1))
        setShowHandPointer(true)

        break
    }
  }
  const onText1Change = (e: any) => {
    if (!ggbApi.current) return
    if (
      (question == 1 && parseFloat(value1) == ggbApi.current.getValue('b')) ||
      (question == 2 && parseFloat(value1) == ggbApi.current.getValue('f'))
    ) {
      return
    }
    if (e.target.value <= 100 && e.target.value >= 0) {
      setValue1(e.target.value)
      question == 2 && setWrong(false)
      question == 1
        ? ggbApi.current.setValue('pt', parseFloat(e.target.value))
        : ggbApi.current.setValue('pt1', parseFloat(e.target.value))
    }
  }
  const onText2Change = (e: any) => {
    if (!ggbApi.current) return
    if (
      (question == 0 && parseFloat(value2) == ggbApi.current.getValue('b')) ||
      (question == 2 && parseFloat(value2) == ggbApi.current.getValue('f'))
    )
      return
    if (e.target.value <= 100 && e.target.value >= 0) {
      setValue2(e.target.value)
      question == 2 && setWrong(false)
      question == 0
        ? ggbApi.current.setValue('valuenn', parseFloat(e.target.value))
        : ggbApi.current.setValue('valuenn1', parseFloat(e.target.value))
    }
  }
  const onText3Change = (e: any) => {
    if (!ggbApi.current) return
    if (parseFloat(value3) == 100) return
    if (e.target.value <= 100 && e.target.value >= 0) {
      setValue3(e.target.value)
      question == 2 && setWrong(false)
      question == 0
        ? ggbApi.current.setValue('valuedd', parseFloat(e.target.value))
        : ggbApi.current.setValue('valuedd1', parseFloat(e.target.value))
    }
  }
  useEffect(() => {
    if (!ggbApi.current) return

    if (question == 0) {
      if (value2 == '' || value3 == '') return
      if (parseFloat(value2) == ggbApi.current.getValue('b') && parseFloat(value3) == 100) {
        setNextDisabled(false)
      } else {
        setNextDisabled(true)
        setWrong(true)
      }
    } else if (question == 1) {
      if (value1 == '') return
      if (parseFloat(value1) == ggbApi.current.getValue('b')) {
        setNextDisabled(false)
      } else {
        setNextDisabled(true)
        setWrong(true)
      }
    } else if (question == 2) {
      ggbApi.current.setValue('red03', 0)
      if (value1 == '' || value2 == '' || value3 == '') return
      setNextDisabled(false)
    }
  }, [value1, value2, value3])
  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#f6f6f6',
        id: 'g06-rpc06-s1-gb01',
        onEvent,
        className,
      }}
    >
      <TextHeader
        text="Relationship between fraction and percentage"
        backgroundColor="#f6f6f6"
        buttonColor="#1a1a1a"
      />
      <GGB materialId="z7vka2qt" onApiReady={onGGBHandle} />
      {ggbLoaded && (
        <>
          {question > 0 && (
            <InputBox
              top={pageNum == 0 ? 225 : 225}
              left={pageNum == 0 ? 305 : 115}
              onChange={onText1Change}
              value={value1}
              onFocus={(e: any) => {
                setShowHandPointer(false)
                if ((question != 2 && pageNum > 0) || (question == 2 && pageNum > 1))
                  e.target.blur()
              }}
              colorTheme={
                (question != 2 && pageNum == 0) || (question == 2 && pageNum == 2)
                  ? (question == 1 && parseFloat(value1) == ggbApi.current?.getValue('b')) ||
                    (question == 2 && parseFloat(value1) == ggbApi.current?.getValue('f'))
                    ? 'green'
                    : wrong
                    ? 'red'
                    : 'default'
                  : question == 2 && pageNum == 1
                  ? wrong && question == 2 && parseFloat(value1) == ggbApi.current?.getValue('f')
                    ? 'green'
                    : wrong
                    ? 'red'
                    : 'default'
                  : 'default'
              }
            />
          )}
          <NumberText
            top={237}
            left={question > 0 ? (pageNum == 0 ? 377 : 187) : pageNum == 0 ? 330 : 145}
          >
            {(question == 0 ? percent : '') + '%'}
          </NumberText>
          <NumberText top={395} left={pageNum == 0 ? 330 : 140}>
            {percent}
          </NumberText>
          <NumberText top={435} left={pageNum == 0 ? 330 : 140}>
            100
          </NumberText>
          {question != 1 && (
            <InputBox
              top={pageNum == 0 ? 370 : 370}
              left={pageNum == 0 ? 315 : 125}
              onChange={onText2Change}
              value={value2}
              onKeyDown={(e: any) => {
                if (e.key === '.') {
                  e.preventDefault()
                }
              }}
              onFocus={(e: any) => {
                setShowHandPointer(false)
                if ((question != 2 && pageNum > 0) || (question == 2 && pageNum > 1))
                  e.target.blur()
              }}
              colorTheme={
                (question != 2 && pageNum == 0) || (question == 2 && pageNum > 1)
                  ? (question == 0 && parseFloat(value2) == ggbApi.current?.getValue('b')) ||
                    (question == 2 &&
                      (parseFloat(value2) == ggbApi.current?.getValue('f') ||
                        ggbApi.current?.getValue('f') ==
                          (parseFloat(value2) / parseFloat(value3)) * 100))
                    ? 'green'
                    : wrong
                    ? 'red'
                    : 'default'
                  : question == 2 && pageNum == 1
                  ? wrong && question == 2 && parseFloat(value2) == ggbApi.current?.getValue('f')
                    ? 'green'
                    : wrong
                    ? 'red'
                    : 'default'
                  : 'default'
              }
            />
          )}
          {question != 1 && (
            <InputBox
              onKeyDown={(e: any) => {
                if (e.key === '.') {
                  e.preventDefault()
                }
              }}
              top={pageNum == 0 ? 434 : 434}
              left={pageNum == 0 ? 315 : 125}
              onChange={onText3Change}
              value={value3}
              onFocus={(e: any) => {
                setShowHandPointer(false)
                if ((question != 2 && pageNum > 0) || (question == 2 && pageNum > 1))
                  e.target.blur()
              }}
              colorTheme={
                (question != 2 && pageNum == 0) || (question == 2 && pageNum > 1)
                  ? parseFloat(value3) == 100 ||
                    ggbApi.current?.getValue('f') == (parseFloat(value2) / parseFloat(value3)) * 100
                    ? 'green'
                    : wrong
                    ? 'red'
                    : 'default'
                  : question == 2 && pageNum == 1
                  ? wrong && question == 2 && parseFloat(value3) == 100
                    ? 'green'
                    : wrong
                    ? 'red'
                    : 'default'
                  : 'default'
              }
            />
          )}
        </>
      )}
      <HelperText>
        <Text>
          {question == 0 &&
            (pageNum == 0
              ? nextDisabled
                ? !wrong
                  ? 'Represent the given percentage as a fraction with 100 as its denominator.'
                  : 'Oh-no! That does not seem to be the correct value.'
                : "Awesome! That's correct."
              : pageNum == 1
              ? nextDisabled && wrong
                ? 'Uh-Oh! The number of squares to be shaded needs to be equal to the numerator.'
                : 'Represent the fraction on the grid.'
              : 'Well done! Let’s try some more questions.')}
          {question == 1 &&
            (pageNum == 0
              ? nextDisabled
                ? !wrong
                  ? 'Convert the fraction into percentage.'
                  : 'Oh-no! That does not seem to be the correct value.'
                : "Awesome! That's correct."
              : pageNum == 1
              ? nextDisabled && wrong
                ? 'Oh-no! That does not seem to be correct. The shaded region represents the percentage.'
                : 'Represent the percentage on the grid.'
              : 'Well done! Let’s try some more questions.')}
          {question == 2 &&
            (pageNum == 1
              ? nextDisabled && wrong
                ? 'Oh-no! That does not seem to be the correct.'
                : 'Analyze the shaded portion of the grid and represent it using a percentage and a fraction.'
              : 'Well done! Let’s try some more questions.')}
        </Text>
      </HelperText>
      {ggbLoaded && showHandPointer && (
        <HandPointer
          src={click}
          top={question == 0 ? 345 : 205}
          left={question == 2 ? 85 : 285}
          autoplay
          loop
        />
      )}
      {showMovePointer && <HandPointer src={moveAllDirections} top={265} left={61} autoplay loop />}
      <ButtonElement disabled={nextDisabled} onClick={onNextHandle}>
        {pageNum == 0 && 'Next'}
        {pageNum == 1 && 'Check'}
        {pageNum == 2 && <img src={tryNew} />}
      </ButtonElement>
    </AppletContainer>
  )
}

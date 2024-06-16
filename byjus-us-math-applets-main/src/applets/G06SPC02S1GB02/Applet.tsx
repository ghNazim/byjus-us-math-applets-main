import { Player } from '@lottiefiles/react-lottie-player'
import { FC, useCallback, useContext, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { Stage, useTransition } from 'transition-hook'

import { moveVertically } from '@/assets/onboarding'
import { AppletContainer } from '@/common/AppletContainer'
import { Geogebra } from '@/common/Geogebra'
import { GeogebraAppApi } from '@/common/Geogebra/Geogebra.types'
import { TextHeader } from '@/common/Header'
import { AnalyticsContext, AppletInteractionCallback } from '@/contexts/analytics'
import { useSFX } from '@/hooks/useSFX'

import arrowBlack from './assets/arrowBlack.svg'
import tryNew from './assets/tryNew.svg'
const GgbContainer = styled.div<{ visibility: boolean; greenBg: boolean }>`
  position: absolute;
  top: 90px;
  right: 20px;
  width: 431px;
  height: 520px;
  border-radius: 8px;
  background: ${(p) => (p.greenBg ? '#ECFFD9' : '#e7fbff')};
  visibility: ${(p) => (p.visibility ? 'visible' : 'hidden')};
`
const Ggb = styled(Geogebra)`
  position: absolute;
  bottom: 0;
  width: 431px;
  height: 520px;
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
const BlueBG = styled.div<{ width: number }>`
  width: ${(p) => p.width}px;
  height: 520px;
  border-radius: 8px;
  background: #e7fbff;
  position: absolute;
  top: 90px;
  left: 20px;
`
const TempContainer = styled.div<{ top: number }>`
  position: absolute;
  width: 650px;
  top: ${(p) => p.top}px;
  left: 50%;
  translate: -50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 15px;
  color: #444;
  text-align: center;
  font-family: 'Nunito';
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: 32px;
  p {
    font-weight: 400;
    padding: 10px 0;
    margin: 0;
  }
`
const TempDigitContanier = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 5px;
`
const TempDigit = styled.div<{ purple: boolean }>`
  font-weight: 400;
  padding: 10px 0;
  text-align: center;
  border-radius: 5px;
  width: 40px;
  height: 40px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background-color: ${(p) => (p.purple ? '#F4E5FF' : '#fff')};
  color: ${(p) => (p.purple ? '#AA5EE0' : '#888')};
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
  top: 640px;
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
  max-width: 570px;
`
const Box = styled.div`
  width: 122px;
  display: flex;
  height: 60px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  color: #1a1a1a;
  text-align: center;
  font-family: Nunito;
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: 28px;
  border-radius: 12px;
  border: 1px solid #444;
  background: #fff;
  cursor: pointer;
  position: relative;
`
const SelectedText = styled.div`
  width: 78px;
  height: 52px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #444;
  text-align: center;
  text-align: center;
  font-family: Nunito;
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: 52px;
`
const OptionsContainer = styled.button<{ stage: Stage }>`
  position: absolute;
  top: -133%;
  left: 50%;
  translate: -50%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  display: flex;
  padding: 12px;
  align-items: center;
  gap: 12px;
  border-radius: 12px;
  border: none;
  background: #c7c7c7;
  opacity: ${(props) => (props.stage !== 'enter' ? 0 : 1)};
  transition: opacity 350ms;
  z-index: 1;
  ::after {
    content: ' ';
    position: absolute;
    left: 50%;
    translate: -50%;
    top: 99%;
    border-bottom: none;
    border-right: 8px solid transparent;
    border-left: 8px solid transparent;
    border-top: 8px solid #c7c7c7;
  }
`
const Option = styled.button`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 8px;
  gap: 10px;
  border-radius: 8px;
  border: none;
  width: 44px;
  height: 44px;
  font-family: 'Nunito';
  background: #ffffff;
  color: #646464;
  text-align: center;
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: 28px;
  cursor: pointer;
  :hover {
    background: #1a1a1a;
    color: #fff;
  }
`

const CheckBoxes = styled.div`
  display: flex;
  width: 250px;
  height: 60px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 20px;
`
const CheckBoxContainer = styled.div<{ selected: boolean }>`
  cursor: pointer;
  display: flex;
  width: 114px;
  height: 60px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 10px;
  background-color: ${(p) => (p.selected ? '#c7c7c7' : '#fff')};
  border-radius: 12px;
  border: 1px solid ${(p) => (p.selected ? '#212121' : '#c7c7c7')};
  box-shadow: ${(p) => (p.selected ? 'inset 0 0 0 4px #fff' : '0px -4px 0px 0px #C7C7C7 inset')};
  span {
    color: #212121;
    text-align: center;
    font-family: Nunito;
    font-size: 20px;
    font-style: normal;
    font-weight: ${(p) => (p.selected ? 700 : 400)};
    line-height: 28px;
  }
`
const CheckBox = styled.div<{ selected: boolean }>`
  width: 24px;
  height: 24px;
  border: 2px solid #212121;
  border-radius: 50%;
  box-shadow: ${(p) => (p.selected ? 'inset 0 0 0 4px #C7C7C7' : '')};
  background-color: ${(p) => (p.selected ? '#212121' : '#fff')};
`
const GridContainer = styled.div<{ top: number }>`
  position: absolute;
  top: ${(p) => p.top}px;
  left: 50%;
  translate: -50%;
  display: grid;
  grid-template-columns: auto auto;
  grid-template-rows: auto auto auto auto auto;
`
const GridItem = styled.div<{
  colorTheme: string
  disabled: boolean
  width: number
}>`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;
  width: ${(p) => p.width}px;
  height: ${(p) => (p.colorTheme == 'grey' ? 60 : 52)}px;
  background: ${(p) =>
    p.colorTheme == 'grey' ? '#F3F7FE' : p.colorTheme == 'purple' ? '#F4E5FF' : '#ffffff'};
  color: #444444;
  border: 1px solid #bcd3ff;
  opacity: ${(p) => (p.disabled ? 0.3 : 1)};
  span {
    font-size: 16px;
    max-width: 100px;
    line-height: 24px;
  }
`
const InputBox = styled.input<{ colorTheme: string }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 4px;
  gap: 20px;
  justify-content: center;
  width: 62px;
  height: 36px;
  background: ${(p) =>
    p.colorTheme == 'green' ? '#ECFFD9' : p.colorTheme == 'red' ? '#FFF2F2' : '#f6f6f6'};
  border: 1px solid
    ${(p) => (p.colorTheme == 'green' ? '#6CA621' : p.colorTheme == 'red' ? '#C66' : '#1a1a1a')};
  color: ${(p) =>
    p.colorTheme == 'green' ? '#6CA621' : p.colorTheme == 'red' ? '#C66' : '#1a1a1a'};
  border-radius: 6px;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;
  text-align: center;
  :focus {
    outline: none;
    border: 2px solid
      ${(p) => (p.colorTheme == 'green' ? '#6CA621' : p.colorTheme == 'red' ? '#C66' : '#1a1a1a')};
  }
  ::placeholder {
    opacity: 0.4;
  }
`
const HandPointer = styled(Player)`
  position: absolute;
  top: 196px;
  left: 104px;
  pointer-events: none;
`
export const AppletG06SPC02S1GB02: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const [pageNum, setPageNum] = useState(0)
  const [dailyTemp, setDailyTemp] = useState([
    15, 22, 25, 18, 12, 14, 28, 23, 29, 21, 26, 20, 27, 29,
  ])
  const [nextDisabled, setNextDisabled] = useState(false)
  const [displayDropDown, setDisplayDropDown] = useState(false)
  const { stage } = useTransition(displayDropDown, 350)
  const playClick = useSFX('mouseClick')
  const playMouseIn = useSFX('mouseIn')
  const playMouseOut = useSFX('mouseOut')
  const onInteraction = useContext(AnalyticsContext)
  const [startInt, setStartInt] = useState(0)
  const [incrementVal, setIncrementVal] = useState(0)
  const [segment, setSegment] = useState(-1)
  const [range, setRange] = useState<Array<number>>([])
  const [numOfRange, setNumOfRange] = useState<Array<number>>([0, 0, 0, 0])
  const [dayValues, setDayValues] = useState({ r1: '', r2: '', r3: '', r4: '' })
  const [showPointer, setShowPointer] = useState(false)
  const ggbApi = useRef<GeogebraAppApi | null>(null)
  const [dragBar, setDragBar] = useState(0)
  const onHandleGGB = useCallback(
    (api: GeogebraAppApi | null) => {
      ggbApi.current = api
      if (api == null) return
      api.registerObjectUpdateListener('greenvis', () => {
        if (api.getValue('greenvis')) {
          setNextDisabled(false)
        }
      })
      api.registerObjectUpdateListener('bar', () => {
        const val = api.getValue('bar')
        val == 1
          ? setDragBar(1)
          : val == 2
          ? setDragBar(2)
          : val == 3
          ? setDragBar(3)
          : val == 4
          ? setDragBar(4)
          : setDragBar(5)
      })
      api.registerClientListener((e: any) => {
        if (
          e.type === 'mouseDown' &&
          (e.hits[0] === 'kc' || e.hits[0] === 'lc' || e.hits[0] === 'mc' || e.hits[0] === 'nc')
        ) {
          onInteraction('drag')
          playMouseIn()
          setShowPointer(false)
        } else if (
          e.type === 'dragEnd' &&
          (e.target === 'kc' || e.target === 'lc' || e.target === 'mc' || e.target === 'nc')
        ) {
          onInteraction('drop')
          playMouseOut()
        }
      })
    },
    [ggbApi],
  )
  const onNextHandle = () => {
    onInteraction('next')
    playClick()
    switch (pageNum) {
      case 0:
        setPageNum((p) => p + 1)
        break
      case 1:
        setPageNum((p) => p + 1)
        setDailyTemp((d) => d.sort())
        break
      case 2:
        setPageNum((p) => p + 1)
        setNextDisabled(true)
        break
      case 3:
        setPageNum((p) => p + 1)
        setNextDisabled(true)
        break
      case 4:
        setPageNum((p) => p + 1)
        setNextDisabled(true)
        setSegment(0)
        break
      case 5:
        setPageNum((p) => p + 1)
        break
      case 6:
        setPageNum((p) => p + 1)
        setNextDisabled(true)
        setShowPointer(true)
        setDragBar(1)
        break
      case 7:
        if (!ggbApi.current) return
        ggbApi.current.evalCommand('RunClickScript(button1)')
        setPageNum(0)
        setStartInt(0)
        setIncrementVal(0)
        setSegment(-1)
        setRange([])
        setNumOfRange([0, 0, 0, 0])
        setDayValues({ r1: '', r2: '', r3: '', r4: '' })
        setDragBar(0)
        setDailyTemp([15, 22, 25, 18, 12, 14, 28, 23, 29, 21, 26, 20, 27, 29])
        break
    }
  }
  useEffect(() => {
    if (!ggbApi.current) return
    if (pageNum == 7) {
      if (incrementVal == 5) {
        startInt == 10
          ? ggbApi.current.setValue('question', 1)
          : startInt == 11
          ? ggbApi.current.setValue('question', 2)
          : ggbApi.current.setValue('question', 3)
      } else {
        startInt == 10
          ? ggbApi.current.setValue('question', 4)
          : startInt == 11
          ? ggbApi.current.setValue('question', 5)
          : ggbApi.current.setValue('question', 6)
        ggbApi.current.evalCommand('RunClickScript(Point)')
      }
    }
  }, [pageNum])
  useEffect(() => {
    if (pageNum == 4) {
      if (incrementVal > 0) {
        const a = [0, 0, 0, 0, 0, 0, 0, 0]
        for (let i = 0; i < 8; i++) {
          if (i == 0) a[i] = startInt
          else if (i % 2 == 0) {
            a[i] = a[i - 1] + 1
          } else {
            a[i] = a[i - 1] + incrementVal - 1
          }
        }
        setRange(a)
      } else {
        setRange([])
      }
    }
  }, [incrementVal])
  useEffect(() => {
    if (pageNum < 4) return
    const num: Array<number> = [0, 0, 0, 0]
    for (let i = 0; i < 14; i++) {
      for (let j = 0; j < 4; j++) {
        if (dailyTemp[i] <= range[2 * j + 1] && dailyTemp[i] >= range[2 * j]) {
          num[j] = num[j] + 1
          break
        }
      }
    }
    setNumOfRange(num)
  }, [range])
  const onText1Change = (e: any) => {
    if (parseFloat(dayValues.r1) == numOfRange[0]) return
    if (e.target.value < 20 && e.target.value >= 0) {
      setDayValues({ ...dayValues, r1: e.target.value })
      if (parseFloat(e.target.value) == numOfRange[0]) {
        e.target.blur()
        setSegment(1)
      }
    }
  }
  const onText2Change = (e: any) => {
    if (parseFloat(dayValues.r2) == numOfRange[1]) return
    if (e.target.value < 20 && e.target.value >= 0) {
      setDayValues({ ...dayValues, r2: e.target.value })
      if (parseFloat(e.target.value) == numOfRange[1]) {
        e.target.blur()
        setSegment(2)
        if (incrementVal == 10) setNextDisabled(false)
      }
    }
  }
  const onText3Change = (e: any) => {
    if (parseFloat(dayValues.r3) == numOfRange[2]) return
    if (e.target.value < 20 && e.target.value >= 0) {
      setDayValues({ ...dayValues, r3: e.target.value })
      if (parseFloat(e.target.value) == numOfRange[2]) {
        e.target.blur()
        setSegment(3)
      }
    }
  }
  const onText4Change = (e: any) => {
    if (parseFloat(dayValues.r4) == numOfRange[3]) return
    if (e.target.value < 20 && e.target.value >= 0) {
      setDayValues({ ...dayValues, r4: e.target.value })
      if (parseFloat(e.target.value) == numOfRange[3]) {
        e.target.blur()
        setSegment(4)
        setNextDisabled(false)
      }
    }
  }
  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#f6f6f6',
        id: 'g06-spc02-s1-gb02',
        onEvent,
        className,
      }}
    >
      <TextHeader text="Plotting a histogram." backgroundColor="#f6f6f6" buttonColor="#1a1a1a" />
      <BlueBG width={pageNum == 7 ? 233 : 680}>
        {pageNum != 7 && (
          <TempContainer top={pageNum < 2 ? 160 : 50}>
            {pageNum == 0 && <p>Plot a histogram with the given data.</p>}
            <div>Daily Temperature:</div>
            <TempDigitContanier>
              {dailyTemp.map((temp, i) => (
                <TempDigit
                  key={i}
                  purple={
                    pageNum == 5 && temp <= range[2 * segment + 1] && temp >= range[2 * segment]
                  }
                >
                  {temp}
                </TempDigit>
              ))}
            </TempDigitContanier>
          </TempContainer>
        )}
        {pageNum > 1 && (
          <GridContainer top={pageNum == 7 ? 130 : 180}>
            <GridItem colorTheme={'grey'} width={pageNum == 7 ? 110 : 126} disabled={false}>
              <span>Temperature Range</span>
            </GridItem>
            <GridItem
              colorTheme={'grey'}
              width={pageNum == 7 ? 103 : 126}
              disabled={pageNum == 3 || pageNum == 4}
            >
              <span>Number of days</span>
            </GridItem>
            <GridItem
              colorTheme={segment == 0 || dragBar == 1 ? 'purple' : ''}
              width={pageNum == 7 ? 110 : 126}
              disabled={false}
            >
              {pageNum > 3 && (incrementVal == 0 ? startInt + '-?' : range[0] + '-' + range[1])}
            </GridItem>
            <GridItem
              colorTheme={segment == 0 || dragBar == 1 ? 'purple' : ''}
              width={pageNum == 7 ? 103 : 126}
              disabled={pageNum == 3 || pageNum == 4}
            >
              {segment >= 0 &&
                (pageNum != 7 ? (
                  <InputBox
                    colorTheme={
                      pageNum == 6
                        ? 'green'
                        : pageNum == 5 &&
                          (segment > 0 ||
                            dayValues.r1 == '' ||
                            parseFloat(dayValues.r1) == numOfRange[0])
                        ? 'default'
                        : 'red'
                    }
                    placeholder="00"
                    onChange={onText1Change}
                    value={dayValues.r1}
                    onFocus={(e: any) => {
                      if (parseFloat(dayValues.r1) == numOfRange[0] || pageNum > 5) e.target.blur()
                    }}
                  />
                ) : (
                  <div>{dayValues.r1}</div>
                ))}
            </GridItem>
            <GridItem
              colorTheme={segment == 1 || dragBar == 2 ? 'purple' : ''}
              width={pageNum == 7 ? 110 : 126}
              disabled={false}
            >
              {pageNum > 3 && range.length > 0 && range[2] + '-' + range[3]}
            </GridItem>
            <GridItem
              colorTheme={segment == 1 || dragBar == 2 ? 'purple' : ''}
              width={pageNum == 7 ? 103 : 126}
              disabled={pageNum == 3 || pageNum == 4}
            >
              {segment >= 1 &&
                (pageNum != 7 ? (
                  <InputBox
                    colorTheme={
                      pageNum == 6
                        ? 'green'
                        : pageNum == 5 &&
                          (segment > 1 ||
                            dayValues.r2 == '' ||
                            parseFloat(dayValues.r2) == numOfRange[1])
                        ? 'default'
                        : 'red'
                    }
                    placeholder="00"
                    onChange={onText2Change}
                    value={dayValues.r2}
                    onFocus={(e: any) => {
                      if (parseFloat(dayValues.r2) == numOfRange[1] || pageNum > 5) e.target.blur()
                    }}
                  />
                ) : (
                  <div>{dayValues.r2}</div>
                ))}
            </GridItem>
            {pageNum > 3 && incrementVal == 5 && (
              <GridItem
                colorTheme={segment == 2 || dragBar == 3 ? 'purple' : ''}
                width={pageNum == 7 ? 110 : 126}
                disabled={false}
              >
                {pageNum > 3 && range.length > 0 && range[4] + '-' + range[5]}
              </GridItem>
            )}
            {pageNum > 3 && incrementVal == 5 && (
              <GridItem
                colorTheme={segment == 2 || dragBar == 3 ? 'purple' : ''}
                width={pageNum == 7 ? 103 : 126}
                disabled={pageNum == 3 || pageNum == 4}
              >
                {segment >= 2 &&
                  (pageNum != 7 ? (
                    <InputBox
                      colorTheme={
                        pageNum == 6
                          ? 'green'
                          : pageNum == 5 &&
                            (segment > 2 ||
                              dayValues.r3 == '' ||
                              parseFloat(dayValues.r3) == numOfRange[2])
                          ? 'default'
                          : 'red'
                      }
                      placeholder="00"
                      onChange={onText3Change}
                      value={dayValues.r3}
                      onFocus={(e: any) => {
                        if (parseFloat(dayValues.r3) == numOfRange[2] || pageNum > 5)
                          e.target.blur()
                      }}
                    />
                  ) : (
                    <div>{dayValues.r3}</div>
                  ))}
              </GridItem>
            )}
            {pageNum > 3 && incrementVal == 5 && (
              <GridItem
                colorTheme={segment == 3 || dragBar == 4 ? 'purple' : ''}
                width={pageNum == 7 ? 110 : 126}
                disabled={false}
              >
                {pageNum > 3 && range.length > 0 && range[6] + '-' + range[7]}
              </GridItem>
            )}
            {pageNum > 3 && incrementVal == 5 && (
              <GridItem
                colorTheme={segment == 3 || dragBar == 4 ? 'purple' : ''}
                width={pageNum == 7 ? 103 : 126}
                disabled={pageNum == 3 || pageNum == 4}
              >
                {segment >= 3 &&
                  (pageNum != 7 ? (
                    <InputBox
                      colorTheme={
                        pageNum == 6
                          ? 'green'
                          : pageNum == 5 &&
                            (segment > 3 ||
                              dayValues.r4 == '' ||
                              parseFloat(dayValues.r4) == numOfRange[3])
                          ? 'default'
                          : 'red'
                      }
                      placeholder="00"
                      onChange={onText4Change}
                      value={dayValues.r4}
                      onFocus={(e: any) => {
                        if (parseFloat(dayValues.r4) == numOfRange[3] || pageNum > 5)
                          e.target.blur()
                      }}
                    />
                  ) : (
                    <div>{dayValues.r4}</div>
                  ))}
              </GridItem>
            )}
          </GridContainer>
        )}
      </BlueBG>
      <GgbContainer visibility={pageNum == 7} greenBg={pageNum == 7 && !nextDisabled}>
        <Ggb materialId="j6wgqbjb" onApiReady={onHandleGGB} />
        {showPointer && <HandPointer src={moveVertically} autoplay loop />}
      </GgbContainer>
      <HelperText>
        <Text>
          {pageNum == 1 && 'Arrange the data in the increasing order.'}
          {pageNum == 2 && 'Let’s start filling the table to plot the histogram.'}
          {pageNum == 3 && 'Select the starting point of the interval'}
          {pageNum == 4 && 'Select the interval for the given data:'}
          {(pageNum == 5 || pageNum == 6) &&
            'Count the number of days for respective range and fill the value.'}
          {pageNum == 7 &&
            (nextDisabled
              ? 'Check the table to plot the histogram.'
              : 'Great! You have plotted the data.')}
        </Text>
        {pageNum == 3 && (
          <Box
            onClick={() => {
              onInteraction('tap')
              playClick()
              if (!displayDropDown) {
                setDisplayDropDown(true)
                setNextDisabled(true)
              } else {
                setDisplayDropDown(false)
                startInt > 0 && setNextDisabled(false)
              }
            }}
          >
            <SelectedText>{startInt > 0 ? startInt : ''}</SelectedText>
            <img src={arrowBlack} />
            {displayDropDown && (
              <OptionsContainer stage={stage}>
                <Option
                  onClick={() => {
                    setStartInt(10)
                    setNextDisabled(false)
                  }}
                >
                  10
                </Option>
                <Option
                  onClick={() => {
                    setStartInt(11)
                    setNextDisabled(false)
                  }}
                >
                  11
                </Option>
                <Option
                  onClick={() => {
                    setStartInt(12)
                    setNextDisabled(false)
                  }}
                >
                  12
                </Option>
              </OptionsContainer>
            )}
          </Box>
        )}
        {pageNum == 4 && (
          <CheckBoxes>
            <CheckBoxContainer
              selected={incrementVal == 5}
              onClick={() => {
                playClick()
                onInteraction('tap')
                if (incrementVal == 5) {
                  setIncrementVal(0)
                  setNextDisabled(true)
                } else {
                  setIncrementVal(5)
                  setNextDisabled(false)
                }
              }}
            >
              <CheckBox selected={incrementVal == 5} />
              <span>5</span>
            </CheckBoxContainer>
            <CheckBoxContainer
              selected={incrementVal == 10}
              onClick={() => {
                playClick()
                onInteraction('tap')
                if (incrementVal == 10) {
                  setIncrementVal(0)
                  setNextDisabled(true)
                } else {
                  setIncrementVal(10)
                  setNextDisabled(false)
                }
              }}
            >
              <CheckBox selected={incrementVal == 10} />
              <span>10</span>
            </CheckBoxContainer>
          </CheckBoxes>
        )}
      </HelperText>
      <ButtonElement disabled={nextDisabled} onClick={onNextHandle}>
        {pageNum == 0 && 'Start'}
        {pageNum == 1 && 'Arrange'}
        {pageNum > 1 && pageNum < 5 && 'Next'}
        {pageNum == 5 && 'Check'}
        {pageNum == 6 && 'Next'}
        {pageNum == 7 && <img src={tryNew} />}
      </ButtonElement>
    </AppletContainer>
  )
}

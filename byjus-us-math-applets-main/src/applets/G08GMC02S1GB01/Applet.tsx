import { FC, useCallback, useContext, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { Stage, useTransition } from 'transition-hook'

import { AppletContainer } from '@/common/AppletContainer'
import { Geogebra } from '@/common/Geogebra'
import { GeogebraAppApi } from '@/common/Geogebra/Geogebra.types'
import { TextHeader } from '@/common/Header'
import { AnalyticsContext, AppletInteractionCallback } from '@/contexts/analytics'
import { useSFX } from '@/hooks/useSFX'

import arrowBlack from './assets/arrowBlack.svg'
import arrowRed from './assets/arrowRed.svg'
import questionMark from './assets/questionMark.svg'
import retry from './assets/retry.svg'
const GGBContainer = styled.div<{ visibility: boolean }>`
  position: absolute;
  width: 650px;
  height: 500px;
  top: 87px;
  left: 50%;
  translate: -50% 0%;
  ${(p) => !p.visibility && ' visibility: hidden;'}
`
const BlueBG = styled.div`
  position: absolute;
  left: 50%;
  translate: -50%;
  top: 100px;
  width: 680px;
  height: 440px;
  border-radius: 12px;
  background: #e7fbff;
`
const GridContainer = styled.div`
  position: absolute;
  left: 50%;
  translate: -50%;
  top: 60px;
  display: grid;
  grid-template-columns: auto auto auto;
  grid-template-rows: auto auto auto auto auto;
`
const GridHead = styled.div<{ width: number; bdrRadius: string }>`
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
  height: 80px;
  background: #faf2ff;
  border: 1px solid #f4e5ff;
  border-radius: ${(p) => p.bdrRadius};
  color: #444;
`
const GridItem = styled.div<{ color: string; width: number; bdrRadius: string; bgColor: string }>`
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
  height: 60px;
  background: ${(p) => p.bgColor};
  color: ${(p) => p.color};
  border: 1px solid #f4e5ff;
  border-radius: ${(p) => p.bdrRadius};
`
const ButtonElement = styled.button`
  position: absolute;
  left: 50%;
  translate: -50%;
  bottom: 20px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 16px 24px;
  gap: 12px;
  background: #1a1a1a;
  border-radius: 10px;
  height: 60px;
  color: #fff;
  text-align: center;
  font-family: Nunito;
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: 32px;
  cursor: pointer;
  :disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`
const Box = styled.div<{ colorTheme: string }>`
  width: 229px;
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
  border: 1px solid
    ${(p) => (p.colorTheme == 'green' ? '#6CA621' : p.colorTheme == 'red' ? '#CC6666' : '#444')};
  background: ${(p) =>
    p.colorTheme == 'green' ? '#ECFFD9' : p.colorTheme == 'red' ? '#FFF2F2' : '#fff'};
  cursor: pointer;
  position: relative;
`
const SelectedText = styled.div<{ colorTheme: string }>`
  width: 185px;
  height: 52px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${(p) =>
    p.colorTheme == 'green' ? '#6CA621' : p.colorTheme == 'red' ? '#CC6666' : '#444'};
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
  top: -325%;
  left: 50%;
  translate: -50%;
  display: flex;
  flex-direction: column;
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
  width: 145px;
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
const SelectionContainer = styled.div<{ top: number }>`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 8px;
  gap: 12px;
  position: absolute;
  top: ${(p) => p.top}px;
  left: 50%;
  translate: -50%;
  width: 680px;
`
const FeedBack = styled.div`
  pointer-events: none;
  position: absolute;
  top: -102%;
  left: 0%;
  translate: -50%;
  border-radius: 8px;
  border: none;
  border-radius: 8px;
  border: 0.5px solid #1a1a1a;
  background: #fff;
  z-index: 1;
  width: 267px;
  height: 48px;
  color: #444;
  text-align: center;
  font-family: Nunito;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 48px;
  span {
    font-weight: 700;
  }
  ::after {
    content: ' ';
    position: absolute;
    left: 80%;
    top: 87%;
    width: 12px;
    height: 12px;
    transform: rotate(45deg);
    background-color: #fff;
    border-bottom: 0.5px solid #1a1a1a;
    border-right: 0.5px solid #1a1a1a;
    border-left: 0.5px solid transparent;
    border-top: 0.5px solid transparent;
  }
  ::before {
    content: '!';
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    position: absolute;
    left: -12px;
    top: -12px;
    border: 1px solid #1a1a1a;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    background-color: #fff;
  }
`
const SelectionHelper = styled.div`
  color: #212121;
  text-align: right;
  font-family: Nunito;
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: 28px;
`

const HelperText = styled.div`
  display: flex;
  width: 650px;
  height: 60px;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  gap: 20px;
  position: absolute;
  top: 570px;
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
const xAns = [1, 2, 3, 3]
const yAns = [3, 3, 1, 2]
const ddValues = ['', 'increases', 'decreases', 'stays constant']
const xText = [
  'On moving to the right, the x-coordinate',
  'On moving to the left, the x-coordinate',
  'On moving up, the x-coordinate',
  'On moving down, the x-coordinate',
]
const yText = [
  'On moving to the right, the y-coordinate',
  'On moving to the left, the y-coordinate',
  'On moving up, the y-coordinate',
  'On moving down, the y-coordinate',
]
const helperText = [
  'Move the pointer to the right.',
  'Move the pointer to the left.',
  'Move the pointer upwards.',
  'Move the pointer downwards.',
]
export const AppletG08GMC02S1GB01: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const ggbApi = useRef<GeogebraAppApi | null>(null)
  const [currentDirection, setCurrentDirection] = useState(0)
  const [pageNum, setPageNum] = useState(0)
  const [nextDisabled, setNextDisabled] = useState(false)
  const [xDirectionValue, setXDirectionValue] = useState(0)
  const [yDirectionValue, setYDirectionValue] = useState(0)
  const [coords, setCoords] = useState({ x: 1, y: 2 })
  const [displayDropDown1, setDisplayDropDown1] = useState(false)
  const [displayDropDown2, setDisplayDropDown2] = useState(false)
  const { stage: stage1 } = useTransition(displayDropDown1, 350)
  const { stage: stage2 } = useTransition(displayDropDown2, 350)
  const playClick = useSFX('mouseClick')
  const playMouseIn = useSFX('mouseIn')
  const playMouseOut = useSFX('mouseOut')
  const onInteraction = useContext(AnalyticsContext)
  const onNextHandle = () => {
    playClick()
    switch (pageNum) {
      case 0:
        if (currentDirection < 4) {
          setPageNum(1)
          onInteraction('next')
          setNextDisabled(true)
        } else {
          setCurrentDirection(0)
          onInteraction('reset')
          if (ggbApi.current) ggbApi.current.evalCommand('RunClickScript(button1)')
        }
        break
      case 1:
        if (!ggbApi.current) return
        setPageNum(2)
        setNextDisabled(true)
        onInteraction('next')
        if (ggbApi.current.getVisible('nxt1')) ggbApi.current.evalCommand('RunClickScript(nxt1)')
        else if (ggbApi.current.getVisible('nxt2'))
          ggbApi.current.evalCommand('RunClickScript(nxt2)')
        else if (ggbApi.current.getVisible('nxt3'))
          ggbApi.current.evalCommand('RunClickScript(nxt3)')
        else if (ggbApi.current.getVisible('nxt4'))
          ggbApi.current.evalCommand('RunClickScript(nxt4)')
        break
      case 2:
        if (!ggbApi.current) return
        setPageNum(0)
        setCurrentDirection((c) => c + 1)
        setXDirectionValue(0)
        setYDirectionValue(0)
        setCoords({ x: 1, y: 2 })
        onInteraction('next')
        if (ggbApi.current.getVisible('note1')) ggbApi.current.evalCommand('RunClickScript(note1)')
        else if (ggbApi.current.getVisible('note2'))
          ggbApi.current.evalCommand('RunClickScript(note2)')
        else if (ggbApi.current.getVisible('note3'))
          ggbApi.current.evalCommand('RunClickScript(note3)')
        else if (ggbApi.current.getVisible('note4'))
          ggbApi.current.evalCommand('RunClickScript(note4)')
        break
    }
  }
  const onGGBHandle = useCallback(
    (api: GeogebraAppApi | null) => {
      ggbApi.current = api
      if (api == null) return

      api.registerClientListener((e: any) => {
        if (
          e.type === 'mouseDown' &&
          (e.hits[0] === 'E' || e.hits[0] === 'U' || e.hits[0] === 'AA' || e.hits[0] === 'DD')
        ) {
          onInteraction('drag')
          playMouseIn()
        } else if (
          e.type === 'dragEnd' &&
          (e.target === 'E' || e.target === 'U' || e.target === 'AA' || e.target === 'DD')
        ) {
          onInteraction('drop')
          playMouseOut()
          if (api.getVisible('F')) setCoords({ x: api.getValue('x(F)'), y: api.getValue('y(F)') })
          else if (api.getVisible('V'))
            setCoords({ x: api.getValue('x(V)'), y: api.getValue('y(V)') })
          else if (api.getVisible('A_1'))
            setCoords({ x: api.getValue('x(A_1)'), y: api.getValue('y(A_1)') })
          else if (api.getVisible('D_1'))
            setCoords({ x: api.getValue('x(D_1)'), y: api.getValue('y(D_1)') })
        }
      })
    },
    [ggbApi],
  )
  useEffect(() => {
    if (pageNum == 1) {
      switch (currentDirection) {
        case 0:
          if (coords.x > 1) setNextDisabled(false)
          else setNextDisabled(true)
          break
        case 1:
          if (coords.x < 1) setNextDisabled(false)
          else setNextDisabled(true)
          break
        case 2:
          if (coords.y > 2) setNextDisabled(false)
          else setNextDisabled(true)
          break
        case 3:
          if (coords.y < 2) setNextDisabled(false)
          else setNextDisabled(true)
          break
      }
    }
  }, [coords])
  useEffect(() => {
    if (pageNum == 2) {
      if (xAns[currentDirection] == xDirectionValue && yAns[currentDirection] == yDirectionValue)
        setNextDisabled(false)
      else setNextDisabled(true)
    }
  }, [xDirectionValue, yDirectionValue])
  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#f6f6f6',
        id: 'g08-gmc02-s1-gb01',
        onEvent,
        className,
      }}
    >
      <TextHeader
        text="Observe translation of a point in coordinate plane."
        backgroundColor="#f6f6f6"
        buttonColor="#1a1a1a"
      />
      {pageNum == 0 && (
        <BlueBG>
          <GridContainer>
            <GridHead width={160} bdrRadius="8px 0px 0px 0px">
              Direction
            </GridHead>
            <GridHead width={220} bdrRadius="0px">
              x-coordinate
            </GridHead>
            <GridHead width={220} bdrRadius="0px 8px 0px 0px">
              y-coordinate
            </GridHead>
            <GridItem
              width={160}
              bdrRadius="0px"
              color={'#444'}
              bgColor={currentDirection == 1 ? '#FFF2E5' : '#fff'}
            >
              Right
            </GridItem>
            <GridItem
              width={220}
              bdrRadius="0px"
              color={currentDirection == 1 ? '#FF8F1F' : '#646464'}
              bgColor={currentDirection == 1 ? '#FFF2E5' : '#fff'}
            >
              {currentDirection >= 1 ? 'Increases' : <img src={questionMark} />}
            </GridItem>
            <GridItem
              width={220}
              bdrRadius="0px"
              color={currentDirection == 1 ? '#FF8F1F' : '#646464'}
              bgColor={currentDirection == 1 ? '#FFF2E5' : '#fff'}
            >
              {currentDirection >= 1 ? 'Stays constant' : <img src={questionMark} />}
            </GridItem>
            <GridItem
              width={160}
              bdrRadius="0px"
              color={'#444'}
              bgColor={currentDirection == 2 ? '#FFF2E5' : '#fff'}
            >
              Left
            </GridItem>
            <GridItem
              width={220}
              bdrRadius="0px"
              color={currentDirection == 2 ? '#FF8F1F' : '#646464'}
              bgColor={currentDirection == 2 ? '#FFF2E5' : '#fff'}
            >
              {currentDirection >= 2 ? 'Decreases' : <img src={questionMark} />}
            </GridItem>
            <GridItem
              width={220}
              bdrRadius="0px"
              color={currentDirection == 2 ? '#FF8F1F' : '#646464'}
              bgColor={currentDirection == 2 ? '#FFF2E5' : '#fff'}
            >
              {currentDirection >= 2 ? 'Stays constant' : <img src={questionMark} />}
            </GridItem>
            <GridItem
              width={160}
              bdrRadius="0px"
              color={'#444'}
              bgColor={currentDirection == 3 ? '#FFF2E5' : '#fff'}
            >
              Up
            </GridItem>
            <GridItem
              width={220}
              bdrRadius="0px"
              color={currentDirection == 3 ? '#FF8F1F' : '#646464'}
              bgColor={currentDirection == 3 ? '#FFF2E5' : '#fff'}
            >
              {currentDirection >= 3 ? 'Stays constant' : <img src={questionMark} />}
            </GridItem>
            <GridItem
              width={220}
              bdrRadius="0px"
              color={currentDirection == 3 ? '#FF8F1F' : '#646464'}
              bgColor={currentDirection == 3 ? '#FFF2E5' : '#fff'}
            >
              {currentDirection >= 3 ? 'Increases' : <img src={questionMark} />}
            </GridItem>
            <GridItem
              width={160}
              bdrRadius="0px 0px 0px 8px"
              color={'#444'}
              bgColor={currentDirection == 4 ? '#FFF2E5' : '#fff'}
            >
              Down
            </GridItem>
            <GridItem
              width={220}
              bdrRadius="0px"
              color={currentDirection == 4 ? '#FF8F1F' : '#646464'}
              bgColor={currentDirection == 4 ? '#FFF2E5' : '#fff'}
            >
              {currentDirection >= 4 ? 'Stays constant' : <img src={questionMark} />}
            </GridItem>
            <GridItem
              width={220}
              bdrRadius="0px 0px 8px 0px"
              color={currentDirection == 4 ? '#FF8F1F' : '#646464'}
              bgColor={currentDirection == 4 ? '#FFF2E5' : '#fff'}
            >
              {currentDirection >= 4 ? 'Decreases' : <img src={questionMark} />}
            </GridItem>
          </GridContainer>
        </BlueBG>
      )}
      <GGBContainer visibility={pageNum > 0}>
        <Geogebra materialId="sjtfgfjy" onApiReady={onGGBHandle} />
      </GGBContainer>
      {pageNum == 2 && (
        <>
          <SelectionContainer top={555}>
            <SelectionHelper>{'\u2022 ' + xText[currentDirection]}</SelectionHelper>
            <Box
              onClick={() => {
                if (xAns[currentDirection] !== xDirectionValue) {
                  onInteraction('tap')
                  playClick()
                  if (!displayDropDown1) {
                    setDisplayDropDown1(true)
                    setDisplayDropDown2(false)
                  } else setDisplayDropDown1(false)
                }
              }}
              colorTheme={
                xDirectionValue > 0
                  ? xAns[currentDirection] == xDirectionValue
                    ? 'green'
                    : 'red'
                  : 'default'
              }
            >
              <SelectedText
                colorTheme={
                  xDirectionValue > 0
                    ? xAns[currentDirection] == xDirectionValue
                      ? 'green'
                      : 'red'
                    : 'default'
                }
              >
                {ddValues[xDirectionValue]}
              </SelectedText>
              {xDirectionValue == 0 && <img src={arrowBlack} />}
              {xDirectionValue > 0 && xAns[currentDirection] != xDirectionValue && (
                <img src={arrowRed} />
              )}
              {displayDropDown1 && (
                <OptionsContainer stage={stage1}>
                  <Option
                    onClick={() => {
                      if (ggbApi.current) {
                        setXDirectionValue(1)
                        ggbApi.current.evalCommand('RunClickScript(inc1)')
                      }
                    }}
                  >
                    increases
                  </Option>
                  <Option
                    onClick={() => {
                      if (ggbApi.current) {
                        setXDirectionValue(2)
                        ggbApi.current.evalCommand('RunClickScript(dec1)')
                      }
                    }}
                  >
                    decreases
                  </Option>
                  <Option
                    onClick={() => {
                      if (ggbApi.current) {
                        setXDirectionValue(3)
                        ggbApi.current.evalCommand('RunClickScript(sc1)')
                      }
                    }}
                  >
                    stays constant
                  </Option>
                </OptionsContainer>
              )}
              {xDirectionValue > 0 &&
                xAns[currentDirection] != xDirectionValue &&
                !displayDropDown1 && (
                  <FeedBack>
                    x-coordinate changed from <span>1</span> to <span>{coords.x}</span>.
                  </FeedBack>
                )}
            </Box>
          </SelectionContainer>
          <SelectionContainer top={635}>
            <SelectionHelper>{'\u2022 ' + yText[currentDirection]}</SelectionHelper>
            <Box
              onClick={() => {
                if (yAns[currentDirection] !== yDirectionValue) {
                  onInteraction('tap')
                  playClick()
                  if (!displayDropDown2) {
                    setDisplayDropDown2(true)
                    setDisplayDropDown1(false)
                  } else setDisplayDropDown2(false)
                }
              }}
              colorTheme={
                yDirectionValue > 0
                  ? yAns[currentDirection] == yDirectionValue
                    ? 'green'
                    : 'red'
                  : 'default'
              }
            >
              <SelectedText
                colorTheme={
                  yDirectionValue > 0
                    ? yAns[currentDirection] == yDirectionValue
                      ? 'green'
                      : 'red'
                    : 'default'
                }
              >
                {ddValues[yDirectionValue]}
              </SelectedText>
              {yDirectionValue == 0 && <img src={arrowBlack} />}
              {yDirectionValue > 0 && yAns[currentDirection] != yDirectionValue && (
                <img src={arrowRed} />
              )}
              {displayDropDown2 && (
                <OptionsContainer stage={stage2}>
                  <Option
                    onClick={() => {
                      if (ggbApi.current) {
                        setYDirectionValue(1)
                        ggbApi.current.evalCommand('RunClickScript(inc2)')
                      }
                    }}
                  >
                    increases
                  </Option>
                  <Option
                    onClick={() => {
                      if (ggbApi.current) {
                        setYDirectionValue(2)
                        ggbApi.current.evalCommand('RunClickScript(dec2)')
                      }
                    }}
                  >
                    decreases
                  </Option>
                  <Option
                    onClick={() => {
                      if (ggbApi.current) {
                        setYDirectionValue(3)
                        ggbApi.current.evalCommand('RunClickScript(sc2)')
                      }
                    }}
                  >
                    stays constant
                  </Option>
                </OptionsContainer>
              )}
              {yDirectionValue > 0 &&
                yAns[currentDirection] != yDirectionValue &&
                !displayDropDown2 && (
                  <FeedBack>
                    y-coordinate changed from <span>2</span> to <span>{coords.y}</span>.
                  </FeedBack>
                )}
            </Box>
          </SelectionContainer>
        </>
      )}
      {((pageNum == 0 && (currentDirection == 0 || currentDirection == 4)) || pageNum == 1) && (
        <HelperText>
          <Text>
            {pageNum == 0 &&
              currentDirection == 0 &&
              'Notice the change in coordinate as you move the point on the graph.'}
            {pageNum == 0 &&
              currentDirection == 4 &&
              'Awesome! You’ve observed the effect of translation in coordinate plane.'}
            {pageNum == 1 && nextDisabled && helperText[currentDirection]}
          </Text>
        </HelperText>
      )}
      <ButtonElement disabled={nextDisabled} onClick={onNextHandle}>
        {pageNum == 0 &&
          (currentDirection == 0 ? 'Start' : currentDirection == 4 ? <img src={retry} /> : 'Next')}
        {pageNum > 0 && 'Next'}
      </ButtonElement>
    </AppletContainer>
  )
}

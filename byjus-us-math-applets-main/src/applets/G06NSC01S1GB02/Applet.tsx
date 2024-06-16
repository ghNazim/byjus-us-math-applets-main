import { Player } from '@lottiefiles/react-lottie-player'
import { FC, useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { AppletContainer } from '@/common/AppletContainer'
import { Geogebra } from '@/common/Geogebra'
import { GeogebraAppApi } from '@/common/Geogebra/Geogebra.types'
import { TextHeader } from '@/common/Header'
import { AppletInteractionCallback } from '@/contexts/analytics'

import handCLick from '../../common/handAnimations/click.json'
import simplify from './assets/simplify.svg'
import tooltip from './assets/tooltip.png'
import tryNew from './assets/tryNew.svg'
import validate from './assets/validate.svg'
const GGB1 = styled(Geogebra)<{ visible: boolean }>`
  position: absolute;
  top: 92px;
  left: 50%;
  translate: -50%;
  scale: 1.05;
  ${(p) => !p.visible && 'visibility: hidden;'}
  width: 666px;
  height: 590px;
`
const GGB2 = styled(Geogebra)<{ visible: boolean }>`
  position: absolute;
  top: 95px;
  left: 50%;
  translate: -50%;
  scale: 1.05;
  ${(p) => !p.visible && 'visibility: hidden;'}
  width: 666px;
  height: 590px;
`
const GGB3 = styled(Geogebra)<{ visible: boolean }>`
  position: absolute;
  top: 95px;
  left: 50%;
  translate: -50%;
  scale: 1.05;
  ${(p) => !p.visible && 'visibility: hidden;'}
  width: 666px;
  height: 590px;
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
  border-radius: 10px;
  cursor: pointer;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 24px;
  line-height: 32px;
  color: #ffffff;
`
const Tooltip1 = styled.img`
  position: absolute;
  left: 267px;
  top: 332px;
`
const Tooltip2 = styled.img`
  position: absolute;
  left: 267px;
  top: 414px;
`
const InputBox = styled.input<{ top: number; width: number; bg: number }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 4px;
  position: absolute;
  height: 60px;
  background: ${(p) => (p.bg == 0 ? '#ffffff' : p.bg == 1 ? '#FFF2F2' : '#ECFFD9')};
  border: 1px solid ${(p) => (p.bg == 0 ? '#646464' : p.bg == 1 ? '#CC6666' : ' #6CA621')};
  color: ${(p) => (p.bg == 0 ? '#646464' : p.bg == 1 ? '#CC6666' : ' #6CA621')};
  border-radius: 12px;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 24px;
  line-height: 32px;
  justify-items: center;
  text-align: center;
  width: ${(p) => p.width}px;
  left: 357px;
  top: ${(p) => p.top}px;
`
const HelperText = styled.div`
  position: absolute;
  bottom: 150px;
  left: 50%;
  translate: -50%;
  width: 700px;
  height: 80px;
  padding-top: 30px;
  background: #ffffff;
  text-align: center;
  color: #444444;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;
`
const ClickPlayer = styled(Player)<{ top: number; left: number }>`
  position: absolute;
  top: ${(p) => p.top}px;
  left: ${(p) => p.left}px;
  pointer-events: none;
`
const topPosition = [260, 693, 252]
const leftPosition = [70, 292, 320]
const helperTexts = [
  'Rewrite the division expression into multiplication expression.',
  'Excellent! Now proceed to simplify the equation.',
  'Enter the numerator and denominator values.',
  "Let's reduce the fraction to its simplest form.",
  "Excellent work! Let's validate the answer by using tape diagram.",
  'We can now confirm that the answer is correct.',
]
export const AppletG06NSC01S1GB02: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const ggbApi1 = useRef<GeogebraAppApi | null>(null)
  const ggbApi2 = useRef<GeogebraAppApi | null>(null)
  const ggbApi3 = useRef<GeogebraAppApi | null>(null)
  const [ggb1Visible, setGgb1Visible] = useState(true)
  const [ggb2Visible, setGgb2Visible] = useState(false)
  const [ggb3Visible, setGgb3Visible] = useState(false)
  const [nextVisible, setNextVisible] = useState(false)
  const [pageNumber, setPageNumber] = useState(0)
  const [input1, setInput1] = useState(0)
  const [input2, setInput2] = useState(0)
  const [position, setPosition] = useState(0)
  const [displayText, setDisplayText] = useState(0)
  const [showHandPointer, setShowHandPointer] = useState(true)
  const [ggbLoaded, setGgbLoaded] = useState(false)
  const onHandleGGB1 = useCallback((api: GeogebraAppApi | null) => {
    ggbApi1.current = api
    if (api == null) return
    setGgbLoaded(true)
    api.registerObjectUpdateListener('ans1', () => {
      setPosition(1)
      if (ggbApi1.current) {
        if (
          ggbApi1.current.getValue('ans1') &&
          ggbApi1.current.getValue('ans2') &&
          ggbApi1.current.getValue('ans3')
        ) {
          setNextVisible(true)
          setDisplayText(1)
          setShowHandPointer(true)
        }
      }
    })
    api.registerObjectUpdateListener('ans2', () => {
      if (ggbApi1.current) {
        if (
          ggbApi1.current.getValue('ans1') &&
          ggbApi1.current.getValue('ans2') &&
          ggbApi1.current.getValue('ans3')
        ) {
          setNextVisible(true)
          setDisplayText(1)
          setShowHandPointer(true)
        }
      }
    })
    api.registerObjectUpdateListener('ans3', () => {
      if (ggbApi1.current) {
        if (
          ggbApi1.current.getValue('ans1') &&
          ggbApi1.current.getValue('ans2') &&
          ggbApi1.current.getValue('ans3')
        ) {
          setNextVisible(true)
          setDisplayText(1)
          setShowHandPointer(true)
        }
      }
    })
    api.registerObjectUpdateListener('validate', () => {
      if (ggbApi1.current) {
        if (ggbApi1.current.getValue('validate')) {
          setNextVisible(true)
          setDisplayText(4)
        }
      }
    })
    api.registerObjectUpdateListener('validate', () => {
      if (ggbApi1.current) {
        if (ggbApi1.current.getValue('validate')) {
          setNextVisible(true)
          setDisplayText(4)
        }
      }
    })
    api.registerClientListener((e) => {
      if (
        e.type === 'mouseDown' &&
        (e.hits[0] === 'DDB' || e.hits[0] === 'pic6' || e.hits[0] === 'pic7')
      )
        setShowHandPointer(false)
    })
  }, [])
  useEffect(() => {
    switch (pageNumber) {
      case 0:
        setDisplayText(0)
        setNextVisible(false)
        break
      case 1:
        setDisplayText(2)
        if (ggb2Visible && ggbApi2.current) {
          ggbApi2.current.setValue('values', 1)
        } else if (ggb3Visible && ggbApi3.current) {
          ggbApi3.current.setValue('values', 1)
        }
        setNextVisible(false)
        break
      case 2:
        if (ggb1Visible && ggbApi1.current) {
          setPosition(2)
          ggbApi1.current.setValue('screen', 1)
          setNextVisible(false)
          setDisplayText(2)
        } else if (ggb2Visible && ggbApi2.current) {
          ggbApi2.current.setValue('sim1', 1)
          setDisplayText(4)
        } else if (ggb3Visible && ggbApi3.current) {
          ggbApi3.current.setValue('sim1', 1)
          setDisplayText(4)
        }
        break
      case 3:
        setDisplayText(5)
        if (ggb1Visible && ggbApi1.current) {
          ggbApi1.current.setValue('screen', 3)
        } else if (ggb2Visible && ggbApi2.current) {
          ggbApi2.current.setValue('val1', 1)
        } else if (ggb3Visible && ggbApi3.current) {
          ggbApi3.current.setValue('val1', 1)
        }
        break
    }
  }, [pageNumber])
  const onHandleGGB2 = useCallback((api: GeogebraAppApi | null) => {
    ggbApi2.current = api
    if (api == null) return
    api.registerObjectUpdateListener('bool1', () => {
      if (ggbApi2.current) {
        if (
          ggbApi2.current.getValue('bool1') &&
          ggbApi2.current.getValue('bool5') &&
          ggbApi2.current.getValue('bool9')
        ) {
          setNextVisible(true)
          setDisplayText(1)
        }
      }
    })
    api.registerObjectUpdateListener('bool5', () => {
      if (ggbApi2.current) {
        if (
          ggbApi2.current.getValue('bool1') &&
          ggbApi2.current.getValue('bool5') &&
          ggbApi2.current.getValue('bool9')
        ) {
          setNextVisible(true)
          setDisplayText(1)
        }
      }
    })
    api.registerObjectUpdateListener('bool9', () => {
      if (ggbApi2.current) {
        if (
          ggbApi2.current.getValue('bool1') &&
          ggbApi2.current.getValue('bool5') &&
          ggbApi2.current.getValue('bool9')
        ) {
          setNextVisible(true)
          setDisplayText(1)
        }
      }
    })
    api.registerObjectUpdateListener('a', () => {
      if (ggbApi2.current) {
        if (ggbApi2.current.getValue('a') == 12 && ggbApi2.current.getValue('b') == 3) {
          setNextVisible(true)
          setDisplayText(3)
        }
      }
    })
    api.registerObjectUpdateListener('b', () => {
      if (ggbApi2.current) {
        if (ggbApi2.current.getValue('a') == 12 && ggbApi2.current.getValue('b') == 3) {
          setNextVisible(true)
          setDisplayText(3)
        }
      }
    })
  }, [])
  const onHandleGGB3 = useCallback((api: GeogebraAppApi | null) => {
    ggbApi3.current = api
    if (api == null) return
    api.registerObjectUpdateListener('bool1', () => {
      if (ggbApi3.current) {
        if (
          ggbApi3.current.getValue('bool1') &&
          ggbApi3.current.getValue('bool5') &&
          ggbApi3.current.getValue('bool9')
        ) {
          setNextVisible(true)
          setDisplayText(1)
        }
      }
    })
    api.registerObjectUpdateListener('bool5', () => {
      if (ggbApi3.current) {
        if (
          ggbApi3.current.getValue('bool1') &&
          ggbApi3.current.getValue('bool5') &&
          ggbApi3.current.getValue('bool9')
        ) {
          setNextVisible(true)
          setDisplayText(1)
        }
      }
    })
    api.registerObjectUpdateListener('bool9', () => {
      if (ggbApi3.current) {
        if (
          ggbApi3.current.getValue('bool1') &&
          ggbApi3.current.getValue('bool5') &&
          ggbApi3.current.getValue('bool9')
        ) {
          setNextVisible(true)
          setDisplayText(1)
        }
      }
    })
    api.registerObjectUpdateListener('a', () => {
      if (ggbApi3.current) {
        if (ggbApi3.current.getValue('a') == 30 && ggbApi3.current.getValue('b') == 3) {
          setNextVisible(true)
          setDisplayText(3)
        }
      }
    })
    api.registerObjectUpdateListener('b', () => {
      if (ggbApi3.current) {
        if (ggbApi3.current.getValue('a') == 30 && ggbApi3.current.getValue('b') == 3) {
          setNextVisible(true)
          setDisplayText(3)
        }
      }
    })
  }, [])
  const onNextHandle = () => {
    if (ggb1Visible && pageNumber == 0) setPageNumber(2)
    else if (pageNumber == 3) {
      setPageNumber(0)
      setInput1(0)
      setInput2(0)
      if (ggb1Visible && ggbApi1.current) {
        ggbApi1.current.evalCommand('RunClickScript(button1)')
        setGgb1Visible(false)
        setGgb2Visible(true)
      } else if (ggb2Visible && ggbApi2.current) {
        ggbApi2.current.evalCommand('RunClickScript(button1)')
        setGgb2Visible(false)
        setGgb3Visible(true)
      } else if (ggb3Visible && ggbApi3.current) {
        ggbApi3.current.evalCommand('RunClickScript(button1)')
        setGgb3Visible(false)
        setGgb1Visible(true)
      }
    } else setPageNumber((p) => p + 1)
  }
  const onInput1Handle = (e: any) => {
    if (ggb1Visible && ggbApi1.current) {
      if (e.target.value == 6) {
        ggbApi1.current.setValue('ans', e.target.value)
        setInput1(2)
      } else setInput1(1)
    } else if (ggb2Visible && ggbApi2.current) {
      if (e.target.value == 12) {
        ggbApi2.current.setValue('a', e.target.value)
        setInput1(2)
      } else setInput1(1)
    } else if (ggb3Visible && ggbApi3.current) {
      if (e.target.value == 30) {
        ggbApi3.current.setValue('a', e.target.value)
        setInput1(2)
      } else setInput1(1)
    }
  }
  const onInput2Handle = (e: any) => {
    if (ggb1Visible && ggbApi1.current) {
      if (e.target.value == 1) {
        ggbApi1.current.setValue('answer', e.target.value)
        setInput2(2)
      } else setInput2(1)
    } else if (ggb2Visible && ggbApi2.current) {
      if (e.target.value == 3) {
        ggbApi2.current.setValue('b', e.target.value)
        setInput2(2)
      } else setInput2(1)
    } else if (ggb3Visible && ggbApi3.current) {
      if (e.target.value == 3) {
        ggbApi3.current.setValue('b', e.target.value)
        setInput2(2)
      } else setInput2(1)
    }
  }
  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#F6F6F6',
        id: 'g06-nsc01-s1-gb02',
        onEvent,
        className,
      }}
    >
      <TextHeader
        text="Divide fractions and validate using tape diagrams."
        backgroundColor="#F6F6F6"
        buttonColor="#1A1A1A"
      />
      <GGB1 materialId="rubwzfwy" onApiReady={onHandleGGB1} visible={ggb1Visible} />
      <GGB2 materialId="pxbyknqh" onApiReady={onHandleGGB2} visible={ggb2Visible} />
      <GGB3 materialId="dsp29gqy" onApiReady={onHandleGGB3} visible={ggb3Visible} />
      {((ggb1Visible && pageNumber == 2) || (!ggb1Visible && pageNumber == 1)) && (
        <>
          <InputBox
            bg={input1}
            width={ggb1Visible ? 108 : 66}
            top={271}
            onChange={onInput1Handle}
            onClick={() => {
              setShowHandPointer(false)
              setPosition(0)
            }}
          />
          <InputBox
            bg={input2}
            width={ggb1Visible ? 108 : 66}
            top={353}
            onChange={onInput2Handle}
          />
        </>
      )}
      {input1 == 1 && <Tooltip1 src={tooltip} draggable={false} />}
      {input2 == 1 && <Tooltip2 src={tooltip} draggable={false} />}
      {ggbLoaded && <HelperText>{helperTexts[displayText]}</HelperText>}
      {nextVisible && (
        <ButtonElement onClick={onNextHandle}>
          {pageNumber == 0 && 'Next'}
          {pageNumber == 1 && <img src={simplify} />}
          {pageNumber == 2 && <img src={validate} />}
          {pageNumber == 3 && <img src={tryNew} />}
        </ButtonElement>
      )}
      {ggbLoaded && showHandPointer && (
        <ClickPlayer
          src={handCLick}
          loop
          autoplay
          top={topPosition[position]}
          left={leftPosition[position]}
        />
      )}
    </AppletContainer>
  )
}

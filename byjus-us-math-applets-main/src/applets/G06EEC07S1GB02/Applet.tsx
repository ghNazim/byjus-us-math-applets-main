import { Player } from '@lottiefiles/react-lottie-player'
import { FC, useCallback, useContext, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { AppletContainer } from '@/common/AppletContainer'
import { Geogebra } from '@/common/Geogebra'
import { GeogebraAppApi } from '@/common/Geogebra/Geogebra.types'
import { TextHeader } from '@/common/Header'
import { AnalyticsContext, AppletInteractionCallback } from '@/contexts/analytics'
import { useSFX } from '@/hooks/useSFX'

import handClick from '../../common/handAnimations/click.json'
import handSlider from '../../common/handAnimations/moveHorizontally.json'
import tryNew from './assets/tryNew.svg'
const ButtonDiv = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
  width: 676px;
  height: 100px;
  position: absolute;
  left: 50%;
  translate: -50%;
  bottom: 90px;
  gap: 16px;
`
const ButtonContainer = styled.button`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
  width: 328px;
  height: 90px;
  position: relative;
  border: 1px solid #6549c2;
  border-radius: 12px;
  background: none;
  div {
    position: absolute;
    left: 50%;
    translate: -50%;
    top: -12px;
    width: 168px;
    height: 24px;
    font-family: 'Nunito';
    font-style: normal;
    font-weight: 700;
    font-size: 16px;
    line-height: 24px;
    display: flex;
    align-items: center;
    text-align: center;
    justify-content: center;
    color: #6549c2;
    background: #ffffff;
  }
  :disabled {
    opacity: 0.3;
  }
`
const Button = styled.button<{ highLight: string }>`
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 140px;
  height: 60px;
  background: ${(props) =>
    props.highLight == 'green' ? '#ECFFD9' : props.highLight == 'red' ? '#FFF2F2' : '#ffffff'};
  border: 1px solid
    ${(props) =>
      props.highLight == 'green' ? '#6CA621' : props.highLight == 'red' ? '#CC6666' : '#d9cdff'};

  ${(props) => (props.highLight == 'none' ? 'box-shadow: inset 0px -4px 0px #dad2f7;' : '')}
  border-radius: 12px;
  cursor: pointer;
  :disabled {
    cursor: not-allowed;
  }
`
const TryNew = styled.button`
  position: absolute;
  left: 50%;
  translate: -50%;
  bottom: 20px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 178px;
  height: 60px;
  background: #8c69ff;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  &:disabled {
    cursor: default;
    opacity: 0.2;
  }
  &:hover {
    background: #7f5cf4;
  }
  &:active {
    background: #6549c2;
  }
`
const ClickPlayer = styled(Player)<{ top: number; left: number }>`
  position: absolute;
  left: ${(props) => props.left}px;
  top: ${(props) => props.top}px;
  pointer-events: none;
`
const GGB = styled(Geogebra)<{ visible: boolean }>`
  position: absolute;
  left: 50%;
  translate: -50%;
  top: 85px;
  ${(props) => !props.visible && 'visibility:hidden;'}
`
const SlidePlayer = styled(Player)<{ top: number; left: number }>`
  position: absolute;
  left: ${(props) => props.left}px;
  top: 386px;
  pointer-events: none;
`
const sliderLeftPos = [-136, -136, -72, -72]
export const AppletG06EEC07S1GB02: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const ggbApi1 = useRef<GeogebraAppApi | null>(null)
  const ggbApi2 = useRef<GeogebraAppApi | null>(null)
  const ggbApi3 = useRef<GeogebraAppApi | null>(null)
  const ggbApi4 = useRef<GeogebraAppApi | null>(null)
  const [button1Highlight, setButton1Highlight] = useState<Array<'none' | 'green' | 'red'>>([
    'none',
    'none',
  ])
  const [button2Highlight, setButton2Highlight] = useState<Array<'none' | 'green' | 'red'>>([
    'none',
    'none',
  ])
  const [ggbLoaded, setGgbLoaded] = useState(false)
  const [btn1Disable, setBtn1Disable] = useState(false)
  const [btn2Disable, setBtn2Disable] = useState(true)
  const [chooseVisible, setChooseVisible] = useState(false)
  const playMouseClick = useSFX('mouseClick')
  const playMouseIn = useSFX('mouseIn')
  const playMouseOut = useSFX('mouseOut')
  const onInteraction = useContext(AnalyticsContext)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [showHandChoose, setShowHandChoose] = useState(true)
  const [handPosition, setHandPosition] = useState(0)
  const [showTryNew, setShowTryNew] = useState(false)
  const [showHandSlider, setShowHandSlider] = useState(false)
  const onGGBReady1 = useCallback((api: GeogebraAppApi | null) => {
    ggbApi1.current = api
    if (api == null) return
    setGgbLoaded(true)
    api.registerObjectUpdateListener('drop', () => {
      if (ggbApi1.current == null) return
      if (ggbApi1.current.getValue('drop') == 1) {
        playMouseClick()
        onInteraction('tap')
        setShowHandChoose(false)
      }
    })
    api.registerObjectUpdateListener('bool4', () => {
      if (ggbApi1.current == null) return
      if (ggbApi1.current.getValue('bool4') == 1) {
        setShowHandSlider(true)
      }
    })
    api.registerClientListener((e: any) => {
      if (e.type === 'mouseDown' && e.hits[0] === 'G') {
        onInteraction('drag')
        playMouseIn()
        setShowHandSlider(false)
      } else if (e.type === 'dragEnd' && e.target === 'G') {
        onInteraction('drop')
        playMouseOut()
      }
    })
    api.registerObjectUpdateListener('greenpointer', () => {
      if (ggbApi1.current == null) return
      if (ggbApi1.current.getVisible('greenpointer')) {
        setChooseVisible(true)
        setShowHandChoose(true)
      } else {
        setChooseVisible(false)
        setShowHandChoose(false)
      }
    })
  }, [])
  const onGGBReady2 = useCallback((api: GeogebraAppApi | null) => {
    ggbApi2.current = api
    if (api == null) return
    api.registerObjectUpdateListener('drop', () => {
      if (ggbApi2.current == null) return
      if (ggbApi2.current.getValue('drop') == 1) {
        playMouseClick()
        onInteraction('tap')
        setShowHandChoose(false)
      }
    })
    api.registerObjectUpdateListener('bool4', () => {
      if (ggbApi2.current == null) return
      if (ggbApi2.current.getValue('bool4') == 1) {
        setShowHandSlider(true)
      }
    })
    api.registerClientListener((e: any) => {
      if (e.type === 'mouseDown' && e.hits[0] === 'G') {
        onInteraction('drag')
        playMouseIn()
        setShowHandSlider(false)
      } else if (e.type === 'dragEnd' && e.target === 'G') {
        onInteraction('drop')
        playMouseOut()
      }
    })
    api.registerObjectUpdateListener('greenpointer', () => {
      if (ggbApi2.current == null) return
      if (ggbApi2.current.getVisible('greenpointer')) {
        setChooseVisible(true)
        setShowHandChoose(true)
      } else {
        setChooseVisible(false)
        setShowHandChoose(false)
      }
    })
  }, [])
  const onGGBReady3 = useCallback((api: GeogebraAppApi | null) => {
    ggbApi3.current = api
    if (api == null) return
    api.registerObjectUpdateListener('drop', () => {
      if (ggbApi3.current == null) return
      if (ggbApi3.current.getValue('drop') == 1) {
        playMouseClick()
        onInteraction('tap')
        setShowHandChoose(false)
      }
    })
    api.registerObjectUpdateListener('bool1', () => {
      if (ggbApi3.current == null) return
      if (ggbApi3.current.getValue('bool1') == 1) {
        setShowHandSlider(true)
      }
    })
    api.registerClientListener((e: any) => {
      if (e.type === 'mouseDown' && e.hits[0] === 'G') {
        onInteraction('drag')
        playMouseIn()
        setShowHandSlider(false)
      } else if (e.type === 'dragEnd' && e.target === 'G') {
        onInteraction('drop')
        playMouseOut()
      }
    })
    api.registerObjectUpdateListener('greenpointer', () => {
      if (ggbApi3.current == null) return
      if (ggbApi3.current.getVisible('greenpointer')) {
        setChooseVisible(true)
        setShowHandChoose(true)
      } else {
        setChooseVisible(false)
        setShowHandChoose(false)
      }
    })
  }, [])
  const onGGBReady4 = useCallback((api: GeogebraAppApi | null) => {
    ggbApi4.current = api
    if (api == null) return
    api.registerObjectUpdateListener('drop', () => {
      if (ggbApi4.current == null) return
      if (ggbApi4.current.getValue('drop') == 1) {
        playMouseClick()
        onInteraction('tap')
        setShowHandChoose(false)
      }
    })
    api.registerObjectUpdateListener('bool1', () => {
      if (ggbApi4.current == null) return
      if (ggbApi4.current.getValue('bool1') == 1) {
        setShowHandSlider(true)
      }
    })
    api.registerClientListener((e: any) => {
      if (e.type === 'mouseDown' && e.hits[0] === 'G') {
        onInteraction('drag')
        playMouseIn()
        setShowHandSlider(false)
      } else if (e.type === 'dragEnd' && e.target === 'G') {
        onInteraction('drop')
        playMouseOut()
      }
    })
    api.registerObjectUpdateListener('greenpointer', () => {
      if (ggbApi4.current == null) return
      if (ggbApi4.current.getVisible('greenpointer')) {
        setChooseVisible(true)
        setShowHandChoose(true)
      } else {
        setChooseVisible(false)
        setShowHandChoose(false)
      }
    })
  }, [])

  useEffect(() => {
    if (chooseVisible) {
      setHandPosition(1)
    }
  }, [chooseVisible])
  useEffect(() => {
    if (!btn2Disable) {
      setShowHandChoose(true)
      setHandPosition(2)
    }
    if (btn1Disable && btn2Disable) {
      setShowTryNew(true)
    }
  }, [btn2Disable])

  const buttonSet1Handle = (value: number) => {
    setShowHandChoose(false)
    playMouseClick()
    onInteraction('tap')
    switch (currentQuestion) {
      case 0:
        if (ggbApi1.current == null) return

        if (value == 0) {
          ggbApi1.current.setValue('range', 1)
          setButton1Highlight((v) => {
            let d = v
            d = ['none', 'none']
            d[value] = 'red'
            return d
          })
        } else {
          ggbApi1.current.setValue('range', 2)
          setButton1Highlight((v) => {
            let d = v
            d = ['none', 'none']
            d[value] = 'green'
            return d
          })
          setBtn1Disable(true)
          setBtn2Disable(false)
        }
        break
      case 1:
        if (ggbApi2.current == null) return
        if (value == 0) {
          ggbApi2.current.setValue('range', 1)
          setButton1Highlight((v) => {
            let d = v
            d = ['none', 'none']
            d[value] = 'red'
            return d
          })
        } else {
          ggbApi2.current.setValue('range', 2)
          setButton1Highlight((v) => {
            let d = v
            d = ['none', 'none']
            d[value] = 'green'
            return d
          })
          setBtn1Disable(true)
          setBtn2Disable(false)
        }
        break
      case 2:
        if (ggbApi3.current == null) return
        if (value == 0) {
          ggbApi3.current.setValue('range', 1)
          setButton1Highlight((v) => {
            let d = v
            d = ['none', 'none']
            d[value] = 'green'
            return d
          })
          setBtn1Disable(true)
          setBtn2Disable(false)
        } else {
          ggbApi3.current.setValue('range', 2)
          setButton1Highlight((v) => {
            let d = v
            d = ['none', 'none']
            d[value] = 'red'
            return d
          })
        }
        break
      case 3:
        if (ggbApi4.current == null) return
        if (value == 0) {
          ggbApi4.current.setValue('range', 1)
          setButton1Highlight((v) => {
            let d = v
            d = ['none', 'none']
            d[value] = 'green'
            return d
          })
          setBtn1Disable(true)
          setBtn2Disable(false)
        } else {
          ggbApi4.current.setValue('range', 2)
          setButton1Highlight((v) => {
            let d = v
            d = ['none', 'none']
            d[value] = 'red'
            return d
          })
        }
        break
    }
  }
  const buttonSet2Handle = (value: number) => {
    setShowHandChoose(false)
    playMouseClick()
    onInteraction('tap')
    switch (currentQuestion) {
      case 0:
        if (ggbApi1.current == null) return

        if (value == 0) {
          ggbApi1.current.setValue('dott', 1)
          setButton2Highlight((v) => {
            let d = v
            d = ['none', 'none']
            d[value] = 'red'
            return d
          })
        } else {
          ggbApi1.current.setValue('dott', 2)
          setButton2Highlight((v) => {
            let d = v
            d = ['none', 'none']
            d[value] = 'green'
            return d
          })
          setBtn2Disable(true)
        }
        break
      case 1:
        if (ggbApi2.current == null) return

        if (value == 0) {
          ggbApi2.current.setValue('dott', 1)
          setButton2Highlight((v) => {
            let d = v
            d = ['none', 'none']
            d[value] = 'red'
            return d
          })
        } else {
          ggbApi2.current.setValue('dott', 2)
          setButton2Highlight((v) => {
            let d = v
            d = ['none', 'none']
            d[value] = 'green'
            return d
          })
          setBtn2Disable(true)
        }
        break
      case 2:
        if (ggbApi3.current == null) return
        if (value == 0) {
          ggbApi3.current.setValue('dott', 1)
          setButton2Highlight((v) => {
            let d = v
            d = ['none', 'none']
            d[value] = 'red'
            return d
          })
        } else {
          ggbApi3.current.setValue('dott', 2)
          setButton2Highlight((v) => {
            let d = v
            d = ['none', 'none']
            d[value] = 'green'
            return d
          })
          setBtn2Disable(true)
        }
        break
      case 3:
        if (ggbApi4.current == null) return
        if (value == 0) {
          ggbApi4.current.setValue('dott', 1)
          setButton2Highlight((v) => {
            let d = v
            d = ['none', 'none']
            d[value] = 'red'
            return d
          })
        } else {
          ggbApi4.current.setValue('dott', 2)
          setButton2Highlight((v) => {
            let d = v
            d = ['none', 'none']
            d[value] = 'green'
            return d
          })
          setBtn2Disable(true)
        }
        break
    }
  }
  const tryNewClicked = () => {
    switch (currentQuestion) {
      case 0:
        if (!ggbApi1.current) return
        ggbApi1.current.evalCommand('RunClickScript(button1)')
        break
      case 1:
        if (!ggbApi2.current) return
        ggbApi2.current.evalCommand('RunClickScript(button1)')
        break
      case 2:
        if (!ggbApi3.current) return
        ggbApi3.current.evalCommand('RunClickScript(button1)')
        break
      case 3:
        if (!ggbApi4.current) return
        ggbApi4.current.evalCommand('RunClickScript(button1)')
        break
    }
    setCurrentQuestion((v) => (v < 3 ? v + 1 : 0))
    playMouseClick()
    onInteraction('tap')
    setButton1Highlight(['none', 'none'])
    setButton2Highlight(['none', 'none'])
    setBtn1Disable(false)
    setChooseVisible(false)
    setShowTryNew(false)
    setHandPosition(0)
    setShowHandChoose(true)
  }

  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#F6F6F6',
        id: 'g06-eec07-s1-gb02',
        onEvent,
        className,
      }}
    >
      <TextHeader
        text="Express the statement as an inequality and plot it on the number line."
        backgroundColor="#F6F6F6"
        buttonColor="#1A1A1A"
      />
      <GGB
        onApiReady={onGGBReady1}
        materialId="w6ky59wg"
        visible={currentQuestion == 0 ? true : false}
      />
      <GGB
        onApiReady={onGGBReady2}
        materialId="hpdzmv2z"
        visible={currentQuestion == 1 ? true : false}
      />
      <GGB
        onApiReady={onGGBReady3}
        materialId="jqtajxgn"
        visible={currentQuestion == 2 ? true : false}
      />
      <GGB
        onApiReady={onGGBReady4}
        materialId="ese362gy"
        visible={currentQuestion == 3 ? true : false}
      />
      {showHandSlider && (
        <SlidePlayer
          src={handSlider}
          top={386}
          left={sliderLeftPos[currentQuestion]}
          autoplay
          loop
        />
      )}
      {chooseVisible && (
        <ButtonDiv>
          <ButtonContainer disabled={btn1Disable}>
            <div>Choose Direction</div>
            <Button
              disabled={btn1Disable}
              highLight={button1Highlight[0]}
              onClick={() => {
                buttonSet1Handle(0)
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width={28} height={18} fill="none">
                <path
                  fill={
                    button1Highlight[0] == 'green'
                      ? '#6CA621'
                      : button1Highlight[0] == 'red'
                      ? '#CC6666'
                      : '#888'
                  }
                  d="M11.28 17.516c.36-.323.533-.713.519-1.17-.015-.458-.202-.848-.563-1.171l-5.079-4.56h20.045c.51 0 .937-.156 1.282-.466.345-.31.517-.693.516-1.149 0-.457-.173-.841-.518-1.151-.345-.31-.772-.464-1.28-.463H6.157l5.124-4.601c.36-.323.54-.707.54-1.151 0-.445-.18-.828-.54-1.15A1.854 1.854 0 0 0 9.999 0c-.495 0-.922.161-1.28.484L.494 7.87c-.18.161-.307.336-.383.525C.036 8.583 0 8.785 0 9c0 .215.038.417.113.605.076.189.203.364.381.525l8.27 7.426c.33.296.741.444 1.235.444.494 0 .921-.161 1.282-.484Z"
                />
              </svg>
            </Button>
            <Button
              disabled={btn1Disable}
              highLight={button1Highlight[1]}
              onClick={() => {
                buttonSet1Handle(1)
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width={28} height={18} fill="none">
                <path
                  fill={
                    button1Highlight[1] == 'green'
                      ? '#6CA621'
                      : button1Highlight[1] == 'red'
                      ? '#CC6666'
                      : '#888'
                  }
                  d="M16.72 17.516c-.36-.323-.533-.713-.519-1.17.015-.458.202-.848.563-1.171l5.079-4.56H1.798c-.51 0-.937-.156-1.282-.466A1.478 1.478 0 0 1 0 9c0-.457.173-.841.518-1.151.345-.31.772-.464 1.28-.463h20.045l-5.124-4.601c-.36-.323-.54-.707-.54-1.151 0-.445.18-.828.54-1.15.36-.323.787-.484 1.282-.484s.921.161 1.28.484l8.225 7.386c.18.161.307.336.383.525.075.188.112.39.111.605 0 .215-.038.417-.113.605a1.428 1.428 0 0 1-.381.525l-8.27 7.426c-.33.296-.741.444-1.235.444-.494 0-.921-.161-1.282-.484Z"
                />
              </svg>
            </Button>
          </ButtonContainer>
          <ButtonContainer disabled={btn2Disable}>
            <div>Choose Point Style</div>
            <Button
              disabled={btn2Disable}
              highLight={button2Highlight[0]}
              onClick={() => {
                buttonSet2Handle(0)
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width={29} height={28} fill="none">
                <circle
                  cx={14.5}
                  cy={14}
                  r={14}
                  fill={
                    button2Highlight[0] == 'green'
                      ? '#6CA621'
                      : button2Highlight[0] == 'red'
                      ? '#CC6666'
                      : '#888'
                  }
                />
                <circle
                  cx={14.5}
                  cy={14}
                  r={8.75}
                  fill={
                    button2Highlight[0] == 'green'
                      ? '#ECFFD9'
                      : button2Highlight[0] == 'red'
                      ? '#FFF2F2'
                      : '#ffffff'
                  }
                />
              </svg>
            </Button>
            <Button
              disabled={btn2Disable}
              highLight={button2Highlight[1]}
              onClick={() => {
                buttonSet2Handle(1)
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width={29} height={28} fill="none">
                <circle
                  cx={14.5}
                  cy={14}
                  r={14}
                  fill={
                    button2Highlight[1] == 'green'
                      ? '#6CA621'
                      : button2Highlight[1] == 'red'
                      ? '#CC6666'
                      : '#888'
                  }
                />
                <circle
                  cx={14.5}
                  cy={14}
                  r={8.75}
                  fill={
                    button2Highlight[1] == 'green'
                      ? '#6CA621'
                      : button2Highlight[1] == 'red'
                      ? '#CC6666'
                      : '#888'
                  }
                />
              </svg>
            </Button>
          </ButtonContainer>
        </ButtonDiv>
      )}
      {ggbLoaded && showHandChoose && (
        <ClickPlayer
          src={handClick}
          top={handPosition == 0 ? 162 : 605}
          left={handPosition == 0 ? 312 : handPosition == 1 ? 40 : 382}
          autoplay
          loop
        />
      )}
      {showTryNew && (
        <TryNew
          onClick={() => {
            tryNewClicked()
          }}
        >
          <img src={tryNew} />
        </TryNew>
      )}
    </AppletContainer>
  )
}

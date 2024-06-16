import { Player } from '@lottiefiles/react-lottie-player'
import { number } from 'mathjs'
import { FC, useCallback, useContext, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { click, rotateBothSides, slider } from '@/assets/onboarding'
import { AppletContainer } from '@/common/AppletContainer'
import { Geogebra } from '@/common/Geogebra'
import { ClientListener, GeogebraAppApi } from '@/common/Geogebra/Geogebra.types'
import { TextHeader } from '@/common/Header'
import { AnalyticsContext, AppletInteractionCallback } from '@/contexts/analytics'
import { useSFX } from '@/hooks/useSFX'

import trynewbutton from './assets/Reset.svg'
import startbuttonpage1 from './assets/startP1.svg'
import verfiybutton from './assets/verify.svg'

const GeogebraContainer = styled(Geogebra)<{ top: number; left: number }>`
  position: absolute;
  left: 55%;
  top: 45%;
  transform: translate(-50%, -50%);
  scale: 1.1;
`

const StartButtonPage1 = styled.img`
  position: absolute;
  left: 320px;
  top: 735px;
  cursor: pointer;
  transition: 0.2s;
  z-index: 2;
`

const VerifyButton = styled.img`
  position: absolute;
  left: 320px;
  top: 735px;
  cursor: pointer;
  transition: 0.2s;
  z-index: 2;
`

const TryNewButton = styled.img`
  position: absolute;
  left: 280px;
  top: 735px;
  cursor: pointer;
  transition: 0.2s;
  z-index: 3;
`
const OnboardingAnimationContainer = styled(Player)<{ left: number; top: number }>`
  position: absolute;
  left: ${(a) => a.left}px;
  top: ${(a) => a.top}px;
  pointer-events: none;
  z-index: 2;
`
const TexWrappper = styled.div`
  position: absolute;
  align-items: center;
  width: 400px;
  height: 40px;
`
const AppletText = styled.h2`
  position: absolute;
  color: var(--monotone-100, #444);
  font-family: Nunito;
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: 28px;
  left: 90%;
  top: 600px;
  transform: translateX(-50%);
  white-space: nowrap;
  display: flex;
  justify-content: center;
  text-align: center;
`
const RadioDiv = styled.div<{ left: number; checked: boolean }>`
  box-sizing: border-box;
  padding: 2px;
  position: absolute;
  width: 121px;
  height: 51px;
  left: ${(props) => props.left}px;
  top: 670px;
  background: #ffffff;
  border: 1px solid ${(props) => (props.checked ? '#212121' : '#C7C7C7')};
  ${(props) =>
    props.checked
      ? ''
      : 'box-shadow: 0px 5px 0px #C7C7C7, inset 0px 2px 0px rgba(255, 255, 255, 0.2);'}
  border-radius: 12px;
  cursor: pointer;
`
const RadioInnerDiv = styled.div<{ checked: boolean }>`
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
  width: 100%;
  height: 100%;
  background: ${(props) => (props.checked ? '#C7C7C7' : '#ffffff')};
  border-radius: 8px;
  pointer-events: none;
`
const RadioLabel = styled.label`
  width: 45px;
  height: 28px;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;
  text-align: center;
  color: #444444;
  pointer-events: none;
`
const RadioButton = styled.div<{ checked: boolean }>`
  width: 22px;
  height: 22px;
  border: 2px solid #212121;
  border-radius: 50%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  span {
    width: 12px;
    height: 12px;
    background-color: #212121;
    border-radius: 50%;
    display: ${(props) => (props.checked ? 'block' : 'none')};
    pointer-events: none;
  }
`
const ColorText = styled.span<{ color: string }>`
  display: inline-block;
  color: ${(props) => props.color};
  margin: 0;
  pointer-events: none;
`
const NextButton = styled.button<{ active: boolean }>`
  position: absolute;
  left: 320px;
  top: 735px;
  width: 102px;
  height: 60px;
  background-color: ${(props) => (props.active ? '#1A1A1A' : '#D1D1D1')};
  color: #ffffff;
  font-size: 16px;
  font-weight: bold;
  border: ${(props) => (props.active ? 'none' : '1px solid transparent')};
  border-radius: 10px;
  text-align: center;
  font-family: Nunito;
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  cursor: ${(props) => (props.active ? 'pointer' : 'default')};
  pointer-events: ${(props) => (props.active ? 'auto' : 'none')};
  z-index: 1;
`

const NextButton1 = styled.button<{ active: boolean }>`
  position: absolute;
  left: 320px;
  top: 735px;
  width: 102px;
  height: 60px;
  background-color: ${(props) => (props.active ? '#1A1A1A' : '#D1D1D1')};
  color: #ffffff;
  font-size: 16px;
  font-weight: bold;
  border: ${(props) => (props.active ? 'none' : '1px solid transparent')};
  border-radius: 10px;
  text-align: center;
  font-family: Nunito;
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  cursor: ${(props) => (props.active ? 'pointer' : 'default')};
  pointer-events: ${(props) => (props.active ? 'auto' : 'none')};
  z-index: 10;
`

export const AppletG07GMC02S1GB06: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const [ggbLoaded, setGGBLoaded] = useState(false)
  const ggb = useRef<GeogebraAppApi | null>(null)
  const playMouseCLick = useSFX('mouseClick')
  const playMouseIn = useSFX('mouseIn')
  const playMouseOut = useSFX('mouseOut')
  const [currentFrame, setCurrentFrame] = useState(0)
  const [showOnboarding1, setShowOnboarding1] = useState(true)
  const [showOnboarding2, setShowOnboarding2] = useState(false)
  const [showOnboarding3, setShowOnboarding3] = useState(false)
  const [showOnboarding4, setShowOnboarding4] = useState(false)

  const [showNextPage1, setShowNextPage1] = useState(true)
  const [showVerifyButton, setshowVerifyButton] = useState(false)
  const [showTryNewButton, setShowTryNewButton] = useState(false)
  const [isNextButtonActive, setNextButtonActive] = useState(false)
  const [isNextButtonActive1, setNextButtonActive1] = useState(false)
  const [isNextButtonActive2, setNextButtonActive2] = useState(false)
  const [isNextButtonActive3, setNextButtonActive3] = useState(false)
  const [isNextButtonActive7, setNextButtonActive7] = useState(false)
  const [isNextButtonActive5, setNextButtonActive5] = useState(false)
  // const [isNextButtonActive6, setNextButtonActive6] = useState(false)

  const [isNextButtonX1Active, setNextButtonX1Active] = useState(false)
  const [isNextButtonX2Active, setNextButtonX2Active] = useState(false)
  const [isNextButtonX3Active, setNextButtonX3Active] = useState(false)

  const [option1, setOption1] = useState(false)
  const [option2, setOption2] = useState(false)
  const [option3, setOption3] = useState(false)

  const [option1PhaseII, setOption1PhaseII] = useState(false)
  const [option2PhaseII, setOption2PhaseII] = useState(false)
  const [option3PhaseII, setOption3PhaseII] = useState(false)

  const onInteraction = useContext(AnalyticsContext)

  const [showRadioButton, setShowRadioButton] = useState(false)

  const [showRadioButtonSet1, setShowRadioButtonSet1] = useState(false)
  const [showRadioButtonSet2, setShowRadioButtonSet2] = useState(false)
  const [showRadioButtonSet3, setShowRadioButtonSet3] = useState(false)

  const [key, setKey] = useState('0')

  const texts = [
    '', //0
    '                            Connect the dots to draw the base.', //1
    '                          Now, let’s proceed to the next step.', //2
    '          Choose any angle to be drawn at one end of the base.', //3
    '                               Measure and mark the angle 30°.', //4
    '                               Measure and mark the angle 60°.', //5
    '                               Measure and mark the angle 90°.', //6
    '                                          Join the two points.', //7
    '                          Now, let’s proceed to the next step.', //8
    '    Choose any angle to be drawn at the other end of the base.', //9
    '                                          Join the two points.', //10
    'The point of intersection is the third vertex of the triangle.', //11
    '               Observe that the measure of third angle is 30°.', //12
    '               Observe that the measure of third angle is 60°.', //13
    '               Observe that the measure of third angle is 90°.', //14
    '                            The measure of third angle is 30°.', //15
    '                            The measure of third angle is 60°.', //16
    '                            The measure of third angle is 90°.', //17
    '               Great! You have constructed the given triangle.', //18
  ]

  const onGGBLoaded = useCallback((api: GeogebraAppApi | null) => {
    ggb.current = api
    setGGBLoaded(api != null)
  }, [])

  const handleNextButtonActivation = (isActive: boolean) => {
    setNextButtonActive(isActive)
  }

  useEffect(() => {
    const api = ggb.current
    if (api != null && ggbLoaded) {
      const onGgb1Client: ClientListener = (e) => {
        const targets = [
          'M',
          'S',
          'C_1',
          'S11',
          'L_2',
          'K_3',
          'F_2',
          'L_3',
          'R_2',
          'M_3',
          'B_2',
          'P_3',
          'Q_1',
          'Z_2',
          'J_3',
          'G_3',
          // 'I_3',
        ]

        const handleMouseDown = (target: string) => {
          playMouseIn()

          if (target === 'M') {
            setShowOnboarding2(false)
          } else if (target === 'S') {
            setShowOnboarding4(false)
          }
        }

        const handleDragEnd = (target: string) => {
          playMouseOut()
        }

        if (e.type === 'mouseDown') {
          const target = e.hits[0]
          if (targets.includes(target)) {
            handleMouseDown(target)
          }
        } else if (e.type === 'dragEnd') {
          const target = e.target
          if (targets.includes(target)) {
            handleDragEnd(target)
          }
        }
      }

      api.registerClientListener(onGgb1Client)

      let pageValue = 0
      let valueM = 0

      let valueX = 0
      let valueY = 0
      let valueZ = 0

      let newValue60 = false
      let newValue30 = false
      let newValue90 = false

      api.registerObjectUpdateListener('steps', () => {
        pageValue = api.getValue('steps')
        if (pageValue === 4) {
          if (option1 === true) {
            setCurrentFrame(4)
          } else if (option2 === true) {
            setCurrentFrame(5)
          } else if (option3 === true) {
            setCurrentFrame(6)
            setNextButtonActive(true)
          }
        }
      })

      api.registerObjectUpdateListener('h', () => {
        valueM = api.getValue('h')
        if (valueM === 4) {
          setNextButtonActive(true)
        } else {
          setNextButtonActive(false)
        }
      })

      if (option2) {
        api.registerObjectUpdateListener('b', () => {
          newValue60 = Boolean(api.getValue('b'))
          if (newValue60 === true) {
            setNextButtonActive(true)
          } else {
            setNextButtonActive(false)
          }
        })
        api.registerObjectUpdateListener('h_1', () => {
          valueY = api.getValue('h_1')
          if (valueY >= 8.52) {
            setNextButtonActive(true)
          } else {
            setNextButtonActive(false)
          }
        })
      } else if (option1) {
        api.registerObjectUpdateListener('l', () => {
          newValue30 = Boolean(api.getValue('l'))
          if (newValue30 === true) {
            setNextButtonActive(true)
          } else {
            setNextButtonActive(false)
          }
        })
        api.registerObjectUpdateListener('n', () => {
          valueX = api.getValue('n')
          if (valueX >= 8.48) {
            setNextButtonActive(true)
          } else {
            setNextButtonActive(false)
          }
        })
      } else if (option3) {
        api.registerObjectUpdateListener('a', () => {
          newValue90 = Boolean(api.getValue('a'))
          if (newValue90 === true) {
            setNextButtonActive(true)
          } else {
            setNextButtonActive(false)
          }
        })
        api.registerObjectUpdateListener('l_1', () => {
          valueZ = api.getValue('l_1')
          if (valueZ >= 8.44) {
            setNextButtonActive(true)
          } else {
            setNextButtonActive(false)
          }
        })

        return () => {
          // ggb.current?.unregisterClientListener(onGgb1Client)
          ggb.current?.unregisterObjectUpdateListener('steps')
          ggb.current?.unregisterObjectUpdateListener('h')
          ggb.current?.unregisterObjectUpdateListener('l')
          ggb.current?.unregisterObjectUpdateListener('b')
          ggb.current?.unregisterObjectUpdateListener('a')
          ggb.current?.unregisterObjectUpdateListener('v')
          ggb.current?.unregisterObjectUpdateListener('u')
        }
      }
    }
  }, [ggbLoaded, option1, option2, option3, playMouseCLick, playMouseIn, playMouseOut]) // phase I Options

  //Option3PhaseII

  useEffect(() => {
    const api = ggb.current
    let valueZ1 = false
    if (api != null && ggbLoaded) {
      if (option3PhaseII) {
        api.registerObjectUpdateListener('w', () => {
          valueZ1 = Boolean(api.getValue('w'))
          if (valueZ1 === true) {
            setNextButtonActive(true)
          } else {
            setNextButtonActive(false)
          }
        })
      }
    }
    return () => {
      ggb.current?.unregisterObjectUpdateListener('w')
    }
  }, [ggbLoaded, option3PhaseII]) // phase II Option 3

  useEffect(() => {
    const api = ggb.current
    let valueZ1 = false
    if (api != null && ggbLoaded) {
      if (option3PhaseII) {
        api.registerObjectUpdateListener('w_3', () => {
          valueZ1 = Boolean(api.getValue('w_3'))
          if (valueZ1 === true) {
            setNextButtonActive3(false)
          } else {
            setNextButtonActive3(true)
          }
        })
      }
    }
    return () => {
      ggb.current?.unregisterObjectUpdateListener('w_3')
    }
  }, [ggbLoaded, option3PhaseII]) // phase II Option 3

  //Option3PhaseII

  useEffect(() => {
    const api = ggb.current
    let valueZ2 = false
    if (api != null && ggbLoaded) {
      if (option3PhaseII) {
        api.registerObjectUpdateListener('o_4', () => {
          valueZ2 = Boolean(api.getValue('o_4'))
          if (valueZ2 === true) {
            setNextButtonActive3(false)
          } else {
            setNextButtonActive3(true)
          }
        })
      }
    }
    return () => {
      ggb.current?.unregisterObjectUpdateListener('oo')
    }
  }, [ggbLoaded, option3PhaseII]) // phase II Option 3

  //Option3PhaseII 90° Angle Forming

  useEffect(() => {
    const api = ggb.current
    let valueZ3 = false
    if (api != null && ggbLoaded) {
      if (option3PhaseII) {
        api.registerObjectUpdateListener('o_1', () => {
          valueZ3 = Boolean(api.getValue('o_1'))
          if (valueZ3 === true) {
            setNextButtonActive5(true)
          } else {
            setNextButtonActive5(false)
          }
        })
      }
    }
    return () => {
      ggb.current?.unregisterObjectUpdateListener('o_1')
    }
  }, [ggbLoaded, option3PhaseII]) // phase II Option 3

  //Option2PhaseII 60° Angle Forming

  useEffect(() => {
    const api = ggb.current
    let valueY1 = false
    if (api != null && ggbLoaded) {
      if (option1 == true) {
        if (option2PhaseII) {
          api.registerObjectUpdateListener('v_1', () => {
            valueY1 = Boolean(api.getValue('v_1'))
            if (valueY1 === true) {
              setNextButtonActive7(true)
            } else {
              setNextButtonActive7(false)
            }
          })
        }
      }
    }
    return () => {
      ggb.current?.unregisterObjectUpdateListener('v_1')
    }
  }, [ggbLoaded, isNextButtonActive, option1, option2PhaseII]) // phase II Option 2
  //Option2PhaseII

  useEffect(() => {
    const api = ggb.current
    let valueY2 = false
    if (api != null && ggbLoaded) {
      if (option2PhaseII) {
        api.registerObjectUpdateListener('o_3', () => {
          valueY2 = Boolean(api.getValue('o_3'))
          if (valueY2 === true) {
            setNextButtonActive(true)
          } else {
            setNextButtonActive(false)
          }
        })
      }
    }
    return () => {
      ggb.current?.unregisterObjectUpdateListener('o_3')
    }
  }, [ggbLoaded, option2PhaseII]) // phase II Option 2

  //Option2PhaseII

  useEffect(() => {
    const api = ggb.current
    let valueY3 = false
    if (api != null && ggbLoaded) {
      if (option2PhaseII) {
        api.registerObjectUpdateListener('v_3', () => {
          valueY3 = Boolean(api.getValue('v_3'))
          if (valueY3 === true) {
            setNextButtonActive1(false)
          } else {
            setNextButtonActive1(true)
          }
        })
      }
    }
    return () => {
      ggb.current?.unregisterObjectUpdateListener('v_3')
    }
  }, [ggbLoaded, option2PhaseII]) // phase II Option 2

  //Option2PhaseII

  useEffect(() => {
    const api = ggb.current
    let valueY4 = false
    if (api != null && ggbLoaded) {
      if (option2PhaseII) {
        api.registerObjectUpdateListener('v_4', () => {
          valueY4 = Boolean(api.getValue('v_4'))
          if (valueY4 === true) {
            setNextButtonActive1(false)
          } else {
            setNextButtonActive1(true)
          }
        })
      }
    }
    return () => {
      ggb.current?.unregisterObjectUpdateListener('v_4')
    }
  }, [ggbLoaded, option2PhaseII]) // phase II Option 2

  //Option1PhaseII

  useEffect(() => {
    const api = ggb.current
    let valueX1 = false
    if (api != null && ggbLoaded) {
      if (option1PhaseII) {
        api.registerObjectUpdateListener('v_2', () => {
          valueX1 = Boolean(api.getValue('v_2'))
          if (valueX1 === true) {
            handleNextButtonActivation(true)
          } else {
            handleNextButtonActivation(false)
          }
        })
      }
    }
    return () => {
      ggb.current?.unregisterObjectUpdateListener('v_2')
    }
  }, [ggbLoaded, option1PhaseII]) // phase II Option 1

  //Option1PhaseII

  useEffect(() => {
    const api = ggb.current
    let valueX2 = false
    if (api != null && ggbLoaded) {
      if (option1PhaseII) {
        api.registerObjectUpdateListener('a_4', () => {
          valueX2 = Boolean(api.getValue('a_4'))
          if (valueX2 === true) {
            setNextButtonActive2(false)
          } else {
            setNextButtonActive2(true)
          }
        })
      }
    }
    return () => {
      ggb.current?.unregisterObjectUpdateListener('a_4')
    }
  }, [ggbLoaded, option1PhaseII]) // phase II Option 1

  //Option1PhaseII

  useEffect(() => {
    const api = ggb.current
    let valueX3 = false
    if (api != null && ggbLoaded) {
      if (option1PhaseII) {
        api.registerObjectUpdateListener('u_4', () => {
          valueX3 = Boolean(api.getValue('u_4'))
          if (valueX3 === true) {
            setNextButtonActive2(false)
          } else {
            setNextButtonActive2(true)
          }
        })
      }
    }
    return () => {
      ggb.current?.unregisterObjectUpdateListener('u_4')
    }
  }, [ggbLoaded, option1PhaseII]) // phase II Option 1

  // X Coordinate update last step when at first 30 is selected
  // 1.  60 degrees

  // useEffect(() => {
  //   const api = ggb.current
  //   let Xcoord1 = 0
  //   let YCoord1 = 0
  //   if (api != null && ggbLoaded) {
  //     if (option2PhaseII) {
  //       api.registerObjectUpdateListener('K_3', () => {
  //         Xcoord1 = api?.getXcoord('K_3')
  //         YCoord1 = api?.getYcoord('K_3')
  //         if (Xcoord1 === 8.249999999999998 && YCoord1 === 6.834936490538901) {
  //           setNextButtonX1Active(true)
  //         } else {
  //           setNextButtonX1Active(false)
  //         }
  //       })
  //     }
  //   }
  // }, [ggbLoaded, option2PhaseII])

  // 2.  90 degrees

  // useEffect(() => {
  //   const api = ggb.current
  //   let Xcoord2 = 0
  //   let Ycoord2 = 0
  //   if (api != null && ggbLoaded) {
  //     if (option3PhaseII) {
  //       api.registerObjectUpdateListener('L_3', () => {
  //         Xcoord2 = api?.getXcoord('L_3')
  //         Ycoord2 = api?.getYcoord('L_3')

  //         if (Xcoord2 === 6.999999999999999 && Ycoord2 === 6.809401076758501) {
  //           setNextButtonX2Active(true)
  //         } else {
  //           setNextButtonX2Active(false)
  //         }
  //       })
  //     }
  //   }
  // }, [ggbLoaded, option3PhaseII])

  // X Coordinate update last step when at first 60 is selected
  // 1.  30 degrees

  // useEffect(() => {
  //   const api = ggb.current
  //   let Xcoord3 = 0
  //   let Ycoord3 = 0
  //   if (api != null && ggbLoaded) {
  //     if (option1PhaseII) {
  //       api.registerObjectUpdateListener('M_3', () => {
  //         Xcoord3 = api?.getXcoord('M_3')
  //         Ycoord3 = api?.getYcoord('M_3')
  //         if (Xcoord3 === 7.897114317029972 && Ycoord3 === 8.482050807568875) {
  //           setNextButtonX3Active(true)
  //         } else {
  //           setNextButtonX3Active(false)
  //         }
  //       })
  //     }
  //   }
  // }, [ggbLoaded, option1PhaseII])

  //2. 90 degrees

  // useEffect(() => {
  //   const api = ggb.current
  //   let Xcoord6 = 0
  //   let Ycoord6 = 0
  //   if (api != null && ggbLoaded) {
  //     if (option3PhaseII) {
  //       api.registerObjectUpdateListener('I_3', () => {
  //         Xcoord6 = api?.getXcoord('I_3')
  //         Ycoord6 = api?.getYcoord('I_3')
  //         if (Xcoord6 === 6.999999999999999 && Ycoord6 === 11.428203230275509) {
  //           setNextButtonX2Active(true)
  //         } else {
  //           setNextButtonX2Active(false)
  //         }
  //       })
  //     }
  //   }
  // }, [ggbLoaded, option3PhaseII])

  // X Coordinate update last step when at first 90 is selected
  // 1.  30

  // useEffect(() => {
  //   const api = ggb.current
  //   let Xcoord4 = 0
  //   let Ycoord4 = 0
  //   if (api != null && ggbLoaded) {
  //     if (option1PhaseII) {
  //       api.registerObjectUpdateListener('J_3', () => {
  //         Xcoord4 = api?.getXcoord('J_3')
  //         Ycoord4 = api?.getYcoord('J_3')
  //         if (Xcoord4 === 6.897114317029972 && Ycoord4 === 9.0594010767585) {
  //           setNextButtonX3Active(true)
  //         } else {
  //           setNextButtonX3Active(false)
  //         }
  //       })
  //     }
  //   }
  // }, [ggbLoaded, option1PhaseII])

  // 2. 60

  // useEffect(() => {
  //   const api = ggb.current
  //   let XCoord5 = 0
  //   let YCoord5 = 0
  //   if (api != null && ggbLoaded) {
  //     if (option2PhaseII) {
  //       api.registerObjectUpdateListener('P_3', () => {
  //         XCoord5 = api?.getXcoord('P_3')
  //         YCoord5 = api?.getYcoord('P_3')

  //         if (XCoord5 === 5.2499999999999964 && YCoord5 === 12.031088913245531) {
  //           setNextButtonX1Active(true)
  //         } else {
  //           setNextButtonX1Active(false)
  //         }
  //       })
  //     }
  //   }
  // }, [ggbLoaded, option2PhaseII])

  const handleNextButtonClickPage1 = () => {
    playMouseCLick()
    setShowOnboarding1(false)
    if (ggb.current?.getValue('steps') === 0) {
      ggb.current?.evalCommand('RunClickScript(start1)')
      setShowNextPage1(false)
      setCurrentFrame(1)
      setShowOnboarding2(true)
    }
  }

  const handleTryNewButtonClick = () => {
    playMouseCLick()
    setKey(key + 1)
    setCurrentFrame(0)
    setShowTryNewButton(false)
    setShowNextPage1(true)
    setShowOnboarding1(true)
    setOption1(false)
    setOption2(false)
    setOption3(false)
    setOption1PhaseII(false)
    setOption2PhaseII(false)
    setOption3PhaseII(false)
  }

  // const handleNextButtonClickPage3 = () => {
  //   playMouseCLick()
  // }

  const handleNextButtonClickPage2 = () => {
    playMouseCLick()

    if (ggb.current?.getValue('steps') === 1) {
      ggb.current?.evalCommand('RunClickScript(nextblack1)')
      setCurrentFrame(2)
      setNextButtonActive(true)
    } else if (ggb.current?.getValue('steps') === 2) {
      ggb.current?.evalCommand('RunClickScript(nextblack1)')
      setNextButtonActive(false)
      setShowRadioButton(true)
      setShowOnboarding3(true)
      setNextButtonActive(option1 || option2 || option3)
      setCurrentFrame(3)
    } else if (ggb.current?.getValue('steps') === 3) {
      ggb.current?.evalCommand('RunClickScript(nextblack2)')
      setShowOnboarding4(true)
      setNextButtonActive(false)
      setShowRadioButton(false)
      if (option3) {
        setNextButtonActive(true)
        setShowOnboarding4(false)
      }
    } else if (ggb.current?.getValue('steps') === 4) {
      if (option1) {
        ggb.current?.evalCommand('RunClickScript(nextblack30)')
        setCurrentFrame(7)
        setNextButtonActive(false)
      } else if (option2) {
        ggb.current?.evalCommand('RunClickScript(nextblack60)')
        setCurrentFrame(7)
        setNextButtonActive(false)
      } else if (option3) {
        ggb.current?.evalCommand('RunClickScript(nextblack90)')
        setCurrentFrame(7)
        setNextButtonActive(false)
      }
    } else if (ggb.current?.getValue('steps') === 5) {
      if (option1) {
        ggb.current?.evalCommand('RunClickScript(nextblack301)')
        setCurrentFrame(8)
        setNextButtonActive(true)
      } else if (option2) {
        ggb.current?.evalCommand('RunClickScript(unext)')
        setCurrentFrame(8)
        setNextButtonActive(true)
      } else if (option3) {
        ggb.current?.evalCommand('RunClickScript(next902)')
        setCurrentFrame(8)
        setNextButtonActive(true)
      }
    } else if (ggb.current?.getValue('steps') === 6) {
      if (option1) {
        ggb.current?.evalCommand('RunClickScript(nextblack301)')
        setNextButtonActive(true)
        setShowRadioButtonSet1(true)
        setNextButtonActive(option2PhaseII || option3PhaseII)
      } else if (option2) {
        ggb.current?.evalCommand('RunClickScript(unext)')
        setNextButtonActive(true)
        setShowRadioButtonSet2(true)
        setNextButtonActive(option1PhaseII || option3PhaseII)
      } else if (option3) {
        ggb.current?.evalCommand('RunClickScript(next902)')
        setNextButtonActive(true)
        setShowRadioButtonSet3(true)
        setNextButtonActive(option1PhaseII || option2PhaseII)
      }
      setCurrentFrame(9)
    } else if (ggb.current?.getValue('steps') === 7) {
      if (option1PhaseII) {
        ggb.current?.evalCommand('RunClickScript(next60301)')
        setShowRadioButtonSet2(false)
        setShowRadioButtonSet3(false)
        // setNextButtonActive(false)
        setCurrentFrame(4)
      } else if (option2PhaseII) {
        ggb.current?.evalCommand('RunClickScript(next3060)')
        setShowRadioButtonSet1(false)
        setShowRadioButtonSet3(false)
        setNextButtonActive(false)
        setCurrentFrame(5)
      } else if (option3PhaseII) {
        ggb.current?.evalCommand('RunClickScript(next90301)')
        setShowRadioButtonSet1(false)
        setShowRadioButtonSet2(false)
        // setNextButtonActive(false)
        setCurrentFrame(6)
      }
      if (option3PhaseII) {
        setNextButtonActive5(true)
      }
    }
    if (ggb.current?.getValue('steps') === 7 && ggb.current?.getValue('show') === 3) {
      setCurrentFrame(10)
      setNextButtonActive(false)
      setNextButtonActive1(false)
      setNextButtonActive3(false)
    } else if (ggb.current?.getValue('show') === 4) {
      setNextButtonActive(true)
      setCurrentFrame(11)
    } else if (ggb.current?.getValue('show') === 5) {
      setNextButtonActive(true)
      setCurrentFrame(8)
    } else if (ggb.current?.getValue('show') === 6) {
      setNextButtonActive(true)
      setshowVerifyButton(true)
      if (option1 && option2PhaseII) {
        setCurrentFrame(14)
      } else if (option1 && option3PhaseII) {
        setCurrentFrame(13)
      } else if (option2 && option1PhaseII) {
        setCurrentFrame(14)
      } else if (option2 && option3PhaseII) {
        setCurrentFrame(12)
        ggb.current?.evalCommand('StartAnimation(op6090,true)')
      } else if (option3 && option1PhaseII) {
        setCurrentFrame(13)
      } else if (option3 && option2PhaseII) {
        setCurrentFrame(12)
        ggb.current?.evalCommand('StartAnimation(op9060,true)')
      }
    } else if (ggb.current?.getValue('show') === 7) {
      setshowVerifyButton(false)
      setNextButtonActive(true)
      if (option1 && option2PhaseII) {
        setCurrentFrame(17)
      } else if (option1 && option3PhaseII) {
        setCurrentFrame(16)
      } else if (option2 && option1PhaseII) {
        setCurrentFrame(17)
      } else if (option2 && option3PhaseII) {
        setCurrentFrame(15)
      } else if (option3 && option1PhaseII) {
        setCurrentFrame(16)
      } else if (option3 && option2PhaseII) {
        setCurrentFrame(15)
      }
    } else if (ggb.current?.getValue('show') === 8) {
      ggb.current?.evalCommand('SetValue(op6090,0)')
      ggb.current?.evalCommand('SetValue(op9060,0)')
      setNextButtonActive(false)
      setShowTryNewButton(true)
      setCurrentFrame(18)
    }

    if (option2PhaseII && ggb.current?.getValue('show') === 2) {
      setNextButtonActive(false)
    }
  }

  const onClickHandle1 = (e: any) => {
    playMouseCLick()
    onInteraction('tap')
    let selectedOption = ''

    switch (e.target.id) {
      case '1':
        selectedOption = 'option1'
        if (ggb.current?.getValue('steps') === 3) {
          ggb.current?.evalCommand('RunClickScript(white30)')
          setShowOnboarding3(false)
        }

        break
      case '2':
        selectedOption = 'option2'
        if (ggb.current?.getValue('steps') === 3) {
          ggb.current?.evalCommand('RunClickScript(white60)')
          setShowOnboarding3(false)
        }

        break
      case '3':
        selectedOption = 'option3'
        if (ggb.current?.getValue('steps') === 3) {
          ggb.current?.evalCommand('RunClickScript(white90)')
          setShowOnboarding3(false)
        }

        break
    }

    if (selectedOption === 'option1') {
      setOption1((prevOption1) => {
        const newOption1 = !prevOption1
        setOption2(false)
        setOption3(false)
        setNextButtonActive(newOption1)

        return newOption1
      })
    } else if (selectedOption === 'option2') {
      setOption2((prevOption2) => {
        const newOption2 = !prevOption2
        setOption1(false)
        setOption3(false)
        setNextButtonActive(newOption2)
        return newOption2
      })
    } else if (selectedOption === 'option3') {
      setOption3((prevOption3) => {
        const newOption3 = !prevOption3
        setOption1(false)
        setOption2(false)
        setNextButtonActive(newOption3)
        return newOption3
      })
    }
  }

  const onClickHandle2 = (e: any) => {
    playMouseCLick()
    onInteraction('tap')
    let selectedOptionPhaseII = ''

    switch (e.target.id) {
      case '1':
        selectedOptionPhaseII = 'option1PhaseII'
        if (ggb.current?.getValue('steps') === 7) {
          ggb.current?.evalCommand('RunClickScript(pic1)')
        }

        break
      case '2':
        selectedOptionPhaseII = 'option2PhaseII'
        if (ggb.current?.getValue('steps') === 7) {
          ggb.current?.evalCommand('RunClickScript(pic2)')
        }

        break
      case '3':
        selectedOptionPhaseII = 'option3PhaseII'
        if (ggb.current?.getValue('steps') === 7) {
          ggb.current?.evalCommand('RunClickScript(pic3)')
        }

        break
    }

    if (selectedOptionPhaseII === 'option1PhaseII') {
      setOption1PhaseII((prevOption1PhaseII) => {
        const newOption1PhaseII = !prevOption1PhaseII
        setOption2PhaseII(false)
        setOption3PhaseII(false)
        setNextButtonActive(newOption1PhaseII)

        return newOption1PhaseII
      })
    } else if (selectedOptionPhaseII === 'option2PhaseII') {
      setOption2PhaseII((prevOption2PhaseII) => {
        const newOption2PhaseII = !prevOption2PhaseII
        setOption1PhaseII(false)
        setOption3PhaseII(false)
        setNextButtonActive(newOption2PhaseII)
        return newOption2PhaseII
      })
    } else if (selectedOptionPhaseII === 'option3PhaseII') {
      setOption3PhaseII((prevOption3PhaseII) => {
        const newOption3PhaseII = !prevOption3PhaseII
        setOption1PhaseII(false)
        setOption2PhaseII(false)
        setNextButtonActive(newOption3PhaseII)
        return newOption3PhaseII
      })
    }
  }

  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#F6F6F6',
        id: 'g07-gmc02-s1-gb06',
        onEvent,
        className,
      }}
    >
      <TextHeader
        text="Construct a triangle with angle measurements of 90°, 60°, and 30°."
        backgroundColor="#F6F6F6"
        buttonColor="#1A1A1A"
      />
      <GeogebraContainer
        key={key}
        materialId="m3kbm3yt"
        top={70}
        left={0}
        onApiReady={onGGBLoaded}
      />

      {showNextPage1 && ggbLoaded && (
        <>
          <StartButtonPage1
            src={startbuttonpage1}
            onClick={handleNextButtonClickPage1}
          ></StartButtonPage1>
        </>
      )}
      {showVerifyButton && ggbLoaded && (
        <>
          <StartButtonPage1
            src={verfiybutton}
            onClick={handleNextButtonClickPage2}
          ></StartButtonPage1>
        </>
      )}

      {showTryNewButton && ggbLoaded && (
        <>
          <TryNewButton src={trynewbutton} onClick={handleTryNewButtonClick}></TryNewButton>
        </>
      )}

      {ggbLoaded && (
        <TexWrappper>
          <AppletText>{texts[currentFrame]}</AppletText>
        </TexWrappper>
      )}
      {ggbLoaded && (
        <NextButton
          active={isNextButtonActive}
          onClick={handleNextButtonClickPage2}
          disabled={!isNextButtonActive}
        >
          Next
        </NextButton>
      )}

      {ggbLoaded &&
        ggb.current?.getValue('show') === 2 &&
        option2PhaseII &&
        ggb.current?.getValue('v_1') === 1 && (
          <NextButton1
            active={isNextButtonActive7}
            onClick={handleNextButtonClickPage2}
            disabled={!isNextButtonActive7}
          >
            Next
          </NextButton1>
        )}

      {ggbLoaded &&
        ggb.current?.getValue('show') === 2 &&
        option3PhaseII &&
        ggb.current?.getValue('o_1') === 1 && (
          <NextButton1
            active={isNextButtonActive5}
            onClick={handleNextButtonClickPage2}
            disabled={!isNextButtonActive5}
          >
            Next
          </NextButton1>
        )}

      {ggbLoaded && ggb.current?.getValue('show') === 3 && option2PhaseII && (
        <NextButton1
          active={isNextButtonActive1}
          onClick={handleNextButtonClickPage2}
          disabled={!isNextButtonActive1}
        >
          Next
        </NextButton1>
      )}

      {ggbLoaded && ggb.current?.getValue('show') === 3 && option3PhaseII && (
        <NextButton1
          active={isNextButtonActive3}
          onClick={handleNextButtonClickPage2}
          disabled={!isNextButtonActive3}
        >
          Next
        </NextButton1>
      )}

      {ggbLoaded && ggb.current?.getValue('show') === 3 && option1PhaseII && (
        <NextButton1
          active={isNextButtonActive2}
          onClick={handleNextButtonClickPage2}
          disabled={!isNextButtonActive2}
        >
          Next
        </NextButton1>
      )}

      {/* {ggbLoaded && ggb.current?.getValue('show') === 6 && option2PhaseII && (
        <NextButton1
          active={isNextButtonX1Active}
          onClick={handleNextButtonClickPage2}
          disabled={!isNextButtonX1Active}
        >
          Next
        </NextButton1>
      )}

      {ggbLoaded && ggb.current?.getValue('show') === 6 && option3PhaseII && (
        <NextButton1
          active={isNextButtonX2Active}
          onClick={handleNextButtonClickPage2}
          disabled={!isNextButtonX2Active}
        >
          Next
        </NextButton1>
      )}

      {ggbLoaded && ggb.current?.getValue('show') === 6 && option1PhaseII && (
        <NextButton1
          active={isNextButtonX3Active}
          onClick={handleNextButtonClickPage2}
          disabled={!isNextButtonX3Active}
        >
          Next
        </NextButton1>
      )} */}

      {showOnboarding1 && ggbLoaded && (
        <>
          <OnboardingAnimationContainer left={300} top={700} src={click} loop autoplay />
        </>
      )}
      {/* {showOnboarding2 && (
        <>
          <OnboardingAnimationContainer left={130} top={350} src={slider} loop autoplay />
        </>
      )} */}
      {showOnboarding3 && (
        <>
          <OnboardingAnimationContainer left={230} top={640} src={click} loop autoplay />
        </>
      )}
      {showOnboarding4 && (
        <>
          <OnboardingAnimationContainer left={-10} top={120} src={rotateBothSides} loop autoplay />
        </>
      )}
      {showRadioButton && (
        <>
          <RadioDiv left={135} checked={option1} id={'1'} onClick={onClickHandle1}>
            <RadioInnerDiv checked={option1}>
              <RadioButton checked={option1}>
                <span></span>
              </RadioButton>
              <RadioLabel>
                <ColorText color={'#212121'}>30°</ColorText>
              </RadioLabel>
            </RadioInnerDiv>
          </RadioDiv>
          <RadioDiv left={285} checked={option2} id={'2'} onClick={onClickHandle1}>
            <RadioInnerDiv checked={option2}>
              <RadioButton checked={option2}>
                <span></span>
              </RadioButton>
              <RadioLabel>
                <ColorText color={'#212121'}>60°</ColorText>
              </RadioLabel>
            </RadioInnerDiv>
          </RadioDiv>
          <RadioDiv left={435} checked={option3} id={'3'} onClick={onClickHandle1}>
            <RadioInnerDiv checked={option3}>
              <RadioButton checked={option3}>
                <span></span>
              </RadioButton>
              <RadioLabel>
                <ColorText color={'#212121'}>90°</ColorText>
              </RadioLabel>
            </RadioInnerDiv>
          </RadioDiv>
        </>
      )}

      {showRadioButtonSet1 && (
        <>
          <RadioDiv left={235} checked={option2PhaseII} id={'2'} onClick={onClickHandle2}>
            <RadioInnerDiv checked={option2PhaseII}>
              <RadioButton checked={option2PhaseII}>
                <span></span>
              </RadioButton>
              <RadioLabel>
                <ColorText color={'#212121'}>60°</ColorText>
              </RadioLabel>
            </RadioInnerDiv>
          </RadioDiv>
          <RadioDiv left={385} checked={option3PhaseII} id={'3'} onClick={onClickHandle2}>
            <RadioInnerDiv checked={option3PhaseII}>
              <RadioButton checked={option3PhaseII}>
                <span></span>
              </RadioButton>
              <RadioLabel>
                <ColorText color={'#212121'}>90°</ColorText>
              </RadioLabel>
            </RadioInnerDiv>
          </RadioDiv>
        </>
      )}

      {showRadioButtonSet2 && (
        <>
          <RadioDiv left={235} checked={option1PhaseII} id={'1'} onClick={onClickHandle2}>
            <RadioInnerDiv checked={option1PhaseII}>
              <RadioButton checked={option1PhaseII}>
                <span></span>
              </RadioButton>
              <RadioLabel>
                <ColorText color={'#212121'}>30°</ColorText>
              </RadioLabel>
            </RadioInnerDiv>
          </RadioDiv>
          <RadioDiv left={385} checked={option3PhaseII} id={'3'} onClick={onClickHandle2}>
            <RadioInnerDiv checked={option3PhaseII}>
              <RadioButton checked={option3PhaseII}>
                <span></span>
              </RadioButton>
              <RadioLabel>
                <ColorText color={'#212121'}>90°</ColorText>
              </RadioLabel>
            </RadioInnerDiv>
          </RadioDiv>
        </>
      )}

      {showRadioButtonSet3 && (
        <>
          <RadioDiv left={235} checked={option1PhaseII} id={'1'} onClick={onClickHandle2}>
            <RadioInnerDiv checked={option1PhaseII}>
              <RadioButton checked={option1PhaseII}>
                <span></span>
              </RadioButton>
              <RadioLabel>
                <ColorText color={'#212121'}>30°</ColorText>
              </RadioLabel>
            </RadioInnerDiv>
          </RadioDiv>
          <RadioDiv left={385} checked={option2PhaseII} id={'2'} onClick={onClickHandle2}>
            <RadioInnerDiv checked={option2PhaseII}>
              <RadioButton checked={option2PhaseII}>
                <span></span>
              </RadioButton>
              <RadioLabel>
                <ColorText color={'#212121'}>60°</ColorText>
              </RadioLabel>
            </RadioInnerDiv>
          </RadioDiv>
        </>
      )}
    </AppletContainer>
  )
}

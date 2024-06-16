import { Player } from '@lottiefiles/react-lottie-player'
import { FC, useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { apportion } from '@/atoms/Tree/helpers/position'
import { AppletContainer } from '@/common/AppletContainer'
import { Geogebra } from '@/common/Geogebra'
import { GeogebraAppApi } from '@/common/Geogebra/Geogebra.types'
import { TextHeader } from '@/common/Header'
import { AppletInteractionCallback } from '@/contexts/analytics'
import { useSFX } from '@/hooks/useSFX'
import { useTimeout } from '@/hooks/useTimeout'

import ClickAnimation from '../../common/handAnimations/click.json'
import patch from './assets/p1.jpg'
import tryNewSymb from './assets/tryNewSymb.svg'

const GeogebraContainer = styled(Geogebra)`
  position: absolute;
  width: 650px;
  height: 650px;
  top: 100px;
  left: 40px;
  z-index: -1;
`
interface BottomCoordContainerProps {
  prg: number // Change the type of prg to match its actual type
}

interface BottomTextProps {
  prg: number // Change the type of prg to match its actual type
}

const BottomCoordContainer = styled.label<BottomCoordContainerProps>`
  position: absolute;
  top: 630px;
  left: ${(props) =>
    props.prg === 2 || props.prg === 6 || props.prg === 10 || props.prg === 14
      ? '85%'
      : props.prg === 3 || props.prg === 7 || props.prg === 11 || props.prg === 15
      ? '112%'
      : '95%'};
  transform: translateX(-80%);
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 400;
  font-size: 24px;
  line-height: 32px;
  color: #444444;
  display: ${(props) => (props.prg >= 1 ? 'flex' : 'none')}; // Only display when prgValue is 1
  justify-content: center;
  flex-direction: row;
  gap: 15px;
  width: 720px;
  height: 100px;
  z-index: 2;
`

const AnswerInputBorder = styled.button<{ isWrong?: boolean; isCorrect?: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 8px 8px 8px 8px;
  gap: 20px;
  border-color: ${({ isWrong, isCorrect }) =>
    isWrong ? '#CC6666' : isCorrect ? '#6CA621' : '#1a1a1a'};
  background: ${({ isWrong, isCorrect }) =>
    isWrong ? '#FFF2F2' : isCorrect ? '#ECFFD9' : '#ffffff'};
  border-radius: 7px;
  width: 76px;
  height: 60px;

  &:disabled {
    pointer-events: none;
    background-color: #77777730;
    border: 3px solid #777777;
  }

  &:focus {
    outline: none;
  }
  z-index: 1;
`
const PatchContainer = styled.img`
  position: absolute;
  width: 55px;
  height: 55px;
  left: 40px;
  top: 716px;
  z-index: 1;
`
const AnswerInput = styled.input`
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 34px;
  color: #444444;
  background-color: transparent;
  border: 0;
  max-width: 80px;

  &:focus {
    outline: 0;
  }

  z-index: 2;
`

const OnboardingAnimationContainer = styled(Player)<{ left: number; top: number }>`
  position: absolute;
  left: ${(a) => a.left}px;
  top: ${(a) => a.top}px;
  pointer-events: none;
`

const CheckButton = styled.button<{ hasValue: boolean }>`
  /* Auto layout */
  position: absolute;
  top: 700px;
  left: 50%;
  translate: -50%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 16px 24px;
  gap: 8px;
  width: 116px;
  height: 60px;
  background: ${({ hasValue }) => (hasValue ? '#1A1A1A' : '#777777')};
  border-radius: 10px;

  flex: none;
  order: 0;
  flex-grow: 0;
  opacity: ${({ hasValue }) => (hasValue ? '1' : '0.2')};
  transition: background-color 0.3s, opacity 0.3s;

  color: #ffffff;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 600;
  font-size: 24px;
  line-height: 34px;
  cursor: ${({ hasValue }) => (hasValue ? 'pointer' : 'default')};

  &:hover {
    background-color: ${({ hasValue }) => (hasValue ? '#444444' : '#777777')};
  }

  &:focus {
    outline: none;
  }
  z-index: 2;
`
const BottomTexts = styled.div<BottomTextProps>`
  position: absolute;
  top: 650px;
  left: 50%;
  translate: -50%;
  width: 500px;
  height: 28px;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;
  display: ${(props) => (props.prg >= 1 ? 'flex' : 'none')}; // Only display when prgValue is 1
  align-items: center;
  text-align: right;
  color: #444444;
  z-index: 1;
`
const TryNewSymbol = styled.img`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
  padding: 9px 10px;

  position: absolute;
  width: 45px;
  height: 45px;
  left: 290px;
  top: 737px;
  border: none;
  cursor: pointer;
  transition: 0.2s;
  z-index: 1;
`

const TryNewButton = styled.button`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: flex-end;
  padding: 9px 18px;

  position: absolute;
  width: 160px;
  height: 60px;
  left: 280px;
  top: 730px;
  border: none;
  cursor: pointer;
  transition: 0.2s;

  background: #1a1a1a;
  border-radius: 10px;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 22px;
  line-height: 42px;
  text-align: center;
  color: #ffffff;

  z-index: 1;
`

export const AppletG06NSC03S1GB04: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const ggbApi = useRef<GeogebraAppApi | null>(null)
  const [prgValue, setPrgValue] = useState<number>(0)

  const [nextValue, setNextValue] = useState<number>(0)

  const [inputValue, setInputValue] = useState<number | undefined>(undefined)
  const [isAnswerWrong, setIsAnswerWrong] = useState(false)
  const [isAnswerRight, setIsAnswerRight] = useState(false)

  const [ggbLoaded, setGgbLoaded] = useState(false)
  const playMouseCLick = useSFX('mouseClick')

  const [valueA, setValueA] = useState('')
  const [valueB, setValueB] = useState<[string]>([''])
  const [valueC, setValueC] = useState<[string]>([''])
  const [valueD, setValueD] = useState<[string]>([''])
  const [valueE, setValueE] = useState<[string]>([''])
  const [valueF, setValueF] = useState<[string]>([''])
  const [valueG, setValueG] = useState<[string]>([''])
  const [valueH, setValueH] = useState<[string]>([''])
  const [valueI, setValueI] = useState<[string]>([''])

  const [showOnboarding1, setShowOnboarding1] = useState(true)

  const onGGBLoaded = useCallback((api: any) => {
    ggbApi.current = api
    setGgbLoaded(api != null)
  }, [])

  useEffect(() => {
    let checkValue = false

    const api = ggbApi.current

    if (api != null && ggbLoaded) {
      api.registerObjectUpdateListener('state', () => {
        checkValue = Boolean(api.getValue('state'))

        if (checkValue === true) {
          setIsAnswerWrong(false)
          setIsAnswerRight(true)
        } else {
          setIsAnswerWrong(true)
          setIsAnswerRight(false)
        }
      })

      return () => {
        api.unregisterObjectUpdateListener('check')
      }
    }
  }, [ggbLoaded])

  useEffect(() => {
    setIsAnswerRight(false)
    setIsAnswerWrong(false)
  }, [inputValue])

  useTimeout(
    () => {
      setInputValue(undefined)
    },
    isAnswerRight ? 1000 : null,
  )

  useEffect(() => {
    const api = ggbApi.current
    let PageValue = 0

    setPrgValue(PageValue)

    if (api != null && ggbLoaded) {
      api.registerObjectUpdateListener('prg', () => {
        PageValue = api.getValue('prg')
        setPrgValue(PageValue)
      })

      return () => {
        api.unregisterObjectUpdateListener('prg')
      }
    }
  }, [ggbLoaded])

  useEffect(() => {
    const api = ggbApi.current
    if (api != null && ggbLoaded) {
      setValueA(api.getValueString('text30'))
      setValueB([api.getValueString('text31')])
      setValueC([api.getValueString('text32')])
      setValueD([api.getValueString('text33')])
      setValueE([api.getValueString('text34')])
      setValueF([api.getValueString('text35')])
      setValueG([api.getValueString('text37')])
      setValueH([api.getValueString('text38')])
      setValueI([api.getValueString('text39')])

      api.registerObjectUpdateListener('text30', () => {
        setValueA(api.getValueString('text30'))
      })
      api.registerObjectUpdateListener('text31', () => {
        setValueB([api.getValueString('text31')])
      })
      api.registerObjectUpdateListener('text32', () => {
        setValueC([api.getValueString('text32')])
      })
      api.registerObjectUpdateListener('text33', () => {
        setValueD([api.getValueString('text33')])
      })
      api.registerObjectUpdateListener('text34', () => {
        setValueE([api.getValueString('text34')])
      })
      api.registerObjectUpdateListener('text35', () => {
        setValueF([api.getValueString('text35')])
      })
      api.registerObjectUpdateListener('text37', () => {
        setValueG([api.getValueString('text37')])
      })
      api.registerObjectUpdateListener('text38', () => {
        setValueH([api.getValueString('text38')])
      })
      api.registerObjectUpdateListener('text39', () => {
        setValueI([api.getValueString('text39')])
      })
      api.registerObjectUpdateListener('next', () => {
        playMouseCLick()
      })
      api.registerObjectUpdateListener('dropdown', () => {
        playMouseCLick()
        setShowOnboarding1(false)
      })
      api.registerObjectUpdateListener('ans10', () => {
        playMouseCLick()
      })
      api.registerObjectUpdateListener('ans100', () => {
        playMouseCLick()
      })
      api.registerObjectUpdateListener('ans1000', () => {
        playMouseCLick()
      })
      return () => {
        api.unregisterObjectUpdateListener('text30')
        api.unregisterObjectUpdateListener('text31')
        api.unregisterObjectUpdateListener('text32')
        api.unregisterObjectUpdateListener('text33')
        api.unregisterObjectUpdateListener('text34')
        api.unregisterObjectUpdateListener('text35')
        api.unregisterObjectUpdateListener('text37')
        api.unregisterObjectUpdateListener('text38')
        api.unregisterObjectUpdateListener('text39')
        api.unregisterObjectUpdateListener('next')
        api.unregisterObjectUpdateListener('dropdown')
        api.unregisterObjectUpdateListener('ans10')
        api.unregisterObjectUpdateListener('ans100')
        api.unregisterObjectUpdateListener('ans1000')
      }
    }
  }, [ggbLoaded, playMouseCLick])

  const getHeaderText = (prgValue: number) => {
    const valueAColor = '#AA5EE0'
    const valueBCColor = '#F0A000'

    const BackgroundColorLeft = '#FAF2FF'
    const BackgroundColorRight = '#FFF6DB'

    if (prgValue === 1 || prgValue === 5 || prgValue === 9 || prgValue === 13) {
      return (
        <div>
          How many{' '}
          <span style={{ color: valueAColor, backgroundColor: BackgroundColorLeft }}>{valueA}</span>{' '}
          are there in{' '}
          <span style={{ color: valueBCColor, backgroundColor: BackgroundColorRight }}>
            {valueB[0]}
          </span>{' '}
          ?
        </div>
      )
    } else if (prgValue === 2 || prgValue === 6 || prgValue === 10 || prgValue === 14) {
      return (
        <div>
          What is{' '}
          <span style={{ color: valueAColor, backgroundColor: BackgroundColorLeft }}>
            {valueC[0]}
          </span>{' '}
          times{' '}
          <span style={{ color: valueBCColor, backgroundColor: BackgroundColorRight }}>
            {valueD[0]}
          </span>
          ?
        </div>
      )
    } else if (prgValue === 3 || prgValue === 7 || prgValue === 11 || prgValue === 15) {
      return (
        <div>
          What is the difference between{' '}
          <span style={{ color: valueBCColor, backgroundColor: BackgroundColorRight }}>
            {valueE[0]}
          </span>{' '}
          and
          <span style={{ color: valueAColor, backgroundColor: BackgroundColorLeft }}>
            {valueF[0]}
          </span>
          ?
        </div>
      )
    } else if (prgValue === 16) {
      return (
        <div>
          {valueG[0]}&nbsp;gives&nbsp;
          <span style={{ color: valueAColor, backgroundColor: BackgroundColorLeft }}>
            quotient = {valueH[0]},&nbsp;
          </span>{' '}
          <span style={{ color: valueBCColor, backgroundColor: BackgroundColorRight }}>
            remainder = {valueI[0]}
          </span>
        </div>
      )
    } else {
      return ''
    }
  }

  const onCheckClick = () => {
    playMouseCLick()
    ggbApi.current?.setValue('t', inputValue ?? 0)
    ggbApi.current?.evalCommand('RunClickScript(pic9)')
  }

  const onTryNewClick = () => {
    playMouseCLick()
    ggbApi.current?.evalCommand('RunClickScript(button1)')
  }

  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#F6F6F6',
        id: 'g06-nsc03-s1-gb04',
        onEvent,
        className,
      }}
    >
      <TextHeader
        text="Explore how to divide decimals using long division method."
        backgroundColor="#F6F6F6"
        buttonColor="#1A1A1A"
        hideButton={true}
      />
      <GeogebraContainer materialId="scmdbetf" width={650} height={650} onApiReady={onGGBLoaded} />
      <BottomCoordContainer prg={prgValue}>
        {prgValue !== 16 && prgValue !== 0 && (
          <AnswerInputBorder isWrong={isAnswerWrong} isCorrect={isAnswerRight}>
            <AnswerInput
              value={inputValue ?? ''}
              onChange={(e: any) => {
                if ((e.target.value < 1000 && e.target.value > -1000) || e.target.value == '-') {
                  setInputValue(e.target.value)
                }
                // setInputValue(value ? Number(value) : undefined)
              }}
            />
          </AnswerInputBorder>
        )}
      </BottomCoordContainer>
      {ggbLoaded && <BottomTexts prg={prgValue}>{getHeaderText(prgValue)}</BottomTexts>}
      {prgValue !== 16 && prgValue !== 0 ? (
        <CheckButton
          hasValue={inputValue !== undefined && inputValue !== null}
          onClick={onCheckClick}
          disabled={inputValue === undefined || inputValue === null}
        >
          Check
        </CheckButton>
      ) : (
        prgValue !== 0 && (
          <>
            <TryNewButton onClick={onTryNewClick}>Try New</TryNewButton>
            <TryNewSymbol src={tryNewSymb} />
          </>
        )
      )}
      <PatchContainer src={patch}></PatchContainer>
      {showOnboarding1 && (
        <>
          <OnboardingAnimationContainer left={255} top={600} src={ClickAnimation} loop autoplay />
        </>
      )}
    </AppletContainer>
  )
}

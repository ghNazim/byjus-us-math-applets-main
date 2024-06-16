import { Player } from '@lottiefiles/react-lottie-player'
import { e } from 'mathjs'
import { FC, useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { AppletContainer } from '@/common/AppletContainer'
import { Geogebra } from '@/common/Geogebra'
import { ClientListener, GeogebraAppApi } from '@/common/Geogebra/Geogebra.types'
import { TextHeader } from '@/common/Header'
import { AppletInteractionCallback } from '@/contexts/analytics'
import { useSFX } from '@/hooks/useSFX'
import { useTimeout } from '@/hooks/useTimeout'

import click from '../../common/handAnimations/click.json'
const GeogebraContainer = styled(Geogebra)<{ top: number; left: number }>`
  position: absolute;
  left: 38%;
  top: 45%;
  transform: translate(-50%, -50%);
  scale: 0.8;
`
interface BottomCoordContainerProps {
  prg: number // Change the type of prg to match its actual type
}
const BottomCoordContainer = styled.label<BottomCoordContainerProps>`
  position: absolute;
  top: 350px;
  left: 635px;
  transform: translateX(-80%);
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 400;
  font-size: 24px;
  line-height: 32px;
  color: #444444;
  display: ${(props) => (props.prg == 2 ? 'flex' : 'none')}; // Only display when prgValue is 1
  justify-content: center;
  flex-direction: row;
  gap: 15px;
  width: 720px;
  height: 100px;
  z-index: 2;
`

const AnswerInputBorder = styled.button<{
  isWrong?: boolean
  isCorrect?: boolean
  default?: boolean
}>`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 8px 8px 8px 8px;
  gap: 20px;
  border-color: ${({ isWrong, isCorrect }) =>
    isWrong ? '#CC6666' : isCorrect ? '#1A1A1A' : '#1a1a1a'};
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

const CheckButton = styled.button<{ hasValue: boolean }>`
  position: absolute;
  top: 720px;
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

  &:focus {
    outline: none;
  }
  z-index: 2;
`

const OnboardingAnimationContainer = styled(Player)<{ left: number; top: number }>`
  position: absolute;
  left: ${(a) => a.left}px;
  top: ${(a) => a.top}px;
  pointer-events: none;
  z-index: 1;
`

export const AppletG06RPC07S1GB01: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const ggbApi = useRef<GeogebraAppApi | null>(null)
  const [prgValue, setPrgValue] = useState<number>(0)
  const [ggbLoaded, setGgbLoaded] = useState(false)

  const [inputValue, setInputValue] = useState<number | undefined>(undefined)
  const [isAnswerWrong, setIsAnswerWrong] = useState(false)
  const [isAnswerRight, setIsAnswerRight] = useState(false)

  const playMouseClick = useSFX('mouseClick')
  const playMouseIn = useSFX('mouseIn')
  const playMouseOut = useSFX('mouseOut')
  const [showOnboarding1, setShowOnboarding1] = useState(true)

  const onGGBLoaded = useCallback((api: any) => {
    ggbApi.current = api
    setGgbLoaded(api != null)
  }, [])
  useEffect(() => {
    const api = ggbApi.current
    if (api != null && ggbLoaded) {
      const onGgb1Client: ClientListener = (e) => {
        if (
          e.type === 'mouseDown' &&
          (e.hits[0] === 'Start' ||
            e.hits[0] === 'Next2' ||
            e.hits[0] === 'Check5' ||
            e.hits[0] === 'TryNew')
        ) {
          playMouseClick()
        } else if (e.type === 'mouseDown' && e.hits[0] === 'Dagger') {
          playMouseIn()
        } else if (e.type === 'dragEnd' && e.target === 'Dagger') {
          playMouseOut()
        }
      }
      api.registerClientListener(onGgb1Client)

      return () => {
        ggbApi.current?.unregisterClientListener(onGgb1Client)
      }
    }
  }, [ggbLoaded, playMouseClick, playMouseIn, playMouseOut])

  useEffect(() => {
    const api = ggbApi.current
    let PageValue = 0

    setPrgValue(PageValue)

    if (api != null && ggbLoaded) {
      api.registerObjectUpdateListener('layer', () => {
        PageValue = api.getValue('layer')
        setPrgValue(PageValue)

        if (PageValue === 1) {
          setInputValue(undefined)
        }

        if (PageValue === 2) {
          setShowOnboarding1(false)
        }
      })

      return () => {
        api.unregisterObjectUpdateListener('layer')
      }
    }
  }, [ggbLoaded])

  const onCheckClick = () => {
    playMouseClick()
    ggbApi.current?.setValue('fact', inputValue ?? 0)
    ggbApi.current?.evalCommand('RunClickScript(Check1)')
  }
  useEffect(() => {
    let checkValue = 1

    const api = ggbApi.current

    if (api != null && ggbLoaded) {
      api.registerObjectUpdateListener('trip', () => {
        checkValue = api.getValue('trip')

        if (checkValue === 0) {
          setIsAnswerWrong(true)
          setIsAnswerRight(false)
        } else {
          setIsAnswerWrong(false)
        }
      })

      return () => {
        api.unregisterObjectUpdateListener('trip')
      }
    }
  }, [ggbLoaded, playMouseClick])

  useEffect(() => {
    setIsAnswerRight(false)
    setIsAnswerWrong(false)
  }, [inputValue])

  useTimeout(
    () => {
      setInputValue(undefined)
    },
    isAnswerWrong ? 1000 : null,
  )

  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#F6F6F6',
        id: 'g06-rpc07-s1-gb01',
        onEvent,
        className,
      }}
    >
      <TextHeader
        text="Convert the given fraction to a percentage and visualize."
        backgroundColor="#F6F6F6"
        buttonColor="#1A1A1A"
      />
      <GeogebraContainer materialId="wvvcdupp" top={70} left={0} onApiReady={onGGBLoaded} />
      <BottomCoordContainer prg={prgValue}>
        {
          <AnswerInputBorder isWrong={isAnswerWrong} isCorrect={isAnswerRight}>
            <AnswerInput
              value={inputValue ?? ''}
              onChange={(e: any) => {
                if ((e.target.value < 1000 && e.target.value > -1000) || e.target.value == '-') {
                  setInputValue(e.target.value)
                }
              }}
            />
          </AnswerInputBorder>
        }
      </BottomCoordContainer>
      {prgValue == 2 && (
        <CheckButton
          hasValue={inputValue !== undefined && inputValue !== null}
          onClick={onCheckClick}
          disabled={inputValue === undefined || inputValue === null}
        >
          Check
        </CheckButton>
      )}
      {showOnboarding1 && ggbLoaded && (
        <>
          <OnboardingAnimationContainer left={290} top={690} src={click} loop autoplay />
        </>
      )}
    </AppletContainer>
  )
}

import { Player } from '@lottiefiles/react-lottie-player'
import { FC, useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { AppletContainer } from '@/common/AppletContainer'
import { Geogebra } from '@/common/Geogebra'
import { GeogebraAppApi } from '@/common/Geogebra/Geogebra.types'
import { TextHeader } from '@/common/Header'
import { AppletInteractionCallback } from '@/contexts/analytics'
import { useSFX } from '@/hooks/useSFX'

import MouseClick from '../../assets/onboarding/click.json'
import ResetIcon from './assets/resetIcon.svg'
import Button, { ButtonState } from './components/Button'

const varButtonColor = '#1a1a1a'

const GeogebraStylized = styled(Geogebra)`
  width: 720px;
  height: 500px;
  z-index: -1;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 50px;
  /* background-color: red; */
`

const ButtonHolder = styled.div`
  position: absolute;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 7px;
  row-gap: 15px;
  bottom: 70px;
  left: 0;
  width: 100%;
  padding: 30px;
  /* border: 1px solid gray; */
`

const BottomText = styled.div<{ top: number }>`
  width: 100%;
  position: absolute;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 14px;
  /* display: flex; */
  align-items: center;
  text-align: center;
  top: ${(a) => a.top}px;
`

const Btn = styled.div<{ bottom: number }>`
  position: absolute;
  bottom: ${(a) => a.bottom}px;
  display: flex;
  background: ${varButtonColor};
  color: white;
  padding: 10px 15px;
  border-radius: 10px;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 24px;
  margin: auto;
  gap: 1rem;
  cursor: pointer;
`

const Onboarding = styled(Player)<{ top: number; left: number }>`
  top: ${(a) => a.top}px;
  left: ${(a) => a.left}px;
  position: absolute;
  pointer-events: none;
`

const PatchForHidingPauseIcon = styled.div`
  background-color: #fff;
  position: absolute;
  width: 100%;
  height: 50px;
  bottom: 280px;
`

export const AppletG06NSC04S1GB02: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const [ggbloaded, setGgbLoaded] = useState(false)
  const [currentActiveNum, setCurrentActiveNum] = useState(1)
  const GgbApi = useRef<GeogebraAppApi | null>(null)
  const [buttons, setButtons] = useState([1])
  const [isAnimationRunning, setIsAnimationRunning] = useState(false)
  const [showResetBtn, setShowResetBtn] = useState(false)
  const playMouseClick = useSFX('mouseClick')
  const [isButtonLocked, setIsButtonLocked] = useState(false)

  const onGgbReady = useCallback((api: any) => {
    setGgbLoaded(true)
    GgbApi.current = api
    // GgbApi.current.setPause
  }, [])

  const handleButtonClick = (val: number) => {
    if (currentActiveNum === val && !isButtonLocked) {
      setIsButtonLocked(true)
      setIsAnimationRunning(true)
      GgbApi.current?.evalCommand(`StartAnimation(run${val - 1 === 0 ? '' : val - 1})`)
      const timer = setTimeout(
        () => {
          setCurrentActiveNum((prev) => prev + 1)
          setIsAnimationRunning(false)
          setIsButtonLocked(false)
        },
        currentActiveNum < 7 ? 2500 : currentActiveNum < 12 ? 2000 : 1000,
      )

      return () => clearTimeout(timer)
    }
  }

  const handleCurrentBtnState = (val: number): ButtonState => {
    if (val === currentActiveNum) {
      return isAnimationRunning ? 'selected' : 'default'
    } else if (val < currentActiveNum) {
      return 12 % val === 0 ? 'Correct' : 'Wrong'
    } else {
      return 'disabled'
    }
  }

  useEffect(() => {
    const updatedButtons = []
    for (let i = 1; i < 13; i++) {
      updatedButtons.push(i)
    }
    setButtons(updatedButtons)
  }, [])

  const handleNextBtn = () => {
    GgbApi.current?.evalCommand('SetValue(final,1)')
    setShowResetBtn(true)
    playMouseClick()
  }

  const handleResetBtn = () => {
    GgbApi.current?.evalCommand('SetValue(final,0)')
    for (let i = 0; i < 12; i++) {
      GgbApi.current?.evalCommand(`SetValue(run${i === 0 ? '' : i},0)`)
    }
    setShowResetBtn(false)
    setCurrentActiveNum(1)
    playMouseClick()
  }

  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#F6F6F6',
        id: 'g06-nsc04-s1-gb02',
        onEvent,
        className,
      }}
    >
      <GeogebraStylized materialId="gcxz6kj4" onApiReady={onGgbReady} />
      <PatchForHidingPauseIcon />
      {ggbloaded && (
        <>
          <TextHeader
            text="Explore the divisibility of 12."
            backgroundColor="#F6F6F6"
            buttonColor="#1a1a1a"
          />
          <ButtonHolder>
            {buttons.map((i) => (
              <Button
                key={i}
                onClick={handleButtonClick}
                currentBtnState={handleCurrentBtnState(i)}
                value={i}
              />
            ))}
          </ButtonHolder>
          {currentActiveNum > 1 ? (
            currentActiveNum !== 13 ? (
              <>
                <BottomText top={500}>
                  12 is{12 % (currentActiveNum - 1) !== 0 ? ' not ' : ' '}evenly divisible by{' '}
                  {currentActiveNum - 1}.
                </BottomText>
                {!isAnimationRunning && <BottomText top={530}>Check the next number.</BottomText>}
              </>
            ) : (
              <>
                <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                  {showResetBtn ? (
                    <>
                      <BottomText top={505}> Factors of 12 are: 1, 2, 3, 4, 6, 12</BottomText>
                      <BottomText top={535}>
                        {' '}
                        A factor is a number that divides the given number exactly without a
                        remainder.
                      </BottomText>
                      <Btn onClick={handleResetBtn} bottom={32}>
                        <img src={ResetIcon} />
                        Reset
                      </Btn>
                      <Onboarding src={MouseClick} autoplay loop top={690} left={290} />
                    </>
                  ) : (
                    <>
                      <BottomText top={515}> Great! 12 is evenly divisible by 12</BottomText>
                      <Btn onClick={handleNextBtn} bottom={32}>
                        Next
                      </Btn>
                      <Onboarding src={MouseClick} autoplay loop top={690} left={290} />
                    </>
                  )}
                </div>
              </>
            )
          ) : (
            <>
              <Onboarding src={MouseClick} autoplay loop top={550} left={10} />
              <BottomText top={515}>
                Press the numbers one by one to check divisibility by 12!
              </BottomText>
            </>
          )}
        </>
      )}
    </AppletContainer>
  )
}

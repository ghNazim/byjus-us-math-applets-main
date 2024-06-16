import { Player } from '@lottiefiles/react-lottie-player'
import { FC, useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { click, moveHorizontally, moveRight } from '@/assets/onboarding'
import { AppletContainer } from '@/common/AppletContainer'
import { Geogebra } from '@/common/Geogebra'
import { GeogebraAppApi } from '@/common/Geogebra/Geogebra.types'
import { TextHeader } from '@/common/Header'
import { AppletInteractionCallback } from '@/contexts/analytics'
import { useSFX } from '@/hooks/useSFX'

import { Math as Latex } from '../../common/Math'
import checkActive from './assets/checkActive.svg'
import checkInactive from './assets/checkInactive.svg'
import nextActive from './assets/nextButton.svg'
import nextInactive from './assets/nextButtonInactive.svg'
import trynew from './assets/tryNew.svg'
import RadioButton from './RadioButton'

const GGBcontainer = styled(Geogebra)`
  position: absolute;
  bottom: 170px;
  left: 50%;
  translate: -50%;
  scale: 0.54;
`
const CTAButton = styled.img<{ active?: boolean }>`
  position: absolute;
  left: 50%;
  translate: -50%;
  bottom: 20px;
  cursor: ${(p) => (p.active ? 'pointer' : 'default')};
`
const NudgePlayer = styled(Player)<{ left: number; top: number }>`
  position: absolute;
  left: ${(p) => p.left}px;
  top: ${(p) => p.top}px;
  pointer-events: none;
`
const Feedback = styled.div`
  position: absolute;
  top: 500px;
  text-align: center;
  width: 100%;
  font-size: 20px;
  font-weight: 700;
  font-family: 'Nunito';
  color: #444;
`
const Blue = styled.span`
  height: 25px;
  display: inline-block;
  padding-left: 6px;
  padding-right: 7px;
  background-color: #e7fbff;
  color: #1cb9d9;
  border-radius: 5px;
`
const Orange = styled(Blue)`
  background-color: #ffe9d4;
  color: #ff8f1f;
`
const Purple = styled(Latex)`
  font-weight: 700;
`
const RadioHolder = styled.div`
  position: absolute;
  left: 50%;
  translate: -50%;
  display: flex;
  gap: 10px;
  justify-content: center;
  top: 560px;
  flex-wrap: wrap;
  width: 60%;
`
export const AppletG08NSC02S1GB03: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const [ggbLoaded, setGGBLoaded] = useState(false)
  const ggbApi = useRef<GeogebraAppApi | null>(null)
  const onGGBLoaded = useCallback((api: GeogebraAppApi | null) => {
    ggbApi.current = api
    setGGBLoaded(api !== null)
    ggbApi.current?.registerClientListener((e: any) => {
      if (
        e.type === 'mouseDown' &&
        (e.hits[0] === 'pic30' || e.hits[0] === 'pic31' || e.hits[0] === 'pic58')
      ) {
        playMouseIn()
        setNudgeOn(false)
      } else if (
        e.type === 'dragEnd' &&
        (e.target === 'pic30' || e.target === 'pic31' || e.target === 'pic58')
      ) {
        playMouseOut()
        setIsMoved(true)
      }
    })
  }, [])
  const ggb = ggbApi.current

  const [frame, setFrame] = useState(1)
  const [nudgeOn, setNudgeOn] = useState(true)
  const [isFirstTime, setIsFirstTime] = useState(true)
  const [correctness, setCorrectness] = useState(1)
  const [animEnded, setAnimEnded] = useState(0)
  const [isMoved, setIsMoved] = useState(false)
  const [activeRadio, setActiveRadio] = useState(0)
  const numbers = [2, 3, 4, 5, 6, 7]
  const playMouseClick = useSFX('mouseClick')
  const playMouseIn = useSFX('mouseIn')
  const playMouseOut = useSFX('mouseOut')
  const playCorrect = useSFX('correct')
  const playincorrect = useSFX('incorrect')
  useEffect(() => {
    if (ggbLoaded) {
      ggbApi.current?.registerObjectUpdateListener('screen', () => {
        setFrame(ggb?.getValue('screen') || 0)
      })

      return () => {
        ggbApi.current?.unregisterObjectUpdateListener('screen')
      }
    }
  }, [ggbLoaded])
  useEffect(() => {
    switch (frame) {
      case 3:
        ggb?.registerObjectUpdateListener('correct', () => {
          setCorrectness(ggb?.getValue('correct') || 0)
        })
        break
      case 4:
        ggb?.unregisterObjectUpdateListener('correct')
        break
      case 5:
        ggb?.registerObjectUpdateListener('S', () => {
          setAnimEnded(ggb?.getValue('S==(2,8.2)') || 0)
        })
        break
      case 6:
        ggb?.unregisterObjectUpdateListener('S')
        ggb?.registerObjectUpdateListener('correct2', () => {
          setCorrectness(ggb?.getValue('correct2') || 0)
        })
        break
      case 7:
        ggb?.unregisterObjectUpdateListener('correct2')
        break
    }
  }, [frame, ggb])
  function nextHandle() {
    playMouseClick()
    switch (frame) {
      case 2:
        ggb?.evalCommand('RunClickScript(Next)')
        break
      case 4:
        ggb?.evalCommand('RunClickScript(pic43)')
        setIsMoved(false)
        setNudgeOn(true)
        break
      case 5:
        ggb?.evalCommand('RunClickScript(pic53)')
        break
    }
  }
  function checkHandle() {

    switch (frame) {
      case 3:
        ggb?.evalCommand('RunClickScript(pic37)')
        if(ggb?.getValue('isCorrect')==1) playCorrect()
        else playincorrect()
        break
      case 6:
        ggb?.evalCommand('RunClickScript(pic64)')
        if(ggb?.getValue('isCorrect2')==1) playCorrect()
        else playincorrect()
        break
    }
  }
  function trynewHandle() {
    playMouseClick()
    ggb?.evalCommand('RunClickScript(pic73)')
    setActiveRadio(0)
    setAnimEnded(0)
    setCorrectness(1)
    setIsFirstTime(false)
  }
  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#444',
        id: 'g08-nsc02-s1-gb03',
        onEvent,
        className,
        themeName: 'dark',
      }}
    >
      <TextHeader
        text="Find the approximate cube root of non-perfect cube numbers."
        backgroundColor="#F6F6F6"
        buttonColor="#1A1A1A"
      />
      <GGBcontainer materialId="d2crxzj4" onApiReady={onGGBLoaded} width={1301} height={696} />
      {/* feedbacks */}
      {ggbLoaded && frame <= 2 && <Feedback>Choose a number to find its cube root.</Feedback>}
      {frame == 3 && correctness == 1 && (
        <Feedback>
          Now, let&apos;s mark the closest perfect cube number to calculate{' '}
          <Latex>{String.raw`\sqrt[3]{${activeRadio}}`}</Latex>.
        </Feedback>
      )}
      {frame == 3 && correctness == 0 && (
        <Feedback>
          Oops! That&apos;s not the nearest perfect cube number.
          <br />
          Give it another try!
        </Feedback>
      )}
      {frame == 4 && <Feedback>Now, proceed to find the cube root of these numbers.</Feedback>}
      {frame == 6 && correctness == 1 && (
        <Feedback>Mark the number whose cube is closest to {activeRadio}. </Feedback>
      )}
      {frame == 6 && correctness == 0 && (
        <Feedback>
          Oops! That&apos;s not the correct value. <br />
          Mark the number whose cube is closest to {activeRadio}.{' '}
        </Feedback>
      )}
      {frame == 5 && animEnded == 1 && (
        <Feedback>
          <Latex>{String.raw`\sqrt[3]{${activeRadio}}`}</Latex>&nbsp; lies between <Blue>{1}</Blue>{' '}
          and <Orange>{2}</Orange>.
          <br />
          Proceed to expand this range and find its approximate value.
        </Feedback>
      )}
      {frame == 7 && (
        <Feedback style={{ color: '#AA5EE0', fontWeight: '500' }}>
          <Purple>{String.raw`\sqrt[3]{${activeRadio}}`}</Purple> ≈ {Math.cbrt(activeRadio).toFixed(1)}
        </Feedback>
      )}
      {/* buttons */}
      {ggbLoaded && frame <= 2 && (
        <RadioHolder>
          {numbers.map((num) => (
            <RadioButton
              key={num}
              disabled={false}
              active={activeRadio == num}
              onClick={() => {
                playMouseClick()
                setActiveRadio(num)
                ggb?.evalCommand(`SetValue(n,${num})\nSetValue(screen,2)`)
              }}
              text={String(num)}
            ></RadioButton>
          ))}
        </RadioHolder>
      )}
      {ggbLoaded && (frame == 1 || (frame == 5 && animEnded == 0)) && (
        <CTAButton draggable={false} src={nextInactive} />
      )}
      {(frame == 3 || frame == 6) && (correctness == 0 || !isMoved) && (
        <CTAButton draggable={false} src={checkInactive} />
      )}
      {(frame == 2 || frame == 4 || (frame == 5 && animEnded == 1)) && (
        <CTAButton active draggable={false} src={nextActive} onClick={nextHandle} />
      )}
      {(frame == 3 || frame == 6) && correctness == 1 && isMoved && (
        <CTAButton active draggable={false} src={checkActive} onClick={checkHandle} />
      )}
      {frame == 7 && <CTAButton active draggable={false} src={trynew} onClick={trynewHandle} />}

      {/* nudges */}
      {ggbLoaded && isFirstTime && frame==1 && <NudgePlayer src={click} left={180} top={540} autoplay loop />}
      {isFirstTime && frame==3 && nudgeOn && <NudgePlayer src={moveRight} left={-130} top={370} autoplay loop />}
      {isFirstTime && frame==6 && nudgeOn && <NudgePlayer src={moveHorizontally} left={161} top={370} autoplay loop />}
    </AppletContainer>
  )
}

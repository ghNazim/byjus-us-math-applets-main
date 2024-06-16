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
  top: 100px;
  position: absolute;
  left: 50%;
  translate: -50%;
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
const FeedbackTop = styled.div`
  position: absolute;
  top: 500px;
  text-align: center;
  width: 100%;
  font-size: 20px;
  font-weight: 700;
  font-family: 'Nunito';
  color: #444;
  translate: 0 -50%;
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
export const AppletG08NSC02S1GB02: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const [ggbLoaded, setGGBLoaded] = useState(false)
  const ggbApi = useRef<GeogebraAppApi | null>(null)
  const onGGBLoaded = useCallback((api: GeogebraAppApi | null) => {
    ggbApi.current = api
    setGGBLoaded(api !== null)
    ggbApi.current?.registerClientListener((e: any) => {
      if (e.type === 'mouseDown' && (e.hits[0] === 'A' || e.hits[0] === 'B' || e.hits[0] === 'Q')) {
        playMouseIn()
        setNudgeOn(false)
      } else if (
        e.type === 'dragEnd' &&
        (e.target === 'A' || e.target === 'B' || e.target === 'Q')
      ) {
        playMouseOut()
      }
    })
  }, [])
  const ggb = ggbApi.current
  const [button, setButton] = useState(2)
  const [frame, setFrame] = useState(0)
  const [red, setRed] = useState(0)
  const [animEnded, setAnimEnded] = useState(0)
  const [isFirstTime, setIsFirstTime] = useState(true)
  const [nudgeOn, setNudgeOn] = useState(true)
  const [activeRadio, setActiveRadio] = useState(0)
  const numbers = [2, 3, 5, 6, 7, 8]
  const playMouseClick = useSFX('mouseClick')
  const playMouseIn = useSFX('mouseIn')
  const playMouseOut = useSFX('mouseOut')
  const playCorrect = useSFX('correct')
  const playincorrect = useSFX('incorrect')
  useEffect(() => {
    if (ggbLoaded) {
      ggbApi.current?.registerObjectUpdateListener('frame', () => {
        setFrame(ggb?.getValue('frame') || 0)
      })
      ggbApi.current?.registerObjectUpdateListener('butt', () => {
        setButton(ggb?.getValue('butt') || 0)
      })

      return () => {
        ggbApi.current?.unregisterObjectUpdateListener('button')
        ggbApi.current?.unregisterObjectUpdateListener('frame')
      }
    }
  }, [ggbLoaded])
  useEffect(() => {
    switch (frame) {
      case 0:
        ggbApi.current?.registerObjectUpdateListener('n', () => {
          setActiveRadio(ggb?.getValue('n') || 0)
        })
        break
      case 1:
        ggbApi.current?.unregisterObjectUpdateListener('n')
        setNudgeOn(true)
        ggbApi.current?.registerObjectUpdateListener('red', () => {
          setRed(ggb?.getValue('red') || 0)
        })
        break
      case 2:
        ggbApi.current?.unregisterObjectUpdateListener('red')
        break
      case 3:
        ggbApi.current?.registerObjectUpdateListener('pl', () => {
          setAnimEnded(ggb?.getValue('pl>0') || 1)
        })
        break
      case 4:
        ggbApi.current?.unregisterObjectUpdateListener('pl')
        setNudgeOn(true)
        ggbApi.current?.registerObjectUpdateListener('red', () => {
          setRed(ggb?.getValue('red') || 0)
        })
        break
    }
  }, [frame, ggb])

  function nextHandle() {
    playMouseClick()
    ggb?.evalCommand('RunClickScript(next)')
  }
  function checkHandle() {
    ggb?.evalCommand('RunClickScript(check)')
    if (ggb?.getValue('red') == 0) playCorrect()
    else playincorrect()
  }
  function trynewHandle() {
    playMouseClick()
    ggb?.evalCommand('RunClickScript(trynew)')
    setActiveRadio(0)
    setButton(2)
    setIsFirstTime(false)
  }
  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#444',
        id: 'g08-nsc02-s1-gb02',
        onEvent,
        className,
        themeName: 'dark',
      }}
    >
      <TextHeader
        text="Find the approximate square root of non-perfect square numbers."
        backgroundColor="#F6F6F6"
        buttonColor="#1A1A1A"
      />
      <GGBcontainer materialId="quutmysj" onApiReady={onGGBLoaded} width={705} height={380} />
      {/* texts */}
      {frame == 0 && ggbLoaded && (
        <FeedbackTop>Choose a number to find its square root.</FeedbackTop>
      )}
      {frame == 1 && red == 0 && (
        <FeedbackTop>
          Now, let&apos;s mark the closest perfect square number to calculate{' '}
          <Latex>{String.raw`\sqrt{${activeRadio}}`}</Latex>.
        </FeedbackTop>
      )}
      {frame == 1 && red == 1 && (
        <FeedbackTop>
          Oops! That&apos;s not the nearest perfect square number. <br />
          Give it another try!
        </FeedbackTop>
      )}
      {frame == 2 && (
        <FeedbackTop>Now, proceed to find the square root of these numbers.</FeedbackTop>
      )}
      {frame == 3 && animEnded == 1 && (
        <FeedbackTop>
          <Latex>{String.raw`\sqrt{${activeRadio}}`}</Latex>&nbsp; lies between{' '}
          <Blue>{Math.sqrt(ggb?.getValue('x(C)') || 1)}</Blue> and{' '}
          <Orange>{Math.sqrt(ggb?.getValue('y(C)') || 9)}</Orange>.
          <br />
          Proceed to expand this range and find its approximate value.
        </FeedbackTop>
      )}
      {frame == 4 && red == 0 && (
        <FeedbackTop>Mark the number whose square is closest to {activeRadio}. </FeedbackTop>
      )}
      {frame == 4 && red == 1 && (
        <FeedbackTop>
          Oops! That&apos;s not the correct value. <br />
          Mark the number whose square is closest to {activeRadio}.{' '}
        </FeedbackTop>
      )}
      {frame == 5 && (
        <FeedbackTop style={{ color: '#AA5EE0', fontWeight: '500' }}>
          <Purple>{String.raw`\sqrt{${activeRadio}}`}</Purple> ≈ {ggb?.getValue('closer')}
        </FeedbackTop>
      )}
      {/* buttons */}
      {ggbLoaded && frame == 0 && (
        <RadioHolder>
          {numbers.map((num) => (
            <RadioButton
              key={num}
              disabled={false}
              active={activeRadio == num}
              onClick={() => {
                playMouseClick()
                setNudgeOn(false)
                ggb?.evalCommand('RunClickScript(but' + num + ')')
                setNudgeOn(false)
              }}
              text={String(num)}
            ></RadioButton>
          ))}
        </RadioHolder>
      )}
      {ggbLoaded && button == 2 && <CTAButton draggable={false} src={nextInactive} />}
      {button == 4 && <CTAButton draggable={false} src={checkInactive} />}
      {button == 1 && <CTAButton active draggable={false} src={nextActive} onClick={nextHandle} />}
      {button == 3 && (
        <CTAButton active draggable={false} src={checkActive} onClick={checkHandle} />
      )}
      {button == 5 && <CTAButton active draggable={false} src={trynew} onClick={trynewHandle} />}

      {/* nudges */}
      {ggbLoaded && isFirstTime && nudgeOn && frame == 0 && (
        <NudgePlayer src={click} left={180} top={540} autoplay loop />
      )}
      {isFirstTime && nudgeOn && frame == 1 && <NudgePlayer src={moveRight} left={-125} top={340} autoplay loop />}
      {isFirstTime && nudgeOn && frame == 4 && <NudgePlayer src={moveHorizontally} left={160} top={340} autoplay loop />}
    </AppletContainer>
  )
}

import { Player } from '@lottiefiles/react-lottie-player'
import { FC, useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { click } from '@/assets/onboarding'
import { AppletContainer } from '@/common/AppletContainer'
import { Geogebra } from '@/common/Geogebra'
import { GeogebraAppApi } from '@/common/Geogebra/Geogebra.types'
import { TextHeader } from '@/common/Header'
import { AppletInteractionCallback } from '@/contexts/analytics'
import { useSFX } from '@/hooks/useSFX'

import reset from './assets/reset.svg'
import submit from './assets/submit.svg'
import submitInactive from './assets/submitInactive.svg'

const GGBcontainer = styled(Geogebra)`
  top: 120px;
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
const NudgePlayer = styled(Player)<{ left: number }>`
  position: absolute;
  left: ${(p) => p.left}px;
  top: 620px;
  pointer-events: none;
`
const FeedbackTop = styled.div`
  position: absolute;
  top: 540px;
  text-align: center;
  width: 100%;
  font-size: 20px;
  font-weight: 700;
  font-family: 'Nunito';
  color: #444;
`
const FeedbackCenter = styled(FeedbackTop)`
  top: 600px;
  translate: 0 -50%;
`
const ColoredCircle = styled.div<{ color: string }>`
  position: absolute;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: ${(p) => p.color};
  top: -30px;
`
const FlexHold = styled.div`
  position: absolute;
  display: flex;
  bottom: 100px;
  width: 100%;
  height: 60px;
  flex-direction: row;
  justify-content: center;
  gap: 20px;
`
const Holder = styled.div`
  position: relative;
  width: 200px;
  height: 60px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 10px;
  background-color: #f6f6f6;
  border: 1px solid #222;
  border-radius: 10px;
`

const Elem = styled.div<{ clickable?: boolean }>`
  width: 60px;
  height: 60px;
  text-align: center;
  line-height: 60px;
  font-size: 24px;
  &.btn {
    color: ${(p) => (p.clickable ? '#222222' : '#c7c7c7')};
    cursor: ${(p) => (p.clickable ? 'pointer' : 'default')};
  }
  user-select: none;
`
function PlusMinus(prop: {
  value: number
  color: string
  onIncrease?: () => void
  onDecrease?: () => void
  disabled?: boolean
}) {
  function onClickPlus() {
    if (prop.onIncrease && !prop.disabled) prop.onIncrease()
  }
  function onClickMinus() {
    if (prop.onDecrease && !prop.disabled && prop.value > 0) prop.onDecrease()
  }
  return (
    <>
      <Holder>
        <Elem className="btn" clickable={!prop.disabled && prop.value != 0} onClick={onClickMinus}>
          -
        </Elem>
        <Elem>{prop.value}</Elem>
        <ColoredCircle color={prop.color} />
        <Elem className="btn" clickable={!prop.disabled} onClick={onClickPlus}>
          +
        </Elem>
      </Holder>
    </>
  )
}
export const AppletG07SPC05S1GB01: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const [ggbLoaded, setGGBLoaded] = useState(false)
  const ggbApi = useRef<GeogebraAppApi | null>(null)
  const onGGBLoaded = useCallback((api: GeogebraAppApi | null) => {
    ggbApi.current = api
    setGGBLoaded(api !== null)
  }, [])
  const ggb = ggbApi.current

  const [nudgeOn, setNudgeOn] = useState(true)
  const [orange, setOrange] = useState(0)
  const [blue, setBlue] = useState(0)
  const [green, setGreen] = useState(0)
  const [ansState, setAnsState] = useState(0)
  const min = Math.min(orange, blue, green)
  const playMouseClick = useSFX('mouseClick')
  useEffect(() => {
    setOrange(ggb?.getValue('p') || 0)
    setBlue(ggb?.getValue('q') || 0)
    setGreen(ggb?.getValue('r') || 0)
    ggbApi.current?.registerObjectUpdateListener('p', () => {
      setOrange(ggb?.getValue('p') || 0)
    })
    ggbApi.current?.registerObjectUpdateListener('q', () => {
      setBlue(ggb?.getValue('q') || 0)
    })
    ggbApi.current?.registerObjectUpdateListener('r', () => {
      setGreen(ggb?.getValue('r') || 0)
    })
    ggbApi.current?.registerObjectUpdateListener('green', () => {
      setAnsState(ggb?.getValue('green') || 0)
    })
  }, [ggbLoaded, ggb])

  function runScript(name: string) {
    playMouseClick()
    ggb?.evalCommand('RunClickScript(' + name + ')')
    if (nudgeOn) setNudgeOn(false)
  }

  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#444',
        id: 'g07-spc05-s1-gb01',
        onEvent,
        className,
        themeName: 'dark',
      }}
    >
      <TextHeader
        text="Explore equally likely events."
        backgroundColor="#F6F6F6"
        buttonColor="#1A1A1A"
      />
      <GGBcontainer materialId="duxfkpvn" onApiReady={onGGBLoaded} width={718} height={415} />
      {ggbLoaded && ansState < 2 && (
        <FlexHold>
          <PlusMinus
            value={orange}
            disabled={ansState > 0}
            color={'#FF8F1F'}
            onIncrease={() => {
              runScript('plusl')
            }}
            onDecrease={() => {
              runScript('minusl')
            }}
          />
          <PlusMinus
            value={blue}
            disabled={ansState > 0}
            color={'#2AD3F5'}
            onIncrease={() => {
              runScript('plusm')
            }}
            onDecrease={() => {
              runScript('minusm')
            }}
          />
          <PlusMinus
            value={green}
            disabled={ansState > 0}
            color={'#428C94'}
            onIncrease={() => {
              runScript('plusr')
            }}
            onDecrease={() => {
              runScript('minusr')
            }}
          />
        </FlexHold>
      )}
      {!nudgeOn && orange != 0 && blue != 0 && green != 0 && ansState == 0 && (
        <CTAButton
          active
          draggable="false"
          src={submit}
          onClick={() => {
            runScript('submit')
          }}
        />
      )}
      {(nudgeOn || orange == 0 || blue == 0 || green == 0) && (
        <CTAButton draggable="false" src={submitInactive} />
      )}
      {ansState > 0 && (
        <CTAButton
          active
          draggable="false"
          src={reset}
          onClick={() => {
            runScript('reset')
          }}
        />
      )}
      {ansState == 0 && (
        <FeedbackTop>
          Adjust the number of marbles so that <br />
          drawing any color is equally likely.
        </FeedbackTop>
      )}
      {ansState == 1 && (
        <FeedbackTop>
          Uh-oh! Looks like all kinds of marbles <br />
          are not equally likely to be drawn. Please try again!
        </FeedbackTop>
      )}
      {ansState == 2 && (
        <FeedbackCenter>
          Well done! If number of all kinds of marbles are equal, <br />
          each kind is equally likely to be drawn.
        </FeedbackCenter>
      )}
      {ggbLoaded && nudgeOn && (
        <NudgePlayer
          src={click}
          left={min == orange ? 135 : min == blue ? 355 : 580}
          autoplay
          loop
        />
      )}
    </AppletContainer>
  )
}

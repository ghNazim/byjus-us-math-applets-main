import { Player } from '@lottiefiles/react-lottie-player'
import { FC, useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { click, moveRight, rotateBothSides } from '@/assets/onboarding'
import { AppletContainer } from '@/common/AppletContainer'
import { Geogebra } from '@/common/Geogebra'
import { GeogebraAppApi } from '@/common/Geogebra/Geogebra.types'
import { TextHeader } from '@/common/Header'
import { AppletInteractionCallback } from '@/contexts/analytics'
import { useSFX } from '@/hooks/useSFX'
import { RangeInput } from '@/molecules/RangeInput'

import checkButtonActive from './assets/checkButton.svg'
import checkButtonInactive from './assets/checkButtonInactive.svg'
import nextButtonActive from './assets/nextButton.svg'
import nextButtonInactive from './assets/nextButtonInactive.svg'
import StartButton from './assets/StartButton.svg'
import trynewButton from './assets/trynewButton.svg'
import ToggleGroup from './ToggleGroup/ToggleGroup'

const GGBcontainer = styled(Geogebra)`
  top: 20px;
  scale: 0.7;
  position: absolute;
  left: 50%;
  translate: -50%;
`
const CTAButton = styled.img`
  position: absolute;
  left: 50%;
  translate: -50%;
  bottom: 20px;
`
const NudgePlayer = styled(Player)<{ left: number; top: number }>`
  position: absolute;
  left: ${(p) => p.left}px;
  top: ${(p) => p.top}px;
  pointer-events: none;
`
const FeedbackTop = styled.div`
  position: absolute;
  top: 530px;
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
const OrangeSpan = styled.span`
  display: inline-block;
  background-color: #fee9d4;
  color: #d97a1a;
  border-radius: 8px;
  padding: 0px 4px;
`
const BlueSpan = styled.span`
  display: inline-block;
  background-color: #d1f7ff;
  color: #1cb9d9;
  border-radius: 8px;
  padding: 0px 4px;
`
const Slider = styled(RangeInput)`
  position: absolute;
  width: 80%;
  bottom: 100px;
  left: 50%;
  translate: -50%;
`

export const AppletG07RPC03S1GB02: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const [ggbLoaded, setGGBLoaded] = useState(false)
  const ggbApi = useRef<GeogebraAppApi | null>(null)
  const onGGBLoaded = useCallback((api: GeogebraAppApi | null) => {
    ggbApi.current = api
    setGGBLoaded(api !== null)
    if (api == null) return
    api.registerClientListener((e: any) => {
      if (e.type === 'mouseDown' && (e.hits[0] === 'V1' || e.hits[0] === 'V2')) {
        playMouseIn()
        setNudgeOn(false)
      } else if (e.type === 'dragEnd' && (e.target === 'V1' || e.target === 'V2')) {
        playMouseOut()
      }
    })
  }, [])
  const ggb = ggbApi.current
  const [button, setButton] = useState(0)
  const [frame, setFrame] = useState(1)
  const [divisions, setDivisions] = useState(1)
  const [toggle, setToggle] = useState(-1)
  const [wrong, setWrong] = useState(0)
  const [isAnimating, setIsAnimating] = useState(1)
  const [nudgeOn, setNudgeOn] = useState(true)

  const isEqual = ggb?.getValue('isequal')
  const a = ggb?.getValue('a') || 4
  const b = ggb?.getValue('b') || 2
  const c = ggb?.getValue('c') || 1
  const d = ggb?.getValue('d') || 2
  const playMouseClick = useSFX('mouseClick')
  const playMouseIn = useSFX('mouseIn')
  const playMouseOut = useSFX('mouseOut')
  useEffect(() => {
    if (ggbLoaded) {
      ggbApi.current?.registerObjectUpdateListener('but', () => {
        setButton(ggb?.getValue('but') || 6)
      })
      ggbApi.current?.registerObjectUpdateListener('frame', () => {
        setFrame(ggb?.getValue('frame') || 1)
      })
      ggbApi.current?.registerObjectUpdateListener('animOn', () => {
        setIsAnimating(ggb?.getValue('animOn') || 0)
      })
      ggbApi.current?.registerObjectUpdateListener('wrong', () => {
        setWrong(ggb?.getValue('wrong') || 0)
      })
      return () => {
        ggbApi.current?.unregisterObjectUpdateListener('but')
        ggbApi.current?.unregisterObjectUpdateListener('frame')
        ggbApi.current?.unregisterObjectUpdateListener('animOn')
        ggbApi.current?.unregisterObjectUpdateListener('wrong')
      }
    }
  }, [ggb, ggbLoaded])

  function nextClickHandle() {
    playMouseClick()
    ggb?.evalCommand('RunClickScript(next)')
    if (frame == 3) setDivisions(1)
    if (frame < 4 && a * b == 35) setNudgeOn(true)
  }
  function checkClickHandle() {
    playMouseClick()
    ggb?.evalCommand('RunClickScript(check)')
  }
  function startClickHandle() {
    playMouseClick()
    ggb?.evalCommand('RunClickScript(start)')
    setNudgeOn(false)
  }
  function tryClickHandle() {
    playMouseClick()
    ggb?.evalCommand('RunClickScript(tryagain)')
    setFrame(1)
    setDivisions(1)
    setToggle(-1)
    setWrong(0)
    setButton(0)
  }
  function handleSliderChange(value: number) {
    setNudgeOn(false)
    setDivisions(value)
    if (frame < 3)
      ggb?.setCoords(
        'Z1',
        ggb?.getValue('x(slnew(' + value + '))'),
        ggb?.getValue('y(slnew(' + value + '))'),
      )
    else
      ggb?.setCoords(
        'Z2',
        ggb?.getValue('x(slnew(' + value + '))'),
        ggb?.getValue('y(slnew(' + value + '))'),
      )
  }
  const handleToggleChange = useCallback((activeId: number) => {
    if (activeId < 0) return
    setToggle(activeId)
  }, [])
  useEffect(() => {
    if (!ggbApi.current) return
    switch (toggle) {
      case 0:
        ggbApi.current.evalCommand('RunClickScript(yes)')
        break
      case 1:
        ggbApi.current.evalCommand('RunClickScript(no)')
        break
    }
  }, [toggle])
  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#444',
        id: 'g07-rpc03-s1-gb02',
        onEvent,
        className,
        themeName: 'dark',
      }}
    >
      <TextHeader
        text="Visualizing proportional and disproportional ratios."
        backgroundColor="#F6F6F6"
        buttonColor="#1A1A1A"
      />
      <GGBcontainer materialId="xzqtk8et" onApiReady={onGGBLoaded} width={992} height={585} />
      {ggbLoaded && frame == 1 && isAnimating == 1 && (
        <FeedbackCenter>Write the given ratios as fractions.</FeedbackCenter>
      )}
      {frame == 1 && isAnimating == 0 && (
        <FeedbackCenter>
          Fractions formed from proportional ratios are equivalent.
          <br />
          Let us check if these fractions are equivalent.
        </FeedbackCenter>
      )}
      {!isAnimating && frame == 2 && wrong == 0 && (
        <FeedbackTop>
          Select the number of divisions required to represent the first fraction.
        </FeedbackTop>
      )}
      {(frame == 2 || frame == 4) && wrong == 2 && (
        <FeedbackTop>Oops! Take a close look at the denominator.</FeedbackTop>
      )}
      {(frame == 2 || frame == 4) && wrong == 1 && (
        <FeedbackCenter>Correct! Let’s highlight the parts now.</FeedbackCenter>
      )}
      {(frame == 3 || frame == 5) && wrong == 0 && (
        <FeedbackCenter>Highlight the parts to represent the fraction.</FeedbackCenter>
      )}
      {(frame == 3 || frame == 5) && wrong == 2 && (
        <FeedbackCenter>Oops! Take a close look at the numerator.</FeedbackCenter>
      )}
      {frame == 3 && wrong == 1 && (
        <FeedbackCenter>
          Well done! You’ve represented the fraction properly.
          <br />
          Now, represent the second fraction.
        </FeedbackCenter>
      )}
      {frame == 5 && wrong == 1 && (
        <FeedbackCenter>Well done! You’ve represented the fraction properly.</FeedbackCenter>
      )}
      {frame == 4 && isAnimating == 0 && wrong == 0 && (
        <FeedbackTop>
          Select the number of divisions required to represent the second fraction.
        </FeedbackTop>
      )}

      {frame == 6 && (
        <FeedbackCenter>
          Let’s overlap the two circles to check if the fractions are equivalent.
        </FeedbackCenter>
      )}
      {frame == 8 && !isEqual && toggle == 0 && (
        <FeedbackCenter>
          Uh-oh! Since the shaded portions do not overlap completely,
          <br />
          the fractions are not equivalent. Hence, the ratios <br />
          <OrangeSpan>
            {' '}
            {a} : {b}{' '}
          </OrangeSpan>{' '}
          and{' '}
          <BlueSpan>
            {' '}
            {c} : {d}{' '}
          </BlueSpan>{' '}
          do not form a proportion.
        </FeedbackCenter>
      )}
      {frame == 8 && !isEqual && toggle == 1 && (
        <FeedbackCenter>
          Well done! Since the shaded portions do not overlap completely,
          <br />
          the fractions are not equivalent. Hence, the ratios <br />
          <OrangeSpan>
            {' '}
            {a} : {b}{' '}
          </OrangeSpan>{' '}
          and{' '}
          <BlueSpan>
            {' '}
            {c} : {d}{' '}
          </BlueSpan>{' '}
          do not form a proportion.
        </FeedbackCenter>
      )}
      {frame == 8 && isEqual && toggle == 1 && (
        <FeedbackCenter>
          Uh-oh! Since the shaded portions overlap completely,
          <br />
          the fractions are equivalent. Hence, the ratios <br />
          <OrangeSpan>
            {' '}
            {a} : {b}{' '}
          </OrangeSpan>{' '}
          and{' '}
          <BlueSpan>
            {' '}
            {c} : {d}{' '}
          </BlueSpan>{' '}
          form a proportion.
        </FeedbackCenter>
      )}
      {frame == 8 && isEqual && toggle == 0 && (
        <FeedbackCenter>
          Well done! Since the shaded portions overlap completely,
          <br />
          the fractions are equivalent. Hence, the ratios <br />
          <OrangeSpan>
            {' '}
            {a} : {b}{' '}
          </OrangeSpan>{' '}
          and{' '}
          <BlueSpan>
            {' '}
            {c} : {d}{' '}
          </BlueSpan>{' '}
          form a proportion.
        </FeedbackCenter>
      )}

      {frame == 7 && !isAnimating && <FeedbackTop>Do these ratios form a proportion?</FeedbackTop>}

      {!isAnimating && (frame == 2 || frame == 4) && button != 2 && (
        <Slider
          label={'Number of divisions'}
          min={1}
          max={14}
          value={divisions}
          step={1}
          onChange={handleSliderChange}
        />
      )}
      {frame == 7 && !isAnimating && <ToggleGroup noOfChildren={2} onChange={handleToggleChange} />}

      {button == 1 && <CTAButton draggable="false" src={nextButtonInactive} />}
      {button == 2 && (
        <CTAButton draggable="false" src={nextButtonActive} onClick={nextClickHandle} />
      )}
      {button == 3 && <CTAButton draggable="false" src={checkButtonInactive} />}
      {button == 4 && (
        <CTAButton draggable="false" src={checkButtonActive} onClick={checkClickHandle} />
      )}
      {ggbLoaded && button == 0 && (
        <CTAButton draggable="false" src={StartButton} onClick={startClickHandle} />
      )}
      {button == 5 && <CTAButton draggable="false" src={trynewButton} onClick={tryClickHandle} />}
      {ggbLoaded && nudgeOn && frame == 1 && (
        <NudgePlayer src={click} left={290} top={700} autoplay loop />
      )}
      {nudgeOn && frame == 2 && !isAnimating && (
        <NudgePlayer src={moveRight} left={-110} top={600} autoplay loop />
      )}
      {nudgeOn && frame == 3 && (
        <NudgePlayer src={rotateBothSides} left={160} top={200} autoplay loop />
      )}
    </AppletContainer>
  )
}

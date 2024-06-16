import { Player } from '@lottiefiles/react-lottie-player'
import { FC, useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { click, moveRight } from '@/assets/onboarding'
import { AppletContainer } from '@/common/AppletContainer'
import { Geogebra } from '@/common/Geogebra'
import { GeogebraAppApi } from '@/common/Geogebra/Geogebra.types'
import { TextHeader } from '@/common/Header'
import { AppletInteractionCallback } from '@/contexts/analytics'
import { useSFX } from '@/hooks/useSFX'

import nextButtonActive from './assets/nextButton.svg'
import nextButtonInactive from './assets/nextButtonInactive.svg'
import retryButton from './assets/retryButton.svg'
import RadioButton from './RadioButton'
import { RangeInput } from './RangeInput'

const GGBcontainer = styled(Geogebra)`
  position: absolute;
  left: 50%;
  translate: -50%;
  top: 0px;
  scale: 0.68;
`
const NudgePlayer = styled(Player)<{ click: boolean }>`
  position: absolute;
  left: ${(p) => (p.click ? 140 : -160)}px;
  top: 610px;
  pointer-events: none;
`
const CTAButton = styled.img`
  position: absolute;
  left: 50%;
  translate: -50%;
  bottom: 20px;
  &.active {
    cursor: pointer;
  }
`
const Slider = styled(RangeInput)`
  position: absolute;
  left: 50%;
  translate: -50%;
  bottom: 100px;
`
const Feedback = styled.div`
  position: absolute;
  top: 540px;
  text-align: center;
  width: 100%;
  font-size: 20px;
  font-weight: 700;
  line-height: 30px;
  font-family: 'Nunito';
  color: #444;
`
const StyledBlue = styled.span`
  height: 25px;
  display: inline-block;
  padding-left: 6px;
  padding-right: 7px;
  background-color: #e7fbff;
  color: #1cb9d9;
  border-radius: 5px;
`
const StyledPurple = styled(StyledBlue)`
  background-color: #faf2ff;
  color: #aa5ee0;
`
const P = styled.span`
  color: #aa5ee0;
`
const O = styled.span`
  color: #ff8f1f;
`
const B = styled.span`
  color: #cc6666;
`
const RadioHolder = styled.div`
  position: absolute;
  display: flex;
  column-gap: 20px;
  justify-content: center;
  top: 630px;
  width: 100%;
`
export const AppletG08GMC03S1GB01: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const [ggbLoaded, setGGBLoaded] = useState(false)
  const ggbApi = useRef<GeogebraAppApi | null>(null)
  const onGGBLoaded = useCallback((api: GeogebraAppApi | null) => {
    ggbApi.current = api
    setGGBLoaded(api !== null)
    if (api == null) return
  }, [])

  const ggb = ggbApi.current
  const [frame, setFrame] = useState(1)
  const [button, setButton] = useState(0)
  const [correctness, setCorrectness] = useState(0)
  const [activeRadio, setActiveRadio] = useState(0)
  const [clicked1, setClicked1] = useState(false)
  const [clicked2, setClicked2] = useState(false)
  const [clicked3, setClicked3] = useState(false)
  const [animationDone, setAnimationDone] = useState(false)
  const [nudgeOn, setNudgeOn] = useState(true)
  const [nudge2On, setNudge2On] = useState(true)

  const playMouseClick = useSFX('mouseClick')
  const selectedPoint =
    activeRadio == 1 ? (
      <>
        <P>2</P>,<O>-3</O>
      </>
    ) : activeRadio == 2 ? (
      <>
        <O>-3</O>,<P>-2</P>
      </>
    ) : activeRadio == 3 ? (
      <>
        <P>-2</P>,<O>3</O>
      </>
    ) : (
      <></>
    )
  useEffect(() => {
    if (ggbLoaded) {
      ggbApi.current?.registerObjectUpdateListener('sel', () => {
        setActiveRadio(ggb?.getValue('sel/90°') || 0)
      })

      ggbApi.current?.registerObjectUpdateListener('frame', () => {
        setFrame(ggb?.getValue('frame') || 0)
      })
      ggbApi.current?.registerObjectUpdateListener('button', () => {
        setButton(ggb?.getValue('button') || 0)
      })
      ggbApi.current?.registerObjectUpdateListener('cor', () => {
        setCorrectness(ggb?.getValue('cor') || 0)
      })
      ggbApi.current?.registerObjectUpdateListener('rot', () => {
        setAnimationDone((ggb?.getValue('rot') || 0) == 1)
      })

      return () => {
        ggbApi.current?.unregisterObjectUpdateListener('button')
        ggbApi.current?.unregisterObjectUpdateListener('frame')
        ggbApi.current?.unregisterObjectUpdateListener('cor')
        ggbApi.current?.unregisterObjectUpdateListener('sel')
      }
    }
  }, [ggbLoaded])
  function nextHandle() {
    playMouseClick()
    if (frame == 1) {
      if (activeRadio == 1) setClicked1(true)
      else if (activeRadio == 2) setClicked2(true)
      else if (activeRadio == 3) setClicked3(true)
    }
    ggb?.evalCommand('RunClickScript(next)')
  }
  function resetHandle() {
    playMouseClick()
    ggb?.evalCommand('RunClickScript(reset)')
    setClicked1(false)
    setClicked2(false)
    setClicked3(false)
  }
  function sliderChnageHandle(value: number) {
    ggb?.setValue('rotang', Math.PI * (value / 180))
    setNudge2On(false)
  }
  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#444',
        id: 'g08-gmc03-s1-gb01',
        onEvent,
        className,
        themeName: 'dark',
      }}
    >
      <TextHeader
        text="Explore the rotation of a point around the origin
        in a coordinate plane."
        backgroundColor="#F6F6F6"
        buttonColor="#1A1A1A"
      />
      <GGBcontainer materialId="harh2qzt" onApiReady={onGGBLoaded} width={983} height={670} />
      {frame == 1 && ggbLoaded && (
        <RadioHolder>
          <RadioButton
            disabled={clicked1 }
            active={activeRadio == 1}
            onClick={() => {
              if (!clicked1) {
                playMouseClick()
                ggb?.evalCommand('RunClickScript(op90)')
              }

              setNudgeOn(false)
            }}
            text="90&deg;"
          ></RadioButton>
          <RadioButton
            disabled={clicked2 }
            active={activeRadio == 2}
            onClick={() => {
              if (!clicked2) {
                playMouseClick()
                ggb?.evalCommand('RunClickScript(op180)')
              }
              setNudgeOn(false)
            }}
            text="180&deg;"
          ></RadioButton>
          <RadioButton
            disabled={clicked3 }
            active={activeRadio == 3}
            onClick={() => {
              if (!clicked3) {
                playMouseClick()
                ggb?.evalCommand('RunClickScript(op270)')
              }

              setNudgeOn(false)
            }}
            text="270&deg;"
          ></RadioButton>
        </RadioHolder>
      )}
      {frame == 3 && (
        <Slider
          label="Counter-clockwise Direction"
          min={0}
          max={360}
          step={90}
          onChange={sliderChnageHandle}
          onChangeComplete={() => {
            ggb?.evalCommand('RunClickScript(button1)')
          }}
        />
      )}
      {button == 0 && ggbLoaded && <CTAButton draggable={false} src={nextButtonInactive} />}
      {button == 1 && (
        <CTAButton
          draggable={false}
          className="active"
          src={nextButtonActive}
          onClick={nextHandle}
        />
      )}
      {button == 2 && (
        <CTAButton draggable={false} className="active" src={retryButton} onClick={resetHandle} />
      )}

      {/* feedbacks */}
      {frame == 1 && ggbLoaded && (
        <Feedback>
          Select an angle to rotate the point
          <br />
          around the origin in clockwise direction.
        </Feedback>
      )}
      {frame == 2 && activeRadio == 1 && animationDone && (
        <Feedback>
          Notice that the rotation of (<O>3</O>,<P>2</P>) <StyledBlue> 90° clockwise </StyledBlue>
          <br />
          results in interchange of the x and y coordinates along with <br />
          change of sign in the new y-coordinate: ({selectedPoint}).{' '}
        </Feedback>
      )}
      {frame == 2 && activeRadio == 2 && animationDone && (
        <Feedback>
          Notice that the rotation of (<O>3</O>,<P>2</P>) <StyledBlue> 180° clockwise </StyledBlue>
          <br />
          results in change in sign for both the coordinates: ({selectedPoint}).{' '}
        </Feedback>
      )}
      {frame == 2 && activeRadio == 3 && animationDone && (
        <Feedback>
          Notice that the rotation of (<O>3</O>,<P>2</P>) <StyledBlue> 270° clockwise </StyledBlue>
          <br />
          results in interchange of the x and y coordinates along with <br />
          change of sign in the new x-coordinate: ({selectedPoint}).{' '}
        </Feedback>
      )}
      {frame == 3 && correctness == 0 && (
        <Feedback>
          Rotate the pointer around the origin in <br />
          counter-clockwise direction to match the coordinate ({selectedPoint}).
        </Feedback>
      )}
      {frame == 3 && correctness == 2 && (
        <Feedback>
          The result of <StyledPurple> {(4 - activeRadio) * 90}° counter-clockwise </StyledPurple>{' '}
          rotation
          <br />
          is the same as <StyledBlue> {activeRadio * 90}° clockwise </StyledBlue>
        </Feedback>
      )}
      {frame == 3 && correctness == 1 && (
        <Feedback>
          The selected angle is <B>not correct</B>.
        </Feedback>
      )}
      {frame == 1 && ggbLoaded && nudgeOn && <NudgePlayer click src={click} autoplay loop />}
      {frame == 3 && nudge2On && <NudgePlayer click={false} src={moveRight} autoplay loop />}
    </AppletContainer>
  )
}

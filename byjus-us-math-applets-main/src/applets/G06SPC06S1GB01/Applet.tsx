import { Player } from '@lottiefiles/react-lottie-player'
import { FC, useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { click, moveHorizontally } from '@/assets/onboarding'
import { AppletContainer } from '@/common/AppletContainer'
import { Geogebra } from '@/common/Geogebra'
import { GeogebraAppApi } from '@/common/Geogebra/Geogebra.types'
import { TextHeader } from '@/common/Header'
import { AppletInteractionCallback } from '@/contexts/analytics'
import { useSFX } from '@/hooks/useSFX'

import next from './assets/next.svg'
import reset from './assets/reset.svg'
import submit from './assets/submit.svg'
import submitInactive from './assets/submitInactive.svg'
import { Dropdown } from './dropdownComponent/Dropdown'

const GGBcontainer = styled(Geogebra)`
  top: 80px;
  position: absolute;
  left: 50%;
  translate: -50%;
  scale: 0.93;
`
const CTAButton = styled.img<{ active?: boolean }>`
  position: absolute;
  left: 50%;
  translate: -50%;
  bottom: 15px;
  cursor: ${(p) => (p.active ? 'pointer' : 'default')};
`
const NudgePlayer = styled(Player)<{ left: number; top: number }>`
  position: absolute;
  left: ${(p) => p.left}px;
  top: ${(p) => p.top}px;
  pointer-events: none;
  z-index: 3;
`
const Feedback = styled.div`
  position: absolute;
  top: 580px;
  translate: 0 -50%;
  text-align: center;
  width: 100%;
  font-size: 20px;
  font-weight: 700;
  font-family: 'Nunito';
  color: #444;
`
const DDcontainer = styled.div`
  position: absolute;
  top: 640px;
  width: 90%;
  left: 50%;
  translate: -50%;
  font-size: 20px;
  font-weight: 700;
  font-family: 'Nunito';
  color: #444;
  text-align: center;
  height: 70px;
  line-height: 70px;
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
export const AppletG06SPC06S1GB01: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const [ggbLoaded, setGGBLoaded] = useState(false)
  const ggbApi = useRef<GeogebraAppApi | null>(null)
  const onGGBLoaded = useCallback((api: GeogebraAppApi | null) => {
    ggbApi.current = api
    setGGBLoaded(api !== null)
    ggbApi.current?.registerClientListener((e: any) => {
      if (e.type === 'mouseDown' && e.hits[0] === 'c') {
        playMouseIn()
        setNudgeOn1(false)
      } else if (e.type === 'dragEnd' && e.target === 'c') {
        playMouseOut()
        setNudgeOn2(true)
      }
    })
  }, [])
  const ggb = ggbApi.current
  const [button, setButton] = useState(0)
  const [frame, setFrame] = useState(1)
  const [index1, setIndex1] = useState(-1)
  const [index2, setIndex2] = useState(-1)
  const [status1,setStatus1]=useState<'default'|'correct'|'incorrect'>('default')
  const [status2,setStatus2]=useState<'default'|'correct'|'incorrect'>('default')
  const [nudgeOn1, setNudgeOn1] = useState(true)
  const [nudgeOn2, setNudgeOn2] = useState(false)
  const [stateOfCorrectness,setStateOfCorrectness]=useState(0)
  const playMouseClick = useSFX('mouseClick')
  const playMouseIn = useSFX('mouseIn')
  const playMouseOut = useSFX('mouseOut')
  const playCorrect = useSFX('correct')
  const playincorrect = useSFX('incorrect')
  const correct=(frame==1&&index1==0&&index2==0)||frame==2&&index1==1&&index2==0
  useEffect(()=>{
    if(index1>=0&&index2>=0){
      setButton(1)
    }
  },[index1,index2])
  function onSubmit() {
    if(frame==1 && index1==0 || frame == 2 && index1==1) setStatus1('correct')
    else setStatus1('incorrect')
    if(index2==0) setStatus2('correct')
    else setStatus2('incorrect')
    if(correct){
      setStateOfCorrectness(1)
      playCorrect()
      setButton(2)
    }
    else{
      setButton(0)
      setStateOfCorrectness(-1)
      playincorrect()
    }
  }
  function onNext() {
    playMouseClick()
    ggb?.evalCommand("SetValue(question,2)\nSetValue(P,P2)")
    setStatus1('default')
    setStatus2('default')
    setIndex1(-1)
    setIndex2(-1)
    setButton(0)
    setFrame(2)

  }
  function onReset() {
    playMouseClick()
    ggb?.evalCommand("SetValue(question,1)\nSetValue(P,P2)")
    setStatus1('default')
    setStatus2('default')
    setIndex1(-1)
    setIndex2(-1)
    setButton(0)
    setFrame(1)
    setNudgeOn1(true)
  }
  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#aaa',
        id: 'g06-spc06-s1-gb01',
        onEvent,
        className,
        themeName: 'dark',
      }}
    >
      <TextHeader
        text="Determine the effect of data distribution on mean and median."
        backgroundColor="#F6F6F6"
        buttonColor="#1A1A1A"
      />
      <GGBcontainer materialId="skzgpx7v" onApiReady={onGGBLoaded} width={753} height={484} />
      {ggbLoaded && stateOfCorrectness>=0 && <Feedback>
        What is the impact on these measures when <br />
        the <Blue> {frame==1?'symmetric':'skewed'} </Blue> distribution is altered?
      </Feedback>}

      {stateOfCorrectness==-1 && <Feedback>
        Oops! Try changing the distribution again to see the impact.
      </Feedback>}
      {ggbLoaded && <DDcontainer>
        Mean :&nbsp;
        <Dropdown
          dropDownArray={["doesn't change", 'changes']}
          position="top"
          listOrientation="vertical"
          value={index1}
          onValueChange={(value) => {
            setIndex1(value)
            setStatus1('default')
            setStateOfCorrectness(0)
            playMouseClick()
          }}
          onClickFunc={() => {setNudgeOn2(false)}}
          checkStatus={status1}
        />
        &nbsp;&nbsp;&nbsp;&nbsp;Median :&nbsp;
        <Dropdown
          dropDownArray={["doesn't change", 'changes']}
          position="top"
          value={index2}
          listOrientation="vertical"
          onValueChange={(value) => {
            setIndex2(value)
            setStatus2('default')
            setStateOfCorrectness(0)
            playMouseClick()
          }}
          onClickFunc={() => {setNudgeOn2(false)}}
          checkStatus={status2}
        />
      </DDcontainer>}
      {ggbLoaded && button == 0 && <CTAButton draggable={false} src={submitInactive} />}
      {button == 1 && <CTAButton active draggable={false} src={submit} onClick={onSubmit} />}
      {button == 2 && frame==1 && <CTAButton active draggable={false} src={next} onClick={onNext} />}
      {button == 2 && frame==2 && <CTAButton active draggable={false} src={reset} onClick={onReset} />}
      {nudgeOn2 && frame==1 && <NudgePlayer src={click} left={160} top={620} autoplay loop/>}
      {ggbLoaded && nudgeOn1 && <NudgePlayer src={moveHorizontally} left={160} top={460} autoplay loop/>}
    </AppletContainer>
  )
}

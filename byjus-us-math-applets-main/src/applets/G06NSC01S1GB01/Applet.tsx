import { Player } from '@lottiefiles/react-lottie-player'
import { FC, useCallback, useContext, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { AppletContainer } from '@/common/AppletContainer'
import { TextHeader } from '@/common/Header'
import { AnalyticsContext, AppletInteractionCallback } from '@/contexts/analytics'
import { useSFX } from '@/hooks/useSFX'

import handClick from '../../common/handAnimations/click.json'
import fourBy1 from './assets/4Divisionby1.mp4'
import fourBy2 from './assets/4Divisionby2.mp4'
import fourBy4 from './assets/4Divisionby4.mp4'
import sixBy1 from './assets/6Divisionby1.mp4'
import sixBy2 from './assets/6Divisionby2.mp4'
import sixBy3 from './assets/6Divisionby3.mp4'
import sixBy6 from './assets/6Divisionby6.mp4'
import eightBy1 from './assets/8Divisionby1.mp4'
import eightBy2 from './assets/8Divisionby2.mp4'
import eightBy4 from './assets/8Divisionby4.mp4'
import eightBy8 from './assets/8Divisionby8.mp4'
import nineBy1 from './assets/9Divisionby1.mp4'
import nineBy3 from './assets/9Divisionby3.mp4'
import nineBy9 from './assets/9Divisionby9.mp4'
import tenBy1 from './assets/10Divisionby1.mp4'
import tenBy2 from './assets/10Divisionby2.mp4'
import tenBy5 from './assets/10Divisionby5.mp4'
import tenBy10 from './assets/10Divisionby10.mp4'
import tryNew from './assets/tryNew.svg'
import { Dropdown } from './Dropdown/Dropdown'

const YellowBG = styled.div`
  width: 680px;
  height: 520px;
  background: #fff6db;
  border-radius: 12px;
  position: absolute;
  left: 50%;
  translate: -50%;
  top: 90px;
  overflow: hidden;
`
const HandPlayer = styled(Player)`
  position: absolute;
  left: 50%;
  translate: -50%;
  top: 700px;
  pointer-events: none;
`
const AnimContainer = styled.video`
  position: absolute;
  width: 680px;
  height: 520px;
  left: 50%;
  translate: -50%;
`
const TextContainer = styled.div`
  width: 625px;
  height: 60px;
  position: absolute;
  left: 50%;
  translate: -50%;
  top: 230px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 10px;
`
const Text = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 400;
  font-size: 24px;
  line-height: 32px;
  height: 60px;
  width: fit-content;
  text-align: center;
  color: #444444;
`
const NextBtn = styled.button`
  position: absolute;
  left: 50%;
  translate: -50%;
  bottom: 20px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 16px 24px;
  gap: 8px;
  width: 102px;
  height: 60px;
  background: #1a1a1a;
  border-radius: 10px;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 24px;
  line-height: 32px;
  text-align: center;
  color: #ffffff;
  cursor: pointer;
`
const TryNewBtn = styled.button`
  position: absolute;
  left: 50%;
  translate: -50%;
  bottom: 20px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 16px 24px;
  gap: 12px;
  width: 174px;
  height: 60px;
  background: #ffffff;
  border: 2px solid #1a1a1a;
  border-radius: 10px;
  cursor: pointer;
`
const HelperText = styled.div`
  position: absolute;
  left: 50%;
  translate: -50%;
  top: 610px;
  padding: 16px 24px;
  gap: 12px;
  width: 700px;
  p {
    margin: 5px 0;
    font-family: 'Nunito';
    font-style: normal;
    font-weight: 700;
    font-size: 20px;
    line-height: 28px;
    text-align: center;
    color: #444444;
    span {
      background: #f4e5ff;
      border-radius: 5px;
      color: #aa5ee0;
      padding: 5px;
    }
  }
`
const White = styled.div`
  position: absolute;
  left: 506px;
  top: 324px;
  width: 50px;
  height: 50px;
  background-color: #fff;
`
const options = [
  [],
  [],
  [],
  [],
  [1, 2, 4],
  [],
  [1, 2, 3, 6],
  [],
  [1, 2, 4, 8],
  [1, 3, 9],
  [1, 2, 5, 10],
]
const divisions = [
  [''],
  [''],
  [''],
  [''],
  ['', fourBy1, fourBy2, '', fourBy4],
  [''],
  ['', sixBy1, sixBy2, sixBy3, '', '', sixBy6],
  [''],
  ['', eightBy1, eightBy2, '', eightBy4, '', '', '', eightBy8],
  ['', nineBy1, '', nineBy3, '', '', '', '', '', nineBy9],
  ['', tenBy1, tenBy2, '', '', tenBy5, '', '', '', '', tenBy10],
]
export const AppletG06NSC01S1GB01: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const playerRef = useRef<HTMLVideoElement>(null)
  const [value1, setvalue1] = useState(0)
  const [value2, setvalue2] = useState(0)
  const [ddKey, setDDKey] = useState(0)
  const [page, setPage] = useState(0)
  const [clearVal, setClearVal] = useState(false)
  const [disableOptions, setDisableOptions] = useState(true)
  const [showTryNew, setShowTryNew] = useState(false)
  const onInteraction = useContext(AnalyticsContext)
  const playClick = useSFX('mouseClick')
  const onOptions1Handle = useCallback(
    (value: number) => {
      onInteraction('tap')
      playClick()
      setvalue1(value)
      setvalue2(0)
      setDisableOptions(false)
      setClearVal(true)
    },
    [onInteraction, playClick],
  )
  const onOptions2Handle = useCallback(
    (value: number) => {
      onInteraction('tap')
      playClick()
      setvalue2(value)
      setClearVal(false)
    },
    [onInteraction, playClick],
  )
  useEffect(() => {
    if (page == 0) {
      setvalue1(0)
      setvalue2(0)
      setDisableOptions(true)
      setDDKey((d) => d + 1)
      setShowTryNew(false)
      if (playerRef.current == null) return
      playerRef.current.removeEventListener('ended', showingTryNew)
    } else {
      if (playerRef.current == null) return
      playerRef.current.addEventListener('ended', showingTryNew)
    }
  }, [page])
  const showingTryNew = () => {
    setShowTryNew(true)
  }
  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#F6F6F6',
        id: 'g06-nsc01-s1-gb01',
        onEvent,
        className,
      }}
    >
      <TextHeader
        text="Visual representation of division."
        backgroundColor="#F6F6F6"
        buttonColor="#1A1A1A"
      />
      <YellowBG>
        {page == 0 && (
          <TextContainer>
            <Text>Divide</Text>
            <Dropdown
              dropDownArray={[4, 6, 8, 9, 10]}
              onValueChange={onOptions1Handle}
              key={ddKey}
            />
            <Text>into groups containing</Text>
            <Dropdown
              dropDownArray={options[value1]}
              onValueChange={onOptions2Handle}
              disabled={disableOptions}
              key={ddKey + 1}
            />
            <Text>each.</Text>
          </TextContainer>
        )}
        {page == 1 && <AnimContainer src={divisions[value1][value2]} ref={playerRef} autoPlay />}
      </YellowBG>
      {clearVal && <White />}
      <HelperText>
        {value1 == 0 && value2 == 0 && <p>Choose a number to divide.</p>}
        {value1 > 0 && value2 == 0 && <p>Choose a number for grouping.</p>}
        {page == 0 && value2 > 0 && (
          <p>Great! Proceed to see visual representation of this division statement.</p>
        )}
        {page == 1 && showTryNew && (
          <p>
            {value1} &divide; {value2} = {value1 / value2}
          </p>
        )}
        {page == 1 && showTryNew && (
          <p>
            Number in each group = <span>{value2}</span> , Total number of groups ={' '}
            {value1 / value2}
          </p>
        )}
      </HelperText>
      {value1 > 0 && value2 > 0 && page == 0 && (
        <>
          <NextBtn
            onClick={() => {
              setPage(1)
              onInteraction('tap')
              playClick()
            }}
          >
            Next
          </NextBtn>
          <HandPlayer src={handClick} autoplay loop />
        </>
      )}
      {page == 1 && showTryNew && (
        <TryNewBtn
          onClick={() => {
            setPage(0)
            onInteraction('tap')
            playClick()
          }}
        >
          <img src={tryNew} />
        </TryNewBtn>
      )}
    </AppletContainer>
  )
}

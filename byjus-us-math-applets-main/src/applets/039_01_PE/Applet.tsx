import { Player } from '@lottiefiles/react-lottie-player'
import { check } from 'prettier'
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { AppletContainer } from '../../common/AppletContainer'
import { Geogebra } from '../../common/Geogebra'
import { GeogebraAppApi } from '../../common/Geogebra/Geogebra.types'
import Animation from '../../common/handAnimations/clickAndDrag.json'
import { Header } from '../../common/Header'
import { AnalyticsContext, AppletInteractionCallback } from '../../contexts/analytics'
import cross from './images/cross.png'
import disclaimer from './images/disclaimer.png'
import tryNew from './images/tryNew.svg'
import blast from './lottieAnimations/blast.json'

const PopUpBG = styled.div`
  position: absolute;
  width: 100%;
  height: 98%;
  background: rgba(0, 0, 0, 0.3);
  top: 0px;
  z-index: 1;
  border-radius: 20px;
`

const PopUpBG2 = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  top: 0px;
  z-index: 1;
  border-radius: 20px;
`
const PopUp = styled.div`
  position: absolute;
  width: 100%;
  height: -moz-fit-content;
  height: -webkit-fit-content;
  height: -fit-content;
  background-color: #ffffff;
  bottom: -2px;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`
const Cross = styled.img`
  position: absolute;
  top: -11px;
  right: 23px;
  cursor: pointer;
`
const Disclaimer = styled.img`
  position: absolute;
  top: 0px;
  left: 0px;
  display: block;
`
const PopText = styled.div`
  width: 85%;
  margin: 80px 0;
  p {
    margin: 0;
    font-family: 'Nunito';
    font-style: normal;
    font-weight: 400;
    font-size: 20px;
    line-height: 28px;
    text-align: center;
    color: #444444;
  }
`

const PlacedGeoGebra = styled(Geogebra)`
  position: absolute;
  top: 100px;
  left: 50%;
  translate: -50%;
`

const Text = styled.p`
  color: #444;
  font-family: 'Nunito', sans-serif;
  font-size: 20px;
  font-weight: 700;
  margin: 0;
  max-width: 600px;
  text-align: center !important;
`

const Button = styled.button`
  position: absolute;
  width: 160px;
  height: 60px;
  left: 50%;
  translate: -50%;
  bottom: 32px;
  border: none;
  background: #8c69ff;
  border-radius: 10px;
  cursor: pointer;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 500;
  font-size: 24px;
  line-height: 42px;
  text-align: center;
  color: #ffffff;
  align-items: center;
  display: flex;
  justify-content: center;
  &:disabled {
    cursor: default;
    opacity: 0.2;
  }
  &:hover {
    background: #7f5cf4;
  }
  &:active {
    background: #6549c2;
  }
`

const PlayerContainer = styled(Player)<{ top: number; left: number }>`
  position: absolute;
  left: ${(props) => props.left}px;
  top: 60px;
  padding-top: ${(props) => props.top}px;
  pointer-events: none;
`

export const Applet03901Pe: React.FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const [areaValue, setAreaValue] = useState(0)
  const [playerArea, setPlayerArea] = useState(9)
  const ggbApi = useRef<GeogebraAppApi | null>(null)
  const [ggbLoaded, setGgbloaded] = useState(false)
  const [popupOpen, setPopupOpen] = useState(false)
  const [showAnimation, setShowAnimation] = useState(false)
  const [showTryNew, setShowTryNew] = useState(false)
  const onInteraction = useContext(AnalyticsContext)

  useEffect(() => {
    setAreaValue(randomNumberInRange(3, 25))
  }, [])

  const randomNumberInRange = (min: number, max: number) => {
    const ans = Math.floor(Math.random() * (max - min + 1)) + min

    if (ans == 13 || ans == 17 || ans == 19 || ans == 23) {
      return ans - 1
    }
    return ans
  }
  const ObjectUpdate = () => {
    if (ggbApi.current == null) return
    setShowAnimation(false)
    onInteraction('drag')
    const pXcoord = ggbApi.current.getXcoord('P')
    const pYcoord = ggbApi.current.getYcoord('P')
    const nXcoord = ggbApi.current.getXcoord('N')
    const nYcoord = ggbApi.current.getYcoord('N')

    const area = Number(Math.abs(pXcoord - nXcoord) * Math.abs(pYcoord - nYcoord))
    setPlayerArea(area)
  }

  const GGBLoaded = useCallback((api: GeogebraAppApi | null) => {
    ggbApi.current = api
    if (ggbApi.current == null) return
    setGgbloaded(api != null)
    ggbApi.current?.setValue('area', areaValue)
    setShowAnimation(true)

    ggbApi.current?.registerObjectUpdateListener('M', ObjectUpdate)
    ggbApi.current?.registerObjectUpdateListener('N', ObjectUpdate)
    ggbApi.current?.registerObjectUpdateListener('O', ObjectUpdate)
    ggbApi.current?.registerObjectUpdateListener('P', ObjectUpdate)
  }, [])

  const onClickCheck = () => {
    onInteraction('tap')
    if (playerArea == areaValue) {
      ggbApi.current?.setValue('Boolean', 1)
      setShowTryNew(true)
    } else {
      setPopupOpen(true)
    }
  }

  const onTryNewHandle = () => {
    onInteraction('tap')
    setShowTryNew(false)
    ggbApi.current?.setValue('Boolean', 0)

    const value = areaValue
    let newValue = randomNumberInRange(3, 25)
    while (newValue == value) {
      newValue = randomNumberInRange(3, 25)
    }
    setAreaValue(newValue)
  }
  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#444',
        id: '039_01_PE',
        onEvent,
        className,
      }}
    >
      {/* <TextHeader text={HeaderText()} backgroundColor={'#FAF2FF'} buttonColor={'#FAF2FF'} /> */}
      <Header backgroundColor={'#FAF2FF'} buttonColor={'#FAF2FF'}>
        <Text>
          Create a rectangle covering
          <span style={{ color: '#C882FA' }}> {areaValue} square units </span>
          area.
        </Text>
      </Header>
      <PlacedGeoGebra
        materialId={'mwru4qm9'}
        onApiReady={GGBLoaded}
        pointToTrack={'N'}
        showOnBoarding={showAnimation}
        onboardingAnimationSrc={Animation}
      />
      {ggbLoaded && (
        <Button
          style={{
            height: '60px',
            width: '160px',
            fontSize: '24px',
            lineHeight: '24px',
            bottom: '50px',
          }}
          onClick={onClickCheck}
        >
          Check
        </Button>
      )}

      {popupOpen && (
        <PopUpBG>
          <PopUp>
            <Disclaimer src={disclaimer} />
            <Cross
              src={cross}
              onClick={() => {
                onInteraction('tap')
                setPopupOpen(false)
              }}
            />
            <PopText>
              <p>
                There are <b>{playerArea} squares</b> in the rectangular boundary created by you.
                Area of rectangle is equal to the number of unit squares covered.
              </p>
            </PopText>
            <Button
              style={{
                height: '40px',
                width: '100px',
                fontSize: '16px',
                lineHeight: '24px',
                bottom: '0px',
              }}
              onClick={() => {
                onInteraction('tap')
                setPopupOpen(false)
              }}
            >
              Got it
            </Button>
          </PopUp>
        </PopUpBG>
      )}
      {showTryNew && (
        <PopUpBG2>
          <PlayerContainer top={20} left={100} src={blast} autoplay loop />
          <Button
            style={{
              height: '60px',
              width: '160px',
              lineHeight: '24px',
              bottom: '50px',
            }}
            onClick={onTryNewHandle}
          >
            <img src={tryNew} />
          </Button>
        </PopUpBG2>
      )}
    </AppletContainer>
  )
}

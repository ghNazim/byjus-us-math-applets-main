import { Player } from '@lottiefiles/react-lottie-player'
import React, { useCallback, useEffect, useReducer, useRef, useState } from 'react'
import styled from 'styled-components'

import { PrimaryRangeSlider } from '@/atoms/RangeSlider'
import { useSFX } from '@/hooks/useSFX'

import { AppletContainer } from '../../common/AppletContainer'
import { Geogebra } from '../../common/Geogebra'
import { GeogebraAppApi } from '../../common/Geogebra/Geogebra.types'
import clickAnim from '../../common/handAnimations/click.json'
import HandAnimation from '../../common/handAnimations/moveRight.json'
import { TextHeader } from '../../common/Header'
import { AppletInteractionCallback } from '../../contexts/analytics'
import icon3d from './Icon3d.svg'

const StyledGeogebra = styled(Geogebra)`
  scale: 1.2;
  /* height: 750px; */
`

const ButtonHolder = styled.div`
  position: absolute;
  top: 680px;
  left: 40px;
`

const StyledButton = styled.button`
  position: absolute;
  width: 150px;
  height: 53px;
  border-radius: 10px;
  border-width: 1px;
  background-color: ${(props) => (props.color === '#8c69ff' ? 'white' : '#7f5cf4') || 'white'};
  border-color: #7f5cf4;
  color: ${(props) => props.color || '#7f5cf4'};
  cursor: pointer;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
`
const GGBHolder = styled.div`
  overflow: hidden;
  position: absolute;
  width: 580px;
  height: 450px;
  display: flex;
  justify-content: center;
  align-items: center;
  left: 74px;
  top: 150px;
  border: 1px solid #8c69ff;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`

const HandAnimHolder = styled(Player)`
  position: absolute;
  top: 660px;
  left: 90px;
  scale: 80%;
  pointer-events: none;
  z-index: 12;
`

const SliderLabel = styled.div`
  /* position: absolute; */
  width: 105px;
  width: 100%;
  text-align: center;
  height: 28px;
  /* left: 110px;
  top: 557px; */

  font-family: 'Nunito';
  font-style: normal;
  font-weight: 400;
  font-size: 19px;
  line-height: 28px;

  text-align: center;

  color: #6549c2;
  z-index: 5;
`

const MoveRightHandAnim = styled.div`
  position: absolute;
  bottom: 120px;
  left: 35px;
`

const SliderContainer = styled.div`
  /* position: absolute; */
  /* top: 560px; */
  /* left: 245px; */
  margin: 0 auto;
  width: 291.71px;
  height: 30px;
`

interface Type {
  typeName: string
  x: number
  y: number
}

const TypeHolder: Type[] = [
  { typeName: 'Unselected', x: 0, y: 0 },
  { typeName: 'Parallel', x: -0.2, y: 4.5 },
  { typeName: 'Perpendicular', x: -2.4, y: 3 },
  { typeName: 'Atanangle', x: -1.2, y: 3.2 },
]

export const Applet5002Ge: React.FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const [ggbLoaded, setGgbLoaded] = useState(false)
  const ggbApi = useRef<GeogebraAppApi | null>(null)

  const [selected, dispatch] = useReducer(reducer, { id: 0 })
  const [onboarded, setOnboarded] = useState(false)
  const [moveValue, setMoveValue] = useState(0)
  const playClickSound = useSFX('mouseClick')
  const playMouseOut = useSFX('mouseOut')
  const playMouseIn = useSFX('mouseIn')

  function reducer(selected: { id: number }, action: { type: string }) {
    return { id: TypeHolder.findIndex((type) => type.typeName === action.type) }
  }

  const onGGBLoaded = useCallback((api: GeogebraAppApi | null) => {
    setGgbLoaded(true)
    ggbApi.current = api
  }, [])

  const onSliderChange = (value: number) => {
    setMoveValue(value)
    if (!onboarded) setOnboarded(true)
  }

  const onViewdirectionHandle = () => {
    if (ggbApi.current) {
      ggbApi.current.evalCommand('SetViewDirection()') // Vector((-0.8, 0, 0.1))
    }
  }

  useEffect(() => {
    if (ggbApi.current) {
      const { typeName, x, y } = TypeHolder[selected.id]
      ggbApi.current.setValue(typeName, x + ((y - x) * moveValue) / 100)
    }
  }, [moveValue, selected.id])

  useEffect(() => {
    setMoveValue(0)
  }, [selected.id])

  useEffect(() => {
    if (ggbApi.current) {
      ggbApi.current.setValue('Option', selected.id)
    }
    playClickSound()
  }, [playClickSound, selected])

  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#FAF2FF',
        id: '50_02_GE',
        onEvent,
        className,
      }}
    >
      <TextHeader
        text="Move the plane to slice the cube at different positions to observe different types of cross&nbsp;sections."
        backgroundColor="#FAF2FF"
        buttonColor="#EACCFF"
      />
      {ggbLoaded && selected.id === 0 ? <HandAnimHolder src={clickAnim} loop autoplay /> : null}
      {ggbLoaded ? (
        <img
          src={icon3d}
          style={{
            width: '50px',
            position: 'absolute',
            top: '176px',
            right: '90px',
            zIndex: 5,
            cursor: 'pointer',
          }}
          onClick={onViewdirectionHandle}
        />
      ) : null}
      <GGBHolder>
        <StyledGeogebra materialId="wud7zsf3" onApiReady={onGGBLoaded} />
      </GGBHolder>

      {ggbLoaded ? (
        <ButtonHolder>
          <StyledButton
            color={selected.id === 2 ? 'white' : '#8c69ff'}
            style={{ left: '50px' }}
            onClick={() => {
              dispatch({ type: 'Perpendicular' })
            }}
          >
            Perpendicular
          </StyledButton>
          <StyledButton
            color={selected.id === 1 ? 'white' : '#8c69ff'}
            style={{ left: '250px' }}
            onClick={() => {
              dispatch({ type: 'Parallel' })
            }}
          >
            Parallel
          </StyledButton>
          <StyledButton
            color={selected.id === 3 ? 'white' : '#8c69ff'}
            style={{ left: '450px' }}
            onClick={() => {
              dispatch({ type: 'Atanangle' })
            }}
          >
            At an angle
          </StyledButton>
        </ButtonHolder>
      ) : null}
      {ggbLoaded && selected.id !== 0 ? (
        <>
          {!onboarded && (
            <MoveRightHandAnim>
              <Player src={HandAnimation} autoplay loop />
            </MoveRightHandAnim>
          )}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              position: 'absolute',
              top: '530px',
              justifyContent: 'center',
              alignContent: 'center',
              width: '100%',
            }}
          >
            <SliderContainer>
              <PrimaryRangeSlider
                defaultValue={0}
                value={moveValue}
                onChange={onSliderChange}
                onChangeBegin={() => playMouseIn()}
                onChangeComplete={() => playMouseOut()}
              />
            </SliderContainer>
            <SliderLabel>Move plane</SliderLabel>{' '}
          </div>
        </>
      ) : null}
    </AppletContainer>
  )
}

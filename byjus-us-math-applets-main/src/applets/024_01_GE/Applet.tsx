import { Player } from '@lottiefiles/react-lottie-player'
import React, { useContext, useRef, useState } from 'react'
import styled from 'styled-components'

import { useSFX } from '@/hooks/useSFX'

import { RangeSlider } from '../../atoms/RangeSlider'
import { AppletContainer } from '../../common/AppletContainer'
import moveVerticallyAnim from '../../common/handAnimations/moveUp.json'
import { TextHeader } from '../../common/Header'
import { Math as Latex } from '../../common/Math'
import { AnalyticsContext, AppletInteractionCallback } from '../../contexts/analytics'
import Animation3D from './assets/animation3D.json'
import { ThumbIcon } from './ThumbIcon'

const US_DENOMINATOR = 29.57
const UK_DENOMINATOR = 28.41

const SliderContainer = styled.div`
  position: absolute;
  top: 212px;
  left: 555px;
  height: 300px;
`
const PlacedPlayer = styled(Player)`
  position: absolute;
  top: 45px;
  left: 45px;
`

const StyledTextML = styled.div`
  color: #646464;
  position: absolute;
  margin: 0px;
  width: 129px;
  left: 76px;
  top: 592px;

  font-family: Nunito;
  font-size: 20px;
  font-weight: 700;
  line-height: 28px;
  letter-spacing: 0px;
  text-align: center;

  .katex .mathdefault,
  .katex .mathnormal,
  .katex .mord {
    font-family: 'Nunito', sans-serif !important;
  }
`

const StyledTextUS = styled.div`
  color: #646464;
  position: absolute;
  width: 195px;
  left: 235px;
  top: 568px;

  font-family: Nunito;
  font-size: 20px;
  font-weight: 700;
  line-height: 28px;
  letter-spacing: 0px;

  .katex .mathdefault,
  .katex .mathnormal,
  .katex .mord {
    font-family: 'Nunito', sans-serif !important;
  }
`

const StyledTextUSdash = styled.div`
  color: #646464;
  position: absolute;
  width: 195px;
  left: 235px;
  top: 593px;

  font-family: Nunito;
  font-size: 20px;
  font-weight: 700;
  line-height: 28px;
  letter-spacing: 0px;
  text-align: center;

  .katex .mathdefault,
  .katex .mathnormal,
  .katex .mord {
    font-family: 'Nunito', sans-serif !important;
  }
`
const StyledTextUK = styled.div`
  color: #646464;
  position: absolute;
  width: 186px;
  left: 460px;
  top: 568px;

  font-family: Nunito;
  font-size: 20px;
  font-weight: 700;
  line-height: 28px;
  letter-spacing: 0px;
  text-align: left;

  .katex .mathdefault,
  .katex .mathnormal,
  .katex .mord {
    font-family: 'Nunito', sans-serif !important;
  }
`
const StyledTextUKdash = styled.div`
  color: #646464;
  position: absolute;
  width: 186px;
  left: 535px;
  top: 593px;

  font-family: Nunito;
  font-size: 20px;
  font-weight: 700;
  line-height: 28px;
  letter-spacing: 0px;
  text-align: left;

  .katex .mathdefault,
  .katex .mathnormal,
  .katex .mord {
    font-family: 'Nunito', sans-serif !important;
  }
`
const VerticalHandDiv = styled(Player)`
  position: absolute;
  width: 100px;
  top: 380px;
  left: 550px;
  pointer-events: none;
`

export const Applet02401Ge: React.FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const playerRef = useRef<Player>(null)
  const [mlValue, setmlValue] = useState(0)
  const onInteraction = useContext(AnalyticsContext)

  const onChangeHandle = (value: number) => {
    setBoardingAnim(false)
    onInteraction('slide')
    //const abc = Math.floor(value.value * (50 / 100))
    playerRef.current?.setSeeker(value + 1)
    setmlValue((value * 1000) / 100)
  }
  const playMouseIn = useSFX('mouseIn')
  const playMouseOut = useSFX('mouseOut')
  const [boardingAnim, setBoardingAnim] = useState(true)

  const usValue = mlValue / US_DENOMINATOR
  const ukValue = mlValue / UK_DENOMINATOR

  return (
    <AppletContainer
      {...{
        aspectRatio: 1,
        borderColor: '#E7FBFF',
        id: '028_02_GE',
        onEvent,
        className,
      }}
    >
      <TextHeader
        text={
          'Fill water in the jar and note the measurement of capacity across the given systems of measurement.'
        }
        backgroundColor={'#E7FBFF'}
        buttonColor={'#A6F0FF'}
      />
      <PlacedPlayer src={Animation3D} ref={playerRef} />
      <SliderContainer>
        <RangeSlider
          sliderColor={'#2AD3F5'}
          trackColor={'#2AD3F5'}
          customThumb={ThumbIcon}
          vertical
          onChange={onChangeHandle}
          onChangeBegin={() => playMouseIn()}
          onChangeComplete={() => playMouseOut()}
        />
      </SliderContainer>
      {boardingAnim && <VerticalHandDiv src={moveVerticallyAnim} loop autoplay />}

      {boardingAnim && <StyledTextML>--</StyledTextML>}
      {!boardingAnim && <StyledTextML>{mlValue}</StyledTextML>}
      {boardingAnim && <StyledTextUSdash>--</StyledTextUSdash>}
      {!boardingAnim && (
        <StyledTextUS>
          <Latex displayMode={true}>
            {String.raw`
          \frac{${mlValue}} {\textcolor{#7F5CF4}{${US_DENOMINATOR}}}={${usValue.toFixed(2)}}
        `}
          </Latex>
        </StyledTextUS>
      )}
      {boardingAnim && <StyledTextUKdash>--</StyledTextUKdash>}
      {!boardingAnim && (
        <StyledTextUK>
          <Latex displayMode={true}>
            {String.raw`
          \frac{${mlValue}} {\textcolor{#7F5CF4}{${UK_DENOMINATOR}}}={${ukValue.toFixed(2)}}
        `}
          </Latex>
        </StyledTextUK>
      )}
    </AppletContainer>
  )
}

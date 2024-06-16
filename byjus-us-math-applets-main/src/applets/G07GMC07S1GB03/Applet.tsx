import { Player } from '@lottiefiles/react-lottie-player'
import { FC, useCallback, useContext, useRef, useState } from 'react'
import styled, { ThemeProvider } from 'styled-components'

import { click } from '@/assets/onboarding'
import { AppletContainer } from '@/common/AppletContainer'
import { Geogebra } from '@/common/Geogebra'
import { GeogebraAppApi } from '@/common/Geogebra/Geogebra.types'
import { TextHeader } from '@/common/Header'
import { AnalyticsContext, AppletInteractionCallback } from '@/contexts/analytics'
import { useSFX } from '@/hooks/useSFX'
import { palette } from '@/themes'

import { RangeSlider } from '../../atoms/RangeSlider'
import text from './assets/bordercontainer.svg'
import handleimage from './assets/handle.svg'
import horizontalimage from './assets/hor.svg'
import p1 from './assets/pborder.jpg'
import cross from './assets/right.svg'
import pagetext from './assets/text0.svg'
import horizontalimageText from './assets/text1.svg'
import verticalimageText from './assets/text2.svg'
import verticalimageText2 from './assets/text3.svg'
import trackimage from './assets/track.svg'
import trackimageTwo from './assets/track2.svg'
import verticalimage from './assets/vert.svg'
import { ThumbIcon } from './ThumbIcon'
import { ThumbIconTwo } from './ThumbIcon2'

const CenteredGGBLeft = styled(Geogebra)`
  position: absolute;
  display: flex;
  justify-content: center;
  width: 350px;
  height: 350px;
  bottom: 280px;
  left: 25px;
  top: 150px;
  z-index: 1;
  margin-right: -1px;
  border: none;
`

const CenteredGGBRight1 = styled(Geogebra)`
  position: absolute;
  display: flex;
  justify-content: center;
  width: 240px;
  height: 240px;
  bottom: 360px;
  left: 412px;
  z-index: 0;
`
const CenteredGGBRight2 = styled(Geogebra)`
  position: absolute;
  display: flex;
  justify-content: center;
  width: 240px;
  height: 240px;
  bottom: 360px;
  left: 410px;
  z-index: 0;
`
const RadioDiv = styled.div<{ left: number; checked: boolean }>`
  box-sizing: border-box;
  padding: 2px;
  position: absolute;
  width: 220px;
  height: 60px;
  left: ${(props) => props.left}px;
  top: 690px;
  background: #ffffff;
  border: 1px solid ${(props) => (props.checked ? '#212121' : '#C7C7C7')};
  ${(props) =>
    props.checked
      ? ''
      : 'box-shadow: 0px 5px 0px #C7C7C7, inset 0px 2px 0px rgba(255, 255, 255, 0.2);'}
  border-radius: 12px;
  cursor: pointer;
`
const RadioInnerDiv = styled.div<{ checked: boolean }>`
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
  width: 100%;
  height: 100%;
  background: ${(props) => (props.checked ? '#C7C7C7' : '#ffffff')};
  border-radius: 8px;
  pointer-events: none;
`
const RadioLabel = styled.label`
  width: 120px;
  height: 28px;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;
  text-align: center;
  color: #444444;
  pointer-events: none;
`
const RadioButton = styled.div<{ checked: boolean }>`
  width: 20px;
  height: 22px;
  border: 2px solid #212121;
  border-radius: 50%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  span {
    width: 12px;
    height: 12px;
    background-color: #212121;
    border-radius: 50%;
    display: ${(props) => (props.checked ? 'block' : 'none')};
    pointer-events: none;
  }
`
const ColorText = styled.span<{ color: string }>`
  display: inline-block;
  color: ${(props) => props.color};
  margin: 0;
  pointer-events: none;
`

const RectangleBG = styled.div`
  position: absolute;
  width: 680px;
  height: 480px;
  flex-shrink: 0;
  left: 20px;
  top: 90px;
  background: var(--secondary-french-sky-blue-400, #f3f7fe);
  z-index: -1;
`
const ToggleText = styled.img`
  position: absolute;
  left: 52%;
  translate: -52%;
  bottom: 120px;
  z-index: 2;
`
const RightCrossView = styled.img`
  position: absolute;
  left: 85%;
  translate: -85%;
  bottom: 270px;
  z-index: 1;
`

const HorizontalImageView = styled.img`
  position: absolute;
  left: 80.75%;
  translate: -80.75%;
  bottom: 420px;
  z-index: 1;
`
const VerticalImageView = styled.img`
  position: absolute;
  left: 80.75%;
  translate: -80.75%;
  bottom: 362px;
  z-index: 1;
`
const FirstPageText = styled.img`
  position: absolute;
  width: 400px;
  left: 160px;
  bottom: 180px;
  z-index: 1;
  scale: 1;
`
const HorizontalImageViewText = styled.img`
  position: absolute;
  width: 400px;
  left: 160px;
  bottom: 180px;
  z-index: 1;
  scale: 1.4;
`
const VerticalImageViewText = styled.img`
  position: absolute;
  width: 400px;
  left: 160px;
  bottom: 180px;
  z-index: 1;
  scale: 1.4;
`

const VerticalImageViewText2 = styled.img`
  position: absolute;
  width: 400px;
  left: 160px;
  bottom: 160px;
  z-index: 1;
`
const Patch = styled.img`
  position: absolute;
  width: 410px;
  height: 50px;
  left: 18px;
  bottom: 260px;
  z-index: 1;
`
const Patch3 = styled.img`
  position: absolute;
  width: 250px;
  height: 20px;
  left: 430px;
  bottom: 330px;
  z-index: 1;
`
const Patch4 = styled.img`
  position: absolute;
  width: 10px;
  height: 300px;
  left: 665px;
  bottom: 350px;
  z-index: 1;
`
const Patch1 = styled.img`
  position: absolute;
  width: 10px;
  height: 60px;
  left: 413px;
  bottom: 300px;
  z-index: 1;
`
const Patch2 = styled.img`
  position: absolute;
  width: 10px;
  height: 80px;
  left: 413px;
  bottom: 605px;
  z-index: 1;
`
const RectangleToggle = styled.div`
  box-sizing: border-box;
  position: absolute;
  width: 500px;
  height: 95px;
  left: 115px;
  top: 670px;
  border: 1px solid #1a1a1a;
  border-radius: 10px;
  z-index: -1;
`
const SliderContainerVertical = styled.div`
  position: absolute;
  top: 290px;
  left: 100px;
  height: 120px;
  z-index: 1;
`
const SliderContainerHori = styled.div`
  position: absolute;
  top: 460px;
  left: 210px;
  left: 210px;
  width: 100px;
  z-index: 1;
`
const HandPlayer = styled(Player)`
  position: absolute;
  left: 140px;
  bottom: -10px;
  pointer-events: none;
  z-index: 1;
`

export const AppletG07GMC07S1GB03: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const [ggbLoadedLeft, setGGBLoadedLeft] = useState(false)
  const [ggbLoadedRight1, setGGBLoadedRight1] = useState(false)
  const [ggbLoadedRight2, setGGBLoadedRight2] = useState(false)
  const ggbApiLeft = useRef<GeogebraAppApi | null>(null)
  const ggbApiRight1 = useRef<GeogebraAppApi | null>(null)
  const ggbApiRight2 = useRef<GeogebraAppApi | null>(null)
  const [index, setIndex] = useState(-1)

  const playMouseCLick = useSFX('mouseClick')
  const playMouseIn = useSFX('mouseIn')
  const playMouseOut = useSFX('mouseOut')
  const [option1, setOption1] = useState(false)
  const [option2, setOption2] = useState(false)
  const onInteraction = useContext(AnalyticsContext)
  const [showOnboarding2, setShowOnboarding2] = useState(true)

  const [showHorizontalImage, setShowHorizontalImage] = useState(false)
  const [showVerticalImage, setShowVerticalImage] = useState(false)
  const [showFirstImageText, setShowFirstImageText] = useState(true)
  const [showHorizontalImageText, setShowHorizontalImageText] = useState(false)
  const [showVerticalImageText, setShowVerticalImageText] = useState(false)
  const [showVerticalImageText2, setShowVerticalImageText2] = useState(false)
  const [showHorizontalSlider, setShowHorizontalSlider] = useState(false)
  const [showVerticalSlider, setShowVerticalSlider] = useState(false)

  const onGGBLoadedLeft = useCallback((api: GeogebraAppApi | null) => {
    ggbApiLeft.current = api
    setGGBLoadedLeft(true)
    setGGBLoadedRight1(true)
    setGGBLoadedRight2(true)

    ggbApiLeft.current?.registerObjectUpdateListener('hh', () => {
      if (ggbApiLeft.current?.getValue('hh') === 0) {
        setIndex(0)
        ggbApiRight1.current?.setValue('xy', 0)
        setShowHorizontalSlider(true)
      }
    })
    ggbApiLeft.current?.registerObjectUpdateListener('hh1', () => {
      if (ggbApiLeft.current?.getValue('hh1') === 0) {
        setIndex(1)
        ggbApiRight2.current?.setValue('hh1', 0)
        setShowVerticalSlider(true)
        setShowVerticalImageText2(true)
      }
    })
  }, [])

  const onGGBLoadedRight1 = useCallback((api: GeogebraAppApi | null) => {
    ggbApiRight1.current = api
    setGGBLoadedLeft(true)
  }, [])

  const onGGBLoadedRight2 = useCallback((api: GeogebraAppApi | null) => {
    ggbApiRight2.current = api
    setGGBLoadedLeft(true)
  }, [])

  const onClickHandle = (e: any) => {
    playMouseCLick()
    onInteraction('tap')
    let selectedOption = ''

    switch (e.target.id) {
      case '1':
        selectedOption = 'option1'
        ggbApiLeft.current?.evalCommand('StartAnimation(hh)')
        ggbApiLeft.current?.evalCommand('SetValue(hh1,15)')
        ggbApiLeft.current?.evalCommand('SetValue(yz,0)')
        setShowOnboarding2(false)
        setShowVerticalImageText(false)
        setShowVerticalSlider(false)
        setShowFirstImageText(false)
        setShowVerticalImageText2(false)
        break
      case '2':
        selectedOption = 'option2'
        ggbApiLeft.current?.evalCommand('StartAnimation(hh1)')
        ggbApiLeft.current?.evalCommand('SetValue(hh,-15)')
        ggbApiLeft.current?.evalCommand('SetValue(xy,0)')
        setShowOnboarding2(false)
        setShowHorizontalImageText(false)
        setShowHorizontalSlider(false)
        setShowFirstImageText(false)
        break
    }

    if (selectedOption === 'option1') {
      setOption1((prevOption1) => {
        const newOption1 = !prevOption1
        setOption2(false)
        return newOption1
      })
    } else if (selectedOption === 'option2') {
      setOption2((prevOption2) => {
        const newOption2 = !prevOption2
        setOption1(false)
        return newOption2
      })
    }
  }

  const onChangeHandle = (value: number) => {
    onInteraction('slide')
    setShowHorizontalImageText(true)
    if (ggbApiLeft.current && ggbApiRight1) {
      ggbApiLeft.current.setValue('xy', value)
      ggbApiRight1.current?.setValue('xy', value)
    }
  }

  const onChangeHandle2 = (value: number) => {
    onInteraction('slide')
    setShowVerticalImageText(true)
    setShowVerticalImageText2(false)
    if (ggbApiLeft.current) {
      ggbApiLeft.current.setValue('yz', value)
      ggbApiRight2.current?.setValue('yz', value)
    }
    if (value === 0) {
      setShowVerticalImageText2(true)
      setShowVerticalImageText(false)
    } else {
      setShowVerticalImageText2(false)
    }
  }
  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#F6F6F6',
        id: 'g07-gmc07-s1-gb03',
        onEvent,
        className,
      }}
    >
      <CenteredGGBLeft
        materialId={'mtezmhuw'}
        onApiReady={onGGBLoadedLeft}
        width={500}
        height={500}
      />
      <div style={{ visibility: index === 0 ? 'visible' : 'hidden' }}>
        <CenteredGGBRight1
          materialId={'nqmjtn6u'}
          onApiReady={onGGBLoadedRight1}
          width={240}
          height={240}
        />
      </div>
      <div style={{ visibility: index === 1 ? 'visible' : 'hidden' }}>
        <CenteredGGBRight2
          materialId={'dcuwu3wm'}
          onApiReady={onGGBLoadedRight2}
          width={240}
          height={240}
        />
      </div>
      <TextHeader
        text="Explore cross sectional views of rectangular pyramid."
        backgroundColor="#F6F6F6"
        buttonColor="#1A1A1A"
      />
      <RadioDiv left={135} checked={option1} id={'1'} onClick={onClickHandle}>
        <RadioInnerDiv checked={option1}>
          <RadioButton checked={option1}>
            <span></span>
          </RadioButton>
          <RadioLabel>
            <ColorText color={'#212121'}>Horizontal</ColorText>
          </RadioLabel>
        </RadioInnerDiv>
      </RadioDiv>
      <RadioDiv left={385} checked={option2} id={'2'} onClick={onClickHandle}>
        <RadioInnerDiv checked={option2}>
          <RadioButton checked={option2}>
            <span></span>
          </RadioButton>
          <RadioLabel>
            <ColorText color={'#212121'}>Vertical</ColorText>
          </RadioLabel>
        </RadioInnerDiv>
      </RadioDiv>
      {ggbLoadedLeft && <RectangleBG />}
      {ggbLoadedLeft && <RectangleToggle />}
      {ggbLoadedLeft && <ToggleText src={text} />}
      {ggbLoadedLeft && <RightCrossView src={cross} />}
      {ggbLoadedLeft && <Patch src={p1} />}
      {ggbLoadedLeft && <Patch1 src={p1} />}
      {ggbLoadedLeft && <Patch2 src={p1} />}
      {ggbLoadedLeft && <Patch3 src={p1} />}
      {ggbLoadedLeft && <Patch4 src={p1} />}
      {ggbLoadedLeft && showHorizontalImage && <HorizontalImageView src={horizontalimage} />}
      {ggbLoadedLeft && showVerticalImage && <VerticalImageView src={verticalimage} />}
      {ggbLoadedLeft && showHorizontalImageText && (
        <HorizontalImageViewText src={horizontalimageText} />
      )}
      {ggbLoadedLeft && showVerticalImageText && <VerticalImageViewText src={verticalimageText} />}
      {ggbLoadedLeft && showVerticalImageText2 && (
        <VerticalImageViewText2 src={verticalimageText2} />
      )}

      {ggbApiLeft && showFirstImageText && <FirstPageText src={pagetext} />}
      {/* {ggbLoaded && <TrackImage src={trackimage} />} */}
      {ggbLoadedLeft && showHorizontalSlider && (
        <SliderContainerVertical>
          <ThemeProvider theme={{ ...palette['dark'], sliderColor: `url('${trackimage}')` }}>
            <RangeSlider
              customThumb={ThumbIcon}
              vertical
              onChange={onChangeHandle}
              onChangeBegin={() => playMouseIn()}
              onChangeComplete={() => playMouseOut()}
              min={0}
              max={4.9}
              step={0.1}
              defaultValue={0}
            />
          </ThemeProvider>
        </SliderContainerVertical>
      )}
      {ggbLoadedLeft && showVerticalSlider && (
        <SliderContainerHori>
          <ThemeProvider theme={{ ...palette['dark'], sliderColor: `url('${trackimageTwo}')` }}>
            <RangeSlider
              customThumb={ThumbIconTwo}
              onChange={onChangeHandle2}
              onChangeBegin={() => playMouseIn()}
              onChangeComplete={() => playMouseOut()}
              min={-3}
              max={3}
              step={0.1}
              defaultValue={0}
            />
          </ThemeProvider>
        </SliderContainerHori>
      )}
      {showOnboarding2 && <HandPlayer src={click} autoplay loop />}
    </AppletContainer>
  )
}

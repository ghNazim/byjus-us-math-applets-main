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
import trackimage from './assets/track.svg'
import trackimageTwo from './assets/track2.svg'
import verticalimage from './assets/vert.svg'
import { ThumbIcon } from './ThumbIcon'
import { ThumbIconTwo } from './ThumbIcon2'

const CenteredGGBLeft = styled(Geogebra)`
  position: absolute;
  display: flex;
  justify-content: center;
  width: 400px;
  height: 400px;
  bottom: 280px;
  left: 17px;
  z-index: 1;
  margin-right: -1px;
  border: none;
`
const RadioDiv = styled.div<{ left: number; checked: boolean }>`
  box-sizing: border-box;
  padding: 2px;
  position: absolute;
  width: 204px;
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
  width: 95px;
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
  width: 22px;
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
  left: 18px;
  top: 90px;
  background: var(--secondary-french-sky-blue-400, #f3f7fe);
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
const FirstPageText = styled.img`
  position: absolute;
  width: 400px;
  left: 160px;
  bottom: 180px;
  z-index: 1;
  scale: 1;
`

const Patch = styled.img`
  position: absolute;
  width: 410px;
  height: 30px;
  left: 18px;
  bottom: 270px;
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
  top: 285px;
  left: 80px;
  height: 100px;
  z-index: 1;
`
const SliderContainerHori = styled.div`
  position: absolute;
  top: 430px;
  left: 100px;
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
export const AppletG07GMC07S1GB02: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const [ggbLoaded, setGGBLoaded1] = useState(false)
  const ggbApiLeft = useRef<GeogebraAppApi | null>(null)

  const playMouseCLick = useSFX('mouseClick')
  const playMouseIn = useSFX('mouseIn')
  const playMouseOut = useSFX('mouseOut')
  const [option1, setOption1] = useState(false)
  const [option2, setOption2] = useState(false)
  const onInteraction = useContext(AnalyticsContext)
  const [showOnboarding2, setShowOnboarding2] = useState(true)

  const [showHorizontalImage, setShowHorizontalImage] = useState(false)
  const [showVerticalImage, setShowVerticalImage] = useState(false)

  const [showHorizontalImageText, setShowHorizontalImageText] = useState(false)
  const [showVerticalImageText, setShowVerticalImageText] = useState(false)
  const [showFirstImageText, setShowFirstImageText] = useState(true)
  const onGGBLoadedLeft = useCallback((api: GeogebraAppApi | null) => {
    ggbApiLeft.current = api
    setGGBLoaded1(true)

    ggbApiLeft.current?.registerObjectUpdateListener('animate', () => {
      if (ggbApiLeft.current?.getValue('animate') === 0) {
        setShowHorizontalImage(true)
      }
    })
    ggbApiLeft.current?.registerObjectUpdateListener('animatey', () => {
      if (ggbApiLeft.current?.getValue('animatey') === 0) {
        setShowVerticalImage(true)
      }
    })
  }, [])

  const onClickHandle = (e: any) => {
    playMouseCLick()
    onInteraction('tap')
    let selectedOption = ''

    switch (e.target.id) {
      case '1':
        selectedOption = 'option1'
        ggbApiLeft.current?.evalCommand('SetValue(Option,1)')
        setShowOnboarding2(false)
        setShowVerticalImage(false)
        setShowVerticalImageText(false)
        setShowFirstImageText(false)
        break
      case '2':
        selectedOption = 'option2'
        ggbApiLeft.current?.evalCommand('SetValue(Option,2)')
        setShowOnboarding2(false)
        setShowHorizontalImage(false)
        setShowHorizontalImageText(false)
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
    if (ggbApiLeft.current) {
      ggbApiLeft.current.setValue('Parallel', value)
    }
    // Verify that ggbApiLeft.current is not null
  }

  const onChangeHandle2 = (value: number) => {
    onInteraction('slide')
    setShowVerticalImageText(true)
    if (ggbApiLeft.current) {
      ggbApiLeft.current.setValue('Perpendicular', value)
    }
  }
  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#F6F6F6',
        id: 'g07-gmc07-s1-gb02',
        onEvent,
        className,
      }}
    >
      <CenteredGGBLeft
        materialId={'knajbwzw'}
        onApiReady={onGGBLoadedLeft}
        width={500}
        height={500}
      />
      <TextHeader
        text="Explore cross sectional views of rectangular prism."
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
      {ggbLoaded && <RectangleBG />}
      {ggbLoaded && <RectangleToggle />}
      {ggbLoaded && <ToggleText src={text} />}
      {ggbLoaded && <RightCrossView src={cross} />}
      {ggbLoaded && <Patch src={p1} />}
      {ggbLoaded && <Patch1 src={p1} />}
      {ggbLoaded && <Patch2 src={p1} />}
      {ggbLoaded && showHorizontalImage && <HorizontalImageView src={horizontalimage} />}
      {ggbLoaded && showVerticalImage && <VerticalImageView src={verticalimage} />}
      {ggbLoaded && showHorizontalImageText && (
        <HorizontalImageViewText src={horizontalimageText} />
      )}
      {ggbLoaded && showVerticalImageText && <VerticalImageViewText src={verticalimageText} />}
      {ggbApiLeft && showFirstImageText && <FirstPageText src={pagetext} />}
      {ggbLoaded && showHorizontalImage && (
        <SliderContainerVertical>
          <ThemeProvider theme={{ ...palette['dark'], sliderColor: `url('${trackimage}')` }}>
            <RangeSlider
              customThumb={ThumbIcon}
              vertical
              onChange={onChangeHandle}
              onChangeBegin={() => playMouseIn()}
              onChangeComplete={() => playMouseOut()}
              min={0}
              max={4}
              step={0.1}
              defaultValue={2}
            />
          </ThemeProvider>
        </SliderContainerVertical>
      )}
      {ggbLoaded && showVerticalImage && (
        <SliderContainerHori>
          <ThemeProvider theme={{ ...palette['dark'], sliderColor: `url('${trackimageTwo}')` }}>
            <RangeSlider
              customThumb={ThumbIconTwo}
              onChange={onChangeHandle2}
              onChangeBegin={() => playMouseIn()}
              onChangeComplete={() => playMouseOut()}
              min={-2}
              max={2}
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

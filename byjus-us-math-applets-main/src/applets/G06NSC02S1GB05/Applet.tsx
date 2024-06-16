import { Player } from '@lottiefiles/react-lottie-player'
import { FC, useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { FactorTree } from '@/atoms/FactorTree'
import { AppletContainer } from '@/common/AppletContainer'
import { Geogebra } from '@/common/Geogebra'
import { ClientListener, GeogebraAppApi } from '@/common/Geogebra/Geogebra.types'
import { TextHeader } from '@/common/Header'
import { AppletInteractionCallback } from '@/contexts/analytics'
import { useSFX } from '@/hooks/useSFX'

import ClickAnimation from '../../common/handAnimations/clickAndDrag.json'
import DivideButton from './assets/DivideButton.svg'
import patch from './assets/p1.jpg'
import RoundOffbutton from './assets/RoundOff.svg'
import text1 from './assets/text1.svg'
import text2 from './assets/text2.svg'
import text2a from './assets/text2a.svg'
import text3 from './assets/text3.svg'
import text4 from './assets/text4.svg'
import text5 from './assets/text5.svg'
import text6 from './assets/text6.svg'
import text7 from './assets/text7.svg'
import text8 from './assets/text8.svg'
import text9 from './assets/text9.svg'
import text10 from './assets/text10.svg'
import text11 from './assets/text11.svg'
import text12 from './assets/text12.svg'
import text13 from './assets/text13.svg'
import text14 from './assets/text14.svg'
import text15 from './assets/text15.svg'
import text16 from './assets/text16.svg'
import text17 from './assets/text17.svg'
import text18 from './assets/text18.svg'
import tryNewSymb from './assets/tryNewSymb.svg'

const GeogebraContainer = styled(Geogebra)`
  position: absolute;
  top: 50px;
  left: 44%;
  transform: translate(-50%);
  scale: 0.9;
`
const OnboardingAnimationContainer = styled(Player)<{ left: number; top: number }>`
  position: absolute;
  left: ${(a) => a.left}px;
  top: ${(a) => a.top}px;
  pointer-events: none;
`
const TryNewButton = styled.button`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: flex-end;
  padding: 9px 18px;

  position: absolute;
  width: 160px;
  height: 60px;
  left: 260px;
  top: 730px;
  border: none;
  cursor: pointer;
  transition: 0.2s;

  background: #1a1a1a;
  border-radius: 10px;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 22px;
  line-height: 42px;
  text-align: center;
  color: #ffffff;

  z-index: 1;
`
const TryNewSymbol = styled.img`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
  padding: 9px 10px;

  position: absolute;
  width: 45px;
  height: 45px;
  left: 270px;
  top: 737px;
  border: none;
  cursor: pointer;
  transition: 0.2s;
  z-index: 1;
`
const PatchContainer = styled.img`
  position: absolute;
  width: 25px;
  height: 25px;
  left: 28px;
  top: 735px;
  z-index: 1;
`
const DivideContainer = styled.img`
  position: absolute;
  left: 260px;
  top: 720px;
  z-index: 1;
  cursor: pointer;
`
const RoundOffContainer = styled.img`
  position: absolute;
  left: 260px;
  top: 720px;
  z-index: 1;
  cursor: pointer;
`

const TextImages = styled.img`
  position: absolute;
  left: 100px;
  top: 640px;
  z-index: 1;
  cursor: pointer;
`

const ShortTextImages = styled.img`
  position: absolute;
  left: 140px;
  top: 640px;
  z-index: 1;
  cursor: pointer;
`

const ShortTextImages1 = styled.img`
  position: absolute;
  left: 140px;
  top: 640px;
  z-index: 1;
  cursor: pointer;
`

const BigTextImages = styled.img`
  position: absolute;
  left: 30px;
  top: 640px;
  z-index: 1;
  cursor: pointer;
`

const BigTextImages2 = styled.img`
  position: absolute;
  left: 60px;
  top: 640px;
  z-index: 1;
  cursor: pointer;
`

export const AppletG06NSC02S1GB05: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const [GGBLoaded1, setGGBLoaded1] = useState(false)
  const ggb1 = useRef<GeogebraAppApi | null>(null)
  const [showTryButton, setShowTryButton] = useState(false)
  const [showDivideButton, setShowDivideButton] = useState(false)
  const [showRoundOffButton, setShowRoundOffButton] = useState(false)

  const playMouseIn = useSFX('mouseIn')
  const playMouseOut = useSFX('mouseOut')
  const playMouseCLick = useSFX('mouseClick')
  const [showOnboarding1, setShowOnboarding1] = useState(true)
  const [showText1, setShowText1] = useState(true)
  const [showText2, setShowText2] = useState(false)
  const [showText2a, setShowText2a] = useState(false)
  const [showText3, setShowText3] = useState(false)
  const [showText4, setShowText4] = useState(false)
  const [showText5, setShowText5] = useState(false)
  const [showText6, setShowText6] = useState(false)
  const [showText7, setShowText7] = useState(false)
  const [showText8, setShowText8] = useState(false)
  const [showText9, setShowText9] = useState(false)
  const [showText10, setShowText10] = useState(false)

  const [showText11, setShowText11] = useState(false)
  const [showText12, setShowText12] = useState(false)
  const [showText13, setShowText13] = useState(false)
  const [showText14, setShowText14] = useState(false)

  const [showText15, setShowText15] = useState(false)
  const [showText16, setShowText16] = useState(false)
  const [showText17, setShowText17] = useState(false)
  const [showText18, setShowText18] = useState(false)

  const onGGB1Loaded = useCallback((api: GeogebraAppApi | null) => {
    ggb1.current = api
    setGGBLoaded1(api != null)
  }, [])

  useEffect(() => {
    const api = ggb1.current
    if (api != null && GGBLoaded1) {
      const onGgb1Client: ClientListener = (e) => {
        if (
          e.type === 'mouseDown' &&
          (e.hits[0] === 'P' ||
            e.hits[0] === 'Q' ||
            e.hits[0] === 'righthand' ||
            e.hits[0] === 'lefthand')
        ) {
          playMouseIn()
          setShowOnboarding1(false)
        } else if (
          e.type === 'dragEnd' &&
          (e.target === 'P' ||
            e.target === 'Q' ||
            e.target === 'righthand' ||
            e.target === 'lefthand')
        ) {
          playMouseOut()
        } else if (e.type === 'mouseDown' && e.hits[0] === 'E') {
          setShowOnboarding1(false)
        } else if (
          e.type === 'mouseDown' &&
          e.type === 'mouseDown' &&
          (e.hits[0] === 'divide1' || e.hits[0] === 'divide3' || e.hits[0] === 'roundoffbutton')
        ) {
          playMouseCLick()
        }
      }
      api.registerClientListener(onGgb1Client)
      let isG1bTrue = false
      let isG2bTrue = false
      let trynew = 0
      let showTextAnimation = 0
      let framevalue = 0
      let questionValue = 0

      api.registerObjectUpdateListener('divbool', () => {
        isG1bTrue = Boolean(api.getValue('divbool'))
        questionValue = api.getValue('n')
        framevalue = api.getValue('frame')
        if (isG1bTrue && questionValue === 3.4 && framevalue === 0) {
          setShowDivideButton(true)
          setShowText1(false)
          setShowText2(true)
        } else if (isG1bTrue && questionValue === 6.7 && framevalue === 0) {
          setShowDivideButton(true)
          setShowText4(false)
          setShowText2(true)
        } else if (isG1bTrue && questionValue === 3.47 && framevalue === 0) {
          setShowDivideButton(true)
          setShowText7(false)
          setShowText2(true)
        } else if (isG1bTrue && questionValue === 3.47 && framevalue === 1) {
          setShowDivideButton(true)
          setShowText8(false)
          setShowText2(true)
        } else if (isG1bTrue && questionValue === 6.72 && framevalue === 0) {
          setShowDivideButton(true)
          setShowText11(false)
          setShowText2(true)
        } else if (isG1bTrue && questionValue === 6.72 && framevalue === 1) {
          setShowDivideButton(true)
          setShowText12(false)
          setShowText2(true)
        } else {
          setShowDivideButton(false)
        }
      })

      api.registerObjectUpdateListener('roundbool', () => {
        isG2bTrue = Boolean(api.getValue('roundbool'))
        if (isG2bTrue === true && showTextAnimation === 1 && questionValue === 3.4) {
          setShowRoundOffButton(true)
          setShowText15(true)
          setShowText2a(false)
        } else if (
          isG2bTrue === true &&
          showTextAnimation === 1 &&
          framevalue === 1 &&
          questionValue === 6.7
        ) {
          setShowRoundOffButton(true)
          setShowText16(true)
          setShowText5(false)
        } else if (isG2bTrue === true && showTextAnimation === 1 && questionValue === 3.47) {
          setShowRoundOffButton(true)
          setShowText17(true)
          setShowText9(false)
        } else if (isG2bTrue === true && showTextAnimation === 1 && questionValue === 6.72) {
          setShowRoundOffButton(true)
          setShowText18(true)
          setShowText13(false)
        } else {
          setShowRoundOffButton(false)
        }
      })

      api.registerObjectUpdateListener('lastan', () => {
        trynew = api.getValue('lastan')
        showTextAnimation = api.getValue('an2')
        if (trynew === 1) {
          setShowTryButton(true)
        } else {
          setShowTryButton(false)
        }
      })

      api.registerObjectUpdateListener('an2', () => {
        showTextAnimation = api.getValue('an2')
        framevalue = api.getValue('frame')
        questionValue = api.getValue('n')
        if (showTextAnimation === 1 && framevalue === 1 && questionValue === 3.4) {
          setShowText2a(true)
          setShowText2(false)
        }

        if (showTextAnimation === 1 && framevalue === 2 && questionValue === 3.4) {
          setShowText3(true)
          setShowText2a(false)
        }

        if (showTextAnimation === 1 && framevalue === 1 && questionValue === 6.7) {
          setShowText5(true)
        }

        if (showTextAnimation === 1 && framevalue === 2 && questionValue === 6.7) {
          setShowText6(true)
        }

        if (showTextAnimation === 1 && framevalue === 1 && questionValue === 3.47) {
          setShowText8(true)
        }

        if (showTextAnimation === 1 && framevalue === 2 && questionValue === 3.47) {
          setShowText9(true)
        }
        if (showTextAnimation === 1 && framevalue === 3 && questionValue === 3.47) {
          setShowText10(true)
        }
        if (showTextAnimation === 1 && framevalue === 1 && questionValue === 6.72) {
          setShowText12(true)
        }

        if (showTextAnimation === 1 && framevalue === 2 && questionValue === 6.72) {
          setShowText13(true)
        }
        if (showTextAnimation === 1 && framevalue === 3 && questionValue === 6.72) {
          setShowText14(true)
        }
      })
      return () => {
        ggb1.current?.unregisterClientListener(onGgb1Client)
      }
    }
  }, [GGBLoaded1, playMouseCLick, playMouseIn, playMouseOut, showDivideButton])

  const onTryNewClick = () => {
    const latan = ggb1.current?.getValue('lastan')
    const ValueN = ggb1.current?.getValue('n')
    if (ValueN === 3.4 && latan === 1) {
      ggb1.current?.evalCommand('RunClickScript(tryAgain)')
      setShowText3(false)
      setShowText4(true)
    }
    if (ValueN === 6.7 && latan === 1) {
      ggb1.current?.evalCommand('RunClickScript(tryAgain)')
      setShowText6(false)
      setShowText7(true)
    }
    if (ValueN === 3.47 && latan === 1) {
      ggb1.current?.evalCommand('RunClickScript(tryAgain)')
      setShowText10(false)
      setShowText11(true)
    }
    if (ValueN === 6.72 && latan === 1) {
      ggb1.current?.evalCommand('RunClickScript(button1)')
      setShowText14(false)
      setShowText1(true)
    }
  }

  const onDivideClick = () => {
    const ValueN = ggb1.current?.getValue('n')
    if (ValueN === 3.4) {
      ggb1.current?.evalCommand('RunClickScript(button2)')
      setShowText2(false)
    }

    if (ValueN === 6.7) {
      ggb1.current?.evalCommand('RunClickScript(button2)')
      setShowText2(false)
    }
    if (ValueN === 3.47) {
      ggb1.current?.evalCommand('RunClickScript(button2)')
      setShowText2(false)
    }
    if (ValueN === 6.72) {
      ggb1.current?.evalCommand('RunClickScript(button2)')
      setShowText2(false)
    }
  }

  const onRoundOffClick = () => {
    const ValueN = ggb1.current?.getValue('n')
    if (ValueN === 3.4) {
      ggb1.current?.evalCommand('RunClickScript(button3)')
      setShowText15(false)
    }
    if (ValueN === 6.7) {
      ggb1.current?.evalCommand('RunClickScript(button3)')
      setShowText16(false)
    }
    if (ValueN === 3.47) {
      ggb1.current?.evalCommand('RunClickScript(button3)')
      setShowText17(false)
    }
    if (ValueN === 6.72) {
      ggb1.current?.evalCommand('RunClickScript(button3)')
      setShowText18(false)
    }
  }
  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#F6F6F6',
        id: 'g06-nsc02-s1-gb05',
        onEvent,
        className,
      }}
    >
      <TextHeader
        text="Round off the decimal number on the number line."
        backgroundColor="#F6F6F6"
        buttonColor="#1A1A1A"
        hideButton={true}
      />

      <GeogebraContainer materialId="dhx9b24a" onApiReady={onGGB1Loaded} />

      {showOnboarding1 && (
        <>
          <OnboardingAnimationContainer left={-150} top={500} src={ClickAnimation} loop autoplay />
        </>
      )}

      {showTryButton && (
        <>
          <TryNewButton onClick={onTryNewClick}>Try New</TryNewButton>
          <TryNewSymbol src={tryNewSymb}></TryNewSymbol>
        </>
      )}

      {showDivideButton && (
        <DivideContainer src={DivideButton} onClick={onDivideClick}></DivideContainer>
      )}

      {showRoundOffButton && (
        <RoundOffContainer src={RoundOffbutton} onClick={onRoundOffClick}></RoundOffContainer>
      )}

      {showText1 && <TextImages src={text1} draggable={false}></TextImages>}
      {showText2 && <ShortTextImages src={text2} draggable={false}></ShortTextImages>}
      {showText2a && <ShortTextImages src={text2a} draggable={false}></ShortTextImages>}
      {showText3 && <ShortTextImages1 src={text3} draggable={false}></ShortTextImages1>}

      {showText4 && <TextImages src={text4} draggable={false}></TextImages>}
      {showText5 && <ShortTextImages src={text5} draggable={false}></ShortTextImages>}
      {showText6 && <ShortTextImages src={text6} draggable={false}></ShortTextImages>}

      {showText7 && <TextImages src={text7} draggable={false}></TextImages>}
      {showText8 && <BigTextImages src={text8} draggable={false}></BigTextImages>}
      {showText9 && <ShortTextImages src={text9} draggable={false}></ShortTextImages>}
      {showText10 && <ShortTextImages src={text10} draggable={false}></ShortTextImages>}

      {showText11 && <TextImages src={text11} draggable={false}></TextImages>}
      {showText12 && <BigTextImages src={text12} draggable={false}></BigTextImages>}
      {showText13 && <ShortTextImages src={text13} draggable={false}></ShortTextImages>}
      {showText14 && <ShortTextImages src={text14} draggable={false}></ShortTextImages>}

      {showText15 && <BigTextImages2 src={text15} draggable={false}></BigTextImages2>}
      {showText16 && <BigTextImages2 src={text16} draggable={false}></BigTextImages2>}
      {showText17 && <BigTextImages2 src={text17} draggable={false}></BigTextImages2>}
      {showText18 && <BigTextImages2 src={text18} draggable={false}></BigTextImages2>}

      <PatchContainer src={patch}></PatchContainer>
    </AppletContainer>
  )
}

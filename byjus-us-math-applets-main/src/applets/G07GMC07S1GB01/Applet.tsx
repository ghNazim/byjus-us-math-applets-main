import { Player } from '@lottiefiles/react-lottie-player'
import { FC, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { OnboardingAnimation } from '@/atoms/OnboardingAnimation'
import { OnboardingController } from '@/atoms/OnboardingController'
import { OnboardingStep } from '@/atoms/OnboardingStep'
import { AppletContainer } from '@/common/AppletContainer'
import { TextHeader } from '@/common/Header'
import { AppletInteractionCallback } from '@/contexts/analytics'
import { useSFX } from '@/hooks/useSFX'

import breadIcon from './Assets/bread.png'
import bread1 from './Assets/bread1.mp4'
import fruit2 from './Assets/carambola2.mp4'
import sliceIcon from './Assets/CTA Icons.svg'
import fruitIcon from './Assets/fruit.png'
import rollIcon from './Assets/roll.png'
import swissRoll3 from './Assets/swissRoll3.mp4'
import { AnimatedSliceButton } from './Buttons/AnimatedButtons'
import { ToggleSquareButton } from './Buttons/ToggleImgBtn'

const AnimContainer = styled.video`
  position: absolute;
  width: 680px;
  height: 440px;
  left: 50%;
  translate: -50%;
`
const MainContainer = styled.div`
  position: absolute;
  top: 85px;
  left: 21px;
  width: 675px;
  height: 435px;
  border-radius: 12px;
  overflow: hidden;
  background: #f3f7fe;
  color: var(--monotone-110, #646464);
  font-family: Nunito;
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
`
const ButtonContainer = styled.button`
  position: absolute;
  left: 50%;
  translate: -50%;
  top: 710px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background-color: transparent;
`
const ToggleContainer = styled.div`
  position: absolute;
  top: 550px;
  left: 50%;
  translate: -50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  gap: 20px;
`
const AppletOnboarding = styled(OnboardingAnimation)<{ left: number; top: number; type: string }>`
  position: absolute;
  top: ${(a) => a.top}px;
  left: ${(a) => a.left}px;
  width: 400px;
`

const videoSource = [bread1, fruit2, swissRoll3]

export const AppletG07GMC07S1GB01: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const playerRef = useRef<HTMLVideoElement>(null)
  const [clickStage, setClickStage] = useState(0)
  const [sliceClicked, setSliceClicked] = useState(false)
  const [animCompleted, setCompleted] = useState(false)

  const playMouseClick = useSFX('mouseClick')

  const onBreadClick = () => {
    playMouseClick()
    setClickStage(1)
    setSliceClicked(false)
  }
  const onFruitClick = () => {
    playMouseClick()
    setClickStage(2)
    setSliceClicked(false)
  }
  const onRollClick = () => {
    playMouseClick()
    setClickStage(3)
    setSliceClicked(false)
  }
  const onSliceClick = () => {
    playMouseClick()
    playerRef.current?.play()
    setCompleted(false)
    setSliceClicked(true)
  }

  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#f6f6f6',
        id: 'g07-gmc07-s1-gb01',
        onEvent,
        className,
      }}
    >
      <TextHeader
        text="Observe the cross section for the given objects."
        backgroundColor="#f6f6f6"
        buttonColor="#1a1a1a"
      />
      <MainContainer>
        {clickStage === 0 && <div>No Object Selected</div>}
        <AnimContainer
          src={videoSource[clickStage - 1]}
          ref={playerRef}
          disablePictureInPicture={true}
          onEnded={() => setCompleted(true)}
        ></AnimContainer>
      </MainContainer>
      <ToggleContainer>
        <ToggleSquareButton
          ImgSrc={breadIcon}
          onClick={onBreadClick}
          isClicked={clickStage === 1}
        />
        <ToggleSquareButton
          ImgSrc={fruitIcon}
          onClick={onFruitClick}
          isClicked={clickStage === 2}
        />
        <ToggleSquareButton ImgSrc={rollIcon} onClick={onRollClick} isClicked={clickStage === 3} />
      </ToggleContainer>
      <ButtonContainer>
        <AnimatedSliceButton
          imgSource={sliceIcon}
          onClick={onSliceClick}
          disabled={(sliceClicked && !animCompleted) || clickStage === 0}
        >
          Slice
        </AnimatedSliceButton>
      </ButtonContainer>
      <OnboardingController>
        <OnboardingStep index={0}>
          <AppletOnboarding type="click" top={570} left={5} complete={clickStage > 0} />
        </OnboardingStep>
        <OnboardingStep index={1}>
          <AppletOnboarding type="click" top={685} left={160} complete={sliceClicked} />
        </OnboardingStep>
      </OnboardingController>
    </AppletContainer>
  )
}

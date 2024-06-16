import { Player } from '@lottiefiles/react-lottie-player'
import { Alignment, Fit, Layout, useRive } from '@rive-app/react-canvas'
import { FC, useEffect, useRef, useState } from 'react'
import styled, { keyframes } from 'styled-components'

import { OnboardingAnimation } from '@/atoms/OnboardingAnimation'
import { OnboardingController } from '@/atoms/OnboardingController'
import { OnboardingStep } from '@/atoms/OnboardingStep'
import { AppletContainer } from '@/common/AppletContainer'
import { TextHeader } from '@/common/Header'
import { PageControl } from '@/common/PageControl'
import { AppletInteractionCallback } from '@/contexts/analytics'
import { useSFX } from '@/hooks/useSFX'

import AreaBlankBoxes from './assets/AreaBlankBoxes.svg'
import AreaText1 from './assets/AreaText1.svg'
//images to be replaced on clicking the div(bottom text)
import box1 from './assets/IndividualAreas/1.svg'
import box2 from './assets/IndividualAreas/2.svg'
import box3 from './assets/IndividualAreas/3.svg'
import box4 from './assets/IndividualAreas/4.svg'
import box5 from './assets/IndividualAreas/5.svg'
import box6 from './assets/IndividualAreas/6.svg'
import TextAnimationRive from './assets/riveAnimation.riv'
//
import UnwrappingAnimation from './assets/unwrappingLottie.json'

const FadeIn = keyframes`
  0%{
    opacity: 0;
  }
  100%{
    opacity: 1;
  }
`

const PlayerContainer = styled.div`
  width: 100%;
  height: 75%;
  /* border: 1px solid black; */
  display: flex;
  align-items: flex-end;
  justify-content: center;
`

const BlueContainer = styled.div`
  display: flex;
  background-color: #f3f7fe;
  width: 90%;
  height: 85%;
  align-items: flex-start;
`

const PlayerStyled = styled(Player)`
  padding-top: 30px;
  width: 65%;
  position: relative;
  top: -50px;
`

const BottomText = styled.div<{ bottom: number }>`
  display: flex;
  position: absolute;
  width: 100%;
  justify-content: center;
  bottom: ${(a) => a.bottom}px;
  align-items: center;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  color: #444444;
  animation: ${FadeIn} 0.5s ease;
`

const ColoredSpan = styled.span<{ color: string; bg: string }>`
  color: ${(props) => props.color};
  background: ${(props) => props.bg};
  border-radius: 5px;
  margin: 0 8px;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  display: flex;
  padding: 5px 10px;
`

const fadeIn = keyframes`
  0%{
    opacity: 0;
  }100%{
    opacity: 1;
  }
`

const ClickAreas = styled.div<{ width: number; height: number; top: number; left: number }>`
  position: absolute;
  width: ${(a) => a.width}px;
  height: ${(a) => a.height}px;
  top: ${(a) => a.top}px;
  left: ${(a) => a.left}px;

  /* border: 1px solid black; */
`

const FadeInImgs = styled.img`
  animation: ${fadeIn} 0.5s ease;
  transition: all 0.5s ease;
`

const OnboardingAnim = styled(OnboardingAnimation)<{ left: number; top: number }>`
  position: absolute;
  left: ${(a) => a.left}px;
  top: ${(a) => a.top}px;
`

export const AppletG06GMC05S1GB03: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const playerRef = useRef<Player | null>(null)

  const [currentpageIndex, setCurrentPageIndex] = useState(0)
  const [currentFrame, setCurrentFrame] = useState(0)
  const [showTotalSurfaceText, setShowTotalSurfaceText] = useState(false)
  const [disable4thStep, setDisable4tStep] = useState(true)
  const [showRiveAnimation, setShowRiveAnimation] = useState(false)

  const [arrayForBottomTextImg, setArrayForBottomTextImg] = useState<string[]>([
    AreaBlankBoxes,
    AreaBlankBoxes,
    AreaBlankBoxes,
    AreaBlankBoxes,
    AreaBlankBoxes,
    AreaBlankBoxes,
  ])

  const { rive, RiveComponent } = useRive({
    src: TextAnimationRive,
    animations: 'Timeline 1',

    layout: new Layout({
      fit: Fit.Contain,
      alignment: Alignment.TopCenter,
    }),
  })

  const playMouseClick = useSFX('mouseClick')

  const correctBoxImages = [box1, box2, box3, box4, box5, box6]
  const totalFrame = UnwrappingAnimation.op
  const stopAtFrame = totalFrame - 6

  const handlePageChange = (pageNum: number) => {
    setCurrentPageIndex(pageNum)
  }

  const handleRetryBtn = () => {
    setCurrentPageIndex(0)
    setCurrentFrame(0)
    setShowTotalSurfaceText(false)
    setDisable4tStep(true)
    setShowRiveAnimation(false)
    setArrayForBottomTextImg([
      AreaBlankBoxes,
      AreaBlankBoxes,
      AreaBlankBoxes,
      AreaBlankBoxes,
      AreaBlankBoxes,
      AreaBlankBoxes,
    ])
  }

  const addDelay = (time: number): Promise<void> => {
    let timer: NodeJS.Timer
    const promise = new Promise<void>((resolve) => {
      timer = setTimeout(() => {
        resolve()
      }, time)
    })

    const cleanUp = () => {
      if (timer) clearTimeout(timer)
    }

    promise.finally(cleanUp)

    return promise
  }

  useEffect(() => {
    const player = playerRef.current

    if (player) {
      currentFrame === stopAtFrame ? setShowTotalSurfaceText(true) : undefined
      if (currentpageIndex === 0) {
        setShowTotalSurfaceText(false)
        setCurrentFrame(0)
      } else if (currentpageIndex === 1) {
        //unwrapping animation
        const playAnimation = setTimeout(() => {
          setCurrentFrame((prev) => (prev >= stopAtFrame ? prev : prev + 1))
        }, 1000 / UnwrappingAnimation.fr)

        return () => {
          clearTimeout(playAnimation)
        }
      } else if (currentpageIndex === 2) {
        setShowRiveAnimation(false)
        //unwrapped, user has to click on the areas
        setCurrentFrame(stopAtFrame + 5)
      } else if (currentpageIndex === 3) {
        //reverse
        const playAnimation = setTimeout(() => {
          //35-29 frames are the pink frames, so excluding it
          setCurrentFrame((prev) => (prev > 0 ? (prev - 1 === 35 ? 29 : prev - 1) : prev))
        }, 1000 / UnwrappingAnimation.fr)

        //hiding the bottom text
        if (currentFrame > 1) {
          setShowTotalSurfaceText(false)
        } else {
          setShowTotalSurfaceText(true)
        }
        rive?.reset()
        rive?.play('idleState')
        setDisable4tStep(true)
        return () => {
          clearTimeout(playAnimation)
        }
      } else if (currentpageIndex === 4) {
        const animationSequence = async () => {
          rive?.play('idleState')
          await addDelay(1000)
          rive?.play('Timeline 1')
          await addDelay(2000)
          rive?.play('Timeline 2')
          await addDelay(1000)
          setDisable4tStep(false)
        }
        animationSequence()
      } else if (currentpageIndex === 5) {
        rive?.reset()
      }
    }
  }, [currentFrame, currentpageIndex, rive, stopAtFrame])

  useEffect(() => {
    playerRef.current?.setSeeker(currentFrame)

    if (currentpageIndex === 3 && currentFrame < 2) {
      setShowRiveAnimation(true)
    }
  }, [currentFrame, currentpageIndex, rive])

  const replaceBlankBoxesWithCorrectImage = (index: number) => {
    playMouseClick()
    setArrayForBottomTextImg((prevArr) => {
      const tmpArr = [...prevArr]
      tmpArr[index] = correctBoxImages[index]
      return tmpArr
    })
  }

  const handleNextPageDisabled = () => {
    switch (currentpageIndex) {
      case 1:
        return currentFrame <= stopAtFrame - 1
      case 2:
        return JSON.stringify(arrayForBottomTextImg) !== JSON.stringify(correctBoxImages)
      case 3:
        return currentFrame > 1
      case 4:
        return disable4thStep
      default:
        return false
    }
  }

  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#f6f6f6',
        id: 'g06-gmc05-s1-gb03',
        onEvent,
        className,
        themeName: 'dark',
      }}
    >
      <TextHeader
        text="Total Surface area of rectangular prism."
        backgroundColor="#f6f6f6"
        buttonColor="#1a1a1a"
      />
      <OnboardingController>
        <PlayerContainer>
          <BlueContainer>
            <PlayerStyled src={UnwrappingAnimation} ref={playerRef} />
          </BlueContainer>
        </PlayerContainer>
        {showTotalSurfaceText && (
          <>
            {currentFrame > 2 && (
              <BottomText bottom={250}>
                <ColoredSpan color="#AA5EE0" bg="#F4E5FF">
                  Total surface area
                </ColoredSpan>{' '}
                ={' '}
                {currentpageIndex === 1 && (
                  <>
                    <img src={AreaText1} width={400} style={{ paddingLeft: '5px' }} />
                  </>
                )}
                {currentpageIndex >= 2 && (
                  <>
                    {arrayForBottomTextImg.map((img, index) => (
                      <>
                        <FadeInImgs src={img} key={index} style={{ padding: '0 5px' }} />
                        {index !== 5 && <span> + </span>}
                      </>
                    ))}
                  </>
                )}
              </BottomText>
            )}
          </>
        )}

        <BottomText bottom={350}>
          <RiveComponent
            style={{
              opacity: `${showRiveAnimation ? 1 : 0}`,
              width: '630px',
              height: '50px',
              position: 'relative',
            }}
          />
        </BottomText>

        {currentpageIndex === 2 && (
          <>
            <ClickAreas
              top={133}
              left={288}
              width={140}
              height={63}
              onClick={() => replaceBlankBoxesWithCorrectImage(0)}
            />
            <ClickAreas
              top={196}
              left={288}
              width={140}
              height={83}
              onClick={() => replaceBlankBoxesWithCorrectImage(1)}
            />
            <ClickAreas
              top={280}
              left={288}
              width={140}
              height={63}
              onClick={() => replaceBlankBoxesWithCorrectImage(2)}
            />
            <ClickAreas
              top={343}
              left={288}
              width={140}
              height={83}
              onClick={() => replaceBlankBoxesWithCorrectImage(3)}
            />
            <ClickAreas
              top={281}
              left={204}
              width={86}
              height={63}
              onClick={() => replaceBlankBoxesWithCorrectImage(5)}
            />
            <ClickAreas
              top={281}
              left={430}
              width={86}
              height={63}
              onClick={() => replaceBlankBoxesWithCorrectImage(4)}
            />
          </>
        )}

        <BottomText bottom={150}>
          {currentpageIndex === 0 && <>Proceed to unfold the rectangular prism.</>}
          {currentpageIndex === 1 && showTotalSurfaceText && (
            <>
              Note:{' '}
              <ColoredSpan color="#AA5EE0" bg="#F4E5FF">
                Total surface area
              </ColoredSpan>
              is the total area covered by all the faces.
            </>
          )}
          {currentpageIndex === 2 && <>Tap on each face to reveal their areas.</>}
          {currentpageIndex === 3 && <>Simplify the expression.</>}
          {currentpageIndex > 3 && <>The total surface area of the rectangular prism is derived.</>}
        </BottomText>

        <PageControl
          onReset={handleRetryBtn}
          total={6}
          onChange={handlePageChange}
          nextDisabled={handleNextPageDisabled()}
        />
        <OnboardingStep index={0}>
          <OnboardingAnim type="click" top={690} left={322} complete={currentpageIndex !== 0} />
        </OnboardingStep>
        {showTotalSurfaceText && (
          <OnboardingStep index={1}>
            <OnboardingAnim type="click" top={690} left={322} complete={currentpageIndex !== 1} />
          </OnboardingStep>
        )}
        <OnboardingStep index={2}>
          <OnboardingAnim
            type="click"
            top={109}
            left={284}
            complete={
              arrayForBottomTextImg.filter((el) => correctBoxImages.includes(el)).length > 0 ||
              currentpageIndex !== 2
            }
          />
        </OnboardingStep>
        {JSON.stringify(arrayForBottomTextImg) === JSON.stringify(correctBoxImages) && (
          <OnboardingStep index={3}>
            <OnboardingAnim type="click" top={690} left={322} complete={currentpageIndex !== 3} />
          </OnboardingStep>
        )}
        {!disable4thStep && (
          <OnboardingStep index={4}>
            <OnboardingAnim type="click" top={690} left={322} complete={currentpageIndex !== 4} />
          </OnboardingStep>
        )}
      </OnboardingController>
    </AppletContainer>
  )
}

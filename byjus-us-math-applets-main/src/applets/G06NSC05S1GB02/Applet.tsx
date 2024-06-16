import Fraction from 'fraction.js'
import { FC, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { OnboardingAnimation } from '@/atoms/OnboardingAnimation'
import { OnboardingController } from '@/atoms/OnboardingController'
import { OnboardingStep } from '@/atoms/OnboardingStep'
import { AppletContainer } from '@/common/AppletContainer'
import { TextHeader } from '@/common/Header'
import { AppletInteractionCallback } from '@/contexts/analytics'
import { useSFX } from '@/hooks/useSFX'

import video515 from './assets/5__15_1.mp4'
import video812 from './assets/8__12_1.mp4'
import video1020 from './assets/10__20_1.mp4'
import tryNewIcon from './assets/trynew.svg'

const varButtonColor = '#1a1a1a'

const Btn = styled.div<{ bottom: number }>`
  position: absolute;
  bottom: ${(a) => a.bottom}px;
  display: flex;
  background: ${varButtonColor};
  color: white;
  padding: 10px 15px;
  border-radius: 10px;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 24px;
  margin: auto;
  gap: 1rem;
  cursor: pointer;
`

const VideoContainer = styled.div`
  width: 100%;
  height: 75%;
  display: flex;
  justify-content: center;
  align-items: flex-end;
`

const BottomText = styled.div`
  width: 100%;
  padding: 0 40px;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  margin-top: 20px;
  align-items: center;
  text-align: center;
`

const ClickAnim = styled(OnboardingAnimation)`
  position: relative;
  bottom: -20px;
`

interface VideoDets {
  src: string
  number1: number
  number2: number
}

const videoDetails: VideoDets[] = [
  { src: video812, number1: 8, number2: 12 },
  { src: video1020, number1: 10, number2: 20 },
  { src: video515, number1: 5, number2: 15 },
]

export const AppletG06NSC05S1GB02: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [videoEndReached, setVideoEndReached] = useState(false)
  const [showStartBtn, setShowStartBtn] = useState(true)
  const [indexOfVideo, setIndexOfVideo] = useState(0)
  const playMouseClick = useSFX('mouseClick')
  const [videoLoaded, setVideoLoaded] = useState(false)

  useEffect(() => {
    if (videoRef.current !== null) {
      setVideoLoaded(true)
    }
  }, [videoRef])

  const playVideo = () => {
    if (videoRef.current !== null) {
      playMouseClick()
      videoRef.current.play()
      setShowStartBtn(false)
    }
  }

  useEffect(() => {
    const video = videoRef.current

    const handleLoopPointReached = () => {
      if (video !== null && video.currentTime >= video.duration - 2) {
        setVideoEndReached(true)
      }
    }

    if (video !== null) {
      video.addEventListener('timeupdate', handleLoopPointReached)
    }

    return () => {
      if (video !== null) {
        video.removeEventListener('timeupdate', handleLoopPointReached)
      }
    }
  })

  function calculateLCM(a: number, b: number) {
    const num1 = new Fraction(a, 1)
    const num2 = new Fraction(b, 1)
    //return lcm of two numbers
    return num1.lcm(num2).n
  }

  const handleResetBtn = () => {
    playMouseClick()
    setVideoEndReached(false)
    setShowStartBtn(true)
    setIndexOfVideo((prev) => (prev + 1 === 3 ? 0 : prev + 1))
  }

  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#f6f6f6',
        id: 'g06-nsc05-s1-gb02',
        onEvent,
        className,
      }}
    >
      <TextHeader
        text="Discover LCM with lap times from a thrilling car race."
        backgroundColor="#F6F6F6"
        buttonColor="#1a1a1a"
      />
      <VideoContainer>
        <video ref={videoRef} src={videoDetails[indexOfVideo].src} />
      </VideoContainer>
      {videoLoaded && (
        <>
          {videoEndReached ? (
            <BottomText>
              The first time both cars meet again at the start line is at{' '}
              {calculateLCM(videoDetails[indexOfVideo].number2, videoDetails[indexOfVideo].number1)}{' '}
              seconds.
              <br /> As{' '}
              {calculateLCM(
                videoDetails[indexOfVideo].number2,
                videoDetails[indexOfVideo].number1,
              )}{' '}
              is the Lowest common multiple (LCM) of {videoDetails[indexOfVideo].number1} and{' '}
              {videoDetails[indexOfVideo].number2}.
            </BottomText>
          ) : (
            <BottomText> It&apos;s racetime</BottomText>
          )}
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            {showStartBtn && (
              <>
                <Btn bottom={50} onClick={playVideo}>
                  Start
                </Btn>
                <OnboardingController>
                  <OnboardingStep index={0}>
                    <ClickAnim type="click" complete={!showStartBtn} />
                  </OnboardingStep>
                </OnboardingController>
              </>
            )}
            {videoEndReached && (
              <Btn bottom={40} onClick={handleResetBtn}>
                <img src={tryNewIcon} alt="try new" />
                Try new
              </Btn>
            )}
          </div>
        </>
      )}
    </AppletContainer>
  )
}

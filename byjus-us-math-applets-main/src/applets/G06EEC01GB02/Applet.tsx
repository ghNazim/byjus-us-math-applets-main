import { FC, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { PrimaryRangeSlider } from '@/atoms/RangeSlider'
import { useRangeSliderContext } from '@/atoms/RangeSlider/RangeSliderContext'
import { AppletInteractionCallback } from '@/contexts/analytics'

import { AppletContainer } from '../../common/AppletContainer'
import { TextHeader } from '../../common/Header'
import video from './assets/earth.mp4'

const FRAMES = [
  { time: 0, title: 'Byjus Headquarters', label: '1 km' },
  { time: 168, title: 'Bangalore', label: '100 km' },
  { time: 349, title: 'South India', label: '1000 km' },
  { time: 463, title: 'Planet Earth', label: '10000 km' },
  { time: 493, title: 'Solar System', label: '10000000000 km' },
  { time: 643, title: 'Milky Way', label: '1000000000000000000 km ' },
  { time: 746, title: 'Local Galaxy Group', label: '10000000000000000000 km' },
  { time: 829, title: 'Cosmic Web', label: '10000000000000000000000 km' },
  { time: 888, title: 'Uniform Universe ', label: '100000000000000000000000 km' },
]

const DEFAULT_FRAME = {
  time: -1,
  title: 'ERROR',
  label: 'ERROR',
}

const MAX_TIME = 27.54166667

const findFrameIndex = (t: number) => {
  for (let i = FRAMES.length - 1; i >= 0; i--) {
    const frameData = FRAMES[i]
    if (t >= frameData.time) return frameData
  }

  return DEFAULT_FRAME
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  padding: 120px 32px 32px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: space-between;
`

const PlacedPlayer = styled.video`
  aspect-ratio: 16/9;
  border-radius: 10px;
`

const SliderContainer = styled.div`
  margin: 0px 60px;
  height: 60px;
`

const TitleContainer = styled.p`
  margin: 0px 0px -160px;
  color: #444444;
  font-size: 20px;
  font-weight: 700;
  line-height: 24px;
  font-family: 'Nunito';
  text-align: center;
`

const LabelContainer = styled.div`
  position: absolute;
  left: 50%;
  translate: -50%;
  bottom: 220px;
  color: #444444;
  font-size: 20px;
  font-weight: 700;
  line-height: 24px;
  font-family: 'Nunito';
  text-align: center;
  width: max-content;
  margin: 0;
  padding: 2px 4px 0px;
  border-radius: 2px;
`

export const AppletG06EEC01GB02: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const instance = useRef<HTMLVideoElement>(null)
  const [progress, setProgress] = useState(0)
  const { title, label } = findFrameIndex(progress)

  useEffect(() => {
    if (instance.current != null) {
      instance.current.currentTime = (progress / 1000) * MAX_TIME
    }
  }, [progress])

  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: ' #F6F6F6',
        id: 'G06EEC01GB02',
        onEvent,
        className,
        themeName: 'dark',
      }}
    >
      <TextHeader
        text="Use the slider and observe the increase in distance."
        backgroundColor=" #F6F6F6"
        buttonColor="#1A1A1A"
      />
      <Container>
        <TitleContainer>{title}</TitleContainer>
        <PlacedPlayer src={video} ref={instance} />
        <LabelContainer>{label}</LabelContainer>
        <SliderContainer>
          <PrimaryRangeSlider min={0} max={999} onChange={setProgress} />
        </SliderContainer>
      </Container>
    </AppletContainer>
  )
}

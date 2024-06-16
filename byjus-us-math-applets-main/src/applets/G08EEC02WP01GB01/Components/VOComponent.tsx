import React from 'react'
import styled, { keyframes } from 'styled-components'

import { VoiceOverCommon } from './VoiceOverCommon'

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`

const fadeOut = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`
const PageFeedbacks = styled.label<{ move?: boolean; fading?: boolean }>`
  position: absolute;
  top: ${({ move }) => (move ? '735px' : '640px')};
  left: 50%;
  transform: translateX(-50%);
  width: 500px;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;
  display: flex;
  align-items: center;
  text-align: center;
  justify-content: center;
  color: #444444;
  transition: 0.3s ease-out;
  animation: ${({ fading }) => (fading ? fadeOut : fadeIn)} 0.3s ease-out;
  opacity: ${({ fading }) => (fading ? 0 : 1)};
`

export interface SoundProps {
  enabled: boolean
  audioSrc: string
  children: string
  move?: boolean
  fading?: boolean
}

export const SoundVO: React.FC<SoundProps> = ({ enabled, audioSrc, children, ...props }) => {
  return (
    <PageFeedbacks {...props}>
      <VoiceOverCommon enabled={enabled} audioSrc={audioSrc} />
      {children}
    </PageFeedbacks>
  )
}

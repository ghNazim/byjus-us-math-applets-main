import React, { useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { AppletContainer } from '../../common/AppletContainer'
import { TextCallout } from '../../common/Callout'
import { Math } from '../../common/Math'
import { PageControl } from '../../common/PageControl'
import { AppletInteractionCallback } from '../../contexts/analytics'
import { useInterval } from '../../hooks/useInterval'
import { approxeq } from '../../utils/math'
import animation from './assets/animation.mp4'

const PlacedPlayer = styled.video`
  position: absolute;
  top: 20px;
  left: 54px;
`

const PlacedText = styled.div`
  position: absolute;
  bottom: 144px;
  left: 50%;
  translate: -50%;
  z-index: 1;

  width: 605px;

  color: #444 !important;
  font-family: 'Nunito';
  font-size: 20px;
  line-height: 28px;
  text-align: center;
`

const pageTimeStamps = [0, 0.14, 0.23, 0.54, 0.94, 1]

const pageTexts = [
  undefined,
  undefined,
  <p key={2}>
    The sphere has radius ‘<span style={{ color: '#2AD3F5' }}>r</span>’ and diameter ‘
    <span style={{ color: '#7F5CF4' }}>2r</span>’.
  </p>,
  <p key={3}>
    On unfolding the sphere, it has become a cylinder with radius ‘
    <span style={{ color: '#2AD3F5' }}>r</span>’, height ‘
    <span style={{ color: '#7F5CF4' }}>2r</span>’, and circumference ‘
    <span style={{ color: '#81B3FF' }}>2πr</span>’.
  </p>,
  <p key={4}>
    On opening the cylinder, it has become a rectangular surface of length ‘
    <span style={{ color: '#81B3FF' }}>2πr</span>’ and height ‘
    <span style={{ color: '#7F5CF4' }}>2r</span>’.
  </p>,
  <Math key={5} displayMode>
    {String.raw`
      \begin{align*}
      \text{Hence, Surface area of sphere}  &= \text{Area of transformed rectangle} \\
                                            &= \textcolor{#81B3FF}{Length} \times \textcolor{#7F5CF4}{Width} \\
                                            &= \textcolor{#81B3FF}{2\pi r} \times \textcolor{#7F5CF4}{2r} \\
                                            &= 4\pi r^2
      \end{align*}
    `}
  </Math>,
]

const Internal: React.FC = () => {
  const animationInstance = useRef<HTMLVideoElement>(null)
  const [progress, setProgress] = useState(0)
  const [pageIndex, setPageIndex] = useState(0)

  useInterval(
    () => {
      setProgress((p) => {
        if (p > pageTimeStamps[pageIndex]) return p - 0.01

        if (p < pageTimeStamps[pageIndex]) return p + 0.01
        return p
      })
    },
    approxeq(progress, pageTimeStamps[pageIndex]) ? null : 80,
  )

  useEffect(() => {
    if (pageIndex === 0) {
      setProgress(0)
    }
  }, [pageIndex])

  useEffect(() => {
    if (animationInstance.current == null) return
    const duration = animationInstance.current.duration
    animationInstance.current.currentTime = isFinite(duration) ? progress * duration : 0
  }, [progress])

  const onPageChange = useCallback((current: number) => setPageIndex(current), [])

  return (
    <>
      <PlacedText>
        {approxeq(progress, pageTimeStamps[pageIndex]) ? pageTexts[pageIndex] : null}
      </PlacedText>
      <PlacedPlayer src={animation} muted width={'85%'} height={'85%'} ref={animationInstance} />
      <PageControl total={6} onChange={onPageChange} />
    </>
  )
}

export const Applet01101Ge: React.FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  return (
    <AppletContainer
      {...{
        aspectRatio: 1,
        borderColor: '#444',
        id: '011_01_GE',
        onEvent,
        className,
      }}
    >
      <TextCallout
        backgroundColor={'#F1EDFF'}
        text={
          'Transform a spherical surface of radius ‘r’ into a rectangle to derive its surface area.'
        }
      />
      <Internal />
    </AppletContainer>
  )
}

import React, { useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { AppletContainer } from '../../common/AppletContainer'
import { TextHeader } from '../../common/Header'
import { Math as Latex } from '../../common/Math'
import { PageControl } from '../../common/PageControl'
import { AppletInteractionCallback } from '../../contexts/analytics'
import { useInterval } from '../../hooks/useInterval'
import { approxeq } from '../../utils/math'
import animation from './assets/animation.mp4'

const PlacedPlayer = styled.video`
  position: absolute;
  top: 90px;
  left: 130px;
  width: 400px;
  height: 400px;
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
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 52px;
  text-align: center;
`
const pageTexts = [
  undefined,
  <p key={1} className="math-bold">
    <Latex displayMode>
      {String.raw`
      \begin{align*}
      \text{Number of unit cubes in one layer}  &= \textcolor{#F0A000}{\text{unit cubes along length}}\times \textcolor{#F57A7A}{\text{unit cubes along width }}\\
                                            &= \textcolor{#F0A000}{\text{5 unit cubes}} \times \textcolor{#F57A7A}{\text{3 unit cubes}} \\
                                            &= {\text{15 unit cubes}}\\
      \end{align*}
    `}
    </Latex>
  </p>,
  <p key={2} className="math-bold">
    <Latex displayMode>
      {String.raw`
      \begin{align*}
      \text{Number of unit cubes} &= \textcolor{#1CB9D9}{\text{15}} + \textcolor{#1CB9D9}{\text{15}} + \textcolor{#1CB9D9}{\text{15}} + \textcolor{#1CB9D9}{\text{15}}
      \end{align*}
    `}
    </Latex>
  </p>,
  <p key={3} className="math-bold">
    <Latex displayMode>
      {String.raw`
    \begin{align*}
    \text{Number of unit cubes} &= \text{15} + \text{15} + \text{15} + \text{15} \\
                                &= \text{15} \times \textcolor{#C882FA}{\text{4}}
    \end{align*}
  `}
    </Latex>
  </p>,
  <p key={4} className="math-bold">
    <Latex displayMode>
      {String.raw`
  \begin{align*}
  \text{Number of unit cubes} &= \text{15} + \text{15} + \text{15} + \text{15} \\
                              &= (\textcolor{#F0A000}{\text{5}} \times \textcolor{#F57A7A}{\text{3}}) \times \textcolor{#C882FA}{\text{4}}
  \end{align*}
`}
    </Latex>
  </p>,
  <p key={5} className="math-bold">
    <Latex displayMode>
      {String.raw`
\begin{align*}
\text{Number of unit cubes} &= \text{15} + \text{15} + \text{15} + \text{15} \\
                            &= (\textcolor{#F0A000}{\text{5}} \times \textcolor{#F57A7A}{\text{3}}) \times \textcolor{#C882FA}{\text{4}} \\
                            &= \textcolor{#F0A000}{\text{length}} \times \textcolor{#F57A7A}{\text{width}} \times \textcolor{#C882FA}{\text{height}}
\end{align*}
`}
    </Latex>
  </p>,
  <p key={6} className="math-bold">
    <Latex displayMode>
      {String.raw`
  \begin{align*}
  \text{Note that volume of rectangular prism = unit cubes required to fill it completely}
  \end{align*}
`}
    </Latex>
    <Latex displayMode>
      {String.raw`
  \begin{align*}
\text{Volume of rectangular prism } = \textcolor{#F0A000}{\text{length}} \times \textcolor{#F57A7A}{\text{width}} \times \textcolor{#C882FA}{\text{height}}
  \end{align*}
`}
    </Latex>
  </p>,
]

const pageTimeStamps = [0, 0.5, 1, 1, 1, 1, 1]
const page2IntervalTexts = [
  <p key={0} className="math-bold">
    <Latex displayMode>
      {String.raw`
      \begin{align*}
      \text{Number of unit cubes} &= \textcolor{#1CB9D9}{\text{15}}
      \end{align*}
    `}
    </Latex>
  </p>,
  <p key={1} className="math-bold">
    <Latex displayMode>
      {String.raw`
      \begin{align*}
      \text{Number of unit cubes} &= \textcolor{#1CB9D9}{\text{15}} + \textcolor{#1CB9D9}{\text{15}}
      \end{align*}
    `}
    </Latex>
  </p>,
  <p key={2} className="math-bold">
    <Latex displayMode>
      {String.raw`
      \begin{align*}
      \text{Number of unit cubes} &= \textcolor{#1CB9D9}{\text{15}} + \textcolor{#1CB9D9}{\text{15}} + \textcolor{#1CB9D9}{\text{15}}
      \end{align*}
    `}
    </Latex>
  </p>,
  <p key={3} className="math-bold">
    <Latex displayMode>
      {String.raw`
      \begin{align*}
      \text{Number of unit cubes} &= \textcolor{#1CB9D9}{\text{15}} + \textcolor{#1CB9D9}{\text{15}} + \textcolor{#1CB9D9}{\text{15}} + \textcolor{#1CB9D9}{\text{15}}
      \end{align*}
    `}
    </Latex>
  </p>,
]

const page2IntervalTimeStamps = [0.5, 0.67, 0.83, 1, 1, 1]

const Internal: React.FC = () => {
  const animationInstance = useRef<HTMLVideoElement>(null)
  const [progress, setProgress] = useState(0)
  const [pageIndex, setPageIndex] = useState(0)
  const [page2IntervalIndex, setPage2IntervalIndex] = useState(0)

  useInterval(
    () => {
      setProgress((p) => {
        if (p > pageTimeStamps[pageIndex]) return p - 0.01

        if (p < pageTimeStamps[pageIndex]) return p + 0.01
        return p
      })
    },
    approxeq(progress, pageTimeStamps[pageIndex]) ? null : 40,
  )

  useEffect(() => {
    if (animationInstance.current == null) return
    const duration = animationInstance.current.duration

    animationInstance.current.currentTime = progress * (!isNaN(duration) ? duration : 0)
  }, [progress])

  useEffect(() => {
    if (pageIndex === 1) {
      setPage2IntervalIndex(0)
    }
    if (pageIndex === 2) {
      setPage2IntervalIndex((i) =>
        progress > page2IntervalTimeStamps[i + 1] ? Math.min(i + 1, 3) : i,
      )
    }
  }, [pageIndex, progress])

  const onPageChange = useCallback((current: number) => setPageIndex(current), [])
  // const onClickReset = () => {}

  return (
    <>
      <PlacedText>
        {pageIndex === 2
          ? page2IntervalTexts[page2IntervalIndex]
          : approxeq(progress, pageTimeStamps[pageIndex])
          ? pageTexts[pageIndex]
          : null}
      </PlacedText>
      <PlacedPlayer src={animation} muted width={'58%'} height={'58%'} ref={animationInstance} />
      <PageControl total={7} onChange={onPageChange} onReset={() => setProgress(0)} />
    </>
  )
}

export const Applet00402Ge: React.FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  return (
    <AppletContainer
      {...{
        aspectRatio: 1,
        borderColor: '#FFF6DB',
        id: '004_02_GE',
        onEvent,
        className,
      }}
    >
      <TextHeader
        text="Fill the given rectangular prism with unit cubes to find out the formula for volume of the rectangular prism."
        backgroundColor="#FFF6DB"
        buttonColor="#FFEDB8"
      />
      <Internal />
    </AppletContainer>
  )
}

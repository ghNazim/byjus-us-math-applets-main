import React, { useCallback, useEffect, useRef, useState } from 'react'
import styled, { keyframes } from 'styled-components'
import { useTransition } from 'transition-hook'

import { AppletContainer } from '../../common/AppletContainer'
import { TextCallout } from '../../common/Callout'
import { Geogebra } from '../../common/Geogebra'
import { GeogebraAppApi } from '../../common/Geogebra/Geogebra.types'
import { Math } from '../../common/Math'
import { PageControl } from '../../common/PageControl'
import { AppletInteractionCallback } from '../../contexts/analytics'
import { useInterval } from '../../hooks/useInterval'
import { Table } from './Table/Table'

const Bold = styled.b`
  .katex {
    .mathdefault,
    .mathnormal,
    .mord,
    .mathbf {
      font-family: 'Nunito', sans-serif !important;
    }
  }
`

const Texts = [
  <Math key={0} displayMode>{String.raw`
  \begin{align*}
    \text{When } \theta &= 360\degree , \\
    \text{A} &= \text{Area of circle}
  \end{align*}
  `}</Math>,
  <Math key={1} displayMode>{String.raw`
  \begin{align*}
    \text{When } \theta &= 270\degree , \\
    \text{A} &= \frac{3}{4} \times \text{Area of circle}
  \end{align*}
  `}</Math>,
  <Math key={2} displayMode>{String.raw`
  \begin{align*}
    \text{When } \theta &= 180\degree , \\
    \text{A} &= \frac{1}{2} \times \text{Area of circle}
  \end{align*}
  `}</Math>,
  <Math key={3} displayMode>{String.raw`
  \begin{align*}
    \text{When } \theta &= 90\degree , \\
    \text{A} &= \frac{1}{4} \times \text{Area of circle}
  \end{align*}
  `}</Math>,
  <p key={4}>
    Note that a <b>constant</b> is multiplied to the area of the circle to get the area of the
    sector
  </p>,
  <p key={5}>
    The constant is equal to{' '}
    <Bold>
      <Math>{String.raw`\mathbf{\Large\frac{\theta}{360}}`}</Math>
    </Bold>
  </p>,
  <div key={6}>
    <Bold>
      Hence, area of the sector (A) =
      <Math>{String.raw`\bf \mathbf{\Large\frac{{\mathbf{\theta}}}{\mathbf{360}}} \mathbf{\times} \mathbf{\pi r^2}`}</Math>
    </Bold>
  </div>,
]
const PlaceGGBAndTable = styled.div`
  position: absolute;
  width: 656px;
  top: 140px;
  left: 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const fadeInRight = keyframes`
  from {
    opacity: 0;
    transform: translate3d(100%, 0, 0);
  }

  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
`

const PlaceText = styled.div<{ delay: number }>`
  position: absolute;
  top: 526px;
  left: 50%;
  translate: -50%;
  width: 600px;
  color: #444;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 400;
  font-size: 24px;
  line-height: 32px;
  text-align: center;

  animation-duration: 500ms;
  animation-timing-function: ease;
  animation-delay: ${(props) => props.delay}s;
  animation-iteration-count: 1;
  animation-direction: normal;
  animation-fill-mode: both;
  animation-play-state: running;
  animation-name: ${fadeInRight};
`

export const Applet01902Ge: React.FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#444',
        id: '019_02_GE',
        onEvent,
        className,
      }}
    >
      <TextCallout
        backgroundColor={'#F4E5FF'}
        text={
          'Observe the relationship between angle of sector (θ) and area of sector (A) to derive the formula.'
        }
      />
      <Internal />
    </AppletContainer>
  )
}
const rowsData = [
  [
    {
      θ: String.raw`360\degree`,
      A: String.raw`\pi r^2`,
    },
    {
      θ: String.raw`270\degree`,
      A: String.raw`{\Large\frac{3}{4}} \times \pi r^2`,
    },
    {
      θ: String.raw`180\degree`,
      A: String.raw`{\Large\frac{1}{2}} \times \pi r^2`,
    },
    {
      θ: String.raw`90\degree`,
      A: String.raw`{\Large\frac{1}{4}} \times \pi r^2`,
    },
  ],
  [
    {
      θ: String.raw`\htmlStyle{color:#646464}{360\degree}`,
      A: String.raw`\mathbf{1} \htmlStyle{color:#646464}{\times \pi r^2}`,
    },
    {
      θ: String.raw`\htmlStyle{color:#646464}{270\degree}`,
      A: String.raw`\mathbf{\Large\frac{3}{4}} \htmlStyle{color:#646464}{\times \pi r^2}`,
    },
    {
      θ: String.raw`\htmlStyle{color:#646464}{180\degree}`,
      A: String.raw`\mathbf{\Large\frac{1}{2}} \htmlStyle{color:#646464}{\times \pi r^2}`,
    },
    {
      θ: String.raw`\htmlStyle{color:#646464}{90\degree}`,
      A: String.raw`\mathbf{\Large\frac{1}{4}} \htmlStyle{color:#646464}{\times \pi r^2}`,
    },
  ],
  [
    {
      θ: String.raw`\htmlStyle{color:#646464}{360\degree}`,
      A: String.raw`\mathbf{\Large\frac{360\degree}{360}} \htmlStyle{color:#646464}{\times \pi r^2}`,
    },
    {
      θ: String.raw`\htmlStyle{color:#646464}{270\degree}`,
      A: String.raw`\mathbf{\Large\frac{270\degree}{360}} \htmlStyle{color:#646464}{\times \pi r^2}`,
    },
    {
      θ: String.raw`\htmlStyle{color:#646464}{180\degree}`,
      A: String.raw`\mathbf{\Large\frac{180\degree}{360}} \htmlStyle{color:#646464}{\times \pi r^2}`,
    },
    {
      θ: String.raw`\htmlStyle{color:#646464}{90\degree}`,
      A: String.raw`\mathbf{\Large\frac{90\degree}{360}} \htmlStyle{color:#646464}{\times \pi r^2}`,
    },
  ],
]

const GGB = styled(Geogebra)<{ isCentered: boolean }>`
  position: relative;
  left: ${(props) => (props.isCentered ? '50%' : '0px')};
  translate: ${(props) => (props.isCentered ? '-50%' : '0px')};
  transition: 0.5s;
`
const progressBreakpoints = [100, 75, 50, 25, 25, 25, 15]

const Internal: React.FC = () => {
  const ggbApi = useRef<GeogebraAppApi | null>(null)
  const [progressTarget, setProgressTarget] = useState(100)
  const [progress, setProgress] = useState(100)
  const [pageIndex, setPageIndex] = useState(0)
  const tableVisibility = useTransition(pageIndex < 6, 500)

  useInterval(
    () => {
      setProgress((p) => {
        if (p < progressTarget) return p + 1
        if (p > progressTarget) return p - 1
        return p
      })
    },
    progress !== progressTarget ? 50 : null,
  )

  const onHandleGGB = useCallback((api: GeogebraAppApi | null) => {
    ggbApi.current = api
  }, [])

  const onPageChange = useCallback((current: number) => setPageIndex(current), [])

  useEffect(() => {
    const api = ggbApi.current
    if (api == null) return

    if (progress <= 15) {
      api.setValue('a', 1)
    } else {
      api.setValue('a', 0)
    }
    ggbApi.current?.setValue('p', progress / 100)
  }, [progress])

  useEffect(() => {
    setProgressTarget(progressBreakpoints[pageIndex])
    if (pageIndex === 0) setProgress(progressBreakpoints[pageIndex])
  }, [pageIndex])

  const tableDataIndex = pageIndex > 4 ? 2 : pageIndex > 3 ? 1 : 0

  return (
    <>
      <PlaceGGBAndTable>
        <GGB
          width={360}
          height={350}
          materialId="spxbfnxa"
          onApiReady={onHandleGGB}
          isCentered={tableVisibility.stage === 'leave'}
        />
        {tableVisibility.shouldMount && (
          <Table
            visible={tableVisibility.stage === 'enter'}
            rows={rowsData[tableDataIndex].slice(0, pageIndex + 1)}
            activeRow={pageIndex}
          />
        )}
      </PlaceGGBAndTable>
      <PlaceText delay={pageIndex == 0 || pageIndex == 4 || pageIndex == 5 ? 0 : 1} key={pageIndex}>
        {Texts[pageIndex]}
      </PlaceText>
      <PageControl total={7} onChange={onPageChange} />
    </>
  )
}

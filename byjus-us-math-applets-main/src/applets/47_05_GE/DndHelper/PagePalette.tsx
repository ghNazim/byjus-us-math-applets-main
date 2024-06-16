import React, { Children, ReactNode, useContext, useEffect } from 'react'
import styled from 'styled-components'

import { useSFX } from '@/hooks/useSFX'

import { PageControlProps } from '../../../common/PageControl/PageControl.types'
import { AnalyticsContext } from '../../../contexts/analytics'
import { useStep } from '../../../hooks/useStep'
import { NextButton, PrevButton } from './Buttons'

const PageBackground = styled.div`
  position: absolute;
  width: 665px;
  height: 200px;
  left: 27px;
  top: 498px;
  background: #e7fbff;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
`
interface PagePalette extends PageControlProps {
  children: ReactNode
  elementsPerPage: number
}
const ElementContainer = styled.div`
  width: 84%;
  display: flex;
  align-items: center;
  justify-content: space-around;
  /* padding-left: 20px;*/
  /* gap: 50px; */
`
export const PagePalette: React.FC<PagePalette> = ({
  children,
  current: initial,
  total,
  elementsPerPage,
  nextDisabled = false,
  backDisabled = false,
  onChange,
}) => {
  const [current, { canGoToNextStep, canGoToPrevStep, goToNextStep, goToPrevStep, reset }] =
    useStep(0, total - 1, 1, initial)

  useEffect(() => {
    onChange?.(current)
  }, [current, onChange])

  const playClick = useSFX('mouseClick')
  const onInteraction = useContext(AnalyticsContext)

  return (
    <PageBackground data-testid="Page">
      {/* <PageIndicator active={current} total={total} /> */}
      <PrevButton
        disabled={!canGoToPrevStep || backDisabled}
        onClick={() => {
          goToPrevStep()
          onInteraction('previous')
          playClick()
        }}
      />
      <ElementContainer>
        {Children.map(children, (child, i) => {
          if (!canGoToNextStep) {
            if (i >= Children.count(children) - elementsPerPage) return child
          } else if (
            i >= elementsPerPage * current &&
            i < elementsPerPage * current + elementsPerPage
          )
            return child
        })}
      </ElementContainer>
      <NextButton
        disabled={!canGoToNextStep || nextDisabled}
        onClick={() => {
          goToNextStep()
          onInteraction('next')
          playClick()
        }}
      />
    </PageBackground>
  )
}

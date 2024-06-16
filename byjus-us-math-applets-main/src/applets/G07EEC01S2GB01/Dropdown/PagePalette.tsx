import React, { Children, ReactNode, useContext, useEffect } from 'react'
import styled from 'styled-components'

import { AnalyticsContext } from '@/contexts/analytics'
import { useSFX } from '@/hooks/useSFX'

import { PageControlProps } from '../../../common/PageControl/PageControl.types'
import { useStep } from '../../../hooks/useStep'
import { NextButton, PrevButton } from './Buttons'

interface PagePalette extends Omit<PageControlProps, 'total'> {
  children: ReactNode
  elementsPerPage: number
}

export const PagePalette: React.FC<PagePalette> = ({
  children,
  current: initial,
  elementsPerPage,
  onChange,
  nextDisabled = false,
  backDisabled = false,
}) => {
  const max = Math.ceil(Children.count(children) / elementsPerPage) - 1
  const [current, { canGoToNextStep, canGoToPrevStep, goToNextStep, goToPrevStep }] = useStep(
    0,
    max,
    1,
    initial,
  )

  useEffect(() => {
    onChange?.(current)
  }, [current, onChange])

  const playClick = useSFX('mouseClick')
  const onInteraction = useContext(AnalyticsContext)

  return (
    <>
      {max > 0 && (
        <PrevButton
          disabled={!canGoToPrevStep || backDisabled}
          onClick={(e) => {
            e.stopPropagation()
            goToPrevStep()
            onInteraction('previous')
            playClick()
          }}
        />
      )}

      {Children.map(children, (child, i) => {
        if (!canGoToNextStep) {
          if (i >= Children.count(children) - elementsPerPage) return child
        } else if (
          i >= elementsPerPage * current &&
          i < elementsPerPage * current + elementsPerPage
        )
          return child
      })}
      {max > 0 && (
        <NextButton
          disabled={!canGoToNextStep || nextDisabled}
          onClick={(e) => {
            e.stopPropagation()
            goToNextStep()
            onInteraction('next')
            playClick()
          }}
        />
      )}
    </>
  )
}

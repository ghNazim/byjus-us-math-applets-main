import styled, { css } from 'styled-components'

import { Animal } from './Applet.types'

export const RABBIT_STROKE_COLOR = '#FF8F1F'
export const RABBIT_BG_COLOR = '#FFE9D4'
export const DOG_STROKE_COLOR = '#AA5EE0'
export const DOG_BG_COLOR = '#F4E5FF'
export const CAT_STROKE_COLOR = '#2D6066'
export const CAT_BG_COLOR = '#DFF1F1'

import { OnboardingAnimation } from '@/atoms/OnboardingAnimation'

import arrowImage from './assets/arrow.svg'
import catImage from './assets/cat.png'
import dogImage from './assets/dog.png'
import rabbitImage from './assets/rabbit.png'
import sandbagImage from './assets/sandbag.svg'

export const animalImages = {
  cat: catImage,
  dog: dogImage,
  rabbit: rabbitImage,
}

const animalColors = {
  rabbit: {
    stroke: RABBIT_STROKE_COLOR,
    bg: RABBIT_BG_COLOR,
  },
  dog: {
    stroke: DOG_STROKE_COLOR,
    bg: DOG_BG_COLOR,
  },
  cat: {
    stroke: CAT_STROKE_COLOR,
    bg: CAT_BG_COLOR,
  },
}

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 20px;
  margin-top: 90px;
  gap: 20px;
`

export const FeedbackContainer = styled.div`
  height: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  color: var(--monotone-100, #444);
  text-align: center;

  /* Sub heading/Bold */
  font-family: Nunito;
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: 28px; /* 140% */
`

export const InteractionContainer = styled.div`
  height: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

export const CtaContainer = styled.div`
  position: relative;
  height: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

export const CtaButton = styled.button`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 16px 24px;
  gap: 8px;

  border: none;
  margin: 0px;

  height: 60px;

  background: #1a1a1a;
  border-radius: 10px;

  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 24px;
  line-height: 32px;
  color: #ffffff;

  cursor: auto;
  scale: 1;

  &:hover {
    cursor: pointer;
    scale: 1.1;
  }

  &:disabled {
    opacity: 0.2;
    cursor: not-allowed;
    scale: 1;
  }

  transition: 300ms;
`

export const ToggleContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 40px;
`

const deselectedState = css`
  border: 1px solid #c7c7c7;
  box-shadow: 0px -4px 0px 0px #c7c7c7 inset;
`
const selectedState = css<{ animal?: Animal }>`
  border: 1px solid #1a1a1a;
  box-shadow: none;
  & > div {
    background-color: ${({ animal }) => (animal ? animalColors[animal].bg : '#ffffff')};
  }
`

export const Toggle = styled.button<{ isSelected: boolean; animal: Animal }>`
  width: 100px;
  height: 100px;
  padding: 4px;
  border-radius: 12px;
  scale: 1;

  cursor: pointer;
  outline: none;
  transition: scale 0.2s ease-in-out;

  &:hover {
    scale: 1.1;
  }

  &:disabled {
    cursor: not-allowed;
    scale: 1;
    opacity: 0.5;
  }

  & > div {
    width: 100%;
    height: 100%;
    border-radius: 8px;
    padding: 4px;

    & > img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }

  ${(props) => (props.isSelected ? selectedState : deselectedState)}
`

export const PanAnimalContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  justify-content: space-around;
  gap: 10px;

  img {
    margin-right: -60px;
    margin-left: -60px;
  }
`

function outlineShadow(color: string, prependFilter?: string, appendFilter?: string) {
  const offset = 1
  const radius = 1
  return `filter: ${prependFilter || ''}
          drop-shadow(-${offset}px 0 ${radius}px ${color})
          drop-shadow(0 -${offset}px ${radius}px ${color})
          drop-shadow(${offset}px 0 ${radius}px ${color})
          drop-shadow(0 ${offset}px ${radius}px ${color})
          ${appendFilter || ''};`
}

export const PanImage = styled.img.attrs<{ animal: Animal }>(({ animal }) => ({
  src: animalImages[animal],
}))<{ animal: Animal; highlight?: boolean; mode?: 'default' | 'incorrect' }>`
  width: 70px;
  object-fit: contain;
  ${(props) => props.animal === 'rabbit' && 'margin-bottom: -3.5px;'}
  ${(props) => props.highlight && outlineShadow(props.mode === 'incorrect' ? '#BA5471' : '#1CB9D9')}
`

export const HighlightedText = styled.span<{ animal: Animal }>`
  color: ${(props) => animalColors[props.animal].stroke};
  background-color: ${(props) => animalColors[props.animal].bg};
  padding: 0px 5px;
  border-radius: 6px;
`

export const ReviewGrid = styled.div`
  display: grid;
  grid-template-columns: 0.7fr 1.1fr 1.1fr 1.1fr;
  grid-template-rows: 1fr 1fr;
  background-color: #1a1a1a;
  gap: 1px;
  height: 166px;
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid #1a1a1a;
`

const Cell = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  & > img {
    width: 68px;
    height: 68px;
    margin: 5px 32px;
    height: 100%;
    object-fit: contain;
  }
`

export const CatCell = styled(Cell)`
  background-color: ${CAT_BG_COLOR};
`

export const DogCell = styled(Cell)`
  background-color: ${DOG_BG_COLOR};
`

export const RabbitCell = styled(Cell)`
  background-color: ${RABBIT_BG_COLOR};
`

export const WhiteCell = styled(Cell)`
  background-color: #ffffff;
  padding: 0px 10px;
  color: var(--monotone-100, #444);
  text-align: center;

  /* Sub heading/Bold */
  font-family: Nunito;
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: 28px; /* 140% */
`

export const DisabledCell = styled(Cell)`
  background-color: #ececec;
  & > * {
    opacity: 0.5;
  }
`

export const WhiteTotalCell = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  padding: 0px 10px;
  gap: 2px;

  & > img {
    width: 40px;
    height: 40px;
    height: 100%;
    object-fit: contain;
  }

  & > [data-animal='cat'] {
    margin: 5px -8px;
  }

  & > [data-animal='dog'] {
    margin: 5px -8px;
  }

  & > [data-animal='rabbit'] {
    margin: 5px -14px;
  }

  & > img[data-disable='true'] {
    opacity: 0.5;
  }

  color: var(--monotone-100, #444);
  text-align: center;
  background-color: #ffffff;

  /* Sub heading/Bold */
  font-family: Nunito;
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: 28px; /* 140% */
`

export const ReviewTotalGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(200px, auto) auto;
  grid-template-rows: 60px 80px;
  background-color: #1a1a1a;
  gap: 1px;
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid #1a1a1a;
  max-width: 95%;
`

export const VisualArea = styled.div<{ showGreenBackground?: boolean }>`
  position: relative;
  width: 680px;
  height: 400px;
  border-radius: 20px;
  background-color: ${(props) => (props.showGreenBackground ? '#ECFFD9' : '#f3f7fe')};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 40px;
`

export const SandbagContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap-reverse;
  width: 98%;
  justify-content: center;
  justify-items: center;
  align-content: end;
`

export const SandbagImage = styled.img.attrs({ src: sandbagImage })<{
  mode?: 'default' | 'incorrect'
  isHighlighted?: boolean
}>`
  margin-left: -10px;
  margin-right: -10px;
  ${(props) => (props.isHighlighted ? 'z-index: 10;' : '&:nth-child(-2n + 9) {z-index: 1;}')}
  &:nth-child(n + 10) {
    margin-bottom: -20px;
  }
  ${({ mode = 'default', isHighlighted = false }) =>
    isHighlighted && outlineShadow(mode === 'incorrect' ? '#BA5471' : '#1CB9D9')}
`

export const InfoButtonContainer = styled.button<{ isOpen: boolean }>`
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  padding: 4px;
  border-radius: 12px;
  scale: 1;
  z-index: 10;

  cursor: pointer;
  outline: none;
  transition: scale 0.2s ease-in-out;

  &:hover {
    scale: 1.1;
  }

  &:disabled {
    cursor: not-allowed;
    scale: 1;
    opacity: 0.5;
  }

  ${(props) => (props.isOpen ? selectedState : deselectedState)}

  width: 48px;
  height: 48px;
`

export const InfoPopupBackgroundBlur = styled.div`
  position: absolute;
  left: 0px;
  top: 0px;
  backdrop-filter: blur(3px);
  width: 100%;
  height: 100%;
`

export const InfoPopupContainer = styled.div`
  position: absolute;
  top: 86px;
  right: 30px;
  width: 618px;
  padding: 20px;

  background: #ffffff;
  border-radius: 8px;
  border: 1px solid #1a1a1a;

  display: flex;
  justify-content: center;
  align-items: center;

  &::after {
    content: '';
    background-image: url(${arrowImage});
    background-size: contain;
    background-repeat: no-repeat;

    position: absolute;
    top: -8px;
    right: 5px;
    width: 28px;
    height: 8px;
  }
`

export const HighlightedExpression = styled.span<{ animal: Animal }>`
  color: ${(props) => animalColors[props.animal].stroke};
  background-color: ${(props) => animalColors[props.animal].bg};
  padding: 0px 5px;
  border-radius: 5px;
  border: 1px solid ${(props) => animalColors[props.animal].stroke};
`

export const DraggablesContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 40px;
`

export const DragBox = styled.div`
  width: 60px;
  height: 60px;
  padding: 8px;
  border-radius: 12px;
  scale: 1;
  touch-action: none;
  cursor: pointer;
  outline: none;
  transition: scale 0.2s ease-in-out;

  &:hover {
    scale: 1.1;
  }

  &[data-is-dragging='true'] {
    scale: 0.8;
  }

  &:disabled {
    cursor: not-allowed;
    scale: 1;
    opacity: 0.5;
  }

  & > img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  ${deselectedState}
`

export const DropZone = styled.div<{ showWrong: boolean }>`
  width: 60px;
  height: 60px;
  padding: 8px;
  border-radius: 12px;
  border: 1px solid ${(props) => (props.showWrong ? '#CC6666' : '#1a1a1a')};
  background: ${(props) => (props.showWrong ? '#FFF2F2' : '#c7c7c7')};

  & > img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    scale: 1;
    transition: scale 0.2s ease-in-out;

    &[data-is-over='true'] {
      scale: 0.8;
    }
  }
`

export const AnimalZone = styled.div<{ animal: Animal }>`
  width: 60px;
  height: 60px;
  padding: 8px;
  border-radius: 12px;
  border: 1px solid ${(props) => animalColors[props.animal].stroke};
  background-color: ${(props) => animalColors[props.animal].bg};

  & > img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`

export const ToggleClickOnboarding = styled(OnboardingAnimation).attrs({ type: 'click' })`
  position: absolute;
  bottom: -70px;
  left: -20px;
`

export const CTAClickOnboarding = styled(OnboardingAnimation).attrs({ type: 'click' })`
  position: absolute;
  bottom: -70px;
  left: 50%;
  translate: -50%;
`

export const InfoClickOnboarding = styled(OnboardingAnimation).attrs({ type: 'click' })`
  position: absolute;
  bottom: -80px;
  left: 50%;
  translate: -50%;
`

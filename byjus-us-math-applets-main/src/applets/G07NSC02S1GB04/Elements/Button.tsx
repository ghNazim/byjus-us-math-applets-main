import { FC, useContext } from 'react'
import styled from 'styled-components'

import { AnalyticsContext } from '@/contexts/analytics'
import { useSFX } from '@/hooks/useSFX'

const Empty = styled.div`
  height: 60px;
`

const ButtonElement = styled.button<{ buttonType: string }>`
  /* position: absolute;
  bottom: 25px;
  left: 270px; */

  height: 60px;
  border: none;
  background: #${(props) => (props.buttonType === 'reset' ? 'ffffff' : '1A1A1A')};
  border-radius: 10px;
  cursor: pointer;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 24px;
  line-height: 42px;
  text-align: center;
  color: #${(props) => (props.buttonType === 'reset' ? '1A1A1A' : 'ffffff')};
  align-items: center;
  display: flex;
  justify-content: center;
  border: 2px solid #1a1a1a;
  gap: 20px;
  padding-right: 20px;
  padding-left: 20px;
  &:disabled {
    cursor: default;
    opacity: 0.2;
  }
  &:hover {
    background: #${(props) => (props.buttonType === 'reset' ? 'eee' : '222')};
  }
  &:active {
    background: #${(props) => (props.buttonType === 'reset' ? 'eee' : '444')};
    font-weight: 900;
  }
`

const ButtonHolder = styled.div`
  position: absolute;
  bottom: 5px;

  display: flex;
  align-content: center;
  justify-content: center;

  width: 100%;
  height: 80px;
`

interface IButton {
  image: boolean
  text: string
  imagePath?: string
}

import Generate from './assets/Generate.svg'
import PlotImg from './assets/PlotImg.svg'
import TryNew from './assets/TryNew.svg'
import Visualize from './assets/Visualize.svg'

const buttonProps: IButton[] = [
  { image: false, text: 'Add' },
  { image: false, text: 'Next' },
  { image: true, text: 'Plot', imagePath: PlotImg },
  { image: true, text: 'Generate', imagePath: Generate },
  { image: true, text: 'Try new', imagePath: TryNew },
  { image: true, text: 'Visualize', imagePath: Visualize },
]

export const Button: FC<{
  buttonType: 'Add' | 'Next' | 'Plot' | 'Generate' | 'Try new' | 'Disable' | 'Visualize' | string
  onClick: () => void
}> = ({ onClick, buttonType }) => {
  const playMouseClick = useSFX('mouseClick')
  const onInteraction = useContext(AnalyticsContext)

  const propReturn = (buttonType: string) => {
    for (let i = 0; i < buttonProps.length; i++) {
      if (buttonType === buttonProps[i].text) {
        return (
          <>
            {buttonProps[i].image === true ? <img src={buttonProps[i].imagePath} /> : null}
            {buttonProps[i].text}
          </>
        )
      }
    }
  }

  return buttonType != 'Disable' ? (
    <ButtonHolder>
      <ButtonElement
        buttonType={buttonType}
        onClick={() => {
          onClick()
          playMouseClick()
          onInteraction('tap')
        }}
      >
        {propReturn(buttonType === 'Visualize' ? 'Next' : buttonType)}
      </ButtonElement>
    </ButtonHolder>
  ) : (
    <Empty />
  )
}

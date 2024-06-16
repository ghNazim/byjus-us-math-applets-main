import { FC, useContext } from 'react'
import styled from 'styled-components'

import { AnalyticsContext } from '@/contexts/analytics'
import { useSFX } from '@/hooks/useSFX'

const Empty = styled.div`
  height: 60px;
`

const ButtonElement = styled.button<{ buttonType: string }>`
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

// import Generate from './assets/Generate.svg'
import Retry from './Retry.svg'
import TryNew from './TryNew.svg'

const buttonProps: IButton[] = [
  { image: false, text: 'Check' },
  { image: false, text: 'Start' },
  { image: false, text: 'Next' },
  { image: true, text: 'Retry', imagePath: Retry },
  // { image: true, text: 'Generate', imagePath: Generate },
  { image: true, text: 'TryNew', imagePath: TryNew },
]

export const Button: FC<{
  buttonType: 'Start' | 'Next' | 'Plot' | 'Generate' | 'TryNew' | 'Disable' | string
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
        {propReturn(buttonType)}
      </ButtonElement>
    </ButtonHolder>
  ) : (
    <Empty />
  )
}

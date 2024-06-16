import React, { useContext } from 'react'
import styled from 'styled-components'

// import mouseClick from '../../../common/sfx/mouseClick.mp3'
import { AnalyticsContext } from '../../../contexts/analytics'
import { buttonStyle } from './Template.tyles'
import tryNew from './tryNew.svg'

export interface ButtonProps {
  disable?: boolean
  onClick: () => void
  type: string
}

const defaultStyle: buttonStyle = {
  width: 160,
  height: 60,
  border: 'none',
  borderRadius: 10,
  cursor: 'pointer',
  backgroundColor: '#1A1A1A',
  fontFamily: 'Nunito',
  fontWeight: 500,
  fontSize: 24,
  fontColor: '#fff',
}

const ButtonElement = styled.button<{ buttonStyle: buttonStyle }>`
  width: ${(props) => props.buttonStyle.width}px;
  height: ${(props) => props.buttonStyle.height}px;
  border: ${(props) => props.buttonStyle.border};
  background: ${(props) => props.buttonStyle.backgroundColor};
  border-radius: ${(props) => props.buttonStyle.borderRadius}px;
  cursor: ${(props) => props.buttonStyle.cursor};
  font-family: ${(props) => props.buttonStyle.fontFamily};
  font-style: normal;
  font-weight: ${(props) => props.buttonStyle.fontWeight};
  font-size: ${(props) => props.buttonStyle.fontSize}px;
  line-height: 42px;
  text-align: center;
  color: ${(props) => props.buttonStyle.fontColor};
  align-items: center;
  display: flex;
  justify-content: center;
  &:disabled {
    cursor: default;
    opacity: 0.2;
  }
  &:hover {
    background: ${(props) => props.buttonStyle.hoverColor};
  }
  &:active {
    background: #${(props) => props.buttonStyle.activeColor};
  }
`

const buttonType = (type: string) => {
  switch (type) {
    case 'check':
      return 'Check'
    case 'tryNew':
      return <img src={tryNew} />
  }
}

export const Button: React.FC<ButtonProps> = ({ type = 'check', disable = false, onClick }) => {
  // const [playMouseClick] = useSound(mouseClick)
  const onInteraction = useContext(AnalyticsContext)
  return (
    <ButtonElement
      buttonStyle={defaultStyle}
      disabled={disable}
      onClick={() => {
        onClick()
        // playMouseClick()
        onInteraction('tap')
      }}
    >
      {buttonType(type)}
    </ButtonElement>
  )
}

import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

interface Buttonprops {
  label: string
  canInteract: boolean
  isCorrectOption: boolean
  onClick: () => void
}

interface CircleColorProps {
  border: string
  InnerCircledisplay: string
  InnerCirlceColor: string
}

interface InnerCircleStateProps {
  default: CircleColorProps
  correctOption: CircleColorProps
  wrongOption: CircleColorProps
  inActive: CircleColorProps
}

interface ButtonColorProps {
  color: string
  background: string
  border: string
  boxShadow: string
  innerCircle: CircleColorProps
  height: string
  cursor: string
}

interface ButtonStateProps {
  default: ButtonColorProps
  correctOption: ButtonColorProps
  wrongOption: ButtonColorProps
  inActive: ButtonColorProps
}

const CircleColors: InnerCircleStateProps = {
  default: {
    border: '2px solid #6549C2',
    InnerCircledisplay: 'none',
    InnerCirlceColor: 'transparent',
  },
  correctOption: {
    border: '2px solid #6CA621',
    InnerCircledisplay: 'flex',
    InnerCirlceColor: '#6CA621',
  },
  wrongOption: {
    border: ' 2px solid #CC6666',
    InnerCircledisplay: 'flex',
    InnerCirlceColor: '#CC6666',
  },
  inActive: {
    border: ' 2px solid #646464',
    InnerCircledisplay: 'none',
    InnerCirlceColor: 'transparent',
  },
}

const ButtonStates: ButtonStateProps = {
  default: {
    color: '#6549C2',
    background: '#fff',
    border: '1px solid #D9CDFF',
    boxShadow: ' inset 0px -4px 0px #DAD2F7',
    innerCircle: CircleColors.default,
    height: '60px',
    cursor: 'pointer',
  },
  correctOption: {
    color: '#6CA621',
    background: '#ECFFD9',
    border: '1px solid #6CA621',
    boxShadow: 'none',
    innerCircle: CircleColors.correctOption,
    height: '52px',
    cursor: 'default',
  },
  wrongOption: {
    color: '#CC6666',
    background: '#FFF2F2',
    border: '1px solid #CC6666',
    boxShadow: 'none',
    innerCircle: CircleColors.wrongOption,
    height: '52px',
    cursor: 'default',
  },
  inActive: {
    color: '#646464',
    background: '#C7C7C7',
    border: '1px solid #88888',
    boxShadow: ' inset 0px -4px 0px #88888',
    innerCircle: CircleColors.inActive,
    height: '60px',
    cursor: 'default',
  },
}

const ButtonOuterDiv = styled.div<{ buttonProps: ButtonColorProps }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 4px;
  height: 64px;
  background: none;
  border: ${(props) => props.buttonProps.border};
  box-shadow: ${(props) => props.buttonProps.boxShadow};
  border-radius: 12px;
  cursor: ${(props) => props.buttonProps.cursor};
`

const ButtonInnerDiv = styled.div<{ buttonProps: ButtonColorProps }>`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  padding: 12px 20px;
  gap: 12px;
  font-size: 28px;
  height: ${(props) => props.buttonProps.height};
  color: ${(props) => props.buttonProps.color};
  background: ${(props) => props.buttonProps.background};
  border-radius: 8px;
`

const OuterCircle = styled.div<{ circleProps: ButtonColorProps }>`
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: flex;
  border: ${(prop) => prop.circleProps.innerCircle.border};
  justify-content: center;
  align-items: center;
`

const InnerCircle = styled.div<{ circleProps: ButtonColorProps }>`
  width: 80%;
  height: 80%;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  display: ${(prop) => prop.circleProps.innerCircle.InnerCircledisplay};
  background: ${(prop) => prop.circleProps.innerCircle.InnerCirlceColor};
`

const Button: React.FC<Buttonprops> = ({ label, canInteract, onClick, isCorrectOption }) => {
  const [currentState, setCurrentState] = useState<ButtonColorProps>(ButtonStates.default)

  const handleClick = () => {
    if (canInteract) {
      isCorrectOption
        ? setCurrentState(ButtonStates.correctOption)
        : setCurrentState(ButtonStates.wrongOption)

      onClick()
    }
  }

  useEffect(() => {
    if (!canInteract && !isCorrectOption) {
      setCurrentState(ButtonStates.inActive)
    }
  }, [canInteract])

  return (
    <ButtonOuterDiv onClick={handleClick} buttonProps={currentState}>
      <ButtonInnerDiv buttonProps={currentState}>
        <OuterCircle circleProps={currentState}>
          <InnerCircle circleProps={currentState} />
        </OuterCircle>
        {label}
      </ButtonInnerDiv>
    </ButtonOuterDiv>
  )
}

export default React.memo(Button)

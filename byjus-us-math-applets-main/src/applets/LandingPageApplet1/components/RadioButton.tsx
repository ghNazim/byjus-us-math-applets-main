import styled, { keyframes } from 'styled-components'

import { useSFX } from '@/hooks/useSFX'

export type ButtonState = 'default' | 'selected' | 'disabled'

interface ButtonProps {
  id: number
  value: string
  currentBtnState: ButtonState
  onClick: (id: number) => void
}

const OuterDiv = styled.div<{ buttonState: ButtonState }>`
  display: flex;
  padding: 4px;
  border: ${(a) => {
    switch (a.buttonState) {
      case 'selected':
        return '1px solid #1a1a1a'
      case 'default':
        return '1px solid #C7C7C7'
      case 'disabled':
        return '1px solid #646464'
    }
  }};

  box-shadow: ${(a) => (a.buttonState === 'default' ? 'inset 0px -4px 0px #C7C7C7' : 'none')};
  border-radius: 12px;

  opacity: ${(a) => (a.buttonState === 'disabled' ? 0.2 : 1)};
  justify-content: center;
  cursor: ${(a) => (a.buttonState === 'default' ? 'pointer' : 'default')};
  scale: ${(a) => (a.buttonState === 'selected' ? '1.03' : 1)};

  transition: all 0.3s ease;
`

const InnerDiv = styled.div<{ buttonState: ButtonState }>`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px 20px;
  background: ${(a) => {
    switch (a.buttonState) {
      case 'selected':
        return '#c7c7c7'
      case 'default':
        return ' #fff'
      case 'disabled':
        return ' #C7C7C7'
    }
  }};
  border-radius: 8px;
  gap: 0.5rem;
`

const OuterCircle = styled.div<{ buttonState: ButtonState }>`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: ${(a) => {
    switch (a.buttonState) {
      case 'selected':
        return '1px solid #1a1a1a'
      case 'default':
        return '2px solid #212121'
      case 'disabled':
        return '1px solid #646464'
    }
  }};
  transition: border-color 0.2s ease;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.1s ease;
`

const InnerCircle = styled.div<{ buttonState: ButtonState }>`
  transform: ${(a) => (a.buttonState === 'selected' ? 'scale(1)' : 'scale(.5)')};
  transition: all 0.3s ease-in-out;
  background: ${(a) => {
    switch (a.buttonState) {
      case 'selected':
        return '#1a1a1a'
      case 'default':
        return 'none'
      case 'disabled':
        return 'none'
    }
  }};

  width: 14px;
  height: 14px;
  border-radius: 50%;
`

const Text = styled.div`
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  @media (max-width: 768px) {
    font-size: ${26}px;
  }
  text-align: center;
  color: #212121;
  user-select: none;
`

const RadioButton = ({ value, currentBtnState, onClick, id }: ButtonProps) => {
  const playMouseClick = useSFX('mouseClick')
  const handleClick = () => {
    onClick(id)
    if (currentBtnState === 'default') playMouseClick()
  }

  return (
    <OuterDiv onClick={handleClick} buttonState={currentBtnState}>
      <InnerDiv buttonState={currentBtnState}>
        <OuterCircle buttonState={currentBtnState}>
          <InnerCircle buttonState={currentBtnState} />
        </OuterCircle>
        <Text>{value}</Text>
      </InnerDiv>
    </OuterDiv>
  )
}

export default RadioButton

import styled from 'styled-components'
export type ButtonState = 'Correct' | 'Wrong' | 'default' | 'selected' | 'disabled'

interface ButtonProps {
  value: number
  currentBtnState: ButtonState
  onClick: (value: number) => void
}

const OuterDiv = styled.div<{ buttonState: ButtonState }>`
  position: relative;
  display: flex;
  padding: 4px;
  border: ${(a) => {
    switch (a.buttonState) {
      case 'Correct':
        return '1px solid #6CA621'
      case 'Wrong':
        return '1px solid #CC6666'
      case 'selected':
        return '1px solid #212121'
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
`

const InnerDiv = styled.div<{ buttonState: ButtonState }>`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px 20px;
  background: ${(a) => {
    switch (a.buttonState) {
      case 'Correct':
        return '#ECFFD9'
      case 'Wrong':
        return ' #FFF2F2'
      case 'selected':
        return ' #C7C7C7'
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
      case 'Correct':
        return '1px solid #6CA621'
      case 'Wrong':
        return '1px solid #CC6666'
      case 'selected':
        return '1px solid #212121'
      case 'default':
        return '2px solid #212121'
      case 'disabled':
        return '1px solid #646464'
    }
  }};
`

const InnerCircle = styled.div<{ buttonState: ButtonState }>`
  position: relative;
  top: 4px;
  left: 4px;
  background: ${(a) => {
    switch (a.buttonState) {
      case 'Correct':
        return '#6CA621'
      case 'Wrong':
        return '#CC6666'
      case 'selected':
        return '#212121'
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
  text-align: center;
  color: #212121;
`

const Button = ({ value, currentBtnState, onClick }: ButtonProps) => {
  const handleClick = () => {
    if (currentBtnState == 'default') onClick(value)
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

export default Button

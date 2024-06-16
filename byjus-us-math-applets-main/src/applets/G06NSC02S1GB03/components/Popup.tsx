import styled from 'styled-components'

export type side = 'left' | 'right'

interface PopupProps {
  side: side
  value1: number | undefined
  value2: number | undefined
}

const Base = styled.div`
  background: #ffffff;
  border: 0.5px solid #1a1a1a;
  border-radius: 8px;
  padding: 10px;
  position: relative;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  max-width: 200px;
  pointer-events: none;
`
const Tail = styled.div<{ side: side }>`
  width: 10px;
  height: 10px;
  border-bottom: 1px solid #1a1a1a;
  border-right: 1px solid #1a1a1a;
  transform: ${(a) => {
    switch (a.side) {
      case 'left':
        return 'rotate(-135deg)'
      case 'right':
        return 'rotate(-135deg)'
    }
  }};
  background: white;
  position: absolute;
  right: ${(a) => (a.side === 'left' ? '10px' : undefined)};
  left: ${(a) => (a.side === 'right' ? '10px' : undefined)};
  top: -8%;
`

const Popup: React.FC<PopupProps> = ({ side, value1, value2 }) => {
  let errorMessage = ''

  if (side === 'left') {
    errorMessage = 'The entered decimal numbers must lie between 0 and 2.'
  } else if (side === 'right') {
    if (value2 !== undefined && value1 !== undefined) {
      if (value2 > value1) {
        errorMessage = 'The subtrahend should be smaller than the minuend.'
      }
    }
  }

  return (
    <div>
      {errorMessage && (
        <Base>
          {errorMessage}
          <Tail side={side} />
        </Base>
      )}
    </div>
  )
}

export default Popup

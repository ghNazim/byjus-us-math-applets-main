import styled from 'styled-components'

export type side = 'left' | 'right'

interface PopupProps {
  side: side
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
  border-top: 1px solid #1a1a1a;
  border-right: 1px solid #1a1a1a;
  transform: rotate(-45deg);
  background: white;
  position: absolute;
  right: ${(a) => (a.side === 'left' ? '15px' : undefined)};
  left: ${(a) => (a.side === 'right' ? '15px' : undefined)};
  top: -5px;
`
const RoundedFrame = styled.div<{ side: side }>`
  border: 1px solid black;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  background-color: white;
  left: ${(a) => (a.side === 'left' ? '-10px' : undefined)};
  right: ${(a) => (a.side === 'right' ? '-10px' : undefined)};
  bottom: -10px;
`

const Popup: React.FC<PopupProps> = ({ side }) => {
  return (
    <div>
      <Base>
        <>The entered value must lie between 0 and 2.</>
        <RoundedFrame side={side}>!</RoundedFrame>
        <Tail side={side} />
      </Base>
    </div>
  )
}

export default Popup

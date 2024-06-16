import React, { MouseEventHandler } from 'react'
import styled from 'styled-components'

interface props {
  left: number
  top: number
  value: string
  width: number
  height: number
  color: string
  canInteract?: boolean
  onClick: MouseEventHandler
  show: boolean
  fontColor: string
}

const Box = styled.div<{
  left: number
  top: number
  height: number
  color: string
  width: number
  canInteract?: boolean
  fontColor: string
}>`
  width: ${(props) => props.width}px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => props.color};
  padding: auto 10px;
  height: ${(props) => props.height}px;
  font-size: 28px;
  position: absolute;
  left: ${(props) => props.left}px;
  top: ${(props) => props.top}px;
  border: 1px dashed #1cb9d9;
  cursor: ${(props) => (props.canInteract ? 'pointer' : 'default')};
  color: ${(prop) => prop.fontColor};
`

const ResizableBoxes: React.FC<props> = ({
  canInteract,
  left,
  top,
  value,
  width,
  height,
  color,
  onClick,
  show,
  fontColor,
}) => {
  // const [show, setShow] = useState(true)

  return (
    <>
      {show ? (
        <Box
          canInteract={canInteract}
          width={width}
          height={height}
          left={left}
          top={top}
          color={color}
          onClick={onClick}
          fontColor={fontColor}
        >
          {value}
        </Box>
      ) : undefined}
    </>
  )
}

export default ResizableBoxes

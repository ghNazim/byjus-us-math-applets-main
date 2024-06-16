import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import React from 'react'
import styled from 'styled-components'

import { useContentScale } from '@/atoms/ContentScaler/ContentScaler'

interface boxProps {
  id: string
  value?: number
  color: string
  width: number
  isActive: boolean
  equationSide: 'LHS' | 'RHS'
  isVisible?: boolean
  xCoefficient?: number
  fontColor: string
}

const Box = styled.div<{
  color: string
  isVisible?: boolean
  width: number
  isActive: boolean
  fontColor: string
}>`
  width: ${(props) => props.width}px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => (props.isActive ? props.color : '#ECECEC') || '#ECECEC'};
  padding: auto 10px;
  height: inherit;
  font-size: 28px;
  opacity: ${(props) => (props.isVisible ? '1' : '0')};
  cursor: ${(props) => (props.isActive ? 'pointer' : 'default')};
  color: ${(props) => props.fontColor};
  user-select: none;
`

const Draggable: React.FC<boxProps> = ({
  id,
  value,
  isActive,
  color,
  width,
  equationSide,
  isVisible,
  xCoefficient,
  fontColor,
}) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
    data: { equationSide, xCoefficient },
  })
  const appletScale = useContentScale()
  const style = transform
    ? {
        // transform: CSS.Translate.toString(transform),
        transform: `translate3d(${transform.x / appletScale}px, ${transform.y / appletScale}px, 0)`,
      }
    : {
        transform: `translate3d(${0}px, ${0}px, 0)`,
      }

  return (
    <>
      {isActive ? (
        <Box
          {...attributes}
          {...listeners}
          ref={setNodeRef}
          color={color}
          width={width}
          style={{ ...style, touchAction: 'none' }}
          isActive={isActive}
          isVisible={isVisible}
          fontColor={fontColor}
        >
          {value ? value : 'a'}
        </Box>
      ) : (
        <Box
          color={color}
          width={width}
          style={{ ...style, touchAction: 'none' }}
          isActive={isActive}
          isVisible={isVisible}
          fontColor={fontColor}
        >
          {value ? value : xCoefficient ? `${xCoefficient}a` : 'a'}
        </Box>
      )}
    </>
  )
}

export default Draggable

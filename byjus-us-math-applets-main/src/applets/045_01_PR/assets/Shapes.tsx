import { useDraggable } from '@dnd-kit/core'
import React from 'react'
interface shapeProps {
  id: string
  name: string
  src: string
  left: number
  leftOffset: number
  top: number
  topOffset: number
  angle: string
  width: number
  height: number
}
const Shapes: React.FC<shapeProps> = ({
  id,
  name,
  src,
  left,
  leftOffset,
  top,
  topOffset,
  angle,
  width,
  height,
}) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
    data: {},
  })

  const holderStyle = {
    width: width * 35,
    height: height * 35,
    position: 'absolute',
    left: left,
    top: top,
    filter: 'none',
  } as const

  const holderStyleWide = {
    width: width * 35,
    height: height * 35,
    position: 'absolute',
    left: left + 35,
    top: top - 35,
    filter: 'none',
  } as const

  const style = transform
    ? {
        transform: `translate3d(${transform.x + leftOffset}px, ${
          transform.y + topOffset
        }px, 0)  rotate(${-angle}deg)`,
      }
    : { transform: `rotate(${-angle}deg)` }

  return (
    <div
      className="shapeHolder"
      style={width === 4 ? holderStyleWide : holderStyle}
      onMouseOver={(e) => (e.currentTarget.style.filter = 'hue-rotate(-20deg)')}
      onMouseOut={(e) => (e.currentTarget.style.filter = 'none')}
    >
      <img
        src={src}
        ref={setNodeRef}
        onMouseOver={(e) => (e.currentTarget.style.scale = '1.05')}
        onMouseOut={(e) => (e.currentTarget.style.scale = '1')}
        alt={name}
        style={style}
        {...attributes}
        {...listeners}
      />
    </div>
  )
}
export default Shapes

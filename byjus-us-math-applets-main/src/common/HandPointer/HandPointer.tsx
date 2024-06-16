import styled from 'styled-components'

import handIcon from './Assets/HandIcon.svg'
import sliderHandIcon from './Assets/HandIconSlider.svg'

const HandIcon = styled.img`
  position: absolute;
  width: 35.5px;
  height: 42.7px;
  pointer-events: none;
`

export const HandPointer: React.FC<{ type?: 'slider' | 'default'; className?: string }> = ({
  type = 'default',
  className,
}) => {
  return (
    <HandIcon
      src={type === 'slider' ? sliderHandIcon : handIcon}
      className={className}
      draggable={false}
    />
  )
}

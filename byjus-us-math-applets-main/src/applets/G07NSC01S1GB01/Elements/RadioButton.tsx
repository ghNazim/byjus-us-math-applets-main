import { FC, useContext, useState } from 'react'
import styled from 'styled-components'

import { AnalyticsContext } from '@/contexts/analytics'
import { useSFX } from '@/hooks/useSFX'

const ButtonOuter = styled.div<{ active: boolean }>`
  background-color: #fff;
  border: 1px solid #c7c7c7;
  border-radius: 12px;
  box-shadow: inset 0px ${(props) => (props.active ? -3 : -4)}px 0px #c7c7c7;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;

  padding: 20px 20px;

  font-family: 'Nunito';
  font-style: normal;
  font-weight: ${(props) => (props.active ? 600 : 400)};
  font-size: 20px;
  line-height: 28px;

  color: #212121;

  position: relative;
  z-index: 0;
`

const TextHolder = styled.div`
  z-index: 3;
`

const InnerDiv = styled.div<{ active: boolean }>`
  background-color: ${(props) => (props.active ? '#c7c7c7' : '#fff')};
  width: 100px;
  height: 80%;
  width: 95%;
  border-radius: 8px;

  position: absolute;
  left: 2.5%;
  top: 8%;
  z-index: 1;
`

const ClickCircle = styled.div<{ hovered: boolean; active: boolean }>`
  width: 22px;
  height: 22px;
  border-radius: 11px;
  border: 2px solid #212121;
  background-color: #fff;

  display: flex;
  align-items: center;
  justify-content: center;

  z-index: 2;
`

const InnerCircle = styled.div<{ active: boolean }>`
  width: 14px;
  height: 14px;
  border-radius: 7px;

  background-color: ${(props) => (props.active ? '#212121' : '#fff')};
  z-index: 2;
`

const RadioButton: FC<{ onClick: () => void; active: boolean; text: string; value: number }> = ({
  onClick,
  text,
  active,
}) => {
  const [hovered, setHovered] = useState(false)
  const playMouseClick = useSFX('mouseClick')
  const onInteraction = useContext(AnalyticsContext)

  return (
    <ButtonOuter
      active={active}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => {
        onClick()
        playMouseClick()
        onInteraction('tap')
      }}
    >
      <ClickCircle onClick={onClick} hovered={hovered} active={active}>
        <InnerCircle active={active} />
      </ClickCircle>
      <TextHolder>{text}</TextHolder>
      <InnerDiv active={active} />
    </ButtonOuter>
  )
}

export default RadioButton

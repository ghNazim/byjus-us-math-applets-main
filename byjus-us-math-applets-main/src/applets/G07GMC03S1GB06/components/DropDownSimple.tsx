import React, { FC, HTMLAttributes, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { useSFX } from '@/hooks/useSFX'

interface DropDownSimpleProps extends HTMLAttributes<HTMLDivElement> {
  valueArr: string[]
  onSelecting: (val: string) => void
}

const OuterDiv = styled.span`
  border-radius: 12px;
  border: 1px solid var(--interactives-090, #1a1a1a);
  background: var(--interactives-500, #fff);
  position: relative;
  min-width: 100px;
  display: flex;
  min-height: 60px;
  padding: 2px;
  justify-content: flex-start;
  align-items: center;
`

const SideArrow = styled.div`
  position: absolute;
  right: 2%;
  height: 90%;
  background-color: #1a1a1a;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 0 10px;
  border-radius: 0 10px 10px 0;
  cursor: pointer;
`

const Arrow = styled.div`
  width: 15px;
  height: 15px;
  padding: 5px;
  margin-top: 10px;
  border-bottom: 2px solid white;
  border-right: 2px solid white;
  transform: rotate(45deg);
`

const Popup = styled.div`
  position: absolute;
  background-color: #c7c7c7;
  transform: translateY(-110%);
  border-radius: 12px;
`

const Notch = styled.div`
  width: 15px;
  height: 15px;
  position: absolute;
  bottom: -10%;
  left: 50%;
  transform: translate(-50%, -50%);
  transform: rotate(45deg);
  background-color: #c7c7c7;
`

const OptionContainer = styled.div`
  display: flex;
  padding: 12px;
  justify-content: space-around;
  gap: 10px;
`

const Option = styled.div`
  border-radius: 8px;
  background: var(--interactives-500, #fff);
  color: var(--interactives-200, #646464);
  font-family: Nunito;
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: 28px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px 10px;
  user-select: none;
  cursor: pointer;
`

const DropDownSimple: FC<DropDownSimpleProps> = ({ valueArr, onSelecting }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedValue, setSelectedValue] = useState<string | null>(null)

  const playMouseClick = useSFX('mouseClick')

  const handleSelecting = (val: string) => {
    onSelecting(val)
    setIsOpen(false)
    setSelectedValue(val)
    playMouseClick()
  }

  return (
    <>
      <OuterDiv>
        <SideArrow onClick={() => setIsOpen((prev) => !prev)}>
          <Arrow />
        </SideArrow>
        {selectedValue ? <div style={{ padding: '0 10px' }}>{selectedValue}</div> : null}
        {isOpen ? (
          <Popup>
            <OptionContainer>
              {valueArr.map((ele, index) => (
                <Option key={index} onClick={() => handleSelecting(ele)}>
                  {ele}
                </Option>
              ))}
            </OptionContainer>
            <Notch />
          </Popup>
        ) : null}
      </OuterDiv>
    </>
  )
}

export default DropDownSimple

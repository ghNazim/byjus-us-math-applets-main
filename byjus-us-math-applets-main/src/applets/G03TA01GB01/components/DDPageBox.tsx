import { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'
import { Stage, useTransition } from 'transition-hook'

import { AnalyticsContext } from '@/contexts/analytics'
import { useSFX } from '@/hooks/useSFX'

import blackArrow from '../assets/blackArrow.png'
import redArrow from '../assets/redArrow.png'
const Box = styled.div<{ colorTheme: string; top: number }>`
  position: absolute;
  top: ${(p) => p.top}px;
  left: 50%;
  translate: -50%;
  width: 122px;
  display: flex;
  height: 60px;
  padding: 3px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  color: #1a1a1a;
  text-align: center;
  font-family: Nunito;
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: 28px;
  border-radius: 12px;
  cursor: pointer;
  border: 1px solid
    ${(p) => (p.colorTheme == 'green' ? '#6CA621' : p.colorTheme == 'red' ? '#CC6666' : '#444')};
  background: ${(p) =>
    p.colorTheme == 'green' ? '#ECFFD9' : p.colorTheme == 'red' ? '#FFF2F2' : '#fff'};
`
const OptionsContainer = styled.button<{ stage: Stage; pos: string }>`
  position: absolute;
  top: ${(p) => (p.pos == 'top' ? '-130%' : '116%')};
  left: 50%;
  translate: -50%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  display: flex;
  padding: 12px;
  align-items: center;
  gap: 12px;
  border-radius: 12px;
  border: none;
  background: #c7c7c7;
  opacity: ${(props) => (props.stage !== 'enter' ? 0 : 1)};
  transition: opacity 350ms;
  z-index: 1;
  ${(p) => p.pos == 'top' && ''}
  ::after {
    content: ' ';
    position: absolute;
    left: 50%;
    translate: -50%;
    top: ${(p) => (p.pos == 'top' ? '98%' : '-11%')};
    border-bottom: none;
    border-right: 8px solid transparent;
    border-left: 8px solid transparent;
    border-top: 8px solid #c7c7c7;
    rotate: ${(p) => (p.pos == 'top' ? '0deg' : '180deg')};
  }
`
const Option = styled.button`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 8px;
  gap: 10px;
  border-radius: 8px;
  border: none;
  width: 44px;
  height: 44px;
  font-family: 'Nunito';
  background: #ffffff;
  color: #646464;
  text-align: center;
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: 28px;
  cursor: pointer;
  :hover {
    background: #1a1a1a;
    color: #fff;
  }
`
const LRArrow = styled.div<{ arrowFace: boolean }>`
  border-bottom: none;
  border-right: 8px solid transparent;
  border-left: 8px solid transparent;
  border-top: 8px solid #1a1a1a;
  display: inline-block;
  rotate: ${(props) => (props.arrowFace ? '90deg' : '-90deg')};
`
const ArrowButton = styled.button`
  border: none;
  cursor: pointer;
  width: 28px;
  height: 28px;
  border-radius: 100px;
  background: none;
  &:disabled {
    cursor: default;
    opacity: 0.3;
  }
`
const Label = styled.div<{ colorTheme: string }>`
  position: relative;
  width: 78px;
  height: 52px;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;
  display: flex;
  align-items: center;
  text-align: center;
  justify-content: center;
  color: ${(p) =>
    p.colorTheme == 'green' ? '#6CA621' : p.colorTheme == 'red' ? '#CC6666' : '#444'};
`
const Arrow = styled.div`
  position: relative;
  width: 36px;
  height: 52px;
  background: #1a1a1a;
  border-radius: 0px 8px 8px 0px;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #ffffff;
`
interface DropdownBoxProps {
  rightAns: number
  onDisabling: (isOpen: boolean, optionSel: number, checked: boolean) => void
  checked: boolean
  top: number
}

export const DDPageBox: React.FC<DropdownBoxProps> = ({ rightAns, onDisabling, checked, top }) => {
  const [isOpen, setOpen] = useState(false)
  const { shouldMount, stage } = useTransition(isOpen, 350)
  const [optionSel, setOptionSel] = useState(0)
  const [ansChecked, setAnsChecked] = useState(checked)
  const playClick = useSFX('mouseClick')
  const onInteraction = useContext(AnalyticsContext)
  const [leftDisable, setLeftDisable] = useState(true)
  const [rightDisable, setRightDisable] = useState(false)
  const [displayStart, setDisplayStart] = useState(0)

  useEffect(() => {
    onDisabling((ansChecked && optionSel !== rightAns) || isOpen, optionSel, ansChecked)
  }, [ansChecked, isOpen])

  useEffect(() => {
    setAnsChecked(checked)
  }, [checked])
  const onLeftClick = () => {
    onInteraction('tap')
    playClick()
    setDisplayStart((d) => d - 1)
  }
  const onRightClick = () => {
    onInteraction('tap')
    playClick()
    setDisplayStart((d) => d + 1)
  }
  useEffect(() => {
    setLeftDisable(displayStart == 0 ? true : false)
    setRightDisable(displayStart == 4 ? true : false)
  }, [displayStart])
  const options = []
  for (let i = 1; i <= 8; i++) {
    options.push(
      <Option
        key={i}
        onClick={() => {
          setOptionSel(i)
          setOpen(false)
          onInteraction('tap')
          playClick()
        }}
      >
        {i}
      </Option>,
    )
  }
  return (
    <Box
      onClick={() => {
        if (ansChecked && optionSel === rightAns) return
        if (!isOpen) {
          setOpen(true)
          setAnsChecked(false)
          onInteraction('tap')
          playClick()
        }
      }}
      colorTheme={ansChecked ? (optionSel === rightAns ? 'green' : 'red') : 'default'}
      top={top}
    >
      <Label colorTheme={ansChecked ? (optionSel === rightAns ? 'green' : 'red') : 'default'}>
        {optionSel > 0 ? optionSel : ''}
      </Label>
      {ansChecked && optionSel !== rightAns && (
        <Arrow>
          <img src={redArrow} />
        </Arrow>
      )}
      {!ansChecked && (
        <Arrow>
          <img src={blackArrow} />
        </Arrow>
      )}
      {shouldMount && (
        <OptionsContainer {...{ stage }} pos={top < 500 ? 'top' : 'bottom'}>
          <ArrowButton disabled={leftDisable} onClick={onLeftClick}>
            <LRArrow arrowFace={true} />
          </ArrowButton>
          {options[displayStart]}
          {options[displayStart + 1]}
          {options[displayStart + 2]}
          {options[displayStart + 3]}
          <ArrowButton disabled={rightDisable} onClick={onRightClick}>
            <LRArrow arrowFace={false} />
          </ArrowButton>
        </OptionsContainer>
      )}
    </Box>
  )
}

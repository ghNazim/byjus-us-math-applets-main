import { Player } from '@lottiefiles/react-lottie-player'
import { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'
import { Stage, useTransition } from 'transition-hook'

import { click } from '@/assets/onboarding'
import { AnalyticsContext } from '@/contexts/analytics'
import { useSFX } from '@/hooks/useSFX'

const Box = styled.div<{ colorTheme: string }>`
  position: absolute;
  top: 255px;
  left: 50%;
  translate: -50%;
  width: 99px;
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
const OptionsContainer = styled.button<{ stage: Stage }>`
  position: absolute;
  top: -130%;
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
  ::after {
    content: ' ';
    position: absolute;
    left: 50%;
    translate: -50%;
    top: 99%;
    border-bottom: none;
    border-right: 8px solid transparent;
    border-left: 8px solid transparent;
    border-top: 8px solid #c7c7c7;
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
const Label = styled.div<{ colorTheme: string }>`
  position: relative;
  width: 68px;
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
const HandPlayer = styled(Player)`
  position: absolute;
  top: -6px;
  left: 2px;
  pointer-events: none;
`
interface DropdownBoxProps {
  rightAns: number
  onDisabling: (disable: boolean, optionSel: number, checked: boolean) => void
  checked: boolean
}

const signs = [<>&lt;</>, <>=</>, <>&gt;</>]
export const DropdownBox: React.FC<DropdownBoxProps> = ({ rightAns, onDisabling, checked }) => {
  const [isOpen, setOpen] = useState(false)
  const { shouldMount, stage } = useTransition(isOpen, 350)
  const [optionSel, setOptionSel] = useState(0)
  const [ansChecked, setAnsChecked] = useState(checked)
  const playClick = useSFX('mouseClick')
  const onInteraction = useContext(AnalyticsContext)
  const [showHandPointer, setShowHandPointer] = useState(true)

  useEffect(() => {
    onDisabling(
      (ansChecked && optionSel !== rightAns) || isOpen || optionSel == 0 ? true : false,
      optionSel,
      ansChecked,
    )
  }, [ansChecked, isOpen])

  useEffect(() => {
    setAnsChecked(checked)
  }, [checked])

  return (
    <Box
      onClick={() => {
        if (ansChecked && optionSel === rightAns) return
        setOpen((open) => !open)
        setAnsChecked(false)
        onInteraction('tap')
        playClick()
        setShowHandPointer(false)
      }}
      colorTheme={ansChecked ? (optionSel === rightAns ? 'green' : 'red') : 'default'}
    >
      <Label colorTheme={ansChecked ? (optionSel === rightAns ? 'green' : 'red') : 'default'}>
        {optionSel > 0 ? signs[optionSel - 1] : ''}
      </Label>
      {shouldMount && (
        <OptionsContainer {...{ stage }}>
          <Option
            key={1}
            onClick={() => {
              setOptionSel(1)
            }}
          >
            &lt;
          </Option>
          <Option
            key={2}
            onClick={() => {
              setOptionSel(2)
            }}
          >
            =
          </Option>
          <Option
            key={3}
            onClick={() => {
              setOptionSel(3)
            }}
          >
            &gt;
          </Option>
        </OptionsContainer>
      )}
      {showHandPointer && <HandPlayer src={click} autoplay loop />}
    </Box>
  )
}

import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

import triOne from './tri-one.svg'
import triThree from './tri-three.svg'
import triTwo from './tri-two.svg'
import triZero from './tri-zero.svg'

const StyledDiv = styled.div<{ clicked: boolean }>`
  width: 100px;
  height: 100px;
  border-radius: 4px;
  background-color: #${(props) => (props.clicked ? 'ECECEC' : 'F6F6F6')};
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25) ${(props) => (props.clicked ? 'inset' : null)};
  cursor: pointer;
`

const InsideImg = styled.img`
  width: 80px;
  height: 80px;
  margin-top: 10px;
  margin-left: 10px;
`

export const ButtonBase = (props: {
  onClick: any
  data: { btnNumber: number; currentSel: number; imageSrc: string }
}) => {
  const [clicked, setClicked] = useState(false)

  useEffect(() => {
    if (props.data.btnNumber === props.data.currentSel) {
      setClicked(true)
    } else {
      setClicked(false)
    }
  }, [props.data.currentSel])

  return (
    <StyledDiv
      className="Button"
      clicked={clicked}
      onClick={() => {
        props.onClick(props.data.btnNumber)
      }}
    >
      <InsideImg src={props.data.imageSrc} />
    </StyledDiv>
  )
}

export const qnConfigs = [
  {
    buttoNo: 0,
    imageSrc: triZero,
  },
  {
    buttoNo: 1,
    imageSrc: triOne,
  },
  {
    buttoNo: 2,
    imageSrc: triTwo,
  },
  {
    buttoNo: 3,
    imageSrc: triThree,
  },
]

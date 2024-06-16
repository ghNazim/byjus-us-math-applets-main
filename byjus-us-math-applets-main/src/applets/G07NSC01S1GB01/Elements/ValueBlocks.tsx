import { FC, ReactElement } from 'react'
import styled from 'styled-components'

import CharBox, { blueBlock, DotBox, purpleBlock } from './CharBox'

const BlockHolder = styled.div`
  position: relative;
  top: 300px;
  width: 400px;
  left: 150px;

  height: 70px;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 30px;
  z-index: 5;
`

const ValueBox: FC<{
  a: ReactElement | string
  b: ReactElement | string
}> = ({ a, b }) => {
  return (
    <BlockHolder>
      <CharBox colorBlock={blueBlock} value={a} />
      <CharBox value="+" />
      <CharBox colorBlock={purpleBlock} value={b} />
      <CharBox value="=" />
      <DotBox active={false} value="" />
    </BlockHolder>
  )
}

export default ValueBox

const ShowHolder = styled.div`
  position: relative;
  top: 320px;
  width: 400px;
  left: 150px;

  height: 70px;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  z-index: 5;
`

export const ShowBox: FC<{
  a: ReactElement | string
  b: ReactElement | string
  ans: ReactElement | string
  active: boolean
}> = ({ a, b, ans, active }) => {
  return (
    <ShowHolder>
      <CharBox colorBlock={blueBlock} value={a} />
      <CharBox value="+" />
      <CharBox colorBlock={purpleBlock} value={b} />
      <CharBox value="=" />
      <DotBox active={active} value={ans} />
    </ShowHolder>
  )
}

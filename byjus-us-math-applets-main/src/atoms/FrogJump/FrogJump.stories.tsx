import type { Meta, StoryObj } from '@storybook/react'
import { useRef } from 'react'
import styled from 'styled-components'

import { FrogJump } from './FrogJump'
import { FrogJumpRef } from './FrogJump.types'

const Container = styled.div`
  width: 300px;
  height: 600px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: end;
`

const PlayButton = styled.button`
  width: 120px;
  height: 30px;
`

const meta: Meta<typeof FrogJump> = {
  component: FrogJump,
}
export default meta
type Story = StoryObj<typeof FrogJump>

export const Demo = {
  args: {},
  render: function Render(args) {
    const ref = useRef<FrogJumpRef>(null)

    return (
      <Container>
        <FrogJump {...args} ref={ref} />
        <PlayButton onClick={() => ref.current?.jumpTo({ left: 120, top: 0 })}>Play</PlayButton>
      </Container>
    )
  },
} satisfies Story

import { Decorator } from '@storybook/react'
import styled from 'styled-components'

const Wrapper = styled.div`
  width: 90dvw;
  height: 90dvh;
  margin: auto;
`

export const AppletWrapper: Decorator = (Story) => (
  <Wrapper>
    <Story />
  </Wrapper>
)

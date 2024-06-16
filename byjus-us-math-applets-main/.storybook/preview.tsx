import { Preview } from '@storybook/react'
import React from 'react'
import styled from 'styled-components'

import { nunito } from '../src/utils/fonts'
import { styleReset } from '../src/utils/style-reset'

const Wrapper = styled.div`
  ${nunito}
  ${styleReset}
`

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
  decorators: [
    (Story) => (
      <Wrapper>
        <Story />
      </Wrapper>
    ),
  ],
}
export default preview

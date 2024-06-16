import { FC } from 'react'
import styled from 'styled-components'

import { AppletContainer } from '@/common/AppletContainer'
import { Header } from '@/common/Header'
import { Math } from '@/common/Math'
import { AppletInteractionCallback } from '@/contexts/analytics'
import { ExponentTable } from '@/templates/ExponentTable'

export const Text = styled.p`
  color: #444;
  font-family: 'Nunito', sans-serif;
  font-size: 20px;
  font-weight: 700;
  margin: 0;
  line-height: 28px;
  text-align: center !important;
`
export const HeaderText = styled(Text)`
  max-width: 600px;
  min-height: 40px;
`

export const AppletG08EEC01S2GB02: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#F6F6F6',
        id: 'g08-eec01-s2-gb02',
        onEvent,
        className,
        themeName: 'dark',
      }}
    >
      <Header backgroundColor="#F6F6F6" buttonColor="#1A1A1A">
        <HeaderText>
          Explore the simplification of{' '}
          <Math>{String.raw`\mathbf{ \left(a \times b\right)^m }`}</Math>
        </HeaderText>
      </Header>
      <ExponentTable type="product-group" />
    </AppletContainer>
  )
}

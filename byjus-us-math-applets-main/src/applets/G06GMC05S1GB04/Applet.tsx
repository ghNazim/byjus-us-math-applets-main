import { FC } from 'react'

import { AppletContainer } from '@/common/AppletContainer'
import { TextHeader } from '@/common/Header'
import { AppletInteractionCallback } from '@/contexts/analytics'

import video from './Elements/assets/LOTTI_01.json'
import { Texts } from './Elements/Texts'
import UnfoldTemplate from './Elements/UnfoldTemplate'

export const AppletG06GMC05S1GB04: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#F6F6F6',
        id: 'g06-gmc05-s1-gb04',
        onEvent,
        className,
      }}
    >
      <TextHeader
        text="Explore square prism and its net."
        backgroundColor="#F6F6F6"
        buttonColor="#1A1A1A"
      />
      <UnfoldTemplate text={Texts} video={video} op={video.op} fr={video.fr} />
    </AppletContainer>
  )
}

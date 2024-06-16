import { FC, useState } from 'react'

import { AppletContainer } from '@/common/AppletContainer'
import { TextHeader } from '@/common/Header'
import { AppletInteractionCallback } from '@/contexts/analytics'

import RiveComp from './components/RiveComp'

export const AppletG06RPC04S1GB01: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const [riveKey, setRiveKey] = useState(0)

  const handleComplete = () => {
    setRiveKey((prev) => prev + 1)
  }
  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#f6f6f6',
        id: 'g06-rpc04-s1-gb01',
        onEvent,
        className,
      }}
    >
      <TextHeader
        text="Explore real world applications of unit rates."
        backgroundColor="#f6f6f6"
        buttonColor="#1a1a1a"
      />
      <RiveComp key={riveKey} onComplete={handleComplete} />
    </AppletContainer>
  )
}

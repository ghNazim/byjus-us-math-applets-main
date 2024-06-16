import { FC, useState } from 'react'
import styled from 'styled-components'

import { AppletContainer } from '@/common/AppletContainer'
import { TextHeader } from '@/common/Header'
import { AppletInteractionCallback } from '@/contexts/analytics'

import { AppletG06EEC09S1 } from './applets/g06eec09s1/g06eec09s1'
import { AppletG07GMC04S1GB06 } from './applets/G07GMC04S1GB06/G07GMC04S1GB06'
import { AppletG07GMC05S1GB02 } from './applets/G07GMC05S1GB02/G07GMC05S1GB02'

const ButtonContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  bottom: 25px;
`

const Button = styled.div`
  color: var(--interactives-500, #fff);
  text-align: center;
  font-family: Nunito;
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: 32px; /* 133.333% */
  display: flex;
  padding: 16px 24px;
  justify-content: center;
  align-items: center;
  gap: 12px;
  border-radius: 10px;
  background: var(--interactives-090, #1a1a1a);
  cursor: pointer;
`

export const AppletBmcPlaybook: FC<{
  onEvent: AppletInteractionCallback
  className?: string
}> = ({ onEvent, className }) => {
  const [showOneMoreBtn, setShowOneMoreBtn] = useState(false)
  const [currentAppletIndex, setCurrentAppletindex] = useState(0)

  const handleTryOneMore = () => {
    setShowOneMoreBtn(false)
    setCurrentAppletindex((prev) => {
      if (prev < 2) {
        return prev + 1
      } else return 0
    })
  }
  return (
    <AppletContainer
      {...{
        aspectRatio: 0.9,
        borderColor: '#444',
        id: 'bmc-playbook',
        onEvent,
        className,
      }}
    >
      {/* <TextHeader text="Hello World!" backgroundColor="#E7FBFF" buttonColor="#D1F7FF" /> */}
      {currentAppletIndex === 0 && (
        <AppletG07GMC05S1GB02 onComplete={() => setShowOneMoreBtn(true)} onEvent={() => {}} />
      )}
      {currentAppletIndex === 1 && (
        <AppletG06EEC09S1 onComplete={() => setShowOneMoreBtn(true)} onEvent={() => {}} />
      )}
      {currentAppletIndex === 2 && (
        <AppletG07GMC04S1GB06
          onComplete={() => {
            setShowOneMoreBtn(true)
          }}
          onEvent={() => {}}
        />
      )}
      {showOneMoreBtn && (
        <ButtonContainer>
          <Button onClick={handleTryOneMore}>Try one more</Button>
        </ButtonContainer>
      )}
    </AppletContainer>
  )
}

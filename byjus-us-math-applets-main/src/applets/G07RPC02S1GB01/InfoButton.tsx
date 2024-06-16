import { createContext, Dispatch, FC, ReactNode, SetStateAction, useContext } from 'react'

import { OnboardingStep } from '@/atoms/OnboardingStep'
import { useControllableValue } from '@/hooks/useControllableValue'
import { useHasChanged } from '@/hooks/useHasChanged'
import { useSFX } from '@/hooks/useSFX'

import {
  InfoButtonContainer,
  InfoClickOnboarding,
  InfoPopupBackgroundBlur,
  InfoPopupContainer,
} from './Applet.styles'
import closeImage from './assets/close.svg'
import infoImage from './assets/info.svg'

const InfoContext = createContext<{ open: boolean; setOpen: Dispatch<SetStateAction<boolean>> }>({
  open: false,
  setOpen: () => {},
})
const useInfoContext = () => {
  const context = useContext(InfoContext)
  return context
}

export const InfoPopup: FC<{
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: ReactNode
}> = ({ open, onOpenChange, children }) => {
  const [isOpen, setOpen] = useControllableValue({
    value: open,
    defaultValue: false,
    onChange: onOpenChange,
  })

  return <InfoContext.Provider value={{ open: isOpen, setOpen }}>{children}</InfoContext.Provider>
}

export const InfoButton: FC = () => {
  const { open, setOpen } = useInfoContext()
  const playClick = useSFX('mouseClick')
  const hasOpened = useHasChanged(open)
  return (
    <InfoButtonContainer
      isOpen={open}
      onClick={() => {
        playClick()
        setOpen((open) => !open)
      }}
    >
      <img style={{ marginBottom: open ? 0 : 4 }} src={open ? closeImage : infoImage} />
      <OnboardingStep index={1}>
        <InfoClickOnboarding complete={hasOpened} />
      </OnboardingStep>
    </InfoButtonContainer>
  )
}

export const InfoContent: FC<{ children: ReactNode }> = ({ children }) => {
  const { open } = useInfoContext()

  if (!open) return null

  return (
    <InfoPopupBackgroundBlur>
      <InfoPopupContainer className="info-content">{children}</InfoPopupContainer>
    </InfoPopupBackgroundBlur>
  )
}

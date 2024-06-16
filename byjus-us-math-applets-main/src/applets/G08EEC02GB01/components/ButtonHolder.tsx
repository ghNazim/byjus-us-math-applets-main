import React, { useState } from 'react'
import styled from 'styled-components'

import Button from './Button'

interface props {
  isCorrectOptionSelected: (isCorrect: boolean) => void
  correctButtonIndex: number
}

const Holder = styled.div`
  justify-content: center;
  align-items: center;
  gap: 2rem;
  display: flex;
  margin: 0 auto;
`

const ButtonHolder: React.FC<props> = ({ isCorrectOptionSelected, correctButtonIndex }) => {
  const [canInteractWithBtns, setCanInteractWithBtns] = useState(true)

  const handleSelection = (index: number) => {
    if (index === correctButtonIndex) {
      setCanInteractWithBtns(false)
      isCorrectOptionSelected(true)
    } else {
      isCorrectOptionSelected(false)
    }
  }

  return (
    <Holder>
      <Button
        isCorrectOption={1 === correctButtonIndex}
        label="addition"
        onClick={() => handleSelection(1)}
        canInteract={canInteractWithBtns}
      />
      <Button
        isCorrectOption={2 === correctButtonIndex}
        label="subtraction"
        onClick={() => handleSelection(2)}
        canInteract={canInteractWithBtns}
      />
    </Holder>
  )
}

export default React.memo(ButtonHolder)

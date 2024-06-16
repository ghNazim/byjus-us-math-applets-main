import { FC, useContext } from 'react'
import styled from 'styled-components'

import { useSFX } from '@/hooks/useSFX'

import { AnalyticsContext } from '../../contexts/analytics'
import { AlgebraicButtonTrayProps } from './AlgebraicButtonTray.types'
const ButtonTray = styled.div`
  /* position: absolute; */
  height: 76px;
  /* left: 50%; */
  /* translate: -50%; */
  /* bottom: 134px; */
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  background: #faf2ff;
  box-shadow: inset 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 10px;
  gap: 30px;
  padding: 0 30px;
`

const Button = styled.button<{ valType: number; disabled: boolean }>`
  background-color: rgba(255, 255, 255, 0.8);
  text-align: center;
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 33px;
  box-shadow: 0px 3px 4px rgba(0, 0, 0, 0.25);
  cursor: pointer;

  ${(props) =>
    props.disabled &&
    ` opacity: 0.3;
  cursor: not-allowed;
`}

  ${(props) =>
    props.valType == 1 &&
    `width: 165px;
    color: #ffffff;
    background: #d97a1a;
    border: 2px solid white;
  `}
  ${(props) =>
    props.valType == 2 &&
    `width: 165px;
    background: #ffffff;
    color: #d97a1a;
    border: 2px solid #d97a1a;
  `}
 ${(props) =>
    props.valType == 3 &&
    `width: 53px;
    color: #ffffff;
    background: #1cb9d9;
    border: 2px solid white;
  `}
${(props) =>
    props.valType == 4 &&
    `width: 53px;
    color: #1cb9d9;
    background: #ffffff;
    border: 2px solid #1cb9d9;
  `}
`

const AlgebraicButtonTray: FC<AlgebraicButtonTrayProps> = ({
  buttonDisableStatus,
  buttonDisplayStatus = [true, true, true, true],
  onXClick,
  onOneClick,
}) => {
  const playClick = useSFX('mouseClick')
  const onInteraction = useContext(AnalyticsContext)
  return (
    <ButtonTray>
      {buttonDisplayStatus[0] && (
        <Button
          valType={1}
          disabled={buttonDisableStatus[0]}
          onClick={() => {
            onXClick?.(1)
            onInteraction('tap')
            playClick()
          }}
        >
          x
        </Button>
      )}
      {buttonDisplayStatus[1] && (
        <Button
          valType={2}
          disabled={buttonDisableStatus[1]}
          onClick={() => {
            onXClick?.(-1)
            onInteraction('tap')
            playClick()
          }}
        >
          -x
        </Button>
      )}
      {buttonDisplayStatus[2] && (
        <Button
          valType={3}
          disabled={buttonDisableStatus[2]}
          onClick={() => {
            onOneClick?.(1)
            onInteraction('tap')
            playClick()
          }}
        >
          1
        </Button>
      )}
      {buttonDisplayStatus[3] && (
        <Button
          valType={4}
          disabled={buttonDisableStatus[3]}
          onClick={() => {
            onOneClick?.(-1)
            onInteraction('tap')
            playClick()
          }}
        >
          -1
        </Button>
      )}
    </ButtonTray>
  )
}

export default AlgebraicButtonTray

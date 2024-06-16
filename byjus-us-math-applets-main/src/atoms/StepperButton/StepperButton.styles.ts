import styled from 'styled-components'

import { OnboardingAnimation } from '@/atoms/OnboardingAnimation'

export const Container = styled.div<{ borderColor: string }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 200px;
  height: 60px;
  border: 1px solid ${(props) => props.borderColor};
  border-radius: 10px;
  gap: 20px;
`
export const Number = styled.label<{ textColor: string }>`
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;
  width: 60px;
  text-align: center;
  padding: auto;
  color: ${(props) => props.textColor};
  pointer-events: none;
`
export const LeftButton = styled.button`
  position: relative;
  background-color: transparent;
  border: none;
  padding: 20px 8px 20px 22px;
  width: 50px;
  height: 60px;
  cursor: pointer;
  transition: 0.3s;

  &:hover {
    scale: 1.2;
  }

  &:active {
    scale: 1;
  }

  &:disabled {
    scale: 1;
    filter: grayscale() opacity(0.2);
    cursor: not-allowed;
  }
`
export const RightButton = styled(LeftButton)`
  padding: 20px 22px 20px 8px;
`
export const ClickOnboarding = styled(OnboardingAnimation).attrs({ type: 'click' })`
  position: absolute;
  left: -56px;
  top: -10px;
`

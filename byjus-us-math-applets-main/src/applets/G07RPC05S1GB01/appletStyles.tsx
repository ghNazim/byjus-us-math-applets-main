import styled, { keyframes } from 'styled-components'

import { OnboardingAnimation } from '@/atoms/OnboardingAnimation'

export const OnboardingAnim = styled(OnboardingAnimation)<{ left: number; top: number }>`
  position: absolute;
  left: ${(a) => a.left}px;
  top: ${(a) => a.top}px;
`

const Pop = keyframes`
  0%{
   transform: scale(0);
  }
  100%{
    transform: scale(1);
  }

`
export const Container = styled.div`
  display: flex;
  position: absolute;
  height: 50%;
  top: 100px;
  width: 92%;
  margin: 0 4%;
  gap: 1rem;
`
export const ColoredBox = styled.div<{ color: string; span: number }>`
  background-color: ${(a) => a.color};
  flex: ${(a) => a.span};
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding: 30px 20px;
  align-items: center;
  gap: 25px;
`
export const PaintBoxContainer = styled.div`
  display: flex;
  /* display: flex; */
  /* flex-grow: 0; */
  flex-direction: column;
  /* grid-template-columns: repeat(4, 1fr); */
  gap: 10px;
`
export const PaintBox = styled.div`
  &.white {
    grid-column-start: 1;
    grid-column-end: 4;
  }
  &.blue {
  }
  transition: all cubic-bezier(0.165, 0.84, 0.44, 1) 1s;
  animation: ${Pop} 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
`
export const TitleBox = styled.div<{ color: string; bgColor: string }>`
  font-family: Nunito;
  font-size: 20px;
  font-weight: 700;
  line-height: 28px;
  letter-spacing: 0px;
  text-align: center;
  color: ${(a) => a.color};
  background-color: ${(a) => a.bgColor};
  padding: 5px 10px;
`
export const OutPutColorContainer = styled.div<{ middle: boolean }>`
  display: flex;
  position: absolute;
  left: ${(a) => (a.middle ? 50 : 35.333)}%;
  /* 33.33+ 2 ( margin) */
  transform: translate(-50%);
  height: 130px;
  width: 130px;
  gap: 0;
  border-radius: 50%;
  top: 250px;
  overflow: hidden;
  border: 5px solid #646464;
  box-shadow: 7px 8px 4px 0px #00000040 inset;
  z-index: 2;
`
export const OutPutColor = styled.div<{ isFullWidth: boolean; color: string }>`
  background-color: ${(a) => a.color};
  height: 100%;
  width: ${(a) => (a.isFullWidth ? 100 : 50)}%;
  border: 15px solid ${(a) => a.color};
  z-index: 1;
  /* border: 0; */
`
export const BottomText = styled.div<{ bottom?: number }>`
  position: absolute;
  bottom: ${(a) => (a.bottom ? a.bottom : 230)}px;
  width: 100%;
  text-align: center;
  justify-content: center;
  //styleName: Sub heading/Bold;
  font-family: Nunito;
  font-size: 20px;
  font-weight: 700;
  line-height: 28px;
  letter-spacing: 0px;
  text-align: center;
  padding: 0 10%;
`
export const StepperButtoContainer = styled.div<{ bottom?: number }>`
  position: absolute;
  bottom: ${(a) => (a.bottom ? a.bottom : 120)}px;
  width: 100%;
  display: flex;
  justify-content: space-around;
  padding: 0 10%;
`
export const ColumnFlex = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-family: Nunito;
  font-size: 20px;
  font-weight: 700;
  line-height: 28px;
  letter-spacing: 0px;
  text-align: center;
`
export const RowFlex = styled.div`
  display: flex;
  justify-content: center;
  overflow-wrap: break-word;
  flex-wrap: wrap;
  padding: 0 5%;
  gap: 10px;
`
export const ButtonHolder = styled.div<{ bottom?: number }>`
  position: absolute;
  bottom: ${(a) => (a.bottom ? a.bottom : 20)}px;
  width: 100%;
  display: flex;
  justify-content: center;
  /* pointer-events: none; */
`
export const Button = styled.div<{ isActive: boolean }>`
  opacity: ${(a) => (a.isActive ? 1 : 0.4)};
  font-family: Nunito;
  font-size: 24px;
  font-weight: 700;
  line-height: 32px;
  letter-spacing: 0px;
  text-align: center;
  padding: 16px 24px 16px 24px;
  border-radius: 10px;
  gap: 8px;
  background-color: #1a1a1a;
  color: white;
  cursor: pointer;
  display: flex;
`
export const BasketBallCrop = styled.div``

export const BasketBallContainer = styled.div`
  position: absolute;
  top: 75px;
  width: 96%;
  margin: 2%;
`
export const ColoredSpan = styled.span<{ color: string; bgColor: string }>`
  color: ${(a) => a.color};
  background-color: ${(a) => a.bgColor};
  padding: 3px 5px;
  border-radius: 5px;
`

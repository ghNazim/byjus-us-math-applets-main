import styled, { css } from 'styled-components'

export const cellTextMixin = css`
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 400;
  font-size: 20px;
  line-height: 28px;
  color: #646464;
`

export const Container = styled.div`
  position: absolute;
  left: 20px;
  top: 100px;
  width: 680px;
  min-height: 680px;

  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 20px;
`
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
export const CellText = styled(Text)`
  font-weight: 400;

  .colorbox {
    border-radius: 4px;
    margin-left: 2px;
  }
`
export const FeedBackText = styled.div`
  min-height: 50px;
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: #444444;
`
export const StepperContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding: 0px 12px;
  gap: 20px;
`
export const StepperLabel = styled.label<{ color: string }>`
  font-family: Nunito;
  font-size: 20px;
  font-weight: 700;
  line-height: 28px;
  text-align: center;

  span {
    color: ${(props) => props.color};
  }
`
export const CTAContainer = styled(StepperContainer)`
  justify-content: center;
`
export const CTAButton = styled.button`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 16px 24px;
  gap: 8px;

  border: none;
  margin: 0px;

  height: 60px;

  background: #1a1a1a;
  border-radius: 10px;

  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 24px;
  line-height: 32px;
  color: #ffffff;

  cursor: auto;
  scale: 1;

  &:hover {
    cursor: pointer;
    scale: 1.1;
  }

  &:disabled {
    opacity: 0.2;
    cursor: not-allowed;
    scale: 1;
  }

  transition: 300ms;
`
export const Table = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  width: 680px;
  height: 400px;

  border: 1px solid #eaccff;
  border-radius: 8px;
`
export const Row = styled.div<{ isActive?: boolean }>`
  height: 116px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: stretch;
  background: ${(props) => (props.isActive ? '#FAF2FF' : 'none')};
`
export const TitleRow = styled(Row)`
  height: 52px;
`
export const HLine = styled.div`
  background: #eaccff;
  height: 1px;
`
export const Cell = styled.div<{ isActive?: boolean }>`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background: ${(props) => (props.isActive ? '#FAF2FF' : 'none')};
  &:first-child {
    width: 165px;
  }
  &:nth-child(3) {
    width: 303px;
  }
  &:nth-child(5) {
    width: 210px;
  }
`
export const VLine = styled.div`
  background: #eaccff;
  width: 1px;
`
export const COLOR_1 = '#ED6B90'
export const COLOR_2 = '#6595DE'

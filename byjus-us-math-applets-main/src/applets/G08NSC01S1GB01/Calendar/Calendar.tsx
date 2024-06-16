import { FC, useContext, useEffect, useState } from 'react'
import styled from 'styled-components'

import { AnalyticsContext } from '@/contexts/analytics'
import { useSFX } from '@/hooks/useSFX'

const CalendarPop = styled.div<{ left: number; top: number; visible: boolean }>`
  position: absolute;
  left: ${(p) => p.left}px;
  top: ${(p) => p.top}px;
  gap: 15px;
  display: flex;
  width: 260px;
  height: 290px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  border: 1px solid #c7c7c7;
  background: #ffffff;
  ${(p) => !p.visible && 'visibility: hidden;'}
  ::after {
    content: ' ';
    position: absolute;
    left: 50%;
    translate: -50%;
    top: 100%;
    border-bottom: none;
    border-right: 12px solid transparent;
    border-left: 12px solid transparent;
    border-top: 12px solid #c7c7c7;
  }
`
const Month = styled.div`
  display: flex;
  width: 260px;
  height: 28px;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  font-family: Nunito;
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: 28px;
  text-align: center;

  label {
    color: #1a1a1a;
  }
  button {
    font-size: 20px;
    width: 28px;
    height: 28px;
    border-radius: 5px;
    border: 1px solid #f6f6f6;
    background: #ffffff;
    color: #1a1a1a;
    cursor: pointer;
    &:hover:not([disabled]) {
      border: 1px solid #9a9a9a;
      background: #f6f6f6;
    }
    :disabled {
      cursor: default;
      opacity: 0.3;
    }
  }
`
const Dates = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  width: 242px;
  height: 230px;
`
const Day = styled.button<{ selected: boolean }>`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  font-family: Nunito;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: 28px;
  text-align: center;
  width: 28px;
  height: 28px;
  border-radius: 5px;
  border: none;
  background: ${(p) => (p.selected ? '#1a1a1a' : '#ffffff')};
  color: ${(p) => (!p.selected ? '#1a1a1a' : '#ffffff')};
  cursor: pointer;
  :hover {
    ${(p) => !p.selected && 'background: #cacaca;'}
  }
`
interface CalendarProps {
  left: number
  top: number
  date: Date
  onChange: (selectedDate: string) => void
  visible: boolean
}
const Calendar: FC<CalendarProps> = ({ left, top, date, onChange, visible }) => {
  const [month, setMonth] = useState(date.getMonth())
  const [day, setDay] = useState(date.getDate())
  const [monthName, setMonthName] = useState('')
  const [selectedDate, setSelectedDate] = useState('')
  const playClick = useSFX('mouseClick')
  const onInteraction = useContext(AnalyticsContext)
  const days = []

  const noOfDays = month == 3 || month == 5 || month == 8 || month == 10 ? 30 : month == 1 ? 29 : 31
  for (let i = 0; i < noOfDays; i++) {
    days.push(
      <Day
        key={i}
        selected={day === i + 1}
        onClick={() => {
          setDay(i + 1)
          onInteraction('tap')
          playClick()
        }}
      >
        {i + 1}
      </Day>,
    )
  }
  useEffect(() => {
    switch (month) {
      case 0:
        setMonthName('January')
        break
      case 1:
        setMonthName('February')
        if (day > 29) setDay(29)
        break
      case 2:
        setMonthName('March')
        break
      case 3:
        setMonthName('April')
        if (day > 30) setDay(30)
        break
      case 4:
        setMonthName('May')
        break
      case 5:
        setMonthName('June')
        if (day > 30) setDay(30)
        break
      case 6:
        setMonthName('July')
        break
      case 7:
        setMonthName('August')
        break
      case 8:
        setMonthName('September')
        if (day > 30) setDay(30)
        break
      case 9:
        setMonthName('October')
        break
      case 10:
        setMonthName('November')
        if (day > 30) setDay(30)
        break
      case 11:
        setMonthName('December')
        break
    }
    setSelectedDate(
      (month + 1 < 10 ? '0' + (month + 1) : '' + (month + 1)) + (day < 10 ? '0' + day : '' + day),
    )
  }, [month, day])
  useEffect(() => {
    setSelectedDate(
      (month + 1 < 10 ? '0' + (month + 1) : '' + (month + 1)) + (day < 10 ? '0' + day : '' + day),
    )
  }, [day])
  useEffect(() => {
    onChange(selectedDate)
  }, [selectedDate])
  return (
    <CalendarPop left={left} top={top} visible={visible}>
      <Month>
        <button
          disabled={month == 0 ? true : false}
          onClick={() => {
            onInteraction('tap')
            playClick()
            setMonth((m) => m - 1)
          }}
        >
          {'\u003C'}
        </button>
        <label>{monthName}</label>
        <button
          disabled={month == 11 ? true : false}
          onClick={() => {
            setMonth((m) => m + 1)
            onInteraction('tap')
            playClick()
          }}
        >
          {'\u003E'}
        </button>
      </Month>
      <Dates>{days}</Dates>
    </CalendarPop>
  )
}

export default Calendar

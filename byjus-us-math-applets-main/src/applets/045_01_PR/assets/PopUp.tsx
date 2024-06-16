import React, { useState } from 'react'
import styled from 'styled-components'

import { warnImages, warnMessages } from './assetLib'
import cross from './cross.png'
import disclaimer from './disclaimer.png'

const PopUp = (props: { onclick: React.MouseEventHandler; qnNo: number }) => {
  const PopUpBG = styled.div`
    position: absolute;
    width: 100%;
    height: 98%;
    background: rgba(0, 0, 0, 0.3);
    top: 0px;
    z-index: 1;
    border-radius: 20px;
  `
  const Popup = styled.div`
    position: absolute;
    width: 100%;
    height: -moz-fit-content;
    height: -webkit-fit-content;
    height: -fit-content;
    background-color: #ffffff;
    bottom: -2px;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  `
  const Cross = styled.img`
    position: absolute;
    top: -11px;
    right: 23px;
    cursor: pointer;
  `
  const Disclaimer = styled.img`
    position: absolute;
    top: 0px;
    left: 0px;
    display: block;
  `
  const PopText = styled.div`
    width: 85%;
    margin: 100px 0;
    p {
      width: 500px;
      margin: 0;
      font-family: 'Nunito';
      font-style: normal;
      font-weight: 400;
      font-size: 20px;
      line-height: 28px;
      text-align: center;
      color: #444444;
      /* margin-right: -450px; */
      margin-left: 180px;
    }
  `
  const Button = styled.button`
    position: absolute;
    width: 160px;
    height: 60px;
    left: 50%;
    translate: -50%;
    bottom: 32px;
    border: none;
    background: #8c69ff;
    border-radius: 10px;
    cursor: pointer;
    font-family: 'Nunito';
    font-style: normal;
    font-weight: 500;
    font-size: 24px;
    line-height: 42px;
    text-align: center;
    color: #ffffff;
    align-items: center;
    display: flex;
    justify-content: center;
    &:disabled {
      cursor: default;
      opacity: 0.2;
    }
    &:hover {
      background: #7f5cf4;
    }
    &:active {
      background: #6549c2;
    }
  `

  const PopUpImage = styled.img`
    position: absolute;
    top: 90px;
    left: 50px;
  `

  return (
    <PopUpBG>
      <Popup>
        <Disclaimer src={disclaimer} />
        <Cross src={cross} onClick={props.onclick} />
        <span
          style={{
            width: '700px',
          }}
        >
          <PopUpImage src={warnImages[props.qnNo]} />
          <PopText>
            <p>{warnMessages[props.qnNo]}</p>
          </PopText>
        </span>

        <Button
          style={{
            height: '40px',
            width: '100px',
            fontSize: '16px',
            lineHeight: '24px',
            bottom: '20px',
          }}
          onClick={props.onclick}
        >
          Got it
        </Button>
      </Popup>
    </PopUpBG>
  )
}
export default PopUp

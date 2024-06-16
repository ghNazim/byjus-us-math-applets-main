import styled from 'styled-components'

interface FeedbackProps {
  text: string
  status: number
}

const Container = styled.div`
  width: 100%;
  height: auto;

  display: flex;
  flex-direction: column;
  gap: 10px;

  position: absolute;
  top: 490px;
`
const TextContainer = styled.div`
  width: 100%;

  display: flex;
  justify-content: center;
  align-items: center;

  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;
  color: #444444;
`
const ImageContainer = styled.div`
  width: 100%;

  display: flex;
  justify-content: center;
  gap: 20px;
`
const FeedbackContainer = styled.div<{ status: number }>`
  width: 267px;
  height: 48px;
  color: #444444;
  /* color: ${(props) =>
    props.status === 0 ? '#44444' : props.status === -1 ? '#FFF2F2' : '#444444'}; */
  border-radius: 5px;

  font-family: 'Nunito';
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;

  display: flex;
  align-items: center;
  text-align: center;
  background: ${(props) =>
    props.status === 0 ? '#ececec' : props.status === -1 ? '#FFF2F2' : '#E5FFEC'};
`
const text1 = ['1 ≤ Factor < 10', 'Exponent is an integer']
const Feedback: React.FunctionComponent<FeedbackProps> = ({ text, status = 1 }) => {
  return (
    <Container>
      <TextContainer>{text}</TextContainer>
      <ImageContainer>
        <FeedbackContainer status={status === 1 || status === 0 ? 0 : status === 2 ? -1 : 1}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ margin: '0px 30px 0px 10px' }}
          >
            {status === 2 && (
              <>
                <rect width="24" height="24" rx="12" fill="#CC6666" />
                <path
                  d="M16.875 7.125L7.125 16.875M7.125 7.125L16.875 16.875"
                  stroke="#FFF2F2"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </>
            )}
            {status === 3 && (
              <path
                d="M12 0C5.4 0 0 5.4 0 12C0 18.6 5.4 24 12 24C18.6 24 24 18.6 24 12C24 5.4 18.6 0 12 0ZM9.6 18L3.6 12L5.292 10.308L9.6 14.604L18.708 5.496L20.4 7.2L9.6 18Z"
                fill="#32A66C"
              />
            )}
          </svg>
          {text1[0]}
        </FeedbackContainer>
        <FeedbackContainer status={status >= 1 ? 1 : 0}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ margin: '0px 8px' }}
          >
            {status !== 0 && (
              <path
                d="M12 0C5.4 0 0 5.4 0 12C0 18.6 5.4 24 12 24C18.6 24 24 18.6 24 12C24 5.4 18.6 0 12 0ZM9.6 18L3.6 12L5.292 10.308L9.6 14.604L18.708 5.496L20.4 7.2L9.6 18Z"
                fill="#32A66C"
              />
            )}
          </svg>
          {text1[1]}
        </FeedbackContainer>
      </ImageContainer>
    </Container>
  )
}

export default Feedback

import { FlexRow } from "components/StyleComponents/FlexRow"
import styled from "styled-components"
import { StyledButton } from "components/StyleComponents/StyledButton"

const StyledDialogBox = styled.div`
  width: 25%;
  min-width: 400px;
  background-color: white;
  padding: 2em;
  box-sizing: border-box;
  border-radius: 10px;
  font-size: 0.9em;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.22), inset 0 0 3px 0 #262426;
  border: solid 1px #b9bac8;
`
export const popupOptions = {
  render: (message: string, onConfirm: () => void, onCancel: () => void) => {
    return (
      <StyledDialogBox>
        <div>{message}</div>
        <br />
        <FlexRow>
          <StyledButton
            style={{ margin: `0.5em`, backgroundColor: `grey` }}
            onClick={onCancel}
          >
            {" "}
            Go back{" "}
          </StyledButton>
          <br />
          <StyledButton style={{ margin: `0.5em` }} onClick={onConfirm}>
            {" "}
            Confirm{" "}
          </StyledButton>
        </FlexRow>
      </StyledDialogBox>
    )
  },
}

export const popupOptionWithoutCancel = {
  render: (message: any, onConfirm: () => void, onCancel: () => void) => {
    return (
      <StyledDialogBox>
        <div>
          Satellite is in Beta. Use at your own risk with funds you're
          comfortable using.{" "}
          <span
            style={{ cursor: `pointer`, color: `blue` }}
            onClick={() => {
              message && message()
              onConfirm()
            }}
          >
            Click here{" "}
          </span>
          for full Terms of Use.
        </div>
        <br />
        <FlexRow>
          <br />
          <StyledButton style={{ margin: `0.5em` }} onClick={onConfirm}>
            {" "}
            Confirm{" "}
          </StyledButton>
        </FlexRow>
      </StyledDialogBox>
    )
  },
}

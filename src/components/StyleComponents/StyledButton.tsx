import styled, { ThemedStyledProps } from "styled-components"

interface IStyledButtonProps extends ThemedStyledProps<any, any> {
  dim?: boolean
}

export const StyledButton = styled.button<IStyledButtonProps>`
  width: 100%;
  height: 35px;
  border-radius: 8px;
  border: none !important;
  box-shadow: 0 0 3px 0 rgba(11, 11, 12, 0.38);
  background-color: ${(props) => (props.dim ? "lightgray" : "#0b0b0f")};
  color: white;
  cursor: pointer;
`

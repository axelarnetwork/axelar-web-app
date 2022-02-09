import styled, { ThemedStyledProps } from "styled-components"

interface IStyledButtonProps extends ThemedStyledProps<any, any> {
  dim?: boolean
}

const PlainButton = styled.button<IStyledButtonProps>`
  border: none;
  background: none;
  cursor: pointer;
  margin: 0px 0px 0px 0px;
  padding: 0;
  color: ${(props) => (props.dim ? "#565656" : "white")};
  transition: color 1000ms;
`

export default PlainButton

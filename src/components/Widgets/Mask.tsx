import styled, { ThemedStyledProps } from "styled-components"
import { StyledCentered } from "components/StyleComponents/Centered"

export interface IMaskProps extends ThemedStyledProps<any, any> {
  centered: boolean
}

export const Mask = styled.div<IMaskProps>`
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 10000;
  background-color: rgba(0,0,0,0.25);
  ${(props) => (props.centered ? `${StyledCentered}` : null)}
`

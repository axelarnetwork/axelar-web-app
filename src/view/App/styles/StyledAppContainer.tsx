import styled from "styled-components"
import Container from "component/StyleComponents/Container"
import { StyledCentered } from "component/StyleComponents/Centered"

export const StyledAppContainer = styled(Container)`
  position: relative;
  ${StyledCentered}
  width: 100%;
  height: 100vh;
`

import styled from "styled-components"
import dividerSvg from "assets/svg/group.svg"

export const StyledDividerSvg = styled.div`
  background-image: url(${dividerSvg});
  background-repeat: no-repeat;
  background-size: contain;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 11px;
  height: 47px;
  width: 99%;
`

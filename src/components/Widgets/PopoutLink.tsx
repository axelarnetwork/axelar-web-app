import styled from "styled-components"
import { SVGImage } from "./SVGImage"

const StyledNewLink = styled.span`
  cursor: pointer;
  font-weight: bold;
  &:focus,
  &:hover,
  &:visited,
  &:link,
  &:active {
    text-decoration: underline;
  }
`
export const PopoutLink = ({
  text,
  onClick,
  link,
}: {
  text: string
  onClick?: any
  link?: string
}) => {
  return (
    <StyledNewLink onClick={onClick}>
      {text}
      {"  "}
      <SVGImage
        src={require(`assets/svg/link-new-tab.svg`).default}
        height={`0.8em`}
        width={`0.8em`}
      />
    </StyledNewLink>
  )
}

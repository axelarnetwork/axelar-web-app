import styled from "styled-components"

interface ILinkProps {
  children: any
  href?: string
  style?: any
}

const Link = ({ children, href, style }: ILinkProps) => (
  <a href={href} target={"_blank"} rel="noreferrer" style={style}>
    {children}
  </a>
)

const StyledLink = styled(Link)`
  cursor: pointer;
`

export default StyledLink

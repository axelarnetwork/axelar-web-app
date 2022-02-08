import { HTMLAttributes, ReactElement } from "react"
import styled, { ThemedStyledProps } from "styled-components"

interface IStyledDivProps extends ThemedStyledProps<any, any> {
  width: string
  height: string
  style: any
  padding: string
}

const StyledContainer = styled.div<IStyledDivProps>`
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  margin: ${(props) => props.margin};
  style: ${(props) => props.style};
  padding: ${(props) => props.padding};
`

interface IContainerProps extends HTMLAttributes<HTMLDivElement> {
  width?: string
  height?: string
  margin?: string
  padding?: string
  style?: any
}

const Container = (props: IContainerProps): ReactElement => {
  return <StyledContainer {...props} />
}

export default Container

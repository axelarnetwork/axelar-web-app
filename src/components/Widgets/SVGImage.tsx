import styled, { ThemedStyledProps } from "styled-components"
import wrappedSvg from "react-inlinesvg"

export interface IStyledSVGImageProps extends ThemedStyledProps<any, any> {
  margin: string
}

export const SVGImage = styled(wrappedSvg)<IStyledSVGImageProps>`
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  margin: ${(props) => props.margin};
  padding: ${(props) => props.padding};
  object-fit: contain;
`

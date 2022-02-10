import { css } from "styled-components"

export const PageOpacityAnimation = css`
  .page {
  }

  .page-enter {
    opacity: 0;
  }

  .page-enter-active {
    opacity: 1;
    transition: opacity 2000ms;
  }

  .page-exit {
    opacity: 1;
  }

  .page-exit-active {
    opacity: 0;
  }
`

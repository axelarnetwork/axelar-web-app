import { css } from "styled-components"

export const opacityAnimation = css`
  &.lighten-exit {
    opacity: 1;
  }
  .lighten-enter {
    opacity: 0;
  }
  .lighten-enter-active {
    opacity: 1;
  }

  .lighten-exit {
    opacity: 1;
  }

  .lighten-exit-active {
    opacity: 0;
  }

  .lighten-enter-active {
    transition: opacity 1000ms;
  }

  .lighten-exit-active {
    transition: opacity 50ms;
  }
`

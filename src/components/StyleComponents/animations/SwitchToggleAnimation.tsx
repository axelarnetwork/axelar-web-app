import { css } from "styled-components"

export const animateStyles = css`
  &.fade-exit {
    opacity: 1;
    /*transform: translateX(0%);*/
  }
  .fade-enter {
    opacity: 0;
    transform: translateX(25%);
  }
  .fade-enter-active {
    opacity: 1;
    transform: translateX(0%);
  }

  .fade-exit {
    opacity: 1;
    /*transform: translateX(0%);*/
  }

  .fade-exit-active {
    opacity: 0;
    /*transform: translateX(-25%);*/
  }

  .fade-enter-active {
    transition: opacity 250ms, transform 250ms;
  }

  .fade-exit-active {
    transition: opacity 500ms, transform 500ms;
  }
`

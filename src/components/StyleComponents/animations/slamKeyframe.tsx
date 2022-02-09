import { keyframes } from "styled-components"

export const slamKeyframe = keyframes`
    0% {
        transform: scale(10, 10);
        opacity: 0;
    }

    40% {
        opacity: 0;
    }

    100% {
        transform: scale(1, 1);
        opacity: 1;
    }
`

import { keyframes } from "styled-components"

export const fadeInFromLeft = keyframes`
	0% { opacity: 0; transform: translate(-50%, 0%); }
	10% { opacity: 0.1; transform: translate(-45%, 25%); }
	20% { opacity: 0.2; transform: translate(-40%, 0%); }
	30% { opacity: 0.3; transform: translate(-35%, 15%); }
	40% { opacity: 0.4; transform: translate(-30%, 0%); }
	50% { opacity: 0.5; transform: translate(-25%, 10%); }
	60% { opacity: 0.6; transform: translate(-20%, 0%); }
	70% { opacity: 0.7; transform: translate(-15%, 5%); }
	80% { opacity: 0.8; transform: translate(-10%, 0%); }
	90% { opacity: 0.9; transform: translate(-5%, 2%); }
	100% { opacity: 1; transform: translate(0%, 0%); }
`

export const fadeIn = keyframes`
	from {
		opacity: 0;
	}
	to {
		opacity: 1;
	}
`

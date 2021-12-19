import {Step} from "react-joyride";

export const WalkthroughSteps: Step[] = [
	{
		target: 'body',
		placement: 'center',
		styles: {options: {width: `60vw`}},
		content: <div>
			<h1>First time here?</h1>
			<>Here's a brief walkthrough.</>
		</div>,
	},
	{
		target: '.joyride-chain-selector',
		placement: 'right-end',
		content: <div>
			<div>Transfer assets across any of our ever-expanding list of supported chains.</div>
			<br/>
			<div>Right now, we support five EVM chains, along with Terra and the Axelar Network.</div>
			<br/>
			<div>The option to select an asset will appear once a source chain is selected.</div>
		</div>,
	},
	{
		target: '.joyride-top-flows',
		content: 'Or choose among some of our popular flows',
	},
	{
		target: '.joyride-input-button',
		content: `You'll be able to move forward once you enter valid inputs. The app will light up when that happens :-)`,
	},
	{
		target: ".joyride-faq",
		placement: 'left-end',
		content: `If any issues arise during a "live" transaction, feel free to reach out to us here. 
			A trace ID is generated with every transaction, so reference that in reaching out to us.`,
	},
	{
		target: ".joyride-status-step-1",
		content: `Step 1`,
	},
	{
		target: ".joyride-status-step-2",
		content: `Step 2`,
	},
	{
		target: ".joyride-status-step-3",
		content: `Step 3`,
	},
	{
		target: ".joyride-status-step-4",
		content: `Step 4`,
	},
	{
		target: 'body',
		placement: 'center',
		styles: {options: {width: `60vw`}},
		content: <div>
			<h1>Now go have fun</h1>
		</div>,
	},
];

export const BreakIndex: number = WalkthroughSteps.findIndex(step => step.target === ".joyride-status-step-1") || -1;
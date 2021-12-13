import SupportedAssets from "./SupportedAssets";

export interface IQA {
	question: string;
	answer: string | any;
}


const QAs: IQA[] = [
	{
		question: `What assets do you support?`,
		answer: <SupportedAssets/>
	}, {
		question: `Once my deposit is confirmed in Step 3, do I have to wait for Step 4?`,
		answer: `No; instead, you can go and check your updated wallet balance on the destination chain shortly after the deposit confirmation in Step 3.`
	}
];

export default QAs;

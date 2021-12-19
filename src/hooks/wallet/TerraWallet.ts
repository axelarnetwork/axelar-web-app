import { LCDClient, Wallet, MnemonicKey, Fee} from '@terra-money/terra.js';

const anchor = new LCDClient({ URL: 'https://bombay-lcd.terra.dev', chainID:'bombay-12' });
const owner = new MnemonicKey({ mnemonic: "..."});
const wallet = new Wallet(anchor, owner);

/*
'@terra-money/wallet-provider' example: https://codesandbox.io/s/github/terra-money/wallet-provider/tree/main/templates/create-react-app?file=/src/components/SignSample.tsx
*
* */
// async function depositStable() {
// 	const tx = await wallet.createAndSignTx({
// 		msgs: depositMsg,
// 		fee: new Fee(200_000, { uluna: 20_000_000 })
// 	});
// 	anchor.ibcTransfer.
// 	return await anchor.tx.broadcast(tx);
// }
//
// async function main() {
// 	await depositStable();
// }
//
// main().catch(console.error);
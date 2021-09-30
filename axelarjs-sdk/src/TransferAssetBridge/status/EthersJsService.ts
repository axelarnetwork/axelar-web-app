import {ethers}              from "ethers";
import {WaitingService}      from "./WaitingService";
import {getEthersJsProvider} from "./utils/ethersjsProvider";
import {formatEther}         from "ethers/lib/utils";

declare const window: any;

/*
* need to do:
* 1 - get config information of smart contract we have deployed on ethereum
* 2 - get ABI of smart contract. can define as a JS array where each element is a string, i.e.
*   const ABI = ['function data() view returns(uint)']
*   then,
* 3 - what is the best provider we want to use? do we have an infura account?
*
* */

//TODO: move address and abi to config folder once ready

//TODO: find a way to extract this from a repository instead of hard-coding
// taken from https://axelardocs.vercel.app/testnet-releases
const axelarBTCAddr: string = '0xffd3166c826C140acC66571025d76001D1293Df0';

// taken from https://github.com/axelarnetwork/ethereum-bridge
const axelarBTCAbi: string[] = [
	"function name() view returns (string)",
	"function symbol() view returns (string)",
	"function balanceOf(address) view returns (uint)", 	// Get the account balance
	"event Transfer(address indexed from, address indexed to, uint amount)" 	// An event triggered whenever anyone transfers to someone else, IERC20.sol
];

export default class EthersJsService extends WaitingService {

	private provider;
	private axelarBTCContract;
	private filter: any;

	constructor(depositAddress: string) {
		super(6, depositAddress);

		//TODO: what is the best provider to use?
		this.provider = getEthersJsProvider("ropsten");
		this.axelarBTCContract = new ethers.Contract(axelarBTCAddr, axelarBTCAbi, this.provider);
		this.filter = this.axelarBTCContract.filters.Transfer(null, depositAddress);
	}

	public wait(address: string, cb: any) {
		this.axelarBTCContract.once(this.filter, (from, to, amount, event) => {
			console.log(`Incoming amount of: ${formatEther(amount)}, from: ${from}.`);
		});
	}
}
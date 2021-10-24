import {Bitcoin} from "./Bitcoin";
import Cosmos    from "./Cosmos";
import Ethereum  from "./Ethereum";
import {IChain}  from "./models/Chains";

const ChainList: IChain[] = [
	new Bitcoin(),
	new Cosmos(),
	new Ethereum()
]

export default ChainList;
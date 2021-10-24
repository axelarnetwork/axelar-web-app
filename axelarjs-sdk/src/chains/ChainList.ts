import {Bitcoin} from "./Bitcoin";
import Cosmos    from "./Cosmos";
import Ethereum  from "./Ethereum";

const ChainList: any[] = [
	new Bitcoin(),
	new Cosmos(),
	new Ethereum()
]

export default ChainList;
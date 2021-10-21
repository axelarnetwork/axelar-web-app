import BlockCypherService from "./BlockCypherService";
import EthersJsService    from "./EthersJsService";
import TendermintService  from "./TendermintService";

const waitingService: any = {
	"btc": BlockCypherService,
	"eth": EthersJsService,
	"cos": TendermintService
};

const getWaitingService = (type: string) => {
	return new waitingService[type.toLowerCase()];
};

export default getWaitingService;
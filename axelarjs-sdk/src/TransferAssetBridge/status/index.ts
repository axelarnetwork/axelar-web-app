import BlockCypherService from "./BlockCypherService";
import EthersJsService    from "./EthersJsService";

const waitingService: any = {
	"bitcoin": BlockCypherService,
	"ethereum": EthersJsService
};

const getWaitingService = (type: string) => new waitingService[type];

export default getWaitingService;
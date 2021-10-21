import {WaitingService} from "./WaitingService";
import {IAsset}         from "../../constants";
import {StatusResponse} from "../index";

export default class TendermintService extends WaitingService {

	constructor(depositAddress: string) {
		super(1, depositAddress);
	}

	public async wait(depositAddress: IAsset, interimStatusCb?: StatusResponse) {

	}
}
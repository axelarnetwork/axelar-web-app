import {WebSocketClient} from "./WebSocketClient";

export class BaseListener {

	private client: WebSocketClient;

	public constructor() {

		if (this.constructor == BaseListener) {
			throw new Error("abstract class only.");
		}

		const connectionString: string = process.env.WEBSOCKET_URL as string;
		console.log("websocket connection string in DepositConfirmationListener: ", connectionString);
		this.client = new WebSocketClient(connectionString);

	}

	public listen(...args: any[]) {
		throw new Error("Method 'wait()' should be implemented.");
	}

	public initialize() {
		this.client.initialize();
	}

	public subscribe(event: any, query: any, handler: any) {
		this.client.subscribe(event, query, handler)
	}

}
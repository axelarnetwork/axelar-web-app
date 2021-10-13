/*
* With credit to terra.js: https://github.com/terra-money/terra.js
* */

import { EventEmitter } from 'events';
import WebSocket     from 'ws';
import { hashAmino } from '../util/hash';

type Callback = (data: TendermintSubscriptionResponse) => void;

export interface TendermintSubscriptionResponse {
	type: string;
	value: Record<string, any>;
}

export type TendermintEventType =
	| 'NewBlock'
	| 'NewBlockHeader'
	| 'Evidence'
	| 'Link'
	| 'Tx'
	| 'ValidatorSetUpdates'
	| 'CompleteProposal'
	| 'Lock'
	| 'NewRound'
	| 'NewRoundStep'
	| 'Polka'
	| 'Relock'
	| 'Relock'
	| 'TimeoutPropose'
	| 'TimeoutWait'
	| 'Unlock'
	| 'ValidBlock'
	| 'Vote';

type TendermintQueryOperand = string | number | Date;

export interface TendermintQuery {
	[k: string]:
		| TendermintQueryOperand
		| ['ethereum']
		| ['bitcoin'];
}

const escapeSingleQuotes = (str: string) => str.replace(/'/g, "\\'");

function makeQueryParams(query: TendermintQuery): string {
	const queryBuilder: string[] = [];
	for (const key of Object.keys(query)) {
		let queryItem: string;
		const value = query[key];
		// if value is scalar
		if (!Array.isArray(value)) {
			switch (typeof value) {
				case 'number':
					queryItem = `${key}=${value}`;
					break;
				case 'string':
					queryItem = `${key}='${escapeSingleQuotes(value)}'`;
					break;
				default:
					// Date
					queryItem = `${key}=${value.toISOString()}`;
			}
		} else {
			switch (value[0]) {
				case 'bitcoin':
				case 'ethereum':
					queryItem = `${key}=${value[0]}`;
					break;
			}
		}
		queryBuilder.push(queryItem);
	}
	return queryBuilder.join(' AND ');
}

/**
 * An object repesenting a connection to a Terra node's WebSocket RPC endpoint.
 * This allows for subscribing to Tendermint events through WebSocket.
 *
 * ### Events
 * **error** emitted when error raises
 * **connect** emitted after connection establishment
 * **reconnect** emitted upon every attempt of reconnection
 * **destroyed** emitted when socket has been destroyed
 *
 * ### Example
 *
 * ```ts
 * import { WebSocketClient } from '@terra-money/terra.js';
 *
 * const wsclient = new WebSocketClient("ws://localhost:26657/websocket");
 *
 * wsclient.subscribe('NewBlock', {}, (data) => {
 *    console.log(data.value);
 *
 *    // close after receiving one block.
 *    wsclient.destroy();
 * })
 *
 * wsclient.subscribe(
 * 'Tx',
 *  {
 *    'message.action': 'send',
 *    'message.sender': ['CONTAINS', 'terra1...'],
 *  },
 *  (data) => {
 *    console.log(data.value);
 *
 *   // close after receiving one send Tx
 *   wsclient.destroy();
 * });
 *
 * ```
 */
export class WebSocketClient extends EventEmitter {
	public isConnected: boolean;
	private reconnectTimeoutId?: NodeJS.Timeout;
	private queryParams?: string;
	private callback?: Callback;
	private shouldAttemptReconnect: boolean;
	private socket!: WebSocket;
	private _reconnectCount: number;

	/**
	 * WebSocketClient constructor
	 * @param URL The WebSocket endpoint URL on the Tendermint RPC server.
	 *            Ex: ws://localhost:26667/websocket
	 * @param reconnectCount 0 for not to attempt reconnect, -1 for infinite, > 0 for number of times to attempt
	 * @param reconnectInterval retry interval in milliseconds
	 */
	constructor(
		private URL: string,
		private reconnectCount = 0,
		private reconnectInterval = 1000
	) {
		super();
		console.log("WebSocketClient");
		this._reconnectCount = this.reconnectCount;
		this.isConnected = false;
		this.shouldAttemptReconnect = !!this.reconnectInterval;
	}

	/**
	 * Destroys class as well as socket
	 */
	destroy() {
		this.shouldAttemptReconnect = false;
		this.reconnectTimeoutId && clearTimeout(this.reconnectTimeoutId);
		this.socket && this.socket.close();
	}

	initialize() {
		this.socket = new WebSocket(this.URL);

		this.socket.onopen = this.onOpen.bind(this);
		this.socket.onmessage = this.onMessage.bind(this);
		this.socket.onclose = this.onClose.bind(this);
		this.socket.onerror = () => undefined;
	}

	private onOpen() {
		this.isConnected = true;
		console.log("is connected",this.isConnected);
		this.emit('connect');
		// reset reconnectCount after connection establishment
		this._reconnectCount = this.reconnectCount;

		this.socket.send(
			JSON.stringify({
				jsonrpc: '2.0',
				method: 'subscribe',
				params: [this.queryParams],
				id: 1,
			})
		);
	}

	private onMessage(message: WebSocket.MessageEvent) {
		try {
			const parsedData = JSON.parse(message.data.toString());

			if (
				this.callback &&
				parsedData.result &&
				parsedData.result.query === this.queryParams
			) {
				// this.emit('message', parsedData.result.data);
				this.callback(parsedData.result.data);
			}
		} catch (err) {
			this.emit('error', err);
		}
	}

	private onClose() {
		this.isConnected = false;
		console.log("got disconnected");

		if (
			this.shouldAttemptReconnect &&
			(this._reconnectCount > 0 || this._reconnectCount === -1)
		) {
			if (this._reconnectCount !== -1) {
				this._reconnectCount--;
			}

			this.reconnectTimeoutId && clearTimeout(this.reconnectTimeoutId);
			this.reconnectTimeoutId = setTimeout(() => {
				this.emit('reconnect');
				this.initialize();
			}, this.reconnectInterval);
		} else {
			this.emit('destroyed');
		}
	}

	public subscribe(
		event: TendermintEventType,
		query: TendermintQuery,
		callback: Callback
	): void {
		console.log("~~~~~SUBSCRIBING");
		this.queryParams = makeQueryParams({
			'tm.event': event,
			...query,
		});
		this.callback = callback;
	}

	public subscribeTx(query: TendermintQuery, callback: Callback): void {
		const newCallback: Callback = d => {
			d.value.TxResult.txhash = hashAmino(d.value.TxResult.tx);
			return callback(d);
		};

		this.subscribe('Tx', query, newCallback);
	}
}
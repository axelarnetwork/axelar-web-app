import {getConfigs} from "@axelar-network/axelarjs-sdk";
import axios        from "axios";

type messageType = "error" | "info" | "debug";
interface LogMessageObject {
	messageType: messageType;
	message: string;
	topic: string;
}

export class SendLogsToServer {

	private static NODE_SERVER_URL: string = getConfigs(process.env.REACT_APP_STAGE as string)?.resourceUrl;
	private static LOGGING_ENDPOINT: string = SendLogsToServer.NODE_SERVER_URL + '/logMessageController';

	private static async baseSend(messageType: messageType, topic: string, message: string, traceId: string) {

		const res = await axios.post(SendLogsToServer.LOGGING_ENDPOINT,
			{ messageType, topic, message } as LogMessageObject,
			{ headers: { "x-traceid": traceId } }
		);
		return res;

	}
	public static error(topic: string, message: string, traceId: string) {
		return SendLogsToServer.baseSend("error", topic, message, traceId);
	}
	public static info(topic: string, message: string, traceId: string) {
		return SendLogsToServer.baseSend("info", topic, message, traceId);
	}
}
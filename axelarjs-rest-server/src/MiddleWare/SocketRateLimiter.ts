import {RateLimiterMemory} from "rate-limiter-flexible";

/*

This configuration rate limits the socket endpoints, which in turn
makes a downstream socket connection to the tendermint websocket
on an Axelar node.

The figures are configured as environment variables.

* */
export const rateLimiter = new RateLimiterMemory({
	points: Number(String(process.env.SOCKET_SERVICE_USER_LIMIT)) | 50,
	duration: Number(String(process.env.SOCKET_SERVICE_USER_LIMIT_DURATION)) | 120_000,
});
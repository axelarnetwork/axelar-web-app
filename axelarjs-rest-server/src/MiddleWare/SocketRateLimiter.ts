import {RateLimiterMemory} from "rate-limiter-flexible";

export const rateLimiter = new RateLimiterMemory({
	points: 5, // 1 point
	duration: 120 * 1000, // per 2 minutes
});
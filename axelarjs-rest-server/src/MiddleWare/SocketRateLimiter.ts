import {RateLimiterMemory} from "rate-limiter-flexible";

/*
points == 5 && duration == 120 * 1000 = 5 requests every two minutes per user
TODO: revisit these params if necessary
* */
export const rateLimiter = new RateLimiterMemory({
	points: 50, // 1 point
	duration: 120 * 1000, // per 2 minutes
});
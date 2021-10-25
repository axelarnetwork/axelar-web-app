import Boom from "@hapi/boom";

export const restRateLimiter = {
	plugin: require('hapi-rate-limit'),
	options: {
		userLimit: 500,
		userCache: {
			segment: "hapi-rate-limit-user",
			expiresIn: 120 * 1000,
		},
		limitExceededResponse: () => Boom.tooManyRequests('Rate limit exceeded'),
	}
};

/*
Documentation for this library:
https://www.npmjs.com/package/hapi-rate-limit
* */
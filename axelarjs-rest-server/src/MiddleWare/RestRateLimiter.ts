import Boom from "@hapi/boom";

/*
This configuration rate limits the rest endpoints, which in turn
makes a downstream call to microservices.
The figures are configured as environment variables.
* */
export const restRateLimiter = {
	plugin: require('hapi-rate-limit'),
	options: {
		userLimit: Number(String(process.env.REST_SERVICE_USER_LIMIT)) | 2,
		userCache: {
			segment: "hapi-rate-limit-user",
			expiresIn: Number(String(process.env.REST_SERVICE_USER_LIMIT_DURATION)) | 60_000,
		},
		limitExceededResponse: () => Boom.tooManyRequests('Rate limit exceeded'),
	}
};

/*
Documentation for this library:
https://www.npmjs.com/package/hapi-rate-limit
* */
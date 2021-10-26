import Boom from "@hapi/boom";

/*
userLimit == 2 && expiresIn 60 * 1000 = 2 requests a minute per user
TODO: revisit these params if necessary
* */
export const restRateLimiter = {
	plugin: require('hapi-rate-limit'),
	options: {
		userLimit: 2,
		userCache: {
			segment: "hapi-rate-limit-user",
			expiresIn: 60 * 1000,
		},
		limitExceededResponse: () => Boom.tooManyRequests('Rate limit exceeded'),
	}
};

/*
Documentation for this library:
https://www.npmjs.com/package/hapi-rate-limit
* */
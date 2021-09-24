export const poll = ({ fn, validate, interval, maxAttempts }: any) => {

	let attempts = 0;

	const executePoll = async (resolve: any, reject: any) => {

		const result = await fn(attempts);

		attempts++;

		if (validate(result)) {
			console.log("done with poll for result: ",result);
			return resolve(result);
		} else if (maxAttempts && attempts === maxAttempts) {
			return reject(new Error('Exceeded max attempts'));
		} else {
			setTimeout(executePoll, interval, resolve, reject);
		}

	};

	return new Promise(executePoll);

};
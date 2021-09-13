const path = require(`path`);

module.exports = {
	webpack: {
		alias: {
			'@': path.resolve(__dirname, 'src/'),
			'@component': path.resolve(__dirname, 'src/component'),
			'@assets': path.resolve(__dirname, 'src/assets'),
		}
	},
};
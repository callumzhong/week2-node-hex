const HEADERS = require('../constants/headers');

const response = {
	success: ({ res, status, data }) => {
		res.writeHead(status, HEADERS);
		if (data) {
			res.write(
				JSON.stringify({
					status: 'SUCCESS',
					data: data,
				}),
			);
		}
		res.end();
	},
	error: ({ res, status, message }) => {
		res.writeHead(status, HEADERS);
		if (message) {
			res.write(
				JSON.stringify({
					status: 'ERROR',
					message: message,
				}),
			);
		}
		res.end();
	},
};

module.exports = response;

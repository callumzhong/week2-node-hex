const HEADERS = require('../constants/headers');
const CustomizeError = require('../exception/customizeError');

const ErrorHandler = ({ res, error }) => {
	console.log(2);
	// mongoose models require error
	if (error.name === 'ValidationError') {
		for (key in error.errors) {
			error.errors[key] = error.errors[key].message;
		}
		res.writeHead(400, HEADERS);
		res.write(
			JSON.stringify({
				status: 'ERROR',
				message: error.errors,
			}),
		);
		res.end();
		console.log(`errors: ${JSON.stringify(error.errors)}`);
		return;
	}
	if (error instanceof CustomizeError) {
		res.writeHead(400, HEADERS);
		res.write(
			JSON.stringify({
				status: 'ERROR',
				message: error.message,
			}),
		);
		res.end();
		console.log(`errors: ${error.message}`);
		return;
	}
	if (error instanceof SyntaxError) {
		res.writeHead(400, HEADERS);
		res.write(
			JSON.stringify({
				status: 'ERROR',
				message: 'JSON syntax error',
			}),
		);
		res.end();
		console.log(`syntax: ${error.message}`);
		return;
	}
	res.writeHead(400, HEADERS);
	res.write(
		JSON.stringify({
			status: 'ERROR',
			message: error.message,
		}),
	);
	res.end();
	// heroku logs an error
	console.log(`alert: ${error.message}`);
};

module.exports = ErrorHandler;

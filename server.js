'use strict';
require('dotenv').config();
const http = require('http');
const mongoose = require('mongoose');
const DATABASE = require('./config');
const ErrorHandler = require('./helpers/errorHandler');
const response = require('./helpers/response');
const postsRoute = require('./routes/posts');
const PORT = process.env.PORT || 3005;
mongoose
	.connect(DATABASE)
	.then(() => {
		console.log('database: 資料庫連線成功');
	})
	.catch((error) => {
		console.log(`database: 連線失敗 ${error.message}`);
	});
const listener = (req, res) => {
	Promise.all([postsRoute({ req, res })])
		.then((arr) => {
			const isNotFound = arr.some((i) => i === true);
			if (isNotFound) {
				response.error({
					res,
					status: 404,
					message: '查無此網站路由',
				});
			}
		})
		.catch((error) => {
			ErrorHandler({ res, error });
		});
};

const server = http.createServer(listener);
server.listen(PORT, () => {
	console.log('listening on port ' + PORT);
});

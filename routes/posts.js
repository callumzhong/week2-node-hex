const dayjs = require('dayjs');
const CustomizeError = require('../exception/customizeError');
const response = require('../helpers/response');
const Posts = require('../models/posts');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
const ErrorHandler = require('../helpers/errorHandler');

const PATH = '/posts';
dayjs.extend(utc);
dayjs.extend(timezone);

const changeTimezone = (data) => {
	if (!data) return data;
	if (Array.isArray(data)) {
		return data.map((i) => ({
			...i._doc,
			createdAt: dayjs(i.createdAt).tz('Asia/Taipei').format(),
			updatedAt: dayjs(i.updatedAt).tz('Asia/Taipei').format(),
		}));
	}
	return {
		...data._doc,
		createdAt: dayjs(data.createdAt).tz('Asia/Taipei').format(),
		updatedAt: dayjs(data.updatedAt).tz('Asia/Taipei').format(),
	};
};

const postsRoute = async ({ req, res }) => {
	const { url, method } = req;
	let body = '';
	req.on('data', (chunk) => {
		body += chunk;
	});

	if (method === 'OPTIONS') {
		res.writeHead(200, headers);
		res.end();
		return;
	}

	if (url === PATH && method === 'GET') {
		const posts = await Posts.find();
		response.success({
			res,
			status: 200,
			data: changeTimezone(posts),
		});
		return;
	}

	if (url.startsWith(PATH + '/') && method === 'GET') {
		const id = url.split('/').pop();
		const post = await Posts.findOne({ _id: id });
		if (!post) {
			throw new CustomizeError('查無此 ID 文章');
		}
		response.success({
			res,
			status: 200,
			data: changeTimezone(post),
		});
		return;
	}
	if (url === PATH && method === 'POST') {
		req.on('end', async () => {
			try {
				const obj = JSON.parse(body);
				if (Array.isArray(obj)) {
					throw new CustomizeError('資料不能是陣列');
				}
				if (obj?.content?.trim().length === 0 ?? false) {
					throw new CustomizeError('content 不能為空白');
				}
				if (!obj.content) {
					throw new CustomizeError('content 為必填');
				}

				await Posts.create(obj);
				const posts = await Posts.find();
				response.success({
					res,
					status: 200,
					data: changeTimezone(posts),
				});
			} catch (error) {
				ErrorHandler({ res, error });
			}
		});
		return;
	}
	if (url.startsWith(PATH + '/') && method === 'PATCH') {
		req.on('end', async () => {
			try {
				const obj = JSON.parse(body);
				if (Array.isArray(obj)) {
					throw new CustomizeError('資料請傳物件結構');
				}
				if (obj?.content?.trim().length === 0 ?? false) {
					throw new CustomizeError('content 不能為空白');
				}
				if (!obj.content) {
					throw new CustomizeError('content 為必填');
				}
				const id = url.split('/').pop();
				let post = await Posts.findOne({ _id: id });
				if (!post) {
					throw new CustomizeError('查無此 ID 文章');
				}
				post = await Posts.findOneAndUpdate({ _id: id }, obj, {
					returnDocument: 'after',
				});
				response.success({
					res,
					status: 200,
					data: changeTimezone(post),
				});
			} catch (error) {
				ErrorHandler({ res, error });
			}
		});
		return;
	}

	if (url === PATH && method === 'DELETE') {
		await Posts.deleteMany();
		const posts = await Posts.find();
		response.success({
			res,
			status: 200,
			data: changeTimezone(posts),
		});
		return;
	}

	if (url.startsWith(PATH + '/') && method === 'DELETE') {
		const id = url.split('/').pop();
		let post = await Posts.findOne({ _id: id });
		if (!post) {
			throw new CustomizeError('查無此 ID 文章');
		}
		await Posts.deleteOne({ _id: id });
		const posts = await Posts.find();
		response.success({
			res,
			status: 200,
			data: changeTimezone(posts),
		});
		return;
	}
	return true;
};
module.exports = postsRoute;

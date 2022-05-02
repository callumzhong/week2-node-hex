const PASSWORD = process.env.PASSWORD || 'qaz123';
const DATABASE =
	process.env.DATABASE?.replace('<password>', PASSWORD) ||
	`mongodb+srv://albertnotes:${PASSWORD}@testdb1.nse0a.mongodb.net/post?retryWrites=true&w=majority`;

module.exports = DATABASE;

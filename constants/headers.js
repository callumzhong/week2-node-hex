// Access-Control-Allow-Headers 支持的預檢請求
// X-Requested-With = > Ajax 請求
// Content-Type => 資源媒體類型
// Content-Length => 資源大小
// Authorization => 驗證
// https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers
const HEADERS = {
	'Access-Control-Allow-Headers':
		'Content-Type, Authorization, Content-Length, X-Requested-With',
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
	'Content-Type': 'application/json',
};

module.exports = HEADERS;

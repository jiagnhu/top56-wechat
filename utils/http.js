const md5 = require('../utils/md5.js')
// 访问地址
var API_URL = 'https://www.supreme-logistics.cn/api.ashx'
let _ROWSIGN = ''
let _AppKey = '582@#CTo*'
let _AppId = 'ZSLApp'
// 头部，header
let _HEADER = { appid: _AppId, device_id: '', command: '', version: '1.0', token: '',  sign: '', encrypt_type: '0' }
let _BODY = {}
var requestHandler = {
  url:'',
  params: {},
  success: function (res) {
    // success  
  },
  fail: function () {
    // fail  
  },
}
//GET请求  
function GET(requestHandler) {
  console.log(requestHandler);
  request('GET', requestHandler)
}
//POST请求  
function POST(requestHandler) {
  request('POST', requestHandler)
}

function request(method, requestHandler) {
  //注意：可以对params加密等处理 
  _HEADER.command = requestHandler.url.split('/').pop()
  requestHandler.url = API_URL
  _BODY = JSON.stringify(requestHandler.params)
  _ROWSIGN = _HEADER.appid + _BODY + _HEADER.command + _HEADER.device_id +
  _HEADER.encrypt_type + _HEADER.token + _HEADER.version + _AppKey;
  _HEADER.sign = md5.md5(_ROWSIGN).slice(8, 24)
  // 请求参数
  var params = {
    head: JSON.stringify(_HEADER),
    body: _BODY
  }
  wx.request({
    url: requestHandler.url,
    data: params,
    header: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
    },
    method: method, // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT  
    // header: {}, // 设置请求的 header  
    success: function (res) {
      //注意：可以对参数解密等处理  
      requestHandler.success(res)
    },
    fail: function () {
      requestHandler.fail()
    },
    complete: function () {
      // complete  
    }
  })
}

module.exports = {
  GET: GET,
  POST: POST
}  
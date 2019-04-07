// 抓取网络数据
var request = require('request'),
  iconv = require('iconv-lite')

function requestHtml(url, encode) {
  return new Promise((resolve, reject) => {
    request(
      {
        url: url,
        encoding: null,
        headers: {
          "Connection": "keep-alive",
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          "User-Agent": "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36"
        }//伪造请求头
      },
      function(err, res, body) {
        encode == 'gb2312' 
        ? (body = iconv.decode(body, 'gb2312'))
        : (body = iconv.decode(body, 'utf-8'))
        err ? reject(err) : resolve(body)
      }
    )
  })
}

module.exports = requestHtml

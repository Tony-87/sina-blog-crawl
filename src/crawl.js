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
          "User-Agent": "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36",
          cookie: "UM_distinctid=180d107fef35b2-00d1225d6026fe-5437971-3d10d-180d107fef4c6b; tgbuser=7304187; tgbpwd=cc4ad0e48b6bf99ece356e52aad677a135e943cfad94ca441da207a6a2132d902q5kzu363wiq2th; Hm_lvt_cc6a63a887a7d811c92b7cc41c441837=1652774484,1653560344; acw_tc=0a0966d616536106822161331e01733ef809e786aa121ff3acb706002292de; JSESSIONID=M2JmYTg5MTItMzJiOC00YmE4LTkwNTMtMTY4ZmM5ZWM5NWQ5; CNZZDATA1574657=cnzz_eid%3D2065896461-1652770155-%26ntime%3D1653610274; Hm_lpvt_cc6a63a887a7d811c92b7cc41c441837=1653611938"
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

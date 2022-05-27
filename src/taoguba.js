var fs = require('fs'),
  cheerio = require('cheerio'),
  crawl = require('./crawl.js'),
  totalPage = 1596
var blogId = '',
  mdFile = './data/' + blogId + '.MD',
  htmlFile = './data/' + blogId + '.html',
  txtFile = './data/' + blogId + '.txt'

async function getOnePageData(page) {
  if (page == 1) {
    var htmlStyleStr = `<style>
    *{font-size: 18px;}
    p{font-size:18px;}
    body{width: 60vw;}
    h1{font-weight: bold;color:darkviolet}
    .data-box{
        border-top:1px solid #f00;
    }
    img{width:300px;} 
    div{display:inline-block;}
    div+div{margin-left:10px;}
    </style>`
    fs.writeFileSync(mdFile, ' ')
    fs.writeFileSync(htmlFile, htmlStyleStr)
    fs.writeFileSync(txtFile, ' ')
  }

  //收集一页数据，保存到文件
  var url = 'https://www.taoguba.com.cn/Article/' + blogId + '/' + page
  console.log('url', url)

  let detailHtml = ''
  let cacheFile = './cache/tgb_' + blogId + '_' + page + '.html'
  if (fs.existsSync(cacheFile)) {
    detailHtml = fs.readFileSync(cacheFile).toString('utf-8')
  } else {
    detailHtml = await crawl(url)
    fs.writeFileSync(cacheFile, detailHtml)
  }
  var articleJson = getArticle(detailHtml)
  saveFile(articleJson)
}
function saveFile(articleJson) {
  var htmlStr = ''
  articleJson.forEach((item) => {
    htmlStr += '<hr>'
    htmlStr += '<h1>' + item.time + '</h1>'
    htmlStr += '<p class="content_p">' + item.html + '</p>'
  })
  fs.appendFileSync(htmlFile, htmlStr)
  //   fs.appendFileSync(mdFile, md)
  //   fs.appendFileSync(txtFile, txt)
}

function getArticle(articalBody) {
  var $ = cheerio.load(articalBody)

  var res = []

  var ustrs = $('[ustr="1116585"]')
//   console.log(ustrs[30]);
//   console.log($.html(ustrs[30]));
//   console.log(ustrs.length)
//   console.log(ustrs[100].html());
  for (let i = 0; i < ustrs.length; i++) {
    var time = $(ustrs[i]).find('.user-data-time .pcyclspan').text()
    var content = $.html($(ustrs[i]).find('.pcnr_wz'))
    content = content.replaceAll('class="lazy" src="placeHolder.png" src2','src')
    content = content.replaceAll('<br>','')
    content = content.replaceAll('onload="javascript:if(this.width>760)this.width=760"','')
    content = content.replaceAll('class="p_wz"','')
    content = content.replaceAll('style="margin:0 auto;padding-left: 16px;"','')
    content = content.replaceAll('align="center"','')
    content = content.replaceAll('data-type="contentImage"','')
    // content = content.replaceAll('class="pcnr_wz"','')
    content = content.replaceAll('onclick="opennewimg(this)"','')
    content = content.replace(/data-original="[\w:\/\."]*/gi,'')
    content = content.replace(/\r\n/,'')
    // console.log(time);
    // console.log(content);
    res.push({
      time: time,
      html: content,
    })
  }

  return res
}

//帖子ID
async function main(id) {
  blogId = id
  mdFile = './data/' + id + '.MD'
  htmlFile = './data/' + id + '.html'
  txtFile = './data/' + id + '.txt'

  await getOnePageData(1)
   
  if (totalPage > 1) {
    for (var i = 2; i <= totalPage; i++) {
      await getOnePageData(i)
    }
  }
}
module.exports = main
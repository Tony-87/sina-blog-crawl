var request = require('request'),
    cheerio = require('cheerio'),
    fs = require('fs');


var totalPage = 29;
var blogId = '1349490495';


async function getOnePageData(page) {
    //收集一页数据，保存到文件
    var url = 'http://blog.sina.com.cn/s/articlelist_' + blogId + '_0_' + page + '.html';
    console.log(url);
    page == 1 && fs.writeFileSync(blogId + '.txt', '')
    var bodyHtml  = await getPageBody(url);
    var pageLinks = getPageLinks(bodyHtml)

     
    await Promise.all(pageLinks.forEach(async  (url)=> {
        var itemBody = await getPageBody(url)
        var itemTxt = getArticle(itemBody);
        fs.appendFileSync(blogId+'.txt',itemTxt)
    }))
    
}

async function getOneArticle(url) {
    var itemBody = await getPageBody(url)
    var itemTxt = getArticle(itemBody);
    fs.appendFileSync(blogId+'.txt',itemTxt)
}

//获取一页的所有文章链接
function getPageLinks(body) {
    var $ = cheerio.load(body);
    var pageLinks = []
    $('.articleList .articleCell .atc_title a').each(function (index, item) {
        pageLinks.push($(item).prop('href'))
    })
    return pageLinks;
}

function getArticle(articalBody) {
    var $ = cheerio.load(articalBody);
    var title = $('#articlebody .articalTitle h2').text()
    var time = $('#articlebody .articalTitle .time').text()
    var content = $('#articlebody .articalContent').text()

    return title + '\r\n' + time + '\r\n' + content + '\r\n' + ('='.repeat(50)) + '\r\n'
}
//获取一页文章，并保存
function getOnePageArticle(pageLinks, page) {
    let count = 0;
    var articalStr = '';
    pageLinks.forEach(element => {
        dataRequest(element, page, function (articalBody) {
            count++;
            articalStr += getArticle(articalBody)
            if (count == pageLinks.length) {
                fs.writeFileSync(page + '.txt', articalStr);
                fs.appendFileSync(blogId + '.txt', articalStr);

                // pageIndex++;
                // if(pageIndex<=29)
                // {
                //     getOnePageData(pageIndex);
                // }


            }
        })
    });
}

// 请求网页
async function getPageBody(dataUrl) {
    return new Promise((resolve, reject) => {
        request({
            url: dataUrl,
            method: 'GET'
        }, function (err, res, body) {
            if (err) {
                console.log(dataUrl)
                console.error('[ERROR]Collection' + err);
                reject(err)
            }
            resolve(body);
        });
    });

}


async function main() {
    totalPage = 2;
    for (var i = 1; i <= totalPage; i++) {
        await getOnePageData(i)
    }

  
}

main()


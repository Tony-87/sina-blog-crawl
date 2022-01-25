var fs = require('fs'),
    cheerio = require('cheerio'),
    crawl = require('./crawl.js'),
    totalPage = 1;
var blogId = '',
    mdFile = './data/' + blogId + '.MD',
    htmlFile = './data/' + blogId + '.html',
    txtFile = './data/' + blogId + '.txt';

    //https://weibo.com/caopanshou1?is_search=0&visible=0&is_all=1&is_tag=0&profile_ftype=1&page=7 分页
    //https://weibo.com/2948854920/L89wt5Zwg 详情
    // https://weibo.com/2948854920/Lcinz08Pr

async function getOnePageData (page) {
    //收集一页数据，保存到文件
    var url = 'https://weibo.com/'+ blogId +'?is_search=0&visible=0&is_all=1&is_tag=0&profile_ftype=1&page=' + page;
    let body = await crawl(url)
    console.log(url);
    console.log(body);
    $ = cheerio.load(body)
    let pageText = $(".SG_pages span").text()
    totalPage = parseInt(pageText.match(/\d+/)[0])
    if (page == 1) {
        fs.writeFileSync(mdFile, ' ')
        fs.writeFileSync(htmlFile, ' ' )
        fs.writeFileSync(txtFile, ' ')
    }
    var pageLinks = getPageLinks(body)

    for (var i = 0; i < pageLinks.length; i++) {
        var fileName = pageLinks[i].match(/blog_\w+/)[0];
        let cacheFile = './cache/'+fileName+'.html'
        let detailHtml = ''
        if(fs.existsSync(cacheFile)){
            detailHtml = fs.readFileSync(cacheFile).toString('utf-8')
        }
        else{
            detailHtml = await crawl(pageLinks[i])
            fs.writeFileSync(cacheFile,detailHtml)
        }
        

        var articleJson = getArticle(detailHtml, pageLinks[i]);
        saveFile(articleJson)
    }
    console.log(page)
}
function saveFile (articleJson) {
    let { title, link, time, tags, category, content } = articleJson;

    let html = `<h2>${title}</h2>
               <a href="${link}" target="_blank">${time}</a>
               <div> ${tags} ; ${category} </div>
               <article>
               ${content}
               </article>
              `;
    let md = '## ' + title + '\r\n'
        + ' [' + time + '](' + link + ')\r\n '
        + '`' + tags + '；' + category + ') ` \r\n \t \r\n'
        + '> ' + content + '  \r\n'
        + ('-'.repeat(50)) + '\r\n';
    let txt = title + '\r\n' + time + '\r\n' + link + '\r\n' + tags + ';' + category + '\r\n\t\r\n'
        + content + '\r\n' + ('-'.repeat(50)) + '\r\n';

    fs.appendFileSync(htmlFile, html);
    fs.appendFileSync(mdFile, md)
    fs.appendFileSync(txtFile, txt)
}
//获取一页的所有文章链接
function getPageLinks (body) {
    var $ = cheerio.load(body);
    var pageLinks = []
    $('.articleList .articleCell .atc_title a').each(function (index, item) {
        pageLinks.push($(item).prop('href'))
    })
    return pageLinks;
}

function getArticle (articalBody, link) {
    var $ = cheerio.load(articalBody);
    var title = $('#articlebody .articalTitle h2').text().trim();
    var time = $('#articlebody .articalTitle .time').text().trim();
    var content = $('#articlebody .articalContent').text().trim();
    var abc = $("#sina_keyword_ad_area .SG_txtb")[0]
    var tags = $("#sina_keyword_ad_area .blog_tag").text().trim().replace(/\s/g, '')
    var category = $("#sina_keyword_ad_area .blog_class").text().trim().replace(/\s/g, '')
    return {
        title, time, link,
        tags, category, content
    }
    // return '## '+ title + '\r\n' 
    //        +' [' + time + ']('+ link +')\r\n ' 
    //        +'`' + tags + '；'+ category +') ` \r\n \t \r\n' 
    //        + '> ' + content + '  \r\n' 
    //        + ('-'.repeat(50)) + '\r\n';
}

async function main (id) {

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
 
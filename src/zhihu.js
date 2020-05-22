var fs = require('fs'),
    cheerio = require('cheerio'),
    crawl = require('./crawl.js'),
    pageSize=100,
    totalPage = 1;
var blogId = '',
    mdFile = './data/' + blogId + '.MD',
    htmlFile = './data/' + blogId + '.html',
    txtFile = './data/' + blogId + '.txt';


async function getOnePageData(page) {
    //收集一页数据，保存到文件
    var url = 'https://zhuanlan.zhihu.com/api/columns/' + blogId + '/articles?limit='+pageSize+'&offset=' + ((page - 1) * 100)

    let body = await crawl(url)//body 是json数据，格式参考  https://zhuanlan.zhihu.com/api/columns/investmentclub/articles?limit=1&offset=0
    
    
    let jsonData = JSON.parse(body)

    totalPage = Math.ceil(jsonData.paging.totals / 100)
    //第一页创建文件
    if (page == 1) {
        fs.writeFileSync(mdFile, ' ')
        fs.writeFileSync(htmlFile, ' ')
        fs.writeFileSync(txtFile, ' ')
    } 
    
    jsonData.data.forEach(item => {
        
        let article = {
            id:item.id,
            title:item.title,
            time:new Date(item.created*1000),
            link:item.url,
            tags:'ta', 
            category:'ca',
            htmlContent:item.content,
            content:item.content.replace(/<\/p>/g,'</p>\r\n').replace(/<\/?.+?>/g,"")
        }
        console.log('');
        
        saveFile(article)
    }) 
    
    console.log(page)
}
function saveFile(articleJson) {
    let { title, link, time, tags, category,htmlContent, content } = articleJson;

    let html = `<h2>${title}</h2>
               <a href="${link}" target="_blank">${time}</a>
               <div> ${tags} ; ${category} </div>
               <article>
               ${htmlContent}
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
 
//专栏地址
async function main(columnUrl, fileName) {

    blogId = columnUrl.slice(columnUrl.lastIndexOf('/') + 1)
    mdFile = './data/' + fileName + '.MD'
    htmlFile = './data/' + fileName + '.html'
    txtFile = './data/' + fileName + '.txt'

    await getOnePageData(1)
    if (totalPage > 1) {
        for (var i = 2; i <= totalPage; i++) {
            await getOnePageData(i)
        }
    }
}
module.exports = main

var key = "ylzd";
localStorage.setItem(key, "");
var article = localStorage.getItem(key);
var page = 1
function getOnePage() {
  var onePageTxt = document.querySelector(".text-container").innerText;

  //如果当页有图片，把图片地址保存下来
  var onePageHTML = document.querySelector(".text-container").innerHTML;
  if(onePageHTML.indexOf('<img')>=0){
     console.log(page);
  }
  article += (onePageTxt + '\n');
  localStorage.setItem(key, article);


  var nextBtn = document.querySelector(".ic-page-next");
  if (nextBtn.className.indexOf("disabled") === -1) {
    document.querySelector(".ic-page-next").click()
    page++
    setTimeout(function () {
      getOnePage();
    }, 2000);
  }
}


getOnePage()
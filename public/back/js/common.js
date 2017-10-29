/**
 * Created by TYC on 2017/10/29.
 */
//检验用户是否用户登录的功能
console.log(location.href);
if(location.href.indexOf("login.html")<0){
  $.ajax({
    type: "get",
    url: "/employee/checkRootLogin",
    success: function (data) {
      // console.log(data);
      if(data.error===400){
        location.href="login.html";
      }
    }
  })
}

//功能一 进度条  插件NProgress
$(function () {
  $(document).ajaxStart(function () {
    NProgress.start();
  })
  $(document).ajaxStop(function () {
    setTimeout(function () {
      NProgress.done();
    }, 500)
  })
})

//功能二  点击分类显示二级分类
$(function () {
  var $category = $(".category")
  var $children = $category.children(".children")
  $category.on("click", function () {
    // console.log(1);
    $children.toggle();
  })
})

//功能三 点击menu隐藏或者显示侧边栏
$(function () {
  var $header_more = $(".header_more");
  var $aside = $(".lt_aside");
  var $header = $(".lt_header");
  $header_more.on("click", function () {
    $aside.toggleClass("now");
    $header.toggleClass("now");
  })
})

//功能四 退出功能 模态框
$(function () {
  
  var logout = $(".header_logout");
  var $conform_logout = $(".conform_logout");
  logout.on("click", function () {
    $('#myModal').modal();
  })
  $conform_logout.on("click", function () {
    console.log(1);
    $.ajax({
      type: "get",
      url: "/employee/employeeLogout",
      success: function (data) {
        // console.log(data);
        if(data.success){
          location.href="login.html";
        }
      }
    })
  })
  
})


/**
 * Created by TYC on 2017/10/30.
 */

$(function () {
  
  
  //发送ajax请求，获取后台的数据
  var currentPage = 1;
  var pageSize = 8;
  
  
  //去后台获取数据，拿的currentPage页的数据
  function render() {
    $.ajax({
      type: "get",
      url: "/user/queryUser",
      data: {
        page: currentPage,
        pageSize: pageSize
      },
      success: function (data) {
        console.log(data);
        var html = template("tpl", data);
        $("tbody").html(html);
        
        
        //分页功能
        $("#paginator").bootstrapPaginator({
          bootstrapMajorVersion: 3,//指定bootstrap的版本
          currentPage: currentPage,//指定了当前是第几页
          size: "small",
          totalPages: Math.ceil(data.total / pageSize),
          onPageClicked: function (event, originalEvent, type, page) {
            //为按钮绑定点击事件 page:当前点击的按钮值
            currentPage = page;
            render();
          }
          
        });
        
      }
    });
  }
  
  render();
  
  
  //事件委托 给tbody的按钮添加点击事件
  $("tbody").on("click", ".btn", function () {
    // console.log(1);
    $("#userModal").modal("show");
    //知道点击的用户id和状态  才能根据这两个值去发送ajax请求
    var id = $(this).parent().data("id");
    // console.log(id);
    var isDelete = $(this).parent().data("isDelete");
    isDelete = isDelete === 1 ? 0 : 1;
    // console.log(isDelete);
    //区分是哪一条用户的按钮 所以写在事件委托里 所以首先得先把之前的事件绑定解开 再绑定 就不会造成重复绑定的情况
    $(".cateStatue").off().on("click", function () {
      // console.log(1);
      $.ajax({
        type: "post",
        url: "/user/updateUser",
        data: {
          id: id,
          isDelete: isDelete
        },
        success: function (data) {
          // console.log(data);
          // $("#userModal").modal("hidden");
          if (data.success) {
            $("#userModal").modal("hide");
            render();
          }
        }
      })
    })
  })
  
  

  
  
});

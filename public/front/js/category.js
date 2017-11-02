/**
 * Created by TYC on 2017/11/1.
 */
var scrollMui=mui('.mui-scroll-wrapper').scroll({
  indicators: false
});


$.ajax({
  type: "get",
  url: "/category/queryTopCategory",
  success: function (data) {
    console.log(data);
    $(".lt_cate ul").html(template("tpl", data));
    renderSecond(data.rows[0].id)
  }
})
// console.log($(".category"));
$(".lt_cate ul").on("click", "li",function () {
  
  $(this).addClass("now").siblings().removeClass("now");
  scrollMui[1].scrollTo(0,0,500);
  renderSecond($(this).data("id"));
  
})

function renderSecond(id) {
  $.ajax({
    type: "get",
    url: "/category/querySecondCategory",
    data: {
      id: id
    },
    success: function (data) {
      console.log(data);
      $(".lt_brand ul").html(template("tpl2",data));
    }
  })
}



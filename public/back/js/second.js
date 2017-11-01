/**
 * Created by TYC on 2017/10/31.
 */
$(function () {
  var currentPage = 1;
  var pageSize = 5;
  
  function render() {
    $.ajax({
      type: "get",
      url: "/category/querySecondCategoryPaging",
      data: {
        page: currentPage,
        pageSize: pageSize
      },
      success: function (data) {
        // console.log(data);
        $("tbody").html(template("tpl", data));
        $("#paginator").bootstrapPaginator({
          bootstrapMajorVersion: 3,//默认是2，如果是bootstrap3版本，这个参数必填
          currentPage: currentPage,//当前页
          totalPages: Math.ceil(data.total / pageSize),//总页数
          size: "small",//设置控件的大小，mini, small, normal,large
          onPageClicked: function (event, originalEvent, type, page) {
            //为按钮绑定点击事件 page:当前点击的按钮值
            currentPage = page;
            render();  //重新渲染一次
          }
        });
      }
    })
  }
  
  render();
  
  $(".addbtn").on("click",function () {
      $("#addModal").modal("show");
    $.ajax({
      type:"get",
      url:"/category/queryTopCategoryPaging",
      data:{
        page:1,
        pageSize:100
      },
      success:function (data) {
        // console.log(data);
        $(".dropdown-menu").html(template("tpl2",data));
      
      }
    })
  });
  $(".dropdown-menu").on("click","a",function () {
    $("#dropdownMenu1").text($(this).text());
    // console.log($(this).data("id"));
    $("#categoryId").val($(this).data("id"));
    $("#form").data("bootstrapValidator").updateStatus("categoryId", "VALID");
  })
  //初始文件上传
  $("#fileupload").fileupload({
    dataType:"json",
    //当文件上传成功时，会执行这个回调函数
    done:function (e, data) {
      //获取文件上传结果
      //给默认图片设置src
      $(".img_box img").attr("src", data.result.picAddr);
      $("#brandLogo").val( data.result.picAddr );
      $form.data("bootstrapValidator").updateStatus("brandLogo", "VALID");
    }
  });
  
  
  //表单校验
  var $form = $("#form");
  $form.bootstrapValidator({
    //默认不校验的配置
    excluded:[],
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    fields:{
      categoryId:{
        validators:{
          notEmpty:{
            message:"请选择一级分类"
          }
        }
      },
      brandName:{
        validators:{
          notEmpty:{
            message:"请输入二级分类的名称"
          }
        }
      },
      brandLogo:{
        validators:{
          notEmpty:{
            message:"请上传图片"
          }
        }
      }
    }
  });
  
  $form.on("success.form.bv", function (e) {
    e.preventDefault();
    
    //发送ajax请求，把二级分类存起来
    $.ajax({
      
      type:"post",
      url:"/category/addSecondCategory",
      data:$form.serialize(),
      success:function (data) {
        if(data.success){
          
          //成功的操作
          //1. 关闭模态框
          $("#addModal").modal("hide");
          //2. 渲染第一页
          currentPage = 1;
          render();
          //3. 重置表单
          $form[0].reset();
          $form.data("bootstrapValidator").resetForm();
          //手动把dropdown重置，把图片的地址重置
          $(".dropdown-text").text("请选择一级分类");
          $(".img_box img").attr("src", "images/none.png");
        }
      }
    });
  })
})
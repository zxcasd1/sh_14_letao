/**
 * Created by TYC on 2017/10/31.
 */
$(function () {
  var currentPage = 1;
  var pageSize = 5;
  
  function render() {
    $.ajax({
      type: "get",
      url: "/category/queryTopCategoryPaging",
      data: {
        page: currentPage,
        pageSize: pageSize
      },
      success: function (data) {
        console.log(data);
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
  
  //添加新分类的功能
  $(".addbtn").on("click",function () {
    
    // console.log(1);
    //使模态框显示
    $("#cateModal").modal("show");
   
    // console.log($("#form"));
   
  });
  
  //给表单做校验
  var $form = $("#form");
  $form.bootstrapValidator({
    //校验时使用的图标
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    fields:{
      
      //name属性
      categoryName:{
        validators:{
          notEmpty:{
            message:"一级分类名称不能为空"
          }
        }
      }
      
    }
  });
  
  $form.on("success.form.bv", function (e) {
    e.preventDefault();
    
    //要发送ajax请求
    $.ajax({
      type:"post",
      url:"/category/addTopCategory",
      data:$form.serialize(),
      success:function (data) {
        if(data.success){
          
          //成功了，需要做什么?
          //1. 关闭模态框
          $("#cateModal").modal("hide");
          //2. 重新渲染第一页
          currentPage = 1;
          render();
          
          //3. 重置表单
          $form.data("bootstrapValidator").resetForm();
          //表单有一个reset方法，会把表单中所有的值都清空,js对象的方法
          $form[0].reset();
          
        }
      }
    });
  });
  
  
  
  
  
  
  // //表单校验功能
  // $("#form").bootstrapValidator({
  //   //1. 指定不校验的类型，默认为[':disabled', ':hidden', ':not(:visible)'],可以不设置
  //   excluded: [':disabled', ':hidden', ':not(:visible)'],
  //
  //   //2. 指定校验时的图标显示，默认是bootstrap风格
  //   feedbackIcons: {
  //     valid: 'glyphicon glyphicon-ok',
  //     invalid: 'glyphicon glyphicon-remove',
  //     validating: 'glyphicon glyphicon-refresh'
  //   },
  //
  //   //3. 指定校验字段
  //   fields: {
  //     //校验用户名，对应name表单的name属性
  //     categoryName: {
  //       validators: {
  //         //不能为空
  //         notEmpty: {
  //           message: '用户名不能为空'
  //         }
  //       }
  //     }
  //   }
  //
  // });
  // var validator = $('#form').data('bootstrapValidator');  //获取表单校验实例
  //
  // $("#form").on("success.form.bv",function (e) {
  //   e.preventDefault();
  //   $.ajax({
  //     type:"post",
  //     url:"/category/addTopCategory",
  //     data:$("#form").serialize(),
  //     success:function (data) {
  //       // console.log(data);
  //       if(data.success){
  //         $("#cateModal").modal("hide");
  //         currentPage=1;
  //         render();
  //         $("#form")[0].reset();
  //       }
  //     }
  //   })
  // });
})
/**
 * Created by TYC on 2017/10/31.
 */
$(function () {
  var currentPage = 1;
  var pageSize = 5;
  
  function render() {
    $.ajax({
      type: "get",
      url: "/product/queryProductDetailList",
      data: {
        page: currentPage,
        pageSize: pageSize
      },
      success: function (data) {
        console.log(data);
        $("tbody").html(template("tpl1", data));
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
      $("#cateModal").modal("show");
    $.ajax({
      type:"get",
      url:"/category/querySecondCategoryPaging",
      data:{
        page:1,
       pageSize:100
      },
      success:function (data) {
        console.log(data);
        $(".dropdown-menu").html( template("tpl",data) );
        
      }
    })
  })
  
  //表单校验
  var $form=$("#form");
  $form.bootstrapValidator({
    //1. 指定不校验的类型，默认为[':disabled', ':hidden', ':not(:visible)'],可以不设置
    excluded: [],
  
    //2. 指定校验时的图标显示，默认是bootstrap风格
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
  
    //3. 指定校验字段
    fields: {
      //校验用户名，对应name表单的name属性
      brandId: {
        validators: {
          //不能为空
          notEmpty: {
            message: '一级分类必选'
          },
        }
      },
      proName: {
        validators: {
          //不能为空
          notEmpty: {
            message: '二级分类名称必填'
          },
        }
      },
      proDesc: {
        validators: {
          //不能为空
          notEmpty: {
            message: '商品描述必填'
          },
        }
      },
      num: {
        validators: {
          //不能为空
          notEmpty: {
            message: '商品库存必填'
          },
        }
      },
      size: {
        validators: {
          //不能为空
          notEmpty: {
            message: '商品尺寸必填'
          },
          regexp: {
            regexp: /^\d{2}-\d{2}$/,
            message: '商品尺寸必须为33-55'
          }
        }
      },
      oldPrice: {
        validators: {
          //不能为空
          notEmpty: {
            message: '商品原价必填'
          },
        }
      },
      price: {
        validators: {
          //不能为空
          notEmpty: {
            message: '商品现价必填'
          },
        }
      },
      brandLogo: {
        validators: {
          //不能为空
          notEmpty: {
            message: '商品图片必选'
          },
        }
      },
      
    }
  
  })
  
  $(".dropdown-menu").on("click","a",function () {
    // console.log(1);
    $(".dropdown-text").text($(this).text());
    $("#brandId").val($(this).data("id"));
    
  })
  //初始化图片上传
  var imgArr=[];
  $("#fileupload").fileupload({
    dataType:"json",
    done:function (e,data) {
      console.log(data);
      $(".img_box").append("<img src="+data.result.picAddr+" width='100' height='100 '>");
      imgArr.push(data.result);
      if(imgArr.length===3){
        validator.updateStatus("brandLogo","VALID");
      }else{
        validator.updateStatus("brandLogo","INVALID");
      }
    }
  })
  var validator=$form.data("bootstrapValidator").resetForm();
  $form.on('success.form.bv', function (e) {
    e.preventDefault();
    
    
    //使用ajax提交逻辑
    var param=$form.serialize();
    param += "&picName1="+imgArr[0].picName+"&picAddr1="+imgArr[0].picAddr;
    param += "&picName2="+imgArr[1].picName+"&picAddr2="+imgArr[1].picAddr;
    param += "&picName3="+imgArr[2].picName+"&picAddr3="+imgArr[2].picAddr;
  
    $.ajax({
      type:"post",
      url:"/product/addProduct",
      data:param,
      success:function (data) {
         console.log(data);
        if(data.success){
          $("#cateModal").modal("hide");
          currentPage=1;
          render();
          //重置表单样式
          $form[0].reset();
          validator.resetForm();
  
          $(".dropdown-text").text("请选择二级分类");
          $(".img_box img").remove();
          imgArr = [];
        }
      }
    })
  });
})
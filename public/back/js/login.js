/**
 * Created by TYC on 2017/10/29.
 */
$(function () {
  var $form = $("#form");
  //使用表单校验插件
  //使用表单校验插件
  $form.bootstrapValidator({
    //1. 指定不校验的类型，默认为[':disabled', ':hidden', ':not(:visible)'],可以不设置
    excluded: [':disabled', ':hidden', ':not(:visible)'],
    
    //2. 指定校验时的图标显示，默认是bootstrap风格
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    
    //3. 指定校验字段
    fields: {
      //校验用户名，对应name表单的name属性
      username: {
        validators: {
          //不能为空
          notEmpty: {
            message: '用户名不能为空'
          },
          callback:{
            message: '用户名错误'
          }
          
        }
      },
      password: {
        validators: {
          //不能为空
          notEmpty: {
            message: '密码不能为空'
          },
          //长度校验
          stringLength: {
            min: 6,
            max: 12,
            message: '用户名长度必须在6到12之间'
          },
          callback:{
            message: '密码错误'
          }
        }
      }
    }
    
  });
  var validator = $form.data('bootstrapValidator');  //获取表单校验实例
  
 
  $form.on('success.form.bv', function (e) {
    e.preventDefault();
    //使用ajax提交逻辑
    $.ajax({
      type: "post",
      url: "/employee/employeeLogin",
      data: $form.serialize(),
      success: function (data) {
        // console.log(data);
        if(data.success){
          location.href="index.html";
        }else{
          if(data.error===1000){
            validator.updateStatus("username", "INVALID", "callback");
          }
          if(data.error===1001){
            validator.updateStatus("password", "INVALID", "callback");
          }
        }
      }
    })
  });
  //重置表单状态
  $("[type='reset']").on("click",function () {
    validator.resetForm();
    // console.log(1);
  })
  
  
});
webpackJsonp([2],{21:function(e,n,s){"use strict";s(2),s(22),s(23)},22:function(e,n){},23:function(e,n,s){"use strict";(function(e){e(document).ready(function(){e(".wx-chat").on("click",function(){e("#form").addClass("on"),e(".code-qq").removeClass("on"),e(".wx-chat > img").attr("src","../static/images/login_wechat_selected.png"),e(".p-word > img").attr("src","../static/images/login_account.png")}),e(".p-word").on("click",function(){e(".code-qq").addClass("on"),e("#form").removeClass("on"),e(".wx-chat > img").attr("src","../static/images/login_wechat.png"),e(".p-word > img").attr("src","../static/images/login_account_selected.png")}),e("#form-input").bootstrapValidator({message:"This value is not valid",excluded:":disabled",feedbackIcons:{valid:"iconfont icon-zhengque",invalid:"iconfont icon-cuowu",validating:"iconfont icon-cuowu"},fields:{username:{message:"用户名不能为空",validators:{notEmpty:{message:"用户名必填不能为空"},stringLength:{min:2,max:30,message:"用户名长度不能小于2位或超过30位"},regexp:{regexp:/^[a-zA-Z0-9_\.\u4e00-\u9fa5]+$/,message:"用户名只能由字母、数字、点和下划线组成。"}}},password:{message:"请输入密码",validators:{notEmpty:{message:"密码不能为空！"},stringLength:{min:6,max:30,message:"密码长度不能小于6位或超过30位"},regexp:{regexp:/^[a-zA-Z0-9_\.]+$/,message:"密码只能由字母、数字和下划线。"}}}}}).on("submit",function(e,n){console.log(e)})})}).call(n,s(0))}},[21]);
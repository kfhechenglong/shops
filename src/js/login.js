// 引入二维码生成器
$(document).ready(function(){
    $('.wx-chat').on('click',function(){
        $('#form').addClass('on');
        $('.code-qq').removeClass('on');
        $('.wx-chat > img').attr('src', '../static/images/login_wechat_selected.png');
        $('.p-word > img').attr('src', '../static/images/login_account.png');
    })
    $('.p-word').on('click',function(){
        $('.code-qq').addClass('on');
        $('#form').removeClass('on');
        $('.wx-chat > img').attr('src', '../static/images/login_wechat.png');
        $('.p-word > img').attr('src', '../static/images/login_account_selected.png');
        
    })
    /* 登录界面表单验证 */
    $('#form-input').bootstrapValidator({
        message: 'This value is not valid',
        //excluded:[":hidden",":disabled",":not(visible)"] ,//bootstrapValidator的默认配置
        excluded: ':disabled',
        feedbackIcons: {
            valid: 'iconfont icon-zhengque',
            invalid: 'iconfont icon-cuowu',
            validating:'iconfont icon-cuowu'
        },
        fields: {
            username: {
                message: '用户名不能为空',//默认提示信息
                validators: {
                    notEmpty: {
                        message: '用户名必填不能为空'
                    },
                    stringLength: {
                        min: 2,
                        max: 30,
                        message: '用户名长度不能小于2位或超过30位'
                    },
                    regexp: {
                        regexp: /^[a-zA-Z0-9_\.\u4e00-\u9fa5]+$/,
                        message: '用户名只能由字母、数字、点和下划线组成。'
                    },
                }
            },
            password:{
                message: '请输入密码',//默认提示信息
                validators: {
                    notEmpty: {
                        message: '密码不能为空！'
                    },
                    stringLength: {
                        min: 6,
                        max: 30,
                        message: '密码长度不能小于6位或超过30位'
                    },
                    regexp: {
                        regexp: /^[a-zA-Z0-9_\.]+$/,
                        message: '密码只能由字母、数字和下划线。'
                    },
                }
            }
        }
    }).on('submit', function (e, data) {
        console.log(e)
    });
})
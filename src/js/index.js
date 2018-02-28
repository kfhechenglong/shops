

"use strict"

// 获取公司信息
$(document).ready(()=>{
    let btn_inner = 'edit';
    // 点击编辑按钮
    $('#edit').on('click',() =>{

        if (btn_inner === 'cancal'){
            $('#edit').text('编辑');
            btn_inner = "edit";
            // 发送ajax请求
            ajax('url',{}).then((res) =>{
                console.log(res)
                return res
            });
            // 模板渲染
            $('.list-company').removeClass('on');
            $('.form-company').addClass('on');
            return false;
        }
        $('#edit').text('取消');
        btn_inner = "cancal";
        $('.list-company').addClass('on');
        $('.form-company').removeClass('on');
    })
})
'use strict'
// 检查是否登录
ajax(Api('getCompanyInfo')).then((res) => {
    let html = "";
    // 添加头像信息
    $('#header-info img').attr('src', res.data.headimg);
    $('#header-info .suerName').text(res.data.nickname);
});

"use strict"

// 获取公司信息
const getCompanyInfo = (url,params,type = 'post',header = {

}) =>{
    return new Promise((resolve,reject) => {
        $.ajax({
            type:type,
            url:url,
            dataType:'JSON',
            data: params,
            headers: header,
            success: function (msg) {
                resolev("Data Saved: " + msg);
            },
            error :reject('请求出错！'),
        })
    })
}
module.exports = {
    ajax: getCompanyInfo
}
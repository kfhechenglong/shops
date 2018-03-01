
"use strict"
// 定义api
const api = (type, params)=>{
    const apiList = {
        "getCompanyInfo":"getcompany",
        "updateCompanyInfo":"updatecompany",
        "addEmp":"addemp",
        "getEmpList":"getemplist",
        "updateEmp":"updateemp",
        "deletEmp":"delemp",
        "addStore":"addstore",
        "getStoreList":"getstorelist",
        "gudateStore":"updatestore",
        "deletStore":"delstore",
    };
    return { type: apiList[type], data: params};
}
// 定义ajax
const getCompanyInfo = (params,type = 'post',header = {
    // 'Cookie' : PHPSESSID=gia91nkqlca56mfm2ae0nnrtn0
}) =>{
    console.log(params)
    return new Promise((resolve,reject) => {
        $.ajax({
            type:type,
            url: `https://nx.smsc.net.cn/wxopen/app/shop/admin.php/`,
            dataType:'JSON',
            data: params,
            // headers: header,
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            success: function (msg) {
                if(msg.code === 200){
                    resolve(msg);
                }
                reject('请求失败！code !==200')
            },
            error :function(err){
                reject(err)
            },
        })
    }).catch((err) => {
        console.error('请求出错！',err);
    })
}
module.exports = {
    ajax: getCompanyInfo,
    api:api
}
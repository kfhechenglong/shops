
"use strict"
// 定义api
import Cookie from './checkCookie.js'
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
        "addCustomer":"addcustomer",
        "updateCustomer":"updatecustomer",
        "getCustomerList":"getcustomerlist",
    };
    return { type: apiList[type], data: params};
}
// 定义ajax
const getCompanyInfo = (params,myurl = 'https://nx.smsc.net.cn/wxopen/app/shop/admin.php/',type = 'post',header = {
}) =>{
    console.log(params)
    //判断是否为登录状态
    Cookie.getCookie();
    return new Promise((resolve,reject) => {
        $.ajax({
            type:type,
            url: myurl,
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
                reject('请求失败！code !==200');
            },
            error :function(err){
                reject(err)
            },
            complete:function (e) {
                
            }
        })
    }).catch((err) => {
        console.error('请求出错！',err);
    })
}
module.exports = {
    ajax: getCompanyInfo,
    api:api
}
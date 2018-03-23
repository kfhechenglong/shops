
"use strict"
// 定义api
const apiobj = (type, params)=>{
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
        "saveWeekTime":"weektime",
        "getWeekTime":"getweektime",
        'saveDayTime':"addday",
        "getDayTime":"getdays",
        "clearCode":'clear',
        "getRoles":"getroles",
        "getStore":"getstore",
        "getEmp":"getemp",
        "setRestDays":"setrestdays",
        "getRestDays":"getrestdays",
        "getCustomerQrcode":"getcustomerqrcode",
        "workTime":"worktime",
        "getEmpQrcode":"getempqrcode",
        "clearBindEmp":"clearbindemp",
        "storeBlock":"storeblock",
        "empBlock":"empblock"
    };
    return { type: apiList[type], data: params};
}
// 定义ajax
let base = `https://nx.smsc.net.cn/wxopen/app/shop`;
if (process.env.NODE_ENV === 'development') {
    base = '/api';
}
// const base = 'https://nx.smsc.net.cn/wxopen/app/shop/admin.php/';
const getCompanyInfo = (params, myurl = `${base}/admin.php/`,type = 'post',header = {
}) =>{
    console.log(params)
    //判断是否为登录状态
    const loginPath  = () =>{
        const path = window.document.location.href;
        const arr = path.split('/');
        arr.pop();
        arr.push('login.html');
        window.location.href = arr.join('/');
    }
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
                console.log(msg)
                if(msg.code === 200){
                    if (params === 'loginout'){
                        loginPath();
                    }
                    resolve(msg);
                } else if(msg.code === 101) {
                    if (params === 'checksession'){
                        console.log('未登录！')
                        loginPath();
                    }else{
                        alert('用户未登录！')
                        reject('用户未登录！code ===101');
                    }
                } else{
                    reject('请求失败！code !==200');
                }
            },
            error :function(err){
                reject(err)
            },
            complete:function (e) {
                
            }
        })
    }).catch((err) => {
        // alert(err);
        console.error(err);
    })
}
module.exports = {
    ajax: getCompanyInfo,
    api:apiobj
}
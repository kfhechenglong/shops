
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
        "getEmp":"getemp"
    };
    return { type: apiList[type], data: params};
}
// 定义ajax
const getCompanyInfo = (params,myurl = 'https://nx.smsc.net.cn/wxopen/app/shop/admin.php/',type = 'post',header = {
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
                layer.close(layer.index)
                if(msg.code === 200){
                    console.log(msg)
                    if (params === 'loginout'){
                        loginPath();
                    }
                    resolve(msg);
                } else if(msg.code === 101) {
                    if (params === 'checksession'){
                        loginPath();
                    }else{
                        alert('用户未登录，请重新登录！')
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
    api:api
}
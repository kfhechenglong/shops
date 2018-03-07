
"use strict"

// 获取cookie 检查是否登录
const getCookie = (name = 'PHPSESSID') =>{
    var aCookie = document.cookie.split("; ");
    for (var i = 0; i < aCookie.length; i++) {
        var aCrumb = aCookie[i].split("=");
        if (name == aCrumb[0]){
            console.log(unescape(aCrumb[1]));
        }else{
            // 未登录或登录失效
            
            const path = window.document.location.href;
            const arr = path.split('/');
            arr.pop();
            arr.push('login.html');
            window.location.href = arr.join('/');
        } 
    }
    return null;
}
module.exports = {
    getCookie
}
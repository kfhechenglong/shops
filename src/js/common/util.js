
const Layer = require('../../../static/plugins/layer/layer.min.js')

"use strict"

// 清除表格内容
const clearFormContent = (ele) => {
    console.log('清除')
    $(':input', ele).not(':button, :submit, :reset, :hidden').val('').removeAttr('checked').removeAttr('selected');
}
const validatorOptions = {
    live: 'disabled',
    excluded: [':disabled', ':hidden', ':not(:visible)'],
    feedbackIcons: {//根据验证结果显示的各种图标  
        valid: 'iconfont icon-zhengque',
        invalid: 'iconfont icon-cuowu',
        validating: 'iconfont icon-cuowu'
    }
};
const validatorName = (name) => {
    return {
        validators: {
            notEmpty: {
                message: `${name}不能为空`
            },
            stringLength: {
                min: 2,
                max: 10,
                message: `${name}长度不能小于2位或超过10位`
            },
            regexp: {
                regexp: /^[A-Za-z\u4e00-\u9fa5]+$/,
                message: `${name}只能由字母和汉字组成。`
            },
        }
    }
};
const validatorPass = () => {
    return {
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
};
const validatorContact = () => {
    return {
        validators: {
            notEmpty: {
                message: '联系方式不能为空！'
            },
            regexp: {
                regexp: /^[0-9]+$/,
                message: '只能是数字！'
            }
        }
    }
};


// 弹框提示
const layer = (msgs, icon = 5,times = 2000) => {
    Layer.msg(msgs, { icon: icon, time: times });
};
const layer_confirm = (msg,callback,btn1 = '取消' ,btn2 = '删除') => {
    Layer.confirm(msg, {
        title :'提示',
        btn: [btn1, btn2] //按钮
    }, function () {
        // 取消按钮
        layer(btn1);
    }, function () {
        // 确定按钮
        typeof callback === 'function' ?  callback() : '';
    });
};
// 检测数据类型
const checkType = (obj,type) => {
    return Object.prototype.toString.call(obj) === `[object ${type}]`
}
// addhtml
const addHtml = (ele,html,isSelect = false) => {
    ele.empty();
    ele.append(html);
    if (isSelect){
        let select_opts = {
            iconBase: 'iconfont icon-jiantou',
            tickIcon: 'iconfont icon-zhengque'
        }
        ele.selectpicker(select_opts);
    }
    
    return Promise.resolve('成功')
}
const getList = (url, arr) =>{
    return ajax(Api(url)).then((res) => {
        if (res.data) {
            return Promise.resolve(res.data)
        } else {
            // 获取员工类型错误
            layer('获取错误！', 2);
        }
    })
}
// 定义绑定角色的列表html
const creatHtml1 = (text, ele) => {
    let html = `
        <li class="clearfix" style="line-height:30px;">
            <div class="fl"> 
                <span style="font-weight: bold;" class="name" data-store="${ele.id}">${ele.name}：</span>
            </div>
            <div class="fl"> 
         `;
    return html;
};
const creatHtmlSpan = (ele,flag,classname = '' ,classname2='icon-weixuanze') => {
    let html = '';
    if (flag){
        html = `
        <span data-roles="${ele.id}" class="roles cursor ${classname}" style="display:inline-block;"><i class="iconfont ${classname2}"></i> ${ele.name}</span>`;
    }else{
        html = `
        <span data-roles="${ele.id}" class="roles" style="display:inline-block;margin:0 3px;">${ele.name}</span>`;
    }
    return html;
};
const creatHtmlBtn = (dataid, id) => {
    return `</div><button data-store="${dataid}" type="button" id="${id}" class="btn btn-danger fr"><i class="iconfont icon-shanchu3"></i></button></li>`
};
// 获取select
const getSelectList = (options) => {
    return Promise.all([getList(options.url1), getList(options.url2)])
};
const toggleClassName = (target) => {
    target.children('i').toggleClass('icon-weixuanze');
    target.children('i').toggleClass('icon-yixuanze');
    target.toggleClass('checked');
};
// 获取select
const setRenderSelectList = (options,res,checkStoreId) =>{
    let optHtml1 = '';
    for (let i = 0; i < res[1].length; i++) {
        const ele = res[1][i];
        optHtml1 += `<li class="fl store-item" data-id="${ele.id}"><i class="iconfont icon-weixuanze"></i> <span>${ele.name}</span></li>`;
    }
    addHtml($(options.store), optHtml1);
    $('.store-item').on('click', function () {
        // 获取店铺名称
        const target = $(this);
        const storeId = target.attr('data-id');
        if (!storeId) {
            layer(`请选择${options.text}`, 2)
            return false
        }
        toggleClassName(target);
        if (checkStoreId.has(storeId)) {
            // layer(`该${options.text}已添加！`, 2)
            const btn = $(options.warp).find('button');
            for (let i = 0; i < btn.length; i++) {
                const ele = btn[i];
                if ($(ele).attr('data-store') == storeId){
                    $(ele).parent().remove();
                }
            }
            checkStoreId.delete(storeId);
            return false;
        }
        checkStoreId.add(storeId);
        // 添加店铺
        let htmlLi = ``;
        for (let i = 0; i < res[1].length; i++) {
            const ele = res[1][i];
            if (storeId == ele.id) {
                htmlLi += creatHtml1(options.text, ele);
                break;
            }
        }
        for (let i = 0; i < res[0].length; i++) {
            const ele = res[0][i];
            htmlLi += creatHtmlSpan(ele,true);
        }
        htmlLi += creatHtmlBtn(storeId, options.dele_list);
        $(options.warpul).append(htmlLi);
    })
    // 绑定角色事件 
    $(options.warp).on('click', '.roles',function(){
        const target = $(this);
        toggleClassName(target);
    })
    // 绑定删除事件
    $(options.warp).on('click', '#' + options.dele_list, function () {
        const id = $(this).attr('data-store');
        checkStoreId.delete(id);
        $(this).parent().remove();
    })
}
// 获取值
const getSelectedValue = (ele = '#bind-store1 ul li', key = 'storeId', name = '门店') => {
    const lis = $(ele);
    const typeArr = [];
    if (lis.length > 0) {
        for (let i = 0; i < lis.length; i++) {
            const li_ele = lis[i];
            const store_id = $(li_ele).find('.name').attr('data-store');
            const roles_span = $(li_ele).find('.roles');
            const roles_id = [];
            for (let j = 0; j < roles_span.length; j++) {
                const span = roles_span[j];
                if ($(span).hasClass('checked')){
                    roles_id.push($(span).attr('data-roles'));
                }
            }
            if (roles_id.length === 0){
                layer(`存在未绑定角色的${name}！`,2);
                return false;
            }
            const obj = {rolesId: roles_id };
            obj[key] = store_id
            typeArr.push(obj);
        }
    }
    return typeArr;
};
// 删除列表
const deletList = (url, callback,opt,params) => {
    const delet = () => {
        ajax(Api(url, opt)).
            then((res) => {
                if (res.code === 200) {
                    // 删除成功
                    layer('操作成功！', 1);
                    // 更新界面信息
                    callback(params);
                } else {
                    layer('操作失败！', 5);
                }
            })
    }
    return layer_confirm('是否操作所选！', delet,'取消','确定');
};
// 检查是否登录
const checkLogin = () => {
    let base = `https://nx.smsc.net.cn/wxopen/app/shop`;
    if (process.env.NODE_ENV === 'development'){
        base = '/api';
    }
    return new Promise((resolve, reject) => {
        ajax('checksession', `${base}/checksession.php/`).then((res) => {
            console.log('登录成功状态！');
            resolve('登录成功！')
        });
    })
};
// 获取用户头像
const getUserInfo = ()=>{
    ajax(Api('getCompanyInfo')).then((res) => {
        // 添加头像信息
        $('#header-info img').attr('src', res.data.headimg);
        $('#header-info .suerName').text(res.data.nickname);
    });
};
// 渲染员工和门店角色列表
// render td html
const renderTd = (roles,list,type,id_type) =>{
    let html = '';
    if (roles.length > 0) {
        for (let j = 0; j < roles.length; j++) {
            const item = roles[j];
            for (let k = 0; k < list[1].length; k++) {
                const store = list[1][k];
                if (store.id == item[id_type]) {
                    html += creatHtml1(type, { id: store.id, name: store.name });
                    break;
                }
            }
            if (item[id_type] && item.roleids) {
                for (let k = 0; k < item.roleids.length; k++) {
                    const rolesEle = item.roleids[k];
                    for (let m = 0; m < list[0].length; m++) {
                        const roles_ele = list[0][m];
                        if (rolesEle == roles_ele.id) {
                            html += creatHtmlSpan({ id: roles_ele.id, name: roles_ele.name });
                            break;
                        }
                    }
                }
            }
        }
        html += `</li>`;
    }
    return html;
};
const toggleClass = (lis) => {
    for (let j = 0; j < lis.length; j++) {
        const element = lis[j];
        $(element).removeClass('checked');
        $(element).children('i').addClass('icon-weixuanze');
        $(element).children('i').removeClass('icon-yixuanze');
    }
};
const restClassName = (lis,id) => {
    for (let j = 0; j < lis.length; j++) {
        const element = lis[j];
        if ($(element).attr('data-id') == id) {
            $(element).addClass('checked');
            $(element).children('i').removeClass('icon-weixuanze');
            $(element).children('i').addClass('icon-yixuanze');
            break;
        }
    }
};
const addClass = (lis)=>{
    lis.addClass('checked');
    lis.children('i').removeClass('icon-weixuanze');
    lis.children('i').addClass('icon-yixuanze');
}
const  fmtDate = (a) => {
    var date = new Date(a);
    var y = 1900 + date.getYear();
    var m = "0" + (date.getMonth() + 1);
    var d = "0" + date.getDate();
    return y + "-" + m.substring(m.length - 2, m.length) + "-" + d.substring(d.length - 2, d.length);
};
module.exports = {
    fmtDate,
    toggleClass,
    addClass,
    restClassName,
    toggleClassName,
    clearFormContent,
    myLayer:layer,
    myLayerTips: layer_confirm,
    validatorOptions,
    checkType,
    addHtml,
    getSelectList,
    setRenderSelectList,
    getSelectedValue,
    deletList,
    creatHtml1,
    creatHtmlSpan,
    creatHtmlBtn,
    checkLogin,
    getUserInfo,
    renderTd,
    validatorContact,
    validatorPass,
    validatorName
}
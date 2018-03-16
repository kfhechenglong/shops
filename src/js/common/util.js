
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
/* 
切换按钮
 */
const toggle = (target, ele1, ele2,options,flag ,text = "编辑") => {
    let btn_inner = "edit";
    target.on('click', () => {
        if (btn_inner === 'cancal') {
            // ele2[0].reset();
            flag ? (flag.edit = true) :'';
            // 点击取消时，清空表单内容
            console.log('取消')
            clearFormContent(ele2)
            // console.log(ele2.data('bootstrapValidator'))
            // 清除表单验证
            ele2.data('bootstrapValidator').destroy();
            ele2.data('bootstrapValidator', null); 
            target.text(text);
            btn_inner = "edit";
            // 模板渲染
            ele1.show();
            ele2.hide();
        } else{
            // console.log(options);
            // 初始化表单验证
            ele2.bootstrapValidator(options)
            target.text('取消');
            btn_inner = "cancal";
            ele1.hide();
            ele2.show();
        }
        
    });
    
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
// {
//     url1: 'getRoles',
//     url2: 'getEmpList',
//     store: '#select-store-id',
//         roles: '#select-store-roles',
//             add_list: '#add-store-soles-2',
//                 dele_list: 'delet-store-soles-list',
//                     warpul: '#bind-em-roles ul',
//                         warp: '#bind-em-roles',
//                             text: '店铺'
// }
// 获取select
const getSelectList = (options,checkStoreId) => {
    return Promise.all([getList(options.url1), getList(options.url2)]).then((res) => {
        let optHtml1 = '';
        for (let i = 0; i < res[1].length; i++) {
            const ele = res[1][i];
            optHtml1 += `<option value="${ele.id}">${ele.name}</option>`
        }
        addHtml($(options.store), optHtml1);
        let optHtml2 = '';
        for (let i = 0; i < res[0].length; i++) {
            const ele = res[0][i];
            optHtml2 += `<option value="${ele.id}">${ele.name}</option>`
        }
        addHtml($(options.roles), optHtml2, true);
        $(options.add_list).on('click', function () {
            // 获取店铺名称
            const storeId = $(options.store).val();
            const rolesID = $(options.roles).val();
            if (!storeId) {
                layer(`请选择${options.text}`, 2)
                return false
            }
            if (checkStoreId.has(storeId)) {
                layer(`该${options.text}已添加！`, 2)
                return false;
            }
            checkStoreId.add(storeId);
            // 添加店铺
            let htmlLi = ``;
            for (let i = 0; i < res[1].length; i++) {
                const ele = res[1][i];
                if (storeId == ele.id) {
                    htmlLi += `
                            <li class="clearfix" style="line-height:35px;">
                                <div class="fl"> 
                                    <span>${options.text}名：<span>
                                    <span class="name" data-store="${ele.id}">${ele.name}<span>
                                    ————
                                </div>
                                <div class="fl"> 
                                    <span>角色：<span>
                        `;
                    break;
                }
            }
            if (Array.isArray(rolesID)) {
                for (let i = 0; i < res[0].length; i++) {
                    const ele = res[0][i];
                    for (let j = 0; j < rolesID.length; j++) {
                        const ele2 = rolesID[j];
                        if (ele2 == ele.id) {
                            htmlLi += `
                                    <span data-roles="${ele.id}" class="roles">${ele.name}</span> 
                                `;
                            break;
                        }
                    }
                }
            }

            htmlLi += `</div><button data-store="${storeId}" type="button" id="${options.dele_list}" class="btn btn-danger fr"><i class="iconfont icon-shanchu3"></i></button></li>`;
            $(options.warpul).append(htmlLi);
            // 绑定删除事件
            $(options.warp).on('click', '#' + options.dele_list, function () {
                const id = $(this).attr('data-store');
                checkStoreId.delete(id);
                $(this).parent().remove();
            })
        })
    })
};
// 获取值
const getSelectedValue = (ele = '#bind-store ul li') => {
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
                roles_id.push($(span).attr('data-roles'));
            }
            typeArr.push({ storeId: store_id, rolesId: roles_id })
        }
    }
    return typeArr;
}
module.exports = {
    toggle,
    clearFormContent,
    myLayer:layer,
    myLayerTips: layer_confirm,
    validatorOptions,
    checkType,
    addHtml,
    getSelectList,
    getSelectedValue
}